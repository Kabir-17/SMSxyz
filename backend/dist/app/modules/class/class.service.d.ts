import { ICreateClassRequest, IUpdateClassRequest, IClassResponse, IClassStats, ICapacityCheck } from './class.interface';
declare class ClassService {
    createClass(schoolId: string, classData: ICreateClassRequest): Promise<IClassResponse>;
    getClasses(queryParams: {
        page: number;
        limit: number;
        schoolId?: string;
        grade?: number;
        section?: string;
        academicYear?: string;
        isActive?: boolean;
        sortBy: string;
        sortOrder: string;
    }): Promise<{
        classes: IClassResponse[];
        totalCount: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }>;
    getClassById(id: string): Promise<IClassResponse>;
    updateClass(id: string, updateData: IUpdateClassRequest): Promise<IClassResponse>;
    deleteClass(id: string): Promise<void>;
    getClassesByGrade(schoolId: string, grade: number): Promise<IClassResponse[]>;
    getClassByGradeAndSection(schoolId: string, grade: number, section: string): Promise<IClassResponse | null>;
    getClassStats(schoolId: string): Promise<IClassStats>;
    checkCapacity(schoolId: string, grade: number): Promise<ICapacityCheck>;
    createNewSectionIfNeeded(schoolId: string, grade: number, academicYear: string, maxStudents?: number): Promise<IClassResponse | null>;
    private formatClassResponse;
    private normalizeAbsenceSmsSettingsForCreate;
    private normalizeAbsenceSmsSettingsForUpdate;
}
export declare const classService: ClassService;
export {};
//# sourceMappingURL=class.service.d.ts.map