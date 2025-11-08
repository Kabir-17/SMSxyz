"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationsValidationSchema = exports.deleteOrganizationValidationSchema = exports.getOrganizationValidationSchema = exports.updateOrganizationValidationSchema = exports.createOrganizationValidationSchema = void 0;
const zod_1 = require("zod");
const createOrganizationValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Organization name is required',
        })
            .min(2, 'Organization name must be at least 2 characters')
            .max(100, 'Organization name cannot exceed 100 characters')
            .trim(),
        status: zod_1.z
            .enum(['active', 'inactive'], {
            errorMap: () => ({ message: 'Status must be active or inactive' }),
        })
            .optional(),
    }),
});
exports.createOrganizationValidationSchema = createOrganizationValidationSchema;
const updateOrganizationValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Organization ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid organization ID format'),
    }),
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, 'Organization name must be at least 2 characters')
            .max(100, 'Organization name cannot exceed 100 characters')
            .trim()
            .optional(),
        status: zod_1.z
            .enum(['active', 'inactive', 'suspended'], {
            errorMap: () => ({ message: 'Status must be active, inactive, or suspended' }),
        })
            .optional(),
    }),
});
exports.updateOrganizationValidationSchema = updateOrganizationValidationSchema;
const getOrganizationValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Organization ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid organization ID format'),
    }),
});
exports.getOrganizationValidationSchema = getOrganizationValidationSchema;
const deleteOrganizationValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Organization ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid organization ID format'),
    }),
});
exports.deleteOrganizationValidationSchema = deleteOrganizationValidationSchema;
const getOrganizationsValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z
            .string()
            .regex(/^\d+$/, 'Page must be a positive number')
            .transform((val) => parseInt(val))
            .refine((val) => val > 0, 'Page must be greater than 0')
            .optional()
            .default('1'),
        limit: zod_1.z
            .string()
            .regex(/^\d+$/, 'Limit must be a positive number')
            .transform((val) => parseInt(val))
            .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100')
            .optional()
            .default('20'),
        status: zod_1.z
            .enum(['active', 'inactive', 'suspended', 'all'], {
            errorMap: () => ({ message: 'Status must be active, inactive, suspended, or all' }),
        })
            .optional(),
        search: zod_1.z
            .string()
            .min(1, 'Search term must be at least 1 character')
            .max(50, 'Search term cannot exceed 50 characters')
            .optional(),
        sortBy: zod_1.z
            .enum(['name', 'createdAt', 'updatedAt'], {
            errorMap: () => ({ message: 'Sort by must be name, createdAt, or updatedAt' }),
        })
            .optional()
            .default('name'),
        sortOrder: zod_1.z
            .enum(['asc', 'desc'], {
            errorMap: () => ({ message: 'Sort order must be asc or desc' }),
        })
            .optional()
            .default('asc'),
    }),
});
exports.getOrganizationsValidationSchema = getOrganizationsValidationSchema;
//# sourceMappingURL=organization.validation.js.map