import { Request, Response } from "express";
export declare const AssessmentController: {
    getTeacherAssignments: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createAssessment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    listTeacherAssessments: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAssessmentDetails: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateAssessment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteAssessment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    submitAssessmentResults: (req: Request, res: Response, next: import("express").NextFunction) => void;
    exportAssessment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    exportTeacherAssessments: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getTeacherPerformanceMatrix: (req: Request, res: Response, next: import("express").NextFunction) => void;
    listCategories: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateCategory: (req: Request, res: Response, next: import("express").NextFunction) => void;
    listAdminAssessments: (req: Request, res: Response, next: import("express").NextFunction) => void;
    exportAdminAssessments: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateAdminAssessmentPreference: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getStudentAssessments: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAdminClasses: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=assessment.controller.d.ts.map