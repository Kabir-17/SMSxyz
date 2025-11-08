"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeworkValidation = void 0;
const zod_1 = require("zod");
const createHomeworkValidation = zod_1.z.object({
    body: zod_1.z.object({
        schoolId: zod_1.z.string({
            required_error: 'School ID is required',
            invalid_type_error: 'School ID must be a string',
        }),
        teacherId: zod_1.z.string({
            required_error: 'Teacher ID is required',
            invalid_type_error: 'Teacher ID must be a string',
        }),
        subjectId: zod_1.z.string({
            required_error: 'Subject ID is required',
            invalid_type_error: 'Subject ID must be a string',
        }),
        classId: zod_1.z.string().optional(),
        grade: zod_1.z.number({
            required_error: 'Grade is required',
            invalid_type_error: 'Grade must be a number',
        })
            .min(1, 'Grade must be at least 1')
            .max(12, 'Grade cannot exceed 12'),
        section: zod_1.z.string()
            .optional()
            .refine((val) => !val || /^[A-Z]$/.test(val), 'Section must be a single uppercase letter'),
        title: zod_1.z.string({
            required_error: 'Title is required',
            invalid_type_error: 'Title must be a string',
        })
            .trim()
            .min(1, 'Title cannot be empty')
            .max(200, 'Title cannot exceed 200 characters'),
        description: zod_1.z.string({
            required_error: 'Description is required',
            invalid_type_error: 'Description must be a string',
        })
            .trim()
            .min(1, 'Description cannot be empty')
            .max(2000, 'Description cannot exceed 2000 characters'),
        instructions: zod_1.z.string()
            .trim()
            .max(2000, 'Instructions cannot exceed 2000 characters')
            .optional(),
        homeworkType: zod_1.z.enum(['assignment', 'project', 'reading', 'practice', 'research', 'presentation', 'other'], {
            required_error: 'Homework type is required',
            invalid_type_error: 'Homework type must be one of the valid options',
        }),
        priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent'], {
            invalid_type_error: 'Priority must be one of the valid options',
        }).default('medium'),
        assignedDate: zod_1.z.string({
            required_error: 'Assigned date is required',
        }).datetime('Invalid assigned date format'),
        dueDate: zod_1.z.string({
            required_error: 'Due date is required',
        }).datetime('Invalid due date format'),
        estimatedDuration: zod_1.z.number({
            required_error: 'Estimated duration is required',
            invalid_type_error: 'Estimated duration must be a number',
        })
            .min(15, 'Estimated duration must be at least 15 minutes')
            .max(1440, 'Estimated duration cannot exceed 24 hours (1440 minutes)'),
        totalMarks: zod_1.z.number({
            required_error: 'Total marks is required',
            invalid_type_error: 'Total marks must be a number',
        })
            .min(1, 'Total marks must be at least 1')
            .max(1000, 'Total marks cannot exceed 1000'),
        passingMarks: zod_1.z.number({
            required_error: 'Passing marks is required',
            invalid_type_error: 'Passing marks must be a number',
        })
            .min(0, 'Passing marks cannot be negative'),
        submissionType: zod_1.z.enum(['text', 'file', 'both', 'none'], {
            required_error: 'Submission type is required',
            invalid_type_error: 'Submission type must be one of the valid options',
        }),
        allowLateSubmission: zod_1.z.boolean().default(true),
        latePenalty: zod_1.z.number()
            .min(0, 'Late penalty cannot be negative')
            .max(100, 'Late penalty cannot exceed 100%')
            .optional(),
        maxLateDays: zod_1.z.preprocess((val) => val === '' || val === null || val === undefined ? undefined : Number(val), zod_1.z.number()
            .min(1, 'Max late days must be at least 1')
            .max(30, 'Max late days cannot exceed 30')
            .optional()),
        isGroupWork: zod_1.z.boolean().default(false),
        maxGroupSize: zod_1.z.number()
            .min(2, 'Max group size must be at least 2')
            .max(10, 'Max group size cannot exceed 10')
            .optional(),
        rubric: zod_1.z.array(zod_1.z.object({
            criteria: zod_1.z.string()
                .trim()
                .min(1, 'Rubric criteria cannot be empty')
                .max(200, 'Criteria cannot exceed 200 characters'),
            maxPoints: zod_1.z.number()
                .min(0, 'Maximum points cannot be negative'),
            description: zod_1.z.string()
                .trim()
                .max(500, 'Description cannot exceed 500 characters')
                .optional(),
        }))
            .max(20, 'Cannot have more than 20 rubric criteria')
            .optional(),
        tags: zod_1.z.array(zod_1.z.string().trim())
            .max(10, 'Cannot have more than 10 tags')
            .optional(),
    })
        .refine((data) => new Date(data.dueDate) > new Date(data.assignedDate), {
        message: 'Due date must be after assigned date',
        path: ['dueDate'],
    })
        .refine((data) => data.passingMarks <= data.totalMarks, {
        message: 'Passing marks cannot exceed total marks',
        path: ['passingMarks'],
    })
        .refine((data) => !data.isGroupWork || data.maxGroupSize !== undefined, {
        message: 'Max group size is required for group work',
        path: ['maxGroupSize'],
    })
        .refine((data) => {
        if (data.rubric && data.rubric.length > 0) {
            const totalRubricPoints = data.rubric.reduce((sum, criteria) => sum + criteria.maxPoints, 0);
            return Math.abs(totalRubricPoints - data.totalMarks) < 0.01;
        }
        return true;
    }, {
        message: 'Rubric total points must equal total marks',
        path: ['rubric'],
    }),
});
const updateHomeworkValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string()
            .trim()
            .min(1, 'Title cannot be empty')
            .max(200, 'Title cannot exceed 200 characters')
            .optional(),
        description: zod_1.z.string()
            .trim()
            .min(1, 'Description cannot be empty')
            .max(2000, 'Description cannot exceed 2000 characters')
            .optional(),
        instructions: zod_1.z.string()
            .trim()
            .max(2000, 'Instructions cannot exceed 2000 characters')
            .optional(),
        priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']).optional(),
        dueDate: zod_1.z.string().datetime('Invalid due date format').optional(),
        estimatedDuration: zod_1.z.number()
            .min(15, 'Estimated duration must be at least 15 minutes')
            .max(1440, 'Estimated duration cannot exceed 24 hours (1440 minutes)')
            .optional(),
        totalMarks: zod_1.z.number()
            .min(1, 'Total marks must be at least 1')
            .max(1000, 'Total marks cannot exceed 1000')
            .optional(),
        passingMarks: zod_1.z.number()
            .min(0, 'Passing marks cannot be negative')
            .optional(),
        allowLateSubmission: zod_1.z.boolean().optional(),
        latePenalty: zod_1.z.number()
            .min(0, 'Late penalty cannot be negative')
            .max(100, 'Late penalty cannot exceed 100%')
            .optional(),
        maxLateDays: zod_1.z.preprocess((val) => val === '' || val === null || val === undefined ? undefined : Number(val), zod_1.z.number()
            .min(1, 'Max late days must be at least 1')
            .max(30, 'Max late days cannot exceed 30')
            .optional()),
        isGroupWork: zod_1.z.boolean().optional(),
        maxGroupSize: zod_1.z.number()
            .min(2, 'Max group size must be at least 2')
            .max(10, 'Max group size cannot exceed 10')
            .optional(),
        rubric: zod_1.z.array(zod_1.z.object({
            criteria: zod_1.z.string()
                .trim()
                .min(1, 'Rubric criteria cannot be empty')
                .max(200, 'Criteria cannot exceed 200 characters'),
            maxPoints: zod_1.z.number()
                .min(0, 'Maximum points cannot be negative'),
            description: zod_1.z.string()
                .trim()
                .max(500, 'Description cannot exceed 500 characters')
                .optional(),
        }))
            .max(20, 'Cannot have more than 20 rubric criteria')
            .optional(),
        tags: zod_1.z.array(zod_1.z.string().trim())
            .max(10, 'Cannot have more than 10 tags')
            .optional(),
        isPublished: zod_1.z.boolean().optional(),
    })
        .refine((data) => {
        if (data.passingMarks !== undefined && data.totalMarks !== undefined) {
            return data.passingMarks <= data.totalMarks;
        }
        return true;
    }, {
        message: 'Passing marks cannot exceed total marks',
        path: ['passingMarks'],
    })
        .refine((data) => {
        if (data.rubric && data.rubric.length > 0 && data.totalMarks !== undefined) {
            const totalRubricPoints = data.rubric.reduce((sum, criteria) => sum + criteria.maxPoints, 0);
            return Math.abs(totalRubricPoints - data.totalMarks) < 0.01;
        }
        return true;
    }, {
        message: 'Rubric total points must equal total marks',
        path: ['rubric'],
    }),
});
const submitHomeworkValidation = zod_1.z.object({
    body: zod_1.z.object({
        homeworkId: zod_1.z.string({
            required_error: 'Homework ID is required',
        }),
        studentId: zod_1.z.string({
            required_error: 'Student ID is required',
        }),
        groupMembers: zod_1.z.array(zod_1.z.string()).optional(),
        submissionText: zod_1.z.string()
            .trim()
            .max(5000, 'Submission text cannot exceed 5000 characters')
            .optional(),
        attachments: zod_1.z.array(zod_1.z.string())
            .max(10, 'Cannot have more than 10 attachments')
            .optional(),
    }),
});
const gradeHomeworkValidation = zod_1.z.object({
    body: zod_1.z.object({
        submissionId: zod_1.z.string({
            required_error: 'Submission ID is required',
        }),
        marksObtained: zod_1.z.number({
            required_error: 'Marks obtained is required',
            invalid_type_error: 'Marks obtained must be a number',
        })
            .min(0, 'Marks obtained cannot be negative'),
        feedback: zod_1.z.string()
            .trim()
            .max(2000, 'Feedback cannot exceed 2000 characters')
            .optional(),
        teacherComments: zod_1.z.string()
            .trim()
            .max(1000, 'Teacher comments cannot exceed 1000 characters')
            .optional(),
    }),
});
const getHomeworkByStudentValidation = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z.string({
            required_error: 'Student ID is required',
        }),
    }),
});
const getHomeworkByClassValidation = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z.string({
            required_error: 'School ID is required',
        }),
        grade: zod_1.z.string().transform((val) => parseInt(val))
            .refine((val) => val >= 1 && val <= 12, 'Grade must be between 1 and 12'),
    }),
    query: zod_1.z.object({
        section: zod_1.z.string()
            .refine((val) => !val || /^[A-Z]$/.test(val), 'Section must be a single uppercase letter')
            .optional(),
        status: zod_1.z.enum(['upcoming', 'overdue', 'today', 'all']).default('all'),
        subject: zod_1.z.string().optional(),
        homeworkType: zod_1.z.enum(['assignment', 'project', 'reading', 'practice', 'research', 'presentation', 'other']).optional(),
        priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']).optional(),
        page: zod_1.z.string().transform((val) => parseInt(val)).optional(),
        limit: zod_1.z.string().transform((val) => parseInt(val)).optional(),
    }).optional(),
});
const getHomeworkCalendarValidation = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z.string({
            required_error: 'School ID is required',
        }),
    }),
    query: zod_1.z.object({
        startDate: zod_1.z.string().datetime('Invalid start date format'),
        endDate: zod_1.z.string().datetime('Invalid end date format'),
        grade: zod_1.z.string().transform((val) => parseInt(val))
            .refine((val) => val >= 1 && val <= 12, 'Grade must be between 1 and 12')
            .optional(),
        section: zod_1.z.string()
            .refine((val) => !val || /^[A-Z]$/.test(val), 'Section must be a single uppercase letter')
            .optional(),
    }),
});
const getHomeworkAnalyticsValidation = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z.string({
            required_error: 'School ID is required',
        }),
    }),
    query: zod_1.z.object({
        startDate: zod_1.z.string().datetime('Invalid start date format').optional(),
        endDate: zod_1.z.string().datetime('Invalid end date format').optional(),
        grade: zod_1.z.string().transform((val) => parseInt(val))
            .refine((val) => val >= 1 && val <= 12, 'Grade must be between 1 and 12')
            .optional(),
        section: zod_1.z.string()
            .refine((val) => !val || /^[A-Z]$/.test(val), 'Section must be a single uppercase letter')
            .optional(),
        teacherId: zod_1.z.string().optional(),
        subjectId: zod_1.z.string().optional(),
    }).optional(),
});
const requestRevisionValidation = zod_1.z.object({
    body: zod_1.z.object({
        submissionId: zod_1.z.string({
            required_error: 'Submission ID is required',
        }),
        reason: zod_1.z.string({
            required_error: 'Revision reason is required',
        })
            .trim()
            .min(1, 'Revision reason cannot be empty')
            .max(500, 'Revision reason cannot exceed 500 characters'),
    }),
});
const homeworkIdParamValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({
            required_error: 'Homework ID is required',
        }),
    }),
});
const submissionIdParamValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({
            required_error: 'Submission ID is required',
        }),
    }),
});
exports.HomeworkValidation = {
    createHomeworkValidation,
    updateHomeworkValidation,
    submitHomeworkValidation,
    gradeHomeworkValidation,
    getHomeworkByStudentValidation,
    getHomeworkByClassValidation,
    getHomeworkCalendarValidation,
    getHomeworkAnalyticsValidation,
    requestRevisionValidation,
    homeworkIdParamValidation,
    submissionIdParamValidation,
};
//# sourceMappingURL=homework.validation.js.map