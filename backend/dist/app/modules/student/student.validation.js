"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentStatsValidationSchema = exports.getStudentsByGradeAndSectionSchema = exports.deletePhotoValidationSchema = exports.uploadPhotosValidationSchema = exports.getStudentsValidationSchema = exports.deleteStudentValidationSchema = exports.getStudentValidationSchema = exports.updateStudentValidationSchema = exports.createStudentValidationSchema = void 0;
const zod_1 = require("zod");
const createStudentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: "School ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid school ID format"),
        firstName: zod_1.z
            .string({
            required_error: "First name is required",
        })
            .min(1, "First name is required")
            .max(50, "First name cannot exceed 50 characters")
            .trim(),
        lastName: zod_1.z
            .string({
            required_error: "Last name is required",
        })
            .min(1, "Last name is required")
            .max(50, "Last name cannot exceed 50 characters")
            .trim(),
        email: zod_1.z.string().email("Invalid email format").toLowerCase().optional(),
        phone: zod_1.z
            .string()
            .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
            .optional(),
        grade: zod_1.z
            .string({
            required_error: "Grade is required",
        })
            .transform((val) => parseInt(val, 10))
            .refine((val) => !isNaN(val), "Grade must be a valid number")
            .refine((val) => val >= 1 && val <= 12, "Grade must be between 1 and 12"),
        section: zod_1.z
            .string()
            .default("A")
            .refine((val) => /^[A-Z]$/.test(val), "Section must be a single uppercase letter")
            .transform((val) => val.toUpperCase()),
        bloodGroup: zod_1.z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
            errorMap: () => ({ message: "Invalid blood group" }),
        }),
        dob: zod_1.z
            .string({
            required_error: "Date of birth is required",
        })
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
            .refine((date) => {
            const dob = new Date(date);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            return age >= 3 && age <= 25;
        }, "Student age must be between 3 and 25 years"),
        admissionDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Admission date must be in YYYY-MM-DD format")
            .optional(),
        admissionYear: zod_1.z.number().optional(),
        studentId: zod_1.z.string().optional(),
        rollNumber: zod_1.z
            .number()
            .int("Roll number must be an integer")
            .min(1, "Roll number must be at least 1")
            .max(60, "Roll number cannot exceed 60")
            .optional(),
        address: zod_1.z
            .object({
            street: zod_1.z
                .string()
                .max(100, "Street address cannot exceed 100 characters")
                .trim()
                .optional(),
            city: zod_1.z
                .string()
                .max(50, "City cannot exceed 50 characters")
                .trim()
                .optional(),
            state: zod_1.z
                .string()
                .max(50, "State cannot exceed 50 characters")
                .trim()
                .optional(),
            country: zod_1.z
                .string()
                .max(50, "Country cannot exceed 50 characters")
                .trim()
                .optional(),
            postalCode: zod_1.z
                .string()
                .max(20, "Postal code cannot exceed 20 characters")
                .trim()
                .optional(),
        })
            .optional(),
        parentInfo: zod_1.z.object({
            name: zod_1.z
                .string()
                .min(1, "Parent name is required")
                .max(100, "Parent name cannot exceed 100 characters")
                .trim(),
            email: zod_1.z
                .string()
                .email("Invalid parent email format")
                .toLowerCase()
                .optional(),
            phone: zod_1.z
                .string()
                .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid parent phone number format")
                .optional(),
            address: zod_1.z
                .string()
                .max(200, "Address cannot exceed 200 characters")
                .trim()
                .optional(),
            occupation: zod_1.z
                .string()
                .max(100, "Occupation cannot exceed 100 characters")
                .trim()
                .optional(),
        }),
    }),
});
exports.createStudentValidationSchema = createStudentValidationSchema;
const updateStudentValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: "Student ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
    }),
    body: zod_1.z.object({
        grade: zod_1.z
            .number()
            .int("Grade must be an integer")
            .min(1, "Grade must be at least 1")
            .max(12, "Grade cannot exceed 12")
            .optional(),
        section: zod_1.z
            .string()
            .regex(/^[A-Z]$/, "Section must be a single uppercase letter")
            .transform((val) => val.toUpperCase())
            .optional(),
        bloodGroup: zod_1.z
            .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
            errorMap: () => ({ message: "Invalid blood group" }),
        })
            .optional(),
        dob: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
            .refine((date) => {
            const dob = new Date(date);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            return age >= 3 && age <= 25;
        }, "Student age must be between 3 and 25 years")
            .optional(),
        rollNumber: zod_1.z
            .number()
            .int("Roll number must be an integer")
            .min(1, "Roll number must be at least 1")
            .max(60, "Roll number cannot exceed 60")
            .optional(),
        isActive: zod_1.z.boolean().optional(),
        address: zod_1.z
            .object({
            street: zod_1.z
                .string()
                .max(100, "Street address cannot exceed 100 characters")
                .trim()
                .optional(),
            city: zod_1.z
                .string()
                .max(50, "City cannot exceed 50 characters")
                .trim()
                .optional(),
            state: zod_1.z
                .string()
                .max(50, "State cannot exceed 50 characters")
                .trim()
                .optional(),
            country: zod_1.z
                .string()
                .max(50, "Country cannot exceed 50 characters")
                .trim()
                .optional(),
            postalCode: zod_1.z
                .string()
                .max(20, "Postal code cannot exceed 20 characters")
                .trim()
                .optional(),
        })
            .optional(),
        parentInfo: zod_1.z
            .object({
            name: zod_1.z
                .string()
                .min(1, "Parent name is required")
                .max(100, "Parent name cannot exceed 100 characters")
                .trim()
                .optional(),
            email: zod_1.z
                .string()
                .email("Invalid parent email format")
                .toLowerCase()
                .optional(),
            phone: zod_1.z
                .string()
                .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid parent phone number format")
                .optional(),
            address: zod_1.z
                .string()
                .max(200, "Address cannot exceed 200 characters")
                .trim()
                .optional(),
            occupation: zod_1.z
                .string()
                .max(100, "Occupation cannot exceed 100 characters")
                .trim()
                .optional(),
        })
            .optional(),
    }),
});
exports.updateStudentValidationSchema = updateStudentValidationSchema;
const getStudentValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: "Student ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
    }),
});
exports.getStudentValidationSchema = getStudentValidationSchema;
const deleteStudentValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: "Student ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
    }),
});
exports.deleteStudentValidationSchema = deleteStudentValidationSchema;
const getStudentsValidationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z
            .string()
            .regex(/^\d+$/, "Page must be a positive number")
            .transform((val) => parseInt(val))
            .refine((val) => val > 0, "Page must be greater than 0")
            .optional()
            .default("1"),
        limit: zod_1.z
            .string()
            .regex(/^\d+$/, "Limit must be a positive number")
            .transform((val) => parseInt(val))
            .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100")
            .optional()
            .default("20"),
        schoolId: zod_1.z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid school ID format")
            .optional(),
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
        isActive: zod_1.z
            .enum(["true", "false", "all"], {
            errorMap: () => ({ message: "isActive must be true, false, or all" }),
        })
            .optional(),
        search: zod_1.z
            .string()
            .min(1, "Search term must be at least 1 character")
            .max(50, "Search term cannot exceed 50 characters")
            .optional(),
        sortBy: zod_1.z
            .enum([
            "firstName",
            "lastName",
            "studentId",
            "grade",
            "section",
            "admissionDate",
            "rollNumber",
        ], {
            errorMap: () => ({ message: "Invalid sort field" }),
        })
            .optional()
            .default("grade"),
        sortOrder: zod_1.z
            .enum(["asc", "desc"], {
            errorMap: () => ({ message: "Sort order must be asc or desc" }),
        })
            .optional()
            .default("asc"),
    }),
});
exports.getStudentsValidationSchema = getStudentsValidationSchema;
const uploadPhotosValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: "Student ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
    }),
});
exports.uploadPhotosValidationSchema = uploadPhotosValidationSchema;
const deletePhotoValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        studentId: zod_1.z
            .string({
            required_error: "Student ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID format"),
        photoId: zod_1.z
            .string({
            required_error: "Photo ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid photo ID format"),
    }),
});
exports.deletePhotoValidationSchema = deletePhotoValidationSchema;
const getStudentsByGradeAndSectionSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: "School ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid school ID format"),
        grade: zod_1.z
            .string({
            required_error: "Grade is required",
        })
            .regex(/^\d+$/, "Grade must be a number")
            .transform((val) => parseInt(val))
            .refine((val) => val >= 1 && val <= 12, "Grade must be between 1 and 12"),
        section: zod_1.z
            .string({
            required_error: "Section is required",
        })
            .regex(/^[A-Z]$/, "Section must be a single uppercase letter"),
    }),
});
exports.getStudentsByGradeAndSectionSchema = getStudentsByGradeAndSectionSchema;
const getStudentStatsValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        schoolId: zod_1.z
            .string({
            required_error: "School ID is required",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid school ID format"),
    }),
});
exports.getStudentStatsValidationSchema = getStudentStatsValidationSchema;
//# sourceMappingURL=student.validation.js.map