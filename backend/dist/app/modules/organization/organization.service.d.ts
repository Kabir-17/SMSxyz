import { ICreateOrganizationRequest, IUpdateOrganizationRequest, IOrganizationResponse } from './organization.interface';
declare class OrganizationService {
    createOrganization(organizationData: ICreateOrganizationRequest): Promise<IOrganizationResponse>;
    getOrganizations(queryParams: {
        page: number;
        limit: number;
        status?: string;
        search?: string;
        sortBy: string;
        sortOrder: string;
    }): Promise<{
        organizations: IOrganizationResponse[];
        totalCount: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }>;
    getOrganizationById(id: string): Promise<IOrganizationResponse>;
    updateOrganization(id: string, updateData: IUpdateOrganizationRequest): Promise<IOrganizationResponse>;
    deleteOrganization(id: string): Promise<void>;
    getActiveOrganizations(): Promise<IOrganizationResponse[]>;
    getOrganizationStats(id: string): Promise<{
        organization: IOrganizationResponse;
        stats: {
            totalSchools: number;
            activeSchools: number;
            totalStudents: number;
            totalTeachers: number;
        };
    }>;
    private formatOrganizationResponse;
}
export declare const organizationService: OrganizationService;
export {};
//# sourceMappingURL=organization.service.d.ts.map