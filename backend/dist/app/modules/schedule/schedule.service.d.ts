import { Types } from "mongoose";
import { ICreateScheduleRequest, IUpdateScheduleRequest, IScheduleFilters, IWeeklySchedule, ITeacherWorkload, IScheduleStats, IScheduleDocument } from "./schedule.interface";
export declare const ScheduleService: {
    createSchedule: (scheduleData: ICreateScheduleRequest) => Promise<IScheduleDocument[]>;
    clearSchedulesForClass: (schoolId: string | undefined, grade: number, section: string, dayOfWeek?: string) => Promise<number>;
    getAllSchedules: (filters: IScheduleFilters, pagination: {
        page: number;
        limit: number;
    }) => Promise<{
        schedules: (import("mongoose").Document<unknown, {}, IScheduleDocument, {}, {}> & IScheduleDocument & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
        totalCount: number;
        currentPage: number;
        totalPages: number;
    }>;
    getScheduleById: (scheduleId: string) => Promise<IScheduleDocument>;
    updateSchedule: (scheduleId: string, updateData: IUpdateScheduleRequest, userSchoolId?: string) => Promise<IScheduleDocument>;
    deleteSchedule: (scheduleId: string, userSchoolId?: string) => Promise<void>;
    getWeeklySchedule: (schoolId: string, grade: number, section: string) => Promise<IWeeklySchedule>;
    getTeacherSchedule: (teacherId: string) => Promise<ITeacherWorkload>;
    assignSubstituteTeacher: (scheduleId: string, periodNumber: number, substituteTeacherId: string, startDate: Date, endDate?: Date, reason?: string) => Promise<IScheduleDocument>;
    getScheduleStats: (schoolId: string) => Promise<IScheduleStats>;
    bulkCreateSchedules: (schedulesData: ICreateScheduleRequest[]) => Promise<IScheduleDocument[]>;
};
//# sourceMappingURL=schedule.service.d.ts.map