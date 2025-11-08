"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceAbsenceSmsService = void 0;
exports.listAbsenceSmsLogs = listAbsenceSmsLogs;
exports.getAbsenceSmsOverview = getAbsenceSmsOverview;
exports.triggerAbsenceSmsRun = triggerAbsenceSmsRun;
exports.sendAbsenceSmsTest = sendAbsenceSmsTest;
const date_fns_tz_1 = require("date-fns-tz");
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = require("../../errors/AppError");
const class_model_1 = require("../class/class.model");
const student_model_1 = require("../student/student.model");
const parent_model_1 = require("../parent/parent.model");
const school_model_1 = require("../school/school.model");
const absence_sms_log_model_1 = require("./absence-sms-log.model");
const day_attendance_model_1 = require("./day-attendance.model");
const orange_sms_service_1 = require("../orange-sms/orange-sms.service");
const holiday_utils_1 = require("./holiday-utils");
class AttendanceAbsenceSmsService {
    constructor() {
        this.processing = false;
        this.schoolNameCache = new Map();
    }
    async runScheduledDispatch(now = new Date()) {
        if (this.processing) {
            return;
        }
        this.processing = true;
        try {
            const classes = await class_model_1.Class.find({
                isActive: true,
                'absenceSmsSettings.enabled': true,
            })
                .select('grade section schoolId className absenceSmsSettings')
                .lean();
            if (!classes.length) {
                return;
            }
            const schoolIds = Array.from(new Set(classes.map((classDoc) => classDoc.schoolId.toString())));
            const schools = await school_model_1.School.find({ _id: { $in: schoolIds } })
                .select('_id name settings.timezone')
                .lean();
            const timezoneMap = new Map();
            schools.forEach((schoolDoc) => {
                const key = schoolDoc._id.toString();
                const tz = schoolDoc.settings?.timezone || config_1.default.school_timezone || 'UTC';
                timezoneMap.set(key, tz);
                if (schoolDoc.name) {
                    this.schoolNameCache.set(key, schoolDoc.name);
                }
            });
            for (const classDoc of classes) {
                const schoolId = classDoc.schoolId.toString();
                const sendAfter = classDoc.absenceSmsSettings?.sendAfterTime || '11:00';
                const timezone = timezoneMap.get(schoolId) || config_1.default.school_timezone || 'UTC';
                const context = this.getTimeContext(now, timezone);
                if (!this.isTimeReached(sendAfter, context.timeString)) {
                    continue;
                }
                const isHoliday = await (0, holiday_utils_1.isHolidayForClassOnDate)({
                    schoolId: classDoc.schoolId,
                    dateKey: context.dateKey,
                    timezone: context.timezone,
                    grade: classDoc.grade,
                    section: classDoc.section,
                });
                if (isHoliday) {
                    continue;
                }
                await this.processClass(classDoc, context);
            }
        }
        finally {
            this.processing = false;
        }
    }
    getTimeContext(now, timezone) {
        return {
            dateKey: (0, date_fns_tz_1.formatInTimeZone)(now, timezone, 'yyyy-MM-dd'),
            timeString: (0, date_fns_tz_1.formatInTimeZone)(now, timezone, 'HH:mm'),
            timezone,
        };
    }
    isTimeReached(threshold, current) {
        return this.timeToMinutes(current) >= this.timeToMinutes(threshold);
    }
    timeToMinutes(time) {
        const [hour, minute] = time.split(':').map((value) => parseInt(value, 10));
        if (Number.isNaN(hour) || Number.isNaN(minute)) {
            return 0;
        }
        return hour * 60 + minute;
    }
    async processClass(classDoc, context) {
        const studentDocs = await student_model_1.Student.find({
            schoolId: classDoc.schoolId,
            grade: classDoc.grade,
            section: classDoc.section,
            isActive: true,
        })
            .populate('userId', 'firstName lastName')
            .select('_id userId grade section schoolId studentId')
            .exec();
        if (!studentDocs.length) {
            return;
        }
        const studentIds = studentDocs.map((student) => student._id);
        const attendanceRecords = await day_attendance_model_1.StudentDayAttendance.find({
            schoolId: classDoc.schoolId,
            studentId: { $in: studentIds },
            dateKey: context.dateKey,
            finalStatus: 'absent',
            teacherStatus: 'absent',
            autoStatus: { $ne: 'present' },
        })
            .select('studentId')
            .lean();
        if (!attendanceRecords.length) {
            return;
        }
        const studentMap = new Map();
        studentDocs.forEach((student) => {
            studentMap.set(student._id.toString(), student);
        });
        const parents = await parent_model_1.Parent.find({
            schoolId: classDoc.schoolId,
            isActive: true,
            children: { $in: studentIds },
            'preferences.receiveAttendanceAlerts': true,
        })
            .populate('userId', 'firstName lastName phone')
            .select('children preferences userId')
            .exec();
        if (!parents.length) {
            return;
        }
        const parentUserIds = new Set();
        const parentsByStudent = new Map();
        parents.forEach((parentDoc) => {
            const parentUser = parentDoc.userId;
            const parentUserId = parentUser?._id?.toString();
            if (parentUserId) {
                parentUserIds.add(parentUserId);
            }
            parentDoc.children.forEach((childId) => {
                const key = childId.toString();
                if (!parentsByStudent.has(key)) {
                    parentsByStudent.set(key, []);
                }
                parentsByStudent.get(key).push(parentDoc);
            });
        });
        if (!parentUserIds.size) {
            return;
        }
        const logDocs = await absence_sms_log_model_1.AbsenceSmsLog.find({
            studentId: { $in: studentIds },
            parentUserId: { $in: Array.from(parentUserIds).map((id) => new mongoose_1.Types.ObjectId(id)) },
            dateKey: context.dateKey,
        })
            .select('studentId parentUserId status')
            .lean();
        const logMap = new Map();
        logDocs.forEach((log) => {
            if (log.parentUserId) {
                const key = `${log.studentId.toString()}-${log.parentUserId.toString()}`;
                logMap.set(key, log.status);
            }
        });
        const schoolName = await this.getSchoolName(classDoc.schoolId.toString());
        for (const record of attendanceRecords) {
            const studentId = record.studentId.toString();
            const student = studentMap.get(studentId);
            if (!student) {
                continue;
            }
            const parentList = parentsByStudent.get(studentId);
            if (!parentList?.length) {
                console.info(`[AbsenceSMS] Skipping student ${studentId} on ${context.dateKey} - no active parents with attendance alerts`);
                continue;
            }
            for (const parent of parentList) {
                const parentUser = parent.userId;
                const parentUserId = parentUser?._id;
                if (!parentUserId) {
                    console.warn(`[AbsenceSMS] Parent document missing user reference for student ${studentId}; skipping`);
                    continue;
                }
                const logKey = `${studentId}-${parentUserId.toString()}`;
                if (logMap.get(logKey) === 'sent') {
                    continue;
                }
                if (!this.canNotifyParent(parent)) {
                    console.info(`[AbsenceSMS] Parent ${parentUserId.toString()} opted out of attendance SMS; skipping`);
                    continue;
                }
                const phoneNumber = parentUser.phone;
                if (!phoneNumber) {
                    console.warn(`[AbsenceSMS] Parent ${parentUserId.toString()} has no phone number on record; skipping`);
                    continue;
                }
                const message = this.buildMessage({
                    student,
                    schoolName,
                });
                let sendStatus = 'failed';
                let resourceId;
                let errorMessage;
                try {
                    const result = await orange_sms_service_1.orangeSmsService.sendSms({
                        phoneNumber,
                        message,
                    });
                    sendStatus = result.status;
                    resourceId = result.resourceId;
                    errorMessage = result.error;
                }
                catch (error) {
                    if (error instanceof AppError_1.AppError) {
                        throw error;
                    }
                    errorMessage = error.message;
                }
                await absence_sms_log_model_1.AbsenceSmsLog.findOneAndUpdate({
                    studentId: student._id,
                    parentUserId,
                    dateKey: context.dateKey,
                }, {
                    $set: {
                        schoolId: student.schoolId,
                        classId: classDoc._id,
                        parentId: parent._id,
                        message,
                        status: sendStatus,
                        providerMessageId: resourceId,
                        errorMessage,
                        lastAttemptAt: new Date(),
                    },
                    $inc: {
                        attempts: 1,
                    },
                }, {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                }).exec();
                logMap.set(logKey, sendStatus);
                const studentUser = student.userId;
                const studentName = [studentUser?.firstName, studentUser?.lastName]
                    .filter(Boolean)
                    .join(" ")
                    .trim() || student.studentId;
                if (sendStatus === "sent") {
                    console.log(`[AbsenceSMS] Sent absence alert to ${normalizedRecipientLog(phoneNumber)} for ${studentName} (studentId: ${student.studentId}) on ${context.dateKey}`);
                }
                else {
                    console.warn(`[AbsenceSMS] Failed to send absence alert to ${normalizedRecipientLog(phoneNumber)} for ${studentName} (studentId: ${student.studentId}) - ${errorMessage ?? "unknown error"}`);
                }
            }
        }
    }
    async getSchoolName(schoolId) {
        if (this.schoolNameCache.has(schoolId)) {
            return this.schoolNameCache.get(schoolId);
        }
        const school = await school_model_1.School.findById(schoolId).select('name').lean();
        const schoolName = school?.name || 'Votre école';
        this.schoolNameCache.set(schoolId, schoolName);
        return schoolName;
    }
    canNotifyParent(parent) {
        const preferences = parent.preferences || {};
        if (preferences.receiveAttendanceAlerts === false) {
            return false;
        }
        const method = preferences.communicationMethod || 'All';
        return method === 'All' || method === 'SMS';
    }
    buildMessage({ student, schoolName, }) {
        const studentUser = student.userId;
        const studentName = [studentUser?.firstName, studentUser?.lastName]
            .filter(Boolean)
            .join(' ')
            .trim() || 'votre enfant';
        return composeAbsenceMessage(studentName, schoolName);
    }
}
exports.attendanceAbsenceSmsService = new AttendanceAbsenceSmsService();
function normalizedRecipientLog(phone) {
    if (!phone) {
        return "<no-phone>";
    }
    return phone.replace(/\s+/g, "");
}
const composeAbsenceMessage = (studentName, schoolName) => `Madame / Monsieur,
Votre enfant ${studentName} a été absent(e) aujourd’hui.
Merci de contacter l’école pour la justification.
Cordialement,
Direction ${schoolName}`;
async function listAbsenceSmsLogs(options) {
    const { schoolId, status, date, page = 1, limit = 20, messageQuery, } = options;
    let schoolObjectId;
    try {
        schoolObjectId = new mongoose_1.Types.ObjectId(schoolId);
    }
    catch {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid school ID');
    }
    const filter = {
        schoolId: schoolObjectId,
    };
    if (status) {
        filter.status = status;
    }
    if (date) {
        filter.dateKey = date;
    }
    if (messageQuery) {
        filter.message = { $regex: messageQuery, $options: 'i' };
    }
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
        absence_sms_log_model_1.AbsenceSmsLog.find(filter)
            .sort({ lastAttemptAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
            path: 'studentId',
            select: 'studentId grade section userId',
            populate: {
                path: 'userId',
                select: 'firstName lastName',
            },
        })
            .populate({
            path: 'parentUserId',
            select: 'firstName lastName phone',
        })
            .populate({
            path: 'parentId',
            select: 'parentId relationship',
        })
            .populate({
            path: 'classId',
            select: 'grade section className',
        })
            .lean(),
        absence_sms_log_model_1.AbsenceSmsLog.countDocuments(filter),
    ]);
    return {
        data: logs,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
        },
    };
}
async function getAbsenceSmsOverview(schoolId, date) {
    let schoolObjectId;
    try {
        schoolObjectId = new mongoose_1.Types.ObjectId(schoolId);
    }
    catch {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid school ID');
    }
    const schoolDoc = await school_model_1.School.findById(schoolObjectId)
        .select('_id name settings.timezone')
        .lean();
    const timezone = schoolDoc?.settings?.timezone || config_1.default.school_timezone || 'UTC';
    const now = new Date();
    const currentTime = (0, date_fns_tz_1.formatInTimeZone)(now, timezone, 'HH:mm');
    const currentMinutes = timeStringToMinutes(currentTime);
    const targetDateKey = date || (0, date_fns_tz_1.formatInTimeZone)(now, timezone, 'yyyy-MM-dd');
    const rawClasses = await class_model_1.Class.find({
        schoolId: schoolObjectId,
        isActive: true,
        'absenceSmsSettings.enabled': true,
    })
        .select('grade section className absenceSmsSettings')
        .lean();
    const holidayStatuses = await Promise.all(rawClasses.map(async (cls) => ({
        id: cls._id.toString(),
        isHoliday: await (0, holiday_utils_1.isHolidayForClassOnDate)({
            schoolId: schoolObjectId,
            dateKey: targetDateKey,
            timezone,
            grade: cls.grade,
            section: cls.section,
        }),
    })));
    const holidayMap = new Map(holidayStatuses.map((item) => [item.id, item.isHoliday]));
    const classes = rawClasses.filter((cls) => !holidayMap.get(cls._id.toString()));
    if (!classes.length) {
        return {
            dateKey: targetDateKey,
            timezone,
            currentTime,
            nextDispatchCheck: computeNextDispatchTime(now, timezone),
            totals: {
                pendingBeforeCutoff: 0,
                pendingAfterCutoff: 0,
                sentToday: 0,
                failedToday: 0,
            },
            classes: [],
            pending: [],
        };
    }
    const gradeSet = new Set(classes.map((cls) => cls.grade));
    const sectionSet = new Set(classes
        .map((cls) => cls.section)
        .filter((section) => Boolean(section)));
    const studentQuery = {
        schoolId: schoolObjectId,
        isActive: true,
    };
    if (gradeSet.size) {
        studentQuery.grade = { $in: Array.from(gradeSet) };
    }
    if (sectionSet.size) {
        studentQuery.section = { $in: Array.from(sectionSet) };
    }
    const students = await student_model_1.Student.find(studentQuery)
        .select('_id grade section studentId userId')
        .populate('userId', 'firstName lastName')
        .lean();
    const studentsByClass = new Map();
    students.forEach((student) => {
        const key = `${student.grade}-${(student.section || '').toUpperCase()}`;
        if (!studentsByClass.has(key)) {
            studentsByClass.set(key, []);
        }
        studentsByClass.get(key).push(student);
    });
    const allStudentIds = students.map((student) => student._id);
    const attendanceRecords = await day_attendance_model_1.StudentDayAttendance.find({
        schoolId: schoolObjectId,
        studentId: { $in: allStudentIds },
        dateKey: targetDateKey,
    })
        .select('studentId teacherStatus finalStatus dateKey')
        .lean();
    const smsLogs = await absence_sms_log_model_1.AbsenceSmsLog.find({
        schoolId: schoolObjectId,
        dateKey: targetDateKey,
    })
        .populate({
        path: 'studentId',
        select: 'studentId grade section userId',
        populate: {
            path: 'userId',
            select: 'firstName lastName',
        },
    })
        .populate({ path: 'parentUserId', select: 'firstName lastName phone' })
        .populate({ path: 'parentId', select: 'parentId relationship' })
        .lean();
    const logsByStudent = new Map();
    smsLogs.forEach((log) => {
        const studentId = log.studentId?._id?.toString?.() || log.studentId?.toString?.();
        if (studentId) {
            if (!logsByStudent.has(studentId)) {
                logsByStudent.set(studentId, []);
            }
            logsByStudent.get(studentId).push(log);
        }
    });
    let totalPendingBefore = 0;
    let totalPendingAfter = 0;
    let totalSent = 0;
    let totalFailed = 0;
    const pendingSummaries = [];
    const classesSummary = classes.map((cls) => {
        const classKey = `${cls.grade}-${(cls.section || '').toUpperCase()}`;
        const classStudents = studentsByClass.get(classKey) || [];
        const studentIdSet = new Set(classStudents.map((student) => student._id.toString()));
        const classAttendance = attendanceRecords.filter((record) => studentIdSet.has(record.studentId.toString()));
        const absentRecords = classAttendance.filter((record) => record.teacherStatus === 'absent' && record.finalStatus === 'absent');
        const sendAfterTime = cls.absenceSmsSettings?.sendAfterTime || '11:00';
        const sendAfterMinutes = timeStringToMinutes(sendAfterTime);
        let pendingBeforeCutoff = 0;
        let pendingAfterCutoff = 0;
        let sentCount = 0;
        let failedCount = 0;
        const classLogs = [];
        classStudents.forEach((student) => {
            const studentLogs = logsByStudent.get(student._id.toString()) || [];
            if (studentLogs.length) {
                classLogs.push(...studentLogs);
            }
        });
        classLogs.forEach((log) => {
            if (log.status === 'sent') {
                sentCount += 1;
            }
            else if (log.status === 'failed') {
                failedCount += 1;
            }
        });
        absentRecords.forEach((record) => {
            const studentLogs = logsByStudent.get(record.studentId.toString()) || [];
            const hasSuccessfulLog = studentLogs.some((log) => log.status === 'sent');
            const hasAttempt = studentLogs.length > 0;
            if (hasSuccessfulLog) {
                return;
            }
            if (currentMinutes >= sendAfterMinutes) {
                pendingAfterCutoff += 1;
            }
            else if (!hasAttempt) {
                pendingBeforeCutoff += 1;
            }
        });
        totalPendingBefore += pendingBeforeCutoff;
        totalPendingAfter += pendingAfterCutoff;
        totalSent += sentCount;
        totalFailed += failedCount;
        if (pendingBeforeCutoff || pendingAfterCutoff) {
            pendingSummaries.push({
                classKey,
                className: cls.className || `Grade ${cls.grade} - Section ${cls.section}`,
                grade: cls.grade,
                section: cls.section,
                sendAfterTime,
                pendingBeforeCutoff,
                pendingAfterCutoff,
                sentCount,
                failedCount,
            });
        }
        return {
            classKey,
            grade: cls.grade,
            section: cls.section,
            className: cls.className || `Grade ${cls.grade} - Section ${cls.section}`,
            sendAfterTime,
            pendingBeforeCutoff,
            pendingAfterCutoff,
            sentCount,
            failedCount,
            totalAbsent: absentRecords.length,
        };
    });
    return {
        dateKey: targetDateKey,
        timezone,
        currentTime,
        nextDispatchCheck: computeNextDispatchTime(now, timezone),
        totals: {
            pendingBeforeCutoff: totalPendingBefore,
            pendingAfterCutoff: totalPendingAfter,
            sentToday: totalSent,
            failedToday: totalFailed,
        },
        classes: classesSummary,
        pending: pendingSummaries.sort((a, b) => timeStringToMinutes(a.sendAfterTime) - timeStringToMinutes(b.sendAfterTime)),
    };
}
async function triggerAbsenceSmsRun() {
    await exports.attendanceAbsenceSmsService.runScheduledDispatch();
    return {
        triggeredAt: new Date().toISOString(),
    };
}
async function sendAbsenceSmsTest(params) {
    const { phoneNumber, studentName = 'votre enfant', schoolName = 'Votre école', message, senderName, } = params;
    const smsMessage = message ?? composeAbsenceMessage(studentName, schoolName);
    const result = await orange_sms_service_1.orangeSmsService.sendSms({
        phoneNumber,
        message: smsMessage,
        senderNameOverride: senderName,
    });
    return {
        status: result.status,
        resourceId: result.resourceId,
        error: result.error,
    };
}
function timeStringToMinutes(time) {
    const [hourStr, minuteStr] = time.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
        return 0;
    }
    return hour * 60 + minute;
}
function getDispatchIntervalMinutes() {
    const candidate = Number(config_1.default.absence_sms_dispatch_interval_minutes);
    if (!Number.isFinite(candidate) || candidate <= 0) {
        return 5;
    }
    return Math.max(Math.floor(candidate), 1);
}
function computeNextDispatchTime(now, timezone) {
    const interval = getDispatchIntervalMinutes();
    const next = new Date(now.getTime());
    const remainder = next.getMinutes() % interval;
    const minutesToAdd = remainder === 0 ? interval : interval - remainder;
    next.setMinutes(next.getMinutes() + minutesToAdd, 0, 0);
    return (0, date_fns_tz_1.formatInTimeZone)(next, timezone, 'HH:mm');
}
//# sourceMappingURL=absence-sms.service.js.map