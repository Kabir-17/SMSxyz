export declare class FileUtils {
    static ensureDirectory(dirPath: string): Promise<void>;
    static generateUniqueFilename(originalName: string): string;
    static createStudentPhotoFolder(schoolName: string, studentInfo: {
        firstName: string;
        age: number;
        grade: number;
        section: string;
        bloodGroup: string;
        admitDate: string;
        studentId: string;
    }): Promise<string>;
    static createTeacherPhotoFolder(schoolName: string, teacherInfo: {
        firstName: string;
        age: number;
        bloodGroup: string;
        joinDate: string;
        teacherId: string;
    }): Promise<string>;
    static createAccountantPhotoFolder(schoolName: string, accountantInfo: {
        firstName: string;
        age: number;
        bloodGroup: string;
        joinDate: string;
        accountantId: string;
    }): Promise<string>;
    static savePhotoWithNumber(file: Express.Multer.File, targetDirectory: string, photoNumber: number): Promise<{
        filename: string;
        filepath: string;
        relativePath: string;
    }>;
    static deleteFile(filepath: string): Promise<void>;
    static deleteFolder(folderPath: string): Promise<void>;
    static validateImageFile(file: Express.Multer.File): {
        isValid: boolean;
        error?: string;
    };
    static getFileStats(filepath: string): Promise<{
        exists: boolean;
        size?: number;
        isFile?: boolean;
        isDirectory?: boolean;
        mtime?: Date;
    }>;
    static countFilesInDirectory(dirPath: string): Promise<number>;
    static getAvailablePhotoNumbers(studentFolderPath: string): Promise<number[]>;
}
//# sourceMappingURL=fileUtils.d.ts.map