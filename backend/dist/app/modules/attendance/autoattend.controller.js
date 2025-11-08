"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceSuggestions = exports.getReconciliationReport = exports.updateAttendanceEventStatus = exports.getAttendanceEventStats = exports.getAttendanceEvents = exports.processAutoAttendEvent = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const school_model_1 = require("../school/school.model");
const attendance_event_model_1 = require("./attendance-event.model");
const student_model_1 = require("../student/student.model");
const catchAsync_1 = require("../../utils/catchAsync");
const AppError_1 = require("../../errors/AppError");
const sendResponse_1 = require("../../utils/sendResponse");
const autoattend_reconciliation_service_1 = require("./autoattend-reconciliation.service");
const day_attendance_model_1 = require("./day-attendance.model");
const dateUtils_1 = require("../../utils/dateUtils");
const config_1 = __importDefault(require("../../config"));
exports.processAutoAttendEvent = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { schoolSlug } = req.params;
    const apiKey = req.headers["x-attendance-key"];
    const payload = req.body;
    const requestWithContext = req;
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            processed: false,
            message: "Missing X-Attendance-Key header",
            eventId: payload.event?.eventId || "unknown",
        });
    }
    const orConditions = [
        { slug: schoolSlug },
        { schoolId: schoolSlug },
    ];
    if (mongoose_1.default.Types.ObjectId.isValid(schoolSlug)) {
        orConditions.push({ _id: schoolSlug });
    }
    let school = requestWithContext.school;
    if (!school ||
        school.apiKey !== apiKey ||
        !orConditions.some((condition) => {
            if (condition.slug) {
                return school.slug === condition.slug;
            }
            if (condition.schoolId) {
                return school.schoolId === condition.schoolId;
            }
            if (condition._id) {
                return school._id?.toString() === condition._id;
            }
            return false;
        })) {
        school = await school_model_1.School.findOne({
            $or: orConditions,
            apiKey: apiKey,
        }).select("_id name slug schoolId apiKey isActive settings.autoAttendFinalizationTime settings.timezone");
    }
    if (!school) {
        return res.status(401).json({
            success: false,
            processed: false,
            message: "Invalid school or API key",
            eventId: payload.event?.eventId || "unknown",
        });
    }
    if (!school.isActive) {
        return res.status(403).json({
            success: false,
            processed: false,
            message: "School attendance API is disabled",
            eventId: payload.event?.eventId || "unknown",
        });
    }
    if (!payload.event || !payload.event.eventId) {
        return res.status(400).json({
            success: false,
            processed: false,
            message: "Invalid event payload",
            eventId: "unknown",
        });
    }
    requestWithContext.school = school;
    requestWithContext.schoolContextId = school._id.toString();
    res.locals.school = school;
    res.locals.schoolId = school._id.toString();
    const { event, source, test } = payload;
    if (test === true) {
        return res.status(200).json({
            success: true,
            processed: false,
            message: "Test event acknowledged (not persisted)",
            eventId: event.eventId,
            timestamp: new Date().toISOString(),
        });
    }
    let studentExists = false;
    let studentDoc = null;
    try {
        studentDoc = await student_model_1.Student.findOne({
            schoolId: school._id,
            $or: [
                { studentId: event.studentId },
                { "userId.username": event.studentId },
            ],
        }).select("_id studentId schoolId");
        studentExists = !!studentDoc;
    }
    catch (err) {
        console.warn("Failed to verify student existence:", err);
    }
    try {
        const attendanceEvent = await attendance_event_model_1.AttendanceEvent.findOneAndUpdate({ eventId: event.eventId }, {
            $setOnInsert: {
                schoolId: school._id,
                eventId: event.eventId,
                descriptor: event.descriptor,
                studentId: event.studentId,
                firstName: event.firstName,
                age: event.age,
                grade: event.grade,
                section: event.section,
                bloodGroup: event.bloodGroup,
                capturedAt: new Date(event.capturedAt),
                capturedDate: event.capturedDate,
                capturedTime: event.capturedTime,
                payload: payload,
                source: source,
                status: "captured",
                test: test || false,
                createdAt: new Date(),
            }
        }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        });
        console.log(`[Auto-Attend] Event ${event.eventId} captured for school ${school.name} (${school.schoolId}), student ${event.studentId}, grade ${event.grade}${event.section}`);
        if (studentDoc) {
            const schoolTimezone = school.settings?.timezone || config_1.default.school_timezone || 'UTC';
            const { date: normalizedDate, dateKey } = (0, dateUtils_1.getSchoolDate)(new Date(event.capturedAt), schoolTimezone);
            await day_attendance_model_1.StudentDayAttendance.markFromAuto({
                schoolId: school._id,
                studentId: studentDoc._id,
                studentCode: studentDoc.studentId,
                eventId: event.eventId,
                capturedAt: new Date(event.capturedAt),
                dateKey: dateKey,
            });
            const finalizeTime = school.settings?.autoAttendFinalizationTime ||
                config_1.default.auto_attend_finalization_time;
            await day_attendance_model_1.StudentDayAttendance.finalizeForDate(school._id, normalizedDate, dateKey, finalizeTime, schoolTimezone);
        }
        return res.status(200).json({
            success: true,
            processed: true,
            message: studentExists
                ? "Attendance event queued"
                : "Attendance event queued (student not found in SMS)",
            eventId: event.eventId,
            timestamp: attendanceEvent.createdAt?.toISOString(),
        });
    }
    catch (error) {
        console.error("[Auto-Attend] Failed to persist event:", error);
        if (error.code === 11000) {
            return res.status(409).json({
                success: true,
                processed: false,
                message: "Event already processed (duplicate detected)",
                eventId: event.eventId,
            });
        }
        return res.status(500).json({
            success: false,
            processed: false,
            message: "Internal server error while processing event",
            eventId: event.eventId,
        });
    }
});
exports.getAttendanceEvents = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
        return next(new AppError_1.AppError(403, "School ID not found in user context"));
    }
    const schoolObjectId = new mongoose_1.default.Types.ObjectId(schoolId);
    const schoolSettingsDoc = await school_model_1.School.findById(schoolObjectId).select("settings.autoAttendFinalizationTime settings.timezone");
    const finalizeTimeSetting = schoolSettingsDoc?.settings?.autoAttendFinalizationTime ||
        config_1.default.auto_attend_finalization_time;
    const schoolTimezone = schoolSettingsDoc?.settings?.timezone || config_1.default.school_timezone || "UTC";
    const { studentId, status, startDate, endDate, grade, section, test, page = "1", limit = "50", } = req.query;
    const filters = {
        schoolId: schoolId.toString(),
    };
    if (studentId)
        filters.studentId = studentId;
    if (status)
        filters.status = status;
    if (grade)
        filters.grade = grade;
    if (section)
        filters.section = section;
    if (test !== undefined)
        filters.test = test === "true";
    if (startDate)
        filters.startDate = new Date(startDate);
    if (endDate)
        filters.endDate = new Date(endDate);
    const query = { schoolId: schoolObjectId };
    if (filters.studentId)
        query.studentId = filters.studentId;
    if (filters.status)
        query.status = filters.status;
    if (filters.grade)
        query.grade = filters.grade;
    if (filters.section)
        query.section = filters.section;
    if (filters.test !== undefined)
        query.test = filters.test;
    if (filters.startDate || filters.endDate) {
        query.capturedAt = {};
        if (filters.startDate)
            query.capturedAt.$gte = filters.startDate;
        if (filters.endDate)
            query.capturedAt.$lte = filters.endDate;
    }
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const [events, total] = await Promise.all([
        attendance_event_model_1.AttendanceEvent.find(query)
            .sort({ capturedAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean(),
        attendance_event_model_1.AttendanceEvent.countDocuments(query),
    ]);
    const dateKeys = Array.from(new Set(events.map((event) => event.capturedDate).filter(Boolean)));
    await Promise.all(dateKeys.map((key) => {
        const { date } = (0, day_attendance_model_1.normaliseDateKey)(key, schoolTimezone);
        return day_attendance_model_1.StudentDayAttendance.finalizeForDate(schoolObjectId, date, key, finalizeTimeSetting, schoolTimezone);
    }));
    const statusMap = await day_attendance_model_1.StudentDayAttendance.getStatusMap(schoolObjectId, dateKeys);
    const eventsWithStatus = events.map((event) => {
        const mapKey = `${event.studentId}-${event.capturedDate}`;
        const dayAttendance = statusMap.get(mapKey);
        return {
            ...event,
            dayAttendance: dayAttendance
                ? {
                    finalStatus: dayAttendance.finalStatus,
                    finalSource: dayAttendance.finalSource,
                    teacherStatus: dayAttendance.teacherStatus,
                    autoStatus: dayAttendance.autoStatus,
                    finalized: dayAttendance.finalized,
                    teacherOverride: dayAttendance.teacherOverride,
                    updatedAt: dayAttendance.updatedAt,
                }
                : null,
        };
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Attendance events retrieved successfully",
        data: {
            events: eventsWithStatus,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        },
    });
});
exports.getAttendanceEventStats = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
        return next(new AppError_1.AppError(403, "School ID not found in user context"));
    }
    const { startDate, endDate } = req.query;
    const schoolObjectId = new mongoose_1.default.Types.ObjectId(schoolId);
    const match = { schoolId: schoolObjectId };
    const dateFilter = { schoolId: schoolObjectId };
    if (startDate || endDate) {
        const capturedAtFilter = {};
        if (startDate)
            capturedAtFilter.$gte = new Date(startDate);
        if (endDate)
            capturedAtFilter.$lte = new Date(endDate);
        match.capturedAt = capturedAtFilter;
        dateFilter.capturedAt = capturedAtFilter;
    }
    const [totalEvents, statusCounts, gradeCounts, recentEvents] = await Promise.all([
        attendance_event_model_1.AttendanceEvent.countDocuments(match),
        attendance_event_model_1.AttendanceEvent.aggregate([
            { $match: match },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        attendance_event_model_1.AttendanceEvent.aggregate([
            { $match: match },
            { $group: { _id: "$grade", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]),
        attendance_event_model_1.AttendanceEvent.find(match).sort({ capturedAt: -1 }).limit(10).lean(),
    ]);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const eventsToday = await attendance_event_model_1.AttendanceEvent.countDocuments({
        schoolId: schoolObjectId,
        capturedAt: { $gte: todayStart },
    });
    const statusMap = {};
    statusCounts.forEach((item) => {
        statusMap[item._id] = item.count;
    });
    if (Object.keys(statusMap).length === 0 &&
        recentEvents &&
        recentEvents.length > 0) {
        const statuses = ["captured", "reviewed", "superseded", "ignored"];
        const counts = await Promise.all(statuses.map((s) => attendance_event_model_1.AttendanceEvent.countDocuments({ ...dateFilter, status: s })));
        statuses.forEach((s, idx) => {
            statusMap[s] = counts[idx];
        });
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Attendance event statistics retrieved successfully",
        data: {
            totalEvents,
            capturedEvents: statusMap.captured || 0,
            reviewedEvents: statusMap.reviewed || 0,
            supersededEvents: statusMap.superseded || 0,
            ignoredEvents: statusMap.ignored || 0,
            eventsToday,
            eventsByGrade: gradeCounts.map((item) => ({
                grade: item._id,
                count: item.count,
            })),
            eventsByStatus: statusCounts.map((item) => ({
                status: item._id,
                count: item.count,
            })),
            recentEvents,
        },
    });
});
exports.updateAttendanceEventStatus = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { eventId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user?.id;
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
        return next(new AppError_1.AppError(403, "School ID not found in user context"));
    }
    if (!["reviewed", "superseded", "ignored"].includes(status)) {
        return next(new AppError_1.AppError(400, "Invalid status. Must be reviewed, superseded, or ignored"));
    }
    const event = await attendance_event_model_1.AttendanceEvent.findOne({
        eventId,
        schoolId,
    });
    if (!event) {
        return next(new AppError_1.AppError(404, "Attendance event not found"));
    }
    event.status = status;
    event.processedAt = new Date();
    event.processedBy = userId;
    if (notes)
        event.notes = notes;
    await event.save();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: `Attendance event marked as ${status}`,
        data: event,
    });
});
exports.getReconciliationReport = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
        return next(new AppError_1.AppError(403, "School ID not found in user context"));
    }
    const { date, grade, section, period } = req.query;
    if (!date || !grade || !section) {
        return next(new AppError_1.AppError(400, "date, grade, and section are required"));
    }
    const result = await autoattend_reconciliation_service_1.AutoAttendReconciliationService.reconcileAttendanceForPeriod(schoolId.toString(), new Date(date), parseInt(grade, 10), section, period ? parseInt(period, 10) : undefined);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Reconciliation report generated successfully",
        data: result,
    });
});
exports.getAttendanceSuggestions = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
        return next(new AppError_1.AppError(403, "School ID not found in user context"));
    }
    const { date, grade, section } = req.query;
    if (!date || !grade || !section) {
        return next(new AppError_1.AppError(400, "date, grade, and section are required"));
    }
    const suggestions = await autoattend_reconciliation_service_1.AutoAttendReconciliationService.suggestAttendanceFromCamera(schoolId.toString(), new Date(date), parseInt(grade, 10), section);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Attendance suggestions generated successfully",
        data: suggestions,
    });
});
//# sourceMappingURL=autoattend.controller.js.map