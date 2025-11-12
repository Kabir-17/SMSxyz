"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountantsStatsValidationSchema = exports.getAccountantsByDepartmentSchema = exports.deletePhotoValidationSchema = exports.uploadPhotosValidationSchema = exports.getAccountantsValidationSchema = exports.deleteAccountantValidationSchema = exports.getAccountantValidationSchema = exports.updateAccountantValidationSchema = exports.createAccountantValidationSchema = void 0;
const zod_1 = require("zod");
const optionalTrimmedString = (schema) => zod_1.z.preprocess((val) => {
    if (typeof val !== 'string') {
        return val;
    }
    const trimmed = val.trim();
    return trimmed === '' ? undefined : trimmed;
}, schema.optional());
const createAccountantValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
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
            .optional(),
        employeeId: zod_1.z
            .string()
            .max(50, 'Employee ID cannot exceed 50 characters')
            .trim()
            .optional(),
        department: zod_1.z
            .enum([
            'Finance',
            'Payroll',
            'Accounts Payable',
            'Accounts Receivable',
            'Budget Management',
            'Financial Reporting',
            'Audit',
            'Tax',
            'General Accounting',
        ], {
            errorMap: () => ({ message: 'Invalid department' }),
        }),
        designation: zod_1.z
            .enum([
            'Chief Financial Officer',
            'Finance Manager',
            'Chief Accountant',
            'Senior Accountant',
            'Accountant',
            'Junior Accountant',
            'Accounts Assistant',
            'Payroll Officer',
            'Financial Analyst',
            'Auditor',
        ], {
            errorMap: () => ({ message: 'Invalid designation' }),
        }),
        bloodGroup: zod_1.z
            .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
            errorMap: () => ({ message: 'Invalid blood group' }),
        }),
        dob: zod_1.z
            .string({
            required_error: 'Date of birth is required',
        })
            .date('Invalid date format')
            .refine((date) => {
            const dob = new Date(date);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            return age >= 21 && age <= 65;
        }, 'Accountant age must be between 21 and 65 years'),
        joinDate: zod_1.z
            .string()
            .optional()
            .refine((date) => !date || date.length === 0 || /^\d{4}-\d{2}-\d{2}$/.test(date), 'Invalid date format'),
        qualifications: zod_1.z
            .array(zod_1.z.object({
            degree: zod_1.z
                .string()
                .min(1, 'Degree is required')
                .max(100, 'Degree cannot exceed 100 characters')
                .trim(),
            institution: zod_1.z
                .string()
                .min(1, 'Institution is required')
                .max(200, 'Institution cannot exceed 200 characters')
                .trim(),
            year: zod_1.z
                .number()
                .int()
                .min(1980, 'Year must be after 1980')
                .max(new Date().getFullYear(), 'Year cannot be in the future'),
            specialization: zod_1.z
                .string()
                .max(100, 'Specialization cannot exceed 100 characters')
                .trim()
                .optional(),
        }))
            .min(1, 'At least one qualification is required')
            .max(10, 'Cannot have more than 10 qualifications'),
        experience: zod_1.z.object({
            totalYears: zod_1.z
                .number()
                .min(0, 'Experience cannot be negative')
                .max(45, 'Experience cannot exceed 45 years'),
            previousOrganizations: zod_1.z
                .array(zod_1.z.object({
                organizationName: zod_1.z
                    .string()
                    .min(1, 'Organization name is required')
                    .max(200, 'Organization name cannot exceed 200 characters')
                    .trim(),
                position: zod_1.z
                    .string()
                    .min(1, 'Position is required')
                    .max(100, 'Position cannot exceed 100 characters')
                    .trim(),
                duration: zod_1.z
                    .string()
                    .min(1, 'Duration is required')
                    .max(50, 'Duration cannot exceed 50 characters')
                    .trim(),
                fromDate: zod_1.z
                    .string()
                    .date('Invalid from date format'),
                toDate: zod_1.z
                    .string()
                    .date('Invalid to date format'),
            }))
                .optional(),
        }),
        address: zod_1.z.object({
            street: zod_1.z
                .string()
                .max(200, 'Street cannot exceed 200 characters')
                .trim()
                .optional(),
            city: zod_1.z
                .string()
                .min(1, 'City is required')
                .max(100, 'City cannot exceed 100 characters')
                .trim(),
            state: zod_1.z
                .string()
                .min(1, 'State is required')
                .max(100, 'State cannot exceed 100 characters')
                .trim(),
            zipCode: optionalTrimmedString(zod_1.z.string()),
            country: zod_1.z
                .string()
                .min(1, 'Country is required')
                .max(100, 'Country cannot exceed 100 characters')
                .trim(),
        }),
        emergencyContact: zod_1.z.object({
            name: zod_1.z
                .string()
                .min(1, 'Emergency contact name is required')
                .max(100, 'Emergency contact name cannot exceed 100 characters')
                .trim(),
            relationship: zod_1.z
                .string()
                .min(1, 'Emergency contact relationship is required')
                .max(50, 'Emergency contact relationship cannot exceed 50 characters')
                .trim(),
            phone: zod_1.z
                .string()
                .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid emergency contact phone format'),
            email: zod_1.z
                .string()
                .email('Invalid emergency contact email format')
                .toLowerCase()
                .optional(),
        }),
        salary: zod_1.z.object({
            basic: zod_1.z
                .number()
                .min(0, 'Basic salary cannot be negative')
                .optional(),
            allowances: zod_1.z
                .number()
                .min(0, 'Allowances cannot be negative')
                .optional(),
            deductions: zod_1.z
                .number()
                .min(0, 'Deductions cannot be negative')
                .optional(),
        }).optional(),
        responsibilities: zod_1.z
            .array(zod_1.z.string().min(1, 'Responsibility cannot be empty'))
            .optional(),
        certifications: zod_1.z
            .array(zod_1.z.string().min(1, 'Certification cannot be empty'))
            .optional(),
        isActive: zod_1.z
            .boolean()
            .optional()
            .default(true),
    }),
});
exports.createAccountantValidationSchema = createAccountantValidationSchema;
const updateAccountantValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Accountant ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid accountant ID format'),
    }),
    body: zod_1.z.object({
        firstName: zod_1.z
            .string()
            .min(1, 'First name cannot be empty')
            .max(50, 'First name cannot exceed 50 characters')
            .trim()
            .optional(),
        lastName: zod_1.z
            .string()
            .min(1, 'Last name cannot be empty')
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
            .optional(),
        employeeId: zod_1.z
            .string()
            .max(50, 'Employee ID cannot exceed 50 characters')
            .trim()
            .optional(),
        department: zod_1.z
            .enum([
            'Finance',
            'Payroll',
            'Accounts Payable',
            'Accounts Receivable',
            'Budget Management',
            'Financial Reporting',
            'Audit',
            'Tax',
            'General Accounting',
        ])
            .optional(),
        designation: zod_1.z
            .enum([
            'Chief Financial Officer',
            'Finance Manager',
            'Chief Accountant',
            'Senior Accountant',
            'Accountant',
            'Junior Accountant',
            'Accounts Assistant',
            'Payroll Officer',
            'Financial Analyst',
            'Auditor',
        ])
            .optional(),
        bloodGroup: zod_1.z
            .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
            .optional(),
        dob: zod_1.z
            .string()
            .date('Invalid date format')
            .refine((date) => {
            const dob = new Date(date);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            return age >= 21 && age <= 65;
        }, 'Accountant age must be between 21 and 65 years')
            .optional(),
        joinDate: zod_1.z
            .string()
            .date('Invalid date format')
            .optional(),
        qualifications: zod_1.z
            .array(zod_1.z.object({
            degree: zod_1.z.string().min(1).max(100).trim(),
            institution: zod_1.z.string().min(1).max(200).trim(),
            year: zod_1.z.number().int().min(1980).max(new Date().getFullYear()),
            specialization: zod_1.z.string().max(100).trim().optional(),
        }))
            .min(1)
            .max(10)
            .optional(),
        experience: zod_1.z.object({
            totalYears: zod_1.z.number().min(0).max(45),
            previousOrganizations: zod_1.z
                .array(zod_1.z.object({
                organizationName: zod_1.z.string().min(1).max(200).trim(),
                position: zod_1.z.string().min(1).max(100).trim(),
                duration: zod_1.z.string().min(1).max(50).trim(),
                fromDate: zod_1.z.string().date(),
                toDate: zod_1.z.string().date(),
            }))
                .optional(),
        }).optional(),
        address: zod_1.z.object({
            street: zod_1.z.string().max(200).trim().optional(),
            city: zod_1.z.string().min(1).max(100).trim(),
            state: zod_1.z.string().min(1).max(100).trim(),
            zipCode: optionalTrimmedString(zod_1.z.string()),
            country: zod_1.z.string().min(1).max(100).trim(),
        }).optional(),
        emergencyContact: zod_1.z.object({
            name: zod_1.z.string().min(1).max(100).trim(),
            relationship: zod_1.z.string().min(1).max(50).trim(),
            phone: zod_1.z.string().regex(/^\+?[\d\s\-\(\)]+$/),
            email: zod_1.z.string().email().toLowerCase().optional(),
        }).optional(),
        salary: zod_1.z.object({
            basic: zod_1.z.number().min(0).optional(),
            allowances: zod_1.z.number().min(0).optional(),
            deductions: zod_1.z.number().min(0).optional(),
        }).optional(),
        responsibilities: zod_1.z.array(zod_1.z.string().min(1)).optional(),
        certifications: zod_1.z.array(zod_1.z.string().min(1)).optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.updateAccountantValidationSchema = updateAccountantValidationSchema;
const getAccountantValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Accountant ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid accountant ID format'),
    }),
});
exports.getAccountantValidationSchema = getAccountantValidationSchema;
const deleteAccountantValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Accountant ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid accountant ID format'),
    }),
});
exports.deleteAccountantValidationSchema = deleteAccountantValidationSchema;
const getAccountantsValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        sortBy: zod_1.z.string().optional(),
        sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
        department: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        search: zod_1.z.string().optional(),
        isActive: zod_1.z.enum(['true', 'false']).optional(),
    }),
});
exports.getAccountantsValidationSchema = getAccountantsValidationSchema;
const uploadPhotosValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Accountant ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid accountant ID format'),
    }),
});
exports.uploadPhotosValidationSchema = uploadPhotosValidationSchema;
const deletePhotoValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        accountantId: zod_1.z
            .string({
            required_error: 'Accountant ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid accountant ID format'),
        photoId: zod_1.z
            .string({
            required_error: 'Photo ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photo ID format'),
    }),
});
exports.deletePhotoValidationSchema = deletePhotoValidationSchema;
const getAccountantsByDepartmentSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
        department: zod_1.z
            .string({
            required_error: 'Department is required',
        })
            .min(1, 'Department cannot be empty'),
    }),
});
exports.getAccountantsByDepartmentSchema = getAccountantsByDepartmentSchema;
const getAccountantsStatsValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
    }),
});
exports.getAccountantsStatsValidationSchema = getAccountantsStatsValidationSchema;
//# sourceMappingURL=accountant.validation.js.map