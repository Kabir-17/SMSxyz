"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAbsenceSmsTestController = exports.triggerAbsenceSmsDispatchController = exports.getAbsenceSmsOverviewController = exports.getAbsenceSmsLogsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const absence_sms_service_1 = require("./absence-sms.service");
const AppError_1 = require("../../errors/AppError");
exports.getAbsenceSmsLogsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const effectiveSchoolId = req.query.schoolId || req.user?.schoolId?.toString();
    if (!effectiveSchoolId) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'School context is required to fetch SMS logs');
    }
    const result = await (0, absence_sms_service_1.listAbsenceSmsLogs)({
        schoolId: effectiveSchoolId,
        status: req.query.status,
        date: req.query.date,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        messageQuery: req.query.messageQuery,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Absence SMS logs retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});
exports.getAbsenceSmsOverviewController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const effectiveSchoolId = req.query.schoolId || req.user?.schoolId?.toString();
    if (!effectiveSchoolId) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'School context is required to load the SMS overview');
    }
    const overview = await (0, absence_sms_service_1.getAbsenceSmsOverview)(effectiveSchoolId, req.query.date);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Absence SMS overview retrieved successfully',
        data: overview,
    });
});
exports.triggerAbsenceSmsDispatchController = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const result = await (0, absence_sms_service_1.triggerAbsenceSmsRun)();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Absence SMS dispatcher triggered successfully',
        data: result,
    });
});
exports.sendAbsenceSmsTestController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, absence_sms_service_1.sendAbsenceSmsTest)(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.status === 'sent'
            ? 'Test SMS sent successfully'
            : 'Failed to send test SMS',
        data: result,
    });
});
//# sourceMappingURL=absence-sms.controller.js.map