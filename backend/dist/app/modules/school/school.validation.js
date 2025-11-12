"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetAdminPasswordValidationSchema = exports.getSchoolsValidationSchema = exports.deleteSchoolValidationSchema = exports.getSchoolValidationSchema = exports.updateSchoolValidationSchema = exports.createSchoolValidationSchema = void 0;
const zod_1 = require("zod");
const optionalTrimmedString = (schema) => zod_1.z.preprocess((val) => {
    if (typeof val !== 'string') {
        return val;
    }
    const trimmed = val.trim();
    return trimmed === '' ? undefined : trimmed;
}, schema.optional());
const addressValidationSchema = zod_1.z.object({
    street: zod_1.z.string().min(1, 'Street is required').max(200, 'Street cannot exceed 200 characters'),
    city: zod_1.z.string().min(1, 'City is required').max(100, 'City cannot exceed 100 characters'),
    state: zod_1.z.string().min(1, 'State is required').max(100, 'State cannot exceed 100 characters'),
    country: zod_1.z.string().min(1, 'Country is required').max(100, 'Country cannot exceed 100 characters'),
    postalCode: optionalTrimmedString(zod_1.z.string().max(20, 'Postal code cannot exceed 20 characters')),
    coordinates: zod_1.z.object({
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180)
    }).optional()
});
const contactValidationSchema = zod_1.z.object({
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email('Invalid email format').toLowerCase(),
    website: zod_1.z.string().url('Invalid website URL').optional().or(zod_1.z.literal('').transform(() => undefined)),
    fax: zod_1.z.string().optional()
});
const adminDetailsValidationSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, 'First name is required').max(50, 'First name cannot exceed 50 characters'),
    lastName: zod_1.z.string().min(1, 'Last name is required').max(50, 'Last name cannot exceed 50 characters'),
    email: zod_1.z.string().email('Invalid email format').toLowerCase(),
    phone: zod_1.z.string().optional(),
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username cannot exceed 50 characters'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password cannot exceed 100 characters')
});
const currentSessionValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Session name is required'),
    startDate: zod_1.z.string().datetime('Invalid start date format'),
    endDate: zod_1.z.string().datetime('Invalid end date format')
});
const settingsValidationSchema = zod_1.z.object({
    maxStudentsPerSection: zod_1.z
        .number()
        .min(1, 'Maximum students per section must be at least 1')
        .optional(),
    grades: zod_1.z
        .array(zod_1.z.number().min(1).max(12))
        .min(1, 'At least one grade must be specified')
        .optional(),
    sections: zod_1.z
        .array(zod_1.z.string().regex(/^[A-Z]$/, 'Sections must be uppercase letters'))
        .min(1, 'At least one section must be specified')
        .optional(),
    academicYearStart: zod_1.z
        .number()
        .min(1, 'Academic year start month must be between 1 and 12')
        .max(12, 'Academic year start month must be between 1 and 12')
        .optional(),
    academicYearEnd: zod_1.z
        .number()
        .min(1, 'Academic year end month must be between 1 and 12')
        .max(12, 'Academic year end month must be between 1 and 12')
        .optional(),
    attendanceGracePeriod: zod_1.z
        .number()
        .min(0, 'Attendance grace period cannot be negative')
        .max(60, 'Attendance grace period cannot exceed 60 minutes')
        .optional(),
});
const createSchoolValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        orgId: zod_1.z
            .string({
            required_error: 'Organization ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid organization ID format')
            .optional(),
        name: zod_1.z
            .string({
            required_error: 'School name is required',
        })
            .min(2, 'School name must be at least 2 characters')
            .max(100, 'School name cannot exceed 100 characters')
            .trim(),
        establishedYear: zod_1.z.number().min(1800).max(new Date().getFullYear()).optional(),
        address: addressValidationSchema,
        contact: contactValidationSchema,
        adminDetails: adminDetailsValidationSchema,
        affiliation: zod_1.z.string().max(100, 'Affiliation cannot exceed 100 characters').optional(),
        recognition: zod_1.z.string().max(200, 'Recognition cannot exceed 200 characters').optional(),
        logo: zod_1.z.string().url('Invalid logo URL').optional(),
    }),
});
exports.createSchoolValidationSchema = createSchoolValidationSchema;
const updateSchoolValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
    }),
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, 'School name must be at least 2 characters')
            .max(100, 'School name cannot exceed 100 characters')
            .trim()
            .optional(),
        address: zod_1.z
            .string()
            .max(200, 'Address cannot exceed 200 characters')
            .trim()
            .optional(),
        phone: zod_1.z
            .string()
            .optional(),
        email: zod_1.z
            .string()
            .email('Invalid email format')
            .toLowerCase()
            .optional(),
        status: zod_1.z
            .enum(['active', 'inactive', 'suspended'], {
            errorMap: () => ({ message: 'Status must be active, inactive, or suspended' }),
        })
            .optional(),
        settings: settingsValidationSchema.optional(),
    }),
});
exports.updateSchoolValidationSchema = updateSchoolValidationSchema;
const getSchoolValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
    }),
});
exports.getSchoolValidationSchema = getSchoolValidationSchema;
const deleteSchoolValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
    }),
});
exports.deleteSchoolValidationSchema = deleteSchoolValidationSchema;
const getSchoolsValidationSchema = zod_1.z.object({
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
        orgId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid organization ID format')
            .optional(),
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
exports.getSchoolsValidationSchema = getSchoolsValidationSchema;
const resetAdminPasswordValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
    }),
    body: zod_1.z.object({
        newPassword: zod_1.z
            .string({
            required_error: 'New password is required',
        })
            .min(6, 'Password must be at least 6 characters')
            .max(50, 'Password cannot exceed 50 characters'),
    }),
});
exports.resetAdminPasswordValidationSchema = resetAdminPasswordValidationSchema;
//# sourceMappingURL=school.validation.js.map