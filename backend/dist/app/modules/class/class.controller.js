"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const class_service_1 = require("./class.service");
const createClass = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const schoolId = req.user?.role === 'superadmin'
        ? req.body.schoolId
        : req.user?.schoolId?.toString();
    if (!schoolId) {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'School ID is required',
            data: null,
        });
    }
    const result = await class_service_1.classService.createClass(schoolId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Class created successfully',
        data: result,
    });
});
const getAllClasses = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const schoolId = req.user?.role === 'superadmin'
        ? req.query.schoolId
        : req.user?.schoolId?.toString();
    if (!schoolId && req.user?.role !== 'superadmin') {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'School ID is required',
            data: null,
        });
    }
    const result = await class_service_1.classService.getClasses({
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        schoolId,
        grade: req.query.grade ? parseInt(req.query.grade) : undefined,
        section: req.query.section,
        academicYear: req.query.academicYear,
        isActive: req.query.isActive ? req.query.isActive === 'true' : undefined,
        sortBy: req.query.sortBy || 'grade',
        sortOrder: req.query.sortOrder || 'asc',
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Classes retrieved successfully',
        data: result,
    });
});
const getClassById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await class_service_1.classService.getClassById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Class retrieved successfully',
        data: result,
    });
});
const updateClass = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await class_service_1.classService.updateClass(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Class updated successfully',
        data: result,
    });
});
const deleteClass = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await class_service_1.classService.deleteClass(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Class deleted successfully',
        data: null,
    });
});
const getClassesByGrade = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId, grade } = req.params;
    const result = await class_service_1.classService.getClassesByGrade(schoolId, parseInt(grade));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Classes retrieved successfully',
        data: result,
    });
});
const getClassByGradeAndSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId, grade, section } = req.params;
    const result = await class_service_1.classService.getClassByGradeAndSection(schoolId, parseInt(grade), section);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result ? 'Class retrieved successfully' : 'Class not found',
        data: result,
    });
});
const getClassStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId } = req.params;
    const targetSchoolId = req.user?.role === 'superadmin'
        ? schoolId
        : req.user?.schoolId?.toString();
    if (!targetSchoolId) {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'School ID is required',
            data: null,
        });
    }
    const result = await class_service_1.classService.getClassStats(targetSchoolId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Class statistics retrieved successfully',
        data: result,
    });
});
const checkCapacity = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId, grade } = req.params;
    const result = await class_service_1.classService.checkCapacity(schoolId, parseInt(grade));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Capacity check completed successfully',
        data: result,
    });
});
const createNewSectionIfNeeded = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId, grade } = req.params;
    const { academicYear, maxStudents } = req.body;
    const result = await class_service_1.classService.createNewSectionIfNeeded(schoolId, parseInt(grade), academicYear, maxStudents);
    if (result) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: 'New section created successfully',
            data: result,
        });
    }
    else {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'New section not needed - sufficient capacity exists',
            data: null,
        });
    }
});
exports.ClassController = {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    getClassesByGrade,
    getClassByGradeAndSection,
    getClassStats,
    checkCapacity,
    createNewSectionIfNeeded,
};
//# sourceMappingURL=class.controller.js.map