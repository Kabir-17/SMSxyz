"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOrangeSmsTest = exports.updateOrangeSmsConfig = exports.getOrangeSmsConfig = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const orange_sms_service_1 = require("./orange-sms.service");
exports.getOrangeSmsConfig = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const config = await orange_sms_service_1.orangeSmsService.getDisplayConfig();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: config.hasCredentials
            ? 'Orange SMS configuration retrieved successfully'
            : 'Orange SMS is not yet configured',
        data: config,
    });
});
exports.updateOrangeSmsConfig = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const config = await orange_sms_service_1.orangeSmsService.updateConfig(req.body, req.user?.id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Orange SMS configuration updated successfully',
        data: config,
    });
});
exports.sendOrangeSmsTest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { phoneNumber, message, senderName, clientId, clientSecret } = req.body;
    const overrideCredentials = clientId && clientSecret ? { clientId, clientSecret } : undefined;
    const result = await orange_sms_service_1.orangeSmsService.sendSms({
        phoneNumber,
        message,
        senderNameOverride: senderName,
    }, overrideCredentials);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: result.status === 'sent'
            ? 'Test SMS sent successfully'
            : 'Failed to send test SMS',
        data: result,
    });
});
//# sourceMappingURL=orange-sms.controller.js.map