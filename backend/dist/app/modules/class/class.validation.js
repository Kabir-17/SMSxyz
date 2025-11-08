"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewSectionValidationSchema = exports.checkCapacityValidationSchema = exports.getClassStatsValidationSchema = exports.getClassByGradeAndSectionValidationSchema = exports.getClassesByGradeValidationSchema = exports.getClassesValidationSchema = exports.deleteClassValidationSchema = exports.getClassValidationSchema = exports.updateClassValidationSchema = exports.createClassValidationSchema = void 0;
const zod_1 = require("zod");
exports.createClassValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        grade: zod_1.z
            .number({
            required_error: 'Grade is required',
        })
            .int('Grade must be an integer')
            .min(1, 'Grade must be at least 1')
            .max(12, 'Grade cannot exceed 12'),
        section: zod_1.z
            .string()
            .regex(/^[A-Z]$/, 'Section must be a single uppercase letter')
            .optional(),
        maxStudents: zod_1.z
            .number()
            .int('Max students must be an integer')
            .min(10, 'Maximum students must be at least 10')
            .max(60, 'Maximum students cannot exceed 60')
            .optional()
            .default(40),
        academicYear: zod_1.z
            .string({
            required_error: 'Academic year is required',
        })
            .regex(/^\d{4}-\d{4}$/, 'Academic year must be in YYYY-YYYY format'),
        classTeacher: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid teacher ID format')
            .optional(),
        subjects: zod_1.z
            .array(zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid subject ID format'))
            .optional(),
        absenceSmsSettings: zod_1.z
            .object({
            enabled: zod_1.z.boolean().optional(),
            sendAfterTime: zod_1.z
                .string()
                .regex(/^\d{2}:\d{2}$/, 'Send-after time must be in HH:MM format')
                .optional(),
        })
            .optional(),
    }),
});
exports.updateClassValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Class ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid class ID format'),
    }),
    body: zod_1.z.object({
        maxStudents: zod_1.z
            .number()
            .int('Max students must be an integer')
            .min(10, 'Maximum students must be at least 10')
            .max(60, 'Maximum students cannot exceed 60')
            .optional(),
        classTeacher: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid teacher ID format')
            .optional(),
        subjects: zod_1.z
            .array(zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid subject ID format'))
            .optional(),
        isActive: zod_1.z
            .boolean()
            .optional(),
        absenceSmsSettings: zod_1.z
            .object({
            enabled: zod_1.z.boolean().optional(),
            sendAfterTime: zod_1.z
                .string()
                .regex(/^\d{2}:\d{2}$/, 'Send-after time must be in HH:MM format')
                .optional(),
        })
            .optional(),
    }),
});
exports.getClassValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Class ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid class ID format'),
    }),
});
exports.deleteClassValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Class ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid class ID format'),
    }),
});
exports.getClassesValidationSchema = zod_1.z.object({
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
        grade: zod_1.z
            .string()
            .regex(/^\d+$/, 'Grade must be a number')
            .transform((val) => parseInt(val))
            .refine((val) => val >= 1 && val <= 12, 'Grade must be between 1 and 12')
            .optional(),
        section: zod_1.z
            .string()
            .regex(/^[A-Z]$/, 'Section must be a single uppercase letter')
            .optional(),
        academicYear: zod_1.z
            .string()
            .regex(/^\d{4}-\d{4}$/, 'Academic year must be in YYYY-YYYY format')
            .optional(),
        isActive: zod_1.z
            .string()
            .regex(/^(true|false)$/, 'isActive must be true or false')
            .transform((val) => val === 'true')
            .optional(),
        sortBy: zod_1.z
            .string()
            .regex(/^[a-zA-Z0-9_]+$/, 'Invalid sort field')
            .optional()
            .default('grade'),
        sortOrder: zod_1.z
            .enum(['asc', 'desc'], {
            errorMap: () => ({ message: 'Sort order must be asc or desc' }),
        })
            .optional()
            .default('asc'),
    }),
});
exports.getClassesByGradeValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
        grade: zod_1.z
            .string({
            required_error: 'Grade is required',
        })
            .regex(/^\d+$/, 'Grade must be a number')
            .transform((val) => parseInt(val))
            .refine((val) => val >= 1 && val <= 12, 'Grade must be between 1 and 12'),
    }),
});
exports.getClassByGradeAndSectionValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
        grade: zod_1.z
            .string({
            required_error: 'Grade is required',
        })
            .regex(/^\d+$/, 'Grade must be a number')
            .transform((val) => parseInt(val))
            .refine((val) => val >= 1 && val <= 12, 'Grade must be between 1 and 12'),
        section: zod_1.z
            .string({
            required_error: 'Section is required',
        })
            .regex(/^[A-Z]$/, 'Section must be a single uppercase letter'),
    }),
});
exports.getClassStatsValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
    }),
});
exports.checkCapacityValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
        grade: zod_1.z
            .string({
            required_error: 'Grade is required',
        })
            .regex(/^\d+$/, 'Grade must be a number')
            .transform((val) => parseInt(val))
            .refine((val) => val >= 1 && val <= 12, 'Grade must be between 1 and 12'),
    }),
});
exports.createNewSectionValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
        grade: zod_1.z
            .string({
            required_error: 'Grade is required',
        })
            .regex(/^\d+$/, 'Grade must be a number')
            .transform((val) => parseInt(val))
            .refine((val) => val >= 1 && val <= 12, 'Grade must be between 1 and 12'),
    }),
    body: zod_1.z.object({
        academicYear: zod_1.z
            .string({
            required_error: 'Academic year is required',
        })
            .regex(/^\d{4}-\d{4}$/, 'Academic year must be in YYYY-YYYY format'),
        maxStudents: zod_1.z
            .number()
            .int('Max students must be an integer')
            .min(10, 'Maximum students must be at least 10')
            .max(60, 'Maximum students cannot exceed 60')
            .optional()
            .default(40),
    }),
});
//# sourceMappingURL=class.validation.js.map