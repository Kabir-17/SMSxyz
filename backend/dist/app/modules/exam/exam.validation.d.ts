import { z } from 'zod';
export declare const ExamValidation: {
    createExamValidation: z.ZodObject<{
        body: z.ZodEffects<z.ZodEffects<z.ZodObject<{
            schoolId: z.ZodString;
            examName: z.ZodString;
            examType: z.ZodEnum<["unit-test", "mid-term", "final", "quarterly", "half-yearly", "annual", "entrance", "mock"]>;
            academicYear: z.ZodString;
            grade: z.ZodNumber;
            section: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
            subjectId: z.ZodString;
            teacherId: z.ZodString;
            examDate: z.ZodString;
            startTime: z.ZodString;
            endTime: z.ZodString;
            totalMarks: z.ZodNumber;
            passingMarks: z.ZodNumber;
            venue: z.ZodOptional<z.ZodString>;
            instructions: z.ZodOptional<z.ZodString>;
            syllabus: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            gradingScale: z.ZodEffects<z.ZodOptional<z.ZodObject<{
                gradeA: z.ZodNumber;
                gradeB: z.ZodNumber;
                gradeC: z.ZodNumber;
                gradeD: z.ZodNumber;
                gradeF: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            }, {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            }>>, {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined, {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined>;
            weightage: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            schoolId: string;
            grade: number;
            teacherId: string;
            academicYear: string;
            subjectId: string;
            examName: string;
            examDate: string;
            totalMarks: number;
            startTime: string;
            endTime: string;
            passingMarks: number;
            examType: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock";
            section?: string | undefined;
            instructions?: string | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        }, {
            schoolId: string;
            grade: number;
            teacherId: string;
            academicYear: string;
            subjectId: string;
            examName: string;
            examDate: string;
            totalMarks: number;
            startTime: string;
            endTime: string;
            passingMarks: number;
            examType: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock";
            section?: string | undefined;
            instructions?: string | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        }>, {
            schoolId: string;
            grade: number;
            teacherId: string;
            academicYear: string;
            subjectId: string;
            examName: string;
            examDate: string;
            totalMarks: number;
            startTime: string;
            endTime: string;
            passingMarks: number;
            examType: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock";
            section?: string | undefined;
            instructions?: string | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        }, {
            schoolId: string;
            grade: number;
            teacherId: string;
            academicYear: string;
            subjectId: string;
            examName: string;
            examDate: string;
            totalMarks: number;
            startTime: string;
            endTime: string;
            passingMarks: number;
            examType: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock";
            section?: string | undefined;
            instructions?: string | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        }>, {
            schoolId: string;
            grade: number;
            teacherId: string;
            academicYear: string;
            subjectId: string;
            examName: string;
            examDate: string;
            totalMarks: number;
            startTime: string;
            endTime: string;
            passingMarks: number;
            examType: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock";
            section?: string | undefined;
            instructions?: string | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        }, {
            schoolId: string;
            grade: number;
            teacherId: string;
            academicYear: string;
            subjectId: string;
            examName: string;
            examDate: string;
            totalMarks: number;
            startTime: string;
            endTime: string;
            passingMarks: number;
            examType: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock";
            section?: string | undefined;
            instructions?: string | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            schoolId: string;
            grade: number;
            teacherId: string;
            academicYear: string;
            subjectId: string;
            examName: string;
            examDate: string;
            totalMarks: number;
            startTime: string;
            endTime: string;
            passingMarks: number;
            examType: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock";
            section?: string | undefined;
            instructions?: string | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        };
    }, {
        body: {
            schoolId: string;
            grade: number;
            teacherId: string;
            academicYear: string;
            subjectId: string;
            examName: string;
            examDate: string;
            totalMarks: number;
            startTime: string;
            endTime: string;
            passingMarks: number;
            examType: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock";
            section?: string | undefined;
            instructions?: string | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        };
    }>;
    updateExamValidation: z.ZodObject<{
        body: z.ZodEffects<z.ZodEffects<z.ZodObject<{
            examName: z.ZodOptional<z.ZodString>;
            examDate: z.ZodOptional<z.ZodString>;
            startTime: z.ZodOptional<z.ZodString>;
            endTime: z.ZodOptional<z.ZodString>;
            totalMarks: z.ZodOptional<z.ZodNumber>;
            passingMarks: z.ZodOptional<z.ZodNumber>;
            venue: z.ZodOptional<z.ZodString>;
            instructions: z.ZodOptional<z.ZodString>;
            syllabus: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            isPublished: z.ZodOptional<z.ZodBoolean>;
            resultsPublished: z.ZodOptional<z.ZodBoolean>;
            gradingScale: z.ZodEffects<z.ZodOptional<z.ZodObject<{
                gradeA: z.ZodNumber;
                gradeB: z.ZodNumber;
                gradeC: z.ZodNumber;
                gradeD: z.ZodNumber;
                gradeF: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            }, {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            }>>, {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined, {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined>;
            weightage: z.ZodOptional<z.ZodNumber>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isActive?: boolean | undefined;
            examName?: string | undefined;
            examDate?: string | undefined;
            totalMarks?: number | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            instructions?: string | undefined;
            passingMarks?: number | undefined;
            isPublished?: boolean | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            resultsPublished?: boolean | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        }, {
            isActive?: boolean | undefined;
            examName?: string | undefined;
            examDate?: string | undefined;
            totalMarks?: number | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            instructions?: string | undefined;
            passingMarks?: number | undefined;
            isPublished?: boolean | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            resultsPublished?: boolean | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        }>, {
            isActive?: boolean | undefined;
            examName?: string | undefined;
            examDate?: string | undefined;
            totalMarks?: number | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            instructions?: string | undefined;
            passingMarks?: number | undefined;
            isPublished?: boolean | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            resultsPublished?: boolean | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        }, {
            isActive?: boolean | undefined;
            examName?: string | undefined;
            examDate?: string | undefined;
            totalMarks?: number | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            instructions?: string | undefined;
            passingMarks?: number | undefined;
            isPublished?: boolean | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            resultsPublished?: boolean | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        }>, {
            isActive?: boolean | undefined;
            examName?: string | undefined;
            examDate?: string | undefined;
            totalMarks?: number | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            instructions?: string | undefined;
            passingMarks?: number | undefined;
            isPublished?: boolean | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            resultsPublished?: boolean | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        }, {
            isActive?: boolean | undefined;
            examName?: string | undefined;
            examDate?: string | undefined;
            totalMarks?: number | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            instructions?: string | undefined;
            passingMarks?: number | undefined;
            isPublished?: boolean | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            resultsPublished?: boolean | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            isActive?: boolean | undefined;
            examName?: string | undefined;
            examDate?: string | undefined;
            totalMarks?: number | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            instructions?: string | undefined;
            passingMarks?: number | undefined;
            isPublished?: boolean | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            resultsPublished?: boolean | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        };
    }, {
        body: {
            isActive?: boolean | undefined;
            examName?: string | undefined;
            examDate?: string | undefined;
            totalMarks?: number | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            instructions?: string | undefined;
            passingMarks?: number | undefined;
            isPublished?: boolean | undefined;
            venue?: string | undefined;
            syllabus?: string[] | undefined;
            resultsPublished?: boolean | undefined;
            gradingScale?: {
                gradeA: number;
                gradeB: number;
                gradeC: number;
                gradeD: number;
                gradeF: number;
            } | undefined;
            weightage?: number | undefined;
        };
    }>;
    submitResultsValidation: z.ZodObject<{
        body: z.ZodObject<{
            examId: z.ZodString;
            results: z.ZodArray<z.ZodObject<{
                studentId: z.ZodString;
                marksObtained: z.ZodOptional<z.ZodNumber>;
                isAbsent: z.ZodDefault<z.ZodBoolean>;
                remarks: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                studentId: string;
                isAbsent: boolean;
                marksObtained?: number | undefined;
                remarks?: string | undefined;
            }, {
                studentId: string;
                marksObtained?: number | undefined;
                remarks?: string | undefined;
                isAbsent?: boolean | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            results: {
                studentId: string;
                isAbsent: boolean;
                marksObtained?: number | undefined;
                remarks?: string | undefined;
            }[];
            examId: string;
        }, {
            results: {
                studentId: string;
                marksObtained?: number | undefined;
                remarks?: string | undefined;
                isAbsent?: boolean | undefined;
            }[];
            examId: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            results: {
                studentId: string;
                isAbsent: boolean;
                marksObtained?: number | undefined;
                remarks?: string | undefined;
            }[];
            examId: string;
        };
    }, {
        body: {
            results: {
                studentId: string;
                marksObtained?: number | undefined;
                remarks?: string | undefined;
                isAbsent?: boolean | undefined;
            }[];
            examId: string;
        };
    }>;
    getExamsByClassValidation: z.ZodObject<{
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
            examType: z.ZodOptional<z.ZodEnum<["unit-test", "mid-term", "final", "quarterly", "half-yearly", "annual", "entrance", "mock"]>>;
            subject: z.ZodOptional<z.ZodString>;
            academicYear: z.ZodOptional<z.ZodString>;
            status: z.ZodDefault<z.ZodEnum<["upcoming", "ongoing", "completed", "all"]>>;
            isPublished: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
            resultsPublished: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
            startDate: z.ZodOptional<z.ZodString>;
            endDate: z.ZodOptional<z.ZodString>;
            page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
            limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        }, "strip", z.ZodTypeAny, {
            status: "all" | "completed" | "upcoming" | "ongoing";
            limit?: number | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            page?: number | undefined;
            section?: string | undefined;
            academicYear?: string | undefined;
            subject?: string | undefined;
            isPublished?: boolean | undefined;
            examType?: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock" | undefined;
            resultsPublished?: boolean | undefined;
        }, {
            limit?: string | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            status?: "all" | "completed" | "upcoming" | "ongoing" | undefined;
            page?: string | undefined;
            section?: string | undefined;
            academicYear?: string | undefined;
            subject?: string | undefined;
            isPublished?: string | undefined;
            examType?: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock" | undefined;
            resultsPublished?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        params: {
            schoolId: string;
            grade: number;
        };
        query?: {
            status: "all" | "completed" | "upcoming" | "ongoing";
            limit?: number | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            page?: number | undefined;
            section?: string | undefined;
            academicYear?: string | undefined;
            subject?: string | undefined;
            isPublished?: boolean | undefined;
            examType?: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock" | undefined;
            resultsPublished?: boolean | undefined;
        } | undefined;
    }, {
        params: {
            schoolId: string;
            grade: string;
        };
        query?: {
            limit?: string | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            status?: "all" | "completed" | "upcoming" | "ongoing" | undefined;
            page?: string | undefined;
            section?: string | undefined;
            academicYear?: string | undefined;
            subject?: string | undefined;
            isPublished?: string | undefined;
            examType?: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock" | undefined;
            resultsPublished?: string | undefined;
        } | undefined;
    }>;
    getExamScheduleValidation: z.ZodObject<{
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
            startDate: z.ZodOptional<z.ZodString>;
            endDate: z.ZodOptional<z.ZodString>;
            examType: z.ZodOptional<z.ZodEnum<["unit-test", "mid-term", "final", "quarterly", "half-yearly", "annual", "entrance", "mock"]>>;
        }, "strip", z.ZodTypeAny, {
            startDate?: string | undefined;
            endDate?: string | undefined;
            section?: string | undefined;
            examType?: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock" | undefined;
        }, {
            startDate?: string | undefined;
            endDate?: string | undefined;
            section?: string | undefined;
            examType?: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        params: {
            schoolId: string;
            grade: number;
        };
        query?: {
            startDate?: string | undefined;
            endDate?: string | undefined;
            section?: string | undefined;
            examType?: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock" | undefined;
        } | undefined;
    }, {
        params: {
            schoolId: string;
            grade: string;
        };
        query?: {
            startDate?: string | undefined;
            endDate?: string | undefined;
            section?: string | undefined;
            examType?: "annual" | "unit-test" | "mid-term" | "final" | "quarterly" | "half-yearly" | "entrance" | "mock" | undefined;
        } | undefined;
    }>;
    getExamStatsValidation: z.ZodObject<{
        params: z.ZodObject<{
            examId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            examId: string;
        }, {
            examId: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        params: {
            examId: string;
        };
    }, {
        params: {
            examId: string;
        };
    }>;
    getExamResultsValidation: z.ZodObject<{
        params: z.ZodObject<{
            examId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            examId: string;
        }, {
            examId: string;
        }>;
        query: z.ZodOptional<z.ZodObject<{
            studentId: z.ZodOptional<z.ZodString>;
            grade: z.ZodOptional<z.ZodEnum<["A", "B", "C", "D", "F", "ABS"]>>;
            isPass: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
            isAbsent: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
            sortBy: z.ZodDefault<z.ZodEnum<["marksObtained", "percentage", "studentName"]>>;
            sortOrder: z.ZodDefault<z.ZodEnum<["asc", "desc"]>>;
            page: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
            limit: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        }, "strip", z.ZodTypeAny, {
            sortBy: "marksObtained" | "percentage" | "studentName";
            sortOrder: "asc" | "desc";
            limit?: number | undefined;
            page?: number | undefined;
            studentId?: string | undefined;
            grade?: "A" | "B" | "C" | "D" | "F" | "ABS" | undefined;
            isPass?: boolean | undefined;
            isAbsent?: boolean | undefined;
        }, {
            limit?: string | undefined;
            page?: string | undefined;
            sortBy?: "marksObtained" | "percentage" | "studentName" | undefined;
            sortOrder?: "asc" | "desc" | undefined;
            studentId?: string | undefined;
            grade?: "A" | "B" | "C" | "D" | "F" | "ABS" | undefined;
            isPass?: string | undefined;
            isAbsent?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        params: {
            examId: string;
        };
        query?: {
            sortBy: "marksObtained" | "percentage" | "studentName";
            sortOrder: "asc" | "desc";
            limit?: number | undefined;
            page?: number | undefined;
            studentId?: string | undefined;
            grade?: "A" | "B" | "C" | "D" | "F" | "ABS" | undefined;
            isPass?: boolean | undefined;
            isAbsent?: boolean | undefined;
        } | undefined;
    }, {
        params: {
            examId: string;
        };
        query?: {
            limit?: string | undefined;
            page?: string | undefined;
            sortBy?: "marksObtained" | "percentage" | "studentName" | undefined;
            sortOrder?: "asc" | "desc" | undefined;
            studentId?: string | undefined;
            grade?: "A" | "B" | "C" | "D" | "F" | "ABS" | undefined;
            isPass?: string | undefined;
            isAbsent?: string | undefined;
        } | undefined;
    }>;
    examIdParamValidation: z.ZodObject<{
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
    studentIdParamValidation: z.ZodObject<{
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
    teacherIdParamValidation: z.ZodObject<{
        params: z.ZodObject<{
            teacherId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            teacherId: string;
        }, {
            teacherId: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        params: {
            teacherId: string;
        };
    }, {
        params: {
            teacherId: string;
        };
    }>;
    subjectIdParamValidation: z.ZodObject<{
        params: z.ZodObject<{
            subjectId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            subjectId: string;
        }, {
            subjectId: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        params: {
            subjectId: string;
        };
    }, {
        params: {
            subjectId: string;
        };
    }>;
};
//# sourceMappingURL=exam.validation.d.ts.map