import { ICreateAccountantRequest, IUpdateAccountantRequest, IAccountantResponse, IAccountantStats } from "./accountant.interface";
declare class AccountantService {
    createAccountant(accountantData: ICreateAccountantRequest, files?: Express.Multer.File[]): Promise<IAccountantResponse>;
    getAccountants(filters: any): Promise<{
        accountants: IAccountantResponse[];
        totalCount: number;
        currentPage: number;
    }>;
    getAccountantById(id: string): Promise<IAccountantResponse>;
    updateAccountant(id: string, updateData: IUpdateAccountantRequest): Promise<IAccountantResponse>;
    deleteAccountant(id: string): Promise<void>;
    getAccountantStats(schoolId: string): Promise<IAccountantStats>;
    private formatAccountantResponse;
}
export declare const accountantService: AccountantService;
export {};
//# sourceMappingURL=accountant.service.d.ts.map