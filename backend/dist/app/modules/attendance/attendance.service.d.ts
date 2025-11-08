import { ICreateAttendanceRequest, IUpdateAttendanceRequest, IAttendanceResponse, IAttendanceStats, IStudentAttendanceReport, IClassAttendanceRequest, IAttendanceFilters } from './attendance.interface';
export declare class AttendanceService {
    static markAttendance(teacherId: string, attendanceData: ICreateAttendanceRequest): Promise<IAttendanceResponse>;
    static updateAttendance(attendanceId: string, studentId: string, userId: string, updateData: IUpdateAttendanceRequest): Promise<IAttendanceResponse>;
    static getAttendanceById(attendanceId: string): Promise<IAttendanceResponse>;
    static getClassAttendance(request: IClassAttendanceRequest): Promise<IAttendanceResponse[]>;
    static getStudentAttendance(studentId: string, startDate: Date, endDate: Date, subjectId?: string): Promise<IAttendanceResponse[]>;
    static getAttendanceStats(schoolId: string, startDate: Date, endDate: Date, filters?: IAttendanceFilters): Promise<IAttendanceStats>;
    static generateStudentAttendanceReport(studentId: string, startDate: Date, endDate: Date): Promise<IStudentAttendanceReport>;
    static getAttendanceByFilters(filters: IAttendanceFilters, page?: number, limit?: number): Promise<{
        attendance: IAttendanceResponse[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    static lockOldAttendance(): Promise<void>;
    private static formatAttendanceResponse;
    private static formatAttendanceResponses;
    private static calculateSubjectWiseAttendance;
    private static calculateMonthlyTrend;
}
//# sourceMappingURL=attendance.service.d.ts.map