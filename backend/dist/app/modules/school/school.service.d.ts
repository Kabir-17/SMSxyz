import { Types } from "mongoose";
import { ICreateSchoolRequest, IUpdateSchoolRequest, ISchoolResponse, ISchoolDocument, ISchoolCredentials, ISchoolStatsResponse, SchoolStatus } from "./school.interface";
declare class SchoolService {
    createSchool(schoolData: ICreateSchoolRequest & {
        createdBy: string;
    }): Promise<{
        school: ISchoolResponse;
        credentials: ISchoolCredentials;
    }>;
    private generateApiKey;
    getSchools(queryParams: {
        page: number;
        limit: number;
        orgId?: string;
        status?: string;
        search?: string;
        sortBy: string;
        sortOrder: string;
    }): Promise<{
        schools: ISchoolResponse[];
        totalCount: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }>;
    getSchoolById(id: string): Promise<ISchoolResponse>;
    updateSchool(id: string, updateData: IUpdateSchoolRequest): Promise<ISchoolResponse>;
    deleteSchool(id: string): Promise<void>;
    getSchoolsByOrganization(orgId: string): Promise<ISchoolResponse[]>;
    validateAdminCredentials(username: string, password: string): Promise<ISchoolDocument | null>;
    private formatSchoolResponse;
    createSchoolModern(schoolData: ICreateSchoolRequest, createdBy: Types.ObjectId): Promise<{
        school: ISchoolResponse;
        credentials: ISchoolCredentials;
    }>;
    getAllSchools(queryParams: {
        page?: number;
        limit?: number;
        status?: SchoolStatus;
        search?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }): Promise<{
        schools: ISchoolResponse[];
        totalCount: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }>;
    getSchoolStats(schoolId: string): Promise<ISchoolStatsResponse>;
    assignAdmin(schoolId: string, adminData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        username: string;
        password: string;
    }): Promise<ISchoolResponse>;
    updateSchoolStatus(schoolId: string, status: SchoolStatus, updatedBy: Types.ObjectId): Promise<ISchoolResponse>;
    getSystemStats(): Promise<{
        totalSchools: number;
        totalStudents: number;
        totalTeachers: number;
        totalParents: number;
        activeSchools: number;
        pendingSchools: number;
        suspendedSchools: number;
        recentActivity: {
            schoolsCreated: number;
            studentsEnrolled: number;
            teachersAdded: number;
        };
    }>;
    regenerateApiKey(schoolId: string): Promise<{
        apiKey: string;
        apiEndpoint: string;
    }>;
    getAdminCredentials(schoolId: string): Promise<{
        username: string;
        password: string;
        fullName: string;
        email: string;
        phone?: string;
        lastLogin?: string;
    }>;
    resetAdminPassword(schoolId: string, newPassword?: string, updatedBy?: Types.ObjectId): Promise<{
        username: string;
        newPassword: string;
        fullName: string;
        email: string;
    }>;
    private generateSecurePassword;
}
export declare const schoolService: SchoolService;
export {};
//# sourceMappingURL=school.service.d.ts.map