import { z } from 'zod';
declare const createUserValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        schoolId: z.ZodOptional<z.ZodString>;
        role: z.ZodEnum<["admin", "teacher", "student", "parent", "accountant"]>;
        username: z.ZodString;
        password: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        role: "admin" | "teacher" | "student" | "parent" | "accountant";
        username: string;
        firstName: string;
        lastName: string;
        password: string;
        schoolId?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
    }, {
        role: "admin" | "teacher" | "student" | "parent" | "accountant";
        username: string;
        firstName: string;
        lastName: string;
        password: string;
        schoolId?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        role: "admin" | "teacher" | "student" | "parent" | "accountant";
        username: string;
        firstName: string;
        lastName: string;
        password: string;
        schoolId?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
    };
}, {
    body: {
        role: "admin" | "teacher" | "student" | "parent" | "accountant";
        username: string;
        firstName: string;
        lastName: string;
        password: string;
        schoolId?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
    };
}>;
declare const updateUserValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        firstName?: string | undefined;
        lastName?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
    }, {
        firstName?: string | undefined;
        lastName?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        firstName?: string | undefined;
        lastName?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        firstName?: string | undefined;
        lastName?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
    };
}>;
declare const getUserValidationSchema: z.ZodObject<{
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
declare const deleteUserValidationSchema: z.ZodObject<{
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
declare const getUsersValidationSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
        schoolId: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<["superadmin", "admin", "teacher", "student", "parent", "accountant", "all"]>>;
        isActive: z.ZodOptional<z.ZodEnum<["true", "false", "all"]>>;
        search: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<["firstName", "lastName", "username", "role", "createdAt", "lastLogin"]>>>;
        sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        sortBy: "role" | "username" | "firstName" | "lastName" | "lastLogin" | "createdAt";
        sortOrder: "asc" | "desc";
        schoolId?: string | undefined;
        role?: "superadmin" | "admin" | "teacher" | "student" | "parent" | "accountant" | "all" | undefined;
        isActive?: "false" | "all" | "true" | undefined;
        search?: string | undefined;
    }, {
        schoolId?: string | undefined;
        role?: "superadmin" | "admin" | "teacher" | "student" | "parent" | "accountant" | "all" | undefined;
        isActive?: "false" | "all" | "true" | undefined;
        search?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: "role" | "username" | "firstName" | "lastName" | "lastLogin" | "createdAt" | undefined;
        sortOrder?: "asc" | "desc" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        sortBy: "role" | "username" | "firstName" | "lastName" | "lastLogin" | "createdAt";
        sortOrder: "asc" | "desc";
        schoolId?: string | undefined;
        role?: "superadmin" | "admin" | "teacher" | "student" | "parent" | "accountant" | "all" | undefined;
        isActive?: "false" | "all" | "true" | undefined;
        search?: string | undefined;
    };
}, {
    query: {
        schoolId?: string | undefined;
        role?: "superadmin" | "admin" | "teacher" | "student" | "parent" | "accountant" | "all" | undefined;
        isActive?: "false" | "all" | "true" | undefined;
        search?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: "role" | "username" | "firstName" | "lastName" | "lastLogin" | "createdAt" | undefined;
        sortOrder?: "asc" | "desc" | undefined;
    };
}>;
declare const changePasswordValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        currentPassword: z.ZodString;
        newPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        newPassword: string;
        currentPassword: string;
    }, {
        newPassword: string;
        currentPassword: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        newPassword: string;
        currentPassword: string;
    };
}, {
    params: {
        id: string;
    };
    body: {
        newPassword: string;
        currentPassword: string;
    };
}>;
declare const resetPasswordValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        newPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        newPassword: string;
    }, {
        newPassword: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        newPassword: string;
    };
}, {
    params: {
        id: string;
    };
    body: {
        newPassword: string;
    };
}>;
declare const loginValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        username: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        username: string;
        password: string;
    }, {
        username: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        username: string;
        password: string;
    };
}, {
    body: {
        username: string;
        password: string;
    };
}>;
export { createUserValidationSchema, updateUserValidationSchema, getUserValidationSchema, deleteUserValidationSchema, getUsersValidationSchema, changePasswordValidationSchema, resetPasswordValidationSchema, loginValidationSchema, };
//# sourceMappingURL=user.validation.d.ts.map