"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeworkController = void 0;
const homework_service_1 = require("./homework.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = require("../../errors/AppError");
const teacher_model_1 = require("../teacher/teacher.model");
const student_model_1 = require("../student/student.model");
const createHomework = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user, teacher } = req;
    if (!user || user.role !== 'teacher' || !teacher) {
        throw new AppError_1.AppError(403, 'Only teachers can create homework');
    }
    const files = req.files;
    const homework = await homework_service_1.homeworkService.createHomework(req.body, teacher._id.toString(), files);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Homework created successfully',
        data: homework,
    });
});
const getHomeworkById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    if (!user) {
        throw new AppError_1.AppError(401, 'Authentication required');
    }
    const homework = await homework_service_1.homeworkService.getHomeworkById(id, user.id, user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Homework retrieved successfully',
        data: homework,
    });
});
const updateHomework = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { user, teacher } = req;
    if (!user || user.role !== 'teacher' || !teacher) {
        throw new AppError_1.AppError(403, 'Only teachers can update homework');
    }
    const files = req.files;
    const homework = await homework_service_1.homeworkService.updateHomework(id, req.body, user.id, files);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Homework updated successfully',
        data: homework,
    });
});
const deleteHomework = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    if (!user || user.role !== 'teacher') {
        throw new AppError_1.AppError(403, 'Only teachers can delete homework');
    }
    await homework_service_1.homeworkService.deleteHomework(id, user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Homework deleted successfully',
        data: null,
    });
});
const publishHomework = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    if (!user || user.role !== 'teacher') {
        throw new AppError_1.AppError(403, 'Only teachers can publish homework');
    }
    const homework = await homework_service_1.homeworkService.publishHomework(id, user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Homework published successfully',
        data: homework,
    });
});
const getHomeworkForTeacher = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    if (!user || user.role !== 'teacher') {
        throw new AppError_1.AppError(403, 'Only teachers can access this endpoint');
    }
    const teacher = await teacher_model_1.Teacher.findOne({ userId: user.id });
    if (!teacher) {
        throw new AppError_1.AppError(404, 'Teacher not found');
    }
    const homework = await homework_service_1.homeworkService.getHomeworkForTeacher(teacher._id.toString(), req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Teacher homework retrieved successfully',
        data: homework,
    });
});
const getHomeworkForStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    if (!user || user.role !== 'student') {
        throw new AppError_1.AppError(403, 'Only students can access this endpoint');
    }
    const student = await student_model_1.Student.findOne({ userId: user.id });
    if (!student) {
        throw new AppError_1.AppError(404, 'Student not found');
    }
    const homework = await homework_service_1.homeworkService.getHomeworkForStudent(student._id.toString(), req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Student homework retrieved successfully',
        data: homework,
    });
});
const getHomeworkForClass = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId, grade } = req.params;
    const { section } = req.query;
    const homework = await homework_service_1.homeworkService.getHomeworkForClass(schoolId, parseInt(grade), section, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Class homework retrieved successfully',
        data: homework,
    });
});
const submitHomework = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    if (!user || user.role !== 'student') {
        throw new AppError_1.AppError(403, 'Only students can submit homework');
    }
    const student = await student_model_1.Student.findOne({ userId: user.id });
    if (!student) {
        throw new AppError_1.AppError(404, 'Student not found');
    }
    req.body.studentId = student._id.toString();
    const submission = await homework_service_1.homeworkService.submitHomework(req.body, user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Homework submitted successfully',
        data: submission,
    });
});
const gradeHomeworkSubmission = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    const { submissionId, marksObtained, feedback, teacherComments } = req.body;
    if (!user || user.role !== 'teacher') {
        throw new AppError_1.AppError(403, 'Only teachers can grade homework');
    }
    const gradedSubmission = await homework_service_1.homeworkService.gradeHomeworkSubmission(submissionId, marksObtained, feedback, teacherComments, user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Homework graded successfully',
        data: gradedSubmission,
    });
});
const getHomeworkSubmissions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    if (!user || user.role !== 'teacher') {
        throw new AppError_1.AppError(403, 'Only teachers can view homework submissions');
    }
    const submissions = await homework_service_1.homeworkService.getHomeworkSubmissions(id, user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Homework submissions retrieved successfully',
        data: submissions,
    });
});
const getHomeworkCalendar = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId } = req.params;
    const { startDate, endDate, grade, section } = req.query;
    if (!startDate || !endDate) {
        throw new AppError_1.AppError(400, 'Start date and end date are required');
    }
    const calendar = await homework_service_1.homeworkService.getHomeworkCalendar(schoolId, startDate, endDate, grade ? parseInt(grade) : undefined, section);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Homework calendar retrieved successfully',
        data: calendar,
    });
});
const requestRevision = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    const { submissionId, reason } = req.body;
    if (!user || user.role !== 'teacher') {
        throw new AppError_1.AppError(403, 'Only teachers can request revisions');
    }
    const submission = await homework_service_1.homeworkService.requestRevision(submissionId, reason, user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Revision requested successfully',
        data: submission,
    });
});
const getHomeworkStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    if (!user) {
        throw new AppError_1.AppError(401, 'Authentication required');
    }
    let stats = {};
    if (user.role === 'teacher') {
        const teacher = await teacher_model_1.Teacher.findOne({ userId: user.id });
        if (!teacher) {
            throw new AppError_1.AppError(404, 'Teacher not found');
        }
        const homework = await homework_service_1.homeworkService.getHomeworkForTeacher(teacher._id.toString());
        stats = {
            totalHomework: homework.length,
            publishedHomework: homework.filter(hw => hw.isPublished).length,
            draftHomework: homework.filter(hw => !hw.isPublished).length,
            overdueHomework: homework.filter(hw => hw.isOverdue).length,
            dueTodayHomework: homework.filter(hw => hw.isDueToday).length,
            upcomingHomework: homework.filter(hw => hw.daysUntilDue > 0 && hw.daysUntilDue <= 7).length,
            byPriority: {
                urgent: homework.filter(hw => hw.priority === 'urgent').length,
                high: homework.filter(hw => hw.priority === 'high').length,
                medium: homework.filter(hw => hw.priority === 'medium').length,
                low: homework.filter(hw => hw.priority === 'low').length,
            },
            byType: {
                assignment: homework.filter(hw => hw.homeworkType === 'assignment').length,
                project: homework.filter(hw => hw.homeworkType === 'project').length,
                reading: homework.filter(hw => hw.homeworkType === 'reading').length,
                practice: homework.filter(hw => hw.homeworkType === 'practice').length,
                research: homework.filter(hw => hw.homeworkType === 'research').length,
                presentation: homework.filter(hw => hw.homeworkType === 'presentation').length,
                other: homework.filter(hw => hw.homeworkType === 'other').length,
            },
        };
    }
    else if (user.role === 'student') {
        const student = await student_model_1.Student.findOne({ userId: user.id });
        if (!student) {
            throw new AppError_1.AppError(404, 'Student not found');
        }
        const homework = await homework_service_1.homeworkService.getHomeworkForStudent(student._id.toString());
        const submittedHomework = homework.filter(hw => hw.mySubmission);
        const gradedHomework = submittedHomework.filter(hw => hw.mySubmission?.status === 'graded');
        const pendingHomework = homework.filter(hw => !hw.mySubmission);
        const overdueHomework = homework.filter(hw => hw.isOverdue && !hw.mySubmission);
        stats = {
            totalHomework: homework.length,
            submittedHomework: submittedHomework.length,
            gradedHomework: gradedHomework.length,
            pendingHomework: pendingHomework.length,
            overdueHomework: overdueHomework.length,
            dueTodayHomework: homework.filter(hw => hw.isDueToday && !hw.mySubmission).length,
            upcomingHomework: homework.filter(hw => hw.daysUntilDue > 0 && hw.daysUntilDue <= 7 && !hw.mySubmission).length,
            averageGrade: gradedHomework.length > 0
                ? gradedHomework.reduce((sum, hw) => sum + (hw.mySubmission?.percentage || 0), 0) / gradedHomework.length
                : 0,
            submissionRate: homework.length > 0 ? (submittedHomework.length / homework.length) * 100 : 0,
            onTimeSubmissions: submittedHomework.filter(hw => !hw.mySubmission?.isLate).length,
            lateSubmissions: submittedHomework.filter(hw => hw.mySubmission?.isLate).length,
        };
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Homework statistics retrieved successfully',
        data: stats,
    });
});
const getHomeworkByStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { studentId } = req.params;
    const homework = await homework_service_1.homeworkService.getHomeworkForStudent(studentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Student homework retrieved successfully',
        data: homework,
    });
});
const getUpcomingHomework = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId } = req.params;
    const { days = '7' } = req.query;
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Upcoming homework retrieved successfully',
        data: [],
    });
});
const getOverdueHomework = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId } = req.params;
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Overdue homework retrieved successfully',
        data: [],
    });
});
exports.HomeworkController = {
    createHomework,
    getHomeworkById,
    updateHomework,
    deleteHomework,
    publishHomework,
    getHomeworkForTeacher,
    getHomeworkForStudent,
    getHomeworkForClass,
    submitHomework,
    gradeHomeworkSubmission,
    getHomeworkSubmissions,
    getHomeworkCalendar,
    requestRevision,
    getHomeworkStats,
    getHomeworkByStudent,
    getUpcomingHomework,
    getOverdueHomework,
};
//# sourceMappingURL=homework.controller.js.map