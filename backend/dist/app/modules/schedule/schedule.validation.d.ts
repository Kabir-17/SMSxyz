import { z } from "zod";
export declare const ScheduleValidation: {
    createScheduleValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            schoolId: z.ZodString;
            classId: z.ZodOptional<z.ZodString>;
            grade: z.ZodNumber;
            section: z.ZodString;
            academicYear: z.ZodString;
            dayOfWeek: z.ZodEnum<["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]>;
            periods: z.ZodEffects<z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodObject<{
                periodNumber: z.ZodNumber;
                subjectId: z.ZodOptional<z.ZodString>;
                teacherId: z.ZodOptional<z.ZodString>;
                roomNumber: z.ZodOptional<z.ZodString>;
                startTime: z.ZodString;
                endTime: z.ZodString;
                isBreak: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                breakType: z.ZodOptional<z.ZodEnum<["short", "lunch", "long"]>>;
                breakDuration: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                isBreak: boolean;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                isBreak?: boolean | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }>, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                isBreak: boolean;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                isBreak?: boolean | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }>, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                isBreak: boolean;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                isBreak?: boolean | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }>, "many">, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                isBreak: boolean;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }[], {
                periodNumber: number;
                startTime: string;
                endTime: string;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                isBreak?: boolean | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }[]>;
        }, "strip", z.ZodTypeAny, {
            schoolId: string;
            grade: number;
            section: string;
            academicYear: string;
            dayOfWeek: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
            periods: {
                periodNumber: number;
                startTime: string;
                endTime: string;
                isBreak: boolean;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }[];
            classId?: string | undefined;
        }, {
            schoolId: string;
            grade: number;
            section: string;
            academicYear: string;
            dayOfWeek: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
            periods: {
                periodNumber: number;
                startTime: string;
                endTime: string;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                isBreak?: boolean | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }[];
            classId?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            schoolId: string;
            grade: number;
            section: string;
            academicYear: string;
            dayOfWeek: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
            periods: {
                periodNumber: number;
                startTime: string;
                endTime: string;
                isBreak: boolean;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }[];
            classId?: string | undefined;
        };
    }, {
        body: {
            schoolId: string;
            grade: number;
            section: string;
            academicYear: string;
            dayOfWeek: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
            periods: {
                periodNumber: number;
                startTime: string;
                endTime: string;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                isBreak?: boolean | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }[];
            classId?: string | undefined;
        };
    }>;
    updateScheduleValidationSchema: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
        }, {
            id: string;
        }>;
        body: z.ZodObject<{
            periods: z.ZodEffects<z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodObject<{
                periodNumber: z.ZodNumber;
                subjectId: z.ZodOptional<z.ZodString>;
                teacherId: z.ZodOptional<z.ZodString>;
                roomNumber: z.ZodOptional<z.ZodString>;
                startTime: z.ZodString;
                endTime: z.ZodString;
                isBreak: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                breakType: z.ZodOptional<z.ZodEnum<["short", "lunch", "long"]>>;
                breakDuration: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                isBreak: boolean;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                isBreak?: boolean | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }>, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                isBreak: boolean;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                isBreak?: boolean | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }>, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                isBreak: boolean;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                isBreak?: boolean | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }>, "many">>, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                isBreak: boolean;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }[] | undefined, {
                periodNumber: number;
                startTime: string;
                endTime: string;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                isBreak?: boolean | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }[] | undefined>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isActive?: boolean | undefined;
            periods?: {
                periodNumber: number;
                startTime: string;
                endTime: string;
                isBreak: boolean;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }[] | undefined;
        }, {
            isActive?: boolean | undefined;
            periods?: {
                periodNumber: number;
                startTime: string;
                endTime: string;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                isBreak?: boolean | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        params: {
            id: string;
        };
        body: {
            isActive?: boolean | undefined;
            periods?: {
                periodNumber: number;
                startTime: string;
                endTime: string;
                isBreak: boolean;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }[] | undefined;
        };
    }, {
        params: {
            id: string;
        };
        body: {
            isActive?: boolean | undefined;
            periods?: {
                periodNumber: number;
                startTime: string;
                endTime: string;
                teacherId?: string | undefined;
                subjectId?: string | undefined;
                roomNumber?: string | undefined;
                isBreak?: boolean | undefined;
                breakType?: "long" | "short" | "lunch" | undefined;
                breakDuration?: number | undefined;
            }[] | undefined;
        };
    }>;
    assignSubstituteTeacherValidationSchema: z.ZodObject<{
        body: z.ZodEffects<z.ZodObject<{
            substituteTeacherId: z.ZodString;
            startDate: z.ZodEffects<z.ZodString, string, string>;
            endDate: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
            reason: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            startDate: string;
            substituteTeacherId: string;
            reason?: string | undefined;
            endDate?: string | undefined;
        }, {
            startDate: string;
            substituteTeacherId: string;
            reason?: string | undefined;
            endDate?: string | undefined;
        }>, {
            startDate: string;
            substituteTeacherId: string;
            reason?: string | undefined;
            endDate?: string | undefined;
        }, {
            startDate: string;
            substituteTeacherId: string;
            reason?: string | undefined;
            endDate?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            startDate: string;
            substituteTeacherId: string;
            reason?: string | undefined;
            endDate?: string | undefined;
        };
    }, {
        body: {
            startDate: string;
            substituteTeacherId: string;
            reason?: string | undefined;
            endDate?: string | undefined;
        };
    }>;
    bulkCreateScheduleValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            schedules: z.ZodArray<z.ZodObject<{
                schoolId: z.ZodString;
                classId: z.ZodOptional<z.ZodString>;
                grade: z.ZodNumber;
                section: z.ZodString;
                academicYear: z.ZodString;
                dayOfWeek: z.ZodEnum<["monday", "sunday", "tuesday", "wednesday", "thursday", "friday", "saturday"]>;
                periods: z.ZodArray<z.ZodEffects<z.ZodEffects<z.ZodObject<{
                    periodNumber: z.ZodNumber;
                    subjectId: z.ZodOptional<z.ZodString>;
                    teacherId: z.ZodOptional<z.ZodString>;
                    roomNumber: z.ZodOptional<z.ZodString>;
                    startTime: z.ZodString;
                    endTime: z.ZodString;
                    isBreak: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                    breakType: z.ZodOptional<z.ZodEnum<["short", "lunch", "long"]>>;
                    breakDuration: z.ZodOptional<z.ZodNumber>;
                }, "strip", z.ZodTypeAny, {
                    periodNumber: number;
                    startTime: string;
                    endTime: string;
                    isBreak: boolean;
                    teacherId?: string | undefined;
                    subjectId?: string | undefined;
                    roomNumber?: string | undefined;
                    breakType?: "long" | "short" | "lunch" | undefined;
                    breakDuration?: number | undefined;
                }, {
                    periodNumber: number;
                    startTime: string;
                    endTime: string;
                    teacherId?: string | undefined;
                    subjectId?: string | undefined;
                    roomNumber?: string | undefined;
                    isBreak?: boolean | undefined;
                    breakType?: "long" | "short" | "lunch" | undefined;
                    breakDuration?: number | undefined;
                }>, {
                    periodNumber: number;
                    startTime: string;
                    endTime: string;
                    isBreak: boolean;
                    teacherId?: string | undefined;
                    subjectId?: string | undefined;
                    roomNumber?: string | undefined;
                    breakType?: "long" | "short" | "lunch" | undefined;
                    breakDuration?: number | undefined;
                }, {
                    periodNumber: number;
                    startTime: string;
                    endTime: string;
                    teacherId?: string | undefined;
                    subjectId?: string | undefined;
                    roomNumber?: string | undefined;
                    isBreak?: boolean | undefined;
                    breakType?: "long" | "short" | "lunch" | undefined;
                    breakDuration?: number | undefined;
                }>, {
                    periodNumber: number;
                    startTime: string;
                    endTime: string;
                    isBreak: boolean;
                    teacherId?: string | undefined;
                    subjectId?: string | undefined;
                    roomNumber?: string | undefined;
                    breakType?: "long" | "short" | "lunch" | undefined;
                    breakDuration?: number | undefined;
                }, {
                    periodNumber: number;
                    startTime: string;
                    endTime: string;
                    teacherId?: string | undefined;
                    subjectId?: string | undefined;
                    roomNumber?: string | undefined;
                    isBreak?: boolean | undefined;
                    breakType?: "long" | "short" | "lunch" | undefined;
                    breakDuration?: number | undefined;
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                schoolId: string;
                grade: number;
                section: string;
                academicYear: string;
                dayOfWeek: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
                periods: {
                    periodNumber: number;
                    startTime: string;
                    endTime: string;
                    isBreak: boolean;
                    teacherId?: string | undefined;
                    subjectId?: string | undefined;
                    roomNumber?: string | undefined;
                    breakType?: "long" | "short" | "lunch" | undefined;
                    breakDuration?: number | undefined;
                }[];
                classId?: string | undefined;
            }, {
                schoolId: string;
                grade: number;
                section: string;
                academicYear: string;
                dayOfWeek: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
                periods: {
                    periodNumber: number;
                    startTime: string;
                    endTime: string;
                    teacherId?: string | undefined;
                    subjectId?: string | undefined;
                    roomNumber?: string | undefined;
                    isBreak?: boolean | undefined;
                    breakType?: "long" | "short" | "lunch" | undefined;
                    breakDuration?: number | undefined;
                }[];
                classId?: string | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            schedules: {
                schoolId: string;
                grade: number;
                section: string;
                academicYear: string;
                dayOfWeek: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
                periods: {
                    periodNumber: number;
                    startTime: string;
                    endTime: string;
                    isBreak: boolean;
                    teacherId?: string | undefined;
                    subjectId?: string | undefined;
                    roomNumber?: string | undefined;
                    breakType?: "long" | "short" | "lunch" | undefined;
                    breakDuration?: number | undefined;
                }[];
                classId?: string | undefined;
            }[];
        }, {
            schedules: {
                schoolId: string;
                grade: number;
                section: string;
                academicYear: string;
                dayOfWeek: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
                periods: {
                    periodNumber: number;
                    startTime: string;
                    endTime: string;
                    teacherId?: string | undefined;
                    subjectId?: string | undefined;
                    roomNumber?: string | undefined;
                    isBreak?: boolean | undefined;
                    breakType?: "long" | "short" | "lunch" | undefined;
                    breakDuration?: number | undefined;
                }[];
                classId?: string | undefined;
            }[];
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            schedules: {
                schoolId: string;
                grade: number;
                section: string;
                academicYear: string;
                dayOfWeek: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
                periods: {
                    periodNumber: number;
                    startTime: string;
                    endTime: string;
                    isBreak: boolean;
                    teacherId?: string | undefined;
                    subjectId?: string | undefined;
                    roomNumber?: string | undefined;
                    breakType?: "long" | "short" | "lunch" | undefined;
                    breakDuration?: number | undefined;
                }[];
                classId?: string | undefined;
            }[];
        };
    }, {
        body: {
            schedules: {
                schoolId: string;
                grade: number;
                section: string;
                academicYear: string;
                dayOfWeek: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
                periods: {
                    periodNumber: number;
                    startTime: string;
                    endTime: string;
                    teacherId?: string | undefined;
                    subjectId?: string | undefined;
                    roomNumber?: string | undefined;
                    isBreak?: boolean | undefined;
                    breakType?: "long" | "short" | "lunch" | undefined;
                    breakDuration?: number | undefined;
                }[];
                classId?: string | undefined;
            }[];
        };
    }>;
    getSchedulesByClassValidationSchema: z.ZodObject<{
        params: z.ZodObject<{
            schoolId: z.ZodString;
            grade: z.ZodString;
            section: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            schoolId: string;
            grade: string;
            section: string;
        }, {
            schoolId: string;
            grade: string;
            section: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        params: {
            schoolId: string;
            grade: string;
            section: string;
        };
    }, {
        params: {
            schoolId: string;
            grade: string;
            section: string;
        };
    }>;
    getWeeklyScheduleValidationSchema: z.ZodObject<{
        params: z.ZodObject<{
            schoolId: z.ZodString;
            grade: z.ZodString;
            section: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            schoolId: string;
            grade: string;
            section: string;
        }, {
            schoolId: string;
            grade: string;
            section: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        params: {
            schoolId: string;
            grade: string;
            section: string;
        };
    }, {
        params: {
            schoolId: string;
            grade: string;
            section: string;
        };
    }>;
    getTeacherScheduleValidationSchema: z.ZodObject<{
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
    getScheduleStatsValidationSchema: z.ZodObject<{
        params: z.ZodObject<{
            schoolId: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            schoolId: string;
        }, {
            schoolId: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        params: {
            schoolId: string;
        };
    }, {
        params: {
            schoolId: string;
        };
    }>;
    getSubjectSchedulesValidationSchema: z.ZodObject<{
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
//# sourceMappingURL=schedule.validation.d.ts.map