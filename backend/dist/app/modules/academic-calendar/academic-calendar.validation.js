"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicCalendarValidation = void 0;
const zod_1 = require("zod");
const createAcademicCalendarValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z
            .string()
            .min(1, "Title is required")
            .max(200, "Title must be less than 200 characters"),
        description: zod_1.z.string().optional(),
        eventType: zod_1.z.enum([
            "holiday",
            "exam",
            "meeting",
            "event",
            "sports",
            "cultural",
            "parent-teacher",
            "other",
        ], {
            required_error: "Event type is required",
        }),
        startDate: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Start date must be a valid date",
        }),
        endDate: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "End date must be a valid date",
        }),
        isAllDay: zod_1.z.boolean(),
        startTime: zod_1.z
            .string()
            .optional()
            .refine((time) => {
            if (!time)
                return true;
            return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
        }, {
            message: "Start time must be in HH:MM format",
        }),
        endTime: zod_1.z
            .string()
            .optional()
            .refine((time) => {
            if (!time)
                return true;
            return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
        }, {
            message: "End time must be in HH:MM format",
        }),
        location: zod_1.z.string().optional(),
        organizerId: zod_1.z.string().min(1, "Organizer ID is required"),
        schoolId: zod_1.z.string().min(1, "School ID is required"),
        targetAudience: zod_1.z.object({
            allSchool: zod_1.z.boolean(),
            grades: zod_1.z.array(zod_1.z.string()).optional(),
            classes: zod_1.z.array(zod_1.z.string()).optional(),
            teachers: zod_1.z.array(zod_1.z.string()).optional(),
            students: zod_1.z.array(zod_1.z.string()).optional(),
            parents: zod_1.z.array(zod_1.z.string()).optional(),
        }),
        priority: zod_1.z.enum(["low", "medium", "high"]),
        status: zod_1.z.enum(["draft", "published", "cancelled"]),
        isRecurring: zod_1.z.boolean(),
        recurrence: zod_1.z
            .object({
            frequency: zod_1.z
                .enum(["daily", "weekly", "monthly", "yearly"])
                .optional(),
            interval: zod_1.z.number().min(1).optional(),
            endDate: zod_1.z.string().optional(),
            occurrences: zod_1.z.number().min(1).optional(),
        })
            .optional(),
        attachments: zod_1.z
            .array(zod_1.z.object({
            fileName: zod_1.z.string(),
            filePath: zod_1.z.string(),
            fileSize: zod_1.z.number(),
            mimeType: zod_1.z.string(),
        }))
            .optional(),
        metadata: zod_1.z.record(zod_1.z.any()).optional(),
    })
        .refine((data) => {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return startDate <= endDate;
    }, {
        message: "End date must be after or equal to start date",
        path: ["endDate"],
    })
        .refine((data) => {
        if (!data.isAllDay && (!data.startTime || !data.endTime)) {
            return false;
        }
        return true;
    }, {
        message: "Start time and end time are required when event is not all day",
        path: ["startTime"],
    }),
});
const updateAcademicCalendarValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(1).max(200).optional(),
        description: zod_1.z.string().optional(),
        eventType: zod_1.z
            .enum([
            "holiday",
            "exam",
            "meeting",
            "event",
            "sports",
            "cultural",
            "parent-teacher",
            "other",
        ])
            .optional(),
        startDate: zod_1.z
            .string()
            .refine((date) => !isNaN(Date.parse(date)), {
            message: "Start date must be a valid date",
        })
            .optional(),
        endDate: zod_1.z
            .string()
            .refine((date) => !isNaN(Date.parse(date)), {
            message: "End date must be a valid date",
        })
            .optional(),
        isAllDay: zod_1.z.boolean().optional(),
        startTime: zod_1.z
            .string()
            .optional()
            .refine((time) => {
            if (!time)
                return true;
            return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
        }, {
            message: "Start time must be in HH:MM format",
        }),
        endTime: zod_1.z
            .string()
            .optional()
            .refine((time) => {
            if (!time)
                return true;
            return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
        }, {
            message: "End time must be in HH:MM format",
        }),
        location: zod_1.z.string().optional(),
        targetAudience: zod_1.z
            .object({
            allSchool: zod_1.z.boolean(),
            grades: zod_1.z.array(zod_1.z.string()).optional(),
            classes: zod_1.z.array(zod_1.z.string()).optional(),
            teachers: zod_1.z.array(zod_1.z.string()).optional(),
            students: zod_1.z.array(zod_1.z.string()).optional(),
            parents: zod_1.z.array(zod_1.z.string()).optional(),
        })
            .optional(),
        priority: zod_1.z.enum(["low", "medium", "high"]).optional(),
        status: zod_1.z.enum(["draft", "published", "cancelled"]).optional(),
        isRecurring: zod_1.z.boolean().optional(),
        recurrence: zod_1.z
            .object({
            frequency: zod_1.z
                .enum(["daily", "weekly", "monthly", "yearly"])
                .optional(),
            interval: zod_1.z.number().min(1).optional(),
            endDate: zod_1.z.string().optional(),
            occurrences: zod_1.z.number().min(1).optional(),
        })
            .optional(),
        attachments: zod_1.z
            .array(zod_1.z.object({
            fileName: zod_1.z.string(),
            filePath: zod_1.z.string(),
            fileSize: zod_1.z.number(),
            mimeType: zod_1.z.string(),
        }))
            .optional(),
        metadata: zod_1.z.record(zod_1.z.any()).optional(),
    })
        .refine((data) => {
        if (data.startDate && data.endDate) {
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);
            return startDate <= endDate;
        }
        return true;
    }, {
        message: "End date must be after or equal to start date",
        path: ["endDate"],
    }),
});
const createExamScheduleValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(1, "Exam title is required").max(200),
        description: zod_1.z.string().optional(),
        examType: zod_1.z.enum([
            "midterm",
            "final",
            "unit",
            "monthly",
            "weekly",
            "quiz",
            "assignment",
            "practical",
            "oral",
            "other",
        ], {
            required_error: "Exam type is required",
        }),
        schoolId: zod_1.z.string().min(1, "School ID is required"),
        organizerId: zod_1.z.string().min(1, "Organizer ID is required"),
        startDate: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Start date must be a valid date",
        }),
        endDate: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "End date must be a valid date",
        }),
        grades: zod_1.z.array(zod_1.z.string()).min(1, "At least one grade must be selected"),
        examSchedule: zod_1.z
            .array(zod_1.z.object({
            subjectId: zod_1.z.string().min(1, "Subject ID is required"),
            subjectName: zod_1.z.string().min(1, "Subject name is required"),
            date: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
                message: "Exam date must be a valid date",
            }),
            startTime: zod_1.z.string().refine((time) => {
                return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
            }, {
                message: "Start time must be in HH:MM format",
            }),
            endTime: zod_1.z.string().refine((time) => {
                return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
            }, {
                message: "End time must be in HH:MM format",
            }),
            duration: zod_1.z
                .number()
                .min(15, "Exam duration must be at least 15 minutes"),
            totalMarks: zod_1.z.number().min(1, "Total marks must be at least 1"),
            room: zod_1.z.string().optional(),
            supervisor: zod_1.z.string().optional(),
        }))
            .min(1, "At least one exam must be scheduled"),
        instructions: zod_1.z.array(zod_1.z.string()).optional(),
        status: zod_1.z.enum(["draft", "published", "cancelled"]),
    })
        .refine((data) => {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return startDate <= endDate;
    }, {
        message: "End date must be after or equal to start date",
        path: ["endDate"],
    })
        .refine((data) => {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return data.examSchedule.every((exam) => {
            const examDate = new Date(exam.date);
            return examDate >= startDate && examDate <= endDate;
        });
    }, {
        message: "All exam dates must be within the exam period",
        path: ["examSchedule"],
    }),
});
exports.AcademicCalendarValidation = {
    createAcademicCalendarValidationSchema,
    updateAcademicCalendarValidationSchema,
    createExamScheduleValidationSchema,
};
//# sourceMappingURL=academic-calendar.validation.js.map