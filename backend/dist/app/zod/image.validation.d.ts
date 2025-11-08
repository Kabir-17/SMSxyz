import { z } from "zod";
export declare const ImageFilesArrayZodSchema: z.ZodObject<{
    files: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        fieldname: z.ZodString;
        originalname: z.ZodString;
        encoding: z.ZodString;
        mimetype: z.ZodEnum<["image/png", "image/jpeg", "image/jpg", "png", "jpeg", "jpg"]>;
        path: z.ZodString;
        size: z.ZodEffects<z.ZodNumber, number, number>;
        filename: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        path: string;
        size: number;
        filename: string;
        mimetype: "jpg" | "jpeg" | "png" | "image/jpeg" | "image/jpg" | "image/png";
        fieldname: string;
        originalname: string;
        encoding: string;
    }, {
        path: string;
        size: number;
        filename: string;
        mimetype: "jpg" | "jpeg" | "png" | "image/jpeg" | "image/jpg" | "image/png";
        fieldname: string;
        originalname: string;
        encoding: string;
    }>, "many">>, Record<string, {
        path: string;
        size: number;
        filename: string;
        mimetype: "jpg" | "jpeg" | "png" | "image/jpeg" | "image/jpg" | "image/png";
        fieldname: string;
        originalname: string;
        encoding: string;
    }[]>, Record<string, {
        path: string;
        size: number;
        filename: string;
        mimetype: "jpg" | "jpeg" | "png" | "image/jpeg" | "image/jpg" | "image/png";
        fieldname: string;
        originalname: string;
        encoding: string;
    }[]>>;
}, "strip", z.ZodTypeAny, {
    files: Record<string, {
        path: string;
        size: number;
        filename: string;
        mimetype: "jpg" | "jpeg" | "png" | "image/jpeg" | "image/jpg" | "image/png";
        fieldname: string;
        originalname: string;
        encoding: string;
    }[]>;
}, {
    files: Record<string, {
        path: string;
        size: number;
        filename: string;
        mimetype: "jpg" | "jpeg" | "png" | "image/jpeg" | "image/jpg" | "image/png";
        fieldname: string;
        originalname: string;
        encoding: string;
    }[]>;
}>;
//# sourceMappingURL=image.validation.d.ts.map