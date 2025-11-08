import { z } from 'zod';
export declare const createClassValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        grade: z.ZodNumber;
        section: z.ZodOptional<z.ZodString>;
        maxStudents: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        academicYear: z.ZodString;
        classTeacher: z.ZodOptional<z.ZodString>;
        subjects: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        absenceSmsSettings: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            sendAfterTime: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            enabled?: boolean | undefined;
            sendAfterTime?: string | undefined;
        }, {
            enabled?: boolean | undefined;
            sendAfterTime?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        maxStudents: number;
        grade: number;
        academicYear: string;
        section?: string | undefined;
        subjects?: string[] | undefined;
        classTeacher?: string | undefined;
        absenceSmsSettings?: {
            enabled?: boolean | undefined;
            sendAfterTime?: string | undefined;
        } | undefined;
    }, {
        grade: number;
        academicYear: string;
        maxStudents?: number | undefined;
        section?: string | undefined;
        subjects?: string[] | undefined;
        classTeacher?: string | undefined;
        absenceSmsSettings?: {
            enabled?: boolean | undefined;
            sendAfterTime?: string | undefined;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        maxStudents: number;
        grade: number;
        academicYear: string;
        section?: string | undefined;
        subjects?: string[] | undefined;
        classTeacher?: string | undefined;
        absenceSmsSettings?: {
            enabled?: boolean | undefined;
            sendAfterTime?: string | undefined;
        } | undefined;
    };
}, {
    body: {
        grade: number;
        academicYear: string;
        maxStudents?: number | undefined;
        section?: string | undefined;
        subjects?: string[] | undefined;
        classTeacher?: string | undefined;
        absenceSmsSettings?: {
            enabled?: boolean | undefined;
            sendAfterTime?: string | undefined;
        } | undefined;
    };
}>;
export declare const updateClassValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        maxStudents: z.ZodOptional<z.ZodNumber>;
        classTeacher: z.ZodOptional<z.ZodString>;
        subjects: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        isActive: z.ZodOptional<z.ZodBoolean>;
        absenceSmsSettings: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            sendAfterTime: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            enabled?: boolean | undefined;
            sendAfterTime?: string | undefined;
        }, {
            enabled?: boolean | undefined;
            sendAfterTime?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean | undefined;
        maxStudents?: number | undefined;
        subjects?: string[] | undefined;
        classTeacher?: string | undefined;
        absenceSmsSettings?: {
            enabled?: boolean | undefined;
            sendAfterTime?: string | undefined;
        } | undefined;
    }, {
        isActive?: boolean | undefined;
        maxStudents?: number | undefined;
        subjects?: string[] | undefined;
        classTeacher?: string | undefined;
        absenceSmsSettings?: {
            enabled?: boolean | undefined;
            sendAfterTime?: string | undefined;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        isActive?: boolean | undefined;
        maxStudents?: number | undefined;
        subjects?: string[] | undefined;
        classTeacher?: string | undefined;
        absenceSmsSettings?: {
            enabled?: boolean | undefined;
            sendAfterTime?: string | undefined;
        } | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        isActive?: boolean | undefined;
        maxStudents?: number | undefined;
        subjects?: string[] | undefined;
        classTeacher?: string | undefined;
        absenceSmsSettings?: {
            enabled?: boolean | undefined;
            sendAfterTime?: string | undefined;
        } | undefined;
    };
}>;
export declare const getClassValidationSchema: z.ZodObject<{
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
export declare const deleteClassValidationSchema: z.ZodObject<{
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
export declare const getClassesValidationSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
        schoolId: z.ZodOptional<z.ZodString>;
        grade: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>;
        section: z.ZodOptional<z.ZodString>;
        academicYear: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
        sortBy: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        sortBy: string;
        sortOrder: "asc" | "desc";
        schoolId?: string | undefined;
        isActive?: boolean | undefined;
        grade?: number | undefined;
        section?: string | undefined;
        academicYear?: string | undefined;
    }, {
        schoolId?: string | undefined;
        isActive?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        grade?: string | undefined;
        section?: string | undefined;
        academicYear?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        sortBy: string;
        sortOrder: "asc" | "desc";
        schoolId?: string | undefined;
        isActive?: boolean | undefined;
        grade?: number | undefined;
        section?: string | undefined;
        academicYear?: string | undefined;
    };
}, {
    query: {
        schoolId?: string | undefined;
        isActive?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        grade?: string | undefined;
        section?: string | undefined;
        academicYear?: string | undefined;
    };
}>;
export declare const getClassesByGradeValidationSchema: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    params: {
        schoolId: string;
        grade: number;
    };
}, {
    params: {
        schoolId: string;
        grade: string;
    };
}>;
export declare const getClassByGradeAndSectionValidationSchema: z.ZodObject<{
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
export declare const getClassStatsValidationSchema: z.ZodObject<{
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
export declare const checkCapacityValidationSchema: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    params: {
        schoolId: string;
        grade: number;
    };
}, {
    params: {
        schoolId: string;
        grade: string;
    };
}>;
export declare const createNewSectionValidationSchema: z.ZodObject<{
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
    body: z.ZodObject<{
        academicYear: z.ZodString;
        maxStudents: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        maxStudents: number;
        academicYear: string;
    }, {
        academicYear: string;
        maxStudents?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        schoolId: string;
        grade: number;
    };
    body: {
        maxStudents: number;
        academicYear: string;
    };
}, {
    params: {
        schoolId: string;
        grade: string;
    };
    body: {
        academicYear: string;
        maxStudents?: number | undefined;
    };
}>;
//# sourceMappingURL=class.validation.d.ts.map