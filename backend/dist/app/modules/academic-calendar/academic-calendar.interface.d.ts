import { Document, Types, Model } from "mongoose";
export interface IAcademicCalendar {
    schoolId: Types.ObjectId;
    eventTitle: string;
    eventDescription?: string;
    eventType: "holiday" | "exam" | "meeting" | "event" | "sports" | "cultural" | "parent-teacher" | "other";
    startDate: Date;
    endDate: Date;
    isAllDay: boolean;
    startTime?: string;
    endTime?: string;
    venue?: string;
    targetAudience: "all" | "students" | "teachers" | "parents" | "staff" | "specific";
    specificAudience?: {
        grades?: number[];
        sections?: string[];
        teacherIds?: Types.ObjectId[];
        studentIds?: Types.ObjectId[];
    };
    priority: "low" | "medium" | "high" | "urgent";
    isRecurring: boolean;
    recurrencePattern?: {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval: number;
        daysOfWeek?: number[];
        dayOfMonth?: number;
        endDate?: Date;
        occurrences?: number;
    };
    color?: string;
    attachments?: string[];
    notificationSent: boolean;
    notificationDate?: Date;
    reminderDays: number[];
    createdBy: Types.ObjectId;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IAcademicCalendarDocument extends IAcademicCalendar, Document, IAcademicCalendarMethods {
    _id: Types.ObjectId;
}
export interface IAcademicCalendarMethods {
    isUpcoming(): boolean;
    isOngoing(): boolean;
    isPast(): boolean;
    getDuration(): number;
    getDaysUntilEvent(): number;
    isTargetedTo(userType: string, userId?: string, grade?: number, section?: string): boolean;
    getFormattedDateRange(): string;
    needsReminder(days: number): boolean;
}
export interface IAcademicCalendarModel extends Model<IAcademicCalendarDocument> {
    findBySchool(schoolId: string): Promise<IAcademicCalendarDocument[]>;
    findUpcoming(schoolId: string, days?: number): Promise<IAcademicCalendarDocument[]>;
    findByDateRange(schoolId: string, startDate: Date, endDate: Date): Promise<IAcademicCalendarDocument[]>;
    findByEventType(schoolId: string, eventType: string): Promise<IAcademicCalendarDocument[]>;
    findForUser(schoolId: string, userType: string, userId?: string, grade?: number, section?: string): Promise<IAcademicCalendarDocument[]>;
    getMonthlyCalendar(schoolId: string, year: number, month: number): Promise<IMonthlyCalendar>;
    getHolidays(schoolId: string, startDate: Date, endDate: Date): Promise<IAcademicCalendarDocument[]>;
    getEventsNeedingReminders(): Promise<IAcademicCalendarDocument[]>;
}
export interface ICreateCalendarEventRequest {
    schoolId: string;
    eventTitle: string;
    eventDescription?: string;
    eventType: "holiday" | "exam" | "meeting" | "celebration" | "sports" | "academic" | "other";
    startDate: string;
    endDate: string;
    isAllDay: boolean;
    startTime?: string;
    endTime?: string;
    venue?: string;
    targetAudience: "all" | "students" | "teachers" | "parents" | "staff" | "specific";
    specificAudience?: {
        grades?: number[];
        sections?: string[];
        teacherIds?: string[];
        studentIds?: string[];
    };
    priority: "low" | "medium" | "high" | "urgent";
    isRecurring: boolean;
    recurrencePattern?: {
        frequency: "daily" | "weekly" | "monthly" | "yearly";
        interval: number;
        daysOfWeek?: number[];
        dayOfMonth?: number;
        endDate?: string;
        occurrences?: number;
    };
    color?: string;
    reminderDays?: number[];
}
export interface IUpdateCalendarEventRequest {
    eventTitle?: string;
    eventDescription?: string;
    eventType?: "holiday" | "exam" | "meeting" | "celebration" | "sports" | "academic" | "other";
    startDate?: string;
    endDate?: string;
    isAllDay?: boolean;
    startTime?: string;
    endTime?: string;
    venue?: string;
    targetAudience?: "all" | "students" | "teachers" | "parents" | "staff" | "specific";
    specificAudience?: {
        grades?: number[];
        sections?: string[];
        teacherIds?: string[];
        studentIds?: string[];
    };
    priority?: "low" | "medium" | "high" | "urgent";
    color?: string;
    reminderDays?: number[];
    isActive?: boolean;
}
export interface IAcademicCalendarResponse {
    id: string;
    schoolId: string;
    eventTitle: string;
    eventDescription?: string;
    eventType: string;
    startDate: Date;
    endDate: Date;
    isAllDay: boolean;
    startTime?: string;
    endTime?: string;
    venue?: string;
    targetAudience: string;
    specificAudience?: {
        grades?: number[];
        sections?: string[];
        teacherIds?: string[];
        studentIds?: string[];
    };
    priority: string;
    isRecurring: boolean;
    recurrencePattern?: {
        frequency: string;
        interval: number;
        daysOfWeek?: number[];
        dayOfMonth?: number;
        endDate?: Date;
        occurrences?: number;
    };
    color?: string;
    duration: number;
    daysUntilEvent: number;
    status: "upcoming" | "ongoing" | "past";
    formattedDateRange: string;
    notificationSent: boolean;
    reminderDays: number[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    school?: {
        id: string;
        name: string;
    };
    createdBy?: {
        id: string;
        fullName: string;
    };
    examDetails?: {
        subjectId: string;
        totalMarks: number;
        passingMarks: number;
        duration: number;
        instructions?: string;
    };
}
export interface IMonthlyCalendar {
    year: number;
    month: number;
    monthName: string;
    events: Array<{
        date: number;
        events: IAcademicCalendarResponse[];
    }>;
    summary: {
        totalEvents: number;
        holidays: number;
        exams: number;
        meetings: number;
        celebrations: number;
        sports: number;
        academic: number;
        other: number;
    };
    weekdays: string[];
    daysInMonth: number;
    startDayOfWeek: number;
}
export interface ICalendarStats {
    totalEvents: number;
    upcomingEvents: number;
    eventsByType: {
        [key: string]: {
            total: number;
            upcoming: number;
        };
    };
}
export interface IExamSchedule {
    examPeriod: IAcademicCalendarResponse;
    examSchedules: IAcademicCalendarResponse[];
}
export interface ICreateExamScheduleRequest {
    schoolId: string;
    examName: string;
    description?: string;
    startDate: string;
    endDate: string;
    grades: number[];
    examSchedules: Array<{
        subjectId: string;
        subjectName: string;
        grade: number;
        sections: string[];
        examDate: string;
        startTime: string;
        endTime: string;
        totalMarks: number;
        passingMarks: number;
        duration: number;
        instructions?: string;
    }>;
    createdBy: string;
}
export interface ICalendarFilters {
    schoolId?: string;
    eventType?: string;
    priority?: string;
    targetAudience?: string;
    startDate?: Date;
    endDate?: Date;
    isRecurring?: boolean;
    isActive?: boolean;
    createdBy?: string;
    grade?: number;
    section?: string;
    venue?: string;
}
export interface IReminder {
    eventId: string;
    eventTitle: string;
    eventDate: Date;
    reminderDate: Date;
    daysUntil: number;
    targetAudience: string;
    recipients: Array<{
        userId: string;
        userType: string;
        email?: string;
        phone?: string;
    }>;
}
export interface IRecurringEventInstance {
    originalEventId: string;
    instanceDate: Date;
    eventTitle: string;
    eventType: string;
    isModified: boolean;
    modifications?: Partial<IAcademicCalendar>;
}
export interface ICreateAcademicCalendarRequest {
    title: string;
    description?: string;
    eventType: "holiday" | "exam" | "meeting" | "event" | "sports" | "cultural" | "parent-teacher" | "other";
    startDate: string;
    endDate: string;
    isAllDay: boolean;
    startTime?: string;
    endTime?: string;
    location?: string;
    organizerId: string;
    schoolId: string;
    targetAudience: {
        allSchool: boolean;
        grades?: string[];
        classes?: string[];
        teachers?: string[];
        students?: string[];
        parents?: string[];
    };
    priority: "low" | "medium" | "high";
    status: "draft" | "published" | "cancelled";
    isRecurring: boolean;
    recurrence?: {
        frequency?: "daily" | "weekly" | "monthly" | "yearly";
        interval?: number;
        endDate?: string;
        occurrences?: number;
    };
    attachments?: Array<{
        fileName: string;
        filePath: string;
        fileSize: number;
        mimeType: string;
    }>;
    metadata?: Record<string, any>;
}
export interface IUpdateAcademicCalendarRequest {
    title?: string;
    description?: string;
    eventType?: "holiday" | "exam" | "meeting" | "event" | "sports" | "cultural" | "parent-teacher" | "other";
    startDate?: string;
    endDate?: string;
    isAllDay?: boolean;
    startTime?: string;
    endTime?: string;
    location?: string;
    targetAudience?: {
        allSchool: boolean;
        grades?: string[];
        classes?: string[];
        teachers?: string[];
        students?: string[];
        parents?: string[];
    };
    priority?: "low" | "medium" | "high";
    status?: "draft" | "published" | "cancelled";
    isRecurring?: boolean;
    recurrence?: {
        frequency?: "daily" | "weekly" | "monthly" | "yearly";
        interval?: number;
        endDate?: string;
        occurrences?: number;
    };
    attachments?: Array<{
        fileName: string;
        filePath: string;
        fileSize: number;
        mimeType: string;
    }>;
    metadata?: Record<string, any>;
}
//# sourceMappingURL=academic-calendar.interface.d.ts.map