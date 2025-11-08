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
exports.schoolService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const AppError_1 = require("../../errors/AppError");
const organization_model_1 = require("../organization/organization.model");
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const school_model_1 = require("./school.model");
const school_interface_1 = require("./school.interface");
class SchoolService {
    async createSchool(schoolData) {
        try {
            if (schoolData.orgId) {
                const organization = await organization_model_1.Organization.findById(schoolData.orgId);
                if (!organization) {
                    throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Organization not found");
                }
                if (organization.status !== "active") {
                    throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Cannot create school for inactive organization");
                }
            }
            const existingSchool = await school_model_1.School.findOne({
                name: { $regex: new RegExp(`^${schoolData.name}$`, "i") },
            });
            if (existingSchool) {
                throw new AppError_1.AppError(http_status_1.default.CONFLICT, `School with name '${schoolData.name}' already exists`);
            }
            const slug = schoolData.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-");
            const schoolIdCounter = await school_model_1.School.countDocuments();
            const schoolId = `SCH${String(schoolIdCounter + 1).padStart(3, "0")}`;
            const tempObjectId = new mongoose_1.Types.ObjectId();
            const newSchool = await school_model_1.School.create({
                ...schoolData,
                slug,
                schoolId,
                adminUserId: tempObjectId,
                currentSession: {
                    ...schoolData.currentSession,
                    isActive: true,
                },
                academicSessions: [
                    {
                        ...schoolData.currentSession,
                        isActive: true,
                    },
                ],
                apiEndpoint: `/api/schools/${schoolId}`,
                apiKey: this.generateApiKey(),
                isActive: true,
                status: "active",
            });
            const adminUser = await user_model_1.User.create({
                role: "admin",
                username: schoolData.adminDetails.username,
                passwordHash: schoolData.adminDetails.password,
                displayPassword: schoolData.adminDetails.password,
                firstName: schoolData.adminDetails.firstName,
                lastName: schoolData.adminDetails.lastName,
                email: schoolData.adminDetails.email,
                phone: schoolData.adminDetails.phone,
                isActive: true,
                schoolId: newSchool._id,
            });
            await school_model_1.School.findByIdAndUpdate(newSchool._id, {
                adminUserId: adminUser._id,
            });
            return {
                school: this.formatSchoolResponse(newSchool),
                credentials: {
                    username: schoolData.adminDetails.username,
                    password: schoolData.adminDetails.password,
                    tempPassword: schoolData.adminDetails.password,
                    apiKey: newSchool.apiKey,
                    apiEndpoint: newSchool.apiEndpoint,
                },
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to create school: ${error.message}`);
        }
    }
    generateApiKey() {
        return ("sk_" +
            Math.random().toString(36).substr(2, 9) +
            "_" +
            Date.now().toString(36));
    }
    async getSchools(queryParams) {
        try {
            const { page, limit, orgId, status, search, sortBy, sortOrder } = queryParams;
            const skip = (page - 1) * limit;
            const query = {};
            if (orgId) {
                query.orgId = orgId;
            }
            if (status && status !== "all") {
                query.status = status;
            }
            if (search) {
                query.$or = [
                    { name: { $regex: new RegExp(search, "i") } },
                    { address: { $regex: new RegExp(search, "i") } },
                ];
            }
            const sort = {};
            sort[sortBy] = sortOrder === "desc" ? -1 : 1;
            const [schools, totalCount] = await Promise.all([
                school_model_1.School.find(query)
                    .populate("orgId", "name status")
                    .populate("studentsCount")
                    .populate("teachersCount")
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                school_model_1.School.countDocuments(query),
            ]);
            const totalPages = Math.ceil(totalCount / limit);
            return {
                schools: schools.map((school) => this.formatSchoolResponse(school)),
                totalCount,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            };
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch schools: ${error.message}`);
        }
    }
    async getSchoolById(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid school ID format");
            }
            const school = await school_model_1.School.findById(id)
                .populate("orgId", "name status")
                .populate("studentsCount")
                .populate("teachersCount")
                .lean();
            if (!school) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "School not found");
            }
            return this.formatSchoolResponse(school);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch school: ${error.message}`);
        }
    }
    async updateSchool(id, updateData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid school ID format");
            }
            const school = await school_model_1.School.findById(id);
            if (!school) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "School not found");
            }
            if (updateData.name && updateData.name !== school.name) {
                const existingSchool = await school_model_1.School.findOne({
                    name: { $regex: new RegExp(`^${updateData.name}$`, "i") },
                    orgId: school.orgId,
                    _id: { $ne: id },
                });
                if (existingSchool) {
                    throw new AppError_1.AppError(http_status_1.default.CONFLICT, `School with name '${updateData.name}' already exists in this organization`);
                }
            }
            const updatedSchool = await school_model_1.School.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
                .populate("orgId", "name status")
                .populate("studentsCount")
                .populate("teachersCount")
                .lean();
            return this.formatSchoolResponse(updatedSchool);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to update school: ${error.message}`);
        }
    }
    async deleteSchool(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid school ID format");
            }
            const school = await school_model_1.School.findById(id);
            if (!school) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "School not found");
            }
            await school.deleteOne();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to delete school: ${error.message}`);
        }
    }
    async getSchoolsByOrganization(orgId) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(orgId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid organization ID format");
            }
            const schools = await school_model_1.School.findByOrganization(orgId);
            return schools.map((school) => this.formatSchoolResponse(school));
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch schools by organization: ${error.message}`);
        }
    }
    async validateAdminCredentials(username, password) {
        try {
            return null;
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to validate admin credentials: ${error.message}`);
        }
    }
    formatSchoolResponse(school) {
        return {
            id: school._id?.toString() || school.id,
            name: school.name,
            slug: school.slug,
            schoolId: school.schoolId,
            establishedYear: school.establishedYear,
            address: school.address,
            contact: school.contact,
            status: school.status,
            affiliation: school.affiliation,
            recognition: school.recognition,
            settings: school.settings,
            currentSession: school.currentSession,
            apiEndpoint: school.apiEndpoint,
            logo: school.logo,
            images: school.images,
            isActive: school.isActive,
            stats: school.stats,
            createdAt: school.createdAt,
            updatedAt: school.updatedAt,
            admin: school.adminUserId?.name
                ? {
                    id: school.adminUserId._id?.toString() || school.adminUserId.id,
                    username: school.adminUserId.username,
                    fullName: `${school.adminUserId.firstName} ${school.adminUserId.lastName}`,
                    email: school.adminUserId.email,
                    phone: school.adminUserId.phone,
                }
                : undefined,
            orgId: school.orgId?.toString(),
            studentsCount: school.studentsCount || school.stats?.totalStudents || 0,
            teachersCount: school.teachersCount || school.stats?.totalTeachers || 0,
            organization: school.orgId?.name
                ? {
                    id: school.orgId._id?.toString() || school.orgId.id,
                    name: school.orgId.name,
                }
                : undefined,
        };
    }
    async createSchoolModern(schoolData, createdBy) {
        try {
            const schoolId = await school_model_1.School.generateUniqueSchoolId();
            const slug = await school_model_1.School.generateUniqueSlug(schoolData.name);
            const tempObjectId = new mongoose_1.Types.ObjectId();
            const schoolCreateData = {
                name: schoolData.name,
                slug,
                schoolId,
                establishedYear: schoolData.establishedYear,
                address: schoolData.address,
                contact: schoolData.contact,
                affiliation: schoolData.affiliation,
                recognition: schoolData.recognition,
                adminUserId: tempObjectId,
                settings: schoolData.settings || {},
                status: school_interface_1.SchoolStatus.PENDING_APPROVAL,
                logo: schoolData.logo,
                isActive: true,
                createdBy,
            };
            if (schoolData.currentSession) {
                schoolCreateData.currentSession = {
                    ...schoolData.currentSession,
                    isActive: true,
                };
            }
            const newSchool = new school_model_1.School(schoolCreateData);
            await newSchool.save();
            const adminUser = new user_model_1.User({
                role: "admin",
                username: schoolData.adminDetails.username,
                passwordHash: schoolData.adminDetails.password,
                displayPassword: schoolData.adminDetails.password,
                firstName: schoolData.adminDetails.firstName,
                lastName: schoolData.adminDetails.lastName,
                email: schoolData.adminDetails.email,
                phone: schoolData.adminDetails.phone,
                isActive: true,
                schoolId: newSchool._id,
            });
            await adminUser.save();
            newSchool.adminUserId = adminUser._id;
            await newSchool.save();
            const apiEndpoint = newSchool.generateApiEndpoint();
            const apiKey = newSchool.generateApiKey();
            newSchool.apiEndpoint = apiEndpoint;
            newSchool.apiKey = apiKey;
            await newSchool.save();
            const credentials = {
                username: adminUser.username,
                password: schoolData.adminDetails.password,
                tempPassword: schoolData.adminDetails.password,
                apiKey,
                apiEndpoint,
            };
            return {
                school: this.formatSchoolResponse(await newSchool.populate("adminUserId")),
                credentials,
            };
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to create school: ${error.message}`);
        }
    }
    async getAllSchools(queryParams) {
        try {
            const { page = 1, limit = 10, status, search, sortBy = "createdAt", sortOrder = "desc", } = queryParams;
            const skip = (page - 1) * limit;
            const query = {};
            if (status) {
                query.status = status;
            }
            if (search) {
                query.$or = [
                    { name: { $regex: new RegExp(search, "i") } },
                    { schoolId: { $regex: new RegExp(search, "i") } },
                    { "address.city": { $regex: new RegExp(search, "i") } },
                    { affiliation: { $regex: new RegExp(search, "i") } },
                ];
            }
            const sort = {};
            sort[sortBy] = sortOrder === "desc" ? -1 : 1;
            const [schools, totalCount] = await Promise.all([
                school_model_1.School.find(query)
                    .populate("adminUserId", "username firstName lastName email phone")
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                school_model_1.School.countDocuments(query),
            ]);
            const totalPages = Math.ceil(totalCount / limit);
            return {
                schools: schools.map((school) => this.formatSchoolResponse(school)),
                totalCount,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            };
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch schools: ${error.message}`);
        }
    }
    async getSchoolStats(schoolId) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid school ID format");
            }
            const school = await school_model_1.School.findById(schoolId).populate("adminUserId", "firstName lastName");
            if (!school) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "School not found");
            }
            await school.updateStats();
            return {
                schoolId: school.schoolId,
                schoolName: school.name,
                totalStudents: school.stats?.totalStudents || 0,
                totalTeachers: school.stats?.totalTeachers || 0,
                totalParents: school.stats?.totalParents || 0,
                totalClasses: school.stats?.totalClasses || 0,
                totalSubjects: school.stats?.totalSubjects || 0,
                attendanceRate: school.stats?.attendanceRate || 0,
                enrollmentTrend: [],
                gradeDistribution: [],
                lastUpdated: school.stats?.lastUpdated || new Date(),
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to get school stats: ${error.message}`);
        }
    }
    async assignAdmin(schoolId, adminData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid school ID format");
            }
            const school = await school_model_1.School.findById(schoolId);
            if (!school) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "School not found");
            }
            const existingUser = await user_model_1.User.findOne({ username: adminData.username });
            if (existingUser) {
                throw new AppError_1.AppError(http_status_1.default.CONFLICT, "Username already exists");
            }
            const newAdmin = new user_model_1.User({
                role: "admin",
                schoolId: school._id,
                username: adminData.username,
                passwordHash: adminData.password,
                displayPassword: adminData.password,
                firstName: adminData.firstName,
                lastName: adminData.lastName,
                email: adminData.email,
                phone: adminData.phone,
                isActive: true,
            });
            await newAdmin.save();
            if (school.adminUserId) {
                await user_model_1.User.findByIdAndUpdate(school.adminUserId, { isActive: false });
            }
            school.adminUserId = newAdmin._id;
            await school.save();
            return this.formatSchoolResponse(await school.populate("adminUserId"));
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to assign admin: ${error.message}`);
        }
    }
    async updateSchoolStatus(schoolId, status, updatedBy) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid school ID format");
            }
            const school = await school_model_1.School.findByIdAndUpdate(schoolId, {
                status,
                lastModifiedBy: updatedBy,
                isActive: status === school_interface_1.SchoolStatus.ACTIVE,
            }, { new: true, runValidators: true }).populate("adminUserId", "username firstName lastName email phone");
            if (!school) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "School not found");
            }
            return this.formatSchoolResponse(school);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to update school status: ${error.message}`);
        }
    }
    async getSystemStats() {
        try {
            const { Student } = await Promise.resolve().then(() => __importStar(require('../student/student.model')));
            const { Teacher } = await Promise.resolve().then(() => __importStar(require('../teacher/teacher.model')));
            const { User } = await Promise.resolve().then(() => __importStar(require('../user/user.model')));
            const [totalSchools, activeSchools, pendingSchools, suspendedSchools, totalStudents, totalTeachers, totalParents,] = await Promise.all([
                school_model_1.School.countDocuments({ isActive: true }),
                school_model_1.School.countDocuments({ status: school_interface_1.SchoolStatus.ACTIVE }),
                school_model_1.School.countDocuments({ status: school_interface_1.SchoolStatus.PENDING_APPROVAL }),
                school_model_1.School.countDocuments({ status: school_interface_1.SchoolStatus.SUSPENDED }),
                Student.countDocuments({ isActive: true }),
                Teacher.countDocuments({ isActive: true }),
                User.countDocuments({ role: user_interface_1.UserRole.PARENT, isActive: true }),
            ]);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const [recentSchools, recentStudents, recentTeachers] = await Promise.all([
                school_model_1.School.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
                Student.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
                Teacher.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            ]);
            return {
                totalSchools,
                totalStudents,
                totalTeachers,
                totalParents,
                activeSchools,
                pendingSchools,
                suspendedSchools,
                recentActivity: {
                    schoolsCreated: recentSchools,
                    studentsEnrolled: recentStudents,
                    teachersAdded: recentTeachers,
                },
            };
        }
        catch (error) {
            console.warn('Some models not available, returning basic stats:', error.message);
            const [totalSchools, activeSchools, pendingSchools, suspendedSchools,] = await Promise.all([
                school_model_1.School.countDocuments({ isActive: true }),
                school_model_1.School.countDocuments({ status: school_interface_1.SchoolStatus.ACTIVE }),
                school_model_1.School.countDocuments({ status: school_interface_1.SchoolStatus.PENDING_APPROVAL }),
                school_model_1.School.countDocuments({ status: school_interface_1.SchoolStatus.SUSPENDED }),
            ]);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentSchools = await school_model_1.School.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
            return {
                totalSchools,
                totalStudents: 0,
                totalTeachers: 0,
                totalParents: 0,
                activeSchools,
                pendingSchools,
                suspendedSchools,
                recentActivity: {
                    schoolsCreated: recentSchools,
                    studentsEnrolled: 0,
                    teachersAdded: 0,
                },
            };
        }
    }
    async regenerateApiKey(schoolId) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid school ID format");
            }
            const school = await school_model_1.School.findById(schoolId);
            if (!school) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "School not found");
            }
            const newApiKey = await school.regenerateApiKey();
            return {
                apiKey: newApiKey,
                apiEndpoint: school.apiEndpoint,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to regenerate API key: ${error.message}`);
        }
    }
    async getAdminCredentials(schoolId) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid school ID format");
            }
            const school = await school_model_1.School.findById(schoolId).populate({
                path: "adminUserId",
                select: "username firstName lastName email phone lastLogin displayPassword",
            });
            if (!school) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "School not found");
            }
            if (!school.adminUserId) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Admin not assigned to this school");
            }
            const admin = school.adminUserId;
            return {
                username: admin.username,
                password: admin.displayPassword || "********",
                fullName: admin.fullName || `${admin.firstName} ${admin.lastName}`,
                email: admin.email,
                phone: admin.phone,
                lastLogin: admin.lastLogin?.toISOString(),
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to get admin credentials: ${error.message}`);
        }
    }
    async resetAdminPassword(schoolId, newPassword, updatedBy) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid school ID format");
            }
            const school = await school_model_1.School.findById(schoolId).populate({
                path: "adminUserId",
                select: "username firstName lastName email passwordHash",
            });
            if (!school) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "School not found");
            }
            if (!school.adminUserId) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Admin not assigned to this school");
            }
            const admin = school.adminUserId;
            const passwordToSet = newPassword || this.generateSecurePassword();
            const userToUpdate = await user_model_1.User.findById(admin._id);
            if (!userToUpdate) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Admin user not found");
            }
            await userToUpdate.updatePassword(passwordToSet);
            userToUpdate.displayPassword = passwordToSet;
            await userToUpdate.save();
            return {
                username: admin.username,
                newPassword: passwordToSet,
                fullName: admin.fullName || `${admin.firstName} ${admin.lastName}`,
                email: admin.email,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to reset admin password: ${error.message}`);
        }
    }
    generateSecurePassword() {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
        password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
        password += "0123456789"[Math.floor(Math.random() * 10)];
        password += "!@#$%^&*"[Math.floor(Math.random() * 8)];
        for (let i = password.length; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }
        return password
            .split("")
            .sort(() => 0.5 - Math.random())
            .join("");
    }
}
exports.schoolService = new SchoolService();
//# sourceMappingURL=school.service.js.map