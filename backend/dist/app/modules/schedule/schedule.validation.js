"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleValidation = void 0;
const zod_1 = require("zod");
const createSchedulePeriodSchema = zod_1.z
    .object({
    periodNumber: zod_1.z
        .number()
        .min(1, "Period number must be at least 1")
        .max(10, "Period number cannot exceed 10"),
    subjectId: zod_1.z.string().optional(),
    teacherId: zod_1.z.string().optional(),
    roomNumber: zod_1.z
        .string()
        .max(10, "Room number cannot exceed 10 characters")
        .optional(),
    startTime: zod_1.z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Start time must be in HH:MM format"),
    endTime: zod_1.z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "End time must be in HH:MM format"),
    isBreak: zod_1.z.boolean().optional().default(false),
    breakType: zod_1.z.enum(["short", "lunch", "long"]).optional(),
    breakDuration: zod_1.z
        .number()
        .min(5, "Break duration must be at least 5 minutes")
        .max(60, "Break duration cannot exceed 60 minutes")
        .optional(),
})
    .refine((data) => {
    if (!data.isBreak) {
        return data.subjectId && data.teacherId;
    }
    if (data.isBreak) {
        return data.breakType && data.breakDuration;
    }
    return true;
}, {
    message: "For class periods, subjectId and teacherId are required. For breaks, breakType and breakDuration are required",
})
    .refine((data) => {
    const startTime = new Date(`2024-01-01T${data.startTime}:00`);
    const endTime = new Date(`2024-01-01T${data.endTime}:00`);
    return startTime < endTime;
}, {
    message: "End time must be after start time",
    path: ["endTime"],
});
const createScheduleValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        schoolId: zod_1.z.string().min(1, "School ID is required"),
        classId: zod_1.z.string().optional(),
        grade: zod_1.z
            .number()
            .min(1, "Grade must be at least 1")
            .max(12, "Grade cannot exceed 12"),
        section: zod_1.z
            .string()
            .min(1, "Section is required")
            .max(1, "Section must be a single character")
            .regex(/^[A-Z]$/, "Section must be an uppercase letter"),
        academicYear: zod_1.z
            .string()
            .regex(/^\d{4}-\d{4}$/, "Academic year must be in YYYY-YYYY format"),
        dayOfWeek: zod_1.z.enum([
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ], {
            required_error: "Day of week is required",
        }),
        periods: zod_1.z
            .array(createSchedulePeriodSchema)
            .min(1, "At least one period is required")
            .refine((periods) => {
            const periodNumbers = periods.map((p) => p.periodNumber);
            return new Set(periodNumbers).size === periodNumbers.length;
        }, {
            message: "Duplicate period numbers are not allowed",
        }),
    }),
});
const updateScheduleValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, "Schedule ID is required"),
    }),
    body: zod_1.z.object({
        periods: zod_1.z
            .array(createSchedulePeriodSchema)
            .optional()
            .refine((periods) => {
            if (!periods)
                return true;
            const periodNumbers = periods.map((p) => p.periodNumber);
            return new Set(periodNumbers).size === periodNumbers.length;
        }, {
            message: "Duplicate period numbers are not allowed",
        }),
        isActive: zod_1.z.boolean().optional(),
    }),
});
const assignSubstituteTeacherValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        substituteTeacherId: zod_1.z
            .string()
            .min(1, "Substitute teacher ID is required"),
        startDate: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Start date must be a valid date",
        }),
        endDate: zod_1.z
            .string()
            .optional()
            .refine((date) => {
            if (!date)
                return true;
            return !isNaN(Date.parse(date));
        }, {
            message: "End date must be a valid date",
        }),
        reason: zod_1.z
            .string()
            .max(500, "Reason cannot exceed 500 characters")
            .optional(),
    })
        .refine((data) => {
        if (data.endDate) {
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
const bulkCreateScheduleValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        schedules: zod_1.z
            .array(zod_1.z.object({
            schoolId: zod_1.z.string().min(1, "School ID is required"),
            classId: zod_1.z.string().optional(),
            grade: zod_1.z
                .number()
                .min(1, "Grade must be at least 1")
                .max(12, "Grade cannot exceed 12"),
            section: zod_1.z
                .string()
                .min(1, "Section is required")
                .max(1, "Section must be a single character")
                .regex(/^[A-Z]$/, "Section must be an uppercase letter"),
            academicYear: zod_1.z
                .string()
                .regex(/^\d{4}-\d{4}$/, "Academic year must be in YYYY-YYYY format"),
            dayOfWeek: zod_1.z.enum([
                "monday",
                "sunday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
            ]),
            periods: zod_1.z
                .array(createSchedulePeriodSchema)
                .min(1, "At least one period is required"),
        }))
            .min(1, "At least one schedule is required"),
    }),
});
const getSchedulesByClassValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z.string().min(1, "School ID is required"),
        grade: zod_1.z.string().regex(/^\d+$/, "Grade must be a number"),
        section: zod_1.z
            .string()
            .min(1, "Section is required")
            .max(1, "Section must be a single character"),
    }),
});
const getWeeklyScheduleValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z.string().min(1, "School ID is required"),
        grade: zod_1.z.string().regex(/^\d+$/, "Grade must be a number"),
        section: zod_1.z
            .string()
            .min(1, "Section is required")
            .max(1, "Section must be a single character"),
    }),
});
const getTeacherScheduleValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        teacherId: zod_1.z.string().min(1, "Teacher ID is required"),
    }),
});
const getScheduleStatsValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z.string().min(1, "School ID is required"),
    }),
});
const getSubjectSchedulesValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        subjectId: zod_1.z.string().min(1, "Subject ID is required"),
    }),
});
exports.ScheduleValidation = {
    createScheduleValidationSchema,
    updateScheduleValidationSchema,
    assignSubstituteTeacherValidationSchema,
    bulkCreateScheduleValidationSchema,
    getSchedulesByClassValidationSchema,
    getWeeklyScheduleValidationSchema,
    getTeacherScheduleValidationSchema,
    getScheduleStatsValidationSchema,
    getSubjectSchedulesValidationSchema,
};
//# sourceMappingURL=schedule.validation.js.map