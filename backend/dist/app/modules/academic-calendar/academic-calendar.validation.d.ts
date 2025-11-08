import { z } from "zod";
export declare const AcademicCalendarValidation: {
    createAcademicCalendarValidationSchema: z.ZodObject<{
        body: z.ZodEffects<z.ZodEffects<z.ZodObject<{
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            eventType: z.ZodEnum<["holiday", "exam", "meeting", "event", "sports", "cultural", "parent-teacher", "other"]>;
            startDate: z.ZodEffects<z.ZodString, string, string>;
            endDate: z.ZodEffects<z.ZodString, string, string>;
            isAllDay: z.ZodBoolean;
            startTime: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
            endTime: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
            location: z.ZodOptional<z.ZodString>;
            organizerId: z.ZodString;
            schoolId: z.ZodString;
            targetAudience: z.ZodObject<{
                allSchool: z.ZodBoolean;
                grades: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                classes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                teachers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                students: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                parents: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            }, {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            }>;
            priority: z.ZodEnum<["low", "medium", "high"]>;
            status: z.ZodEnum<["draft", "published", "cancelled"]>;
            isRecurring: z.ZodBoolean;
            recurrence: z.ZodOptional<z.ZodObject<{
                frequency: z.ZodOptional<z.ZodEnum<["daily", "weekly", "monthly", "yearly"]>>;
                interval: z.ZodOptional<z.ZodNumber>;
                endDate: z.ZodOptional<z.ZodString>;
                occurrences: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            }, {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            }>>;
            attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
                fileName: z.ZodString;
                filePath: z.ZodString;
                fileSize: z.ZodNumber;
                mimeType: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }, {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }>, "many">>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            title: string;
            targetAudience: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            };
            priority: "low" | "medium" | "high";
            eventType: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher";
            isAllDay: boolean;
            isRecurring: boolean;
            organizerId: string;
            description?: string | undefined;
            metadata?: Record<string, any> | undefined;
            location?: string | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        }, {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            title: string;
            targetAudience: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            };
            priority: "low" | "medium" | "high";
            eventType: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher";
            isAllDay: boolean;
            isRecurring: boolean;
            organizerId: string;
            description?: string | undefined;
            metadata?: Record<string, any> | undefined;
            location?: string | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        }>, {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            title: string;
            targetAudience: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            };
            priority: "low" | "medium" | "high";
            eventType: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher";
            isAllDay: boolean;
            isRecurring: boolean;
            organizerId: string;
            description?: string | undefined;
            metadata?: Record<string, any> | undefined;
            location?: string | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        }, {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            title: string;
            targetAudience: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            };
            priority: "low" | "medium" | "high";
            eventType: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher";
            isAllDay: boolean;
            isRecurring: boolean;
            organizerId: string;
            description?: string | undefined;
            metadata?: Record<string, any> | undefined;
            location?: string | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        }>, {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            title: string;
            targetAudience: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            };
            priority: "low" | "medium" | "high";
            eventType: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher";
            isAllDay: boolean;
            isRecurring: boolean;
            organizerId: string;
            description?: string | undefined;
            metadata?: Record<string, any> | undefined;
            location?: string | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        }, {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            title: string;
            targetAudience: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            };
            priority: "low" | "medium" | "high";
            eventType: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher";
            isAllDay: boolean;
            isRecurring: boolean;
            organizerId: string;
            description?: string | undefined;
            metadata?: Record<string, any> | undefined;
            location?: string | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            title: string;
            targetAudience: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            };
            priority: "low" | "medium" | "high";
            eventType: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher";
            isAllDay: boolean;
            isRecurring: boolean;
            organizerId: string;
            description?: string | undefined;
            metadata?: Record<string, any> | undefined;
            location?: string | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        };
    }, {
        body: {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            title: string;
            targetAudience: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            };
            priority: "low" | "medium" | "high";
            eventType: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher";
            isAllDay: boolean;
            isRecurring: boolean;
            organizerId: string;
            description?: string | undefined;
            metadata?: Record<string, any> | undefined;
            location?: string | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        };
    }>;
    updateAcademicCalendarValidationSchema: z.ZodObject<{
        body: z.ZodEffects<z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            eventType: z.ZodOptional<z.ZodEnum<["holiday", "exam", "meeting", "event", "sports", "cultural", "parent-teacher", "other"]>>;
            startDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            endDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            isAllDay: z.ZodOptional<z.ZodBoolean>;
            startTime: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
            endTime: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
            location: z.ZodOptional<z.ZodString>;
            targetAudience: z.ZodOptional<z.ZodObject<{
                allSchool: z.ZodBoolean;
                grades: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                classes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                teachers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                students: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                parents: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            }, {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            }>>;
            priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
            status: z.ZodOptional<z.ZodEnum<["draft", "published", "cancelled"]>>;
            isRecurring: z.ZodOptional<z.ZodBoolean>;
            recurrence: z.ZodOptional<z.ZodObject<{
                frequency: z.ZodOptional<z.ZodEnum<["daily", "weekly", "monthly", "yearly"]>>;
                interval: z.ZodOptional<z.ZodNumber>;
                endDate: z.ZodOptional<z.ZodString>;
                occurrences: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            }, {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            }>>;
            attachments: z.ZodOptional<z.ZodArray<z.ZodObject<{
                fileName: z.ZodString;
                filePath: z.ZodString;
                fileSize: z.ZodNumber;
                mimeType: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }, {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }>, "many">>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        }, "strip", z.ZodTypeAny, {
            description?: string | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            status?: "draft" | "published" | "cancelled" | undefined;
            metadata?: Record<string, any> | undefined;
            title?: string | undefined;
            location?: string | undefined;
            targetAudience?: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            } | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            priority?: "low" | "medium" | "high" | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            eventType?: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher" | undefined;
            isAllDay?: boolean | undefined;
            isRecurring?: boolean | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        }, {
            description?: string | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            status?: "draft" | "published" | "cancelled" | undefined;
            metadata?: Record<string, any> | undefined;
            title?: string | undefined;
            location?: string | undefined;
            targetAudience?: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            } | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            priority?: "low" | "medium" | "high" | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            eventType?: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher" | undefined;
            isAllDay?: boolean | undefined;
            isRecurring?: boolean | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        }>, {
            description?: string | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            status?: "draft" | "published" | "cancelled" | undefined;
            metadata?: Record<string, any> | undefined;
            title?: string | undefined;
            location?: string | undefined;
            targetAudience?: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            } | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            priority?: "low" | "medium" | "high" | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            eventType?: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher" | undefined;
            isAllDay?: boolean | undefined;
            isRecurring?: boolean | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        }, {
            description?: string | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            status?: "draft" | "published" | "cancelled" | undefined;
            metadata?: Record<string, any> | undefined;
            title?: string | undefined;
            location?: string | undefined;
            targetAudience?: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            } | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            priority?: "low" | "medium" | "high" | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            eventType?: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher" | undefined;
            isAllDay?: boolean | undefined;
            isRecurring?: boolean | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            description?: string | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            status?: "draft" | "published" | "cancelled" | undefined;
            metadata?: Record<string, any> | undefined;
            title?: string | undefined;
            location?: string | undefined;
            targetAudience?: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            } | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            priority?: "low" | "medium" | "high" | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            eventType?: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher" | undefined;
            isAllDay?: boolean | undefined;
            isRecurring?: boolean | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        };
    }, {
        body: {
            description?: string | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            status?: "draft" | "published" | "cancelled" | undefined;
            metadata?: Record<string, any> | undefined;
            title?: string | undefined;
            location?: string | undefined;
            targetAudience?: {
                allSchool: boolean;
                grades?: string[] | undefined;
                students?: string[] | undefined;
                teachers?: string[] | undefined;
                parents?: string[] | undefined;
                classes?: string[] | undefined;
            } | undefined;
            startTime?: string | undefined;
            endTime?: string | undefined;
            priority?: "low" | "medium" | "high" | undefined;
            attachments?: {
                mimeType: string;
                fileSize: number;
                fileName: string;
                filePath: string;
            }[] | undefined;
            eventType?: "exam" | "holiday" | "meeting" | "event" | "other" | "sports" | "cultural" | "parent-teacher" | undefined;
            isAllDay?: boolean | undefined;
            isRecurring?: boolean | undefined;
            recurrence?: {
                endDate?: string | undefined;
                frequency?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
                interval?: number | undefined;
                occurrences?: number | undefined;
            } | undefined;
        };
    }>;
    createExamScheduleValidationSchema: z.ZodObject<{
        body: z.ZodEffects<z.ZodEffects<z.ZodObject<{
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            examType: z.ZodEnum<["midterm", "final", "unit", "monthly", "weekly", "quiz", "assignment", "practical", "oral", "other"]>;
            schoolId: z.ZodString;
            organizerId: z.ZodString;
            startDate: z.ZodEffects<z.ZodString, string, string>;
            endDate: z.ZodEffects<z.ZodString, string, string>;
            grades: z.ZodArray<z.ZodString, "many">;
            examSchedule: z.ZodArray<z.ZodObject<{
                subjectId: z.ZodString;
                subjectName: z.ZodString;
                date: z.ZodEffects<z.ZodString, string, string>;
                startTime: z.ZodEffects<z.ZodString, string, string>;
                endTime: z.ZodEffects<z.ZodString, string, string>;
                duration: z.ZodNumber;
                totalMarks: z.ZodNumber;
                room: z.ZodOptional<z.ZodString>;
                supervisor: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                date: string;
                duration: number;
                subjectId: string;
                totalMarks: number;
                startTime: string;
                endTime: string;
                subjectName: string;
                supervisor?: string | undefined;
                room?: string | undefined;
            }, {
                date: string;
                duration: number;
                subjectId: string;
                totalMarks: number;
                startTime: string;
                endTime: string;
                subjectName: string;
                supervisor?: string | undefined;
                room?: string | undefined;
            }>, "many">;
            instructions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            status: z.ZodEnum<["draft", "published", "cancelled"]>;
        }, "strip", z.ZodTypeAny, {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            grades: string[];
            title: string;
            examType: "assignment" | "other" | "weekly" | "monthly" | "final" | "quiz" | "midterm" | "unit" | "practical" | "oral";
            organizerId: string;
            examSchedule: {
                date: string;
                duration: number;
                subjectId: string;
                totalMarks: number;
                startTime: string;
                endTime: string;
                subjectName: string;
                supervisor?: string | undefined;
                room?: string | undefined;
            }[];
            description?: string | undefined;
            instructions?: string[] | undefined;
        }, {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            grades: string[];
            title: string;
            examType: "assignment" | "other" | "weekly" | "monthly" | "final" | "quiz" | "midterm" | "unit" | "practical" | "oral";
            organizerId: string;
            examSchedule: {
                date: string;
                duration: number;
                subjectId: string;
                totalMarks: number;
                startTime: string;
                endTime: string;
                subjectName: string;
                supervisor?: string | undefined;
                room?: string | undefined;
            }[];
            description?: string | undefined;
            instructions?: string[] | undefined;
        }>, {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            grades: string[];
            title: string;
            examType: "assignment" | "other" | "weekly" | "monthly" | "final" | "quiz" | "midterm" | "unit" | "practical" | "oral";
            organizerId: string;
            examSchedule: {
                date: string;
                duration: number;
                subjectId: string;
                totalMarks: number;
                startTime: string;
                endTime: string;
                subjectName: string;
                supervisor?: string | undefined;
                room?: string | undefined;
            }[];
            description?: string | undefined;
            instructions?: string[] | undefined;
        }, {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            grades: string[];
            title: string;
            examType: "assignment" | "other" | "weekly" | "monthly" | "final" | "quiz" | "midterm" | "unit" | "practical" | "oral";
            organizerId: string;
            examSchedule: {
                date: string;
                duration: number;
                subjectId: string;
                totalMarks: number;
                startTime: string;
                endTime: string;
                subjectName: string;
                supervisor?: string | undefined;
                room?: string | undefined;
            }[];
            description?: string | undefined;
            instructions?: string[] | undefined;
        }>, {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            grades: string[];
            title: string;
            examType: "assignment" | "other" | "weekly" | "monthly" | "final" | "quiz" | "midterm" | "unit" | "practical" | "oral";
            organizerId: string;
            examSchedule: {
                date: string;
                duration: number;
                subjectId: string;
                totalMarks: number;
                startTime: string;
                endTime: string;
                subjectName: string;
                supervisor?: string | undefined;
                room?: string | undefined;
            }[];
            description?: string | undefined;
            instructions?: string[] | undefined;
        }, {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            grades: string[];
            title: string;
            examType: "assignment" | "other" | "weekly" | "monthly" | "final" | "quiz" | "midterm" | "unit" | "practical" | "oral";
            organizerId: string;
            examSchedule: {
                date: string;
                duration: number;
                subjectId: string;
                totalMarks: number;
                startTime: string;
                endTime: string;
                subjectName: string;
                supervisor?: string | undefined;
                room?: string | undefined;
            }[];
            description?: string | undefined;
            instructions?: string[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            grades: string[];
            title: string;
            examType: "assignment" | "other" | "weekly" | "monthly" | "final" | "quiz" | "midterm" | "unit" | "practical" | "oral";
            organizerId: string;
            examSchedule: {
                date: string;
                duration: number;
                subjectId: string;
                totalMarks: number;
                startTime: string;
                endTime: string;
                subjectName: string;
                supervisor?: string | undefined;
                room?: string | undefined;
            }[];
            description?: string | undefined;
            instructions?: string[] | undefined;
        };
    }, {
        body: {
            schoolId: string;
            startDate: string;
            endDate: string;
            status: "draft" | "published" | "cancelled";
            grades: string[];
            title: string;
            examType: "assignment" | "other" | "weekly" | "monthly" | "final" | "quiz" | "midterm" | "unit" | "practical" | "oral";
            organizerId: string;
            examSchedule: {
                date: string;
                duration: number;
                subjectId: string;
                totalMarks: number;
                startTime: string;
                endTime: string;
                subjectName: string;
                supervisor?: string | undefined;
                room?: string | undefined;
            }[];
            description?: string | undefined;
            instructions?: string[] | undefined;
        };
    }>;
};
//# sourceMappingURL=academic-calendar.validation.d.ts.map