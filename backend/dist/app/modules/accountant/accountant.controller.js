"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountantController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = require("../../errors/AppError");
const accountant_service_1 = require("./accountant.service");
const accountant_credentials_service_1 = require("./accountant.credentials.service");
const createAccountant = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const accountantData = req.body;
    const adminUser = req.user;
    if (!adminUser?.id) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, "Admin user not found");
    }
    const accountantDataWithSchoolId = {
        ...accountantData,
        schoolId: adminUser.schoolId,
    };
    const files = req.files;
    const result = await accountant_service_1.accountantService.createAccountant(accountantDataWithSchoolId, files);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Accountant created successfully",
        data: result,
    });
});
const getAllAccountants = (0, catchAsync_1.catchAsync)(async (req, res) => {
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
    const result = await accountant_service_1.accountantService.getAccountants(filtersWithSchoolId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Accountants retrieved successfully",
        meta: {
            page: result.currentPage,
            limit: Number(filters.limit) || 20,
            total: result.totalCount,
        },
        data: result.accountants,
    });
});
const getAccountantById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await accountant_service_1.accountantService.getAccountantById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Accountant retrieved successfully",
        data: result,
    });
});
const updateAccountant = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await accountant_service_1.accountantService.updateAccountant(id, updateData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Accountant updated successfully",
        data: result,
    });
});
const deleteAccountant = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await accountant_service_1.accountantService.deleteAccountant(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Accountant deleted successfully",
        data: null,
    });
});
const getAccountantStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { schoolId } = req.params;
    const result = await accountant_service_1.accountantService.getAccountantStats(schoolId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Accountant statistics retrieved successfully",
        data: result,
    });
});
const getAccountantCredentials = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { accountantId } = req.params;
    const result = await accountant_credentials_service_1.AccountantCredentialsService.getAccountantCredentials(accountantId);
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Accountant credentials not found");
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Accountant credentials retrieved successfully",
        data: result,
    });
});
const resetAccountantPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { accountantId } = req.params;
    const result = await accountant_credentials_service_1.AccountantCredentialsService.resetAccountantPassword(accountantId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Accountant password reset successfully",
        data: result,
    });
});
exports.AccountantController = {
    createAccountant,
    getAllAccountants,
    getAccountantById,
    updateAccountant,
    deleteAccountant,
    getAccountantStats,
    getAccountantCredentials,
    resetAccountantPassword,
};
//# sourceMappingURL=accountant.controller.js.map