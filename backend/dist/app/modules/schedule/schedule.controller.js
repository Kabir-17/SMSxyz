"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const schedule_service_1 = require("./schedule.service");
const AppError_1 = require("../../errors/AppError");
const createSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const scheduleData = req.body;
    const schedules = await schedule_service_1.ScheduleService.createSchedule(scheduleData);
    const createdCount = schedules.length;
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: createdCount > 1
            ? `${createdCount} schedules created successfully`
            : "Schedule created successfully",
        data: schedules,
    });
});
const getAllSchedules = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const filters = req.query;
    const pagination = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
    };
    const result = await schedule_service_1.ScheduleService.getAllSchedules(filters, pagination);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Schedules retrieved successfully",
        meta: {
            page: result.currentPage,
            limit: pagination.limit,
            total: result.totalCount,
        },
        data: result.schedules,
    });
});
const getScheduleById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await schedule_service_1.ScheduleService.getScheduleById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Schedule retrieved successfully",
        data: result,
    });
});
const updateSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const userSchoolId = req.user?.role === 'superadmin' ? undefined : req.user?.schoolId;
    const result = await schedule_service_1.ScheduleService.updateSchedule(id, updateData, userSchoolId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Schedule updated successfully",
        data: result,
    });
});
const deleteSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const userSchoolId = req.user?.role === 'superadmin' ? undefined : req.user?.schoolId;
    await schedule_service_1.ScheduleService.deleteSchedule(id, userSchoolId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Schedule deleted successfully",
        data: null,
    });
});
const clearClassSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { grade, section } = req.params;
    const dayOfWeek = req.query.dayOfWeek?.toLowerCase();
    const user = req.user;
    let effectiveSchoolId = req.query.schoolId;
    if (user?.role !== "superadmin") {
        effectiveSchoolId = user?.schoolId?.toString?.();
    }
    if (user?.role === "superadmin" && !effectiveSchoolId) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Superadmin must provide schoolId query parameter to clear a class schedule");
    }
    const deletedCount = await schedule_service_1.ScheduleService.clearSchedulesForClass(effectiveSchoolId, Number(grade), section, dayOfWeek);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: deletedCount > 0
            ? `Cleared ${deletedCount} schedule${deletedCount === 1 ? "" : "s"} for Grade ${grade} Section ${section}${dayOfWeek ? ` on ${dayOfWeek}` : ""}`
            : "No schedules found to clear",
        data: {
            deletedCount,
        },
    });
});
const getWeeklySchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId, grade, section } = req.params;
    const result = await schedule_service_1.ScheduleService.getWeeklySchedule(schoolId, Number(grade), section);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Weekly schedule retrieved successfully",
        data: result,
    });
});
const getTeacherSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { teacherId } = req.params;
    const result = await schedule_service_1.ScheduleService.getTeacherSchedule(teacherId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher schedule retrieved successfully",
        data: result,
    });
});
const assignSubstituteTeacher = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { scheduleId, periodNumber } = req.params;
    const { substituteTeacherId, startDate, endDate, reason } = req.body;
    const result = await schedule_service_1.ScheduleService.assignSubstituteTeacher(scheduleId, Number(periodNumber), substituteTeacherId, new Date(startDate), endDate ? new Date(endDate) : undefined, reason);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Substitute teacher assigned successfully",
        data: result,
    });
});
const getScheduleStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId } = req.params;
    const result = await schedule_service_1.ScheduleService.getScheduleStats(schoolId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Schedule statistics retrieved successfully",
        data: result,
    });
});
const bulkCreateSchedules = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const schedulesData = req.body.schedules;
    const result = await schedule_service_1.ScheduleService.bulkCreateSchedules(schedulesData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: `${result.length} schedules created successfully`,
        data: result,
    });
});
const getSchedulesByClass = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId, grade, section } = req.params;
    const filters = {
        schoolId,
        grade: Number(grade),
        section,
        ...req.query,
    };
    const pagination = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
    };
    const result = await schedule_service_1.ScheduleService.getAllSchedules(filters, pagination);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Class schedules retrieved successfully",
        meta: {
            page: result.currentPage,
            limit: pagination.limit,
            total: result.totalCount,
        },
        data: result.schedules,
    });
});
const getSchedulesByTeacher = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { teacherId } = req.params;
    const filters = {
        teacherId,
        ...req.query,
    };
    const pagination = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
    };
    const result = await schedule_service_1.ScheduleService.getAllSchedules(filters, pagination);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher schedules retrieved successfully",
        meta: {
            page: result.currentPage,
            limit: pagination.limit,
            total: result.totalCount,
        },
        data: result.schedules,
    });
});
const getSchedulesBySubject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { subjectId } = req.params;
    const filters = {
        subjectId,
        ...req.query,
    };
    const pagination = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
    };
    const result = await schedule_service_1.ScheduleService.getAllSchedules(filters, pagination);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Subject schedules retrieved successfully",
        meta: {
            page: result.currentPage,
            limit: pagination.limit,
            total: result.totalCount,
        },
        data: result.schedules,
    });
});
const getSchoolScheduleOverview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId } = req.params;
    const { academicYear } = req.query;
    const filters = {
        schoolId,
        academicYear: academicYear,
        isActive: true,
    };
    const [schedules, stats] = await Promise.all([
        schedule_service_1.ScheduleService.getAllSchedules(filters, { page: 1, limit: 1000 }),
        schedule_service_1.ScheduleService.getScheduleStats(schoolId),
    ]);
    const groupedSchedules = schedules.schedules.reduce((acc, schedule) => {
        const key = `${schedule.grade}-${schedule.section}`;
        if (!acc[key]) {
            acc[key] = {
                grade: schedule.grade,
                section: schedule.section,
                className: `Grade ${schedule.grade} - Section ${schedule.section}`,
                days: {},
            };
        }
        acc[key].days[schedule.dayOfWeek] = schedule;
        return acc;
    }, {});
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "School schedule overview retrieved successfully",
        data: {
            overview: Object.values(groupedSchedules),
            statistics: stats,
            totalClasses: Object.keys(groupedSchedules).length,
            totalSchedules: schedules.totalCount,
        },
    });
});
exports.ScheduleController = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    clearClassSchedule,
    getWeeklySchedule,
    getTeacherSchedule,
    assignSubstituteTeacher,
    getScheduleStats,
    bulkCreateSchedules,
    getSchedulesByClass,
    getSchedulesByTeacher,
    getSchedulesBySubject,
    getSchoolScheduleOverview,
};
//# sourceMappingURL=schedule.controller.js.map