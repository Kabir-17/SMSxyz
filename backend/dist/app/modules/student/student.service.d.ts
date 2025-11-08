import { Types } from "mongoose";
import { ICreateStudentRequest, IUpdateStudentRequest, IStudentResponse, IStudentStats, IStudentPhotoResponse } from "./student.interface";
declare class StudentService {
    private deriveGradeLetter;
    private getEventColor;
    createStudent(studentData: ICreateStudentRequest, photos?: Express.Multer.File[], adminUserId?: string): Promise<IStudentResponse>;
    getStudents(queryParams: {
        page: number;
        limit: number;
        schoolId?: string;
        grade?: number;
        section?: string;
        isActive?: string;
        search?: string;
        sortBy: string;
        sortOrder: string;
    }): Promise<{
        students: IStudentResponse[];
        totalCount: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }>;
    getStudentById(id: string): Promise<IStudentResponse>;
    updateStudent(id: string, updateData: IUpdateStudentRequest): Promise<IStudentResponse>;
    deleteStudent(id: string): Promise<void>;
    uploadPhotos(studentId: string, files: Express.Multer.File[]): Promise<IStudentPhotoResponse[]>;
    deletePhoto(studentId: string, photoId: string): Promise<void>;
    getStudentsByGradeAndSection(schoolId: string, grade: number, section: string): Promise<IStudentResponse[]>;
    getStudentStats(schoolId: string): Promise<IStudentStats>;
    getStudentPhotos(studentId: string): Promise<IStudentPhotoResponse[]>;
    getStudentCredentials(studentId: string): Promise<{
        student: {
            id: string;
            username: string;
            password: string;
            email?: string;
            phone?: string;
        };
        parent: {
            id: string;
            username: string;
            password: string;
            email?: string;
            phone?: string;
        };
    } | null>;
    getAvailablePhotoSlots(studentId: string): Promise<number[]>;
    private formatStudentResponse;
    getStudentDashboard(studentId: string): Promise<{
        student: {
            id: Types.ObjectId;
            studentId: string;
            grade: number;
            section: string;
            rollNumber: number | undefined;
            fullName: any;
            email: any;
            phone: any;
        };
        attendancePercentage: number;
        overallGrade: string;
        overallPercentage: number;
        pendingHomework: number;
        todayClasses: number;
        upcomingEvents: number;
        recentGrades: {
            subject: any;
            grade: any;
            percentage: any;
            examDate: any;
            examName: any;
        }[];
        upcomingAssignments: any[];
        upcomingAssessments: {
            id: string;
            examName: string;
            examTypeLabel: string | null | undefined;
            examDate: Date;
            totalMarks: number;
            subjectName: any;
            subjectCode: any;
        }[];
    }>;
    getStudentAttendance(studentId: string): Promise<{
        summary: {
            totalDays: number;
            presentDays: number;
            absentDays: number;
            lateDays: number;
            attendancePercentage: number;
        };
        monthlyStats: any[];
        recentRecords: {
            date: Date;
            status: import("../attendance/day-attendance.interface").DayAttendanceStatus;
            markedAt: Date | undefined;
            autoDetected: boolean;
            teacherMarked: boolean;
            source: "teacher" | "auto" | "finalizer";
        }[];
    }>;
    getStudentGrades(studentId: string): Promise<{
        overall: {
            totalAssessments: number;
            averagePercentage: number;
            highestPercentage: number;
            lowestPercentage: number;
        };
        subjects: {
            subjectId: string;
            subjectName: string;
            assessments: any[];
            totals: {
                obtained: number;
                total: number;
                averagePercentage: number;
            };
        }[];
        recent: any[];
    }>;
    getStudentHomework(studentId: string): Promise<{
        summary: {
            totalHomework: number;
            completedHomework: number;
            pendingHomework: number;
            overdueHomework: number;
            completionRate: number;
        };
        homework: any[];
    }>;
    getStudentSchedule(studentId: string): Promise<{
        grade: number;
        section: string;
        scheduleByDay: {
            day: string;
            periods: any[];
        }[];
        totalPeriods: number;
    }>;
    getStudentCalendar(studentId: string): Promise<{
        events: any[];
        summary: {
            totalEvents: number;
            holidays: number;
            exams: number;
            homework: number;
        };
    }>;
    getStudentDisciplinaryActions(userId: string): Promise<{
        actions: {
            id: any;
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
    }>;
}
export declare const studentService: StudentService;
export {};
//# sourceMappingURL=student.service.d.ts.map