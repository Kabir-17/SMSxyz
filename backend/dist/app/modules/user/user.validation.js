"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidationSchema = exports.resetPasswordValidationSchema = exports.changePasswordValidationSchema = exports.getUsersValidationSchema = exports.deleteUserValidationSchema = exports.getUserValidationSchema = exports.updateUserValidationSchema = exports.createUserValidationSchema = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        schoolId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format')
            .optional(),
        role: zod_1.z.enum(['admin', 'teacher', 'student', 'parent', 'accountant'], {
            errorMap: () => ({ message: 'Role must be one of: admin, teacher, student, parent, accountant' }),
        }),
        username: zod_1.z
            .string({
            required_error: 'Username is required',
        })
            .min(3, 'Username must be at least 3 characters')
            .max(30, 'Username cannot exceed 30 characters')
            .regex(/^[a-z0-9_.-]+$/, 'Username can only contain lowercase letters, numbers, dots, hyphens, and underscores')
            .toLowerCase(),
        password: zod_1.z
            .string({
            required_error: 'Password is required',
        })
            .min(6, 'Password must be at least 6 characters')
            .max(50, 'Password cannot exceed 50 characters'),
        firstName: zod_1.z
            .string({
            required_error: 'First name is required',
        })
            .min(1, 'First name is required')
            .max(50, 'First name cannot exceed 50 characters')
            .trim(),
        lastName: zod_1.z
            .string({
            required_error: 'Last name is required',
        })
            .min(1, 'Last name is required')
            .max(50, 'Last name cannot exceed 50 characters')
            .trim(),
        email: zod_1.z
            .string()
            .email('Invalid email format')
            .toLowerCase()
            .optional(),
        phone: zod_1.z
            .string()
            .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
            .optional(),
    }),
});
exports.createUserValidationSchema = createUserValidationSchema;
const updateUserValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'User ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
    body: zod_1.z.object({
        firstName: zod_1.z
            .string()
            .min(1, 'First name is required')
            .max(50, 'First name cannot exceed 50 characters')
            .trim()
            .optional(),
        lastName: zod_1.z
            .string()
            .min(1, 'Last name is required')
            .max(50, 'Last name cannot exceed 50 characters')
            .trim()
            .optional(),
        email: zod_1.z
            .string()
            .email('Invalid email format')
            .toLowerCase()
            .optional(),
        phone: zod_1.z
            .string()
            .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
            .optional(),
        isActive: zod_1.z
            .boolean()
            .optional(),
    }),
});
exports.updateUserValidationSchema = updateUserValidationSchema;
const getUserValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'User ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
});
exports.getUserValidationSchema = getUserValidationSchema;
const deleteUserValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'User ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
});
exports.deleteUserValidationSchema = deleteUserValidationSchema;
const getUsersValidationSchema = zod_1.z.object({
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
        schoolId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format')
            .optional(),
        role: zod_1.z
            .enum(['superadmin', 'admin', 'teacher', 'student', 'parent', 'accountant', 'all'], {
            errorMap: () => ({ message: 'Role must be one of: superadmin, admin, teacher, student, parent, accountant, all' }),
        })
            .optional(),
        isActive: zod_1.z
            .enum(['true', 'false', 'all'], {
            errorMap: () => ({ message: 'isActive must be true, false, or all' }),
        })
            .optional(),
        search: zod_1.z
            .string()
            .min(1, 'Search term must be at least 1 character')
            .max(50, 'Search term cannot exceed 50 characters')
            .optional(),
        sortBy: zod_1.z
            .enum(['firstName', 'lastName', 'username', 'role', 'createdAt', 'lastLogin'], {
            errorMap: () => ({ message: 'Sort by must be firstName, lastName, username, role, createdAt, or lastLogin' }),
        })
            .optional()
            .default('firstName'),
        sortOrder: zod_1.z
            .enum(['asc', 'desc'], {
            errorMap: () => ({ message: 'Sort order must be asc or desc' }),
        })
            .optional()
            .default('asc'),
    }),
});
exports.getUsersValidationSchema = getUsersValidationSchema;
const changePasswordValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'User ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
    body: zod_1.z.object({
        currentPassword: zod_1.z
            .string({
            required_error: 'Current password is required',
        })
            .min(1, 'Current password is required'),
        newPassword: zod_1.z
            .string({
            required_error: 'New password is required',
        })
            .min(6, 'New password must be at least 6 characters')
            .max(50, 'New password cannot exceed 50 characters'),
    }),
});
exports.changePasswordValidationSchema = changePasswordValidationSchema;
const resetPasswordValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'User ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
    body: zod_1.z.object({
        newPassword: zod_1.z
            .string({
            required_error: 'New password is required',
        })
            .min(6, 'New password must be at least 6 characters')
            .max(50, 'New password cannot exceed 50 characters'),
    }),
});
exports.resetPasswordValidationSchema = resetPasswordValidationSchema;
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z
            .string({
            required_error: 'Username is required',
        })
            .min(1, 'Username is required')
            .toLowerCase(),
        password: zod_1.z
            .string({
            required_error: 'Password is required',
        })
            .min(1, 'Password is required'),
    }),
});
exports.loginValidationSchema = loginValidationSchema;
//# sourceMappingURL=user.validation.js.map