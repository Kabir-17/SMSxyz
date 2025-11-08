import { ICreateAcademicCalendarRequest, IUpdateAcademicCalendarRequest, IAcademicCalendarResponse, ICalendarStats, IExamSchedule, ICreateExamScheduleRequest } from "./academic-calendar.interface";
declare class AcademicCalendarService {
    createCalendarEvent(eventData: ICreateAcademicCalendarRequest): Promise<IAcademicCalendarResponse>;
    getCalendarEvents(queryParams: {
        page: number;
        limit: number;
        schoolId?: string;
        eventType?: string;
        startDate?: string;
        endDate?: string;
        targetAudience?: string;
        isActive?: string;
        search?: string;
        sortBy: string;
        sortOrder: string;
    }): Promise<{
        events: IAcademicCalendarResponse[];
        totalCount: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }>;
    getCalendarEventById(id: string): Promise<IAcademicCalendarResponse>;
    updateCalendarEvent(id: string, updateData: IUpdateAcademicCalendarRequest): Promise<IAcademicCalendarResponse>;
    deleteCalendarEvent(id: string): Promise<void>;
    getCalendarStats(schoolId: string): Promise<ICalendarStats>;
    createExamSchedule(examData: ICreateExamScheduleRequest): Promise<IExamSchedule>;
    private getDefaultColor;
    private formatCalendarEventResponse;
    private calculateDurationInMinutes;
    private formatDateRange;
}
export declare const academicCalendarService: AcademicCalendarService;
export {};
//# sourceMappingURL=academic-calendar.service.d.ts.map