import { z } from 'zod';
export declare const HomeworkValidation: {
    createHomeworkValidation: z.ZodObject<{
        body: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodObject<{
            schoolId: z.ZodString;
            teacherId: z.ZodString;
            subjectId: z.ZodString;
            classId: z.ZodOptional<z.ZodString>;
            grade: z.ZodNumber;
            section: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
            title: z.ZodString;
            description: z.ZodString;
            instructions: z.ZodOptional<z.ZodString>;
            homeworkType: z.ZodEnum<["assignment", "project", "reading", "practice", "research", "presentation", "other"]>;
            priority: z.ZodDefault<z.ZodEnum<["low", "medium", "high", "urgent"]>>;
            assignedDate: z.ZodString;
            dueDate: z.ZodString;
            estimatedDuration: z.ZodNumber;
            totalMarks: z.ZodNumber;
            passingMarks: z.ZodNumber;
            submissionType: z.ZodEnum<["text", "file", "both", "none"]>;
            allowLateSubmission: z.ZodDefault<z.ZodBoolean>;
            latePenalty: z.ZodOptional<z.ZodNumber>;
            maxLateDays: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, unknown>;
            isGroupWork: z.ZodDefault<z.ZodBoolean>;
            maxGroupSize: z.ZodOptional<z.ZodNumber>;
            rubric: z.ZodOptional<z.ZodArray<z.ZodObject<{
                criteria: z.ZodString;
                maxPoints: z.ZodNumber;
                description: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }, {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }>, "many">>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            schoolId: string;
            description: string;
            grade: number;
            teacherId: string;
            title: string;
            subjectId: string;
            totalMarks: number;
            homeworkType: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation";
            priority: "low" | "medium" | "high" | "urgent";
            assignedDate: string;
            dueDate: string;
            estimatedDuration: number;
            passingMarks: number;
            submissionType: "text" | "none" | "file" | "both";
            allowLateSubmission: boolean;
            isGroupWork: boolean;
            tags?: string[] | undefined;
            section?: string | undefined;
            classId?: string | undefined;
            instructions?: string | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: number | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
        }, {
            schoolId: string;
            description: string;
            grade: number;
            teacherId: string;
            title: string;
            subjectId: string;
            totalMarks: number;
            homeworkType: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation";
            assignedDate: string;
            dueDate: string;
            estimatedDuration: number;
            passingMarks: number;
            submissionType: "text" | "none" | "file" | "both";
            tags?: string[] | undefined;
            section?: string | undefined;
            classId?: string | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: unknown;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
        }>, {
            schoolId: string;
            description: string;
            grade: number;
            teacherId: string;
            title: string;
            subjectId: string;
            totalMarks: number;
            homeworkType: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation";
            priority: "low" | "medium" | "high" | "urgent";
            assignedDate: string;
            dueDate: string;
            estimatedDuration: number;
            passingMarks: number;
            submissionType: "text" | "none" | "file" | "both";
            allowLateSubmission: boolean;
            isGroupWork: boolean;
            tags?: string[] | undefined;
            section?: string | undefined;
            classId?: string | undefined;
            instructions?: string | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: number | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
        }, {
            schoolId: string;
            description: string;
            grade: number;
            teacherId: string;
            title: string;
            subjectId: string;
            totalMarks: number;
            homeworkType: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation";
            assignedDate: string;
            dueDate: string;
            estimatedDuration: number;
            passingMarks: number;
            submissionType: "text" | "none" | "file" | "both";
            tags?: string[] | undefined;
            section?: string | undefined;
            classId?: string | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: unknown;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
        }>, {
            schoolId: string;
            description: string;
            grade: number;
            teacherId: string;
            title: string;
            subjectId: string;
            totalMarks: number;
            homeworkType: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation";
            priority: "low" | "medium" | "high" | "urgent";
            assignedDate: string;
            dueDate: string;
            estimatedDuration: number;
            passingMarks: number;
            submissionType: "text" | "none" | "file" | "both";
            allowLateSubmission: boolean;
            isGroupWork: boolean;
            tags?: string[] | undefined;
            section?: string | undefined;
            classId?: string | undefined;
            instructions?: string | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: number | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
        }, {
            schoolId: string;
            description: string;
            grade: number;
            teacherId: string;
            title: string;
            subjectId: string;
            totalMarks: number;
            homeworkType: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation";
            assignedDate: string;
            dueDate: string;
            estimatedDuration: number;
            passingMarks: number;
            submissionType: "text" | "none" | "file" | "both";
            tags?: string[] | undefined;
            section?: string | undefined;
            classId?: string | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: unknown;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
        }>, {
            schoolId: string;
            description: string;
            grade: number;
            teacherId: string;
            title: string;
            subjectId: string;
            totalMarks: number;
            homeworkType: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation";
            priority: "low" | "medium" | "high" | "urgent";
            assignedDate: string;
            dueDate: string;
            estimatedDuration: number;
            passingMarks: number;
            submissionType: "text" | "none" | "file" | "both";
            allowLateSubmission: boolean;
            isGroupWork: boolean;
            tags?: string[] | undefined;
            section?: string | undefined;
            classId?: string | undefined;
            instructions?: string | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: number | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
        }, {
            schoolId: string;
            description: string;
            grade: number;
            teacherId: string;
            title: string;
            subjectId: string;
            totalMarks: number;
            homeworkType: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation";
            assignedDate: string;
            dueDate: string;
            estimatedDuration: number;
            passingMarks: number;
            submissionType: "text" | "none" | "file" | "both";
            tags?: string[] | undefined;
            section?: string | undefined;
            classId?: string | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: unknown;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
        }>, {
            schoolId: string;
            description: string;
            grade: number;
            teacherId: string;
            title: string;
            subjectId: string;
            totalMarks: number;
            homeworkType: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation";
            priority: "low" | "medium" | "high" | "urgent";
            assignedDate: string;
            dueDate: string;
            estimatedDuration: number;
            passingMarks: number;
            submissionType: "text" | "none" | "file" | "both";
            allowLateSubmission: boolean;
            isGroupWork: boolean;
            tags?: string[] | undefined;
            section?: string | undefined;
            classId?: string | undefined;
            instructions?: string | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: number | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
        }, {
            schoolId: string;
            description: string;
            grade: number;
            teacherId: string;
            title: string;
            subjectId: string;
            totalMarks: number;
            homeworkType: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation";
            assignedDate: string;
            dueDate: string;
            estimatedDuration: number;
            passingMarks: number;
            submissionType: "text" | "none" | "file" | "both";
            tags?: string[] | undefined;
            section?: string | undefined;
            classId?: string | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: unknown;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            schoolId: string;
            description: string;
            grade: number;
            teacherId: string;
            title: string;
            subjectId: string;
            totalMarks: number;
            homeworkType: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation";
            priority: "low" | "medium" | "high" | "urgent";
            assignedDate: string;
            dueDate: string;
            estimatedDuration: number;
            passingMarks: number;
            submissionType: "text" | "none" | "file" | "both";
            allowLateSubmission: boolean;
            isGroupWork: boolean;
            tags?: string[] | undefined;
            section?: string | undefined;
            classId?: string | undefined;
            instructions?: string | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: number | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
        };
    }, {
        body: {
            schoolId: string;
            description: string;
            grade: number;
            teacherId: string;
            title: string;
            subjectId: string;
            totalMarks: number;
            homeworkType: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation";
            assignedDate: string;
            dueDate: string;
            estimatedDuration: number;
            passingMarks: number;
            submissionType: "text" | "none" | "file" | "both";
            tags?: string[] | undefined;
            section?: string | undefined;
            classId?: string | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: unknown;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
        };
    }>;
    updateHomeworkValidation: z.ZodObject<{
        body: z.ZodEffects<z.ZodEffects<z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            instructions: z.ZodOptional<z.ZodString>;
            priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "urgent"]>>;
            dueDate: z.ZodOptional<z.ZodString>;
            estimatedDuration: z.ZodOptional<z.ZodNumber>;
            totalMarks: z.ZodOptional<z.ZodNumber>;
            passingMarks: z.ZodOptional<z.ZodNumber>;
            allowLateSubmission: z.ZodOptional<z.ZodBoolean>;
            latePenalty: z.ZodOptional<z.ZodNumber>;
            maxLateDays: z.ZodEffects<z.ZodOptional<z.ZodNumber>, number | undefined, unknown>;
            isGroupWork: z.ZodOptional<z.ZodBoolean>;
            maxGroupSize: z.ZodOptional<z.ZodNumber>;
            rubric: z.ZodOptional<z.ZodArray<z.ZodObject<{
                criteria: z.ZodString;
                maxPoints: z.ZodNumber;
                description: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }, {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }>, "many">>;
            tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            isPublished: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            description?: string | undefined;
            tags?: string[] | undefined;
            title?: string | undefined;
            totalMarks?: number | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            dueDate?: string | undefined;
            estimatedDuration?: number | undefined;
            passingMarks?: number | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: number | undefined;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
            isPublished?: boolean | undefined;
        }, {
            description?: string | undefined;
            tags?: string[] | undefined;
            title?: string | undefined;
            totalMarks?: number | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            dueDate?: string | undefined;
            estimatedDuration?: number | undefined;
            passingMarks?: number | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: unknown;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
            isPublished?: boolean | undefined;
        }>, {
            description?: string | undefined;
            tags?: string[] | undefined;
            title?: string | undefined;
            totalMarks?: number | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            dueDate?: string | undefined;
            estimatedDuration?: number | undefined;
            passingMarks?: number | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: number | undefined;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
            isPublished?: boolean | undefined;
        }, {
            description?: string | undefined;
            tags?: string[] | undefined;
            title?: string | undefined;
            totalMarks?: number | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            dueDate?: string | undefined;
            estimatedDuration?: number | undefined;
            passingMarks?: number | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: unknown;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
            isPublished?: boolean | undefined;
        }>, {
            description?: string | undefined;
            tags?: string[] | undefined;
            title?: string | undefined;
            totalMarks?: number | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            dueDate?: string | undefined;
            estimatedDuration?: number | undefined;
            passingMarks?: number | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: number | undefined;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
            isPublished?: boolean | undefined;
        }, {
            description?: string | undefined;
            tags?: string[] | undefined;
            title?: string | undefined;
            totalMarks?: number | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            dueDate?: string | undefined;
            estimatedDuration?: number | undefined;
            passingMarks?: number | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: unknown;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
            isPublished?: boolean | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            description?: string | undefined;
            tags?: string[] | undefined;
            title?: string | undefined;
            totalMarks?: number | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            dueDate?: string | undefined;
            estimatedDuration?: number | undefined;
            passingMarks?: number | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: number | undefined;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
            isPublished?: boolean | undefined;
        };
    }, {
        body: {
            description?: string | undefined;
            tags?: string[] | undefined;
            title?: string | undefined;
            totalMarks?: number | undefined;
            instructions?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            dueDate?: string | undefined;
            estimatedDuration?: number | undefined;
            passingMarks?: number | undefined;
            allowLateSubmission?: boolean | undefined;
            latePenalty?: number | undefined;
            maxLateDays?: unknown;
            isGroupWork?: boolean | undefined;
            maxGroupSize?: number | undefined;
            rubric?: {
                criteria: string;
                maxPoints: number;
                description?: string | undefined;
            }[] | undefined;
            isPublished?: boolean | undefined;
        };
    }>;
    submitHomeworkValidation: z.ZodObject<{
        body: z.ZodObject<{
            homeworkId: z.ZodString;
            studentId: z.ZodString;
            groupMembers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            submissionText: z.ZodOptional<z.ZodString>;
            attachments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            studentId: string;
            homeworkId: string;
            attachments?: string[] | undefined;
            groupMembers?: string[] | undefined;
            submissionText?: string | undefined;
        }, {
            studentId: string;
            homeworkId: string;
            attachments?: string[] | undefined;
            groupMembers?: string[] | undefined;
            submissionText?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            studentId: string;
            homeworkId: string;
            attachments?: string[] | undefined;
            groupMembers?: string[] | undefined;
            submissionText?: string | undefined;
        };
    }, {
        body: {
            studentId: string;
            homeworkId: string;
            attachments?: string[] | undefined;
            groupMembers?: string[] | undefined;
            submissionText?: string | undefined;
        };
    }>;
    gradeHomeworkValidation: z.ZodObject<{
        body: z.ZodObject<{
            submissionId: z.ZodString;
            marksObtained: z.ZodNumber;
            feedback: z.ZodOptional<z.ZodString>;
            teacherComments: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            marksObtained: number;
            submissionId: string;
            feedback?: string | undefined;
            teacherComments?: string | undefined;
        }, {
            marksObtained: number;
            submissionId: string;
            feedback?: string | undefined;
            teacherComments?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            marksObtained: number;
            submissionId: string;
            feedback?: string | undefined;
            teacherComments?: string | undefined;
        };
    }, {
        body: {
            marksObtained: number;
            submissionId: string;
            feedback?: string | undefined;
            teacherComments?: string | undefined;
        };
    }>;
    getHomeworkByStudentValidation: z.ZodObject<{
        params: z.ZodObject<{
            studentId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            studentId: string;
        }, {
            studentId: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        params: {
            studentId: string;
        };
    }, {
        params: {
            studentId: string;
        };
    }>;
    getHomeworkByClassValidation: z.ZodObject<{
        params: z.ZodObject<{
            schoolId: z.ZodString;
            grade: z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>;
        }, "strip", z.ZodTypeAny, {
            schoolId: string;
            grade: number;
        }, {
            schoolId: string;
            grade: string;
        }>;
        query: z.ZodOptional<z.ZodObject<{
            section: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            status: z.ZodDefault<z.ZodEnum<["upcoming", "overdue", "today", "all"]>>;
            subject: z.ZodOptional<z.ZodString>;
            homeworkType: z.ZodOptional<z.ZodEnum<["assignment", "project", "reading", "practice", "research", "presentation", "other"]>>;
            priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "urgent"]>>;
            page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
            limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        }, "strip", z.ZodTypeAny, {
            status: "all" | "overdue" | "upcoming" | "today";
            limit?: number | undefined;
            page?: number | undefined;
            section?: string | undefined;
            subject?: string | undefined;
            homeworkType?: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation" | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
        }, {
            limit?: string | undefined;
            status?: "all" | "overdue" | "upcoming" | "today" | undefined;
            page?: string | undefined;
            section?: string | undefined;
            subject?: string | undefined;
            homeworkType?: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation" | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        params: {
            schoolId: string;
            grade: number;
        };
        query?: {
            status: "all" | "overdue" | "upcoming" | "today";
            limit?: number | undefined;
            page?: number | undefined;
            section?: string | undefined;
            subject?: string | undefined;
            homeworkType?: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation" | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
        } | undefined;
    }, {
        params: {
            schoolId: string;
            grade: string;
        };
        query?: {
            limit?: string | undefined;
            status?: "all" | "overdue" | "upcoming" | "today" | undefined;
            page?: string | undefined;
            section?: string | undefined;
            subject?: string | undefined;
            homeworkType?: "assignment" | "other" | "project" | "reading" | "practice" | "research" | "presentation" | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
        } | undefined;
    }>;
    getHomeworkCalendarValidation: z.ZodObject<{
        params: z.ZodObject<{
            schoolId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            schoolId: string;
        }, {
            schoolId: string;
        }>;
        query: z.ZodObject<{
            startDate: z.ZodString;
            endDate: z.ZodString;
            grade: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>;
            section: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        }, "strip", z.ZodTypeAny, {
            startDate: string;
            endDate: string;
            grade?: number | undefined;
            section?: string | undefined;
        }, {
            startDate: string;
            endDate: string;
            grade?: string | undefined;
            section?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        query: {
            startDate: string;
            endDate: string;
            grade?: number | undefined;
            section?: string | undefined;
        };
        params: {
            schoolId: string;
        };
    }, {
        query: {
            startDate: string;
            endDate: string;
            grade?: string | undefined;
            section?: string | undefined;
        };
        params: {
            schoolId: string;
        };
    }>;
    getHomeworkAnalyticsValidation: z.ZodObject<{
        params: z.ZodObject<{
            schoolId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            schoolId: string;
        }, {
            schoolId: string;
        }>;
        query: z.ZodOptional<z.ZodObject<{
            startDate: z.ZodOptional<z.ZodString>;
            endDate: z.ZodOptional<z.ZodString>;
            grade: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>;
            section: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            teacherId: z.ZodOptional<z.ZodString>;
            subjectId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            startDate?: string | undefined;
            endDate?: string | undefined;
            grade?: number | undefined;
            section?: string | undefined;
            teacherId?: string | undefined;
            subjectId?: string | undefined;
        }, {
            startDate?: string | undefined;
            endDate?: string | undefined;
            grade?: string | undefined;
            section?: string | undefined;
            teacherId?: string | undefined;
            subjectId?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        params: {
            schoolId: string;
        };
        query?: {
            startDate?: string | undefined;
            endDate?: string | undefined;
            grade?: number | undefined;
            section?: string | undefined;
            teacherId?: string | undefined;
            subjectId?: string | undefined;
        } | undefined;
    }, {
        params: {
            schoolId: string;
        };
        query?: {
            startDate?: string | undefined;
            endDate?: string | undefined;
            grade?: string | undefined;
            section?: string | undefined;
            teacherId?: string | undefined;
            subjectId?: string | undefined;
        } | undefined;
    }>;
    requestRevisionValidation: z.ZodObject<{
        body: z.ZodObject<{
            submissionId: z.ZodString;
            reason: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            reason: string;
            submissionId: string;
        }, {
            reason: string;
            submissionId: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            reason: string;
            submissionId: string;
        };
    }, {
        body: {
            reason: string;
            submissionId: string;
        };
    }>;
    homeworkIdParamValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        params: {
            id: string;
        };
    }, {
        params: {
            id: string;
        };
    }>;
    submissionIdParamValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        params: {
            id: string;
        };
    }, {
        params: {
            id: string;
        };
    }>;
};
//# sourceMappingURL=homework.validation.d.ts.map