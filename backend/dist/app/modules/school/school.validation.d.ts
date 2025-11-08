import { z } from 'zod';
declare const createSchoolValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        orgId: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        establishedYear: z.ZodOptional<z.ZodNumber>;
        address: z.ZodObject<{
            street: z.ZodString;
            city: z.ZodString;
            state: z.ZodString;
            country: z.ZodString;
            postalCode: z.ZodString;
            coordinates: z.ZodOptional<z.ZodObject<{
                latitude: z.ZodNumber;
                longitude: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                latitude: number;
                longitude: number;
            }, {
                latitude: number;
                longitude: number;
            }>>;
        }, "strip", z.ZodTypeAny, {
            street: string;
            city: string;
            state: string;
            country: string;
            postalCode: string;
            coordinates?: {
                latitude: number;
                longitude: number;
            } | undefined;
        }, {
            street: string;
            city: string;
            state: string;
            country: string;
            postalCode: string;
            coordinates?: {
                latitude: number;
                longitude: number;
            } | undefined;
        }>;
        contact: z.ZodObject<{
            phone: z.ZodOptional<z.ZodString>;
            email: z.ZodString;
            website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodEffects<z.ZodLiteral<"">, undefined, "">]>;
            fax: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            phone?: string | undefined;
            website?: string | undefined;
            fax?: string | undefined;
        }, {
            email: string;
            phone?: string | undefined;
            website?: string | undefined;
            fax?: string | undefined;
        }>;
        adminDetails: z.ZodObject<{
            firstName: z.ZodString;
            lastName: z.ZodString;
            email: z.ZodString;
            phone: z.ZodOptional<z.ZodString>;
            username: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            phone?: string | undefined;
        }, {
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            phone?: string | undefined;
        }>;
        affiliation: z.ZodOptional<z.ZodString>;
        recognition: z.ZodOptional<z.ZodString>;
        logo: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        address: {
            street: string;
            city: string;
            state: string;
            country: string;
            postalCode: string;
            coordinates?: {
                latitude: number;
                longitude: number;
            } | undefined;
        };
        contact: {
            email: string;
            phone?: string | undefined;
            website?: string | undefined;
            fax?: string | undefined;
        };
        adminDetails: {
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            phone?: string | undefined;
        };
        orgId?: string | undefined;
        establishedYear?: number | undefined;
        affiliation?: string | undefined;
        recognition?: string | undefined;
        logo?: string | undefined;
    }, {
        name: string;
        address: {
            street: string;
            city: string;
            state: string;
            country: string;
            postalCode: string;
            coordinates?: {
                latitude: number;
                longitude: number;
            } | undefined;
        };
        contact: {
            email: string;
            phone?: string | undefined;
            website?: string | undefined;
            fax?: string | undefined;
        };
        adminDetails: {
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            phone?: string | undefined;
        };
        orgId?: string | undefined;
        establishedYear?: number | undefined;
        affiliation?: string | undefined;
        recognition?: string | undefined;
        logo?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        address: {
            street: string;
            city: string;
            state: string;
            country: string;
            postalCode: string;
            coordinates?: {
                latitude: number;
                longitude: number;
            } | undefined;
        };
        contact: {
            email: string;
            phone?: string | undefined;
            website?: string | undefined;
            fax?: string | undefined;
        };
        adminDetails: {
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            phone?: string | undefined;
        };
        orgId?: string | undefined;
        establishedYear?: number | undefined;
        affiliation?: string | undefined;
        recognition?: string | undefined;
        logo?: string | undefined;
    };
}, {
    body: {
        name: string;
        address: {
            street: string;
            city: string;
            state: string;
            country: string;
            postalCode: string;
            coordinates?: {
                latitude: number;
                longitude: number;
            } | undefined;
        };
        contact: {
            email: string;
            phone?: string | undefined;
            website?: string | undefined;
            fax?: string | undefined;
        };
        adminDetails: {
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            phone?: string | undefined;
        };
        orgId?: string | undefined;
        establishedYear?: number | undefined;
        affiliation?: string | undefined;
        recognition?: string | undefined;
        logo?: string | undefined;
    };
}>;
declare const updateSchoolValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<["active", "inactive", "suspended"]>>;
        settings: z.ZodOptional<z.ZodObject<{
            maxStudentsPerSection: z.ZodOptional<z.ZodNumber>;
            grades: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
            sections: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            academicYearStart: z.ZodOptional<z.ZodNumber>;
            academicYearEnd: z.ZodOptional<z.ZodNumber>;
            attendanceGracePeriod: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            maxStudentsPerSection?: number | undefined;
            grades?: number[] | undefined;
            sections?: string[] | undefined;
            academicYearStart?: number | undefined;
            academicYearEnd?: number | undefined;
            attendanceGracePeriod?: number | undefined;
        }, {
            maxStudentsPerSection?: number | undefined;
            grades?: number[] | undefined;
            sections?: string[] | undefined;
            academicYearStart?: number | undefined;
            academicYearEnd?: number | undefined;
            attendanceGracePeriod?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        phone?: string | undefined;
        name?: string | undefined;
        address?: string | undefined;
        status?: "active" | "inactive" | "suspended" | undefined;
        settings?: {
            maxStudentsPerSection?: number | undefined;
            grades?: number[] | undefined;
            sections?: string[] | undefined;
            academicYearStart?: number | undefined;
            academicYearEnd?: number | undefined;
            attendanceGracePeriod?: number | undefined;
        } | undefined;
    }, {
        email?: string | undefined;
        phone?: string | undefined;
        name?: string | undefined;
        address?: string | undefined;
        status?: "active" | "inactive" | "suspended" | undefined;
        settings?: {
            maxStudentsPerSection?: number | undefined;
            grades?: number[] | undefined;
            sections?: string[] | undefined;
            academicYearStart?: number | undefined;
            academicYearEnd?: number | undefined;
            attendanceGracePeriod?: number | undefined;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        email?: string | undefined;
        phone?: string | undefined;
        name?: string | undefined;
        address?: string | undefined;
        status?: "active" | "inactive" | "suspended" | undefined;
        settings?: {
            maxStudentsPerSection?: number | undefined;
            grades?: number[] | undefined;
            sections?: string[] | undefined;
            academicYearStart?: number | undefined;
            academicYearEnd?: number | undefined;
            attendanceGracePeriod?: number | undefined;
        } | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        email?: string | undefined;
        phone?: string | undefined;
        name?: string | undefined;
        address?: string | undefined;
        status?: "active" | "inactive" | "suspended" | undefined;
        settings?: {
            maxStudentsPerSection?: number | undefined;
            grades?: number[] | undefined;
            sections?: string[] | undefined;
            academicYearStart?: number | undefined;
            academicYearEnd?: number | undefined;
            attendanceGracePeriod?: number | undefined;
        } | undefined;
    };
}>;
declare const getSchoolValidationSchema: z.ZodObject<{
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
declare const deleteSchoolValidationSchema: z.ZodObject<{
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
declare const getSchoolsValidationSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
        orgId: z.ZodOptional<z.ZodString>;
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
        orgId?: string | undefined;
        status?: "all" | "active" | "inactive" | "suspended" | undefined;
    }, {
        search?: string | undefined;
        limit?: string | undefined;
        orgId?: string | undefined;
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
        orgId?: string | undefined;
        status?: "all" | "active" | "inactive" | "suspended" | undefined;
    };
}, {
    query: {
        search?: string | undefined;
        limit?: string | undefined;
        orgId?: string | undefined;
        status?: "all" | "active" | "inactive" | "suspended" | undefined;
        page?: string | undefined;
        sortBy?: "createdAt" | "updatedAt" | "name" | undefined;
        sortOrder?: "asc" | "desc" | undefined;
    };
}>;
declare const resetAdminPasswordValidationSchema: z.ZodObject<{
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
export { createSchoolValidationSchema, updateSchoolValidationSchema, getSchoolValidationSchema, deleteSchoolValidationSchema, getSchoolsValidationSchema, resetAdminPasswordValidationSchema, };
//# sourceMappingURL=school.validation.d.ts.map