interface UpdateOrangeSmsConfigPayload {
    clientId?: string;
    clientSecret?: string;
    senderAddress?: string;
    senderName?: string;
    countryCode?: string;
}
interface DisplayConfig {
    hasCredentials: boolean;
    clientId?: string;
    senderAddress?: string;
    senderName?: string;
    countryCode?: string;
    hasClientSecret?: boolean;
    lastUpdatedAt?: Date;
    lastUpdatedBy?: {
        id: string;
        name: string;
    };
}
interface SendSmsParams {
    phoneNumber: string;
    message: string;
    senderNameOverride?: string;
}
export interface SendSmsResult {
    status: 'sent' | 'failed';
    resourceId?: string;
    error?: string;
    metadata?: {
        usedOverride: boolean;
        clientIdPreview: string;
        authHeaderPreview: string;
    };
}
declare class OrangeSmsService {
    private accessToken;
    private tokenExpiresAt;
    private cachedClientId;
    private cachedClientSecret;
    getDisplayConfig(): Promise<DisplayConfig>;
    updateConfig(payload: UpdateOrangeSmsConfigPayload, userId?: string): Promise<DisplayConfig>;
    sendSms(params: SendSmsParams, overrideCredentials?: {
        clientId: string;
        clientSecret: string;
    }): Promise<SendSmsResult>;
    private ensureAccessToken;
    private normalizeRecipientNumber;
    private clearCachedToken;
}
export declare const orangeSmsService: OrangeSmsService;
export {};
//# sourceMappingURL=orange-sms.service.d.ts.map