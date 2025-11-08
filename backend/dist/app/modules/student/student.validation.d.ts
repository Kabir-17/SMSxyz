import { z } from "zod";
declare const createStudentValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        schoolId: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        grade: z.ZodEffects<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>, number, string>;
        section: z.ZodEffects<z.ZodEffects<z.ZodDefault<z.ZodString>, string, string | undefined>, string, string | undefined>;
        bloodGroup: z.ZodEnum<["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]>;
        dob: z.ZodEffects<z.ZodString, string, string>;
        admissionDate: z.ZodOptional<z.ZodString>;
        admissionYear: z.ZodOptional<z.ZodNumber>;
        studentId: z.ZodOptional<z.ZodString>;
        rollNumber: z.ZodOptional<z.ZodNumber>;
        address: z.ZodOptional<z.ZodObject<{
            street: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            state: z.ZodOptional<z.ZodString>;
            country: z.ZodOptional<z.ZodString>;
            postalCode: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            street?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            country?: string | undefined;
            postalCode?: string | undefined;
        }, {
            street?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            country?: string | undefined;
            postalCode?: string | undefined;
        }>>;
        parentInfo: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodString>;
            occupation: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            email?: string | undefined;
            phone?: string | undefined;
            address?: string | undefined;
            occupation?: string | undefined;
        }, {
            name: string;
            email?: string | undefined;
            phone?: string | undefined;
            address?: string | undefined;
            occupation?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        schoolId: string;
        firstName: string;
        lastName: string;
        grade: number;
        section: string;
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        parentInfo: {
            name: string;
            email?: string | undefined;
            phone?: string | undefined;
            address?: string | undefined;
            occupation?: string | undefined;
        };
        email?: string | undefined;
        phone?: string | undefined;
        address?: {
            street?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            country?: string | undefined;
            postalCode?: string | undefined;
        } | undefined;
        studentId?: string | undefined;
        admissionDate?: string | undefined;
        admissionYear?: number | undefined;
        rollNumber?: number | undefined;
    }, {
        schoolId: string;
        firstName: string;
        lastName: string;
        grade: string;
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        parentInfo: {
            name: string;
            email?: string | undefined;
            phone?: string | undefined;
            address?: string | undefined;
            occupation?: string | undefined;
        };
        email?: string | undefined;
        phone?: string | undefined;
        address?: {
            street?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            country?: string | undefined;
            postalCode?: string | undefined;
        } | undefined;
        studentId?: string | undefined;
        section?: string | undefined;
        admissionDate?: string | undefined;
        admissionYear?: number | undefined;
        rollNumber?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        schoolId: string;
        firstName: string;
        lastName: string;
        grade: number;
        section: string;
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        parentInfo: {
            name: string;
            email?: string | undefined;
            phone?: string | undefined;
            address?: string | undefined;
            occupation?: string | undefined;
        };
        email?: string | undefined;
        phone?: string | undefined;
        address?: {
            street?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            country?: string | undefined;
            postalCode?: string | undefined;
        } | undefined;
        studentId?: string | undefined;
        admissionDate?: string | undefined;
        admissionYear?: number | undefined;
        rollNumber?: number | undefined;
    };
}, {
    body: {
        schoolId: string;
        firstName: string;
        lastName: string;
        grade: string;
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        parentInfo: {
            name: string;
            email?: string | undefined;
            phone?: string | undefined;
            address?: string | undefined;
            occupation?: string | undefined;
        };
        email?: string | undefined;
        phone?: string | undefined;
        address?: {
            street?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            country?: string | undefined;
            postalCode?: string | undefined;
        } | undefined;
        studentId?: string | undefined;
        section?: string | undefined;
        admissionDate?: string | undefined;
        admissionYear?: number | undefined;
        rollNumber?: number | undefined;
    };
}>;
declare const updateStudentValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        grade: z.ZodOptional<z.ZodNumber>;
        section: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        bloodGroup: z.ZodOptional<z.ZodEnum<["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]>>;
        dob: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        rollNumber: z.ZodOptional<z.ZodNumber>;
        isActive: z.ZodOptional<z.ZodBoolean>;
        address: z.ZodOptional<z.ZodObject<{
            street: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            state: z.ZodOptional<z.ZodString>;
            country: z.ZodOptional<z.ZodString>;
            postalCode: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            street?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            country?: string | undefined;
            postalCode?: string | undefined;
        }, {
            street?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            country?: string | undefined;
            postalCode?: string | undefined;
        }>>;
        parentInfo: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            phone: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodString>;
            occupation: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            email?: string | undefined;
            phone?: string | undefined;
            name?: string | undefined;
            address?: string | undefined;
            occupation?: string | undefined;
        }, {
            email?: string | undefined;
            phone?: string | undefined;
            name?: string | undefined;
            address?: string | undefined;
            occupation?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean | undefined;
        address?: {
            street?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            country?: string | undefined;
            postalCode?: string | undefined;
        } | undefined;
        grade?: number | undefined;
        section?: string | undefined;
        bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
        dob?: string | undefined;
        rollNumber?: number | undefined;
        parentInfo?: {
            email?: string | undefined;
            phone?: string | undefined;
            name?: string | undefined;
            address?: string | undefined;
            occupation?: string | undefined;
        } | undefined;
    }, {
        isActive?: boolean | undefined;
        address?: {
            street?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            country?: string | undefined;
            postalCode?: string | undefined;
        } | undefined;
        grade?: number | undefined;
        section?: string | undefined;
        bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
        dob?: string | undefined;
        rollNumber?: number | undefined;
        parentInfo?: {
            email?: string | undefined;
            phone?: string | undefined;
            name?: string | undefined;
            address?: string | undefined;
            occupation?: string | undefined;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        isActive?: boolean | undefined;
        address?: {
            street?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            country?: string | undefined;
            postalCode?: string | undefined;
        } | undefined;
        grade?: number | undefined;
        section?: string | undefined;
        bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
        dob?: string | undefined;
        rollNumber?: number | undefined;
        parentInfo?: {
            email?: string | undefined;
            phone?: string | undefined;
            name?: string | undefined;
            address?: string | undefined;
            occupation?: string | undefined;
        } | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        isActive?: boolean | undefined;
        address?: {
            street?: string | undefined;
            city?: string | undefined;
            state?: string | undefined;
            country?: string | undefined;
            postalCode?: string | undefined;
        } | undefined;
        grade?: number | undefined;
        section?: string | undefined;
        bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
        dob?: string | undefined;
        rollNumber?: number | undefined;
        parentInfo?: {
            email?: string | undefined;
            phone?: string | undefined;
            name?: string | undefined;
            address?: string | undefined;
            occupation?: string | undefined;
        } | undefined;
    };
}>;
declare const getStudentValidationSchema: z.ZodObject<{
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
declare const deleteStudentValidationSchema: z.ZodObject<{
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
declare const getStudentsValidationSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
        schoolId: z.ZodOptional<z.ZodString>;
        grade: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>;
        section: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodEnum<["true", "false", "all"]>>;
        search: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<["firstName", "lastName", "studentId", "grade", "section", "admissionDate", "rollNumber"]>>>;
        sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        sortBy: "firstName" | "lastName" | "studentId" | "grade" | "section" | "admissionDate" | "rollNumber";
        sortOrder: "asc" | "desc";
        schoolId?: string | undefined;
        isActive?: "false" | "all" | "true" | undefined;
        search?: string | undefined;
        grade?: number | undefined;
        section?: string | undefined;
    }, {
        schoolId?: string | undefined;
        isActive?: "false" | "all" | "true" | undefined;
        search?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: "firstName" | "lastName" | "studentId" | "grade" | "section" | "admissionDate" | "rollNumber" | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        grade?: string | undefined;
        section?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        sortBy: "firstName" | "lastName" | "studentId" | "grade" | "section" | "admissionDate" | "rollNumber";
        sortOrder: "asc" | "desc";
        schoolId?: string | undefined;
        isActive?: "false" | "all" | "true" | undefined;
        search?: string | undefined;
        grade?: number | undefined;
        section?: string | undefined;
    };
}, {
    query: {
        schoolId?: string | undefined;
        isActive?: "false" | "all" | "true" | undefined;
        search?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: "firstName" | "lastName" | "studentId" | "grade" | "section" | "admissionDate" | "rollNumber" | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        grade?: string | undefined;
        section?: string | undefined;
    };
}>;
declare const uploadPhotosValidationSchema: z.ZodObject<{
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
declare const deletePhotoValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        studentId: z.ZodString;
        photoId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
        photoId: string;
    }, {
        studentId: string;
        photoId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        studentId: string;
        photoId: string;
    };
}, {
    params: {
        studentId: string;
        photoId: string;
    };
}>;
declare const getStudentsByGradeAndSectionSchema: z.ZodObject<{
    params: z.ZodObject<{
        schoolId: z.ZodString;
        grade: z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>;
        section: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        schoolId: string;
        grade: number;
        section: string;
    }, {
        schoolId: string;
        grade: string;
        section: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        schoolId: string;
        grade: number;
        section: string;
    };
}, {
    params: {
        schoolId: string;
        grade: string;
        section: string;
    };
}>;
declare const getStudentStatsValidationSchema: z.ZodObject<{
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
export { createStudentValidationSchema, updateStudentValidationSchema, getStudentValidationSchema, deleteStudentValidationSchema, getStudentsValidationSchema, uploadPhotosValidationSchema, deletePhotoValidationSchema, getStudentsByGradeAndSectionSchema, getStudentStatsValidationSchema, };
//# sourceMappingURL=student.validation.d.ts.map