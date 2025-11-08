import { z } from 'zod';
declare const createOrganizationValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        status: z.ZodOptional<z.ZodEnum<["active", "inactive"]>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        status?: "active" | "inactive" | undefined;
    }, {
        name: string;
        status?: "active" | "inactive" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        status?: "active" | "inactive" | undefined;
    };
}, {
    body: {
        name: string;
        status?: "active" | "inactive" | undefined;
    };
}>;
declare const updateOrganizationValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["active", "inactive", "suspended"]>>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        status?: "active" | "inactive" | "suspended" | undefined;
    }, {
        name?: string | undefined;
        status?: "active" | "inactive" | "suspended" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        status?: "active" | "inactive" | "suspended" | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        name?: string | undefined;
        status?: "active" | "inactive" | "suspended" | undefined;
    };
}>;
declare const getOrganizationValidationSchema: z.ZodObject<{
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
declare const deleteOrganizationValidationSchema: z.ZodObject<{
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
declare const getOrganizationsValidationSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
        status: z.ZodOptional<z.ZodEnum<["active", "inactive", "suspended", "all"]>>;
        search: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<["name", "createdAt", "updatedAt"]>>>;
        sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        sortBy: "createdAt" | "updatedAt" | "name";
        sortOrder: "asc" | "desc";
        search?: string | undefined;
        status?: "all" | "active" | "inactive" | "suspended" | undefined;
    }, {
        search?: string | undefined;
        limit?: string | undefined;
        status?: "all" | "active" | "inactive" | "suspended" | undefined;
        page?: string | undefined;
        sortBy?: "createdAt" | "updatedAt" | "name" | undefined;
        sortOrder?: "asc" | "desc" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        sortBy: "createdAt" | "updatedAt" | "name";
        sortOrder: "asc" | "desc";
        search?: string | undefined;
        status?: "all" | "active" | "inactive" | "suspended" | undefined;
    };
}, {
    query: {
        search?: string | undefined;
        limit?: string | undefined;
        status?: "all" | "active" | "inactive" | "suspended" | undefined;
        page?: string | undefined;
        sortBy?: "createdAt" | "updatedAt" | "name" | undefined;
        sortOrder?: "asc" | "desc" | undefined;
    };
}>;
export { createOrganizationValidationSchema, updateOrganizationValidationSchema, getOrganizationValidationSchema, deleteOrganizationValidationSchema, getOrganizationsValidationSchema, };
//# sourceMappingURL=organization.validation.d.ts.map