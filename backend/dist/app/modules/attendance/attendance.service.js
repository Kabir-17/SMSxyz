"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const mongoose_1 = require("mongoose");
const attendance_model_1 = require("./attendance.model");
const student_model_1 = require("../student/student.model");
const teacher_model_1 = require("../teacher/teacher.model");
const subject_model_1 = require("../subject/subject.model");
const AppError_1 = require("../../errors/AppError");
const day_attendance_model_1 = require("./day-attendance.model");
const school_model_1 = require("../school/school.model");
const config_1 = __importDefault(require("../../config"));
class AttendanceService {
    static async markAttendance(teacherId, attendanceData) {
        const teacher = await teacher_model_1.Teacher.findById(teacherId).populate('schoolId userId');
        if (!teacher || !teacher.isActive) {
            throw new AppError_1.AppError(404, 'Teacher not found or inactive');
        }
        const subject = await subject_model_1.Subject.findById(attendanceData.subjectId);
        if (!subject) {
            throw new AppError_1.AppError(404, 'Subject not found');
        }
        const isAssigned = subject.teachers.some(id => id.toString() === teacherId);
        if (!isAssigned) {
            throw new AppError_1.AppError(403, 'Teacher is not assigned to this subject');
        }
        const schoolTimezone = teacher.schoolId?.settings?.timezone ||
            config_1.default.school_timezone ||
            'UTC';
        const requestedDateInput = new Date(attendanceData.date);
        if (Number.isNaN(requestedDateInput.getTime())) {
            throw new AppError_1.AppError(400, 'Invalid attendance date');
        }
        const { date: requestedDate } = (0, day_attendance_model_1.normaliseDateKey)(requestedDateInput, schoolTimezone);
        const { date: today } = (0, day_attendance_model_1.normaliseDateKey)(new Date(), schoolTimezone);
        if (requestedDate.getTime() > today.getTime()) {
            throw new AppError_1.AppError(400, 'Cannot mark attendance for future dates');
        }
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (requestedDate.getTime() < sevenDaysAgo.getTime()) {
            throw new AppError_1.AppError(400, 'Cannot mark attendance for dates older than 7 days');
        }
        const attendanceRecord = await attendance_model_1.Attendance.markAttendance(teacherId, attendanceData.classId, attendanceData.subjectId, requestedDate, attendanceData.period, attendanceData.students);
        const populatedRecord = await attendance_model_1.Attendance.populate(attendanceRecord, [
            {
                path: 'students.studentId',
                select: 'userId studentId rollNumber',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            },
            {
                path: 'teacherId',
                select: 'userId teacherId',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            },
            {
                path: 'subjectId',
                select: 'name code'
            }
        ]);
        return this.formatAttendanceResponse(populatedRecord);
    }
    static async updateAttendance(attendanceId, studentId, userId, updateData) {
        const attendance = await attendance_model_1.Attendance.findById(attendanceId);
        if (!attendance) {
            throw new AppError_1.AppError(404, 'Attendance record not found');
        }
        if (!attendance.canBeModified()) {
            throw new AppError_1.AppError(403, 'Attendance record is locked and cannot be modified');
        }
        if (updateData.status) {
            const success = attendance.updateStudentStatus(studentId, updateData.status, userId, updateData.modificationReason);
            if (!success) {
                throw new AppError_1.AppError(404, 'Student not found in this attendance record');
            }
        }
        await attendance.save();
        if (updateData.status) {
            const studentObjectId = new mongoose_1.Types.ObjectId(studentId);
            const studentDoc = await student_model_1.Student.findById(studentObjectId).select('studentId');
            if (studentDoc) {
                const schoolDoc = await school_model_1.School.findById(attendance.schoolId).select('settings.autoAttendFinalizationTime settings.timezone');
                const schoolTimezone = schoolDoc?.settings?.timezone || config_1.default.school_timezone || 'UTC';
                const { date: normalizedDate, dateKey } = (0, day_attendance_model_1.normaliseDateKey)(attendance.date, schoolTimezone);
                await day_attendance_model_1.StudentDayAttendance.markFromTeacher({
                    schoolId: attendance.schoolId,
                    studentId: studentObjectId,
                    studentCode: studentDoc.studentId,
                    teacherId: attendance.teacherId,
                    status: updateData.status,
                    date: normalizedDate,
                    dateKey,
                    timezone: schoolTimezone,
                });
                const finalizeTime = schoolDoc?.settings?.autoAttendFinalizationTime ||
                    config_1.default.auto_attend_finalization_time;
                await day_attendance_model_1.StudentDayAttendance.finalizeForDate(attendance.schoolId, normalizedDate, dateKey, finalizeTime, schoolTimezone);
            }
        }
        await attendance.populate([
            {
                path: 'students.studentId',
                select: 'userId studentId rollNumber',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            },
            {
                path: 'teacherId',
                select: 'userId teacherId',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            },
            {
                path: 'subjectId',
                select: 'name code'
            }
        ]);
        return this.formatAttendanceResponse(attendance);
    }
    static async getAttendanceById(attendanceId) {
        const attendance = await attendance_model_1.Attendance.findById(attendanceId)
            .populate({
            path: 'studentId',
            select: 'userId studentId rollNumber',
            populate: {
                path: 'userId',
                select: 'firstName lastName'
            }
        })
            .populate({
            path: 'teacherId',
            select: 'userId teacherId',
            populate: {
                path: 'userId',
                select: 'firstName lastName'
            }
        })
            .populate('subjectId', 'name code');
        if (!attendance) {
            throw new AppError_1.AppError(404, 'Attendance record not found');
        }
        return this.formatAttendanceResponse(attendance);
    }
    static async getClassAttendance(request) {
        const attendanceRecords = await attendance_model_1.Attendance.getClassAttendance(request.schoolId, new Date(request.date), request.period);
        return this.formatAttendanceResponses(attendanceRecords);
    }
    static async getStudentAttendance(studentId, startDate, endDate, subjectId) {
        let attendanceRecords = await attendance_model_1.Attendance.getStudentAttendance(studentId, startDate, endDate);
        if (subjectId) {
            attendanceRecords = attendanceRecords.filter(record => record.subjectId.toString() === subjectId);
        }
        return this.formatAttendanceResponses(attendanceRecords);
    }
    static async getAttendanceStats(schoolId, startDate, endDate, filters) {
        return await attendance_model_1.Attendance.getAttendanceStats(schoolId, startDate, endDate);
    }
    static async generateStudentAttendanceReport(studentId, startDate, endDate) {
        const student = await student_model_1.Student.findById(studentId)
            .populate('userId', 'firstName lastName')
            .populate('schoolId', 'name');
        if (!student) {
            throw new AppError_1.AppError(404, 'Student not found');
        }
        const attendanceRecords = await attendance_model_1.Attendance.getStudentAttendance(studentId, startDate, endDate);
        let totalClasses = 0;
        let presentClasses = 0;
        let absentClasses = 0;
        let lateClasses = 0;
        let excusedClasses = 0;
        const studentRecords = [];
        attendanceRecords.forEach(record => {
            const studentAttendance = record.students.find(s => s.studentId.toString() === studentId);
            if (studentAttendance) {
                totalClasses++;
                const status = studentAttendance.status;
                if (status === 'present' || status === 'late')
                    presentClasses++;
                if (status === 'absent')
                    absentClasses++;
                if (status === 'late')
                    lateClasses++;
                if (status === 'excused')
                    excusedClasses++;
                studentRecords.push({
                    ...studentAttendance,
                    subjectId: record.subjectId,
                    date: record.date,
                    period: record.period
                });
            }
        });
        const subjectWiseAttendance = this.calculateSubjectWiseAttendance(studentRecords);
        const monthlyTrend = this.calculateMonthlyTrend(studentRecords);
        return {
            studentId,
            studentName: `${student.userId.firstName} ${student.userId.lastName}`,
            rollNumber: student.rollNumber || 0,
            grade: student.grade,
            section: student.section,
            totalClasses,
            presentClasses,
            absentClasses,
            lateClasses,
            excusedClasses,
            attendancePercentage: totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0,
            subjectWiseAttendance,
            monthlyTrend
        };
    }
    static async getAttendanceByFilters(filters, page = 1, limit = 20) {
        const query = {};
        if (filters.schoolId)
            query.schoolId = filters.schoolId;
        if (filters.studentId)
            query.studentId = filters.studentId;
        if (filters.teacherId)
            query.teacherId = filters.teacherId;
        if (filters.classId)
            query.classId = filters.classId;
        if (filters.subjectId)
            query.subjectId = filters.subjectId;
        if (filters.status)
            query.status = filters.status;
        if (filters.period)
            query.period = filters.period;
        if (filters.date) {
            query.date = filters.date;
        }
        else if (filters.startDate && filters.endDate) {
            query.date = { $gte: filters.startDate, $lte: filters.endDate };
        }
        const total = await attendance_model_1.Attendance.countDocuments(query);
        const totalPages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;
        const attendanceRecords = await attendance_model_1.Attendance.find(query)
            .populate({
            path: 'studentId',
            select: 'userId studentId rollNumber',
            populate: {
                path: 'userId',
                select: 'firstName lastName'
            }
        })
            .populate({
            path: 'teacherId',
            select: 'userId teacherId',
            populate: {
                path: 'userId',
                select: 'firstName lastName'
            }
        })
            .populate('subjectId', 'name code')
            .sort({ date: -1, period: 1 })
            .skip(skip)
            .limit(limit);
        return {
            attendance: this.formatAttendanceResponses(attendanceRecords),
            total,
            page,
            totalPages
        };
    }
    static async lockOldAttendance() {
        await attendance_model_1.Attendance.lockOldAttendance();
    }
    static formatAttendanceResponse(record) {
        return {
            id: record._id.toString(),
            schoolId: record.schoolId.toString(),
            teacherId: record.teacherId._id.toString(),
            subjectId: record.subjectId._id.toString(),
            classId: record.classId.toString(),
            date: record.date,
            period: record.period,
            students: record.students.map((student) => ({
                studentId: student.studentId._id.toString(),
                status: student.status,
                markedAt: student.markedAt,
                modifiedAt: student.modifiedAt,
                modifiedBy: student.modifiedBy?.toString(),
                modificationReason: student.modificationReason,
                student: student.studentId ? {
                    id: student.studentId._id.toString(),
                    userId: student.studentId.userId._id.toString(),
                    studentId: student.studentId.studentId,
                    fullName: `${student.studentId.userId.firstName} ${student.studentId.userId.lastName}`,
                    rollNumber: student.studentId.rollNumber || 0
                } : undefined,
            })),
            markedAt: record.markedAt,
            modifiedAt: record.modifiedAt,
            modifiedBy: record.modifiedBy?.toString(),
            isLocked: record.isLocked,
            canModify: record.canBeModified(),
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            teacher: record.teacherId ? {
                id: record.teacherId._id.toString(),
                userId: record.teacherId.userId._id.toString(),
                teacherId: record.teacherId.teacherId,
                fullName: `${record.teacherId.userId.firstName} ${record.teacherId.userId.lastName}`
            } : undefined,
            subject: record.subjectId ? {
                id: record.subjectId._id.toString(),
                name: record.subjectId.name,
                code: record.subjectId.code
            } : undefined,
            class: undefined,
            attendanceStats: record.getAttendanceStats()
        };
    }
    static formatAttendanceResponses(records) {
        return records.map(record => this.formatAttendanceResponse(record));
    }
    static calculateSubjectWiseAttendance(records) {
        const subjectMap = new Map();
        records.forEach(record => {
            const subjectId = record.subjectId._id.toString();
            const subjectName = record.subjectId.name;
            if (!subjectMap.has(subjectId)) {
                subjectMap.set(subjectId, {
                    subjectId,
                    subjectName,
                    totalClasses: 0,
                    presentClasses: 0
                });
            }
            const subjectData = subjectMap.get(subjectId);
            subjectData.totalClasses++;
            if (record.status === 'present' || record.status === 'late') {
                subjectData.presentClasses++;
            }
        });
        return Array.from(subjectMap.values()).map(subject => ({
            ...subject,
            attendancePercentage: subject.totalClasses > 0
                ? Math.round((subject.presentClasses / subject.totalClasses) * 100)
                : 0
        }));
    }
    static calculateMonthlyTrend(records) {
        const monthMap = new Map();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        records.forEach(record => {
            const date = new Date(record.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            const monthName = monthNames[date.getMonth()];
            if (!monthMap.has(monthKey)) {
                monthMap.set(monthKey, {
                    month: monthName,
                    year: date.getFullYear(),
                    totalClasses: 0,
                    presentClasses: 0
                });
            }
            const monthData = monthMap.get(monthKey);
            monthData.totalClasses++;
            if (record.status === 'present' || record.status === 'late') {
                monthData.presentClasses++;
            }
        });
        return Array.from(monthMap.values())
            .map(month => ({
            ...month,
            attendancePercentage: month.totalClasses > 0
                ? Math.round((month.presentClasses / month.totalClasses) * 100)
                : 0
        }))
            .sort((a, b) => {
            if (a.year !== b.year)
                return b.year - a.year;
            return monthNames.indexOf(b.month) - monthNames.indexOf(a.month);
        });
    }
}
exports.AttendanceService = AttendanceService;
//# sourceMappingURL=attendance.service.js.map