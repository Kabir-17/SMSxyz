"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParentChildrenFeeStatus = exports.getStudentFeeStatusDetailed = exports.collectOneTimeFee = exports.getFinancialReports = exports.getDefaulters = exports.getStudentsByGradeSection = exports.getDashboard = exports.getReceipt = exports.getDailyCollectionSummary = exports.getAccountantTransactions = exports.collectFee = exports.validateFeeCollection = exports.getStudentFeeStatus = exports.searchStudent = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const feeCollection_service_1 = __importDefault(require("./feeCollection.service"));
exports.searchStudent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { studentId } = req.query;
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
        throw new Error("School ID is required");
    }
    const student = await feeCollection_service_1.default.searchStudent(studentId, schoolId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Student found successfully",
        data: student,
    });
});
exports.getStudentFeeStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { studentId } = req.params;
    const { academicYear } = req.query;
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
        throw new Error("School ID is required");
    }
    const status = await feeCollection_service_1.default.getStudentFeeStatus(studentId, schoolId, academicYear);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Student fee status retrieved successfully",
        data: status,
    });
});
exports.validateFeeCollection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { studentId, month, amount, includeLateFee } = req.body;
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
        throw new Error("School ID is required");
    }
    const validation = await feeCollection_service_1.default.validateFeeCollection(studentId, schoolId, month, amount, includeLateFee || false);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Fee collection validated",
        data: validation,
    });
});
exports.collectFee = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { studentId, month, amount, paymentMethod, remarks, includeLateFee } = req.body;
    const schoolId = req.user?.schoolId;
    const collectedBy = req.user?.id;
    if (!schoolId || !collectedBy) {
        throw new Error("School ID and Collector ID are required");
    }
    const auditInfo = {
        ipAddress: req.ip || req.socket.remoteAddress,
        deviceInfo: req.headers["user-agent"],
    };
    const result = await feeCollection_service_1.default.collectFee({
        studentId,
        schoolId,
        month,
        amount,
        paymentMethod,
        collectedBy,
        remarks,
        includeLateFee: includeLateFee || false,
        auditInfo,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Fee collected successfully",
        data: result,
    });
});
exports.getAccountantTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { startDate, endDate } = req.query;
    const accountantId = req.user?.id;
    const schoolId = req.user?.schoolId;
    if (!accountantId || !schoolId) {
        throw new Error("Accountant ID and School ID are required");
    }
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);
    const transactions = await feeCollection_service_1.default.getAccountantTransactions(accountantId, schoolId, start, end);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Transactions retrieved successfully",
        data: transactions,
    });
});
exports.getDailyCollectionSummary = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { date } = req.query;
    const accountantId = req.user?.id;
    const schoolId = req.user?.schoolId;
    if (!accountantId || !schoolId) {
        throw new Error("Accountant ID and School ID are required");
    }
    const targetDate = date ? new Date(date) : new Date();
    const summary = await feeCollection_service_1.default.getDailyCollectionSummary(accountantId, schoolId, targetDate);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Daily collection summary retrieved successfully",
        data: summary,
    });
});
exports.getReceipt = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { transactionId } = req.params;
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
        throw new Error("School ID is required");
    }
    const receipt = await feeCollection_service_1.default.getStudentFeeStatus(transactionId, schoolId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Receipt retrieved successfully",
        data: receipt,
    });
});
exports.getDashboard = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const accountantId = req.user?.id;
    const schoolId = req.user?.schoolId;
    if (!accountantId || !schoolId) {
        throw new Error("Accountant ID and School ID are required");
    }
    const dashboardData = await feeCollection_service_1.default.getAccountantDashboard(accountantId, schoolId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Dashboard data retrieved successfully",
        data: dashboardData,
    });
});
exports.getStudentsByGradeSection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { grade, section } = req.query;
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
        throw new Error("School ID is required");
    }
    const students = await feeCollection_service_1.default.getStudentsByGradeSection(schoolId, grade ? Number(grade) : undefined, section);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Students retrieved successfully",
        data: students,
    });
});
exports.getDefaulters = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
        throw new Error("School ID is required");
    }
    const defaulters = await feeCollection_service_1.default.getDefaulters(schoolId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Defaulters retrieved successfully",
        data: defaulters,
    });
});
exports.getFinancialReports = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { reportType, startDate, endDate } = req.query;
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
        throw new Error("School ID is required");
    }
    const reports = await feeCollection_service_1.default.getFinancialReports(schoolId, reportType || 'monthly', startDate, endDate);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Financial reports retrieved successfully",
        data: reports,
    });
});
exports.collectOneTimeFee = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { studentId, feeType, amount, paymentMethod, remarks } = req.body;
    const schoolId = req.user?.schoolId;
    const collectedBy = req.user?.id;
    if (!schoolId || !collectedBy) {
        throw new Error("School ID and Collector ID are required");
    }
    const auditInfo = {
        ipAddress: req.ip || req.socket.remoteAddress,
        deviceInfo: req.headers["user-agent"],
    };
    const result = await feeCollection_service_1.default.collectOneTimeFee({
        studentId,
        schoolId,
        feeType,
        amount,
        paymentMethod,
        collectedBy,
        remarks,
        auditInfo,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: `${feeType} fee collected successfully`,
        data: result,
    });
});
exports.getStudentFeeStatusDetailed = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { studentId } = req.params;
    const schoolId = req.user?.schoolId;
    if (!schoolId) {
        throw new Error("School ID is required");
    }
    const feeStatus = await feeCollection_service_1.default.getStudentFeeStatusDetailed(studentId, schoolId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Student fee status retrieved successfully",
        data: feeStatus,
    });
});
exports.getParentChildrenFeeStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const parentId = req.user?.id;
    const schoolId = req.user?.schoolId;
    if (!parentId || !schoolId) {
        throw new Error("Parent ID and School ID are required");
    }
    const childrenFees = await feeCollection_service_1.default.getParentChildrenFeeStatus(parentId, schoolId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Children fee status retrieved successfully",
        data: childrenFees,
    });
});
//# sourceMappingURL=accountantFee.controller.js.map