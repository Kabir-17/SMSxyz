"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const fee_interface_1 = require("./fee.interface");
const crypto_1 = __importDefault(require("crypto"));
const feeTransactionSchema = new mongoose_1.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Student",
        required: [true, "Student is required"],
        index: true,
    },
    studentFeeRecord: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "StudentFeeRecord",
        required: [true, "Student fee record is required"],
        index: true,
    },
    school: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "School",
        required: [true, "School is required"],
        index: true,
    },
    transactionType: {
        type: String,
        enum: Object.values(fee_interface_1.TransactionType),
        required: [true, "Transaction type is required"],
        index: true,
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount must be non-negative"],
    },
    paymentMethod: {
        type: String,
        enum: Object.values(fee_interface_1.PaymentMethod),
    },
    month: {
        type: Number,
        enum: Object.values(fee_interface_1.Month).filter((v) => typeof v === "number"),
    },
    status: {
        type: String,
        enum: Object.values(fee_interface_1.TransactionStatus),
        default: fee_interface_1.TransactionStatus.COMPLETED,
        index: true,
    },
    collectedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Collector is required"],
        index: true,
    },
    remarks: {
        type: String,
        trim: true,
    },
    receiptNumber: {
        type: String,
        trim: true,
        index: true,
    },
    cancelledBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    cancelledAt: {
        type: Date,
    },
    cancellationReason: {
        type: String,
        trim: true,
    },
    auditLog: {
        ipAddress: {
            type: String,
            trim: true,
        },
        deviceInfo: {
            type: String,
            trim: true,
        },
        timestamp: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
feeTransactionSchema.index({ school: 1, createdAt: -1 });
feeTransactionSchema.index({ student: 1, createdAt: -1 });
feeTransactionSchema.index({ collectedBy: 1, createdAt: -1 });
feeTransactionSchema.pre("save", async function (next) {
    if (this.isNew) {
        if (!this.transactionId) {
            const timestamp = Date.now().toString(36).toUpperCase();
            const randomStr = crypto_1.default.randomBytes(4).toString("hex").toUpperCase();
            this.transactionId = `TXN-${timestamp}-${randomStr}`;
        }
        if (this.transactionType === fee_interface_1.TransactionType.PAYMENT &&
            !this.receiptNumber) {
            const date = new Date();
            const year = date.getFullYear().toString().slice(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const randomNum = crypto_1.default.randomBytes(3).toString("hex").toUpperCase();
            this.receiptNumber = `RCP-${year}${month}-${randomNum}`;
        }
    }
    next();
});
feeTransactionSchema.statics.createPayment = async function (studentId, studentFeeRecordId, schoolId, amount, month, paymentMethod, collectedBy, remarks, auditInfo) {
    return this.create({
        student: studentId,
        studentFeeRecord: studentFeeRecordId,
        school: schoolId,
        transactionType: fee_interface_1.TransactionType.PAYMENT,
        amount,
        month,
        paymentMethod,
        collectedBy,
        remarks,
        status: fee_interface_1.TransactionStatus.COMPLETED,
        auditLog: {
            ipAddress: auditInfo?.ipAddress,
            deviceInfo: auditInfo?.deviceInfo,
            timestamp: new Date(),
        },
    });
};
feeTransactionSchema.statics.createRefund = async function (studentId, studentFeeRecordId, schoolId, amount, refundedBy, reason, auditInfo) {
    return this.create({
        student: studentId,
        studentFeeRecord: studentFeeRecordId,
        school: schoolId,
        transactionType: fee_interface_1.TransactionType.REFUND,
        amount,
        collectedBy: refundedBy,
        remarks: reason,
        status: fee_interface_1.TransactionStatus.COMPLETED,
        auditLog: {
            ipAddress: auditInfo?.ipAddress,
            deviceInfo: auditInfo?.deviceInfo,
            timestamp: new Date(),
        },
    });
};
feeTransactionSchema.methods.cancel = async function (cancelledBy, reason) {
    if (this.status === fee_interface_1.TransactionStatus.CANCELLED) {
        throw new Error("Transaction is already cancelled");
    }
    if (this.status === fee_interface_1.TransactionStatus.REFUNDED) {
        throw new Error("Cannot cancel a refunded transaction");
    }
    const hoursSinceTransaction = (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceTransaction > 24) {
        throw new Error("Cannot cancel transaction after 24 hours. Please create a refund instead.");
    }
    this.status = fee_interface_1.TransactionStatus.CANCELLED;
    this.cancelledBy = cancelledBy;
    this.cancelledAt = new Date();
    this.cancellationReason = reason;
    return this.save();
};
feeTransactionSchema.methods.canBeCancelled = function () {
    if (this.status === fee_interface_1.TransactionStatus.CANCELLED ||
        this.status === fee_interface_1.TransactionStatus.REFUNDED) {
        return false;
    }
    const hoursSinceTransaction = (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60);
    return hoursSinceTransaction <= 24;
};
feeTransactionSchema.statics.getTransactionsByDateRange = async function (schoolId, startDate, endDate, options) {
    const query = {
        school: schoolId,
        createdAt: { $gte: startDate, $lte: endDate },
    };
    if (options?.transactionType) {
        query.transactionType = options.transactionType;
    }
    if (options?.status) {
        query.status = options.status;
    }
    if (options?.collectedBy) {
        query.collectedBy = options.collectedBy;
    }
    return this.find(query)
        .populate("student", "studentId firstName lastName")
        .populate("collectedBy", "name email")
        .sort({ createdAt: -1 });
};
feeTransactionSchema.statics.getDailyCollectionSummary = async function (schoolId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return this.aggregate([
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
};
feeTransactionSchema.statics.detectSuspiciousPatterns = async function (schoolId, collectorId, timeWindowHours = 1) {
    const cutoffTime = new Date(Date.now() - timeWindowHours * 60 * 60 * 1000);
    const recentTransactions = await this.find({
        school: schoolId,
        collectedBy: collectorId,
        status: fee_interface_1.TransactionStatus.COMPLETED,
        createdAt: { $gte: cutoffTime },
    });
    const duplicates = [];
    const amountMap = new Map();
    recentTransactions.forEach((txn) => {
        const key = txn.amount;
        if (!amountMap.has(key)) {
            amountMap.set(key, []);
        }
        amountMap.get(key).push(txn);
    });
    amountMap.forEach((txns, amount) => {
        if (txns.length > 1) {
            duplicates.push({
                amount,
                count: txns.length,
                transactions: txns,
            });
        }
    });
    return {
        hasSuspiciousPattern: duplicates.length > 0,
        duplicates,
        totalTransactions: recentTransactions.length,
    };
};
const FeeTransaction = (0, mongoose_1.model)("FeeTransaction", feeTransactionSchema);
exports.default = FeeTransaction;
//# sourceMappingURL=feeTransaction.model.js.map