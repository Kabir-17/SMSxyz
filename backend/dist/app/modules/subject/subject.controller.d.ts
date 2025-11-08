import { Request, Response, NextFunction } from "express";
export declare const createSubject: (req: Request, res: Response, next: NextFunction) => void;
export declare const getAllSubjects: (req: Request, res: Response, next: NextFunction) => void;
export declare const getSubjectById: (req: Request, res: Response, next: NextFunction) => void;
export declare const updateSubject: (req: Request, res: Response, next: NextFunction) => void;
export declare const getSubjectsByGrade: (req: Request, res: Response, next: NextFunction) => void;
export declare const deleteSubject: (req: Request, res: Response, next: NextFunction) => void;
export declare const SubjectController: {
    createSubject: (req: Request, res: Response, next: NextFunction) => void;
    getAllSubjects: (req: Request, res: Response, next: NextFunction) => void;
    getSubjectById: (req: Request, res: Response, next: NextFunction) => void;
    getSubjectsByGrade: (req: Request, res: Response, next: NextFunction) => void;
    updateSubject: (req: Request, res: Response, next: NextFunction) => void;
    deleteSubject: (req: Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=subject.controller.d.ts.map