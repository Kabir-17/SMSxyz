"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = require("../../errors/AppError");
const student_service_1 = require("./student.service");
const createStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentData = req.body;
    const adminUserId = req.user?.id;
    if (!adminUserId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Admin user not found");
    }
    let photos = [];
    if (Array.isArray(req.files)) {
        photos =
            req.files.filter((file) => file.fieldname === "photos") || [];
    }
    else {
        const files = req.files;
        photos = files?.photos || [];
    }
    const result = await student_service_1.studentService.createStudent(studentData, photos, adminUserId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Student created successfully with auto-generated credentials",
        data: {
            student: result,
            credentials: result.credentials
                ? {
                    student: {
                        id: result.studentId,
                        username: result.credentials.student.username,
                        password: result.credentials.student.password,
                        email: result.user?.email,
                        phone: result.user?.phone,
                    },
                    parent: {
                        id: result.parent?.id || "",
                        username: result.credentials.parent.username,
                        password: result.credentials.parent.password,
                        email: result.parent?.userId ? undefined : undefined,
                        phone: undefined,
                    },
                }
                : undefined,
        },
    });
});
const getAllStudents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const filters = req.query;
    const adminUser = req.user;
    if (!adminUser?.schoolId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Admin user or school ID not found");
    }
    const filtersWithSchoolId = {
        page: Number(filters.page) || 1,
        limit: Number(filters.limit) || 20,
        sortBy: filters.sortBy || "createdAt",
        sortOrder: filters.sortOrder || "desc",
        ...filters,
        schoolId: adminUser.schoolId,
    };
    const result = await student_service_1.studentService.getStudents(filtersWithSchoolId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Students retrieved successfully",
        meta: {
            page: result.currentPage,
            limit: Number(filters.limit) || 20,
            total: result.totalCount,
        },
        data: result.students,
    });
});
const getStudentById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await student_service_1.studentService.getStudentById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student retrieved successfully",
        data: result,
    });
});
const updateStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await student_service_1.studentService.updateStudent(id, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student updated successfully",
        data: result,
    });
});
const deleteStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await student_service_1.studentService.deleteStudent(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student deleted successfully",
        data: null,
    });
});
const getStudentsByGradeAndSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId, grade, section } = req.params;
    const result = await student_service_1.studentService.getStudentsByGradeAndSection(schoolId, parseInt(grade), section);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Students retrieved successfully",
        data: result,
    });
});
const getStudentStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId } = req.params;
    const result = await student_service_1.studentService.getStudentStats(schoolId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student statistics retrieved successfully",
        data: result,
    });
});
const uploadStudentPhotos = (0, catchAsync_1.catchAsync)(async (req, res) => {
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
    const result = await student_service_1.studentService.uploadPhotos(id, files);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student photos uploaded successfully",
        data: result,
    });
});
const deleteStudentPhoto = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { studentId, photoId } = req.params;
    await student_service_1.studentService.deletePhoto(studentId, photoId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student photo deleted successfully",
        data: null,
    });
});
const getStudentPhotos = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await student_service_1.studentService.getStudentPhotos(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student photos retrieved successfully",
        data: result,
    });
});
const getAvailablePhotoSlots = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await student_service_1.studentService.getAvailablePhotoSlots(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Available photo slots retrieved successfully",
        data: result,
    });
});
const getStudentCredentials = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await student_service_1.studentService.getStudentCredentials(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student credentials retrieved successfully",
        data: result,
    });
});
const getStudentDashboard = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentId = req.user?.id;
    if (!studentId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Student not found");
    }
    const dashboardData = await student_service_1.studentService.getStudentDashboard(studentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student dashboard data retrieved successfully",
        data: dashboardData,
    });
});
const getStudentAttendance = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentId = req.user?.id;
    if (!studentId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Student not found");
    }
    const attendanceData = await student_service_1.studentService.getStudentAttendance(studentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student attendance data retrieved successfully",
        data: attendanceData,
    });
});
const getStudentGrades = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentId = req.user?.id;
    if (!studentId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Student not found");
    }
    const gradesData = await student_service_1.studentService.getStudentGrades(studentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student grades data retrieved successfully",
        data: gradesData,
    });
});
const getStudentHomework = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentId = req.user?.id;
    if (!studentId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Student not found");
    }
    const homeworkData = await student_service_1.studentService.getStudentHomework(studentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student homework data retrieved successfully",
        data: homeworkData,
    });
});
const getStudentSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentId = req.user?.id;
    if (!studentId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Student not found");
    }
    const scheduleData = await student_service_1.studentService.getStudentSchedule(studentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student schedule data retrieved successfully",
        data: scheduleData,
    });
});
const getStudentCalendar = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentId = req.user?.id;
    if (!studentId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Student not found");
    }
    const calendarData = await student_service_1.studentService.getStudentCalendar(studentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student calendar data retrieved successfully",
        data: calendarData,
    });
});
const getStudentDisciplinaryActions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const studentUserId = req.user?.id;
    if (!studentUserId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Student user not found");
    }
    const disciplinaryData = await student_service_1.studentService.getStudentDisciplinaryActions(studentUserId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student disciplinary actions retrieved successfully",
        data: disciplinaryData,
    });
});
exports.StudentController = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    getStudentsByGradeAndSection,
    getStudentStats,
    uploadStudentPhotos,
    deleteStudentPhoto,
    getStudentPhotos,
    getAvailablePhotoSlots,
    getStudentCredentials,
    getStudentDashboard,
    getStudentAttendance,
    getStudentGrades,
    getStudentHomework,
    getStudentSchedule,
    getStudentCalendar,
    getStudentDisciplinaryActions,
};
//# sourceMappingURL=student.controller.js.map