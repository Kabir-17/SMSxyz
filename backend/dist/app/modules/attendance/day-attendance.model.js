"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentDayAttendance = void 0;
exports.normaliseDateKey = normaliseDateKey;
const mongoose_1 = require("mongoose");
const date_fns_tz_1 = require("date-fns-tz");
const config_1 = __importDefault(require("../../config"));
const student_model_1 = require("../student/student.model");
const STATUSES = ['present', 'absent', 'late', 'excused', 'pending'];
const historySchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: STATUSES,
        required: true,
    },
    source: {
        type: String,
        enum: ['auto', 'teacher', 'finalizer'],
        required: true,
    },
    markedAt: {
        type: Date,
        required: true,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
    },
}, { _id: false });
const studentDayAttendanceSchema = new mongoose_1.Schema({
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
        index: true,
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true,
    },
    studentCode: {
        type: String,
        required: true,
        index: true,
    },
    date: {
        type: Date,
        required: true,
        index: true,
    },
    dateKey: {
        type: String,
        required: true,
        index: true,
    },
    autoStatus: {
        type: String,
        enum: STATUSES,
    },
    autoMarkedAt: {
        type: Date,
    },
    autoEventId: {
        type: String,
    },
    teacherStatus: {
        type: String,
        enum: STATUSES,
    },
    teacherMarkedAt: {
        type: Date,
    },
    teacherMarkedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Teacher',
    },
    teacherOverride: {
        type: Boolean,
        default: false,
    },
    finalStatus: {
        type: String,
        enum: STATUSES,
        default: 'pending',
        index: true,
    },
    finalSource: {
        type: String,
        enum: ['auto', 'teacher', 'finalizer'],
        default: 'auto',
    },
    finalized: {
        type: Boolean,
        default: false,
        index: true,
    },
    finalizedAt: {
        type: Date,
    },
    history: {
        type: [historySchema],
        default: [],
    },
}, {
    timestamps: true,
    versionKey: false,
});
studentDayAttendanceSchema.index({
    schoolId: 1,
    dateKey: 1,
    studentId: 1
});
function normaliseDateKey(date, timezone = config_1.default.school_timezone || 'UTC') {
    const raw = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
    if (Number.isNaN(raw.getTime())) {
        throw new Error('Cannot normalise invalid date');
    }
    const dateKey = (0, date_fns_tz_1.formatInTimeZone)(raw, timezone, 'yyyy-MM-dd');
    const utcStartOfDay = (0, date_fns_tz_1.fromZonedTime)(`${dateKey}T00:00:00`, timezone);
    return { date: utcStartOfDay, dateKey };
}
studentDayAttendanceSchema.statics.markFromAuto = async function (params) {
    const { schoolId, studentId, eventId, capturedAt, dateKey } = params;
    const date = new Date(`${dateKey}T00:00:00.000Z`);
    const historyEntry = {
        status: 'present',
        source: 'auto',
        markedAt: capturedAt,
        metadata: { eventId },
    };
    const existing = await this.findOne({ schoolId, studentId, dateKey });
    if (!existing) {
        return this.create({
            schoolId,
            studentId,
            studentCode: params.studentCode,
            date,
            dateKey,
            autoStatus: 'present',
            autoMarkedAt: capturedAt,
            autoEventId: eventId,
            teacherOverride: false,
            finalStatus: 'present',
            finalSource: 'auto',
            finalized: false,
            history: [historyEntry],
        });
    }
    existing.autoStatus = 'present';
    existing.autoMarkedAt = capturedAt;
    existing.autoEventId = eventId;
    if (!existing.studentCode) {
        existing.studentCode = params.studentCode;
    }
    existing.history.push(historyEntry);
    if (!existing.teacherOverride) {
        existing.finalStatus = 'present';
        existing.finalSource = 'auto';
        existing.finalized = false;
        existing.finalizedAt = undefined;
    }
    else {
        console.warn(`[StudentDayAttendance] Ignoring auto-attend event for student ${params.studentCode} ` +
            `on ${dateKey} - teacher override already in place ` +
            `(teacher: ${existing.teacherStatus}, auto: present)`);
    }
    await existing.save();
    return existing;
};
studentDayAttendanceSchema.statics.markFromTeacher = async function (params) {
    const { schoolId, studentId, teacherId, status, date, dateKey } = params;
    const timezone = params.timezone || config_1.default.school_timezone || 'UTC';
    const { date: normalizedDate, dateKey: normalizedKey } = normaliseDateKey(date, timezone);
    const effectiveKey = dateKey || normalizedKey;
    const matchingDate = dateKey ? (0, date_fns_tz_1.fromZonedTime)(`${dateKey}T00:00:00`, timezone) : normalizedDate;
    const historyEntry = {
        status,
        source: 'teacher',
        markedAt: new Date(),
        metadata: { teacherId },
    };
    const doc = await this.findOne({ schoolId, studentId, dateKey: effectiveKey });
    if (!doc) {
        return this.create({
            schoolId,
            studentId,
            studentCode: params.studentCode || '',
            date: matchingDate,
            dateKey: effectiveKey,
            teacherStatus: status,
            teacherMarkedAt: new Date(),
            teacherMarkedBy: teacherId,
            teacherOverride: true,
            finalStatus: status,
            finalSource: 'teacher',
            finalized: false,
            history: [historyEntry],
        });
    }
    if (params.studentCode && !doc.studentCode) {
        doc.studentCode = params.studentCode;
    }
    doc.teacherStatus = status;
    doc.teacherMarkedAt = new Date();
    doc.teacherMarkedBy = teacherId;
    doc.teacherOverride = true;
    doc.finalStatus = status;
    doc.finalSource = 'teacher';
    doc.finalized = false;
    doc.finalizedAt = undefined;
    doc.history.push(historyEntry);
    await doc.save();
    return doc;
};
studentDayAttendanceSchema.statics.finalizeForDate = async function (schoolId, date, dateKey, finalizeTime, timezone = config_1.default.school_timezone || 'UTC') {
    const now = new Date();
    const fallbackFinalize = config_1.default.auto_attend_finalization_time || '17:00';
    const timeString = finalizeTime || fallbackFinalize;
    let finalizationMoment = (0, date_fns_tz_1.fromZonedTime)(`${dateKey}T00:00:00`, timezone);
    if (timeString.includes(':')) {
        const [hourStr, minuteStr] = timeString.split(':');
        const hour = Number(hourStr);
        const minute = Number(minuteStr);
        if (!Number.isNaN(hour) && !Number.isNaN(minute)) {
            finalizationMoment = (0, date_fns_tz_1.fromZonedTime)(`${dateKey}T${hourStr.padStart(2, '0')}:${minuteStr.padStart(2, '0')}:00`, timezone);
        }
    }
    if (now < finalizationMoment) {
        return;
    }
    const needsFinalization = await this.countDocuments({
        schoolId,
        dateKey,
        finalized: { $ne: true },
    });
    if (needsFinalization === 0) {
        return;
    }
    const existingRecords = await this.find({ schoolId, dateKey }).select('studentId teacherOverride finalStatus');
    const existingMap = new Map();
    existingRecords.forEach((record) => existingMap.set(record.studentId.toString(), record.studentId));
    const students = await student_model_1.Student.find({ schoolId, isActive: true }).select('_id studentId');
    const nowIso = now;
    const bulkInserts = [];
    students.forEach((student) => {
        if (!existingMap.has(student._id.toString())) {
            bulkInserts.push({
                schoolId,
                studentId: student._id,
                studentCode: student.studentId,
                date,
                dateKey,
                teacherOverride: false,
                autoStatus: 'pending',
                finalStatus: 'absent',
                finalSource: 'finalizer',
                finalized: true,
                finalizedAt: nowIso,
                history: [
                    {
                        status: 'absent',
                        source: 'finalizer',
                        markedAt: nowIso,
                    },
                ],
            });
        }
    });
    if (bulkInserts.length > 0) {
        await this.insertMany(bulkInserts, { ordered: false });
        console.log(`[StudentDayAttendance] Created ${bulkInserts.length} new absent records ` +
            `for ${dateKey} (school: ${schoolId})`);
    }
    const updateResult = await this.updateMany({
        schoolId,
        dateKey,
        teacherOverride: { $ne: true },
        finalized: { $ne: true },
        finalStatus: { $nin: ['present', 'late', 'excused'] },
    }, {
        $set: {
            finalStatus: 'absent',
            finalSource: 'finalizer',
            finalized: true,
            finalizedAt: nowIso,
        },
        $push: {
            history: {
                status: 'absent',
                source: 'finalizer',
                markedAt: nowIso,
            },
        },
    });
    if (updateResult.modifiedCount > 0) {
        console.log(`[StudentDayAttendance] Finalized ${updateResult.modifiedCount} students ` +
            `as absent for ${dateKey} (school: ${schoolId})`);
    }
};
studentDayAttendanceSchema.statics.getStatusMap = async function (schoolId, dateKeys) {
    if (!dateKeys.length) {
        return new Map();
    }
    const docs = await this.find({ schoolId, dateKey: { $in: dateKeys } });
    const map = new Map();
    docs.forEach((doc) => {
        map.set(`${doc.studentId.toString()}-${doc.dateKey}`, doc);
        if (doc.studentCode) {
            map.set(`${doc.studentCode}-${doc.dateKey}`, doc);
        }
    });
    return map;
};
exports.StudentDayAttendance = (0, mongoose_1.model)('StudentDayAttendance', studentDayAttendanceSchema);
//# sourceMappingURL=day-attendance.model.js.map