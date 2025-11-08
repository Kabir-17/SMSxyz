"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountantService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = require("../../errors/AppError");
const fileUtils_1 = require("../../utils/fileUtils");
const credentialGenerator_1 = require("../../utils/credentialGenerator");
const school_model_1 = require("../school/school.model");
const user_model_1 = require("../user/user.model");
const accountant_model_1 = require("./accountant.model");
class AccountantService {
    async createAccountant(accountantData, files) {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const school = await school_model_1.School.findById(new mongoose_1.Types.ObjectId(accountantData.schoolId));
            if (!school) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "School not found");
            }
            if (school.status !== "active") {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Cannot create accountant for inactive school");
            }
            const joiningYear = accountantData.joinDate
                ? new Date(accountantData.joinDate).getFullYear()
                : new Date().getFullYear();
            const { accountantId, employeeId } = await credentialGenerator_1.CredentialGenerator.generateUniqueAccountantId(joiningYear, accountantData.schoolId, accountantData.designation);
            const credentials = await credentialGenerator_1.CredentialGenerator.generateAccountantCredentials(accountantData.firstName, accountantData.lastName, accountantId);
            const newUser = await user_model_1.User.create([
                {
                    schoolId: new mongoose_1.Types.ObjectId(accountantData.schoolId),
                    role: "accountant",
                    username: credentials.username,
                    passwordHash: credentials.hashedPassword,
                    displayPassword: credentials.password,
                    firstName: accountantData.firstName,
                    lastName: accountantData.lastName,
                    email: accountantData.email,
                    phone: accountantData.phone,
                    isActive: accountantData.isActive !== false,
                    requiresPasswordChange: credentials.requiresPasswordChange,
                },
            ], { session });
            const experienceData = {
                totalYears: accountantData.experience.totalYears,
                previousOrganizations: accountantData.experience.previousOrganizations?.map((org) => ({
                    ...org,
                    fromDate: new Date(org.fromDate),
                    toDate: new Date(org.toDate),
                })) || [],
            };
            const newAccountant = await accountant_model_1.Accountant.create([
                {
                    userId: newUser[0]._id,
                    schoolId: new mongoose_1.Types.ObjectId(accountantData.schoolId),
                    accountantId,
                    employeeId: employeeId,
                    department: accountantData.department,
                    designation: accountantData.designation,
                    bloodGroup: accountantData.bloodGroup,
                    dob: new Date(accountantData.dob),
                    joinDate: accountantData.joinDate
                        ? new Date(accountantData.joinDate)
                        : new Date(),
                    qualifications: accountantData.qualifications,
                    experience: experienceData,
                    address: accountantData.address,
                    emergencyContact: accountantData.emergencyContact,
                    salary: accountantData.salary
                        ? {
                            ...accountantData.salary,
                            netSalary: (accountantData.salary.basic || 0) +
                                (accountantData.salary.allowances || 0) -
                                (accountantData.salary.deductions || 0),
                        }
                        : undefined,
                    responsibilities: accountantData.responsibilities || [],
                    certifications: accountantData.certifications || [],
                    isActive: accountantData.isActive !== false,
                },
            ], { session });
            const age = new Date().getFullYear() - new Date(accountantData.dob).getFullYear();
            const joinDate = new Date(accountantData.joinDate || Date.now())
                .toISOString()
                .split("T")[0];
            let folderPath = null;
            try {
                folderPath = await fileUtils_1.FileUtils.createAccountantPhotoFolder(school.name, {
                    firstName: accountantData.firstName,
                    age,
                    bloodGroup: accountantData.bloodGroup,
                    joinDate,
                    accountantId,
                });
            }
            catch (error) {
                console.warn("Failed to create photo folder:", error);
            }
            const photoResponses = [];
            if (files && files.length > 0 && folderPath) {
                try {
                    for (const file of files) {
                        const validation = fileUtils_1.FileUtils.validateImageFile(file);
                        if (!validation.isValid) {
                            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, validation.error);
                        }
                    }
                    if (files.length > config_1.default.max_photos_per_student) {
                        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Cannot upload more than ${config_1.default.max_photos_per_student} photos`);
                    }
                    const availableNumbers = await fileUtils_1.FileUtils.getAvailablePhotoNumbers(folderPath);
                    if (files.length > availableNumbers.length) {
                        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Only ${availableNumbers.length} photo slots available`);
                    }
                    const uploadPromises = files.map(async (file, index) => {
                        const photoNumber = availableNumbers[index];
                        const photoResult = await fileUtils_1.FileUtils.savePhotoWithNumber(file, folderPath, photoNumber);
                        const photoDoc = await accountant_model_1.AccountantPhoto.create([
                            {
                                accountantId: newAccountant[0]._id,
                                schoolId: new mongoose_1.Types.ObjectId(accountantData.schoolId),
                                photoPath: photoResult.relativePath,
                                photoNumber,
                                filename: photoResult.filename,
                                originalName: file.originalname,
                                mimetype: file.mimetype,
                                size: file.size,
                            },
                        ], { session });
                        return {
                            id: photoDoc[0]._id.toString(),
                            photoPath: photoDoc[0].photoPath,
                            photoNumber: photoDoc[0].photoNumber,
                            filename: photoDoc[0].filename,
                            size: photoDoc[0].size,
                            createdAt: photoDoc[0].createdAt,
                        };
                    });
                    const uploadedPhotos = await Promise.all(uploadPromises);
                    photoResponses.push(...uploadedPhotos);
                }
                catch (error) {
                    console.error("Photo upload failed:", error);
                }
            }
            await session.commitTransaction();
            await newAccountant[0].populate([
                { path: "userId", select: "firstName lastName username email phone" },
                { path: "schoolId", select: "name" },
            ]);
            const response = await this.formatAccountantResponse(newAccountant[0]);
            if (photoResponses.length > 0) {
                response.photos = photoResponses;
                response.photoCount = photoResponses.length;
            }
            response.credentials = {
                username: credentials.username,
                password: credentials.password,
                accountantId: accountantId,
                message: "Please save these credentials. Default password should be changed on first login.",
            };
            return response;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async getAccountants(filters) {
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 20;
        const skip = (page - 1) * limit;
        const query = { schoolId: new mongoose_1.Types.ObjectId(filters.schoolId) };
        if (filters.department) {
            query.department = filters.department;
        }
        if (filters.designation) {
            query.designation = filters.designation;
        }
        if (filters.isActive !== undefined) {
            query.isActive = filters.isActive === "true";
        }
        if (filters.search) {
            const searchRegex = new RegExp(filters.search, "i");
            query.$or = [
                { accountantId: searchRegex },
                { employeeId: searchRegex },
            ];
        }
        const sortField = filters.sortBy || "createdAt";
        const sortOrder = filters.sortOrder === "asc" ? 1 : -1;
        const [accountants, totalCount] = await Promise.all([
            accountant_model_1.Accountant.find(query)
                .populate("userId", "firstName lastName username email phone")
                .populate("schoolId", "name")
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),
            accountant_model_1.Accountant.countDocuments(query),
        ]);
        const accountantResponses = await Promise.all(accountants.map((accountant) => this.formatAccountantResponse(accountant)));
        return {
            accountants: accountantResponses,
            totalCount,
            currentPage: page,
        };
    }
    async getAccountantById(id) {
        const accountant = await accountant_model_1.Accountant.findById(id)
            .populate("userId", "firstName lastName username email phone")
            .populate("schoolId", "name");
        if (!accountant) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Accountant not found");
        }
        return this.formatAccountantResponse(accountant);
    }
    async updateAccountant(id, updateData) {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const accountant = await accountant_model_1.Accountant.findById(id).session(session);
            if (!accountant) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Accountant not found");
            }
            if (updateData.firstName ||
                updateData.lastName ||
                updateData.email ||
                updateData.phone) {
                await user_model_1.User.findByIdAndUpdate(accountant.userId, {
                    $set: {
                        firstName: updateData.firstName,
                        lastName: updateData.lastName,
                        email: updateData.email,
                        phone: updateData.phone,
                    },
                }, { session });
            }
            let experienceData;
            if (updateData.experience) {
                experienceData = {
                    totalYears: updateData.experience.totalYears,
                    previousOrganizations: updateData.experience.previousOrganizations?.map((org) => ({
                        ...org,
                        fromDate: new Date(org.fromDate),
                        toDate: new Date(org.toDate),
                    })) || [],
                };
            }
            const updateFields = {};
            if (updateData.department)
                updateFields.department = updateData.department;
            if (updateData.designation)
                updateFields.designation = updateData.designation;
            if (updateData.bloodGroup)
                updateFields.bloodGroup = updateData.bloodGroup;
            if (updateData.dob)
                updateFields.dob = new Date(updateData.dob);
            if (updateData.joinDate)
                updateFields.joinDate = new Date(updateData.joinDate);
            if (updateData.employeeId)
                updateFields.employeeId = updateData.employeeId;
            if (updateData.qualifications)
                updateFields.qualifications = updateData.qualifications;
            if (experienceData)
                updateFields.experience = experienceData;
            if (updateData.address)
                updateFields.address = updateData.address;
            if (updateData.emergencyContact)
                updateFields.emergencyContact = updateData.emergencyContact;
            if (updateData.responsibilities)
                updateFields.responsibilities = updateData.responsibilities;
            if (updateData.certifications)
                updateFields.certifications = updateData.certifications;
            if (updateData.isActive !== undefined)
                updateFields.isActive = updateData.isActive;
            if (updateData.salary) {
                updateFields.salary = {
                    ...updateData.salary,
                    netSalary: (updateData.salary.basic || 0) +
                        (updateData.salary.allowances || 0) -
                        (updateData.salary.deductions || 0),
                };
            }
            const updatedAccountant = await accountant_model_1.Accountant.findByIdAndUpdate(id, { $set: updateFields }, { new: true, session })
                .populate("userId", "firstName lastName username email phone")
                .populate("schoolId", "name");
            await session.commitTransaction();
            return this.formatAccountantResponse(updatedAccountant);
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async deleteAccountant(id) {
        const session = await (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const accountant = await accountant_model_1.Accountant.findById(id).session(session);
            if (!accountant) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Accountant not found");
            }
            await accountant_model_1.AccountantPhoto.deleteMany({ accountantId: accountant._id }, { session });
            await accountant_model_1.Accountant.findByIdAndDelete(id, { session });
            await user_model_1.User.findByIdAndUpdate(accountant.userId, { $set: { isActive: false } }, { session });
            await session.commitTransaction();
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async getAccountantStats(schoolId) {
        const accountants = await accountant_model_1.Accountant.find({ schoolId });
        const stats = {
            totalAccountants: accountants.length,
            activeAccountants: accountants.filter((a) => a.isActive).length,
            byDepartment: [],
            byDesignation: [],
            byExperience: [],
            recentJoining: 0,
        };
        const departmentMap = new Map();
        accountants.forEach((accountant) => {
            const count = departmentMap.get(accountant.department) || 0;
            departmentMap.set(accountant.department, count + 1);
        });
        stats.byDepartment = Array.from(departmentMap.entries()).map(([department, count]) => ({ department, count }));
        const designationMap = new Map();
        accountants.forEach((accountant) => {
            const count = designationMap.get(accountant.designation) || 0;
            designationMap.set(accountant.designation, count + 1);
        });
        stats.byDesignation = Array.from(designationMap.entries()).map(([designation, count]) => ({ designation, count }));
        const experienceRanges = [
            { range: "0-2 years", min: 0, max: 2, count: 0 },
            { range: "3-5 years", min: 3, max: 5, count: 0 },
            { range: "6-10 years", min: 6, max: 10, count: 0 },
            { range: "10+ years", min: 11, max: 100, count: 0 },
        ];
        accountants.forEach((accountant) => {
            const years = accountant.experience.totalYears;
            const range = experienceRanges.find((r) => years >= r.min && years <= r.max);
            if (range)
                range.count++;
        });
        stats.byExperience = experienceRanges.map((r) => ({
            experienceRange: r.range,
            count: r.count,
        }));
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        stats.recentJoining = accountants.filter((a) => new Date(a.joinDate) >= thirtyDaysAgo).length;
        return stats;
    }
    async formatAccountantResponse(accountant) {
        const user = accountant.userId;
        const school = accountant.schoolId;
        return {
            id: accountant._id.toString(),
            userId: user?._id?.toString() || accountant.userId.toString(),
            schoolId: school?._id?.toString() || accountant.schoolId.toString(),
            accountantId: accountant.accountantId,
            employeeId: accountant.employeeId,
            department: accountant.department,
            designation: accountant.designation,
            bloodGroup: accountant.bloodGroup,
            dob: accountant.dob,
            joinDate: accountant.joinDate,
            qualifications: accountant.qualifications,
            experience: accountant.experience,
            address: accountant.address,
            emergencyContact: accountant.emergencyContact,
            salary: accountant.salary,
            responsibilities: accountant.responsibilities || [],
            certifications: accountant.certifications || [],
            isActive: accountant.isActive,
            age: accountant.getAgeInYears
                ? accountant.getAgeInYears()
                : new Date().getFullYear() -
                    new Date(accountant.dob).getFullYear(),
            totalExperience: accountant.experience.totalYears,
            createdAt: accountant.createdAt,
            updatedAt: accountant.updatedAt,
            user: user
                ? {
                    id: user._id.toString(),
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    phone: user.phone,
                }
                : undefined,
            school: school
                ? {
                    id: school._id.toString(),
                    name: school.name,
                }
                : undefined,
            photoCount: 0,
        };
    }
}
exports.accountantService = new AccountantService();
//# sourceMappingURL=accountant.service.js.map