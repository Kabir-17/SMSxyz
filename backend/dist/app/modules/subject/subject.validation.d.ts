import { z } from "zod";
export declare const createSubjectValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        code: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        grades: z.ZodArray<z.ZodNumber, "many">;
        isCore: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        credits: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        isActive: boolean;
        name: string;
        grades: number[];
        code: string;
        isCore: boolean;
        credits: number;
        description?: string | undefined;
    }, {
        name: string;
        grades: number[];
        code: string;
        isActive?: boolean | undefined;
        description?: string | undefined;
        isCore?: boolean | undefined;
        credits?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        isActive: boolean;
        name: string;
        grades: number[];
        code: string;
        isCore: boolean;
        credits: number;
        description?: string | undefined;
    };
}, {
    body: {
        name: string;
        grades: number[];
        code: string;
        isActive?: boolean | undefined;
        description?: string | undefined;
        isCore?: boolean | undefined;
        credits?: number | undefined;
    };
}>;
export declare const getSubjectsValidationSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodObject<{
        grade: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        isActive?: string | undefined;
        search?: string | undefined;
        grade?: string | undefined;
    }, {
        isActive?: string | undefined;
        search?: string | undefined;
        grade?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    query?: {
        isActive?: string | undefined;
        search?: string | undefined;
        grade?: string | undefined;
    } | undefined;
}, {
    query?: {
        isActive?: string | undefined;
        search?: string | undefined;
        grade?: string | undefined;
    } | undefined;
}>;
export declare const getSubjectValidationSchema: z.ZodObject<{
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
export declare const updateSubjectValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        code: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        grades: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        isCore: z.ZodOptional<z.ZodBoolean>;
        credits: z.ZodOptional<z.ZodNumber>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean | undefined;
        description?: string | undefined;
        name?: string | undefined;
        grades?: number[] | undefined;
        code?: string | undefined;
        isCore?: boolean | undefined;
        credits?: number | undefined;
    }, {
        isActive?: boolean | undefined;
        description?: string | undefined;
        name?: string | undefined;
        grades?: number[] | undefined;
        code?: string | undefined;
        isCore?: boolean | undefined;
        credits?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        isActive?: boolean | undefined;
        description?: string | undefined;
        name?: string | undefined;
        grades?: number[] | undefined;
        code?: string | undefined;
        isCore?: boolean | undefined;
        credits?: number | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        isActive?: boolean | undefined;
        description?: string | undefined;
        name?: string | undefined;
        grades?: number[] | undefined;
        code?: string | undefined;
        isCore?: boolean | undefined;
        credits?: number | undefined;
    };
}>;
export declare const deleteSubjectValidationSchema: z.ZodObject<{
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
//# sourceMappingURL=subject.validation.d.ts.map