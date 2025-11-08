import { z } from 'zod';
export declare const updateOrangeSmsValidationSchema: z.ZodObject<{
    body: z.ZodEffects<z.ZodObject<{
        clientId: z.ZodOptional<z.ZodString>;
        clientSecret: z.ZodOptional<z.ZodString>;
        senderAddress: z.ZodOptional<z.ZodString>;
        senderName: z.ZodOptional<z.ZodString>;
        countryCode: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        clientId?: string | undefined;
        clientSecret?: string | undefined;
        senderAddress?: string | undefined;
        senderName?: string | undefined;
        countryCode?: string | undefined;
    }, {
        clientId?: string | undefined;
        clientSecret?: string | undefined;
        senderAddress?: string | undefined;
        senderName?: string | undefined;
        countryCode?: string | undefined;
    }>, {
        clientId?: string | undefined;
        clientSecret?: string | undefined;
        senderAddress?: string | undefined;
        senderName?: string | undefined;
        countryCode?: string | undefined;
    }, {
        clientId?: string | undefined;
        clientSecret?: string | undefined;
        senderAddress?: string | undefined;
        senderName?: string | undefined;
        countryCode?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        clientId?: string | undefined;
        clientSecret?: string | undefined;
        senderAddress?: string | undefined;
        senderName?: string | undefined;
        countryCode?: string | undefined;
    };
}, {
    body: {
        clientId?: string | undefined;
        clientSecret?: string | undefined;
        senderAddress?: string | undefined;
        senderName?: string | undefined;
        countryCode?: string | undefined;
    };
}>;
export declare const sendOrangeSmsTestValidationSchema: z.ZodObject<{
    body: z.ZodEffects<z.ZodObject<{
        phoneNumber: z.ZodString;
        message: z.ZodString;
        senderName: z.ZodOptional<z.ZodString>;
        clientId: z.ZodOptional<z.ZodString>;
        clientSecret: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        phoneNumber: string;
        clientId?: string | undefined;
        clientSecret?: string | undefined;
        senderName?: string | undefined;
    }, {
        message: string;
        phoneNumber: string;
        clientId?: string | undefined;
        clientSecret?: string | undefined;
        senderName?: string | undefined;
    }>, {
        message: string;
        phoneNumber: string;
        clientId?: string | undefined;
        clientSecret?: string | undefined;
        senderName?: string | undefined;
    }, {
        message: string;
        phoneNumber: string;
        clientId?: string | undefined;
        clientSecret?: string | undefined;
        senderName?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        message: string;
        phoneNumber: string;
        clientId?: string | undefined;
        clientSecret?: string | undefined;
        senderName?: string | undefined;
    };
}, {
    body: {
        message: string;
        phoneNumber: string;
        clientId?: string | undefined;
        clientSecret?: string | undefined;
        senderName?: string | undefined;
    };
}>;
//# sourceMappingURL=orange-sms.validation.d.ts.map