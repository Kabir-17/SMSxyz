"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamController = void 0;
const exam_service_1 = require("./exam.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = require("../../errors/AppError");
const createExam = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    if (!user || !['teacher', 'admin', 'superadmin'].includes(user.role)) {
        throw new AppError_1.AppError(403, 'Only teachers and admins can create exams');
    }
    const exam = await exam_service_1.examService.createExam(req.body, user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Exam created successfully',
        data: exam,
    });
});
const getExamById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    if (!user) {
        throw new AppError_1.AppError(401, 'Authentication required');
    }
    const exam = await exam_service_1.examService.getExamById(id, user.id, user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Exam retrieved successfully',
        data: exam,
    });
});
const updateExam = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    if (!user || !['teacher', 'admin', 'superadmin'].includes(user.role)) {
        throw new AppError_1.AppError(403, 'Only teachers and admins can update exams');
    }
    const exam = await exam_service_1.examService.updateExam(id, req.body, user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Exam updated successfully',
        data: exam,
    });
});
const deleteExam = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    if (!user || !['teacher', 'admin', 'superadmin'].includes(user.role)) {
        throw new AppError_1.AppError(403, 'Only teachers and admins can delete exams');
    }
    await exam_service_1.examService.deleteExam(id, user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Exam deleted successfully',
        data: null,
    });
});
const publishExam = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    if (!user || !['teacher', 'admin', 'superadmin'].includes(user.role)) {
        throw new AppError_1.AppError(403, 'Only teachers and admins can publish exams');
    }
    const exam = await exam_service_1.examService.publishExam(id, user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Exam published successfully',
        data: exam,
    });
});
const getExamsForTeacher = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    if (!user || !['teacher', 'admin', 'superadmin'].includes(user.role)) {
        throw new AppError_1.AppError(403, 'Only teachers and admins can access this endpoint');
    }
    const { Teacher } = require('../teacher/teacher.model');
    let teacherId;
    if (user.role === 'teacher') {
        const teacher = await Teacher.findOne({ userId: user.id });
        if (!teacher) {
            throw new AppError_1.AppError(404, 'Teacher record not found');
        }
        teacherId = teacher._id.toString();
    }
    else if (['admin', 'superadmin'].includes(user.role) && req.query.teacherId) {
        teacherId = req.query.teacherId;
    }
    if (!teacherId) {
        throw new AppError_1.AppError(400, 'Teacher ID is required');
    }
    const exams = await exam_service_1.examService.getExamsForTeacher(teacherId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Teacher exams retrieved successfully',
        data: exams,
    });
});
const getExamsForStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    if (!user || !['student', 'parent', 'teacher', 'admin'].includes(user.role)) {
        throw new AppError_1.AppError(403, 'Access denied');
    }
    const { Student } = require('../student/student.model');
    let studentId;
    if (user.role === 'student') {
        const student = await Student.findOne({ userId: user.id });
        if (!student) {
            throw new AppError_1.AppError(404, 'Student record not found');
        }
        studentId = student._id.toString();
    }
    else if (['parent', 'teacher', 'admin', 'superadmin'].includes(user.role) && req.query.studentId) {
        studentId = req.query.studentId;
    }
    if (!studentId) {
        throw new AppError_1.AppError(400, 'Student ID is required');
    }
    const exams = await exam_service_1.examService.getExamsForStudent(studentId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Student exams retrieved successfully',
        data: exams,
    });
});
const getExamsForClass = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId, grade } = req.params;
    const { section } = req.query;
    const exams = await exam_service_1.examService.getExamsForClass(schoolId, parseInt(grade), section, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Class exams retrieved successfully',
        data: exams,
    });
});
const getExamSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId, grade } = req.params;
    const { section, startDate, endDate } = req.query;
    const schedule = await exam_service_1.examService.getExamSchedule(schoolId, parseInt(grade), section, startDate, endDate);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Exam schedule retrieved successfully',
        data: schedule,
    });
});
const submitExamResults = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    if (!user || !['teacher', 'admin', 'superadmin'].includes(user.role)) {
        throw new AppError_1.AppError(403, 'Only teachers and admins can submit exam results');
    }
    const results = await exam_service_1.examService.submitExamResults(req.body, user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Exam results submitted successfully',
        data: results,
    });
});
const publishExamResults = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    if (!user || !['teacher', 'admin', 'superadmin'].includes(user.role)) {
        throw new AppError_1.AppError(403, 'Only teachers and admins can publish exam results');
    }
    const exam = await exam_service_1.examService.publishExamResults(id, user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Exam results published successfully',
        data: exam,
    });
});
const getExamResults = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { examId } = req.params;
    const { user } = req;
    if (!user) {
        throw new AppError_1.AppError(401, 'Authentication required');
    }
    const results = await exam_service_1.examService.getExamResults(examId, user.id, user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Exam results retrieved successfully',
        data: results,
    });
});
const getExamStatistics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { examId } = req.params;
    const { user } = req;
    if (!user || !['teacher', 'admin', 'superadmin'].includes(user.role)) {
        throw new AppError_1.AppError(403, 'Only teachers and admins can view exam statistics');
    }
    const stats = await exam_service_1.examService.getExamStatistics(examId, user.id, user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Exam statistics retrieved successfully',
        data: stats,
    });
});
const getUpcomingExams = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId } = req.params;
    const { days = '30' } = req.query;
    const exams = await exam_service_1.examService.getUpcomingExams(schoolId, parseInt(days));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Upcoming exams retrieved successfully',
        data: exams,
    });
});
const getExamCalendar = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId } = req.params;
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
        throw new AppError_1.AppError(400, 'Start date and end date are required');
    }
    const calendar = await exam_service_1.examService.getExamCalendar(schoolId, startDate, endDate);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Exam calendar retrieved successfully',
        data: calendar,
    });
});
const getExamDashboardStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    if (!user) {
        throw new AppError_1.AppError(401, 'Authentication required');
    }
    let stats = {};
    if (['teacher', 'admin', 'superadmin'].includes(user.role)) {
        const { Teacher } = require('../teacher/teacher.model');
        let teacherId;
        if (user.role === 'teacher') {
            const teacher = await Teacher.findOne({ userId: user.id });
            if (teacher) {
                teacherId = teacher._id.toString();
            }
        }
        else if (req.query.teacherId) {
            teacherId = req.query.teacherId;
        }
        if (teacherId) {
            const exams = await exam_service_1.examService.getExamsForTeacher(teacherId);
            stats = {
                totalExams: exams.length,
                upcomingExams: exams.filter(exam => exam.status === 'upcoming').length,
                ongoingExams: exams.filter(exam => exam.status === 'ongoing').length,
                completedExams: exams.filter(exam => exam.status === 'completed').length,
                publishedExams: exams.filter(exam => exam.isPublished).length,
                resultsPublished: exams.filter(exam => exam.resultsPublished).length,
                byExamType: {
                    'unit-test': exams.filter(exam => exam.examType === 'unit-test').length,
                    'mid-term': exams.filter(exam => exam.examType === 'mid-term').length,
                    'final': exams.filter(exam => exam.examType === 'final').length,
                    'quarterly': exams.filter(exam => exam.examType === 'quarterly').length,
                    'half-yearly': exams.filter(exam => exam.examType === 'half-yearly').length,
                    'annual': exams.filter(exam => exam.examType === 'annual').length,
                    'entrance': exams.filter(exam => exam.examType === 'entrance').length,
                    'mock': exams.filter(exam => exam.examType === 'mock').length,
                },
            };
        }
    }
    else if (user.role === 'student') {
        const { Student } = require('../student/student.model');
        let studentId;
        if (user.role === 'student') {
            const student = await Student.findOne({ userId: user.id });
            if (student) {
                studentId = student._id.toString();
            }
        }
        if (studentId) {
            const exams = await exam_service_1.examService.getExamsForStudent(studentId);
            const upcomingExams = exams.filter(exam => exam.status === 'upcoming');
            const completedExams = exams.filter(exam => exam.status === 'completed');
            const resultsAvailable = exams.filter(exam => exam.resultsPublished);
            stats = {
                totalExams: exams.length,
                upcomingExams: upcomingExams.length,
                completedExams: completedExams.length,
                resultsAvailable: resultsAvailable.length,
                nextExam: upcomingExams.length > 0 ? upcomingExams
                    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())[0] : null,
                recentResults: resultsAvailable
                    .sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime())
                    .slice(0, 5),
                examTypes: exams.reduce((acc, exam) => {
                    acc[exam.examType] = (acc[exam.examType] || 0) + 1;
                    return acc;
                }, {}),
            };
        }
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Exam dashboard statistics retrieved successfully',
        data: stats,
    });
});
const getStudentExamResults = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { studentId } = req.params;
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Student exam results retrieved successfully',
        data: [],
    });
});
exports.ExamController = {
    createExam,
    getExamById,
    updateExam,
    deleteExam,
    publishExam,
    getExamsForTeacher,
    getExamsForStudent,
    getExamsForClass,
    getExamSchedule,
    submitExamResults,
    publishExamResults,
    getExamResults,
    getExamStatistics,
    getUpcomingExams,
    getExamCalendar,
    getExamDashboardStats,
    getStudentExamResults,
};
//# sourceMappingURL=exam.controller.js.map