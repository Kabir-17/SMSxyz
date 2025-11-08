import { Request, Response } from 'express';
export declare const ClassController: {
    createClass: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllClasses: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getClassById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateClass: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteClass: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getClassesByGrade: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getClassByGradeAndSection: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getClassStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    checkCapacity: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createNewSectionIfNeeded: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=class.controller.d.ts.map