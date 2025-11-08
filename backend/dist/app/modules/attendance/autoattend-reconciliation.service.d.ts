export declare class AutoAttendReconciliationService {
    static reconcileAttendanceForPeriod(schoolId: string, date: Date, grade: number, section: string, period?: number): Promise<{
        manualAttendance: any[];
        cameraEvents: any[];
        discrepancies: Array<{
            studentId: string;
            firstName: string;
            issue: string;
            cameraStatus: string | null;
            teacherStatus: string | null;
            capturedAt?: Date;
            markedAt?: Date;
        }>;
        summary: {
            totalStudents: number;
            cameraDetections: number;
            teacherMarks: number;
            matched: number;
            onlyCameraDetected: number;
            onlyTeacherMarked: number;
            statusMismatches: number;
        };
    }>;
    static getStudentCameraEvents(schoolId: string, studentId: string, startDate: Date, endDate: Date): Promise<any[]>;
    static autoMarkFromCameraEvents(schoolId: string, date: Date, grade: number, section: string, classId: string, subjectId: string, period: number): Promise<{
        success: boolean;
        message: string;
        autoMarked: number;
        skipped: number;
    }>;
    static suggestAttendanceFromCamera(schoolId: string, date: Date, grade: number, section: string): Promise<Array<{
        studentId: string;
        suggestedStatus: "present" | "absent" | "late" | "excused";
        reason: string;
        capturedAt?: Date;
    }>>;
}
//# sourceMappingURL=autoattend-reconciliation.service.d.ts.map