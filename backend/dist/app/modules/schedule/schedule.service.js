"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const mongoose_1 = require("mongoose");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const schedule_model_1 = require("./schedule.model");
const school_model_1 = require("../school/school.model");
const subject_model_1 = require("../subject/subject.model");
const teacher_model_1 = require("../teacher/teacher.model");
const class_model_1 = require("../class/class.model");
const VALID_DAYS = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];
const toMinutes = (time) => {
    if (!time) {
        return NaN;
    }
    const [hour, minute] = time.split(":").map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
        return NaN;
    }
    return hour * 60 + minute;
};
const intervalsOverlap = (startA, endA, startB, endB) => startA < endB && startB < endA;
const normalizeSchedulePeriods = (periods) => {
    if (!periods || periods.length === 0) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "At least one period is required");
    }
    const normalized = [];
    const timeSlots = [];
    const teacherSlots = new Map();
    for (const period of periods) {
        const startMinutes = toMinutes(period.startTime);
        const endMinutes = toMinutes(period.endTime);
        if (!Number.isFinite(startMinutes) || !Number.isFinite(endMinutes)) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Invalid start or end time for period ${period.periodNumber}`);
        }
        if (endMinutes <= startMinutes) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `End time must be after start time for period ${period.periodNumber}`);
        }
        for (const slot of timeSlots) {
            if (intervalsOverlap(startMinutes, endMinutes, slot.start, slot.end)) {
                throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Period ${period.periodNumber} overlaps with period ${slot.periodNumber}`);
            }
        }
        timeSlots.push({
            start: startMinutes,
            end: endMinutes,
            periodNumber: period.periodNumber,
        });
        if (period.isBreak) {
            const breakType = period.breakType || "short";
            const duration = period.breakDuration ?? endMinutes - startMinutes;
            if (duration < 5 || duration > 60) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Break duration for period ${period.periodNumber} must be between 5 and 60 minutes`);
            }
            normalized.push({
                periodNumber: period.periodNumber,
                startTime: period.startTime,
                endTime: period.endTime,
                isBreak: true,
                breakType,
                breakDuration: duration,
            });
            continue;
        }
        if (!period.subjectId) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Subject is required for period ${period.periodNumber}`);
        }
        if (!period.teacherId) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Teacher is required for period ${period.periodNumber}`);
        }
        const teacherId = period.teacherId.toString();
        const teacherPeriodSlots = teacherSlots.get(teacherId) ?? [];
        for (const slot of teacherPeriodSlots) {
            if (intervalsOverlap(startMinutes, endMinutes, slot.start, slot.end)) {
                throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Teacher is double-booked within this schedule (period ${period.periodNumber} overlaps with period ${slot.periodNumber})`);
            }
        }
        teacherPeriodSlots.push({
            start: startMinutes,
            end: endMinutes,
            periodNumber: period.periodNumber,
        });
        teacherSlots.set(teacherId, teacherPeriodSlots);
        normalized.push({
            periodNumber: period.periodNumber,
            subjectId: period.subjectId,
            teacherId: period.teacherId,
            roomNumber: period.roomNumber,
            startTime: period.startTime,
            endTime: period.endTime,
            isBreak: false,
        });
    }
    return normalized.sort((a, b) => a.periodNumber - b.periodNumber);
};
const createSchedule = async (scheduleData) => {
    const session = await (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        if (!scheduleData.schoolId) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "School ID is required");
        }
        let schoolObjectId;
        try {
            schoolObjectId = new mongoose_1.Types.ObjectId(scheduleData.schoolId);
        }
        catch {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid school ID format");
        }
        const gradeValue = Number(scheduleData.grade);
        if (Number.isNaN(gradeValue)) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Grade must be a number");
        }
        const sectionValue = (scheduleData.section || "").toUpperCase();
        const normalizedPeriods = normalizeSchedulePeriods(scheduleData.periods);
        const school = await school_model_1.School.findById(schoolObjectId).session(session);
        if (!school) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, `School not found with ID: ${scheduleData.schoolId}`);
        }
        if (!school.isActive) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "School is not active");
        }
        let classDoc = await class_model_1.Class.findOne({
            schoolId: scheduleData.schoolId,
            grade: gradeValue,
            section: sectionValue,
            academicYear: scheduleData.academicYear,
        }).session(session);
        if (!classDoc) {
            classDoc = new class_model_1.Class({
                schoolId: scheduleData.schoolId,
                grade: gradeValue,
                section: sectionValue,
                className: `Grade ${gradeValue} - Section ${sectionValue}`,
                academicYear: scheduleData.academicYear,
                maxStudents: school.settings?.maxStudentsPerSection || 40,
                isActive: true,
            });
            await classDoc.save({ session });
        }
        const subjectIds = normalizedPeriods
            .filter((period) => !period.isBreak && period.subjectId)
            .map((period) => period.subjectId);
        if (subjectIds.length > 0) {
            const subjects = await subject_model_1.Subject.find({
                _id: { $in: subjectIds },
            }).session(session);
            if (subjects.length !== subjectIds.length) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "One or more subjects not found");
            }
        }
        const teacherIds = normalizedPeriods
            .filter((period) => !period.isBreak && period.teacherId)
            .map((period) => period.teacherId);
        const teacherNameLookup = new Map();
        if (teacherIds.length > 0) {
            const teachers = await teacher_model_1.Teacher.find({ _id: { $in: teacherIds } })
                .populate("userId", "firstName lastName")
                .session(session);
            if (teachers.length !== teacherIds.length) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "One or more teachers not found");
            }
            teachers.forEach((teacher) => {
                const firstName = teacher.userId?.firstName || "";
                const lastName = teacher.userId?.lastName || "";
                const fullName = `${firstName} ${lastName}`.trim();
                teacherNameLookup.set(teacher._id.toString(), fullName || teacher.teacherId || "Selected teacher");
            });
        }
        const requestedDaysRaw = [
            ...(scheduleData.applyToDays ?? []),
            scheduleData.dayOfWeek,
        ];
        const uniqueDays = Array.from(new Set(requestedDaysRaw
            .filter(Boolean)
            .map((day) => day.toLowerCase())));
        if (uniqueDays.length === 0) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "At least one day of week must be specified");
        }
        for (const day of uniqueDays) {
            if (!VALID_DAYS.includes(day)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Invalid day provided: ${day}`);
            }
        }
        const createdScheduleIds = [];
        for (const day of uniqueDays) {
            const existingSchedule = await schedule_model_1.Schedule.findOne({
                schoolId: schoolObjectId,
                grade: gradeValue,
                section: sectionValue,
                dayOfWeek: day,
                academicYear: scheduleData.academicYear,
                isActive: true,
            }).session(session);
            if (existingSchedule) {
                throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Schedule already exists for Grade ${gradeValue} Section ${sectionValue} on ${day}`);
            }
            for (const period of normalizedPeriods) {
                if (!period.isBreak && period.teacherId) {
                    const hasConflict = await schedule_model_1.Schedule.checkTeacherConflict(period.teacherId.toString(), day, period.periodNumber, period.startTime, period.endTime);
                    if (hasConflict) {
                        const teacherName = teacherNameLookup.get(period.teacherId.toString()) ||
                            "Selected teacher";
                        const capitalisedDay = day.charAt(0).toUpperCase() + day.slice(1);
                        throw new AppError_1.AppError(http_status_1.default.CONFLICT, `${teacherName} already has a class between ${period.startTime} and ${period.endTime} on ${capitalisedDay}`);
                    }
                }
            }
            const schedulePayload = {
                schoolId: scheduleData.schoolId,
                classId: classDoc._id,
                grade: gradeValue,
                section: sectionValue,
                academicYear: scheduleData.academicYear,
                dayOfWeek: day,
                periods: normalizedPeriods.map((period) => ({
                    ...period,
                })),
            };
            const newSchedule = new schedule_model_1.Schedule(schedulePayload);
            await newSchedule.save({ session });
            createdScheduleIds.push(newSchedule._id);
        }
        await session.commitTransaction();
        const schedules = await schedule_model_1.Schedule.find({
            _id: { $in: createdScheduleIds },
        })
            .populate("schoolId", "name")
            .populate("periods.subjectId", "name code")
            .populate({
            path: "periods.teacherId",
            select: "userId teacherId",
            populate: {
                path: "userId",
                select: "firstName lastName",
            },
        });
        const orderMap = new Map();
        createdScheduleIds.forEach((id, index) => orderMap.set(id.toString(), index));
        schedules.sort((a, b) => (orderMap.get(a._id.toString()) ?? 0) -
            (orderMap.get(b._id.toString()) ?? 0));
        return schedules;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const clearSchedulesForClass = async (schoolId, grade, section, dayOfWeek) => {
    if (!schoolId) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "School ID is required to clear schedules");
    }
    const gradeValue = Number(grade);
    if (Number.isNaN(gradeValue)) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Grade must be a valid number");
    }
    const normalizedSection = (section || "").toUpperCase();
    if (!normalizedSection) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Section is required");
    }
    const filter = {
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        grade: gradeValue,
        section: normalizedSection,
    };
    if (dayOfWeek) {
        const normalizedDay = dayOfWeek.toLowerCase();
        if (!VALID_DAYS.includes(normalizedDay)) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Invalid dayOfWeek provided. Expected one of: ${VALID_DAYS.join(", ")}`);
        }
        filter.dayOfWeek = normalizedDay;
    }
    const result = await schedule_model_1.Schedule.deleteMany(filter);
    return result.deletedCount ?? 0;
};
const getAllSchedules = async (filters, pagination) => {
    const { page = 1, limit = 20 } = pagination;
    const skip = (page - 1) * limit;
    const query = {};
    if (filters.schoolId)
        query.schoolId = filters.schoolId;
    if (filters.grade)
        query.grade = filters.grade;
    if (filters.section)
        query.section = filters.section;
    if (filters.dayOfWeek)
        query.dayOfWeek = filters.dayOfWeek;
    if (filters.academicYear)
        query.academicYear = filters.academicYear;
    if (filters.isActive !== undefined)
        query.isActive = filters.isActive;
    if (filters.teacherId) {
        query["periods.teacherId"] = filters.teacherId;
    }
    if (filters.subjectId) {
        query["periods.subjectId"] = filters.subjectId;
    }
    const [schedules, totalCount] = await Promise.all([
        schedule_model_1.Schedule.find(query)
            .populate("schoolId", "name")
            .populate("periods.subjectId", "name code")
            .populate({
            path: "periods.teacherId",
            select: "userId teacherId",
            populate: {
                path: "userId",
                select: "firstName lastName",
            },
        })
            .sort({ grade: 1, section: 1, dayOfWeek: 1 })
            .skip(skip)
            .limit(limit),
        schedule_model_1.Schedule.countDocuments(query),
    ]);
    return {
        schedules,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
    };
};
const getScheduleById = async (scheduleId) => {
    const schedule = await schedule_model_1.Schedule.findById(scheduleId)
        .populate("schoolId", "name")
        .populate("periods.subjectId", "name code")
        .populate({
        path: "periods.teacherId",
        select: "userId teacherId",
        populate: {
            path: "userId",
            select: "firstName lastName",
        },
    });
    if (!schedule) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Schedule not found");
    }
    return schedule;
};
const updateSchedule = async (scheduleId, updateData, userSchoolId) => {
    const session = await (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const query = { _id: scheduleId };
        if (userSchoolId) {
            query.schoolId = userSchoolId;
        }
        const schedule = await schedule_model_1.Schedule.findOne(query).session(session);
        if (!schedule) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Schedule not found or access denied");
        }
        if (updateData.periods) {
            const normalizedPeriods = normalizeSchedulePeriods(updateData.periods);
            const subjectIds = normalizedPeriods
                .filter((period) => !period.isBreak && period.subjectId)
                .map((period) => period.subjectId);
            if (subjectIds.length > 0) {
                const subjects = await subject_model_1.Subject.find({
                    _id: { $in: subjectIds },
                    schoolId: schedule.schoolId,
                }).session(session);
                if (subjects.length !== subjectIds.length) {
                    throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "One or more subjects not found in this school");
                }
            }
            const teacherIds = normalizedPeriods
                .filter((period) => !period.isBreak && period.teacherId)
                .map((period) => period.teacherId);
            const teacherNameLookup = new Map();
            if (teacherIds.length > 0) {
                const teachers = await teacher_model_1.Teacher.find({
                    _id: { $in: teacherIds },
                    schoolId: schedule.schoolId,
                })
                    .populate("userId", "firstName lastName")
                    .session(session);
                if (teachers.length !== teacherIds.length) {
                    throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "One or more teachers not found in this school");
                }
                teachers.forEach((teacher) => {
                    const firstName = teacher.userId?.firstName || "";
                    const lastName = teacher.userId?.lastName || "";
                    const fullName = `${firstName} ${lastName}`.trim();
                    teacherNameLookup.set(teacher._id.toString(), fullName || teacher.teacherId || "Selected teacher");
                });
            }
            for (const period of normalizedPeriods) {
                if (!period.isBreak && period.teacherId) {
                    const hasConflict = await schedule_model_1.Schedule.checkTeacherConflict(period.teacherId.toString(), schedule.dayOfWeek, period.periodNumber, period.startTime, period.endTime, scheduleId);
                    if (hasConflict) {
                        const teacherName = teacherNameLookup.get(period.teacherId.toString()) ||
                            "Selected teacher";
                        throw new AppError_1.AppError(http_status_1.default.CONFLICT, `${teacherName} already has a class between ${period.startTime} and ${period.endTime} on ${schedule.dayOfWeek}`);
                    }
                }
            }
            schedule.periods = normalizedPeriods;
        }
        if (typeof updateData.isActive === "boolean") {
            schedule.isActive = updateData.isActive;
        }
        await schedule.save({ session });
        await session.commitTransaction();
        const result = await schedule_model_1.Schedule.findById(scheduleId)
            .populate("schoolId", "name")
            .populate("periods.subjectId", "name code")
            .populate({
            path: "periods.teacherId",
            select: "userId teacherId",
            populate: {
                path: "userId",
                select: "firstName lastName",
            },
        });
        if (!result) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve updated schedule");
        }
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const deleteSchedule = async (scheduleId, userSchoolId) => {
    const query = { _id: scheduleId };
    if (userSchoolId) {
        query.schoolId = userSchoolId;
    }
    const schedule = await schedule_model_1.Schedule.findOne(query);
    if (!schedule) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Schedule not found or access denied");
    }
    schedule.isActive = false;
    await schedule.save();
};
const getWeeklySchedule = async (schoolId, grade, section) => {
    const school = await school_model_1.School.findById(schoolId);
    if (!school) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "School not found");
    }
    return await schedule_model_1.Schedule.generateWeeklySchedule(schoolId, grade, section);
};
const getTeacherSchedule = async (teacherId) => {
    const teacher = await teacher_model_1.Teacher.findById(teacherId);
    if (!teacher) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Teacher not found");
    }
    return await schedule_model_1.Schedule.getTeacherWorkload(teacherId);
};
const assignSubstituteTeacher = async (scheduleId, periodNumber, substituteTeacherId, startDate, endDate, reason) => {
    const session = await (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const schedule = await schedule_model_1.Schedule.findById(scheduleId).session(session);
        if (!schedule) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Schedule not found");
        }
        const teacher = await teacher_model_1.Teacher.findById(substituteTeacherId).session(session);
        if (!teacher) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Substitute teacher not found");
        }
        const period = schedule.periods.find((p) => p.periodNumber === periodNumber);
        if (!period) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Period not found");
        }
        if (period.isBreak) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Cannot assign substitute teacher to break period");
        }
        const hasConflict = await schedule_model_1.Schedule.checkTeacherConflict(substituteTeacherId, schedule.dayOfWeek, periodNumber, period.startTime, period.endTime, scheduleId);
        if (hasConflict) {
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Substitute teacher has a conflict between ${period.startTime} and ${period.endTime} on ${schedule.dayOfWeek}`);
        }
        period.teacherId = substituteTeacherId;
        await schedule.save({ session });
        await session.commitTransaction();
        const result = await schedule_model_1.Schedule.findById(scheduleId)
            .populate("schoolId", "name")
            .populate("periods.subjectId", "name code")
            .populate({
            path: "periods.teacherId",
            select: "userId teacherId",
            populate: {
                path: "userId",
                select: "firstName lastName",
            },
        });
        if (!result) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve schedule with substitute teacher");
        }
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
const getScheduleStats = async (schoolId) => {
    const school = await school_model_1.School.findById(schoolId);
    if (!school) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "School not found");
    }
    const [totalSchedules, activeSchedules, gradeStats, dayStats, teacherSchedules, subjectSchedules,] = await Promise.all([
        schedule_model_1.Schedule.countDocuments({ schoolId }),
        schedule_model_1.Schedule.countDocuments({ schoolId, isActive: true }),
        schedule_model_1.Schedule.aggregate([
            { $match: { schoolId: schoolId } },
            {
                $group: {
                    _id: "$grade",
                    scheduleCount: { $sum: 1 },
                    sections: { $addToSet: "$section" },
                },
            },
            {
                $project: {
                    grade: "$_id",
                    scheduleCount: 1,
                    sectionsCount: { $size: "$sections" },
                },
            },
            { $sort: { grade: 1 } },
        ]),
        schedule_model_1.Schedule.aggregate([
            { $match: { schoolId: schoolId } },
            { $group: { _id: "$dayOfWeek", scheduleCount: { $sum: 1 } } },
            { $project: { dayOfWeek: "$_id", scheduleCount: 1 } },
        ]),
        schedule_model_1.Schedule.aggregate([
            { $match: { schoolId: schoolId, isActive: true } },
            { $unwind: "$periods" },
            { $match: { "periods.isBreak": { $ne: true } } },
            {
                $group: {
                    _id: "$periods.teacherId",
                    totalPeriods: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "teachers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "teacher",
                },
            },
            { $unwind: "$teacher" },
            {
                $lookup: {
                    from: "users",
                    localField: "teacher.userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    teacherId: "$_id",
                    teacherName: { $concat: ["$user.firstName", " ", "$user.lastName"] },
                    totalPeriods: 1,
                    utilizationPercentage: {
                        $multiply: [{ $divide: ["$totalPeriods", 30] }, 100],
                    },
                },
            },
            { $sort: { totalPeriods: -1 } },
        ]),
        schedule_model_1.Schedule.aggregate([
            { $match: { schoolId: schoolId, isActive: true } },
            { $unwind: "$periods" },
            { $match: { "periods.isBreak": { $ne: true } } },
            {
                $group: {
                    _id: "$periods.subjectId",
                    totalPeriods: { $sum: 1 },
                    classes: { $addToSet: { grade: "$grade", section: "$section" } },
                },
            },
            {
                $lookup: {
                    from: "subjects",
                    localField: "_id",
                    foreignField: "_id",
                    as: "subject",
                },
            },
            { $unwind: "$subject" },
            {
                $project: {
                    subjectId: "$_id",
                    subjectName: "$subject.name",
                    totalPeriods: 1,
                    classesCount: { $size: "$classes" },
                },
            },
            { $sort: { totalPeriods: -1 } },
        ]),
    ]);
    return {
        totalSchedules,
        activeSchedules,
        byGrade: gradeStats,
        byDayOfWeek: dayStats,
        teacherUtilization: teacherSchedules,
        subjectDistribution: subjectSchedules,
    };
};
const bulkCreateSchedules = async (schedulesData) => {
    const session = await (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const schoolIds = [...new Set(schedulesData.map((s) => s.schoolId))];
        const schools = await school_model_1.School.find({ _id: { $in: schoolIds } }).session(session);
        if (schools.length !== schoolIds.length) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "One or more schools not found");
        }
        for (const scheduleData of schedulesData) {
            const existingSchedule = await schedule_model_1.Schedule.findOne({
                schoolId: scheduleData.schoolId,
                grade: scheduleData.grade,
                section: scheduleData.section,
                dayOfWeek: scheduleData.dayOfWeek,
                academicYear: scheduleData.academicYear,
                isActive: true,
            }).session(session);
            if (existingSchedule) {
                throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Schedule already exists for Grade ${scheduleData.grade} Section ${scheduleData.section} on ${scheduleData.dayOfWeek}`);
            }
        }
        const schedules = await schedule_model_1.Schedule.insertMany(schedulesData, { session });
        await session.commitTransaction();
        return schedules;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.ScheduleService = {
    createSchedule,
    clearSchedulesForClass,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    getWeeklySchedule,
    getTeacherSchedule,
    assignSubstituteTeacher,
    getScheduleStats,
    bulkCreateSchedules,
};
//# sourceMappingURL=schedule.service.js.map