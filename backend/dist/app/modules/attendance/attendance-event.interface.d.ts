import { Document, Types } from "mongoose";
export interface IAttendanceEvent {
    schoolId: Types.ObjectId;
    eventId: string;
    descriptor: string;
    studentId: string;
    firstName: string;
    age: string;
    grade: string;
    section: string;
    bloodGroup: string;
    capturedAt: Date;
    capturedDate: string;
    capturedTime: string;
    payload: IAutoAttendEventPayload;
    source: IAutoAttendSource;
    status: "captured" | "reviewed" | "superseded" | "ignored";
    test: boolean;
    processedAt?: Date;
    processedBy?: Types.ObjectId;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IAttendanceEventDocument extends IAttendanceEvent, Document {
    _id: Types.ObjectId;
}
export interface IAutoAttendEventPayload {
    event: {
        eventId: string;
        descriptor: string;
        studentId: string;
        firstName: string;
        age: string;
        grade: string;
        section: string;
        bloodGroup: string;
        capturedAt: string;
        capturedDate: string;
        capturedTime: string;
    };
    source: IAutoAttendSource;
    test: boolean;
}
export interface IAutoAttendSource {
    app: string;
    version: string;
    deviceId?: string;
}
export interface IAutoAttendRequest {
    event: {
        eventId: string;
        descriptor: string;
        studentId: string;
        firstName: string;
        age: string;
        grade: string;
        section: string;
        bloodGroup: string;
        capturedAt: string;
        capturedDate: string;
        capturedTime: string;
    };
    source: {
        app: string;
        version: string;
        deviceId?: string;
    };
    test?: boolean;
}
export interface IAutoAttendResponse {
    success: boolean;
    processed: boolean;
    message: string;
    eventId: string;
    timestamp?: string;
}
export interface IAttendanceEventFilters {
    schoolId?: string;
    studentId?: string;
    status?: "captured" | "reviewed" | "superseded" | "ignored";
    startDate?: Date;
    endDate?: Date;
    grade?: string;
    section?: string;
    test?: boolean;
}
export interface IAttendanceEventStats {
    totalEvents: number;
    capturedEvents: number;
    reviewedEvents: number;
    supersededEvents: number;
    ignoredEvents: number;
    eventsToday: number;
    eventsByGrade: Array<{
        grade: string;
        count: number;
    }>;
    eventsByStatus: Array<{
        status: string;
        count: number;
    }>;
    recentEvents: IAttendanceEventDocument[];
}
//# sourceMappingURL=attendance-event.interface.d.ts.map