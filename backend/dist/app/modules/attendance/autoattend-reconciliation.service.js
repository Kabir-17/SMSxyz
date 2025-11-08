"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoAttendReconciliationService = void 0;
const mongoose_1 = require("mongoose");
const attendance_event_model_1 = require("./attendance-event.model");
const attendance_model_1 = require("./attendance.model");
const student_model_1 = require("../student/student.model");
class AutoAttendReconciliationService {
    static async reconcileAttendanceForPeriod(schoolId, date, grade, section, period) {
        const dateStart = new Date(date);
        dateStart.setHours(0, 0, 0, 0);
        const dateEnd = new Date(date);
        dateEnd.setHours(23, 59, 59, 999);
        const manualQuery = {
            schoolId: new mongoose_1.Types.ObjectId(schoolId),
            date: { $gte: dateStart, $lte: dateEnd },
        };
        if (period)
            manualQuery.period = period;
        const manualAttendance = await attendance_model_1.Attendance.find(manualQuery)
            .populate({
            path: "students.studentId",
            select: "studentId userId",
            populate: {
                path: "userId",
                select: "firstName lastName",
            },
        })
            .lean();
        const capturedDateStr = date.toISOString().split("T")[0];
        const cameraEvents = await attendance_event_model_1.AttendanceEvent.find({
            schoolId: new mongoose_1.Types.ObjectId(schoolId),
            capturedDate: capturedDateStr,
            grade: grade.toString(),
            section: section.toUpperCase(),
            test: false,
        })
            .sort({ capturedAt: 1 })
            .lean();
        const teacherMap = new Map();
        manualAttendance.forEach((record) => {
            record.students?.forEach((s) => {
                const sid = s.studentId?.studentId || s.studentId?._id?.toString();
                if (sid) {
                    teacherMap.set(sid, {
                        status: s.status,
                        markedAt: s.markedAt || record.markedAt,
                    });
                }
            });
        });
        const cameraMap = new Map();
        cameraEvents.forEach((event) => {
            cameraMap.set(event.studentId, {
                capturedAt: event.capturedAt,
                descriptor: event.descriptor,
                firstName: event.firstName,
            });
        });
        const discrepancies = [];
        cameraMap.forEach((cameraData, studentId) => {
            const teacherData = teacherMap.get(studentId);
            if (!teacherData) {
                discrepancies.push({
                    studentId,
                    firstName: cameraData.firstName,
                    issue: "Camera detected but teacher did not mark attendance",
                    cameraStatus: "present",
                    teacherStatus: null,
                    capturedAt: cameraData.capturedAt,
                });
            }
            else if (teacherData.status === "absent") {
                discrepancies.push({
                    studentId,
                    firstName: cameraData.firstName,
                    issue: "Status mismatch: camera detected presence but teacher marked absent",
                    cameraStatus: "present",
                    teacherStatus: teacherData.status,
                    capturedAt: cameraData.capturedAt,
                    markedAt: teacherData.markedAt,
                });
            }
        });
        teacherMap.forEach((teacherData, studentId) => {
            const cameraData = cameraMap.get(studentId);
            if (teacherData.status === "absent" && cameraData) {
            }
            else if (teacherData.status !== "absent" && !cameraData) {
                discrepancies.push({
                    studentId,
                    firstName: "Unknown",
                    issue: `Teacher marked ${teacherData.status} but camera did not detect student`,
                    cameraStatus: null,
                    teacherStatus: teacherData.status,
                    markedAt: teacherData.markedAt,
                });
            }
        });
        const allStudentIds = new Set([...teacherMap.keys(), ...cameraMap.keys()]);
        const matched = [...allStudentIds].filter((sid) => teacherMap.has(sid) && cameraMap.has(sid)).length;
        const onlyCameraDetected = [...cameraMap.keys()].filter((sid) => !teacherMap.has(sid)).length;
        const onlyTeacherMarked = [...teacherMap.keys()].filter((sid) => !cameraMap.has(sid)).length;
        const statusMismatches = discrepancies.filter((d) => d.issue.includes("mismatch")).length;
        return {
            manualAttendance,
            cameraEvents,
            discrepancies,
            summary: {
                totalStudents: allStudentIds.size,
                cameraDetections: cameraMap.size,
                teacherMarks: teacherMap.size,
                matched,
                onlyCameraDetected,
                onlyTeacherMarked,
                statusMismatches,
            },
        };
    }
    static async getStudentCameraEvents(schoolId, studentId, startDate, endDate) {
        const startDateStr = startDate.toISOString().split("T")[0];
        const endDateStr = endDate.toISOString().split("T")[0];
        const events = await attendance_event_model_1.AttendanceEvent.find({
            schoolId: new mongoose_1.Types.ObjectId(schoolId),
            studentId,
            capturedDate: { $gte: startDateStr, $lte: endDateStr },
            test: false,
        })
            .sort({ capturedAt: 1 })
            .lean();
        return events;
    }
    static async autoMarkFromCameraEvents(schoolId, date, grade, section, classId, subjectId, period) {
        const existingAttendance = await attendance_model_1.Attendance.findOne({
            schoolId: new mongoose_1.Types.ObjectId(schoolId),
            date,
            period,
        });
        if (existingAttendance) {
            return {
                success: false,
                message: "Teacher has already marked attendance for this period. Camera events will not override.",
                autoMarked: 0,
                skipped: 0,
            };
        }
        const capturedDateStr = date.toISOString().split("T")[0];
        const cameraEvents = await attendance_event_model_1.AttendanceEvent.find({
            schoolId: new mongoose_1.Types.ObjectId(schoolId),
            capturedDate: capturedDateStr,
            grade: grade.toString(),
            section: section.toUpperCase(),
            test: false,
            status: "captured",
        }).lean();
        if (cameraEvents.length === 0) {
            return {
                success: false,
                message: "No camera events found for this period",
                autoMarked: 0,
                skipped: 0,
            };
        }
        const students = await student_model_1.Student.find({
            schoolId: new mongoose_1.Types.ObjectId(schoolId),
            grade,
            section: section.toUpperCase(),
            isActive: true,
        })
            .select("_id studentId userId")
            .lean();
        const cameraStudentIds = new Set(cameraEvents.map((e) => e.studentId));
        const attendanceData = students.map((student) => ({
            studentId: student._id.toString(),
            status: cameraStudentIds.has(student.studentId) ? "present" : "absent",
        }));
        return {
            success: true,
            message: `Camera events processed. ${cameraEvents.length} students detected.`,
            autoMarked: 0,
            skipped: students.length,
        };
    }
    static async suggestAttendanceFromCamera(schoolId, date, grade, section) {
        const capturedDateStr = date.toISOString().split("T")[0];
        const students = await student_model_1.Student.find({
            schoolId: new mongoose_1.Types.ObjectId(schoolId),
            grade,
            section: section.toUpperCase(),
            isActive: true,
        })
            .select("_id studentId userId")
            .populate("userId", "firstName lastName")
            .lean();
        const cameraEvents = await attendance_event_model_1.AttendanceEvent.find({
            schoolId: new mongoose_1.Types.ObjectId(schoolId),
            capturedDate: capturedDateStr,
            grade: grade.toString(),
            section: section.toUpperCase(),
            test: false,
        }).lean();
        const cameraMap = new Map();
        cameraEvents.forEach((event) => {
            cameraMap.set(event.studentId, event.capturedAt);
        });
        const suggestions = students.map((student) => {
            const capturedAt = cameraMap.get(student.studentId);
            if (capturedAt) {
                return {
                    studentId: student._id.toString(),
                    suggestedStatus: "present",
                    reason: "Detected by Auto-Attend camera",
                    capturedAt,
                };
            }
            else {
                return {
                    studentId: student._id.toString(),
                    suggestedStatus: "absent",
                    reason: "Not detected by camera (teacher should verify)",
                };
            }
        });
        return suggestions;
    }
}
exports.AutoAttendReconciliationService = AutoAttendReconciliationService;
//# sourceMappingURL=autoattend-reconciliation.service.js.map