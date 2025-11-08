"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountantCredentialsService = void 0;
const user_model_1 = require("../user/user.model");
const accountant_model_1 = require("./accountant.model");
const AppError_1 = require("../../errors/AppError");
const http_status_1 = __importDefault(require("http-status"));
class AccountantCredentialsService {
    static async generateAccountantCredentials(accountantId, firstName, lastName) {
        const username = accountantId.replace(/-/g, '').toLowerCase();
        const password = accountantId;
        return {
            accountantId,
            username,
            password,
            temporaryPassword: true
        };
    }
    static async saveAccountantCredentials(schoolId, credentials) {
        try {
            await user_model_1.User.findOneAndUpdate({ username: credentials.username }, {
                $set: {
                    passwordChangeRequired: true,
                    credentialsGenerated: true,
                    credentialsGeneratedAt: new Date()
                }
            });
        }
        catch (error) {
            console.error('Failed to save accountant credentials:', error);
        }
    }
    static async getAccountantCredentials(accountantId) {
        try {
            const accountant = await accountant_model_1.Accountant.findOne({ accountantId })
                .populate('userId', 'username firstName lastName displayPassword credentialsGenerated passwordChangeRequired');
            if (!accountant || !accountant.userId) {
                return null;
            }
            const user = accountant.userId;
            return {
                credentials: {
                    accountantId,
                    username: user.username,
                    password: user.displayPassword || accountantId,
                    temporaryPassword: user.passwordChangeRequired !== false
                },
                message: user.credentialsGenerated
                    ? 'These are auto-generated credentials. Accountant should change password on first login.'
                    : 'Default credentials based on Accountant ID. Password may have been changed.'
            };
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to retrieve accountant credentials');
        }
    }
    static async resetAccountantPassword(accountantId) {
        try {
            const accountant = await accountant_model_1.Accountant.findOne({ accountantId })
                .populate('userId', 'username displayPassword');
            if (!accountant || !accountant.userId) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Accountant not found');
            }
            const user = accountant.userId;
            const newPassword = user.displayPassword || accountantId;
            await user_model_1.User.findByIdAndUpdate(accountant.userId, {
                $set: {
                    passwordHash: newPassword,
                    passwordChangeRequired: true,
                    passwordResetAt: new Date()
                }
            });
            return {
                credentials: {
                    accountantId,
                    username: user.username,
                    password: newPassword,
                    temporaryPassword: true
                },
                message: 'Password has been reset to the original credentials. Should change password on first login.'
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to reset accountant password');
        }
    }
    static async getSchoolAccountantsCredentials(schoolId) {
        try {
            const accountants = await accountant_model_1.Accountant.find({ schoolId })
                .populate('userId', 'username firstName lastName credentialsGenerated')
                .select('accountantId userId');
            return accountants
                .filter(accountant => accountant.userId && accountant.userId.credentialsGenerated)
                .map(accountant => {
                const user = accountant.userId;
                return {
                    accountantId: accountant.accountantId,
                    username: user.username,
                    password: accountant.accountantId,
                    temporaryPassword: true
                };
            });
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to retrieve school accountants credentials');
        }
    }
}
exports.AccountantCredentialsService = AccountantCredentialsService;
//# sourceMappingURL=accountant.credentials.service.js.map