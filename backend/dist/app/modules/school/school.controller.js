"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceApiInfo = exports.resetAdminPassword = exports.getAdminCredentials = exports.getSystemStats = exports.regenerateApiKey = exports.updateSchoolStatus = exports.assignAdmin = exports.getSchoolStats = exports.deleteSchool = exports.updateSchool = exports.getSchool = exports.getAllSchools = exports.createSchool = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const catchAsync_1 = require("../../utils/catchAsync");
const school_service_1 = require("./school.service");
const school_model_1 = require("./school.model");
const sendResponse_1 = require("../../utils/sendResponse");
const createSchool = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await school_service_1.schoolService.createSchoolModern(req.body, new mongoose_1.Types.ObjectId(req.user?.id));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "School created successfully",
        data: {
            school: result.school,
            adminCredentials: result.credentials,
        },
    });
});
exports.createSchool = createSchool;
const getAllSchools = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await school_service_1.schoolService.getAllSchools(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Schools retrieved successfully",
        data: result,
    });
});
exports.getAllSchools = getAllSchools;
const getSchool = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await school_service_1.schoolService.getSchoolById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "School retrieved successfully",
        data: result,
    });
});
exports.getSchool = getSchool;
const updateSchool = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await school_service_1.schoolService.updateSchool(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "School updated successfully",
        data: result,
    });
});
exports.updateSchool = updateSchool;
const deleteSchool = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await school_service_1.schoolService.deleteSchool(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "School deleted successfully",
        data: null,
    });
});
exports.deleteSchool = deleteSchool;
const getSchoolStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await school_service_1.schoolService.getSchoolStats(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "School statistics retrieved successfully",
        data: result,
    });
});
exports.getSchoolStats = getSchoolStats;
const assignAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await school_service_1.schoolService.assignAdmin(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin assigned successfully",
        data: result,
    });
});
exports.assignAdmin = assignAdmin;
const updateSchoolStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await school_service_1.schoolService.updateSchoolStatus(req.params.id, req.body.status, req.body.updatedBy || new mongoose_1.Types.ObjectId());
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "School status updated successfully",
        data: result,
    });
});
exports.updateSchoolStatus = updateSchoolStatus;
const regenerateApiKey = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await school_service_1.schoolService.regenerateApiKey(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "API key regenerated successfully",
        data: result,
    });
});
exports.regenerateApiKey = regenerateApiKey;
const getSystemStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await school_service_1.schoolService.getSystemStats();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "System statistics retrieved successfully",
        data: result,
    });
});
exports.getSystemStats = getSystemStats;
const getAdminCredentials = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await school_service_1.schoolService.getAdminCredentials(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin credentials retrieved successfully",
        data: result,
    });
});
exports.getAdminCredentials = getAdminCredentials;
const resetAdminPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await school_service_1.schoolService.resetAdminPassword(req.params.id, req.body.newPassword, new mongoose_1.Types.ObjectId(req.user?.id));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Admin password reset successfully",
        data: result,
    });
});
exports.resetAdminPassword = resetAdminPassword;
const getAttendanceApiInfo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const requestedSchoolIdentifier = req.user?.schoolId || req.params.id;
    const school = await school_service_1.schoolService.getSchoolById(requestedSchoolIdentifier);
    const rawSchool = await school_model_1.School.findOne({
        $or: [
            { slug: requestedSchoolIdentifier },
            { schoolId: requestedSchoolIdentifier },
            { _id: requestedSchoolIdentifier },
        ],
    })
        .select("apiKey schoolId slug apiEndpoint")
        .lean();
    console.log(rawSchool);
    let apiKeyToReturn = undefined;
    try {
        const requesterIsSuperadmin = req.user?.role === "superadmin";
        const requesterSchoolId = req.user?.schoolId;
        const schoolMatchesRequester = !!requesterSchoolId &&
            (requesterSchoolId === school.schoolId ||
                requesterSchoolId === school.id ||
                requesterSchoolId === school._id?.toString());
        if (requesterIsSuperadmin || schoolMatchesRequester) {
            apiKeyToReturn = rawSchool?.apiKey;
        }
    }
    catch (e) {
        apiKeyToReturn = undefined;
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Attendance API information retrieved successfully",
        data: {
            schoolId: school.schoolId,
            schoolSlug: school.slug,
            apiEndpoint: school.apiEndpoint,
            apiKey: apiKeyToReturn,
            instructions: {
                endpoint: `POST ${school.apiEndpoint}/events`,
                authentication: "Include X-Attendance-Key header with your API key",
                documentation: "/api/docs/attendance-integration",
            },
        },
    });
});
exports.getAttendanceApiInfo = getAttendanceApiInfo;
//# sourceMappingURL=school.controller.js.map