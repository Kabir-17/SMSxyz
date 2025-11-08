import { z } from 'zod';
export declare const getAbsenceSmsLogsValidationSchema: z.ZodObject<{
    query: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<["pending", "sent", "failed"]>>;
        date: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        messageQuery: z.ZodOptional<z.ZodString>;
        schoolId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        schoolId?: string | undefined;
        limit?: string | undefined;
        date?: string | undefined;
        status?: "pending" | "sent" | "failed" | undefined;
        page?: string | undefined;
        messageQuery?: string | undefined;
    }, {
        schoolId?: string | undefined;
        limit?: string | undefined;
        date?: string | undefined;
        status?: "pending" | "sent" | "failed" | undefined;
        page?: string | undefined;
        messageQuery?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        schoolId?: string | undefined;
        limit?: string | undefined;
        date?: string | undefined;
        status?: "pending" | "sent" | "failed" | undefined;
        page?: string | undefined;
        messageQuery?: string | undefined;
    };
}, {
    query: {
        schoolId?: string | undefined;
        limit?: string | undefined;
        date?: string | undefined;
        status?: "pending" | "sent" | "failed" | undefined;
        page?: string | undefined;
        messageQuery?: string | undefined;
    };
}>;
export declare const getAbsenceSmsOverviewValidationSchema: z.ZodObject<{
    query: z.ZodObject<{
        date: z.ZodOptional<z.ZodString>;
        schoolId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        schoolId?: string | undefined;
        date?: string | undefined;
    }, {
        schoolId?: string | undefined;
        date?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        schoolId?: string | undefined;
        date?: string | undefined;
    };
}, {
    query: {
        schoolId?: string | undefined;
        date?: string | undefined;
    };
}>;
export declare const sendAbsenceSmsTestValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        phoneNumber: z.ZodString;
        studentName: z.ZodOptional<z.ZodString>;
        schoolName: z.ZodOptional<z.ZodString>;
        message: z.ZodOptional<z.ZodString>;
        senderName: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        phoneNumber: string;
        message?: string | undefined;
        schoolName?: string | undefined;
        studentName?: string | undefined;
        senderName?: string | undefined;
    }, {
        phoneNumber: string;
        message?: string | undefined;
        schoolName?: string | undefined;
        studentName?: string | undefined;
        senderName?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        phoneNumber: string;
        message?: string | undefined;
        schoolName?: string | undefined;
        studentName?: string | undefined;
        senderName?: string | undefined;
    };
}, {
    body: {
        phoneNumber: string;
        message?: string | undefined;
        schoolName?: string | undefined;
        studentName?: string | undefined;
        senderName?: string | undefined;
    };
}>;
//# sourceMappingURL=absence-sms.validation.d.ts.map