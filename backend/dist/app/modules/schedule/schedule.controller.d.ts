import { Request, Response } from "express";
export declare const ScheduleController: {
    createSchedule: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllSchedules: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getScheduleById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateSchedule: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteSchedule: (req: Request, res: Response, next: import("express").NextFunction) => void;
    clearClassSchedule: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getWeeklySchedule: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getTeacherSchedule: (req: Request, res: Response, next: import("express").NextFunction) => void;
    assignSubstituteTeacher: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getScheduleStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    bulkCreateSchedules: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSchedulesByClass: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSchedulesByTeacher: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSchedulesBySubject: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSchoolScheduleOverview: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=schedule.controller.d.ts.map