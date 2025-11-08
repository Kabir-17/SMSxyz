"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceReportValidationSchema = exports.markBulkAttendanceValidationSchema = exports.getAttendanceStatsValidationSchema = exports.getStudentAttendanceValidationSchema = exports.getClassAttendanceValidationSchema = exports.getAttendanceValidationSchema = exports.updateAttendanceValidationSchema = exports.createAttendanceValidationSchema = exports.autoAttendEventValidationSchema = void 0;
const zod_1 = require("zod");
const autoAttendEventValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        event: zod_1.z.object({
            eventId: zod_1.z
                .string({
                required_error: "Event ID is required",
            })
                .min(1, "Event ID cannot be empty"),
            descriptor: zod_1.z
                .string({
                required_error: "Descriptor is required",
            })
                .regex(/^student@[^@]+@\d+@\d+@[A-Z]+@[A-Z\+\-]+@[\w\-]+$/, "Descriptor must follow format: student@firstName@age@grade@section@bloodGroup@studentId"),
            studentId: zod_1.z
                .string({
                required_error: "Student ID is required",
            })
                .min(1, "Student ID cannot be empty"),
            firstName: zod_1.z
                .string({
                required_error: "First name is required",
            })
                .min(1, "First name cannot be empty"),
            age: zod_1.z.string({
                required_error: "Age is required",
            }),
            grade: zod_1.z.string({
                required_error: "Grade is required",
            }),
            section: zod_1.z
                .string({
                required_error: "Section is required",
            })
                .regex(/^[A-Z]+$/, "Section must be uppercase letters"),
            bloodGroup: zod_1.z.string({
                required_error: "Blood group is required",
            }),
            capturedAt: zod_1.z
                .string({
                required_error: "Captured timestamp is required",
            })
                .refine((val) => {
                const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
                return iso8601Regex.test(val) && !isNaN(Date.parse(val));
            }, "Captured timestamp must be a valid ISO-8601 datetime"),
            capturedDate: zod_1.z
                .string({
                required_error: "Captured date is required",
            })
                .regex(/^\d{4}-\d{2}-\d{2}$/, "Captured date must be in YYYY-MM-DD format"),
            capturedTime: zod_1.z
                .string({
                required_error: "Captured time is required",
            })
                .regex(/^\d{2}:\d{2}:\d{2}$/, "Captured time must be in HH:MM:SS format"),
        }),
        source: zod_1.z.object({
            app: zod_1.z
                .string({
                required_error: "Source app name is required",
            })
                .min(1, "Source app name cannot be empty"),
            version: zod_1.z
                .string({
                required_error: "Source app version is required",
            })
                .min(1, "Source app version cannot be empty"),
            deviceId: zod_1.z.string().optional(),
        }),
        test: zod_1.z.boolean().optional().default(false),
    }),
});
exports.autoAttendEventValidationSchema = autoAttendEventValidationSchema;
const createAttendanceValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        classId: zod_1.z
            .string({
            required_error: "Class ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid class ID format"),
        subjectId: zod_1.z
            .string({
            required_error: "Subject ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid subject ID format"),
        date: zod_1.z
            .string({
            required_error: "Date is required",
        })
            .datetime("Invalid date format")
            .refine((date) => {
            const attendanceDate = new Date(date);
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(23, 59, 59, 999);
            return attendanceDate <= tomorrow;
        }, "Cannot mark attendance for dates beyond tomorrow"),
        period: zod_1.z
            .number({
            required_error: "Period is required",
        })
            .int("Period must be an integer")
            .min(1, "Period must be at least 1")
            .max(8, "Period cannot exceed 8"),
        students: zod_1.z
            .array(zod_1.z.object({
            studentId: zod_1.z
                .string()
                .regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
            status: zod_1.z.enum(["present", "absent", "late", "excused"], {
                errorMap: () => ({
                    message: "Status must be present, absent, late, or excused",
                }),
            }),
        }))
            .min(1, "At least one student attendance record is required")
            .max(60, "Cannot mark attendance for more than 60 students at once"),
    }),
});
exports.createAttendanceValidationSchema = createAttendanceValidationSchema;
const updateAttendanceValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: "Attendance ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid attendance ID format"),
    }),
    body: zod_1.z.object({
        status: zod_1.z
            .enum(["present", "absent", "late", "excused"], {
            errorMap: () => ({
                message: "Status must be present, absent, late, or excused",
            }),
        })
            .optional(),
        modificationReason: zod_1.z
            .string()
            .max(200, "Modification reason cannot exceed 200 characters")
            .optional(),
    }),
});
exports.updateAttendanceValidationSchema = updateAttendanceValidationSchema;
const getAttendanceValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: "Attendance ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid attendance ID format"),
    }),
});
exports.getAttendanceValidationSchema = getAttendanceValidationSchema;
const getClassAttendanceValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        classId: zod_1.z
            .string({
            required_error: "Class ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid class ID format"),
        date: zod_1.z
            .string({
            required_error: "Date is required",
        })
            .datetime("Invalid date format"),
        period: zod_1.z
            .string()
            .regex(/^\d+$/, "Period must be a number")
            .transform((val) => parseInt(val))
            .refine((val) => val >= 1 && val <= 8, "Period must be between 1 and 8")
            .optional(),
    }),
});
exports.getClassAttendanceValidationSchema = getClassAttendanceValidationSchema;
const getStudentAttendanceValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z
            .string({
            required_error: "Student ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
    }),
    query: zod_1.z
        .object({
        startDate: zod_1.z
            .string({
            required_error: "Start date is required",
        })
            .datetime("Invalid start date format"),
        endDate: zod_1.z
            .string({
            required_error: "End date is required",
        })
            .datetime("Invalid end date format"),
        subjectId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid subject ID format")
            .optional(),
    })
        .refine((data) => {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end >= start;
    }, {
        message: "End date must be after start date",
        path: ["endDate"],
    }),
});
exports.getStudentAttendanceValidationSchema = getStudentAttendanceValidationSchema;
const getAttendanceStatsValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: "School ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid school ID format"),
    }),
    query: zod_1.z
        .object({
        startDate: zod_1.z
            .string({
            required_error: "Start date is required",
        })
            .datetime("Invalid start date format"),
        endDate: zod_1.z
            .string({
            required_error: "End date is required",
        })
            .datetime("Invalid end date format"),
        grade: zod_1.z
            .string()
            .regex(/^\d+$/, "Grade must be a number")
            .transform((val) => parseInt(val))
            .refine((val) => val >= 1 && val <= 12, "Grade must be between 1 and 12")
            .optional(),
        section: zod_1.z
            .string()
            .regex(/^[A-Z]$/, "Section must be a single uppercase letter")
            .optional(),
    })
        .refine((data) => {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        const maxDays = 365;
        const daysDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        return end >= start && daysDiff <= maxDays;
    }, {
        message: "Date range cannot exceed 365 days and end date must be after start date",
        path: ["endDate"],
    }),
});
exports.getAttendanceStatsValidationSchema = getAttendanceStatsValidationSchema;
const markBulkAttendanceValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        classId: zod_1.z
            .string({
            required_error: "Class ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid class ID format"),
        subjectId: zod_1.z
            .string({
            required_error: "Subject ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid subject ID format"),
        date: zod_1.z
            .string({
            required_error: "Date is required",
        })
            .datetime("Invalid date format"),
        periods: zod_1.z
            .array(zod_1.z.object({
            period: zod_1.z
                .number()
                .int("Period must be an integer")
                .min(1, "Period must be at least 1")
                .max(8, "Period cannot exceed 8"),
            students: zod_1.z
                .array(zod_1.z.object({
                studentId: zod_1.z
                    .string()
                    .regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
                status: zod_1.z.enum(["present", "absent", "late", "excused"]),
            }))
                .min(1, "At least one student attendance record is required"),
        }))
            .min(1, "At least one period is required")
            .max(8, "Cannot mark attendance for more than 8 periods"),
    }),
});
exports.markBulkAttendanceValidationSchema = markBulkAttendanceValidationSchema;
const getAttendanceReportValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: "School ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid school ID format"),
    }),
    query: zod_1.z.object({
        startDate: zod_1.z
            .string({
            required_error: "Start date is required",
        })
            .datetime("Invalid start date format"),
        endDate: zod_1.z
            .string({
            required_error: "End date is required",
        })
            .datetime("Invalid end date format"),
        grade: zod_1.z
            .string()
            .regex(/^\d+$/, "Grade must be a number")
            .transform((val) => parseInt(val))
            .refine((val) => val >= 1 && val <= 12, "Grade must be between 1 and 12")
            .optional(),
        section: zod_1.z
            .string()
            .regex(/^[A-Z]$/, "Section must be a single uppercase letter")
            .optional(),
        studentId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format")
            .optional(),
        format: zod_1.z
            .enum(["json", "csv", "pdf"], {
            errorMap: () => ({ message: "Format must be json, csv, or pdf" }),
        })
            .optional()
            .default("json"),
        minAttendance: zod_1.z
            .string()
            .regex(/^\d+$/, "Minimum attendance must be a number")
            .transform((val) => parseInt(val))
            .refine((val) => val >= 0 && val <= 100, "Minimum attendance must be between 0 and 100")
            .optional(),
    }),
});
exports.getAttendanceReportValidationSchema = getAttendanceReportValidationSchema;
//# sourceMappingURL=attendance.validation.js.map