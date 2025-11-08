"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orangeSmsService = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const AppError_1 = require("../../errors/AppError");
const orange_sms_model_1 = require("./orange-sms.model");
class OrangeSmsService {
    constructor() {
        this.accessToken = null;
        this.tokenExpiresAt = 0;
        this.cachedClientId = null;
        this.cachedClientSecret = null;
    }
    async getDisplayConfig() {
        const credential = await orange_sms_model_1.OrangeSmsCredential.findOne().populate('lastUpdatedBy', 'firstName lastName');
        if (!credential) {
            return { hasCredentials: false };
        }
        return {
            hasCredentials: true,
            clientId: credential.clientId,
            senderAddress: credential.senderAddress,
            senderName: credential.senderName,
            countryCode: credential.countryCode || '224',
            hasClientSecret: Boolean(credential.clientSecret),
            lastUpdatedAt: credential.lastUpdatedAt,
            lastUpdatedBy: credential.lastUpdatedBy
                ? {
                    id: credential.lastUpdatedBy?._id?.toString() ?? '',
                    name: `${credential.lastUpdatedBy?.firstName ?? ''} ${credential.lastUpdatedBy?.lastName ?? ''}`.trim(),
                }
                : undefined,
        };
    }
    async updateConfig(payload, userId) {
        let credential = await orange_sms_model_1.OrangeSmsCredential.findOne().select('+clientSecret');
        if (!credential) {
            if (!payload.clientId || !payload.clientSecret) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Client ID and client secret are required for initial Orange SMS configuration');
            }
            credential = new orange_sms_model_1.OrangeSmsCredential({
                clientId: payload.clientId,
                clientSecret: payload.clientSecret,
                senderAddress: payload.senderAddress,
                senderName: payload.senderName,
                countryCode: payload.countryCode || '224',
                lastUpdatedBy: userId ? new mongoose_1.Types.ObjectId(userId) : undefined,
                lastUpdatedAt: new Date(),
            });
        }
        else {
            if (payload.clientId)
                credential.clientId = payload.clientId;
            if (payload.clientSecret)
                credential.clientSecret = payload.clientSecret;
            if (payload.senderAddress !== undefined)
                credential.senderAddress = payload.senderAddress;
            if (payload.senderName !== undefined)
                credential.senderName = payload.senderName;
            if (payload.countryCode)
                credential.countryCode = payload.countryCode;
            credential.lastUpdatedAt = new Date();
            if (userId) {
                credential.lastUpdatedBy = new mongoose_1.Types.ObjectId(userId);
            }
            this.clearCachedToken();
        }
        if (!credential.countryCode) {
            credential.countryCode = '224';
        }
        await credential.save();
        return this.getDisplayConfig();
    }
    async sendSms(params, overrideCredentials) {
        const credential = await orange_sms_model_1.OrangeSmsCredential.findOne().select('+clientSecret');
        if (!credential && !overrideCredentials) {
            throw new AppError_1.AppError(http_status_1.default.PRECONDITION_FAILED, 'Orange SMS credentials are not configured. Please ask a superadmin to configure them.');
        }
        const clientIdToUse = overrideCredentials?.clientId || credential?.clientId;
        const clientSecretToUse = overrideCredentials?.clientSecret || credential?.clientSecret;
        if (!clientIdToUse || !clientSecretToUse) {
            throw new AppError_1.AppError(http_status_1.default.PRECONDITION_FAILED, 'Orange SMS credentials are not configured. Please ask a superadmin to configure them.');
        }
        const countryCode = credential?.countryCode || '224';
        const senderAddress = credential?.senderAddress;
        const senderName = credential?.senderName;
        const accessToken = await this.ensureAccessToken(clientIdToUse, clientSecretToUse, {
            skipCache: Boolean(overrideCredentials),
        });
        const normalizedRecipient = this.normalizeRecipientNumber(params.phoneNumber, countryCode);
        if (!normalizedRecipient) {
            return {
                status: 'failed',
                error: 'Invalid recipient phone number',
            };
        }
        const senderMsisdn = senderAddress
            ? senderAddress.replace(/^\+/, '')
            : `${countryCode}0000`;
        const endpoint = `https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B${senderMsisdn}/requests`;
        const payload = {
            outboundSMSMessageRequest: {
                address: `tel:+${normalizedRecipient}`,
                senderAddress: `tel:+${senderMsisdn}`,
                outboundSMSTextMessage: {
                    message: params.message,
                },
                senderName: params.senderNameOverride || senderName,
            },
        };
        if (!payload.outboundSMSMessageRequest.senderName) {
            delete payload.outboundSMSMessageRequest.senderName;
        }
        const basicPreview = buildBasicAuthPreview(clientIdToUse, clientSecretToUse);
        try {
            const response = await axios_1.default.post(endpoint, payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const resourceUrl = response.data?.outboundSMSMessageRequest?.resourceURL ?? '';
            const parts = resourceUrl.split('/');
            const resourceId = parts.length ? parts[parts.length - 1] : undefined;
            return {
                status: 'sent',
                resourceId,
                metadata: {
                    usedOverride: Boolean(overrideCredentials),
                    clientIdPreview: clientIdToUse.slice(0, 4) + '****',
                    authHeaderPreview: basicPreview,
                },
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                const status = error.response?.status;
                const data = error.response?.data;
                const errorMessage = typeof data === 'string'
                    ? data
                    : data?.error_description ||
                        data?.error ||
                        data?.message ||
                        error.message;
                if (status === 401 || status === 403) {
                    this.clearCachedToken();
                }
                return {
                    status: 'failed',
                    error: errorMessage,
                    metadata: {
                        usedOverride: Boolean(overrideCredentials),
                        clientIdPreview: clientIdToUse.slice(0, 4) + '****',
                        authHeaderPreview: basicPreview,
                    },
                };
            }
            return {
                status: 'failed',
                error: error.message,
                metadata: {
                    usedOverride: Boolean(overrideCredentials),
                    clientIdPreview: clientIdToUse.slice(0, 4) + '****',
                    authHeaderPreview: basicPreview,
                },
            };
        }
    }
    async ensureAccessToken(clientId, clientSecret, options) {
        const now = Date.now();
        if (!options?.skipCache &&
            this.accessToken &&
            now < this.tokenExpiresAt - 30 * 1000 &&
            this.cachedClientId === clientId &&
            this.cachedClientSecret === clientSecret) {
            return this.accessToken;
        }
        const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        try {
            const response = await axios_1.default.post('https://api.orange.com/oauth/v3/token', new URLSearchParams({ grant_type: 'client_credentials' }).toString(), {
                headers: {
                    Authorization: `Basic ${encoded}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
            });
            const token = response.data?.access_token;
            const expiresIn = response.data?.expires_in || 3600;
            if (!token) {
                throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Orange API did not return an access token');
            }
            if (!options?.skipCache) {
                this.accessToken = token;
                this.tokenExpiresAt = Date.now() + expiresIn * 1000;
                this.cachedClientId = clientId;
                this.cachedClientSecret = clientSecret;
            }
            return token;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                const data = error.response?.data;
                const message = typeof data === 'string'
                    ? data
                    : data?.error_description ||
                        data?.error ||
                        data?.message ||
                        error.message;
                throw new AppError_1.AppError(error.response?.status || http_status_1.default.BAD_GATEWAY, `Failed to obtain Orange access token: ${message}`);
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to obtain Orange access token: ${error.message}`);
        }
    }
    normalizeRecipientNumber(phoneNumber, countryCode) {
        if (!phoneNumber) {
            return null;
        }
        const digits = phoneNumber.replace(/[^\d]/g, '');
        if (digits.startsWith(countryCode)) {
            return digits;
        }
        if (digits.startsWith('0')) {
            return `${countryCode}${digits.substring(1)}`;
        }
        if (digits.length === 9 && countryCode === '224') {
            return `${countryCode}${digits}`;
        }
        return digits.length > 0 ? digits : null;
    }
    clearCachedToken() {
        this.accessToken = null;
        this.tokenExpiresAt = 0;
        this.cachedClientId = null;
        this.cachedClientSecret = null;
    }
}
function buildBasicAuthPreview(clientId, clientSecret) {
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    if (encoded.length <= 8) {
        return encoded;
    }
    return `${encoded.slice(0, 4)}…${encoded.slice(-4)}`;
}
exports.orangeSmsService = new OrangeSmsService();
//# sourceMappingURL=orange-sms.service.js.map