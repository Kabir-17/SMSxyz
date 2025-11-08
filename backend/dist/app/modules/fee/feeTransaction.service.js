"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feeTransaction_model_1 = __importDefault(require("./feeTransaction.model"));
const studentFeeRecord_model_1 = __importDefault(require("./studentFeeRecord.model"));
const fee_interface_1 = require("./fee.interface");
const AppError_1 = require("../../errors/AppError");
class FeeTransactionService {
    async getTransactionById(id) {
        const transaction = await feeTransaction_model_1.default.findById(id)
            .populate("student", "studentId firstName lastName grade")
            .populate("collectedBy", "name email")
            .populate("cancelledBy", "name email");
        if (!transaction) {
            throw new AppError_1.AppError(404, "Transaction not found");
        }
        return transaction;
    }
    async getTransactions(filters) {
        const query = {};
        if (filters.school)
            query.school = filters.school;
        if (filters.student)
            query.student = filters.student;
        if (filters.collectedBy)
            query.collectedBy = filters.collectedBy;
        if (filters.transactionType)
            query.transactionType = filters.transactionType;
        if (filters.status)
            query.status = filters.status;
        if (filters.startDate || filters.endDate) {
            query.createdAt = {};
            if (filters.startDate)
                query.createdAt.$gte = filters.startDate;
            if (filters.endDate)
                query.createdAt.$lte = filters.endDate;
        }
        const transactions = await feeTransaction_model_1.default.find(query)
            .populate("student", "studentId firstName lastName grade")
            .populate("collectedBy", "name email")
            .sort({ createdAt: -1 })
            .limit(filters.limit || 50)
            .skip(filters.skip || 0);
        const total = await feeTransaction_model_1.default.countDocuments(query);
        return {
            transactions,
            total,
            page: Math.floor((filters.skip || 0) / (filters.limit || 50)) + 1,
            pages: Math.ceil(total / (filters.limit || 50)),
        };
    }
    async cancelTransaction(transactionId, cancelledBy, reason) {
        const transaction = await feeTransaction_model_1.default.findById(transactionId);
        if (!transaction) {
            throw new AppError_1.AppError(404, "Transaction not found");
        }
        if (!transaction.canBeCancelled()) {
            throw new AppError_1.AppError(403, "Transaction cannot be cancelled after 24 hours. Please create a refund instead.");
        }
        await transaction.cancel(cancelledBy, reason);
        const feeRecord = await studentFeeRecord_model_1.default.findById(transaction.studentFeeRecord);
        if (feeRecord && transaction.month) {
            const monthlyPayment = feeRecord.monthlyPayments.find((p) => p.month === transaction.month);
            if (monthlyPayment) {
                monthlyPayment.paidAmount -= transaction.amount;
                if (monthlyPayment.paidAmount < 0)
                    monthlyPayment.paidAmount = 0;
                if (monthlyPayment.paidAmount === 0) {
                    monthlyPayment.status = fee_interface_1.PaymentStatus.PENDING;
                }
                else if (monthlyPayment.paidAmount < monthlyPayment.dueAmount + (monthlyPayment.lateFee || 0)) {
                    monthlyPayment.status = fee_interface_1.PaymentStatus.PARTIAL;
                }
                await feeRecord.save();
            }
        }
        return transaction;
    }
    async createRefund(data) {
        const feeRecord = await studentFeeRecord_model_1.default.findById(data.studentFeeRecordId);
        if (!feeRecord) {
            throw new AppError_1.AppError(404, "Student fee record not found");
        }
        if (data.amount > feeRecord.totalPaidAmount) {
            throw new AppError_1.AppError(400, `Refund amount (${data.amount}) cannot exceed total paid amount (${feeRecord.totalPaidAmount})`);
        }
        const transaction = await feeTransaction_model_1.default.create({
            transactionId: `RFD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
            student: data.studentId,
            studentFeeRecord: data.studentFeeRecordId,
            school: data.schoolId,
            transactionType: fee_interface_1.TransactionType.REFUND,
            amount: data.amount,
            collectedBy: data.refundedBy,
            remarks: data.reason,
            status: fee_interface_1.TransactionStatus.COMPLETED,
            auditLog: {
                ipAddress: data.auditInfo?.ipAddress,
                deviceInfo: data.auditInfo?.deviceInfo,
                timestamp: new Date(),
            },
        });
        feeRecord.totalPaidAmount -= data.amount;
        feeRecord.totalDueAmount += data.amount;
        await feeRecord.save();
        return transaction;
    }
    async getDailyCollectionSummary(schoolId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return feeTransaction_model_1.default.aggregate([
            {
                $match: {
                    school: schoolId,
                    transactionType: fee_interface_1.TransactionType.PAYMENT,
                    status: fee_interface_1.TransactionStatus.COMPLETED,
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                },
            },
            {
                $group: {
                    _id: {
                        collectedBy: "$collectedBy",
                        paymentMethod: "$paymentMethod",
                    },
                    totalAmount: { $sum: "$amount" },
                    transactionCount: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id.collectedBy",
                    foreignField: "_id",
                    as: "collector",
                },
            },
            {
                $unwind: "$collector",
            },
            {
                $project: {
                    collectedBy: "$collector.name",
                    paymentMethod: "$_id.paymentMethod",
                    totalAmount: 1,
                    transactionCount: 1,
                },
            },
        ]);
    }
    async detectSuspiciousPatterns(schoolId, collectorId, timeWindowHours = 1) {
        return feeTransaction_model_1.default.detectSuspiciousPatterns(schoolId, collectorId, timeWindowHours);
    }
    async getReceiptByTransactionId(transactionId) {
        const transaction = await feeTransaction_model_1.default.findById(transactionId)
            .populate("student", "studentId firstName lastName grade parentContact")
            .populate("collectedBy", "name email")
            .populate("school", "name schoolId address");
        if (!transaction) {
            throw new AppError_1.AppError(404, "Transaction not found");
        }
        if (transaction.transactionType !== fee_interface_1.TransactionType.PAYMENT) {
            throw new AppError_1.AppError(400, "Receipt is only available for payment transactions");
        }
        return transaction;
    }
    async getReceiptByReceiptNumber(receiptNumber) {
        const transaction = await feeTransaction_model_1.default.findOne({ receiptNumber })
            .populate("student", "studentId firstName lastName grade parentContact")
            .populate("collectedBy", "name email")
            .populate("school", "name schoolId address");
        if (!transaction) {
            throw new AppError_1.AppError(404, "Receipt not found");
        }
        return transaction;
    }
    async getTransactionStatistics(schoolId, startDate, endDate) {
        const stats = await feeTransaction_model_1.default.aggregate([
            {
                $match: {
                    school: schoolId,
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: {
                        type: "$transactionType",
                        status: "$status",
                    },
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);
        return stats;
    }
}
exports.default = new FeeTransactionService();
//# sourceMappingURL=feeTransaction.service.js.map