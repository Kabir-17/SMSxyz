import { z } from "zod";
import { FeeType, TransactionType, Month } from "./fee.interface";
export declare const feeComponentSchema: z.ZodObject<{
    feeType: z.ZodNativeEnum<typeof FeeType>;
    amount: z.ZodNumber;
    description: z.ZodOptional<z.ZodString>;
    isMandatory: z.ZodDefault<z.ZodBoolean>;
    isOneTime: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    feeType: FeeType;
    isMandatory: boolean;
    isOneTime: boolean;
    description?: string | undefined;
}, {
    amount: number;
    feeType: FeeType;
    description?: string | undefined;
    isMandatory?: boolean | undefined;
    isOneTime?: boolean | undefined;
}>;
export declare const createFeeStructureSchema: z.ZodObject<{
    body: z.ZodObject<{
        school: z.ZodString;
        grade: z.ZodString;
        academicYear: z.ZodString;
        feeComponents: z.ZodArray<z.ZodObject<{
            feeType: z.ZodNativeEnum<typeof FeeType>;
            amount: z.ZodNumber;
            description: z.ZodOptional<z.ZodString>;
            isMandatory: z.ZodDefault<z.ZodBoolean>;
            isOneTime: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            feeType: FeeType;
            isMandatory: boolean;
            isOneTime: boolean;
            description?: string | undefined;
        }, {
            amount: number;
            feeType: FeeType;
            description?: string | undefined;
            isMandatory?: boolean | undefined;
            isOneTime?: boolean | undefined;
        }>, "many">;
        dueDate: z.ZodNumber;
        lateFeePercentage: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        school: string;
        grade: string;
        academicYear: string;
        dueDate: number;
        feeComponents: {
            amount: number;
            feeType: FeeType;
            isMandatory: boolean;
            isOneTime: boolean;
            description?: string | undefined;
        }[];
        lateFeePercentage: number;
    }, {
        school: string;
        grade: string;
        academicYear: string;
        dueDate: number;
        feeComponents: {
            amount: number;
            feeType: FeeType;
            description?: string | undefined;
            isMandatory?: boolean | undefined;
            isOneTime?: boolean | undefined;
        }[];
        lateFeePercentage?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        school: string;
        grade: string;
        academicYear: string;
        dueDate: number;
        feeComponents: {
            amount: number;
            feeType: FeeType;
            isMandatory: boolean;
            isOneTime: boolean;
            description?: string | undefined;
        }[];
        lateFeePercentage: number;
    };
}, {
    body: {
        school: string;
        grade: string;
        academicYear: string;
        dueDate: number;
        feeComponents: {
            amount: number;
            feeType: FeeType;
            description?: string | undefined;
            isMandatory?: boolean | undefined;
            isOneTime?: boolean | undefined;
        }[];
        lateFeePercentage?: number | undefined;
    };
}>;
export declare const updateFeeStructureSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        feeComponents: z.ZodOptional<z.ZodArray<z.ZodObject<{
            feeType: z.ZodNativeEnum<typeof FeeType>;
            amount: z.ZodNumber;
            description: z.ZodOptional<z.ZodString>;
            isMandatory: z.ZodDefault<z.ZodBoolean>;
            isOneTime: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            feeType: FeeType;
            isMandatory: boolean;
            isOneTime: boolean;
            description?: string | undefined;
        }, {
            amount: number;
            feeType: FeeType;
            description?: string | undefined;
            isMandatory?: boolean | undefined;
            isOneTime?: boolean | undefined;
        }>, "many">>;
        dueDate: z.ZodOptional<z.ZodNumber>;
        lateFeePercentage: z.ZodOptional<z.ZodNumber>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean | undefined;
        dueDate?: number | undefined;
        feeComponents?: {
            amount: number;
            feeType: FeeType;
            isMandatory: boolean;
            isOneTime: boolean;
            description?: string | undefined;
        }[] | undefined;
        lateFeePercentage?: number | undefined;
    }, {
        isActive?: boolean | undefined;
        dueDate?: number | undefined;
        feeComponents?: {
            amount: number;
            feeType: FeeType;
            description?: string | undefined;
            isMandatory?: boolean | undefined;
            isOneTime?: boolean | undefined;
        }[] | undefined;
        lateFeePercentage?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        isActive?: boolean | undefined;
        dueDate?: number | undefined;
        feeComponents?: {
            amount: number;
            feeType: FeeType;
            isMandatory: boolean;
            isOneTime: boolean;
            description?: string | undefined;
        }[] | undefined;
        lateFeePercentage?: number | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        isActive?: boolean | undefined;
        dueDate?: number | undefined;
        feeComponents?: {
            amount: number;
            feeType: FeeType;
            description?: string | undefined;
            isMandatory?: boolean | undefined;
            isOneTime?: boolean | undefined;
        }[] | undefined;
        lateFeePercentage?: number | undefined;
    };
}>;
export declare const getFeeStructureSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
export declare const queryFeeStructuresSchema: z.ZodObject<{
    query: z.ZodObject<{
        school: z.ZodOptional<z.ZodString>;
        grade: z.ZodOptional<z.ZodString>;
        academicYear: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    }, "strip", z.ZodTypeAny, {
        isActive?: "false" | "true" | undefined;
        school?: string | undefined;
        grade?: string | undefined;
        academicYear?: string | undefined;
    }, {
        isActive?: "false" | "true" | undefined;
        school?: string | undefined;
        grade?: string | undefined;
        academicYear?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        isActive?: "false" | "true" | undefined;
        school?: string | undefined;
        grade?: string | undefined;
        academicYear?: string | undefined;
    };
}, {
    query: {
        isActive?: "false" | "true" | undefined;
        school?: string | undefined;
        grade?: string | undefined;
        academicYear?: string | undefined;
    };
}>;
export declare const createStudentFeeRecordSchema: z.ZodObject<{
    body: z.ZodObject<{
        studentId: z.ZodString;
        feeStructureId: z.ZodString;
        academicYear: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        academicYear: string;
        feeStructureId: string;
    }, {
        studentId: string;
        academicYear: string;
        feeStructureId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        studentId: string;
        academicYear: string;
        feeStructureId: string;
    };
}, {
    body: {
        studentId: string;
        academicYear: string;
        feeStructureId: string;
    };
}>;
export declare const waiveFeeSchema: z.ZodObject<{
    body: z.ZodObject<{
        studentId: z.ZodString;
        month: z.ZodNativeEnum<typeof Month>;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reason: string;
        studentId: string;
        month: Month;
    }, {
        reason: string;
        studentId: string;
        month: Month;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        reason: string;
        studentId: string;
        month: Month;
    };
}, {
    body: {
        reason: string;
        studentId: string;
        month: Month;
    };
}>;
export declare const batchWaiveFeeSchema: z.ZodObject<{
    body: z.ZodObject<{
        studentIds: z.ZodArray<z.ZodString, "many">;
        month: z.ZodNativeEnum<typeof Month>;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reason: string;
        studentIds: string[];
        month: Month;
    }, {
        reason: string;
        studentIds: string[];
        month: Month;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        reason: string;
        studentIds: string[];
        month: Month;
    };
}, {
    body: {
        reason: string;
        studentIds: string[];
        month: Month;
    };
}>;
export declare const getFinancialOverviewSchema: z.ZodObject<{
    query: z.ZodObject<{
        school: z.ZodOptional<z.ZodString>;
        academicYear: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        startDate?: string | undefined;
        endDate?: string | undefined;
        school?: string | undefined;
        academicYear?: string | undefined;
    }, {
        startDate?: string | undefined;
        endDate?: string | undefined;
        school?: string | undefined;
        academicYear?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        startDate?: string | undefined;
        endDate?: string | undefined;
        school?: string | undefined;
        academicYear?: string | undefined;
    };
}, {
    query: {
        startDate?: string | undefined;
        endDate?: string | undefined;
        school?: string | undefined;
        academicYear?: string | undefined;
    };
}>;
export declare const getDefaultersSchema: z.ZodObject<{
    query: z.ZodObject<{
        school: z.ZodOptional<z.ZodString>;
        grade: z.ZodOptional<z.ZodString>;
        minAmount: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        minDays: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
    }, "strip", z.ZodTypeAny, {
        limit?: number | undefined;
        school?: string | undefined;
        grade?: string | undefined;
        minAmount?: number | undefined;
        minDays?: number | undefined;
    }, {
        limit?: string | undefined;
        school?: string | undefined;
        grade?: string | undefined;
        minAmount?: string | undefined;
        minDays?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit?: number | undefined;
        school?: string | undefined;
        grade?: string | undefined;
        minAmount?: number | undefined;
        minDays?: number | undefined;
    };
}, {
    query: {
        limit?: string | undefined;
        school?: string | undefined;
        grade?: string | undefined;
        minAmount?: string | undefined;
        minDays?: string | undefined;
    };
}>;
export declare const cancelTransactionSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reason: string;
    }, {
        reason: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        reason: string;
    };
}, {
    params: {
        id: string;
    };
    body: {
        reason: string;
    };
}>;
export declare const getTransactionsSchema: z.ZodObject<{
    query: z.ZodObject<{
        school: z.ZodOptional<z.ZodString>;
        student: z.ZodOptional<z.ZodString>;
        collectedBy: z.ZodOptional<z.ZodString>;
        transactionType: z.ZodOptional<z.ZodNativeEnum<typeof TransactionType>>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["completed", "cancelled", "refunded"]>>;
    }, "strip", z.ZodTypeAny, {
        student?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        status?: "completed" | "cancelled" | "refunded" | undefined;
        school?: string | undefined;
        transactionType?: TransactionType | undefined;
        collectedBy?: string | undefined;
    }, {
        student?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        status?: "completed" | "cancelled" | "refunded" | undefined;
        school?: string | undefined;
        transactionType?: TransactionType | undefined;
        collectedBy?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        student?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        status?: "completed" | "cancelled" | "refunded" | undefined;
        school?: string | undefined;
        transactionType?: TransactionType | undefined;
        collectedBy?: string | undefined;
    };
}, {
    query: {
        student?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        status?: "completed" | "cancelled" | "refunded" | undefined;
        school?: string | undefined;
        transactionType?: TransactionType | undefined;
        collectedBy?: string | undefined;
    };
}>;
export type CreateFeeStructureInput = z.infer<typeof createFeeStructureSchema>;
export type UpdateFeeStructureInput = z.infer<typeof updateFeeStructureSchema>;
export type GetFeeStructureInput = z.infer<typeof getFeeStructureSchema>;
export type QueryFeeStructuresInput = z.infer<typeof queryFeeStructuresSchema>;
export type CreateStudentFeeRecordInput = z.infer<typeof createStudentFeeRecordSchema>;
export type WaiveFeeInput = z.infer<typeof waiveFeeSchema>;
export type BatchWaiveFeeInput = z.infer<typeof batchWaiveFeeSchema>;
export type GetFinancialOverviewInput = z.infer<typeof getFinancialOverviewSchema>;
export type GetDefaultersInput = z.infer<typeof getDefaultersSchema>;
export type CancelTransactionInput = z.infer<typeof cancelTransactionSchema>;
export type GetTransactionsInput = z.infer<typeof getTransactionsSchema>;
//# sourceMappingURL=fee.validation.d.ts.map