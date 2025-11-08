"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchCollectFeeSchema = exports.getReceiptSchema = exports.generateReceiptSchema = exports.requestTransactionCancellationSchema = exports.getDailyCollectionSummarySchema = exports.getAccountantTransactionsSchema = exports.validateFeeCollectionSchema = exports.collectFeeSchema = exports.getStudentFeeStatusSchema = exports.searchStudentSchema = void 0;
const zod_1 = require("zod");
const fee_interface_1 = require("./fee.interface");
exports.searchStudentSchema = zod_1.z.object({
    query: zod_1.z.object({
        studentId: zod_1.z.string({
            required_error: "Student ID is required",
        }).trim().min(1, "Student ID cannot be empty"),
    }),
});
exports.getStudentFeeStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
    }),
    query: zod_1.z.object({
        academicYear: zod_1.z.string().regex(/^\d{4}-\d{4}$/).optional(),
    }),
});
exports.collectFeeSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentId: zod_1.z.string({
            required_error: "Student ID is required",
        }).regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
        month: zod_1.z.nativeEnum(fee_interface_1.Month, {
            errorMap: () => ({ message: "Invalid month" }),
        }),
        amount: zod_1.z.number({
            required_error: "Amount is required",
            invalid_type_error: "Amount must be a number",
        }).positive("Amount must be greater than 0"),
        paymentMethod: zod_1.z.nativeEnum(fee_interface_1.PaymentMethod, {
            errorMap: () => ({ message: "Invalid payment method" }),
        }),
        remarks: zod_1.z.string().trim().max(500, "Remarks cannot exceed 500 characters").optional(),
        includeLateFee: zod_1.z.boolean().optional(),
    }),
});
exports.validateFeeCollectionSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentId: zod_1.z.string({
            required_error: "Student ID is required",
        }).regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
        month: zod_1.z.nativeEnum(fee_interface_1.Month, {
            errorMap: () => ({ message: "Invalid month" }),
        }),
        amount: zod_1.z.number({
            required_error: "Amount is required",
        }).positive("Amount must be greater than 0"),
        includeLateFee: zod_1.z.boolean().optional(),
    }),
});
exports.getAccountantTransactionsSchema = zod_1.z.object({
    query: zod_1.z.object({
        date: zod_1.z.string().datetime().optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
        status: zod_1.z.enum(["completed", "cancelled"]).optional(),
    }),
});
exports.getDailyCollectionSummarySchema = zod_1.z.object({
    query: zod_1.z.object({
        date: zod_1.z.string().datetime().optional(),
    }),
});
exports.requestTransactionCancellationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid transaction ID format"),
    }),
    body: zod_1.z.object({
        reason: zod_1.z.string({
            required_error: "Reason is required",
        }).trim().min(10, "Reason must be at least 10 characters")
            .max(500, "Reason cannot exceed 500 characters"),
    }),
});
exports.generateReceiptSchema = zod_1.z.object({
    params: zod_1.z.object({
        transactionId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid transaction ID format"),
    }),
});
exports.getReceiptSchema = zod_1.z.object({
    params: zod_1.z.object({
        receiptNumber: zod_1.z.string({
            required_error: "Receipt number is required",
        }).trim().min(1, "Receipt number cannot be empty"),
    }),
});
exports.batchCollectFeeSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentId: zod_1.z.string({
            required_error: "Student ID is required",
        }).regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
        payments: zod_1.z.array(zod_1.z.object({
            month: zod_1.z.nativeEnum(fee_interface_1.Month),
            amount: zod_1.z.number().positive(),
        })).min(1, "At least one payment is required"),
        paymentMethod: zod_1.z.nativeEnum(fee_interface_1.PaymentMethod),
        remarks: zod_1.z.string().trim().max(500).optional(),
    }),
});
//# sourceMappingURL=accountantFee.validation.js.map