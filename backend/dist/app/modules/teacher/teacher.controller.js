"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = require("../../errors/AppError");
const teacher_service_1 = require("./teacher.service");
const teacher_credentials_service_1 = require("./teacher.credentials.service");
const createTeacher = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherData = req.body;
    const adminUser = req.user;
    if (!adminUser?.id) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Admin user not found");
    }
    const teacherDataWithSchoolId = {
        ...teacherData,
        schoolId: adminUser.schoolId,
    };
    const files = req.files;
    const result = await teacher_service_1.teacherService.createTeacher(teacherDataWithSchoolId, files);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Teacher created successfully",
        data: result,
    });
});
const getAllTeachers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const filters = req.query;
    const adminUser = req.user;
    if (!adminUser?.schoolId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Admin user or school ID not found");
    }
    const filtersWithSchoolId = {
        page: Number(filters.page) || 1,
        limit: Number(filters.limit) || 20,
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc',
        ...filters,
        schoolId: adminUser.schoolId,
    };
    const result = await teacher_service_1.teacherService.getTeachers(filtersWithSchoolId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teachers retrieved successfully",
        meta: {
            page: result.currentPage,
            limit: Number(filters.limit) || 20,
            total: result.totalCount,
        },
        data: result.teachers,
    });
});
const getTeacherById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await teacher_service_1.teacherService.getTeacherById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher retrieved successfully",
        data: result,
    });
});
const updateTeacher = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await teacher_service_1.teacherService.updateTeacher(id, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher updated successfully",
        data: result,
    });
});
const deleteTeacher = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await teacher_service_1.teacherService.deleteTeacher(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher deleted successfully",
        data: null,
    });
});
const getTeachersBySubject = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId, subject } = req.params;
    const result = await teacher_service_1.teacherService.getTeachersBySubject(schoolId, subject);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teachers retrieved successfully",
        data: result,
    });
});
const getTeacherStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId } = req.params;
    const result = await teacher_service_1.teacherService.getTeacherStats(schoolId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher statistics retrieved successfully",
        data: result,
    });
});
const uploadTeacherPhotos = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const files = req.files;
    if (!files || files.length === 0) {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: "No photos provided",
            data: null,
        });
    }
    const result = await teacher_service_1.teacherService.uploadPhotos(id, files);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher photos uploaded successfully",
        data: result,
    });
});
const deleteTeacherPhoto = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { teacherId, photoId } = req.params;
    await teacher_service_1.teacherService.deletePhoto(teacherId, photoId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher photo deleted successfully",
        data: null,
    });
});
const getTeacherPhotos = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await teacher_service_1.teacherService.getTeacherPhotos(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher photos retrieved successfully",
        data: result,
    });
});
const getAvailablePhotoSlots = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await teacher_service_1.teacherService.getAvailablePhotoSlots(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Available photo slots retrieved successfully",
        data: result,
    });
});
const getTeacherCredentials = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { teacherId } = req.params;
    const adminUser = req.user;
    if (!adminUser || !["admin", "superadmin"].includes(adminUser.role)) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Only admin and superadmin can view teacher credentials");
    }
    const result = await teacher_credentials_service_1.TeacherCredentialsService.getTeacherCredentials(teacherId);
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Teacher credentials not found");
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher credentials retrieved successfully",
        data: result,
    });
});
const resetTeacherPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { teacherId } = req.params;
    const adminUser = req.user;
    if (!adminUser || !["admin", "superadmin"].includes(adminUser.role)) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Only admin and superadmin can reset teacher passwords");
    }
    const result = await teacher_credentials_service_1.TeacherCredentialsService.resetTeacherPassword(teacherId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher password reset successfully",
        data: result,
    });
});
const getDashboard = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const dashboardData = await teacher_service_1.teacherService.getTeacherDashboard(teacherUser.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher dashboard data retrieved successfully",
        data: dashboardData,
    });
});
const getMySchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const schedule = await teacher_service_1.teacherService.getTeacherSchedule(teacherUser.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher schedule retrieved successfully",
        data: schedule,
    });
});
const getMyClasses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const classes = await teacher_service_1.teacherService.getTeacherClasses(teacherUser.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher classes retrieved successfully",
        data: classes,
    });
});
const getCurrentPeriods = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const periods = await teacher_service_1.teacherService.getCurrentPeriods(teacherUser.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Current periods retrieved successfully",
        data: periods,
    });
});
const markAttendance = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const attendanceData = req.body;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const result = await teacher_service_1.teacherService.markAttendance(teacherUser.id, attendanceData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Attendance marked successfully",
        data: result,
    });
});
const getMyStudentsForAttendance = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const studentsData = await teacher_service_1.teacherService.getMyStudentsForAttendance(teacherUser.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Students retrieved successfully for attendance",
        data: studentsData,
    });
});
const getStudentsForAttendance = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const { classId, subjectId, period } = req.params;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const students = await teacher_service_1.teacherService.getStudentsForAttendance(teacherUser.id, classId, subjectId, parseInt(period));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Students retrieved successfully",
        data: students,
    });
});
const assignHomework = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const homeworkData = req.body;
    const files = req.files;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const result = await teacher_service_1.teacherService.assignHomework(teacherUser.id, homeworkData, files);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Homework assigned successfully",
        data: result,
    });
});
const getMyHomeworkAssignments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const assignments = await teacher_service_1.teacherService.getMyHomeworkAssignments(teacherUser.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Homework assignments retrieved successfully",
        data: assignments,
    });
});
const issueWarning = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const warningData = req.body;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const result = await teacher_service_1.teacherService.issueWarning(teacherUser.id, warningData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Warning issued successfully",
        data: result,
    });
});
const getMyGradingTasks = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const gradingTasks = await teacher_service_1.teacherService.getMyGradingTasks(teacherUser.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Grading tasks retrieved successfully",
        data: gradingTasks,
    });
});
const submitGrades = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const gradesData = req.body;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const result = await teacher_service_1.teacherService.submitGrades(teacherUser.id, gradesData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Grades submitted successfully",
        data: result,
    });
});
const issuePunishment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const punishmentData = req.body;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const result = await teacher_service_1.teacherService.issuePunishment(teacherUser.id, punishmentData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Punishment issued successfully",
        data: result,
    });
});
const issueRedWarrant = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const warrantData = req.body;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const result = await teacher_service_1.teacherService.issuePunishment(teacherUser.id, {
        ...warrantData,
        actionType: 'red_warrant',
        severity: 'critical',
        urgentNotification: true,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Red warrant issued successfully",
        data: result,
    });
});
const getMyDisciplinaryActions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const filters = req.query;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const result = await teacher_service_1.teacherService.getMyDisciplinaryActions(teacherUser.id, filters);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Disciplinary actions retrieved successfully",
        data: result,
    });
});
const resolveDisciplinaryAction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const { actionId } = req.params;
    const { resolutionNotes } = req.body;
    if (!teacherUser || (teacherUser.role !== 'teacher' && teacherUser.role !== 'admin')) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher or Admin access required");
    }
    const result = await teacher_service_1.teacherService.resolveDisciplinaryAction(teacherUser.id, actionId, resolutionNotes);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Disciplinary action resolved successfully",
        data: result,
    });
});
const addDisciplinaryActionComment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const { actionId } = req.params;
    const { comment } = req.body;
    if (!teacherUser || (teacherUser.role !== 'teacher' && teacherUser.role !== 'admin')) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher or Admin access required");
    }
    const result = await teacher_service_1.teacherService.addDisciplinaryActionComment(teacherUser.id, actionId, comment);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Comment added successfully",
        data: result,
    });
});
const getStudentsByGrade = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const { grade } = req.params;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const result = await teacher_service_1.teacherService.getStudentsByGrade(teacherUser.id, parseInt(grade));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Students retrieved successfully",
        data: result,
    });
});
const getStudentsByGradeAndSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const { grade, section } = req.params;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const result = await teacher_service_1.teacherService.getStudentsByGrade(teacherUser.id, parseInt(grade), section.toUpperCase());
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Students retrieved successfully",
        data: result,
    });
});
const getExamGradingDetails = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const { examId } = req.params;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const result = await teacher_service_1.teacherService.getExamGradingDetails(teacherUser.id, examId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Exam grading details retrieved successfully",
        data: result,
    });
});
const getExamGradingDetailsWithItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    const { examId, examItemId } = req.params;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const result = await teacher_service_1.teacherService.getExamGradingDetails(teacherUser.id, examId, examItemId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Exam grading details retrieved successfully",
        data: result,
    });
});
const getTeacherStudents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const teacherUser = req.user;
    if (!teacherUser || teacherUser.role !== 'teacher') {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Teacher access required");
    }
    const classes = await teacher_service_1.teacherService.getTeacherClasses(teacherUser.id);
    const students = classes.reduce((acc, classItem) => {
        if (classItem.students && Array.isArray(classItem.students)) {
            acc.push(...classItem.students);
        }
        return acc;
    }, []);
    const uniqueStudents = students.filter((student, index, self) => index === self.findIndex((s) => s._id.toString() === student._id.toString()));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher students retrieved successfully",
        data: uniqueStudents,
    });
});
exports.TeacherController = {
    createTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
    getTeachersBySubject,
    getTeacherStats,
    uploadTeacherPhotos,
    deleteTeacherPhoto,
    getTeacherPhotos,
    getAvailablePhotoSlots,
    getTeacherCredentials,
    resetTeacherPassword,
    getDashboard,
    getMySchedule,
    getMyClasses,
    getCurrentPeriods,
    markAttendance,
    getStudentsForAttendance,
    getMyStudentsForAttendance,
    assignHomework,
    getMyHomeworkAssignments,
    issueWarning,
    getMyGradingTasks,
    submitGrades,
    issuePunishment,
    issueRedWarrant,
    getMyDisciplinaryActions,
    resolveDisciplinaryAction,
    addDisciplinaryActionComment,
    getStudentsByGrade,
    getStudentsByGradeAndSection,
    getTeacherStudents,
    getExamGradingDetails,
    getExamGradingDetailsWithItem,
};
//# sourceMappingURL=teacher.controller.js.map