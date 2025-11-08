interface TeacherCredentials {
    teacherId: string;
    username: string;
    password: string;
    temporaryPassword: boolean;
}
interface CredentialsResponse {
    credentials: TeacherCredentials;
    message: string;
}
export declare class TeacherCredentialsService {
    static generateTeacherCredentials(teacherId: string, firstName: string, lastName: string): Promise<TeacherCredentials>;
    static saveTeacherCredentials(schoolId: string, credentials: TeacherCredentials): Promise<void>;
    static getTeacherCredentials(teacherId: string): Promise<CredentialsResponse | null>;
    static resetTeacherPassword(teacherId: string): Promise<CredentialsResponse>;
    static getSchoolTeachersCredentials(schoolId: string): Promise<TeacherCredentials[]>;
}
export {};
//# sourceMappingURL=teacher.credentials.service.d.ts.map