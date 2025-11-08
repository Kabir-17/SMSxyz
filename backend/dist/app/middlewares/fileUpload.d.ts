import { Request, Response, NextFunction } from 'express';
export declare const uploadStudentPhotos: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadTeacherPhotos: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadSinglePhoto: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadDocuments: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadMixedFiles: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadHomeworkAttachments: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadAssignmentMaterials: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const validateUploadedFiles: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateOptionalFiles: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateStudentPhotoCount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateFileSize: (maxSize?: number) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateFileExtensions: (allowedExtensions: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const sanitizeFilenames: (req: Request, res: Response, next: NextFunction) => void;
export declare const handleMulterError: (error: any, req: Request, res: Response, next: NextFunction) => void;
export declare const createUploadMiddleware: (options: {
    fieldName: string;
    maxFiles?: number;
    fileTypes?: string[];
    maxSize?: number;
    storage?: "memory" | "disk";
}) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
declare const _default: {
    uploadStudentPhotos: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadTeacherPhotos: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadSinglePhoto: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadDocuments: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadMixedFiles: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadHomeworkAttachments: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadAssignmentMaterials: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    validateUploadedFiles: (req: Request, res: Response, next: NextFunction) => void;
    validateOptionalFiles: (req: Request, res: Response, next: NextFunction) => void;
    validateStudentPhotoCount: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    validateFileSize: (maxSize?: number) => (req: Request, res: Response, next: NextFunction) => void;
    validateFileExtensions: (allowedExtensions: string[]) => (req: Request, res: Response, next: NextFunction) => void;
    sanitizeFilenames: (req: Request, res: Response, next: NextFunction) => void;
    handleMulterError: (error: any, req: Request, res: Response, next: NextFunction) => void;
    createUploadMiddleware: (options: {
        fieldName: string;
        maxFiles?: number;
        fileTypes?: string[];
        maxSize?: number;
        storage?: "memory" | "disk";
    }) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
};
export default _default;
//# sourceMappingURL=fileUpload.d.ts.map