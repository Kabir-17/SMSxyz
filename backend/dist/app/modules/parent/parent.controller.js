"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = require("../../errors/AppError");
const parent_service_1 = require("./parent.service");
const assessment_service_1 = require("../assessment/assessment.service");
const getChildDisciplinaryActions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const parentUserId = req.user?.id;
    if (!parentUserId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Parent user not found");
    }
    const disciplinaryData = await parent_service_1.parentService.getChildDisciplinaryActions(parentUserId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Child disciplinary actions retrieved successfully",
        data: disciplinaryData,
    });
});
const getParentDashboard = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const parentUserId = req.user?.id;
    if (!parentUserId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Parent user not found");
    }
    const dashboardData = await parent_service_1.parentService.getParentDashboard(parentUserId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Parent dashboard retrieved successfully",
        data: dashboardData,
    });
});
const getParentChildren = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const parentUserId = req.user?.id;
    if (!parentUserId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Parent user not found");
    }
    const childrenData = await parent_service_1.parentService.getParentChildren(parentUserId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Parent children retrieved successfully",
        data: childrenData,
    });
});
const getChildAttendance = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const parentUserId = req.user?.id;
    const { childId } = req.params;
    const filters = req.query;
    if (!parentUserId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Parent user not found");
    }
    const attendanceData = await parent_service_1.parentService.getChildAttendance(parentUserId, childId, filters);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Child attendance retrieved successfully",
        data: attendanceData,
    });
});
const getChildHomework = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const parentUserId = req.user?.id;
    const { childId } = req.params;
    if (!parentUserId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Parent user not found");
    }
    const homeworkData = await parent_service_1.parentService.getChildHomework(parentUserId, childId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Child homework retrieved successfully",
        data: homeworkData,
    });
});
const getChildGrades = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = req.user;
    const { childId } = req.params;
    if (!user?.id) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Parent user not found");
    }
    const gradeData = await assessment_service_1.assessmentService.getStudentAssessments(user, childId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Child assessment records retrieved successfully",
        data: gradeData,
    });
});
const getChildSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const parentUserId = req.user?.id;
    const { childId } = req.params;
    if (!parentUserId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Parent user not found");
    }
    const scheduleData = await parent_service_1.parentService.getChildSchedule(parentUserId, childId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Child schedule retrieved successfully",
        data: scheduleData,
    });
});
const getChildNotices = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const parentUserId = req.user?.id;
    const { childId } = req.params;
    if (!parentUserId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Parent user not found");
    }
    const noticesData = await parent_service_1.parentService.getChildNotices(parentUserId, childId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Child notices retrieved successfully",
        data: noticesData,
    });
});
exports.ParentController = {
    getChildDisciplinaryActions,
    getParentDashboard,
    getParentChildren,
    getChildAttendance,
    getChildHomework,
    getChildGrades,
    getChildSchedule,
    getChildNotices,
};
//# sourceMappingURL=parent.controller.js.map