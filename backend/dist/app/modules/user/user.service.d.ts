import { ICreateUserRequest, IUpdateUserRequest, IChangePasswordRequest, IUserResponse, ILoginRequest, ILoginResponse, UserRole } from './user.interface';
declare class UserService {
    createUser(userData: ICreateUserRequest): Promise<IUserResponse>;
    getUsers(queryParams: {
        page: number;
        limit: number;
        schoolId?: string;
        role?: string;
        isActive?: string;
        search?: string;
        sortBy: string;
        sortOrder: string;
    }): Promise<{
        users: IUserResponse[];
        totalCount: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }>;
    getUserById(id: string): Promise<IUserResponse>;
    updateUser(id: string, updateData: IUpdateUserRequest): Promise<IUserResponse>;
    deleteUser(id: string): Promise<void>;
    changePassword(id: string, passwordData: IChangePasswordRequest): Promise<void>;
    forcePasswordChange(id: string, newPassword: string): Promise<void>;
    resetPassword(id: string, newPassword: string): Promise<void>;
    login(loginData: ILoginRequest): Promise<ILoginResponse>;
    getUsersBySchool(schoolId: string): Promise<IUserResponse[]>;
    getUsersByRole(role: UserRole): Promise<IUserResponse[]>;
    private formatUserResponse;
}
export declare const userService: UserService;
export {};
//# sourceMappingURL=user.service.d.ts.map