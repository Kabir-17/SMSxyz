import { Types } from "mongoose";
import { ITeacherAssignment, IAssessmentSummary, IStudentAssessmentRow } from "./assessment.interface";
type AuthUser = {
    id: string;
    role: string;
    schoolId?: string;
};
interface CreateAssessmentPayload {
    subjectId: string;
    subjectName?: string;
    grade: number;
    section: string;
    examName: string;
    examDate: string;
    totalMarks: number;
    note?: string;
    categoryId?: string;
    categoryLabel?: string;
    academicYear?: string;
}
interface UpdateAssessmentPayload {
    examName?: string;
    examDate?: string;
    totalMarks?: number;
    note?: string | null;
    categoryId?: string | null;
    categoryLabel?: string | null;
    academicYear?: string;
}
interface TeacherAssessmentFilters {
    subjectId?: string;
    grade?: number;
    section?: string;
    includeStats?: boolean;
}
interface TeacherPerformanceFilters {
    subjectId: string;
    grade: number;
    section: string;
}
interface AdminAssessmentFilters {
    schoolId: string;
    grade?: number;
    section?: string;
    subjectId?: string;
    includeStats?: boolean;
    searchTerm?: string;
    includeHidden?: boolean;
    onlyFavorites?: boolean;
    categoryId?: string;
    teacherId?: string;
    sortBy?: "examDate" | "averagePercentage" | "totalMarks" | "gradedCount" | "examName";
    sortDirection?: "asc" | "desc";
    fromDate?: Date;
    toDate?: Date;
    assessmentIds?: string[];
}
interface AdminAssessmentListItem {
    id: string;
    examName: string;
    examTypeLabel?: string | null;
    examDate?: Date | null;
    totalMarks: number;
    grade: number;
    section: string;
    subject: {
        id: string;
        name: string;
        code?: string;
    };
    teacher?: {
        id: string;
        name?: string;
    };
    category?: {
        id?: string;
        name?: string | null;
    };
    gradedCount: number;
    averagePercentage: number;
    highestPercentage: number;
    lowestPercentage: number;
    isFavorite: boolean;
    isHidden: boolean;
    createdAt: Date;
    updatedAt: Date;
}
interface AdminAssessmentSubjectGroup {
    subjectId: string;
    subjectName: string;
    subjectCode?: string;
    totalAssessments: number;
    visibleAssessments: number;
    hiddenCount: number;
    favoritesCount: number;
    averagePercentage: number;
    latestExamDate?: Date | null;
    assessments: AdminAssessmentListItem[];
}
interface AdminAssessmentOverview {
    totalAssessments: number;
    visibleAssessments: number;
    hiddenCount: number;
    favoritesCount: number;
    averagePercentage: number;
    lastUpdatedAt?: Date | null;
}
interface AdminAssessmentFilterOptions {
    subjects: Array<{
        id: string;
        name: string;
        code?: string;
    }>;
    categories: Array<{
        id: string;
        name: string;
    }>;
    teachers: Array<{
        id: string;
        name: string;
    }>;
}
interface AdminAssessmentResponse {
    overview: AdminAssessmentOverview;
    subjectGroups: AdminAssessmentSubjectGroup[];
    filters: AdminAssessmentFilterOptions;
}
interface ExportOptions {
    format: "csv" | "xlsx";
    filename: string;
}
declare class AssessmentService {
    private escapeRegex;
    private normalizeObjectId;
    private resolveSubjectObjectId;
    private getGradeLetter;
    private buildEmptyAdminAssessmentResponse;
    private resolveTeacher;
    private ensureTeacherAssignment;
    private getStudentCountMap;
    private ensureStudentBelongsToClass;
    getTeacherAssignments(userId: string): Promise<ITeacherAssignment[]>;
    createAssessment(user: AuthUser, payload: CreateAssessmentPayload): Promise<import("mongoose").Document<unknown, {}, import("./assessment.interface").IAssessmentDocument, {}, {}> & import("./assessment.interface").IAssessmentDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    listTeacherAssessments(user: AuthUser, filters: TeacherAssessmentFilters): Promise<{
        assessments: IAssessmentSummary[];
        stats: {
            totalAssessments: number;
            totalStudentsEvaluated: number;
            averagePercentage: number;
        };
    }>;
    getAssessmentDetails(user: AuthUser, assessmentId: string): Promise<{
        assessment: {
            id: string;
            examName: string;
            examTypeLabel: string | null | undefined;
            examDate: Date;
            totalMarks: number;
            note: string | undefined;
            grade: number;
            section: string;
            subject: Types.ObjectId;
            teacher: Types.ObjectId;
            academicYear: string | undefined;
        };
        students: {
            studentId: any;
            studentCode: any;
            studentName: any;
            rollNumber: any;
            marksObtained: any;
            percentage: any;
            grade: any;
            remarks: any;
        }[];
    }>;
    updateAssessment(user: AuthUser, assessmentId: string, updates: UpdateAssessmentPayload): Promise<import("mongoose").Document<unknown, {}, import("./assessment.interface").IAssessmentDocument, {}, {}> & import("./assessment.interface").IAssessmentDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteAssessment(user: AuthUser, assessmentId: string): Promise<{
        success: boolean;
    }>;
    saveAssessmentResults(user: AuthUser, assessmentId: string, results: Array<{
        studentId: string;
        marksObtained: number;
        remarks?: string;
    }>): Promise<{
        gradedCount: number;
        totalStudents: number;
    }>;
    private buildCsv;
    private buildWorkbook;
    exportAssessment(user: AuthUser, assessmentId: string, options: ExportOptions): Promise<{
        buffer: Buffer;
        filename: string;
        mimeType: string;
    }>;
    getTeacherPerformanceMatrix(user: AuthUser, filters: TeacherPerformanceFilters): Promise<{
        assessments: {
            id: string;
            examName: string;
            examTypeLabel: string | null | undefined;
            examDate: Date;
            totalMarks: number;
            gradedCount: number;
            averagePercentage: number;
        }[];
        students: IStudentAssessmentRow[];
    }>;
    exportTeacherAssessments(user: AuthUser, filters: TeacherPerformanceFilters, options: ExportOptions): Promise<{
        buffer: Buffer;
        filename: string;
        mimeType: string;
    }>;
    exportAdminAssessments(user: AuthUser, filters: AdminAssessmentFilters & {
        format: "csv" | "xlsx";
    }): Promise<{
        buffer: Buffer;
        filename: string;
        mimeType: string;
    }>;
    listCategories(user: AuthUser): Promise<{
        id: string;
        name: string;
        description: string | undefined;
        order: number | undefined;
        isDefault: boolean;
        isActive: boolean;
    }[]>;
    createCategory(user: AuthUser, payload: any): Promise<import("mongoose").Document<unknown, {}, import("./assessment.interface").IAssessmentCategoryDocument, {}, {}> & import("./assessment.interface").IAssessmentCategoryDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateCategory(user: AuthUser, categoryId: string, payload: any): Promise<import("mongoose").Document<unknown, {}, import("./assessment.interface").IAssessmentCategoryDocument, {}, {}> & import("./assessment.interface").IAssessmentCategoryDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    listAdminAssessments(user: AuthUser, filters: AdminAssessmentFilters): Promise<AdminAssessmentResponse>;
    getStudentOverview(studentId: Types.ObjectId): Promise<{
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
    getStudentAssessments(user: AuthUser, studentId?: string): Promise<{
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
    updateAdminAssessmentPreference(user: AuthUser, assessmentId: string, payload: {
        isFavorite?: boolean;
        isHidden?: boolean;
    }): Promise<{
        assessmentId: string;
        isFavorite: boolean;
        isHidden: boolean;
    }>;
    getAdminClassCatalog(user: AuthUser): Promise<{
        grade: any;
        section: any;
        className: any;
        subjects: any;
    }[]>;
}
export declare const assessmentService: AssessmentService;
export {};
//# sourceMappingURL=assessment.service.d.ts.map