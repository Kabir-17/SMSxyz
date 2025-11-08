"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAbsenceSmsTestValidationSchema = exports.getAbsenceSmsOverviewValidationSchema = exports.getAbsenceSmsLogsValidationSchema = void 0;
const zod_1 = require("zod");
exports.getAbsenceSmsLogsValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'sent', 'failed']).optional(),
        date: zod_1.z
            .string()
            .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/u, 'Date must be in YYYY-MM-DD format')
            .optional(),
        page: zod_1.z
            .string()
            .regex(/^\d+$/u, 'Page must be a positive integer')
            .optional(),
        limit: zod_1.z
            .string()
            .regex(/^\d+$/u, 'Limit must be a positive integer')
            .optional(),
        messageQuery: zod_1.z.string().trim().min(1).max(120).optional(),
        schoolId: zod_1.z.string().optional(),
    }),
});
exports.getAbsenceSmsOverviewValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        date: zod_1.z
            .string()
            .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/u, 'Date must be in YYYY-MM-DD format')
            .optional(),
        schoolId: zod_1.z.string().optional(),
    }),
});
exports.sendAbsenceSmsTestValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z
            .string()
            .trim()
            .regex(/^[+]?\d{6,20}$/u, 'Phone number must include country code and digits only'),
        studentName: zod_1.z.string().trim().max(120).optional(),
        schoolName: zod_1.z.string().trim().max(120).optional(),
        message: zod_1.z.string().trim().max(500).optional(),
        senderName: zod_1.z
            .string()
            .trim()
            .max(11, 'Sender name must be 11 characters or fewer')
            .optional(),
    }),
});
//# sourceMappingURL=absence-sms.validation.js.map