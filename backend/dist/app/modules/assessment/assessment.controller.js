"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const assessment_service_1 = require("./assessment.service");
const adminSortFields = [
    "examDate",
    "averagePercentage",
    "totalMarks",
    "gradedCount",
    "examName",
];
const resolveAdminSortField = (value) => {
    if (typeof value !== "string") {
        return undefined;
    }
    return adminSortFields.includes(value)
        ? value
        : undefined;
};
const getTeacherAssignments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const assignments = await assessment_service_1.assessmentService.getTeacherAssignments(req.user.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teacher assignments retrieved successfully",
        data: assignments,
    });
});
const createAssessment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const assessment = await assessment_service_1.assessmentService.createAssessment(req.user, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Assessment created successfully",
        data: assessment,
    });
});
const listTeacherAssessments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = await assessment_service_1.assessmentService.listTeacherAssessments(req.user, {
        subjectId: req.query.subjectId,
        grade: req.query.grade ? Number.parseInt(req.query.grade, 10) : undefined,
        section: req.query.section,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Assessments retrieved successfully",
        data: payload,
    });
});
const getAssessmentDetails = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const details = await assessment_service_1.assessmentService.getAssessmentDetails(req.user, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Assessment details retrieved successfully",
        data: details,
    });
});
const updateAssessment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const updated = await assessment_service_1.assessmentService.updateAssessment(req.user, req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Assessment updated successfully",
        data: updated,
    });
});
const deleteAssessment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await assessment_service_1.assessmentService.deleteAssessment(req.user, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Assessment archived successfully",
        data: null,
    });
});
const submitAssessmentResults = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const summary = await assessment_service_1.assessmentService.saveAssessmentResults(req.user, req.params.id, req.body.results);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Assessment results saved successfully",
        data: summary,
    });
});
const exportAssessment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const format = req.query.format === "xlsx" ? "xlsx" : "csv";
    const file = await assessment_service_1.assessmentService.exportAssessment(req.user, req.params.id, {
        format,
        filename: `assessment-${req.params.id}`,
    });
    res.setHeader("Content-Disposition", `attachment; filename=${file.filename}`);
    res.type(file.mimeType);
    res.send(file.buffer);
});
const exportTeacherAssessments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const format = req.query.format === "xlsx" ? "xlsx" : "csv";
    const subjectId = req.query.subjectId;
    const grade = Number.parseInt(req.query.grade, 10);
    const section = req.query.section;
    const file = await assessment_service_1.assessmentService.exportTeacherAssessments(req.user, { subjectId, grade, section }, { format, filename: `assessment-summary-${grade}${section}` });
    res.setHeader("Content-Disposition", `attachment; filename=${file.filename}`);
    res.type(file.mimeType);
    res.send(file.buffer);
});
const getTeacherPerformanceMatrix = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const matrix = await assessment_service_1.assessmentService.getTeacherPerformanceMatrix(req.user, {
        subjectId: req.query.subjectId,
        grade: Number.parseInt(req.query.grade, 10),
        section: req.query.section,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Performance matrix generated successfully",
        data: matrix,
    });
});
const listCategories = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const categories = await assessment_service_1.assessmentService.listCategories(req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Assessment types retrieved successfully",
        data: categories,
    });
});
const createCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const category = await assessment_service_1.assessmentService.createCategory(req.user, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Assessment type created successfully",
        data: category,
    });
});
const updateCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const category = await assessment_service_1.assessmentService.updateCategory(req.user, req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Assessment type updated successfully",
        data: category,
    });
});
const listAdminAssessments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const sortBy = resolveAdminSortField(req.query.sortBy);
    const assessments = await assessment_service_1.assessmentService.listAdminAssessments(req.user, {
        schoolId: req.user.schoolId,
        grade: req.query.grade ? Number.parseInt(req.query.grade, 10) : undefined,
        section: req.query.section,
        subjectId: req.query.subjectId,
        searchTerm: req.query.search,
        includeHidden: typeof req.query.includeHidden === "boolean"
            ? req.query.includeHidden
            : req.query.includeHidden === "true",
        onlyFavorites: typeof req.query.onlyFavorites === "boolean"
            ? req.query.onlyFavorites
            : req.query.onlyFavorites === "true",
        categoryId: req.query.categoryId,
        teacherId: req.query.teacherId,
        sortBy,
        sortDirection: req.query.sortDirection === "asc" || req.query.sortDirection === "desc"
            ? req.query.sortDirection
            : undefined,
        fromDate: req.query.fromDate instanceof Date
            ? req.query.fromDate
            : req.query.fromDate
                ? new Date(req.query.fromDate)
                : undefined,
        toDate: req.query.toDate instanceof Date
            ? req.query.toDate
            : req.query.toDate
                ? new Date(req.query.toDate)
                : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Class assessments retrieved successfully",
        data: assessments,
    });
});
const exportAdminAssessments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const format = req.query.format === "xlsx" ? "xlsx" : "csv";
    const sortBy = resolveAdminSortField(req.query.sortBy);
    const file = await assessment_service_1.assessmentService.exportAdminAssessments(req.user, {
        schoolId: req.user.schoolId,
        grade: req.query.grade ? Number.parseInt(req.query.grade, 10) : undefined,
        section: req.query.section,
        subjectId: req.query.subjectId,
        categoryId: req.query.categoryId,
        teacherId: req.query.teacherId,
        searchTerm: req.query.search,
        includeHidden: typeof req.query.includeHidden === "boolean"
            ? req.query.includeHidden
            : req.query.includeHidden === "true",
        onlyFavorites: typeof req.query.onlyFavorites === "boolean"
            ? req.query.onlyFavorites
            : req.query.onlyFavorites === "true",
        sortBy,
        sortDirection: req.query.sortDirection === "asc" || req.query.sortDirection === "desc"
            ? req.query.sortDirection
            : undefined,
        fromDate: req.query.fromDate instanceof Date
            ? req.query.fromDate
            : req.query.fromDate
                ? new Date(req.query.fromDate)
                : undefined,
        toDate: req.query.toDate instanceof Date
            ? req.query.toDate
            : req.query.toDate
                ? new Date(req.query.toDate)
                : undefined,
        assessmentIds: Array.isArray(req.query.assessmentIds)
            ? req.query.assessmentIds
            : req.query.assessmentIds
                ? (req.query.assessmentIds
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean))
                : undefined,
        format,
    });
    res.setHeader("Content-Disposition", `attachment; filename=${file.filename}`);
    res.type(file.mimeType);
    res.send(file.buffer);
});
const updateAdminAssessmentPreference = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const preference = await assessment_service_1.assessmentService.updateAdminAssessmentPreference(req.user, req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Assessment preference updated successfully",
        data: preference,
    });
});
const getAdminClasses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const classes = await assessment_service_1.assessmentService.getAdminClassCatalog(req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Class catalog retrieved successfully",
        data: classes,
    });
});
const getStudentAssessments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const data = await assessment_service_1.assessmentService.getStudentAssessments(req.user, req.params.studentId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student assessments retrieved successfully",
        data,
    });
});
exports.AssessmentController = {
    getTeacherAssignments,
    createAssessment,
    listTeacherAssessments,
    getAssessmentDetails,
    updateAssessment,
    deleteAssessment,
    submitAssessmentResults,
    exportAssessment,
    exportTeacherAssessments,
    getTeacherPerformanceMatrix,
    listCategories,
    createCategory,
    updateCategory,
    listAdminAssessments,
    exportAdminAssessments,
    updateAdminAssessmentPreference,
    getStudentAssessments,
    getAdminClasses,
};
//# sourceMappingURL=assessment.controller.js.map