import { Types } from "mongoose";
import { ICreateParentRequest, IUpdateParentRequest, IParentResponse, IParentStats } from "./parent.interface";
declare class ParentService {
    createParent(parentData: ICreateParentRequest): Promise<IParentResponse>;
    getParents(queryParams: {
        page: number;
        limit: number;
        schoolId?: string;
        relationship?: string;
        isActive?: string;
        search?: string;
        sortBy: string;
        sortOrder: string;
    }): Promise<{
        parents: IParentResponse[];
        totalCount: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }>;
    getParentById(id: string): Promise<IParentResponse>;
    updateParent(id: string, updateData: IUpdateParentRequest): Promise<IParentResponse>;
    deleteParent(id: string): Promise<void>;
    getParentStats(schoolId: string): Promise<IParentStats>;
    private formatParentResponse;
    getChildDisciplinaryActions(userId: string): Promise<{
        actions: {
            id: any;
            studentName: string;
            studentRoll: any;
            grade: any;
            section: any;
            teacherName: string;
            actionType: any;
            severity: any;
            category: any;
            title: any;
            description: any;
            reason: any;
            status: any;
            issuedDate: any;
            isRedWarrant: any;
            warrantLevel: any;
            parentNotified: any;
            studentAcknowledged: any;
            followUpRequired: any;
            followUpDate: any;
            resolutionNotes: any;
            canAppeal: any;
            isOverdue: any;
        }[];
        stats: import("../disciplinary/disciplinary.interface").IDisciplinaryStats;
        childrenCount: number;
    }>;
    getParentDashboard(parentUserId: string): Promise<{
        parent: {
            id: Types.ObjectId;
            parentId: string;
            fullName: string;
            relationship: "Father" | "Mother" | "Guardian" | "Step Parent" | "Foster Parent" | "Grandparent" | "Other";
        };
        children: {
            id: any;
            studentId: any;
            firstName: any;
            lastName: any;
            fullName: string;
            grade: any;
            section: any;
            rollNumber: any;
        }[];
        stats: {
            totalChildren: number;
            totalAttendanceAlerts: number;
            totalPendingHomework: number;
            totalUpcomingEvents: number;
            totalNotices: number;
        };
    }>;
    getParentChildren(parentUserId: string): Promise<{
        children: {
            id: any;
            studentId: any;
            fullName: string;
            firstName: any;
            lastName: any;
            email: any;
            phone: any;
            grade: any;
            section: any;
            rollNumber: any;
            school: any;
        }[];
    }>;
    getChildAttendance(parentUserId: string, childId: string, filters?: {
        month?: number;
        year?: number;
    }): Promise<{
        child: {
            id: Types.ObjectId;
            studentId: string;
            fullName: string;
            grade: number;
            section: string;
        };
        month: number;
        year: number;
        summary: {
            totalDays: number;
            presentDays: number;
            absentDays: number;
            lateDays: number;
            attendancePercentage: number;
        };
        records: any[];
    }>;
    getChildHomework(parentUserId: string, childId: string): Promise<{
        child: {
            id: Types.ObjectId;
            studentId: string;
            fullName: string;
            grade: number;
            section: string;
        };
        summary: {
            totalHomework: number;
            completedHomework: number;
            pendingHomework: number;
            overdueHomework: number;
            completionRate: number;
        };
        homework: {
            homeworkId: any;
            title: any;
            description: any;
            instructions: any;
            subject: any;
            subjectCode: any;
            teacherName: string;
            teacherId: any;
            homeworkType: any;
            priority: any;
            assignedDate: any;
            dueDate: any;
            estimatedDuration: any;
            totalMarks: any;
            passingMarks: any;
            submissionType: any;
            allowLateSubmission: any;
            latePenalty: any;
            maxLateDays: any;
            isGroupWork: any;
            maxGroupSize: any;
            rubric: any;
            tags: any;
            status: any;
            submittedAt: any;
            marksObtained: any;
            grade: any;
            feedback: any;
            attachments: any;
            isLate: any;
            isOverdue: boolean;
            daysUntilDue: number;
        }[];
    }>;
    getChildSchedule(parentUserId: string, childId: string): Promise<{
        child: {
            id: Types.ObjectId;
            studentId: string;
            fullName: string;
            grade: number;
            section: string;
        };
        scheduleByDay: {
            day: string;
            periods: any[];
        }[];
        totalPeriods: number;
    }>;
    getChildNotices(parentUserId: string, childId: string): Promise<{
        notices: {
            id: Types.ObjectId;
            title: string;
            content: string;
            type: "announcement" | "warning" | "red_warrant" | "attendance_alert" | "homework_assigned" | "grade_published" | "disciplinary_warning" | "punishment_issued";
            priority: "low" | "medium" | "high" | "urgent";
            targetAudience: "admin" | "teacher" | "student" | "parent";
            createdAt: Date | undefined;
            isRead: boolean;
            createdBy: string;
        }[];
    }>;
}
export declare const parentService: ParentService;
export {};
//# sourceMappingURL=parent.service.d.ts.map