import { z } from "zod";
export declare const listThreadsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        limit: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>, number | undefined, string | undefined>>;
    }, "strip", z.ZodTypeAny, {
        limit?: number | undefined;
    }, {
        limit?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit?: number | undefined;
    };
}, {
    query: {
        limit?: string | undefined;
    };
}>;
export declare const createThreadSchema: z.ZodObject<{
    body: z.ZodObject<{
        participantIds: z.ZodArray<z.ZodString, "many">;
        contextStudentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        participantIds: string[];
        contextStudentId?: string | undefined;
    }, {
        participantIds: string[];
        contextStudentId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        participantIds: string[];
        contextStudentId?: string | undefined;
    };
}, {
    body: {
        participantIds: string[];
        contextStudentId?: string | undefined;
    };
}>;
export declare const newMessageSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        body: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        body: string;
    }, {
        body: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        body: string;
    };
}, {
    params: {
        id: string;
    };
    body: {
        body: string;
    };
}>;
export declare const listMessagesQuerySchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    query: z.ZodObject<{
        cursor: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodString>, number | undefined, string | undefined>, number | undefined, string | undefined>>;
    }, "strip", z.ZodTypeAny, {
        limit?: number | undefined;
        cursor?: string | undefined;
    }, {
        limit?: string | undefined;
        cursor?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit?: number | undefined;
        cursor?: string | undefined;
    };
    params: {
        id: string;
    };
}, {
    query: {
        limit?: string | undefined;
        cursor?: string | undefined;
    };
    params: {
        id: string;
    };
}>;
export declare const listContactsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        includeParents: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
    }, "strip", z.ZodTypeAny, {
        includeParents?: boolean | undefined;
    }, {
        includeParents?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        includeParents?: boolean | undefined;
    };
}, {
    query: {
        includeParents?: string | undefined;
    };
}>;
//# sourceMappingURL=messaging.validation.d.ts.map