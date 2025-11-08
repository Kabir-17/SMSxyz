import { Document, Types, Model } from 'mongoose';
export declare enum SchoolStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING_APPROVAL = "pending_approval"
}
export interface ISchoolAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}
export interface ISchoolContact {
    phone?: string;
    email: string;
    website?: string;
    fax?: string;
}
export interface ISchoolSettings {
    maxStudentsPerSection: number;
    grades: number[];
    sections: string[];
    academicYearStart: number;
    academicYearEnd: number;
    attendanceGracePeriod: number;
    maxPeriodsPerDay: number;
    timezone: string;
    language: string;
    currency: string;
    attendanceLockAfterDays: number;
    maxAttendanceEditHours: number;
    autoAttendFinalizationTime: string;
    sectionCapacity?: {
        [key: string]: {
            maxStudents: number;
            currentStudents: number;
        };
    };
}
export interface IAcademicSession {
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isDefault?: boolean;
}
export interface ISchool {
    orgId?: Types.ObjectId;
    name: string;
    slug: string;
    schoolId: string;
    establishedYear?: number;
    address: ISchoolAddress;
    contact: ISchoolContact;
    status: SchoolStatus;
    adminUserId: Types.ObjectId;
    affiliation?: string;
    recognition?: string;
    settings: ISchoolSettings;
    currentSession?: IAcademicSession;
    academicSessions: IAcademicSession[];
    apiEndpoint: string;
    apiKey: string;
    logo?: string;
    images?: string[];
    isActive: boolean;
    createdBy: Types.ObjectId;
    lastModifiedBy?: Types.ObjectId;
    stats?: {
        totalStudents: number;
        totalTeachers: number;
        totalParents: number;
        totalClasses: number;
        totalSubjects: number;
        attendanceRate: number;
        lastUpdated: Date;
    };
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ISchoolDocument extends ISchool, Document, ISchoolMethods {
    _id: Types.ObjectId;
}
export interface ISchoolMethods {
    generateApiEndpoint(): string;
    generateApiKey(): string;
    regenerateApiKey(): Promise<string>;
    updateStats(): Promise<ISchoolDocument>;
    isCurrentlyActive(): boolean;
    getCurrentAcademicSession(): IAcademicSession | null;
    createNewAcademicSession(session: Omit<IAcademicSession, 'isActive'>): Promise<ISchoolDocument>;
    setActiveAcademicSession(sessionName: string): Promise<ISchoolDocument>;
    getGradesOffered(): number[];
    getSectionsForGrade(grade: number): string[];
    canEnrollStudents(): boolean;
    getMaxStudentsForGrade(grade: number): number;
    createGoogleDriveFolder(): Promise<string>;
    getSectionCapacity(grade: number, section: string): {
        maxStudents: number;
        currentStudents: number;
    };
    setSectionCapacity(grade: number, section: string, maxStudents: number): Promise<ISchoolDocument>;
    updateCurrentStudentCount(grade: number, section: string, increment?: number): Promise<ISchoolDocument>;
    canEnrollInSection(grade: number, section: string): boolean;
    getAvailableSectionsForGrade(grade: number): string[];
    initializeSectionCapacity(): Promise<ISchoolDocument>;
}
export interface ISchoolModel extends Model<ISchoolDocument> {
    findBySlug(slug: string): Promise<ISchoolDocument | null>;
    findBySchoolId(schoolId: string): Promise<ISchoolDocument | null>;
    findByAdmin(adminId: string): Promise<ISchoolDocument | null>;
    findByStatus(status: SchoolStatus): Promise<ISchoolDocument[]>;
    findByApiKey(apiKey: string): Promise<ISchoolDocument | null>;
    findByOrganization(orgId: string): Promise<ISchoolDocument[]>;
    generateUniqueSchoolId(): Promise<string>;
    generateUniqueSlug(name: string): Promise<string>;
    search(query: string): Promise<ISchoolDocument[]>;
}
export interface ICreateSchoolRequest {
    name: string;
    establishedYear?: number;
    address: ISchoolAddress;
    contact: ISchoolContact;
    affiliation?: string;
    recognition?: string;
    adminDetails: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        username: string;
        password: string;
    };
    currentSession?: Omit<IAcademicSession, 'isActive'>;
    settings?: Partial<ISchoolSettings>;
    logo?: string;
    orgId?: string;
}
export interface IUpdateSchoolRequest {
    name?: string;
    establishedYear?: number;
    address?: Partial<ISchoolAddress>;
    contact?: Partial<ISchoolContact>;
    affiliation?: string;
    recognition?: string;
    settings?: Partial<ISchoolSettings>;
    status?: SchoolStatus;
    logo?: string;
    images?: string[];
}
export interface ISchoolResponse {
    id: string;
    _id?: string;
    name: string;
    slug: string;
    schoolId: string;
    establishedYear?: number;
    address: ISchoolAddress;
    contact: ISchoolContact;
    status: SchoolStatus;
    affiliation?: string;
    recognition?: string;
    settings: ISchoolSettings;
    currentSession?: IAcademicSession;
    apiEndpoint: string;
    logo?: string;
    images?: string[];
    isActive: boolean;
    stats?: {
        totalStudents: number;
        totalTeachers: number;
        totalParents: number;
        totalClasses: number;
        totalSubjects: number;
        attendanceRate: number;
        lastUpdated: Date;
    };
    admin?: {
        id: string;
        username: string;
        fullName: string;
        email: string;
        phone: string;
    };
    createdAt: Date;
    updatedAt: Date;
    orgId?: string;
    studentsCount?: number;
    teachersCount?: number;
    organization?: {
        id: string;
        name: string;
    };
}
export interface ISchoolStatsResponse {
    schoolId: string;
    schoolName: string;
    totalStudents: number;
    totalTeachers: number;
    totalParents: number;
    totalClasses: number;
    totalSubjects: number;
    attendanceRate: number;
    enrollmentTrend: {
        month: string;
        students: number;
    }[];
    gradeDistribution: {
        grade: number;
        count: number;
    }[];
    lastUpdated: Date;
}
export interface ISchoolCredentials {
    username: string;
    password: string;
    tempPassword: string;
    apiKey: string;
    apiEndpoint: string;
}
//# sourceMappingURL=school.interface.d.ts.map