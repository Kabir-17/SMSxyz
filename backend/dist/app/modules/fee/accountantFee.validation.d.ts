import { z } from "zod";
import { PaymentMethod, Month } from "./fee.interface";
export declare const searchStudentSchema: z.ZodObject<{
    query: z.ZodObject<{
        studentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
    }, {
        studentId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        studentId: string;
    };
}, {
    query: {
        studentId: string;
    };
}>;
export declare const getStudentFeeStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        studentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
    }, {
        studentId: string;
    }>;
    query: z.ZodObject<{
        academicYear: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        academicYear?: string | undefined;
    }, {
        academicYear?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        academicYear?: string | undefined;
    };
    params: {
        studentId: string;
    };
}, {
    query: {
        academicYear?: string | undefined;
    };
    params: {
        studentId: string;
    };
}>;
export declare const collectFeeSchema: z.ZodObject<{
    body: z.ZodObject<{
        studentId: z.ZodString;
        month: z.ZodNativeEnum<typeof Month>;
        amount: z.ZodNumber;
        paymentMethod: z.ZodNativeEnum<typeof PaymentMethod>;
        remarks: z.ZodOptional<z.ZodString>;
        includeLateFee: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        amount: number;
        month: Month;
        paymentMethod: PaymentMethod;
        remarks?: string | undefined;
        includeLateFee?: boolean | undefined;
    }, {
        studentId: string;
        amount: number;
        month: Month;
        paymentMethod: PaymentMethod;
        remarks?: string | undefined;
        includeLateFee?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        studentId: string;
        amount: number;
        month: Month;
        paymentMethod: PaymentMethod;
        remarks?: string | undefined;
        includeLateFee?: boolean | undefined;
    };
}, {
    body: {
        studentId: string;
        amount: number;
        month: Month;
        paymentMethod: PaymentMethod;
        remarks?: string | undefined;
        includeLateFee?: boolean | undefined;
    };
}>;
export declare const validateFeeCollectionSchema: z.ZodObject<{
    body: z.ZodObject<{
        studentId: z.ZodString;
        month: z.ZodNativeEnum<typeof Month>;
        amount: z.ZodNumber;
        includeLateFee: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        amount: number;
        month: Month;
        includeLateFee?: boolean | undefined;
    }, {
        studentId: string;
        amount: number;
        month: Month;
        includeLateFee?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        studentId: string;
        amount: number;
        month: Month;
        includeLateFee?: boolean | undefined;
    };
}, {
    body: {
        studentId: string;
        amount: number;
        month: Month;
        includeLateFee?: boolean | undefined;
    };
}>;
export declare const getAccountantTransactionsSchema: z.ZodObject<{
    query: z.ZodObject<{
        date: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["completed", "cancelled"]>>;
    }, "strip", z.ZodTypeAny, {
        date?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        status?: "completed" | "cancelled" | undefined;
    }, {
        date?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        status?: "completed" | "cancelled" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        date?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        status?: "completed" | "cancelled" | undefined;
    };
}, {
    query: {
        date?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
        status?: "completed" | "cancelled" | undefined;
    };
}>;
export declare const getDailyCollectionSummarySchema: z.ZodObject<{
    query: z.ZodObject<{
        date: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        date?: string | undefined;
    }, {
        date?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        date?: string | undefined;
    };
}, {
    query: {
        date?: string | undefined;
    };
}>;
export declare const requestTransactionCancellationSchema: z.ZodObject<{
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
export declare const generateReceiptSchema: z.ZodObject<{
    params: z.ZodObject<{
        transactionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        transactionId: string;
    }, {
        transactionId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        transactionId: string;
    };
}, {
    params: {
        transactionId: string;
    };
}>;
export declare const getReceiptSchema: z.ZodObject<{
    params: z.ZodObject<{
        receiptNumber: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        receiptNumber: string;
    }, {
        receiptNumber: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        receiptNumber: string;
    };
}, {
    params: {
        receiptNumber: string;
    };
}>;
export declare const batchCollectFeeSchema: z.ZodObject<{
    body: z.ZodObject<{
        studentId: z.ZodString;
        payments: z.ZodArray<z.ZodObject<{
            month: z.ZodNativeEnum<typeof Month>;
            amount: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            amount: number;
            month: Month;
        }, {
            amount: number;
            month: Month;
        }>, "many">;
        paymentMethod: z.ZodNativeEnum<typeof PaymentMethod>;
        remarks: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        paymentMethod: PaymentMethod;
        payments: {
            amount: number;
            month: Month;
        }[];
        remarks?: string | undefined;
    }, {
        studentId: string;
        paymentMethod: PaymentMethod;
        payments: {
            amount: number;
            month: Month;
        }[];
        remarks?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        studentId: string;
        paymentMethod: PaymentMethod;
        payments: {
            amount: number;
            month: Month;
        }[];
        remarks?: string | undefined;
    };
}, {
    body: {
        studentId: string;
        paymentMethod: PaymentMethod;
        payments: {
            amount: number;
            month: Month;
        }[];
        remarks?: string | undefined;
    };
}>;
export type SearchStudentInput = z.infer<typeof searchStudentSchema>;
export type GetStudentFeeStatusInput = z.infer<typeof getStudentFeeStatusSchema>;
export type CollectFeeInput = z.infer<typeof collectFeeSchema>;
export type ValidateFeeCollectionInput = z.infer<typeof validateFeeCollectionSchema>;
export type GetAccountantTransactionsInput = z.infer<typeof getAccountantTransactionsSchema>;
export type GetDailyCollectionSummaryInput = z.infer<typeof getDailyCollectionSummarySchema>;
export type RequestTransactionCancellationInput = z.infer<typeof requestTransactionCancellationSchema>;
export type GenerateReceiptInput = z.infer<typeof generateReceiptSchema>;
export type GetReceiptInput = z.infer<typeof getReceiptSchema>;
export type BatchCollectFeeInput = z.infer<typeof batchCollectFeeSchema>;
//# sourceMappingURL=accountantFee.validation.d.ts.map