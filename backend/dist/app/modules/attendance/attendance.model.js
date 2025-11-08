"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attendance = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = require("../../errors/AppError");
const class_model_1 = require("../class/class.model");
const student_model_1 = require("../student/student.model");
const day_attendance_model_1 = require("./day-attendance.model");
const holiday_utils_1 = require("./holiday-utils");
const studentAttendanceSchema = new mongoose_1.Schema({
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student ID is required'],
    },
    status: {
        type: String,
        required: [true, 'Attendance status is required'],
        enum: {
            values: ['present', 'absent', 'late', 'excused'],
            message: 'Status must be present, absent, late, or excused',
        },
    },
    markedAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
    },
    modifiedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    modificationReason: {
        type: String,
        maxlength: [200, 'Modification reason cannot exceed 200 characters'],
    },
}, {
    _id: false,
});
const attendanceSchema = new mongoose_1.Schema({
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School ID is required'],
        index: true,
    },
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: [true, 'Teacher ID is required'],
        index: true,
    },
    subjectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'Subject ID is required'],
        index: true,
    },
    classId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Class',
        required: [true, 'Class ID is required'],
        index: true,
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        index: true,
        validate: {
            validator: function (date) {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(23, 59, 59, 999);
                return date <= tomorrow;
            },
            message: 'Cannot mark attendance for dates beyond tomorrow',
        },
    },
    period: {
        type: Number,
        required: [true, 'Period is required'],
        min: [1, 'Period must be at least 1'],
        max: [config_1.default.max_periods_per_day || 8, 'Period cannot exceed maximum periods per day'],
        index: true,
    },
    students: [studentAttendanceSchema],
    markedAt: {
        type: Date,
        required: [true, 'Marked at time is required'],
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
    },
    modifiedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    isLocked: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
attendanceSchema.methods.canBeModified = function () {
    if (this.isLocked) {
        return false;
    }
    const maxEditTime = (config_1.default.max_attendance_edit_hours || 2) * 60 * 60 * 1000;
    const now = new Date();
    const markedTime = this.modifiedAt || this.markedAt;
    const timeDiff = now.getTime() - markedTime.getTime();
    return timeDiff <= maxEditTime;
};
attendanceSchema.methods.lockAttendance = function () {
    this.isLocked = true;
};
attendanceSchema.methods.getAttendanceStats = function () {
    const totalStudents = this.students.length;
    const presentCount = this.students.filter(s => s.status === 'present').length;
    const absentCount = this.students.filter(s => s.status === 'absent').length;
    const lateCount = this.students.filter(s => s.status === 'late').length;
    const excusedCount = this.students.filter(s => s.status === 'excused').length;
    const attendancePercentage = totalStudents > 0
        ? Math.round(((presentCount + lateCount) / totalStudents) * 100)
        : 0;
    return {
        totalStudents,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        attendancePercentage,
    };
};
attendanceSchema.methods.getStudentStatus = function (studentId) {
    const student = this.students.find(s => s.studentId.toString() === studentId);
    return student ? student.status : null;
};
attendanceSchema.methods.updateStudentStatus = function (studentId, status, modifiedBy, reason) {
    if (!this.canBeModified()) {
        return false;
    }
    const student = this.students.find(s => s.studentId.toString() === studentId);
    if (!student) {
        return false;
    }
    student.status = status;
    student.modifiedAt = new Date();
    student.modifiedBy = new mongoose_1.Types.ObjectId(modifiedBy);
    if (reason) {
        student.modificationReason = reason;
    }
    this.modifiedAt = new Date();
    this.modifiedBy = new mongoose_1.Types.ObjectId(modifiedBy);
    return true;
};
attendanceSchema.statics.markAttendance = async function (teacherId, classId, subjectId, date, period, attendanceData) {
    const teacherObjectId = new mongoose_1.Types.ObjectId(teacherId);
    const classObjectId = new mongoose_1.Types.ObjectId(classId);
    const subjectObjectId = new mongoose_1.Types.ObjectId(subjectId);
    const Teacher = (0, mongoose_1.model)('Teacher');
    const teacher = await Teacher.findById(teacherObjectId).populate('schoolId');
    if (!teacher) {
        throw new Error('Teacher not found');
    }
    const classDoc = await class_model_1.Class.findById(classObjectId)
        .select('grade section schoolId')
        .lean();
    if (!classDoc) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Class not found');
    }
    const schoolObjectId = teacher.schoolId?._id || teacher.schoolId;
    if (classDoc.schoolId?.toString() !== schoolObjectId.toString()) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'You are not authorized to mark attendance for this class');
    }
    const schoolTimezone = teacher.schoolId?.settings?.timezone ||
        config_1.default.school_timezone ||
        'UTC';
    const { date: normalizedDate, dateKey } = (0, day_attendance_model_1.normaliseDateKey)(date, schoolTimezone);
    const holidayEvents = await (0, holiday_utils_1.findHolidayEventsForClass)({
        schoolId: schoolObjectId,
        dateKey,
        timezone: schoolTimezone,
        grade: classDoc.grade,
        section: classDoc.section,
    });
    if (holidayEvents.length) {
        const holidayTitles = holidayEvents
            .map((event) => event.title)
            .filter((title) => Boolean(title));
        const holidayLabel = holidayTitles.length
            ? ` (${holidayTitles.join(', ')})`
            : '';
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, `Cannot mark attendance on ${dateKey} because the school calendar marks this date as a holiday${holidayLabel}.`);
    }
    const studentIdsForLookup = attendanceData
        .filter(data => mongoose_1.Types.ObjectId.isValid(data.studentId))
        .map(data => new mongoose_1.Types.ObjectId(data.studentId));
    const studentCodeMap = new Map();
    if (studentIdsForLookup.length) {
        const lookupStudents = await student_model_1.Student.find({ _id: { $in: studentIdsForLookup } }).select('_id studentId');
        lookupStudents.forEach(doc => studentCodeMap.set(doc._id.toString(), doc.studentId));
    }
    let existingAttendance = await this.findOne({
        classId: classObjectId,
        date,
        period,
    });
    let attendanceRecord;
    if (existingAttendance) {
        if (!existingAttendance.subjectId) {
            existingAttendance.subjectId = subjectObjectId;
        }
        if (!existingAttendance.canBeModified()) {
            throw new Error('Attendance is locked and cannot be modified');
        }
        attendanceData.forEach(data => {
            const studentIndex = existingAttendance.students.findIndex(s => s.studentId.toString() === data.studentId);
            if (studentIndex >= 0) {
                existingAttendance.students[studentIndex].status = data.status;
                existingAttendance.students[studentIndex].modifiedAt = new Date();
                existingAttendance.students[studentIndex].modifiedBy = teacherObjectId;
            }
            else {
                existingAttendance.students.push({
                    studentId: new mongoose_1.Types.ObjectId(data.studentId),
                    status: data.status,
                    markedAt: new Date(),
                });
            }
        });
        existingAttendance.teacherId = teacherObjectId;
        existingAttendance.subjectId = subjectObjectId;
        existingAttendance.modifiedAt = new Date();
        existingAttendance.modifiedBy = teacherObjectId;
        attendanceRecord = existingAttendance;
    }
    else {
        const students = attendanceData.map(data => ({
            studentId: new mongoose_1.Types.ObjectId(data.studentId),
            status: data.status,
            markedAt: new Date(),
        }));
        attendanceRecord = new this({
            schoolId: teacher.schoolId,
            teacherId: teacherObjectId,
            subjectId: subjectObjectId,
            classId: classObjectId,
            date,
            period,
            students,
            markedAt: new Date(),
        });
    }
    await attendanceRecord.save();
    for (const studentEntry of attendanceData) {
        if (!mongoose_1.Types.ObjectId.isValid(studentEntry.studentId))
            continue;
        const studentObjectId = new mongoose_1.Types.ObjectId(studentEntry.studentId);
        await day_attendance_model_1.StudentDayAttendance.markFromTeacher({
            schoolId: schoolObjectId,
            studentId: studentObjectId,
            studentCode: studentCodeMap.get(studentObjectId.toString()),
            teacherId: teacherObjectId,
            status: studentEntry.status,
            date: normalizedDate,
            dateKey,
            timezone: schoolTimezone,
        });
    }
    const finalizeTime = teacher.schoolId?.settings?.autoAttendFinalizationTime ||
        config_1.default.auto_attend_finalization_time;
    await day_attendance_model_1.StudentDayAttendance.finalizeForDate(new mongoose_1.Types.ObjectId(schoolObjectId), normalizedDate, dateKey, finalizeTime, schoolTimezone);
    return attendanceRecord;
};
attendanceSchema.statics.getClassAttendance = function (classId, date, period) {
    const query = { classId, date };
    if (period) {
        query.period = period;
    }
    return this.find(query)
        .populate('teacherId', 'userId teacherId')
        .populate('subjectId', 'name code')
        .populate('students.studentId', 'userId studentId rollNumber')
        .populate({
        path: 'students.studentId',
        populate: {
            path: 'userId',
            select: 'firstName lastName'
        }
    })
        .sort({ period: 1 });
};
attendanceSchema.statics.getStudentAttendance = function (studentId, startDate, endDate) {
    return this.find({
        'students.studentId': studentId,
        date: { $gte: startDate, $lte: endDate },
    })
        .populate('teacherId', 'userId teacherId')
        .populate('subjectId', 'name code')
        .sort({ date: -1, period: 1 });
};
attendanceSchema.statics.calculateStudentAttendancePercentage = async function (studentId, startDate, endDate) {
    const attendanceRecords = await this.find({
        'students.studentId': studentId,
        date: { $gte: startDate, $lte: endDate },
    });
    if (attendanceRecords.length === 0) {
        return 0;
    }
    let totalClasses = 0;
    let presentClasses = 0;
    attendanceRecords.forEach(record => {
        const student = record.students.find(s => s.studentId.toString() === studentId);
        if (student) {
            totalClasses++;
            if (student.status === 'present' || student.status === 'late') {
                presentClasses++;
            }
        }
    });
    return totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
};
attendanceSchema.statics.getAttendanceStats = async function (schoolId, startDate, endDate) {
    const pipeline = [
        {
            $match: {
                schoolId: schoolId,
                date: { $gte: startDate, $lte: endDate },
            },
        },
        {
            $unwind: '$students',
        },
        {
            $group: {
                _id: null,
                totalRecords: { $sum: 1 },
                presentCount: {
                    $sum: { $cond: [{ $eq: ['$students.status', 'present'] }, 1, 0] },
                },
                absentCount: {
                    $sum: { $cond: [{ $eq: ['$students.status', 'absent'] }, 1, 0] },
                },
                lateCount: {
                    $sum: { $cond: [{ $eq: ['$students.status', 'late'] }, 1, 0] },
                },
                excusedCount: {
                    $sum: { $cond: [{ $eq: ['$students.status', 'excused'] }, 1, 0] },
                },
            },
        },
    ];
    const results = await this.aggregate(pipeline);
    const stats = results[0] || {
        totalRecords: 0,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        excusedCount: 0,
    };
    const totalStudents = await (0, mongoose_1.model)('Student').countDocuments({ schoolId });
    const attendancePercentage = stats.totalRecords > 0
        ? Math.round(((stats.presentCount + stats.lateCount) / stats.totalRecords) * 100)
        : 0;
    return {
        totalClasses: stats.totalRecords,
        totalStudents,
        presentCount: stats.presentCount,
        absentCount: stats.absentCount,
        lateCount: stats.lateCount,
        excusedCount: stats.excusedCount,
        attendancePercentage,
        byStatus: [
            {
                status: 'present',
                count: stats.presentCount,
                percentage: stats.totalRecords > 0 ? Math.round((stats.presentCount / stats.totalRecords) * 100) : 0,
            },
            {
                status: 'absent',
                count: stats.absentCount,
                percentage: stats.totalRecords > 0 ? Math.round((stats.absentCount / stats.totalRecords) * 100) : 0,
            },
            {
                status: 'late',
                count: stats.lateCount,
                percentage: stats.totalRecords > 0 ? Math.round((stats.lateCount / stats.totalRecords) * 100) : 0,
            },
            {
                status: 'excused',
                count: stats.excusedCount,
                percentage: stats.totalRecords > 0 ? Math.round((stats.excusedCount / stats.totalRecords) * 100) : 0,
            },
        ],
        byGrade: [],
        dailyTrend: [],
    };
};
attendanceSchema.statics.lockOldAttendance = async function () {
    const lockAfterDays = config_1.default.attendance_lock_after_days || 7;
    const lockDate = new Date();
    lockDate.setDate(lockDate.getDate() - lockAfterDays);
    await this.updateMany({
        date: { $lt: lockDate },
        isLocked: false,
    }, {
        $set: { isLocked: true },
    });
};
attendanceSchema.index({ schoolId: 1, date: -1 });
attendanceSchema.index({ classId: 1, date: 1, period: 1 }, { unique: true });
attendanceSchema.index({ teacherId: 1, date: -1 });
attendanceSchema.index({ date: 1, period: 1 });
attendanceSchema.index({ 'students.studentId': 1, date: -1 });
attendanceSchema.pre('save', function (next) {
    if (this.isModified('students')) {
        this.modifiedAt = new Date();
    }
    if (this.isModified('date')) {
        this.date.setHours(0, 0, 0, 0);
    }
    next();
});
attendanceSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        ret.canModify = doc.canBeModified();
        ret.attendanceStats = doc.getAttendanceStats();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Attendance = (0, mongoose_1.model)('Attendance', attendanceSchema);
//# sourceMappingURL=attendance.model.js.map