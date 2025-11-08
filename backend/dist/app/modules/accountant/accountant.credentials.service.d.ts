interface AccountantCredentials {
    accountantId: string;
    username: string;
    password: string;
    temporaryPassword: boolean;
}
interface CredentialsResponse {
    credentials: AccountantCredentials;
    message: string;
}
export declare class AccountantCredentialsService {
    static generateAccountantCredentials(accountantId: string, firstName: string, lastName: string): Promise<AccountantCredentials>;
    static saveAccountantCredentials(schoolId: string, credentials: AccountantCredentials): Promise<void>;
    static getAccountantCredentials(accountantId: string): Promise<CredentialsResponse | null>;
    static resetAccountantPassword(accountantId: string): Promise<CredentialsResponse>;
    static getSchoolAccountantsCredentials(schoolId: string): Promise<AccountantCredentials[]>;
}
export {};
//# sourceMappingURL=accountant.credentials.service.d.ts.map