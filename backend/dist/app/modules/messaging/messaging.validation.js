"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listContactsQuerySchema = exports.listMessagesQuerySchema = exports.newMessageSchema = exports.createThreadSchema = exports.listThreadsQuerySchema = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z
    .string()
    .min(1, "Identifier is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Must be a valid Mongo ObjectId");
exports.listThreadsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        limit: zod_1.z
            .string()
            .optional()
            .transform((value) => (value ? Number.parseInt(value, 10) : undefined))
            .refine((value) => value === undefined || (Number.isInteger(value) && value > 0 && value <= 100), "limit must be between 1 and 100")
            .optional(),
    }),
});
exports.createThreadSchema = zod_1.z.object({
    body: zod_1.z.object({
        participantIds: zod_1.z
            .array(objectId)
            .min(1, "At least one participant is required"),
        contextStudentId: objectId.optional(),
    }),
});
exports.newMessageSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectId,
    }),
    body: zod_1.z.object({
        body: zod_1.z
            .string()
            .trim()
            .min(1, "Message cannot be empty")
            .max(2000, "Message is too long"),
    }),
});
exports.listMessagesQuerySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectId,
    }),
    query: zod_1.z.object({
        cursor: zod_1.z
            .string()
            .datetime()
            .optional(),
        limit: zod_1.z
            .string()
            .optional()
            .transform((value) => (value ? Number.parseInt(value, 10) : undefined))
            .refine((value) => value === undefined || (Number.isInteger(value) && value > 0 && value <= 100), "limit must be between 1 and 100")
            .optional(),
    }),
});
exports.listContactsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        includeParents: zod_1.z
            .string()
            .transform((value) => value === "true")
            .optional(),
    }),
});
//# sourceMappingURL=messaging.validation.js.map