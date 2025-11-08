"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubjectValidationSchema = exports.updateSubjectValidationSchema = exports.getSubjectValidationSchema = exports.getSubjectsValidationSchema = exports.createSubjectValidationSchema = void 0;
const zod_1 = require("zod");
exports.createSubjectValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: "Subject name is required",
        })
            .min(2, "Subject name must be at least 2 characters"),
        code: zod_1.z
            .string({
            required_error: "Subject code is required",
        })
            .min(2, "Subject code must be at least 2 characters"),
        description: zod_1.z.string().optional(),
        grades: zod_1.z
            .array(zod_1.z.number().min(1).max(12))
            .min(1, "At least one grade is required"),
        isCore: zod_1.z.boolean().optional().default(true),
        credits: zod_1.z.number().min(1).max(10).optional().default(1),
        isActive: zod_1.z.boolean().optional().default(true),
    }),
});
exports.getSubjectsValidationSchema = zod_1.z.object({
    query: zod_1.z
        .object({
        grade: zod_1.z.string().optional(),
        isActive: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
    })
        .optional(),
});
exports.getSubjectValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({
            required_error: "Subject ID is required",
        }),
    }),
});
exports.updateSubjectValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({
            required_error: "Subject ID is required",
        }),
    }),
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, "Subject name must be at least 2 characters")
            .optional(),
        code: zod_1.z
            .string()
            .min(2, "Subject code must be at least 2 characters")
            .optional(),
        description: zod_1.z.string().optional(),
        grades: zod_1.z
            .array(zod_1.z.number().min(1).max(12))
            .min(1, "At least one grade is required")
            .optional(),
        isCore: zod_1.z.boolean().optional(),
        credits: zod_1.z.number().min(1).max(10).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.deleteSubjectValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({
            required_error: "Subject ID is required",
        }),
    }),
});
//# sourceMappingURL=subject.validation.js.map