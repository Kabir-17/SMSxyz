export interface GeneratedCredentials {
    username: string;
    password: string;
    hashedPassword: string;
    requiresPasswordChange: boolean;
}
export interface StudentIdComponents {
    admissionYear: number;
    grade: string;
    rollNumber: number;
    schoolCode?: string;
}
export interface TeacherIdComponents {
    joiningYear: number;
    sequenceNumber: number;
    schoolCode?: string;
}
export declare class CredentialGenerator {
    static calculateAge(dob: Date): number;
    static generateUniqueStudentId(admissionYear: number, grade: string, schoolId: string): Promise<{
        studentId: string;
        rollNumber: number;
    }>;
    static validateStudentIdFormat(studentId: string): boolean;
    static parseStudentId(studentId: string): StudentIdComponents;
    static generatePassword(length?: number): string;
    static generateStudentUsername(studentId: string): string;
    static generateParentUsername(studentId: string): string;
    static hashPassword(password: string): Promise<string>;
    static generateStudentCredentials(studentId: string): Promise<GeneratedCredentials>;
    static generateParentCredentials(studentId: string): Promise<GeneratedCredentials>;
    static generateBothCredentials(studentId: string): Promise<{
        student: GeneratedCredentials;
        parent: GeneratedCredentials;
    }>;
    static generateTeacherCredentials(firstName: string, lastName: string, teacherId: string): Promise<GeneratedCredentials>;
    static checkUsernameAvailability(usernames: string[]): Promise<boolean>;
    static generateStudentRegistration(admissionYear: number, grade: string, schoolId: string): Promise<{
        studentId: string;
        rollNumber: number;
        credentials: {
            student: GeneratedCredentials;
            parent: GeneratedCredentials;
        };
    }>;
    static generateUniqueTeacherId(joiningYear: number, schoolId: string, designation?: string): Promise<{
        teacherId: string;
        employeeId: string;
        sequenceNumber: number;
    }>;
    static generateUniqueAccountantId(joiningYear: number, schoolId: string, designation?: string): Promise<{
        accountantId: string;
        employeeId: string;
        sequenceNumber: number;
    }>;
    static generateAccountantCredentials(firstName: string, lastName: string, accountantId: string): Promise<GeneratedCredentials>;
    static validateTeacherIdFormat(teacherId: string): boolean;
    static parseTeacherId(teacherId: string): TeacherIdComponents;
    static generateUniqueParentId(registrationYear: number, schoolId: string): Promise<{
        parentId: string;
        sequenceNumber: number;
    }>;
    static generateUniqueAdminId(schoolId: string): Promise<{
        adminId: string;
        sequenceNumber: number;
    }>;
    static formatTeacherCredentials(teacherName: string, credentials: GeneratedCredentials): CredentialDisplay;
}
export declare const calculateAge: (dob: Date) => number;
export interface CredentialDisplay {
    type: "student" | "parent" | "teacher";
    name: string;
    username: string;
    password: string;
    message: string;
}
export declare class CredentialFormatter {
    static formatStudentCredentials(studentName: string, credentials: GeneratedCredentials): CredentialDisplay;
    static formatParentCredentials(parentName: string, studentName: string, credentials: GeneratedCredentials): CredentialDisplay;
    static formatBothCredentials(studentName: string, parentName: string, studentCredentials: GeneratedCredentials, parentCredentials: GeneratedCredentials): {
        student: CredentialDisplay;
        parent: CredentialDisplay;
    };
}
//# sourceMappingURL=credentialGenerator.d.ts.map