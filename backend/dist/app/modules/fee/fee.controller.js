"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportTransactions = exports.getFeeCollectionRate = exports.waiveFee = exports.cancelTransaction = exports.getTransactions = exports.getDefaultersReport = exports.getFinancialOverview = exports.cloneFeeStructure = exports.deactivateFeeStructure = exports.updateFeeStructure = exports.getFeeStructures = exports.getFeeStructure = exports.createFeeStructure = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = require("../../errors/AppError");
const feeStructure_service_1 = __importDefault(require("./feeStructure.service"));
const feeReport_service_1 = __importDefault(require("./feeReport.service"));
const studentFeeRecord_model_1 = __importDefault(require("./studentFeeRecord.model"));
const feeTransaction_service_1 = __importDefault(require("./feeTransaction.service"));
exports.createFeeStructure = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { school, grade, academicYear, feeComponents, dueDate, lateFeePercentage } = req.body;
    const createdBy = req.user?.id;
    if (!createdBy) {
        throw new AppError_1.AppError(401, "User not authenticated");
    }
    const feeStructure = await feeStructure_service_1.default.createFeeStructure({
        school,
        grade,
        academicYear,
        feeComponents,
        dueDate,
        lateFeePercentage,
        createdBy,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Fee structure created successfully",
        data: feeStructure,
    });
});
exports.getFeeStructure = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const feeStructure = await feeStructure_service_1.default.getFeeStructureById(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Fee structure retrieved successfully",
        data: feeStructure,
    });
});
exports.getFeeStructures = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { school, grade, academicYear, isActive } = req.query;
    const feeStructures = await feeStructure_service_1.default.getFeeStructuresBySchool(school, {
        grade: grade,
        academicYear: academicYear,
        isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Fee structures retrieved successfully",
        data: feeStructures,
    });
});
exports.updateFeeStructure = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { feeComponents, dueDate, lateFeePercentage } = req.body;
    const updatedBy = req.user?.id;
    if (!updatedBy) {
        throw new AppError_1.AppError(401, "User not authenticated");
    }
    const feeStructure = await feeStructure_service_1.default.updateFeeStructure(id, {
        feeComponents,
        dueDate,
        lateFeePercentage,
        updatedBy,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Fee structure updated successfully",
        data: feeStructure,
    });
});
exports.deactivateFeeStructure = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updatedBy = req.user?.id;
    if (!updatedBy) {
        throw new AppError_1.AppError(401, "User not authenticated");
    }
    const feeStructure = await feeStructure_service_1.default.deactivateFeeStructure(id, updatedBy);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Fee structure deactivated successfully",
        data: feeStructure,
    });
});
exports.cloneFeeStructure = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { targetAcademicYear } = req.body;
    const createdBy = req.user?.id;
    if (!createdBy) {
        throw new AppError_1.AppError(401, "User not authenticated");
    }
    const feeStructure = await feeStructure_service_1.default.cloneFeeStructure(id, targetAcademicYear, createdBy);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Fee structure cloned successfully",
        data: feeStructure,
    });
});
exports.getFinancialOverview = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { school, academicYear, startDate, endDate } = req.query;
    const overview = await feeReport_service_1.default.getFinancialOverview(school, academicYear, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Financial overview retrieved successfully",
        data: overview,
    });
});
exports.getDefaultersReport = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { school, grade, minAmount, minDays, limit } = req.query;
    const report = await feeReport_service_1.default.getDefaultersReport(school, {
        grade: grade,
        minAmount: minAmount ? parseInt(minAmount) : undefined,
        minDays: minDays ? parseInt(minDays) : undefined,
        limit: limit ? parseInt(limit) : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Defaulters report retrieved successfully",
        data: report,
    });
});
exports.getTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { school, student, collectedBy, transactionType, status, startDate, endDate } = req.query;
    const result = await feeTransaction_service_1.default.getTransactions({
        school: school,
        student: student,
        collectedBy: collectedBy,
        transactionType: transactionType,
        status: status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Transactions retrieved successfully",
        data: result,
    });
});
exports.cancelTransaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const cancelledBy = req.user?.id;
    if (!cancelledBy) {
        throw new AppError_1.AppError(401, "User not authenticated");
    }
    const transaction = await feeTransaction_service_1.default.cancelTransaction(id, cancelledBy, reason);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Transaction cancelled successfully",
        data: transaction,
    });
});
exports.waiveFee = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { studentId, month, reason } = req.body;
    const waivedBy = req.user?.id;
    if (!waivedBy) {
        throw new AppError_1.AppError(401, "User not authenticated");
    }
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const academicYear = currentMonth >= 4
        ? `${currentYear}-${currentYear + 1}`
        : `${currentYear - 1}-${currentYear}`;
    const feeRecord = await studentFeeRecord_model_1.default.findOne({
        student: studentId,
        academicYear,
    });
    if (!feeRecord) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 404,
            message: "Student fee record not found",
            data: null,
        });
    }
    if (!waivedBy) {
        throw new AppError_1.AppError(401, "User not authenticated");
    }
    await feeRecord.waiveFee(month, reason, waivedBy);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Fee waived successfully",
        data: feeRecord,
    });
});
exports.getFeeCollectionRate = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { school, academicYear } = req.query;
    const rate = await feeReport_service_1.default.getFeeCollectionRate(school, academicYear);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Fee collection rate retrieved successfully",
        data: rate,
    });
});
exports.exportTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { school, startDate, endDate } = req.query;
    const csvData = await feeReport_service_1.default.exportTransactionsCSV(school, new Date(startDate), new Date(endDate));
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Transactions exported successfully",
        data: csvData,
    });
});
//# sourceMappingURL=fee.controller.js.map