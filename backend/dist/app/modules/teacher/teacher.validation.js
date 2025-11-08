"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDisciplinaryActionCommentValidationSchema = exports.resolveDisciplinaryActionValidationSchema = exports.issuePunishmentValidationSchema = exports.getTeachersStatsValidationSchema = exports.getTeachersBySubjectSchema = exports.deletePhotoValidationSchema = exports.uploadPhotosValidationSchema = exports.getTeachersValidationSchema = exports.deleteTeacherValidationSchema = exports.getTeacherValidationSchema = exports.updateTeacherValidationSchema = exports.createTeacherValidationSchema = void 0;
const zod_1 = require("zod");
const createTeacherValidationSchema = zod_1.z.object({
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
            .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
            .optional(),
        employeeId: zod_1.z
            .string()
            .max(50, 'Employee ID cannot exceed 50 characters')
            .trim()
            .optional(),
        subjects: zod_1.z
            .array(zod_1.z.string().min(1, 'Subject cannot be empty'))
            .min(1, 'At least one subject is required')
            .max(10, 'Cannot teach more than 10 subjects'),
        grades: zod_1.z
            .array(zod_1.z.number().int().min(1, 'Grade must be at least 1').max(12, 'Grade cannot exceed 12'))
            .min(1, 'At least one grade is required')
            .max(12, 'Cannot handle more than 12 grades'),
        sections: zod_1.z
            .array(zod_1.z.string().regex(/^[A-Z]$/, 'Section must be a single uppercase letter'))
            .min(1, 'At least one section is required'),
        designation: zod_1.z
            .enum([
            'Principal',
            'Vice Principal',
            'Head Teacher',
            'Senior Teacher',
            'Teacher',
            'Assistant Teacher',
            'Subject Coordinator',
            'Sports Teacher',
            'Music Teacher',
            'Art Teacher',
            'Librarian',
            'Lab Assistant',
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
        }, 'Teacher age must be between 21 and 65 years'),
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
                .int('Year must be an integer')
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
                .number({
                required_error: 'Total years of experience is required',
            })
                .min(0, 'Experience cannot be negative')
                .max(45, 'Experience cannot exceed 45 years'),
            previousSchools: zod_1.z
                .array(zod_1.z.object({
                schoolName: zod_1.z
                    .string()
                    .min(1, 'School name is required')
                    .max(200, 'School name cannot exceed 200 characters')
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
                .string({
                required_error: 'City is required',
            })
                .min(1, 'City is required')
                .max(100, 'City cannot exceed 100 characters')
                .trim(),
            state: zod_1.z
                .string({
                required_error: 'State is required',
            })
                .min(1, 'State is required')
                .max(100, 'State cannot exceed 100 characters')
                .trim(),
            zipCode: zod_1.z
                .string({
                required_error: 'Zip code is required',
            })
                .min(1, 'Zip code is required')
                .max(20, 'Zip code cannot exceed 20 characters')
                .trim(),
            country: zod_1.z
                .string()
                .max(100, 'Country cannot exceed 100 characters')
                .trim()
        }),
        emergencyContact: zod_1.z.object({
            name: zod_1.z
                .string({
                required_error: 'Emergency contact name is required',
            })
                .min(1, 'Emergency contact name is required')
                .max(100, 'Emergency contact name cannot exceed 100 characters')
                .trim(),
            relationship: zod_1.z
                .string({
                required_error: 'Emergency contact relationship is required',
            })
                .min(1, 'Emergency contact relationship is required')
                .max(50, 'Emergency contact relationship cannot exceed 50 characters')
                .trim(),
            phone: zod_1.z
                .string({
                required_error: 'Emergency contact phone is required',
            })
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
                .default(0)
                .optional(),
            deductions: zod_1.z
                .number()
                .min(0, 'Deductions cannot be negative')
                .default(0)
                .optional(),
        }).optional(),
        isClassTeacher: zod_1.z
            .boolean()
            .default(false)
            .optional(),
        classTeacherFor: zod_1.z.object({
            grade: zod_1.z
                .number()
                .int('Grade must be an integer')
                .min(1, 'Grade must be at least 1')
                .max(12, 'Grade cannot exceed 12'),
            section: zod_1.z
                .string()
                .regex(/^[A-Z]$/, 'Section must be a single uppercase letter'),
        }).optional(),
        isActive: zod_1.z
            .boolean()
            .default(true)
            .optional(),
    }).refine((data) => {
        if (data.isClassTeacher && !data.classTeacherFor) {
            return false;
        }
        return true;
    }, {
        message: 'Class teacher assignment details are required when isClassTeacher is true',
        path: ['classTeacherFor'],
    }),
});
exports.createTeacherValidationSchema = createTeacherValidationSchema;
const updateTeacherValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Teacher ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid teacher ID format'),
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
            .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format')
            .optional(),
        dob: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
            .optional(),
        joinDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
            .optional(),
        employeeId: zod_1.z
            .string()
            .max(50, 'Employee ID cannot exceed 50 characters')
            .trim()
            .optional(),
        subjects: zod_1.z
            .array(zod_1.z.string().min(1, 'Subject cannot be empty'))
            .min(1, 'At least one subject is required')
            .max(10, 'Cannot teach more than 10 subjects')
            .optional(),
        grades: zod_1.z
            .array(zod_1.z.number().int().min(1, 'Grade must be at least 1').max(12, 'Grade cannot exceed 12'))
            .min(1, 'At least one grade is required')
            .max(12, 'Cannot handle more than 12 grades')
            .optional(),
        sections: zod_1.z
            .array(zod_1.z.string().regex(/^[A-Z]$/, 'Section must be a single uppercase letter'))
            .min(1, 'At least one section is required')
            .optional(),
        designation: zod_1.z
            .enum([
            'Principal',
            'Vice Principal',
            'Head Teacher',
            'Senior Teacher',
            'Teacher',
            'Assistant Teacher',
            'Subject Coordinator',
            'Sports Teacher',
            'Music Teacher',
            'Art Teacher',
            'Librarian',
            'Lab Assistant',
        ])
            .optional(),
        bloodGroup: zod_1.z
            .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
            .optional(),
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
                .int('Year must be an integer')
                .min(1980, 'Year must be after 1980')
                .max(new Date().getFullYear(), 'Year cannot be in the future'),
            specialization: zod_1.z
                .string()
                .max(100, 'Specialization cannot exceed 100 characters')
                .trim()
                .optional(),
        }))
            .max(10, 'Cannot have more than 10 qualifications')
            .optional(),
        experience: zod_1.z.object({
            totalYears: zod_1.z
                .number()
                .int('Total years must be an integer')
                .min(0, 'Total years cannot be negative')
                .max(50, 'Total years cannot exceed 50'),
            previousSchools: zod_1.z
                .array(zod_1.z.object({
                schoolName: zod_1.z
                    .string()
                    .min(1, 'School name is required')
                    .max(200, 'School name cannot exceed 200 characters')
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
                    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
                toDate: zod_1.z
                    .string()
                    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
            }))
                .optional(),
        }).optional(),
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
            zipCode: zod_1.z
                .string()
                .regex(/^\d{5,6}$/, 'Invalid zip code format'),
            country: zod_1.z
                .string()
                .max(100, 'Country cannot exceed 100 characters')
                .trim(),
        }).optional(),
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
        }).optional(),
        salary: zod_1.z.object({
            basic: zod_1.z
                .number()
                .min(0, 'Basic salary cannot be negative'),
            allowances: zod_1.z
                .number()
                .min(0, 'Allowances cannot be negative')
                .default(0)
                .optional(),
            deductions: zod_1.z
                .number()
                .min(0, 'Deductions cannot be negative')
                .default(0)
                .optional(),
        }).optional(),
        isClassTeacher: zod_1.z
            .boolean()
            .optional(),
        classTeacherFor: zod_1.z.object({
            grade: zod_1.z
                .number()
                .int('Grade must be an integer')
                .min(1, 'Grade must be at least 1')
                .max(12, 'Grade cannot exceed 12'),
            section: zod_1.z
                .string()
                .regex(/^[A-Z]$/, 'Section must be a single uppercase letter'),
        }).optional(),
        isActive: zod_1.z
            .boolean()
            .optional(),
    }),
});
exports.updateTeacherValidationSchema = updateTeacherValidationSchema;
const getTeacherValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Teacher ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid teacher ID format'),
    }),
});
exports.getTeacherValidationSchema = getTeacherValidationSchema;
const deleteTeacherValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Teacher ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid teacher ID format'),
    }),
});
exports.deleteTeacherValidationSchema = deleteTeacherValidationSchema;
const getTeachersValidationSchema = zod_1.z.object({
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
        subject: zod_1.z
            .string()
            .min(1, 'Subject cannot be empty')
            .optional(),
        grade: zod_1.z
            .string()
            .regex(/^\d+$/, 'Grade must be a number')
            .transform((val) => parseInt(val))
            .refine((val) => val >= 1 && val <= 12, 'Grade must be between 1 and 12')
            .optional(),
        designation: zod_1.z
            .enum([
            'Principal',
            'Vice Principal',
            'Head Teacher',
            'Senior Teacher',
            'Teacher',
            'Assistant Teacher',
            'Subject Coordinator',
            'Sports Teacher',
            'Music Teacher',
            'Art Teacher',
            'Librarian',
            'Lab Assistant',
        ])
            .optional(),
        isActive: zod_1.z
            .enum(['true', 'false', 'all'], {
            errorMap: () => ({ message: 'isActive must be true, false, or all' }),
        })
            .optional(),
        isClassTeacher: zod_1.z
            .enum(['true', 'false'], {
            errorMap: () => ({ message: 'isClassTeacher must be true or false' }),
        })
            .optional(),
        search: zod_1.z
            .string()
            .min(1, 'Search term must be at least 1 character')
            .max(50, 'Search term cannot exceed 50 characters')
            .optional(),
        sortBy: zod_1.z
            .enum(['firstName', 'lastName', 'teacherId', 'designation', 'joinDate', 'experience.totalYears'], {
            errorMap: () => ({ message: 'Invalid sort field' }),
        })
            .optional()
            .default('joinDate'),
        sortOrder: zod_1.z
            .enum(['asc', 'desc'], {
            errorMap: () => ({ message: 'Sort order must be asc or desc' }),
        })
            .optional()
            .default('desc'),
    }),
});
exports.getTeachersValidationSchema = getTeachersValidationSchema;
const uploadPhotosValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Teacher ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid teacher ID format'),
    }),
});
exports.uploadPhotosValidationSchema = uploadPhotosValidationSchema;
const deletePhotoValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        teacherId: zod_1.z
            .string({
            required_error: 'Teacher ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid teacher ID format'),
        photoId: zod_1.z
            .string({
            required_error: 'Photo ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid photo ID format'),
    }),
});
exports.deletePhotoValidationSchema = deletePhotoValidationSchema;
const getTeachersBySubjectSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
        subject: zod_1.z
            .string({
            required_error: 'Subject is required',
        })
            .min(1, 'Subject cannot be empty'),
    }),
});
exports.getTeachersBySubjectSchema = getTeachersBySubjectSchema;
const getTeachersStatsValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: 'School ID is required',
        })
            .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format'),
    }),
});
exports.getTeachersStatsValidationSchema = getTeachersStatsValidationSchema;
const issuePunishmentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        studentIds: zod_1.z
            .array(zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid student ID format'))
            .min(1, 'At least one student ID is required')
            .max(50, 'Cannot issue punishment to more than 50 students at once'),
        punishmentType: zod_1.z
            .string({
            required_error: 'Punishment type is required',
        })
            .min(1, 'Punishment type cannot be empty'),
        severity: zod_1.z
            .enum(['low', 'medium', 'high', 'critical'], {
            required_error: 'Severity is required',
            invalid_type_error: 'Severity must be one of: low, medium, high, critical',
        }),
        category: zod_1.z
            .enum(['behavior', 'attendance', 'academic', 'discipline', 'uniform', 'other'], {
            required_error: 'Category is required',
            invalid_type_error: 'Category must be one of: behavior, attendance, academic, discipline, uniform, other',
        }),
        title: zod_1.z
            .string({
            required_error: 'Title is required',
        })
            .min(1, 'Title cannot be empty')
            .max(200, 'Title cannot exceed 200 characters')
            .trim(),
        description: zod_1.z
            .string({
            required_error: 'Description is required',
        })
            .min(1, 'Description cannot be empty')
            .max(2000, 'Description cannot exceed 2000 characters')
            .trim(),
        reason: zod_1.z
            .string({
            required_error: 'Reason is required',
        })
            .min(1, 'Reason cannot be empty')
            .max(500, 'Reason cannot exceed 500 characters')
            .trim(),
        actionTaken: zod_1.z
            .string()
            .max(1000, 'Action taken cannot exceed 1000 characters')
            .trim()
            .optional(),
        incidentDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Incident date must be in YYYY-MM-DD format')
            .optional(),
        witnesses: zod_1.z
            .array(zod_1.z.string().min(1, 'Witness name cannot be empty'))
            .max(10, 'Cannot have more than 10 witnesses')
            .optional()
            .default([]),
        urgentNotification: zod_1.z.boolean().optional().default(false),
        followUpRequired: zod_1.z.boolean().optional().default(true),
        isAppealable: zod_1.z.boolean().optional().default(true),
        appealDeadline: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Appeal deadline must be in YYYY-MM-DD format')
            .optional(),
    }),
});
exports.issuePunishmentValidationSchema = issuePunishmentValidationSchema;
const resolveDisciplinaryActionValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        actionId: zod_1.z.string().min(1, 'Action ID is required'),
    }),
    body: zod_1.z.object({
        resolutionNotes: zod_1.z
            .string({
            required_error: 'Resolution notes are required',
        })
            .min(1, 'Resolution notes cannot be empty')
            .max(1000, 'Resolution notes cannot exceed 1000 characters')
            .trim(),
    }),
});
exports.resolveDisciplinaryActionValidationSchema = resolveDisciplinaryActionValidationSchema;
const addDisciplinaryActionCommentValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        actionId: zod_1.z.string().min(1, 'Action ID is required'),
    }),
    body: zod_1.z.object({
        comment: zod_1.z
            .string({
            required_error: 'Comment is required',
        })
            .min(1, 'Comment cannot be empty')
            .max(1000, 'Comment cannot exceed 1000 characters')
            .trim(),
    }),
});
exports.addDisciplinaryActionCommentValidationSchema = addDisciplinaryActionCommentValidationSchema;
//# sourceMappingURL=teacher.validation.js.map