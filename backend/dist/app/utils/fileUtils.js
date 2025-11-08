"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtils = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../config"));
class FileUtils {
    static async ensureDirectory(dirPath) {
        try {
            await promises_1.default.access(dirPath);
        }
        catch (error) {
            await promises_1.default.mkdir(dirPath, { recursive: true });
        }
    }
    static generateUniqueFilename(originalName) {
        const timestamp = Date.now();
        const randomStr = crypto_1.default.randomBytes(8).toString('hex');
        const ext = path_1.default.extname(originalName);
        const nameWithoutExt = path_1.default.basename(originalName, ext);
        return `${nameWithoutExt}_${timestamp}_${randomStr}${ext}`;
    }
    static async createStudentPhotoFolder(schoolName, studentInfo) {
        const cleanSchoolName = schoolName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
        const folderName = `student@${studentInfo.firstName}@${studentInfo.age}@${studentInfo.grade}@${studentInfo.section}@${studentInfo.bloodGroup}@${studentInfo.studentId}`;
        const baseStoragePath = path_1.default.resolve(config_1.default.upload_path);
        const schoolPath = path_1.default.join(baseStoragePath, cleanSchoolName);
        const studentsPath = path_1.default.join(schoolPath, 'Students');
        const studentFolderPath = path_1.default.join(studentsPath, folderName);
        await this.ensureDirectory(studentFolderPath);
        return studentFolderPath;
    }
    static async createTeacherPhotoFolder(schoolName, teacherInfo) {
        const cleanSchoolName = schoolName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
        const folderName = `teacher@${teacherInfo.firstName}@${teacherInfo.age}@${teacherInfo.bloodGroup}@${teacherInfo.joinDate}@${teacherInfo.teacherId}`;
        const baseStoragePath = path_1.default.resolve(config_1.default.upload_path);
        const schoolPath = path_1.default.join(baseStoragePath, cleanSchoolName);
        const teachersPath = path_1.default.join(schoolPath, 'Teachers');
        const teacherFolderPath = path_1.default.join(teachersPath, folderName);
        await this.ensureDirectory(teacherFolderPath);
        return teacherFolderPath;
    }
    static async createAccountantPhotoFolder(schoolName, accountantInfo) {
        const cleanSchoolName = schoolName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
        const folderName = `accountant@${accountantInfo.firstName}@${accountantInfo.age}@${accountantInfo.bloodGroup}@${accountantInfo.joinDate}@${accountantInfo.accountantId}`;
        const baseStoragePath = path_1.default.resolve(config_1.default.upload_path);
        const schoolPath = path_1.default.join(baseStoragePath, cleanSchoolName);
        const accountantsPath = path_1.default.join(schoolPath, 'Accountants');
        const accountantFolderPath = path_1.default.join(accountantsPath, folderName);
        await this.ensureDirectory(accountantFolderPath);
        return accountantFolderPath;
    }
    static async savePhotoWithNumber(file, targetDirectory, photoNumber) {
        await this.ensureDirectory(targetDirectory);
        const ext = path_1.default.extname(file.originalname);
        const filename = `${photoNumber}${ext}`;
        const filepath = path_1.default.join(targetDirectory, filename);
        await promises_1.default.writeFile(filepath, file.buffer);
        const baseStoragePath = path_1.default.resolve(config_1.default.upload_path);
        const relativePath = path_1.default.relative(baseStoragePath, filepath);
        return {
            filename,
            filepath,
            relativePath: relativePath.replace(/\\/g, '/'),
        };
    }
    static async deleteFile(filepath) {
        try {
            await promises_1.default.unlink(filepath);
        }
        catch (error) {
            console.warn(`Failed to delete file: ${filepath}`, error);
        }
    }
    static async deleteFolder(folderPath) {
        try {
            await promises_1.default.rm(folderPath, { recursive: true, force: true });
        }
        catch (error) {
            console.warn(`Failed to delete folder: ${folderPath}`, error);
        }
    }
    static validateImageFile(file) {
        if (file.size > config_1.default.max_file_size) {
            return {
                isValid: false,
                error: `File size exceeds maximum allowed size of ${config_1.default.max_file_size} bytes`,
            };
        }
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return {
                isValid: false,
                error: 'Only JPEG and PNG images are allowed',
            };
        }
        if (!file.buffer || file.buffer.length === 0) {
            return {
                isValid: false,
                error: 'File appears to be empty',
            };
        }
        return { isValid: true };
    }
    static async getFileStats(filepath) {
        try {
            const stats = await promises_1.default.stat(filepath);
            return {
                exists: true,
                size: stats.size,
                isFile: stats.isFile(),
                isDirectory: stats.isDirectory(),
                mtime: stats.mtime,
            };
        }
        catch (error) {
            return { exists: false };
        }
    }
    static async countFilesInDirectory(dirPath) {
        try {
            const files = await promises_1.default.readdir(dirPath);
            let count = 0;
            for (const file of files) {
                const filePath = path_1.default.join(dirPath, file);
                const stats = await promises_1.default.stat(filePath);
                if (stats.isFile()) {
                    count++;
                }
            }
            return count;
        }
        catch (error) {
            return 0;
        }
    }
    static async getAvailablePhotoNumbers(studentFolderPath) {
        const availableNumbers = [];
        for (let i = 1; i <= config_1.default.max_photos_per_student; i++) {
            const jpgPath = path_1.default.join(studentFolderPath, `${i}.jpg`);
            const pngPath = path_1.default.join(studentFolderPath, `${i}.png`);
            const jpgExists = await this.getFileStats(jpgPath);
            const pngExists = await this.getFileStats(pngPath);
            if (!jpgExists.exists && !pngExists.exists) {
                availableNumbers.push(i);
            }
        }
        return availableNumbers;
    }
}
exports.FileUtils = FileUtils;
//# sourceMappingURL=fileUtils.js.map