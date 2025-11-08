"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentAssessmentQuerySchema = exports.categoryUpdateSchema = exports.categoryCreateSchema = exports.adminUpdateAssessmentPreferenceSchema = exports.adminExportAssessmentsSchema = exports.adminClassAssessmentsQuerySchema = exports.exportAllTeacherAssessmentsSchema = exports.exportAssessmentSchema = exports.teacherPerformanceQuerySchema = exports.teacherAssessmentsQuerySchema = exports.submitResultsSchema = exports.updateAssessmentSchema = exports.createAssessmentSchema = void 0;
const zod_1 = require("zod");
const objectId = zod_1.z
    .string({ required_error: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid identifier");
const sectionSchema = zod_1.z
    .string({ required_error: "Section is required" })
    .regex(/^[A-Z]$/, "Section must be a single uppercase letter");
exports.createAssessmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        subjectId: zod_1.z.string({ required_error: "Subject identifier is required" }).min(1),
        subjectName: zod_1.z.string().max(100).optional(),
        grade: zod_1.z.number().int().min(1).max(12),
        section: sectionSchema,
        examName: zod_1.z
            .string({ required_error: "Exam name is required" })
            .min(1)
            .max(150),
        examDate: zod_1.z
            .string({ required_error: "Exam date is required" })
            .refine((value) => !Number.isNaN(Date.parse(value)), {
            message: "Invalid exam date",
        }),
        totalMarks: zod_1.z
            .number({ required_error: "Total marks is required" })
            .positive()
            .max(1000),
        note: zod_1.z.string().max(1000).optional(),
        categoryId: objectId.optional(),
        categoryLabel: zod_1.z.string().max(100).optional(),
        academicYear: zod_1.z.string().regex(/^\d{4}-\d{4}$/).optional(),
    }),
});
exports.updateAssessmentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectId,
    }),
    body: zod_1.z
        .object({
        examName: zod_1.z.string().min(1).max(150).optional(),
        examDate: zod_1.z
            .string()
            .refine((value) => !Number.isNaN(Date.parse(value)), {
            message: "Invalid exam date",
        })
            .optional(),
        totalMarks: zod_1.z.number().positive().max(1000).optional(),
        note: zod_1.z.string().max(1000).optional(),
        categoryId: objectId.nullable().optional(),
        categoryLabel: zod_1.z.string().max(100).nullable().optional(),
        academicYear: zod_1.z.string().regex(/^\d{4}-\d{4}$/).optional(),
    })
        .refine((data) => Object.keys(data).length > 0, "At least one field must be provided"),
});
exports.submitResultsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectId,
    }),
    body: zod_1.z.object({
        results: zod_1.z
            .array(zod_1.z.object({
            studentId: objectId,
            marksObtained: zod_1.z.number().min(0),
            remarks: zod_1.z.string().max(500).optional(),
        }))
            .min(1, "At least one result is required"),
        publish: zod_1.z.boolean().optional(),
    }),
});
exports.teacherAssessmentsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        subjectId: zod_1.z.string().min(1).optional(),
        grade: zod_1.z
            .string()
            .regex(/^\d+$/)
            .transform((value) => Number.parseInt(value, 10))
            .optional(),
        section: sectionSchema.optional(),
        includeStats: zod_1.z
            .string()
            .transform((value) => value === "true")
            .optional(),
    }),
});
exports.teacherPerformanceQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        subjectId: zod_1.z.string().min(1),
        grade: zod_1.z
            .string()
            .regex(/^\d+$/)
            .transform((value) => Number.parseInt(value, 10)),
        section: sectionSchema,
    }),
});
exports.exportAssessmentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectId,
    }),
    query: zod_1.z.object({
        format: zod_1.z.enum(["csv", "xlsx"]).default("csv"),
    }),
});
exports.exportAllTeacherAssessmentsSchema = zod_1.z.object({
    query: zod_1.z.object({
        subjectId: zod_1.z.string().min(1).optional(),
        grade: zod_1.z
            .string()
            .regex(/^\d+$/)
            .transform((value) => Number.parseInt(value, 10))
            .optional(),
        section: sectionSchema.optional(),
        format: zod_1.z.enum(["csv", "xlsx"]).default("csv"),
    }),
});
exports.adminClassAssessmentsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        schoolId: objectId.optional(),
        grade: zod_1.z
            .string()
            .regex(/^\d+$/)
            .transform((value) => Number.parseInt(value, 10))
            .optional(),
        section: sectionSchema.optional(),
        subjectId: zod_1.z.string().min(1).optional(),
        search: zod_1.z.string().trim().min(1).optional(),
        includeStats: zod_1.z
            .union([zod_1.z.boolean(), zod_1.z.enum(["true", "false"])])
            .transform((value) => typeof value === "boolean" ? value : value === "true")
            .optional(),
        includeHidden: zod_1.z
            .union([zod_1.z.boolean(), zod_1.z.enum(["true", "false"])])
            .transform((value) => typeof value === "boolean" ? value : value === "true")
            .optional(),
        onlyFavorites: zod_1.z
            .union([zod_1.z.boolean(), zod_1.z.enum(["true", "false"])])
            .transform((value) => typeof value === "boolean" ? value : value === "true")
            .optional(),
        categoryId: zod_1.z.string().min(1).optional(),
        teacherId: zod_1.z.string().min(1).optional(),
        sortBy: zod_1.z
            .enum(["examDate", "averagePercentage", "totalMarks", "gradedCount", "examName"])
            .optional(),
        sortDirection: zod_1.z.enum(["asc", "desc"]).optional(),
        fromDate: zod_1.z
            .union([
            zod_1.z.date(),
            zod_1.z
                .string()
                .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date")
                .transform((value) => new Date(value)),
        ])
            .optional(),
        toDate: zod_1.z
            .union([
            zod_1.z.date(),
            zod_1.z
                .string()
                .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date")
                .transform((value) => new Date(value)),
        ])
            .optional(),
    }),
});
exports.adminExportAssessmentsSchema = zod_1.z.object({
    query: exports.adminClassAssessmentsQuerySchema.shape.query.extend({
        format: zod_1.z.enum(["csv", "xlsx"]).default("csv"),
        assessmentIds: zod_1.z
            .union([
            zod_1.z.array(objectId),
            zod_1.z
                .string()
                .min(1)
                .transform((value) => value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .map((item) => objectId.parse(item))),
        ])
            .optional(),
    }),
});
exports.adminUpdateAssessmentPreferenceSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectId,
    }),
    body: zod_1.z
        .object({
        isFavorite: zod_1.z.boolean().optional(),
        isHidden: zod_1.z.boolean().optional(),
    })
        .refine((data) => data.isFavorite !== undefined || data.isHidden !== undefined, "Provide at least one flag to update"),
});
exports.categoryCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).max(80),
        description: zod_1.z.string().max(200).optional(),
        order: zod_1.z.number().int().min(0).optional(),
        isDefault: zod_1.z.boolean().optional(),
    }),
});
exports.categoryUpdateSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectId,
    }),
    body: zod_1.z
        .object({
        name: zod_1.z.string().min(2).max(80).optional(),
        description: zod_1.z.string().max(200).optional(),
        order: zod_1.z.number().int().min(0).optional(),
        isActive: zod_1.z.boolean().optional(),
        isDefault: zod_1.z.boolean().optional(),
    })
        .refine((data) => Object.keys(data).length > 0, "At least one field must be provided"),
});
exports.studentAssessmentQuerySchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: objectId.optional(),
    }),
});
//# sourceMappingURL=assessment.validation.js.map