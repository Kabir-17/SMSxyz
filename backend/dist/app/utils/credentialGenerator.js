"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialFormatter = exports.calculateAge = exports.CredentialGenerator = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const student_model_1 = require("../modules/student/student.model");
const teacher_model_1 = require("../modules/teacher/teacher.model");
const user_model_1 = require("../modules/user/user.model");
class CredentialGenerator {
    static calculateAge(dob) {
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }
    static async generateUniqueStudentId(admissionYear, grade, schoolId) {
        const School = (await Promise.resolve().then(() => __importStar(require('../modules/school/school.model')))).School;
        const school = await School.findById(schoolId);
        if (!school) {
            throw new Error('School not found');
        }
        const schoolCode = school.schoolId || 'SCH001';
        const gradeNumber = grade.toString().padStart(2, "0");
        const result = await student_model_1.Student.aggregate([
            {
                $match: {
                    schoolId: new mongoose_1.default.Types.ObjectId(schoolId),
                    admissionYear,
                    grade: parseInt(grade),
                    $or: [
                        { isDeleted: { $exists: false } },
                        { isDeleted: false }
                    ]
                },
            },
            {
                $group: {
                    _id: null,
                    maxRollNumber: { $max: "$rollNumber" },
                    count: { $sum: 1 },
                    existingRollNumbers: { $push: "$rollNumber" }
                },
            },
        ]);
        let nextRoll = 1;
        let existingRolls = [];
        if (result.length > 0) {
            existingRolls = result[0].existingRollNumbers || [];
            nextRoll = (result[0].maxRollNumber || 0) + 1;
            for (let i = 1; i <= nextRoll; i++) {
                if (!existingRolls.includes(i)) {
                    nextRoll = i;
                    break;
                }
            }
        }
        let attempts = 0;
        const maxAttempts = 20;
        while (attempts < maxAttempts) {
            const candidateRoll = nextRoll + attempts;
            const rollNumberStr = candidateRoll.toString().padStart(4, "0");
            const candidateStudentId = `${schoolCode}-STU-${admissionYear}${gradeNumber}-${rollNumberStr}`;
            const [existingStudent, existingUser] = await Promise.all([
                student_model_1.Student.findOne({
                    studentId: candidateStudentId,
                    schoolId,
                    $or: [
                        { isDeleted: { $exists: false } },
                        { isDeleted: false }
                    ]
                }),
                user_model_1.User.findOne({
                    username: { $in: [
                            this.generateStudentUsername(candidateStudentId),
                            this.generateParentUsername(candidateStudentId)
                        ] },
                    $or: [
                        { isDeleted: { $exists: false } },
                        { isDeleted: false }
                    ]
                })
            ]);
            if (!existingStudent && !existingUser) {
                return { studentId: candidateStudentId, rollNumber: candidateRoll };
            }
            attempts++;
        }
        const timestamp = Date.now().toString().slice(-4);
        const timestampRoll = parseInt(timestamp.slice(-2)) + nextRoll;
        const timestampRollStr = timestampRoll.toString().padStart(4, "0");
        const fallbackStudentId = `${schoolCode}-STU-${admissionYear}${gradeNumber}-${timestampRollStr}`;
        return { studentId: fallbackStudentId, rollNumber: timestampRoll };
    }
    static validateStudentIdFormat(studentId) {
        const newFormatRegex = /^SCH\d{3,4}-STU-\d{6}-\d{4}$/;
        const oldFormatRegex = /^\d{10}$/;
        return newFormatRegex.test(studentId) || oldFormatRegex.test(studentId);
    }
    static parseStudentId(studentId) {
        if (!this.validateStudentIdFormat(studentId)) {
            throw new Error("Invalid student ID format. Expected: SCH001-STU-YYYYGG-RRRR or YYYYGGRRR");
        }
        if (studentId.includes('SCH') && studentId.includes('STU')) {
            const parts = studentId.split('-');
            const yearGrade = parts[2];
            return {
                admissionYear: parseInt(yearGrade.substring(0, 4)),
                grade: yearGrade.substring(4, 6),
                rollNumber: parseInt(parts[3]),
                schoolCode: parts[0]
            };
        }
        else {
            return {
                admissionYear: parseInt(studentId.substring(0, 4)),
                grade: studentId.substring(4, 6),
                rollNumber: parseInt(studentId.substring(6, 10)),
            };
        }
    }
    static generatePassword(length = 8) {
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const numberChars = "0123456789";
        const specialChars = "!@#$%&*";
        const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
        let password = "";
        password +=
            uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        password +=
            lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
        password += numberChars[Math.floor(Math.random() * numberChars.length)];
        password += specialChars[Math.floor(Math.random() * specialChars.length)];
        for (let i = password.length; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
        return password
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");
    }
    static generateStudentUsername(studentId) {
        const compactId = studentId.replace(/-/g, '');
        let username = `stu${compactId}`.toLowerCase();
        if (username.length > 30) {
            username = username.substring(0, 30);
        }
        return username;
    }
    static generateParentUsername(studentId) {
        const compactId = studentId.replace(/-/g, '');
        let username = `par${compactId}`.toLowerCase();
        if (username.length > 30) {
            username = username.substring(0, 30);
        }
        return username;
    }
    static async hashPassword(password) {
        const saltRounds = 12;
        return await bcryptjs_1.default.hash(password, saltRounds);
    }
    static async generateStudentCredentials(studentId) {
        const username = this.generateStudentUsername(studentId);
        const password = this.generatePassword();
        const hashedPassword = await this.hashPassword(password);
        return {
            username,
            password,
            hashedPassword,
            requiresPasswordChange: true,
        };
    }
    static async generateParentCredentials(studentId) {
        const username = this.generateParentUsername(studentId);
        const password = this.generatePassword();
        const hashedPassword = await this.hashPassword(password);
        return {
            username,
            password,
            hashedPassword,
            requiresPasswordChange: true,
        };
    }
    static async generateBothCredentials(studentId) {
        const studentCredentials = await this.generateStudentCredentials(studentId);
        const parentCredentials = await this.generateParentCredentials(studentId);
        return {
            student: studentCredentials,
            parent: parentCredentials,
        };
    }
    static async generateTeacherCredentials(firstName, lastName, teacherId) {
        const baseUsername = teacherId.replace(/-/g, "").toLowerCase();
        let username = baseUsername;
        let counter = 1;
        while (await user_model_1.User.findOne({ username })) {
            username = `${baseUsername}${counter}`;
            counter++;
        }
        const randomSuffix = crypto_1.default.randomBytes(2).toString("hex").toUpperCase();
        const password = `${teacherId}-${randomSuffix}`;
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        return {
            username,
            password,
            hashedPassword,
            requiresPasswordChange: true,
        };
    }
    static async checkUsernameAvailability(usernames) {
        const existingUsers = await user_model_1.User.find({
            username: { $in: usernames },
            isActive: true,
        });
        return existingUsers.length === 0;
    }
    static async generateStudentRegistration(admissionYear, grade, schoolId) {
        let attempts = 0;
        const maxAttempts = 10;
        let lastError = null;
        while (attempts < maxAttempts) {
            try {
                attempts++;
                const { studentId, rollNumber } = await this.generateUniqueStudentId(admissionYear, grade, schoolId);
                const credentials = await this.generateBothCredentials(studentId);
                const usernames = [
                    credentials.student.username,
                    credentials.parent.username,
                ];
                const available = await this.checkUsernameAvailability(usernames);
                if (available) {
                    return {
                        studentId,
                        rollNumber,
                        credentials,
                    };
                }
                const waitTime = Math.min(1000, 100 * Math.pow(2, attempts - 1)) + Math.random() * 100;
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
            catch (error) {
                lastError = error;
                console.error(`Attempt ${attempts} failed:`, error);
                if (attempts === maxAttempts) {
                    throw error;
                }
                const waitTime = Math.min(2000, 200 * Math.pow(2, attempts - 1)) + Math.random() * 200;
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
        const timestamp = new Date().toISOString();
        const errorMessage = lastError
            ? `Failed to generate unique credentials after ${maxAttempts} attempts. Last error: ${lastError.message} (${timestamp})`
            : `Failed to generate unique credentials after ${maxAttempts} attempts. Please try again. (${timestamp})`;
        throw new Error(errorMessage);
    }
    static async generateUniqueTeacherId(joiningYear, schoolId, designation) {
        const School = (await Promise.resolve().then(() => __importStar(require('../modules/school/school.model')))).School;
        const school = await School.findById(schoolId);
        if (!school) {
            throw new Error('School not found');
        }
        const schoolCode = school.schoolId || 'SCH001';
        const existingTeachers = await teacher_model_1.Teacher.find({
            schoolId,
            joinDate: {
                $gte: new Date(joiningYear, 0, 1),
                $lt: new Date(joiningYear + 1, 0, 1),
            },
            isActive: true,
        })
            .sort({ createdAt: 1 })
            .exec();
        let nextSequence = 1;
        if (existingTeachers.length > 0) {
            let designationGroup = [];
            let otherTeachers = [];
            if (designation) {
                const seniorRoles = ["Principal", "Vice Principal", "Head Teacher"];
                const teachingRoles = [
                    "Senior Teacher",
                    "Teacher",
                    "Assistant Teacher",
                ];
                const specialRoles = [
                    "Subject Coordinator",
                    "Sports Teacher",
                    "Music Teacher",
                    "Art Teacher",
                ];
                const supportRoles = ["Librarian", "Lab Assistant"];
                const getCurrentGroup = (des) => {
                    if (seniorRoles.includes(des))
                        return "senior";
                    if (teachingRoles.includes(des))
                        return "teaching";
                    if (specialRoles.includes(des))
                        return "special";
                    if (supportRoles.includes(des))
                        return "support";
                    return "other";
                };
                const currentGroup = getCurrentGroup(designation);
                designationGroup = existingTeachers.filter((t) => getCurrentGroup(t.designation) === currentGroup);
                otherTeachers = existingTeachers.filter((t) => getCurrentGroup(t.designation) !== currentGroup);
            }
            const allSequences = existingTeachers
                .map((teacher) => {
                const match = teacher.teacherId.match(new RegExp(`${schoolCode}-TCH-\\d{4}-(\\d{3})`));
                return match ? parseInt(match[1]) : 0;
            })
                .filter((seq) => seq > 0);
            if (allSequences.length > 0) {
                nextSequence = Math.max(...allSequences) + 1;
            }
            if (designationGroup.length > 0 && designation) {
                const groupSequences = designationGroup
                    .map((teacher) => {
                    const match = teacher.teacherId.match(new RegExp(`${schoolCode}-TCH-\\d{4}-(\\d{3})`));
                    return match ? parseInt(match[1]) : 0;
                })
                    .filter((seq) => seq > 0);
                if (groupSequences.length > 0) {
                    const maxGroupSeq = Math.max(...groupSequences);
                    const candidateSequence = maxGroupSeq + 1;
                    const sequenceExists = allSequences.includes(candidateSequence);
                    if (!sequenceExists) {
                        nextSequence = candidateSequence;
                    }
                }
            }
        }
        const sequenceStr = nextSequence.toString().padStart(3, "0");
        const teacherId = `${schoolCode}-TCH-${joiningYear}-${sequenceStr}`;
        const employeeId = `${schoolCode}-EMP-${joiningYear}-${sequenceStr}`;
        const existingWithId = await teacher_model_1.Teacher.findOne({
            $or: [{ teacherId }, { employeeId }],
            schoolId,
            isActive: true,
        });
        if (existingWithId) {
            return this.generateUniqueTeacherId(joiningYear, schoolId, designation);
        }
        return { teacherId, employeeId, sequenceNumber: nextSequence };
    }
    static async generateUniqueAccountantId(joiningYear, schoolId, designation) {
        const School = (await Promise.resolve().then(() => __importStar(require('../modules/school/school.model')))).School;
        const school = await School.findById(schoolId);
        if (!school) {
            throw new Error('School not found');
        }
        const schoolCode = school.schoolId || 'SCH001';
        const { Accountant } = await Promise.resolve().then(() => __importStar(require('../modules/accountant/accountant.model')));
        const existingAccountants = await Accountant.find({
            schoolId,
            joinDate: {
                $gte: new Date(joiningYear, 0, 1),
                $lt: new Date(joiningYear + 1, 0, 1),
            },
            isActive: true,
        })
            .sort({ createdAt: 1 })
            .exec();
        let nextSequence = 1;
        if (existingAccountants.length > 0) {
            const allSequences = existingAccountants
                .map((accountant) => {
                const match = accountant.accountantId.match(new RegExp(`${schoolCode}-ACC-\\d{4}-(\\d{3})`));
                return match ? parseInt(match[1]) : 0;
            })
                .filter((seq) => seq > 0);
            if (allSequences.length > 0) {
                nextSequence = Math.max(...allSequences) + 1;
            }
        }
        const sequenceStr = nextSequence.toString().padStart(3, "0");
        const accountantId = `${schoolCode}-ACC-${joiningYear}-${sequenceStr}`;
        const employeeId = `${schoolCode}-EMP-ACC-${joiningYear}-${sequenceStr}`;
        const existingWithId = await Accountant.findOne({
            $or: [{ accountantId }, { employeeId }],
            schoolId,
            isActive: true,
        });
        if (existingWithId) {
            return this.generateUniqueAccountantId(joiningYear, schoolId, designation);
        }
        return { accountantId, employeeId, sequenceNumber: nextSequence };
    }
    static async generateAccountantCredentials(firstName, lastName, accountantId) {
        const baseUsername = accountantId.replace(/-/g, "").toLowerCase();
        let username = baseUsername;
        let counter = 1;
        while (await user_model_1.User.findOne({ username })) {
            username = `${baseUsername}${counter}`;
            counter++;
        }
        const randomSuffix = crypto_1.default.randomBytes(2).toString("hex").toUpperCase();
        const password = `${accountantId}-${randomSuffix}`;
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        return {
            username,
            password,
            hashedPassword,
            requiresPasswordChange: true,
        };
    }
    static validateTeacherIdFormat(teacherId) {
        const newFormatRegex = /^SCH\d{3,4}-TCH-\d{4}-\d{3}$/;
        const oldFormatRegex = /^TCH-\d{4}-\d{3}$/;
        return newFormatRegex.test(teacherId) || oldFormatRegex.test(teacherId);
    }
    static parseTeacherId(teacherId) {
        if (!this.validateTeacherIdFormat(teacherId)) {
            throw new Error("Invalid teacher ID format. Expected: SCH001-TCH-YYYY-XXX or TCH-YYYY-XXX");
        }
        if (teacherId.includes('SCH')) {
            const parts = teacherId.split('-');
            return {
                joiningYear: parseInt(parts[2]),
                sequenceNumber: parseInt(parts[3]),
                schoolCode: parts[0]
            };
        }
        else {
            return {
                joiningYear: parseInt(teacherId.substring(4, 8)),
                sequenceNumber: parseInt(teacherId.substring(9, 12))
            };
        }
    }
    static async generateUniqueParentId(registrationYear, schoolId) {
        const School = (await Promise.resolve().then(() => __importStar(require('../modules/school/school.model')))).School;
        const school = await School.findById(schoolId);
        if (!school) {
            throw new Error('School not found');
        }
        const schoolCode = school.schoolId || 'SCH001';
        const Parent = (await Promise.resolve().then(() => __importStar(require('../modules/parent/parent.model')))).Parent;
        const existingParents = await Parent.find({
            schoolId,
            createdAt: {
                $gte: new Date(registrationYear, 0, 1),
                $lt: new Date(registrationYear + 1, 0, 1),
            },
            isActive: true,
        })
            .sort({ createdAt: 1 })
            .exec();
        let nextSequence = 1;
        if (existingParents.length > 0) {
            const allSequences = existingParents
                .map((parent) => {
                const match = parent.parentId.match(new RegExp(`${schoolCode}-PAR-\\d{4}-(\\d{3})`));
                return match ? parseInt(match[1]) : 0;
            })
                .filter((seq) => seq > 0);
            if (allSequences.length > 0) {
                nextSequence = Math.max(...allSequences) + 1;
            }
        }
        const sequenceStr = nextSequence.toString().padStart(3, "0");
        const parentId = `${schoolCode}-PAR-${registrationYear}-${sequenceStr}`;
        const existingWithId = await Parent.findOne({
            parentId,
            schoolId,
            isActive: true,
        });
        if (existingWithId) {
            return this.generateUniqueParentId(registrationYear, schoolId);
        }
        return { parentId, sequenceNumber: nextSequence };
    }
    static async generateUniqueAdminId(schoolId) {
        const School = (await Promise.resolve().then(() => __importStar(require('../modules/school/school.model')))).School;
        const school = await School.findById(schoolId);
        if (!school) {
            throw new Error('School not found');
        }
        const schoolCode = school.schoolId || 'SCH001';
        const User = (await Promise.resolve().then(() => __importStar(require('../modules/user/user.model')))).User;
        const existingAdmins = await User.find({
            schoolId,
            role: 'admin',
            isActive: true,
        })
            .sort({ createdAt: 1 })
            .exec();
        let nextSequence = 1;
        if (existingAdmins.length > 0) {
            nextSequence = existingAdmins.length + 1;
        }
        const sequenceStr = nextSequence.toString().padStart(3, "0");
        const adminId = `${schoolCode}-ADM-${sequenceStr}`;
        return { adminId, sequenceNumber: nextSequence };
    }
    static formatTeacherCredentials(teacherName, credentials) {
        return {
            type: "teacher",
            name: teacherName,
            username: credentials.username,
            password: credentials.password,
            message: `Login credentials for ${teacherName}. First-time login will require password change.`,
        };
    }
}
exports.CredentialGenerator = CredentialGenerator;
const calculateAge = (dob) => {
    return CredentialGenerator.calculateAge(dob);
};
exports.calculateAge = calculateAge;
class CredentialFormatter {
    static formatStudentCredentials(studentName, credentials) {
        return {
            type: "student",
            name: studentName,
            username: credentials.username,
            password: credentials.password,
            message: `Login credentials for student ${studentName}. First-time login will require password change.`,
        };
    }
    static formatParentCredentials(parentName, studentName, credentials) {
        return {
            type: "parent",
            name: parentName,
            username: credentials.username,
            password: credentials.password,
            message: `Login credentials for ${parentName} (parent of ${studentName}). First-time login will require password change.`,
        };
    }
    static formatBothCredentials(studentName, parentName, studentCredentials, parentCredentials) {
        return {
            student: this.formatStudentCredentials(studentName, studentCredentials),
            parent: this.formatParentCredentials(parentName, studentName, parentCredentials),
        };
    }
}
exports.CredentialFormatter = CredentialFormatter;
//# sourceMappingURL=credentialGenerator.js.map