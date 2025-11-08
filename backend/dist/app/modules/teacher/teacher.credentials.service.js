"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherCredentialsService = void 0;
const user_model_1 = require("../user/user.model");
const teacher_model_1 = require("./teacher.model");
const AppError_1 = require("../../errors/AppError");
const http_status_1 = __importDefault(require("http-status"));
class TeacherCredentialsService {
    static async generateTeacherCredentials(teacherId, firstName, lastName) {
        const username = teacherId.replace(/-/g, '').toLowerCase();
        const password = teacherId;
        return {
            teacherId,
            username,
            password,
            temporaryPassword: true
        };
    }
    static async saveTeacherCredentials(schoolId, credentials) {
        try {
            await user_model_1.User.findOneAndUpdate({ username: credentials.username }, {
                $set: {
                    passwordChangeRequired: true,
                    credentialsGenerated: true,
                    credentialsGeneratedAt: new Date()
                }
            });
        }
        catch (error) {
            console.error('Failed to save teacher credentials:', error);
        }
    }
    static async getTeacherCredentials(teacherId) {
        try {
            const teacher = await teacher_model_1.Teacher.findOne({ teacherId })
                .populate('userId', 'username firstName lastName displayPassword credentialsGenerated passwordChangeRequired');
            if (!teacher || !teacher.userId) {
                return null;
            }
            const user = teacher.userId;
            return {
                credentials: {
                    teacherId,
                    username: user.username,
                    password: user.displayPassword || teacherId,
                    temporaryPassword: user.passwordChangeRequired !== false
                },
                message: user.credentialsGenerated
                    ? 'These are auto-generated credentials. Teacher should change password on first login.'
                    : 'Default credentials based on Teacher ID. Password may have been changed by teacher.'
            };
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to retrieve teacher credentials');
        }
    }
    static async resetTeacherPassword(teacherId) {
        try {
            const teacher = await teacher_model_1.Teacher.findOne({ teacherId })
                .populate('userId', 'username displayPassword');
            if (!teacher || !teacher.userId) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Teacher not found');
            }
            const user = teacher.userId;
            const newPassword = user.displayPassword || teacherId;
            await user_model_1.User.findByIdAndUpdate(teacher.userId, {
                $set: {
                    passwordHash: newPassword,
                    passwordChangeRequired: true,
                    passwordResetAt: new Date()
                }
            });
            return {
                credentials: {
                    teacherId,
                    username: user.username,
                    password: newPassword,
                    temporaryPassword: true
                },
                message: 'Password has been reset to the original credentials. Teacher should change password on first login.'
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to reset teacher password');
        }
    }
    static async getSchoolTeachersCredentials(schoolId) {
        try {
            const teachers = await teacher_model_1.Teacher.find({ schoolId })
                .populate('userId', 'username firstName lastName credentialsGenerated')
                .select('teacherId userId');
            return teachers
                .filter(teacher => teacher.userId && teacher.userId.credentialsGenerated)
                .map(teacher => {
                const user = teacher.userId;
                return {
                    teacherId: teacher.teacherId,
                    username: user.username,
                    password: teacher.teacherId,
                    temporaryPassword: true
                };
            });
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to retrieve school teachers credentials');
        }
    }
}
exports.TeacherCredentialsService = TeacherCredentialsService;
//# sourceMappingURL=teacher.credentials.service.js.map