"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportStudentsForSchool = exports.listExportableSchools = exports.getSectionCapacityReport = exports.updateSectionCapacity = exports.updateSchoolSettings = exports.getSchoolSettings = exports.addDisciplinaryActionComment = exports.resolveDisciplinaryAction = exports.getAllDisciplinaryActions = exports.deleteCalendarEvent = exports.updateCalendarEvent = exports.getCalendarEventById = exports.getAllCalendarEvents = exports.createCalendarEvent = exports.deleteSchedule = exports.updateSchedule = exports.getScheduleById = exports.getAllSchedules = exports.createSchedule = exports.getAdminDashboard = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const student_model_1 = require("../student/student.model");
const teacher_model_1 = require("../teacher/teacher.model");
const subject_model_1 = require("../subject/subject.model");
const schedule_model_1 = require("../schedule/schedule.model");
const academic_calendar_model_1 = require("../academic-calendar/academic-calendar.model");
const AppError_1 = require("../../errors/AppError");
const school_model_1 = require("../school/school.model");
const user_model_1 = require("../user/user.model");
exports.getAdminDashboard = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminSchoolId = req.user?.schoolId;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    const schoolObjectId = new mongoose_1.default.Types.ObjectId(adminSchoolId);
    const [totalStudents, totalTeachers, totalSubjects, totalSchedules, upcomingEvents,] = await Promise.all([
        student_model_1.Student.countDocuments({ schoolId: schoolObjectId, isActive: true }),
        teacher_model_1.Teacher.countDocuments({ schoolId: schoolObjectId, isActive: true }),
        subject_model_1.Subject.countDocuments({ schoolId: schoolObjectId, isActive: true }),
        schedule_model_1.Schedule.countDocuments({
            schoolId: schoolObjectId,
            isActive: true,
        }).catch(() => 0),
        academic_calendar_model_1.AcademicCalendar.find({
            schoolId: schoolObjectId,
            isActive: true,
            startDate: { $gte: new Date() },
        })
            .sort({ startDate: 1 })
            .limit(5)
            .catch(() => []),
    ]);
    const dashboardData = {
        totalStudents,
        totalTeachers,
        totalSubjects,
        activeClasses: totalSchedules,
        upcomingEvents: upcomingEvents.length,
        upcomingEventsDetails: upcomingEvents,
    };
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Admin dashboard data retrieved successfully",
        data: dashboardData,
    });
});
exports.createSchedule = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminSchoolId = req.user?.schoolId;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    const scheduleData = {
        ...req.body,
        schoolId: adminSchoolId,
        createdBy: req.user?.id,
    };
    const schedule = await schedule_model_1.Schedule.create(scheduleData);
    const populatedSchedule = await schedule_model_1.Schedule.findById(schedule._id)
        .populate("subjectId")
        .populate("teacherId")
        .populate("classId");
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Schedule created successfully",
        data: populatedSchedule,
    });
});
exports.getAllSchedules = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminSchoolId = req.user?.schoolId;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    const schedules = await schedule_model_1.Schedule.find({
        schoolId: adminSchoolId,
        isDeleted: false,
    })
        .populate("subjectId")
        .populate("teacherId")
        .populate("classId")
        .sort({ createdAt: -1 });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Schedules retrieved successfully",
        data: schedules,
    });
});
exports.getScheduleById = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const adminSchoolId = req.user?.schoolId;
    const schedule = await schedule_model_1.Schedule.findOne({
        _id: id,
        schoolId: adminSchoolId,
        isDeleted: false,
    })
        .populate("subjectId")
        .populate("teacherId")
        .populate("classId");
    if (!schedule) {
        return next(new AppError_1.AppError(404, "Schedule not found"));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Schedule retrieved successfully",
        data: schedule,
    });
});
exports.updateSchedule = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const adminSchoolId = req.user?.schoolId;
    const schedule = await schedule_model_1.Schedule.findOneAndUpdate({ _id: id, schoolId: adminSchoolId, isDeleted: false }, { ...req.body, updatedBy: req.user?.id }, { new: true })
        .populate("subjectId")
        .populate("teacherId")
        .populate("classId");
    if (!schedule) {
        return next(new AppError_1.AppError(404, "Schedule not found"));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Schedule updated successfully",
        data: schedule,
    });
});
exports.deleteSchedule = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const adminSchoolId = req.user?.schoolId;
    const schedule = await schedule_model_1.Schedule.findOneAndUpdate({ _id: id, schoolId: adminSchoolId, isDeleted: false }, {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user?.id,
    }, { new: true });
    if (!schedule) {
        return next(new AppError_1.AppError(404, "Schedule not found"));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Schedule deleted successfully",
        data: null,
    });
});
exports.createCalendarEvent = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminSchoolId = req.user?.schoolId;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    const eventData = {
        ...req.body,
        schoolId: adminSchoolId,
        createdBy: req.user?.id,
    };
    if (req.files && Array.isArray(req.files)) {
        eventData.attachments = req.files.map((file) => file.path);
    }
    const event = await academic_calendar_model_1.AcademicCalendar.create(eventData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Calendar event created successfully",
        data: event,
    });
});
exports.getAllCalendarEvents = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminSchoolId = req.user?.schoolId;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    const events = await academic_calendar_model_1.AcademicCalendar.find({
        schoolId: adminSchoolId,
        isDeleted: false,
    }).sort({ startDate: 1 });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Calendar events retrieved successfully",
        data: events,
    });
});
exports.getCalendarEventById = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const adminSchoolId = req.user?.schoolId;
    const event = await academic_calendar_model_1.AcademicCalendar.findOne({
        _id: id,
        schoolId: adminSchoolId,
        isDeleted: false,
    });
    if (!event) {
        return next(new AppError_1.AppError(404, "Calendar event not found"));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Calendar event retrieved successfully",
        data: event,
    });
});
exports.updateCalendarEvent = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const adminSchoolId = req.user?.schoolId;
    const event = await academic_calendar_model_1.AcademicCalendar.findOneAndUpdate({ _id: id, schoolId: adminSchoolId, isDeleted: false }, { ...req.body, updatedBy: req.user?.id }, { new: true });
    if (!event) {
        return next(new AppError_1.AppError(404, "Calendar event not found"));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Calendar event updated successfully",
        data: event,
    });
});
exports.deleteCalendarEvent = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const adminSchoolId = req.user?.schoolId;
    const event = await academic_calendar_model_1.AcademicCalendar.findOneAndUpdate({ _id: id, schoolId: adminSchoolId, isDeleted: false }, {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user?.id,
    }, { new: true });
    if (!event) {
        return next(new AppError_1.AppError(404, "Calendar event not found"));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Calendar event deleted successfully",
        data: null,
    });
});
exports.getAllDisciplinaryActions = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminSchoolId = req.user?.schoolId;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    try {
        const { DisciplinaryAction } = await Promise.resolve().then(() => __importStar(require("../disciplinary/disciplinary.model")));
        const { actionType, severity, status, isRedWarrant } = req.query;
        const query = {
            schoolId: new mongoose_1.default.Types.ObjectId(adminSchoolId),
        };
        if (actionType)
            query.actionType = actionType;
        if (severity)
            query.severity = severity;
        if (status)
            query.status = status;
        if (isRedWarrant !== undefined)
            query.isRedWarrant = isRedWarrant === "true";
        const actions = await DisciplinaryAction.find(query)
            .populate({
            path: "studentId",
            select: "userId rollNumber grade section",
            populate: {
                path: "userId",
                select: "firstName lastName",
            },
        })
            .populate({
            path: "teacherId",
            select: "userId",
            populate: {
                path: "userId",
                select: "firstName lastName",
            },
        })
            .sort({ issuedDate: -1 });
        const stats = await DisciplinaryAction.getDisciplinaryStats(adminSchoolId);
        const formattedActions = actions.map((action) => {
            const student = action.studentId;
            const teacher = action.teacherId;
            const studentUser = student?.userId;
            const teacherUser = teacher?.userId;
            return {
                id: action._id,
                studentName: studentUser
                    ? `${studentUser.firstName} ${studentUser.lastName}`
                    : "N/A",
                studentRoll: student?.rollNumber || "N/A",
                grade: student?.grade || "N/A",
                section: student?.section || "N/A",
                teacherName: teacherUser
                    ? `${teacherUser.firstName} ${teacherUser.lastName}`
                    : "N/A",
                actionType: action.actionType,
                severity: action.severity,
                category: action.category,
                title: action.title,
                description: action.description,
                reason: action.reason,
                status: action.status,
                issuedDate: action.issuedDate,
                isRedWarrant: action.isRedWarrant,
                warrantLevel: action.warrantLevel,
                parentNotified: action.parentNotified,
                studentAcknowledged: action.studentAcknowledged,
                followUpRequired: action.followUpRequired,
                followUpDate: action.followUpDate,
                resolutionNotes: action.resolutionNotes,
                canAppeal: action.canAppeal ? action.canAppeal() : false,
                isOverdue: action.isOverdue ? action.isOverdue() : false,
            };
        });
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Disciplinary actions retrieved successfully",
            data: {
                actions: formattedActions,
                stats,
            },
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(500, `Failed to get disciplinary actions: ${error.message}`));
    }
});
exports.resolveDisciplinaryAction = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { actionId } = req.params;
    const { resolutionNotes } = req.body;
    const adminSchoolId = req.user?.schoolId;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    try {
        const { DisciplinaryAction } = await Promise.resolve().then(() => __importStar(require("../disciplinary/disciplinary.model")));
        const action = await DisciplinaryAction.findOne({
            _id: actionId,
            schoolId: new mongoose_1.default.Types.ObjectId(adminSchoolId),
        });
        if (!action) {
            return next(new AppError_1.AppError(404, "Disciplinary action not found"));
        }
        if (action.status === "resolved") {
            return next(new AppError_1.AppError(400, "Disciplinary action is already resolved"));
        }
        action.status = "resolved";
        action.resolutionNotes = resolutionNotes;
        action.resolvedDate = new Date();
        action.resolvedBy = new mongoose_1.default.Types.ObjectId(req.user?.id);
        await action.save();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Disciplinary action resolved successfully",
            data: {
                id: action._id,
                status: action.status,
                resolutionNotes: action.resolutionNotes,
                resolvedDate: action.resolvedDate,
            },
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(500, `Failed to resolve disciplinary action: ${error.message}`));
    }
});
exports.addDisciplinaryActionComment = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { actionId } = req.params;
    const { comment } = req.body;
    const adminSchoolId = req.user?.schoolId;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    try {
        const { DisciplinaryAction } = await Promise.resolve().then(() => __importStar(require("../disciplinary/disciplinary.model")));
        const action = await DisciplinaryAction.findOne({
            _id: actionId,
            schoolId: new mongoose_1.default.Types.ObjectId(adminSchoolId),
        });
        if (!action) {
            return next(new AppError_1.AppError(404, "Disciplinary action not found"));
        }
        const timestamp = new Date().toISOString();
        const adminName = req.user?.username || "Admin";
        const commentText = `\n\n[${timestamp}] Admin Comment by ${adminName}:\n${comment}`;
        action.resolutionNotes = (action.resolutionNotes || "") + commentText;
        await action.save();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Comment added successfully",
            data: {
                id: action._id,
                comment: commentText,
                updatedAt: new Date(),
            },
        });
    }
    catch (error) {
        return next(new AppError_1.AppError(500, `Failed to add comment: ${error.message}`));
    }
});
exports.getSchoolSettings = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminSchoolId = req.user?.schoolId;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    const school = await school_model_1.School.findById(adminSchoolId)
        .populate("adminUserId", "username firstName lastName email phone")
        .populate("createdBy", "username firstName lastName");
    if (!school) {
        return next(new AppError_1.AppError(404, "School not found"));
    }
    const schoolData = school.toObject();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "School settings retrieved successfully",
        data: schoolData,
    });
});
exports.updateSchoolSettings = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminSchoolId = req.user?.schoolId;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    const school = await school_model_1.School.findById(adminSchoolId);
    if (!school) {
        return next(new AppError_1.AppError(404, "School not found"));
    }
    const { name, establishedYear, address, contact, affiliation, recognition, settings, } = req.body;
    if (name)
        school.name = name;
    if (establishedYear)
        school.establishedYear = establishedYear;
    if (address)
        school.address = { ...school.address, ...address };
    if (contact)
        school.contact = { ...school.contact, ...contact };
    if (affiliation)
        school.affiliation = affiliation;
    if (recognition)
        school.recognition = recognition;
    if (settings) {
        school.settings = { ...school.settings, ...settings };
        if (settings.sectionCapacity) {
            school.settings.sectionCapacity = settings.sectionCapacity;
        }
    }
    school.lastModifiedBy = new mongoose_1.default.Types.ObjectId(req.user?.id);
    await school.save();
    const schoolData = school.toObject();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "School settings updated successfully",
        data: schoolData,
    });
});
exports.updateSectionCapacity = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminSchoolId = req.user?.schoolId;
    const { grade, section, maxStudents } = req.body;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    const school = await school_model_1.School.findById(adminSchoolId);
    if (!school) {
        return next(new AppError_1.AppError(404, "School not found"));
    }
    if (!school.getGradesOffered().includes(grade)) {
        return next(new AppError_1.AppError(400, `Grade ${grade} is not offered by this school`));
    }
    if (!school.getSectionsForGrade(grade).includes(section)) {
        return next(new AppError_1.AppError(400, `Section ${section} is not available for Grade ${grade}`));
    }
    await school.setSectionCapacity(grade, section, maxStudents);
    const updatedCapacity = school.getSectionCapacity(grade, section);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Section capacity updated successfully",
        data: {
            grade,
            section,
            capacity: updatedCapacity,
        },
    });
});
exports.getSectionCapacityReport = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminSchoolId = req.user?.schoolId;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    const school = await school_model_1.School.findById(adminSchoolId);
    if (!school) {
        return next(new AppError_1.AppError(404, "School not found"));
    }
    const studentCounts = await student_model_1.Student.aggregate([
        {
            $match: {
                schoolId: new mongoose_1.default.Types.ObjectId(adminSchoolId),
                isActive: true,
            },
        },
        {
            $group: {
                _id: {
                    grade: "$grade",
                    section: "$section",
                },
                count: { $sum: 1 },
            },
        },
    ]);
    const capacityReport = [];
    const grades = school.getGradesOffered();
    const sections = school.settings?.sections || [];
    grades.forEach((grade) => {
        sections.forEach((section) => {
            const capacity = school.getSectionCapacity(grade, section);
            const actualCount = studentCounts.find((sc) => sc._id.grade === grade && sc._id.section === section)?.count || 0;
            if (capacity.currentStudents !== actualCount) {
                school.settings.sectionCapacity[`${grade}-${section}`] = {
                    maxStudents: capacity.maxStudents,
                    currentStudents: actualCount,
                };
            }
            const utilizationPercent = capacity.maxStudents > 0
                ? (actualCount / capacity.maxStudents) * 100
                : 0;
            capacityReport.push({
                grade,
                section,
                maxCapacity: capacity.maxStudents,
                currentStudents: actualCount,
                availableSpots: Math.max(0, capacity.maxStudents - actualCount),
                utilizationPercent: Math.round(utilizationPercent * 100) / 100,
                status: utilizationPercent > 90
                    ? "full"
                    : utilizationPercent > 75
                        ? "high"
                        : "available",
            });
        });
    });
    await school.save();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Section capacity report generated successfully",
        data: {
            report: capacityReport,
            summary: {
                totalSections: capacityReport.length,
                fullSections: capacityReport.filter((r) => r.status === "full")
                    .length,
                highUtilizationSections: capacityReport.filter((r) => r.status === "high").length,
                availableSections: capacityReport.filter((r) => r.status === "available").length,
                totalCapacity: capacityReport.reduce((sum, r) => sum + r.maxCapacity, 0),
                totalStudents: capacityReport.reduce((sum, r) => sum + r.currentStudents, 0),
                totalAvailableSpots: capacityReport.reduce((sum, r) => sum + r.availableSpots, 0),
            },
        },
    });
});
exports.listExportableSchools = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const schools = await school_model_1.School.find({ isActive: true })
        .select("_id name schoolId")
        .sort({ name: 1 })
        .lean();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Exportable schools retrieved",
        data: schools,
    });
});
exports.exportStudentsForSchool = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { schoolId } = req.params;
    const { username, password } = req.body;
    console.log(username, password);
    console.log(schoolId);
    if (!schoolId) {
        return next(new AppError_1.AppError(400, "schoolId is required"));
    }
    if (!username || !password) {
        return next(new AppError_1.AppError(400, "username and password are required in request body"));
    }
    const user = await user_model_1.User.findOne({
        username: username.toLowerCase(),
    }).select("+passwordHash +schoolId +role");
    if (!user) {
        return next(new AppError_1.AppError(401, "Invalid credentials"));
    }
    const valid = await user.validatePassword(password);
    if (!valid) {
        return next(new AppError_1.AppError(401, "Invalid credentials"));
    }
    console.log("User authenticated:", user);
    let resolvedSchoolObjectId = schoolId;
    if (!mongoose_1.default.isValidObjectId(schoolId)) {
        const schoolDoc = await school_model_1.School.findOne({ schoolId: schoolId }).select("_id");
        if (!schoolDoc) {
            return next(new AppError_1.AppError(404, "School not found"));
        }
        resolvedSchoolObjectId = schoolDoc._id;
    }
    else {
        resolvedSchoolObjectId = new mongoose_1.default.Types.ObjectId(schoolId);
    }
    const students = await student_model_1.Student.find({ schoolId: resolvedSchoolObjectId })
        .populate("userId", "firstName lastName")
        .populate("photos")
        .lean();
    const payload = students.map((s) => ({
        id: s._id,
        studentId: s.studentId,
        grade: s.grade,
        section: s.section,
        firstName: s.userId?.firstName || null,
        lastName: s.userId?.lastName || null,
        dob: s.dob,
        photos: (s.photos || []).map((p) => ({
            id: p._id,
            photoNumber: p.photoNumber,
            photoPath: p.photoPath,
            filename: p.filename,
            originalName: p.originalName,
        })),
    }));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: `Students for school ${schoolId} exported successfully`,
        data: payload,
    });
});
//# sourceMappingURL=admin.controller.js.map