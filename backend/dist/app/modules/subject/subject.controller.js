"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectController = exports.deleteSubject = exports.getSubjectsByGrade = exports.updateSubject = exports.getSubjectById = exports.getAllSubjects = exports.createSubject = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const subject_model_1 = require("./subject.model");
const AppError_1 = require("../../errors/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
exports.createSubject = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminSchoolId = req.user?.schoolId;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    const subjectData = {
        ...req.body,
        schoolId: adminSchoolId,
        createdBy: req.user?.id,
    };
    const subject = await subject_model_1.Subject.create(subjectData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Subject created successfully",
        data: subject,
    });
});
exports.getAllSubjects = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const adminSchoolId = req.user?.schoolId;
    if (!adminSchoolId) {
        return next(new AppError_1.AppError(400, "School ID not found in user context"));
    }
    const subjects = await subject_model_1.Subject.find({
        schoolId: adminSchoolId,
        isDeleted: { $ne: true },
    }).sort({ createdAt: -1 });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Subjects retrieved successfully",
        data: subjects,
    });
});
exports.getSubjectById = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const adminSchoolId = req.user?.schoolId;
    if (!id || id === "undefined" || id.trim() === "") {
        return next(new AppError_1.AppError(400, "Valid subject ID is required"));
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return next(new AppError_1.AppError(400, "Invalid subject ID format"));
    }
    const subject = await subject_model_1.Subject.findOne({
        _id: id,
        schoolId: adminSchoolId,
    });
    if (!subject) {
        return next(new AppError_1.AppError(404, "Subject not found"));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Subject retrieved successfully",
        data: subject,
    });
});
exports.updateSubject = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const adminSchoolId = req.user?.schoolId;
    if (!id || id === "undefined" || id.trim() === "") {
        return next(new AppError_1.AppError(400, "Valid subject ID is required"));
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return next(new AppError_1.AppError(400, "Invalid subject ID format"));
    }
    const subject = await subject_model_1.Subject.findOneAndUpdate({ _id: id, schoolId: adminSchoolId }, { ...req.body, updatedBy: req.user?.id }, { new: true });
    if (!subject) {
        return next(new AppError_1.AppError(404, "Subject not found"));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Subject updated successfully",
        data: subject,
    });
});
exports.getSubjectsByGrade = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { schoolId, grade } = req.params;
    const userRole = req.user?.role;
    const userSchoolId = req.user?.schoolId;
    if (userRole !== "SUPERADMIN" && userSchoolId !== schoolId) {
        return next(new AppError_1.AppError(403, "You don't have access to this school's subjects"));
    }
    const subjects = await subject_model_1.Subject.find({
        schoolId: schoolId,
        grades: { $in: [parseInt(grade)] },
    }).sort({ createdAt: -1 });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: `Subjects for grade ${grade} retrieved successfully`,
        data: subjects,
    });
});
exports.deleteSubject = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const adminSchoolId = req.user?.schoolId;
    if (!id || id === "undefined" || id.trim() === "") {
        return next(new AppError_1.AppError(400, "Valid subject ID is required"));
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return next(new AppError_1.AppError(400, "Invalid subject ID format"));
    }
    const subject = await subject_model_1.Subject.findOneAndUpdate({ _id: id, schoolId: adminSchoolId, isDeleted: false }, {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user?.id,
    }, { new: true });
    if (!subject) {
        return next(new AppError_1.AppError(404, "Subject not found"));
    }
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Subject deleted successfully",
        data: null,
    });
});
exports.SubjectController = {
    createSubject: exports.createSubject,
    getAllSubjects: exports.getAllSubjects,
    getSubjectById: exports.getSubjectById,
    getSubjectsByGrade: exports.getSubjectsByGrade,
    updateSubject: exports.updateSubject,
    deleteSubject: exports.deleteSubject,
};
//# sourceMappingURL=subject.controller.js.map