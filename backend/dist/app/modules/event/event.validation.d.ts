import { z } from 'zod';
export declare const eventValidation: {
    createEventSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            date: z.ZodEffects<z.ZodString, string, string>;
            time: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
            type: z.ZodEnum<["academic", "extracurricular", "administrative", "holiday", "exam", "meeting", "announcement", "other"]>;
            targetAudience: z.ZodObject<{
                roles: z.ZodArray<z.ZodEnum<["admin", "teacher", "student", "parent"]>, "many">;
                grades: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
                sections: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                specific: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                roles: ("admin" | "teacher" | "student" | "parent")[];
                grades?: number[] | undefined;
                sections?: string[] | undefined;
                specific?: string[] | undefined;
            }, {
                roles: ("admin" | "teacher" | "student" | "parent")[];
                grades?: number[] | undefined;
                sections?: string[] | undefined;
                specific?: string[] | undefined;
            }>;
            isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, "strip", z.ZodTypeAny, {
            isActive: boolean;
            type: "exam" | "holiday" | "meeting" | "academic" | "extracurricular" | "administrative" | "announcement" | "other";
            date: string;
            title: string;
            targetAudience: {
                roles: ("admin" | "teacher" | "student" | "parent")[];
                grades?: number[] | undefined;
                sections?: string[] | undefined;
                specific?: string[] | undefined;
            };
            description?: string | undefined;
            time?: string | undefined;
            location?: string | undefined;
        }, {
            type: "exam" | "holiday" | "meeting" | "academic" | "extracurricular" | "administrative" | "announcement" | "other";
            date: string;
            title: string;
            targetAudience: {
                roles: ("admin" | "teacher" | "student" | "parent")[];
                grades?: number[] | undefined;
                sections?: string[] | undefined;
                specific?: string[] | undefined;
            };
            isActive?: boolean | undefined;
            description?: string | undefined;
            time?: string | undefined;
            location?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            isActive: boolean;
            type: "exam" | "holiday" | "meeting" | "academic" | "extracurricular" | "administrative" | "announcement" | "other";
            date: string;
            title: string;
            targetAudience: {
                roles: ("admin" | "teacher" | "student" | "parent")[];
                grades?: number[] | undefined;
                sections?: string[] | undefined;
                specific?: string[] | undefined;
            };
            description?: string | undefined;
            time?: string | undefined;
            location?: string | undefined;
        };
    }, {
        body: {
            type: "exam" | "holiday" | "meeting" | "academic" | "extracurricular" | "administrative" | "announcement" | "other";
            date: string;
            title: string;
            targetAudience: {
                roles: ("admin" | "teacher" | "student" | "parent")[];
                grades?: number[] | undefined;
                sections?: string[] | undefined;
                specific?: string[] | undefined;
            };
            isActive?: boolean | undefined;
            description?: string | undefined;
            time?: string | undefined;
            location?: string | undefined;
        };
    }>;
    updateEventSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            date: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            time: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
            type: z.ZodOptional<z.ZodEnum<["academic", "extracurricular", "administrative", "holiday", "exam", "meeting", "announcement", "other"]>>;
            targetAudience: z.ZodOptional<z.ZodObject<{
                roles: z.ZodArray<z.ZodEnum<["admin", "teacher", "student", "parent"]>, "many">;
                grades: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
                sections: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                specific: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                roles: ("admin" | "teacher" | "student" | "parent")[];
                grades?: number[] | undefined;
                sections?: string[] | undefined;
                specific?: string[] | undefined;
            }, {
                roles: ("admin" | "teacher" | "student" | "parent")[];
                grades?: number[] | undefined;
                sections?: string[] | undefined;
                specific?: string[] | undefined;
            }>>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            isActive?: boolean | undefined;
            type?: "exam" | "holiday" | "meeting" | "academic" | "extracurricular" | "administrative" | "announcement" | "other" | undefined;
            date?: string | undefined;
            description?: string | undefined;
            title?: string | undefined;
            time?: string | undefined;
            location?: string | undefined;
            targetAudience?: {
                roles: ("admin" | "teacher" | "student" | "parent")[];
                grades?: number[] | undefined;
                sections?: string[] | undefined;
                specific?: string[] | undefined;
            } | undefined;
        }, {
            isActive?: boolean | undefined;
            type?: "exam" | "holiday" | "meeting" | "academic" | "extracurricular" | "administrative" | "announcement" | "other" | undefined;
            date?: string | undefined;
            description?: string | undefined;
            title?: string | undefined;
            time?: string | undefined;
            location?: string | undefined;
            targetAudience?: {
                roles: ("admin" | "teacher" | "student" | "parent")[];
                grades?: number[] | undefined;
                sections?: string[] | undefined;
                specific?: string[] | undefined;
            } | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            isActive?: boolean | undefined;
            type?: "exam" | "holiday" | "meeting" | "academic" | "extracurricular" | "administrative" | "announcement" | "other" | undefined;
            date?: string | undefined;
            description?: string | undefined;
            title?: string | undefined;
            time?: string | undefined;
            location?: string | undefined;
            targetAudience?: {
                roles: ("admin" | "teacher" | "student" | "parent")[];
                grades?: number[] | undefined;
                sections?: string[] | undefined;
                specific?: string[] | undefined;
            } | undefined;
        };
    }, {
        body: {
            isActive?: boolean | undefined;
            type?: "exam" | "holiday" | "meeting" | "academic" | "extracurricular" | "administrative" | "announcement" | "other" | undefined;
            date?: string | undefined;
            description?: string | undefined;
            title?: string | undefined;
            time?: string | undefined;
            location?: string | undefined;
            targetAudience?: {
                roles: ("admin" | "teacher" | "student" | "parent")[];
                grades?: number[] | undefined;
                sections?: string[] | undefined;
                specific?: string[] | undefined;
            } | undefined;
        };
    }>;
    getEventsSchema: z.ZodObject<{
        query: z.ZodObject<{
            type: z.ZodOptional<z.ZodEnum<["academic", "extracurricular", "administrative", "holiday", "exam", "meeting", "announcement", "other"]>>;
            startDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            endDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
            grade: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>;
            section: z.ZodOptional<z.ZodString>;
            page: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
            limit: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
            isActive: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
        }, "strip", z.ZodTypeAny, {
            limit: number;
            page: number;
            isActive?: boolean | undefined;
            type?: "exam" | "holiday" | "meeting" | "academic" | "extracurricular" | "administrative" | "announcement" | "other" | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            grade?: number | undefined;
            section?: string | undefined;
        }, {
            isActive?: string | undefined;
            limit?: string | undefined;
            type?: "exam" | "holiday" | "meeting" | "academic" | "extracurricular" | "administrative" | "announcement" | "other" | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            page?: string | undefined;
            grade?: string | undefined;
            section?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        query: {
            limit: number;
            page: number;
            isActive?: boolean | undefined;
            type?: "exam" | "holiday" | "meeting" | "academic" | "extracurricular" | "administrative" | "announcement" | "other" | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            grade?: number | undefined;
            section?: string | undefined;
        };
    }, {
        query: {
            isActive?: string | undefined;
            limit?: string | undefined;
            type?: "exam" | "holiday" | "meeting" | "academic" | "extracurricular" | "administrative" | "announcement" | "other" | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            page?: string | undefined;
            grade?: string | undefined;
            section?: string | undefined;
        };
    }>;
    getEventByIdSchema: z.ZodObject<{
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
};
//# sourceMappingURL=event.validation.d.ts.map