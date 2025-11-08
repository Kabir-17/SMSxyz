"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsSchema = exports.cancelTransactionSchema = exports.getDefaultersSchema = exports.getFinancialOverviewSchema = exports.batchWaiveFeeSchema = exports.waiveFeeSchema = exports.createStudentFeeRecordSchema = exports.queryFeeStructuresSchema = exports.getFeeStructureSchema = exports.updateFeeStructureSchema = exports.createFeeStructureSchema = exports.feeComponentSchema = void 0;
const zod_1 = require("zod");
const fee_interface_1 = require("./fee.interface");
exports.feeComponentSchema = zod_1.z.object({
    feeType: zod_1.z.nativeEnum(fee_interface_1.FeeType, {
        errorMap: () => ({ message: "Invalid fee type" }),
    }),
    amount: zod_1.z
        .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
    })
        .min(0, "Amount must be non-negative"),
    description: zod_1.z.string().trim().optional(),
    isMandatory: zod_1.z.boolean().default(true),
    isOneTime: zod_1.z.boolean().default(false),
});
exports.createFeeStructureSchema = zod_1.z.object({
    body: zod_1.z.object({
        school: zod_1.z.string({
            required_error: "School ID is required",
        }).regex(/^[0-9a-fA-F]{24}$/, "Invalid school ID format"),
        grade: zod_1.z.string({
            required_error: "Grade is required",
        }).trim().min(1, "Grade cannot be empty"),
        academicYear: zod_1.z.string({
            required_error: "Academic year is required",
        }).regex(/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"),
        feeComponents: zod_1.z.array(exports.feeComponentSchema)
            .min(1, "At least one fee component is required"),
        dueDate: zod_1.z.number({
            required_error: "Due date is required",
        }).min(1, "Due date must be between 1 and 31")
            .max(31, "Due date must be between 1 and 31"),
        lateFeePercentage: zod_1.z.number().min(0).max(100).default(0),
    }),
});
exports.updateFeeStructureSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid fee structure ID format"),
    }),
    body: zod_1.z.object({
        feeComponents: zod_1.z.array(exports.feeComponentSchema).optional(),
        dueDate: zod_1.z.number().min(1).max(31).optional(),
        lateFeePercentage: zod_1.z.number().min(0).max(100).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.getFeeStructureSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid fee structure ID format"),
    }),
});
exports.queryFeeStructuresSchema = zod_1.z.object({
    query: zod_1.z.object({
        school: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid school ID format").optional(),
        grade: zod_1.z.string().trim().optional(),
        academicYear: zod_1.z.string().regex(/^\d{4}-\d{4}$/).optional(),
        isActive: zod_1.z.enum(["true", "false"]).optional(),
    }),
});
exports.createStudentFeeRecordSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentId: zod_1.z.string({
            required_error: "Student ID is required",
        }).regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
        feeStructureId: zod_1.z.string({
            required_error: "Fee structure ID is required",
        }).regex(/^[0-9a-fA-F]{24}$/, "Invalid fee structure ID format"),
        academicYear: zod_1.z.string({
            required_error: "Academic year is required",
        }).regex(/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"),
    }),
});
exports.waiveFeeSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentId: zod_1.z.string({
            required_error: "Student ID is required",
        }).regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
        month: zod_1.z.nativeEnum(fee_interface_1.Month, {
            errorMap: () => ({ message: "Invalid month" }),
        }),
        reason: zod_1.z.string({
            required_error: "Reason is required",
        }).trim().min(10, "Reason must be at least 10 characters"),
    }),
});
exports.batchWaiveFeeSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentIds: zod_1.z.array(zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format")).min(1, "At least one student ID is required"),
        month: zod_1.z.nativeEnum(fee_interface_1.Month, {
            errorMap: () => ({ message: "Invalid month" }),
        }),
        reason: zod_1.z.string({
            required_error: "Reason is required",
        }).trim().min(10, "Reason must be at least 10 characters"),
    }),
});
exports.getFinancialOverviewSchema = zod_1.z.object({
    query: zod_1.z.object({
        school: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid school ID format").optional(),
        academicYear: zod_1.z.string().regex(/^\d{4}-\d{4}$/).optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
    }),
});
exports.getDefaultersSchema = zod_1.z.object({
    query: zod_1.z.object({
        school: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid school ID format").optional(),
        grade: zod_1.z.string().trim().optional(),
        minAmount: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        minDays: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional(),
    }),
});
exports.cancelTransactionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid transaction ID format"),
    }),
    body: zod_1.z.object({
        reason: zod_1.z.string({
            required_error: "Cancellation reason is required",
        }).trim().min(10, "Reason must be at least 10 characters"),
    }),
});
exports.getTransactionsSchema = zod_1.z.object({
    query: zod_1.z.object({
        school: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid school ID format").optional(),
        student: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format").optional(),
        collectedBy: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format").optional(),
        transactionType: zod_1.z.nativeEnum(fee_interface_1.TransactionType).optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
        status: zod_1.z.enum(["completed", "cancelled", "refunded"]).optional(),
    }),
});
//# sourceMappingURL=fee.validation.js.map