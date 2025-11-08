"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicCalendarController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const academic_calendar_service_1 = require("./academic-calendar.service");
const createCalendarEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const eventData = req.body;
    if (req.files && Array.isArray(req.files)) {
        eventData.attachments = req.files.map((file) => ({
            fileName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            mimeType: file.mimetype,
        }));
    }
    const result = await academic_calendar_service_1.academicCalendarService.createCalendarEvent(eventData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Calendar event created successfully",
        data: result,
    });
});
const getAllCalendarEvents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const filters = req.query;
    const result = await academic_calendar_service_1.academicCalendarService.getCalendarEvents(filters);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Calendar events retrieved successfully",
        meta: {
            page: result.currentPage,
            limit: Number(filters.limit) || 20,
            total: result.totalCount,
        },
        data: result.events,
    });
});
const getCalendarEventById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await academic_calendar_service_1.academicCalendarService.getCalendarEventById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Calendar event retrieved successfully",
        data: result,
    });
});
const updateCalendarEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    if (req.files && Array.isArray(req.files)) {
        updateData.attachments = req.files.map((file) => ({
            fileName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            mimeType: file.mimetype,
        }));
    }
    const result = await academic_calendar_service_1.academicCalendarService.updateCalendarEvent(id, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Calendar event updated successfully",
        data: result,
    });
});
const deleteCalendarEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await academic_calendar_service_1.academicCalendarService.deleteCalendarEvent(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Calendar event deleted successfully",
        data: null,
    });
});
const getCalendarStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId } = req.params;
    const result = await academic_calendar_service_1.academicCalendarService.getCalendarStats(schoolId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Calendar statistics retrieved successfully",
        data: result,
    });
});
const createExamSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const examData = req.body;
    const result = await academic_calendar_service_1.academicCalendarService.createExamSchedule(examData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Exam schedule created successfully",
        data: result,
    });
});
const getMonthlyCalendar = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId, year, month } = req.params;
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    const result = await academic_calendar_service_1.academicCalendarService.getCalendarEvents({
        page: 1,
        limit: 1000,
        schoolId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        sortBy: "startDate",
        sortOrder: "asc",
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Monthly calendar retrieved successfully",
        data: {
            events: result.events,
            month: parseInt(month),
            year: parseInt(year),
            totalEvents: result.totalCount,
        },
    });
});
const getUpcomingEvents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId } = req.params;
    const { days = 7 } = req.query;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));
    const result = await academic_calendar_service_1.academicCalendarService.getCalendarEvents({
        page: 1,
        limit: 100,
        schoolId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        sortBy: "startDate",
        sortOrder: "asc",
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Upcoming events retrieved successfully",
        data: result.events,
    });
});
exports.AcademicCalendarController = {
    createCalendarEvent,
    getAllCalendarEvents,
    getCalendarEventById,
    updateCalendarEvent,
    deleteCalendarEvent,
    getCalendarStats,
    createExamSchedule,
    getMonthlyCalendar,
    getUpcomingEvents,
};
//# sourceMappingURL=academic-calendar.controller.js.map