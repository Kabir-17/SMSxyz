import { Types } from 'mongoose';
declare class AttendanceAbsenceSmsService {
    private processing;
    private schoolNameCache;
    runScheduledDispatch(now?: Date): Promise<void>;
    private getTimeContext;
    private isTimeReached;
    private timeToMinutes;
    private processClass;
    private getSchoolName;
    private canNotifyParent;
    private buildMessage;
}
export declare const attendanceAbsenceSmsService: AttendanceAbsenceSmsService;
type SmsLogStatus = 'pending' | 'sent' | 'failed';
interface ListAbsenceSmsLogsOptions {
    schoolId: string;
    status?: SmsLogStatus;
    date?: string;
    page?: number;
    limit?: number;
    messageQuery?: string;
}
export declare function listAbsenceSmsLogs(options: ListAbsenceSmsLogsOptions): Promise<{
    data: (import("mongoose").FlattenMaps<import("./absence-sms-log.interface").IAbsenceSmsLogDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare function getAbsenceSmsOverview(schoolId: string, date?: string): Promise<{
    dateKey: string;
    timezone: string;
    currentTime: string;
    nextDispatchCheck: string;
    totals: {
        pendingBeforeCutoff: number;
        pendingAfterCutoff: number;
        sentToday: number;
        failedToday: number;
    };
    classes: {
        classKey: string;
        grade: number;
        section: string;
        className: string;
        sendAfterTime: string;
        pendingBeforeCutoff: number;
        pendingAfterCutoff: number;
        sentCount: number;
        failedCount: number;
        totalAbsent: number;
    }[];
    pending: {
        classKey: string;
        className: string;
        grade: number;
        section: string;
        sendAfterTime: string;
        pendingBeforeCutoff: number;
        pendingAfterCutoff: number;
        sentCount: number;
        failedCount: number;
    }[];
}>;
export declare function triggerAbsenceSmsRun(): Promise<{
    triggeredAt: string;
}>;
export declare function sendAbsenceSmsTest(params: {
    phoneNumber: string;
    studentName?: string;
    schoolName?: string;
    message?: string;
    senderName?: string;
}): Promise<{
    status: "sent" | "failed";
    resourceId: string | undefined;
    error: string | undefined;
}>;
export {};
//# sourceMappingURL=absence-sms.service.d.ts.map