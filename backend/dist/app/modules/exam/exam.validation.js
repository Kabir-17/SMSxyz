"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamValidation = void 0;
const zod_1 = require("zod");
const createExamValidation = zod_1.z.object({
    body: zod_1.z.object({
        schoolId: zod_1.z.string({
            required_error: 'School ID is required',
            invalid_type_error: 'School ID must be a string',
        }),
        examName: zod_1.z.string({
            required_error: 'Exam name is required',
            invalid_type_error: 'Exam name must be a string',
        })
            .trim()
            .min(1, 'Exam name cannot be empty')
            .max(200, 'Exam name cannot exceed 200 characters'),
        examType: zod_1.z.enum(['unit-test', 'mid-term', 'final', 'quarterly', 'half-yearly', 'annual', 'entrance', 'mock'], {
            required_error: 'Exam type is required',
            invalid_type_error: 'Exam type must be one of the valid options',
        }),
        academicYear: zod_1.z.string({
            required_error: 'Academic year is required',
        })
            .regex(/^\d{4}-\d{4}$/, 'Academic year must be in YYYY-YYYY format'),
        grade: zod_1.z.number({
            required_error: 'Grade is required',
            invalid_type_error: 'Grade must be a number',
        })
            .min(1, 'Grade must be at least 1')
            .max(12, 'Grade cannot exceed 12'),
        section: zod_1.z.string()
            .optional()
            .refine((val) => !val || /^[A-Z]$/.test(val), 'Section must be a single uppercase letter'),
        subjectId: zod_1.z.string({
            required_error: 'Subject ID is required',
            invalid_type_error: 'Subject ID must be a string',
        }),
        teacherId: zod_1.z.string({
            required_error: 'Teacher ID is required',
            invalid_type_error: 'Teacher ID must be a string',
        }),
        examDate: zod_1.z.string({
            required_error: 'Exam date is required',
        }).datetime('Invalid exam date format'),
        startTime: zod_1.z.string({
            required_error: 'Start time is required',
        })
            .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format'),
        endTime: zod_1.z.string({
            required_error: 'End time is required',
        })
            .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'),
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
        venue: zod_1.z.string()
            .trim()
            .max(200, 'Venue cannot exceed 200 characters')
            .optional(),
        instructions: zod_1.z.string()
            .trim()
            .max(2000, 'Instructions cannot exceed 2000 characters')
            .optional(),
        syllabus: zod_1.z.array(zod_1.z.string().trim())
            .max(50, 'Cannot have more than 50 syllabus topics')
            .optional(),
        gradingScale: zod_1.z.object({
            gradeA: zod_1.z.number()
                .min(0, 'Grade A marks cannot be negative')
                .max(100, 'Grade A marks cannot exceed 100'),
            gradeB: zod_1.z.number()
                .min(0, 'Grade B marks cannot be negative')
                .max(100, 'Grade B marks cannot exceed 100'),
            gradeC: zod_1.z.number()
                .min(0, 'Grade C marks cannot be negative')
                .max(100, 'Grade C marks cannot exceed 100'),
            gradeD: zod_1.z.number()
                .min(0, 'Grade D marks cannot be negative')
                .max(100, 'Grade D marks cannot exceed 100'),
            gradeF: zod_1.z.number()
                .min(0, 'Grade F marks cannot be negative')
                .max(100, 'Grade F marks cannot exceed 100'),
        })
            .optional()
            .refine((scale) => {
            if (!scale)
                return true;
            return scale.gradeA > scale.gradeB &&
                scale.gradeB > scale.gradeC &&
                scale.gradeC > scale.gradeD &&
                scale.gradeD > scale.gradeF;
        }, {
            message: 'Grading scale must be in descending order (A > B > C > D > F)',
        }),
        weightage: zod_1.z.number()
            .min(0, 'Weightage cannot be negative')
            .max(100, 'Weightage cannot exceed 100')
            .optional(),
    })
        .refine((data) => data.passingMarks <= data.totalMarks, {
        message: 'Passing marks cannot exceed total marks',
        path: ['passingMarks'],
    })
        .refine((data) => {
        const [startHours, startMinutes] = data.startTime.split(':').map(Number);
        const [endHours, endMinutes] = data.endTime.split(':').map(Number);
        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;
        return endTotalMinutes > startTotalMinutes || endTotalMinutes + (24 * 60) > startTotalMinutes;
    }, {
        message: 'End time must be after start time',
        path: ['endTime'],
    }),
});
const updateExamValidation = zod_1.z.object({
    body: zod_1.z.object({
        examName: zod_1.z.string()
            .trim()
            .min(1, 'Exam name cannot be empty')
            .max(200, 'Exam name cannot exceed 200 characters')
            .optional(),
        examDate: zod_1.z.string().datetime('Invalid exam date format').optional(),
        startTime: zod_1.z.string()
            .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format')
            .optional(),
        endTime: zod_1.z.string()
            .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format')
            .optional(),
        totalMarks: zod_1.z.number()
            .min(1, 'Total marks must be at least 1')
            .max(1000, 'Total marks cannot exceed 1000')
            .optional(),
        passingMarks: zod_1.z.number()
            .min(0, 'Passing marks cannot be negative')
            .optional(),
        venue: zod_1.z.string()
            .trim()
            .max(200, 'Venue cannot exceed 200 characters')
            .optional(),
        instructions: zod_1.z.string()
            .trim()
            .max(2000, 'Instructions cannot exceed 2000 characters')
            .optional(),
        syllabus: zod_1.z.array(zod_1.z.string().trim())
            .max(50, 'Cannot have more than 50 syllabus topics')
            .optional(),
        isPublished: zod_1.z.boolean().optional(),
        resultsPublished: zod_1.z.boolean().optional(),
        gradingScale: zod_1.z.object({
            gradeA: zod_1.z.number().min(0).max(100),
            gradeB: zod_1.z.number().min(0).max(100),
            gradeC: zod_1.z.number().min(0).max(100),
            gradeD: zod_1.z.number().min(0).max(100),
            gradeF: zod_1.z.number().min(0).max(100),
        })
            .optional()
            .refine((scale) => {
            if (!scale)
                return true;
            return scale.gradeA > scale.gradeB &&
                scale.gradeB > scale.gradeC &&
                scale.gradeC > scale.gradeD &&
                scale.gradeD > scale.gradeF;
        }, {
            message: 'Grading scale must be in descending order (A > B > C > D > F)',
        }),
        weightage: zod_1.z.number()
            .min(0, 'Weightage cannot be negative')
            .max(100, 'Weightage cannot exceed 100')
            .optional(),
        isActive: zod_1.z.boolean().optional(),
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
        if (data.startTime && data.endTime) {
            const [startHours, startMinutes] = data.startTime.split(':').map(Number);
            const [endHours, endMinutes] = data.endTime.split(':').map(Number);
            const startTotalMinutes = startHours * 60 + startMinutes;
            const endTotalMinutes = endHours * 60 + endMinutes;
            return endTotalMinutes > startTotalMinutes || endTotalMinutes + (24 * 60) > startTotalMinutes;
        }
        return true;
    }, {
        message: 'End time must be after start time',
        path: ['endTime'],
    }),
});
const submitResultsValidation = zod_1.z.object({
    body: zod_1.z.object({
        examId: zod_1.z.string({
            required_error: 'Exam ID is required',
        }),
        results: zod_1.z.array(zod_1.z.object({
            studentId: zod_1.z.string({
                required_error: 'Student ID is required',
            }),
            marksObtained: zod_1.z.number({
                invalid_type_error: 'Marks obtained must be a number',
            })
                .min(0, 'Marks obtained cannot be negative')
                .optional(),
            isAbsent: zod_1.z.boolean().default(false),
            remarks: zod_1.z.string()
                .trim()
                .max(500, 'Remarks cannot exceed 500 characters')
                .optional(),
        }))
            .min(1, 'At least one result is required')
            .max(100, 'Cannot submit more than 100 results at once'),
    }),
});
const getExamsByClassValidation = zod_1.z.object({
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
        examType: zod_1.z.enum(['unit-test', 'mid-term', 'final', 'quarterly', 'half-yearly', 'annual', 'entrance', 'mock']).optional(),
        subject: zod_1.z.string().optional(),
        academicYear: zod_1.z.string()
            .regex(/^\d{4}-\d{4}$/, 'Academic year must be in YYYY-YYYY format')
            .optional(),
        status: zod_1.z.enum(['upcoming', 'ongoing', 'completed', 'all']).default('all'),
        isPublished: zod_1.z.string().transform((val) => val === 'true').optional(),
        resultsPublished: zod_1.z.string().transform((val) => val === 'true').optional(),
        startDate: zod_1.z.string().datetime('Invalid start date format').optional(),
        endDate: zod_1.z.string().datetime('Invalid end date format').optional(),
        page: zod_1.z.string().transform((val) => parseInt(val)).optional(),
        limit: zod_1.z.string().transform((val) => parseInt(val)).optional(),
    }).optional(),
});
const getExamScheduleValidation = zod_1.z.object({
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
        startDate: zod_1.z.string().datetime('Invalid start date format').optional(),
        endDate: zod_1.z.string().datetime('Invalid end date format').optional(),
        examType: zod_1.z.enum(['unit-test', 'mid-term', 'final', 'quarterly', 'half-yearly', 'annual', 'entrance', 'mock']).optional(),
    }).optional(),
});
const getExamStatsValidation = zod_1.z.object({
    params: zod_1.z.object({
        examId: zod_1.z.string({
            required_error: 'Exam ID is required',
        }),
    }),
});
const getExamResultsValidation = zod_1.z.object({
    params: zod_1.z.object({
        examId: zod_1.z.string({
            required_error: 'Exam ID is required',
        }),
    }),
    query: zod_1.z.object({
        studentId: zod_1.z.string().optional(),
        grade: zod_1.z.enum(['A', 'B', 'C', 'D', 'F', 'ABS']).optional(),
        isPass: zod_1.z.string().transform((val) => val === 'true').optional(),
        isAbsent: zod_1.z.string().transform((val) => val === 'true').optional(),
        sortBy: zod_1.z.enum(['marksObtained', 'percentage', 'studentName']).default('marksObtained'),
        sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
        page: zod_1.z.string().transform((val) => parseInt(val)).optional(),
        limit: zod_1.z.string().transform((val) => parseInt(val)).optional(),
    }).optional(),
});
const examIdParamValidation = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({
            required_error: 'Exam ID is required',
        }),
    }),
});
const studentIdParamValidation = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z.string({
            required_error: 'Student ID is required',
        }),
    }),
});
const teacherIdParamValidation = zod_1.z.object({
    params: zod_1.z.object({
        teacherId: zod_1.z.string({
            required_error: 'Teacher ID is required',
        }),
    }),
});
const subjectIdParamValidation = zod_1.z.object({
    params: zod_1.z.object({
        subjectId: zod_1.z.string({
            required_error: 'Subject ID is required',
        }),
    }),
});
exports.ExamValidation = {
    createExamValidation,
    updateExamValidation,
    submitResultsValidation,
    getExamsByClassValidation,
    getExamScheduleValidation,
    getExamStatsValidation,
    getExamResultsValidation,
    examIdParamValidation,
    studentIdParamValidation,
    teacherIdParamValidation,
    subjectIdParamValidation,
};
//# sourceMappingURL=exam.validation.js.map