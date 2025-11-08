"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const AppError_1 = require("../../errors/AppError");
const school_model_1 = require("../school/school.model");
const user_model_1 = require("./user.model");
const jwtUtils_1 = require("../../utils/jwtUtils");
const config_1 = __importDefault(require("../../config"));
const getErrorMessage = (error) => {
    if (error instanceof Error)
        return error.message;
    if (typeof error === 'string')
        return error;
    return 'Unknown error occurred';
};
class UserService {
    async createUser(userData) {
        try {
            if (userData.role !== 'superadmin') {
                if (!userData.schoolId) {
                    throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'School ID is required for non-superadmin users');
                }
                const school = await school_model_1.School.findById(userData.schoolId);
                if (!school) {
                    throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'School not found');
                }
                if (school.status !== 'active') {
                    throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Cannot create user for inactive school');
                }
            }
            const existingUser = await user_model_1.User.findOne({ username: userData.username });
            if (existingUser) {
                throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Username '${userData.username}' is already taken`);
            }
            const newUser = await user_model_1.User.create({
                ...userData,
                passwordHash: userData.password,
            });
            if (newUser.schoolId) {
                await newUser.populate('schoolId', 'name status');
            }
            return this.formatUserResponse(newUser);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to create user: ${getErrorMessage(error)}`);
        }
    }
    async getUsers(queryParams) {
        try {
            const { page, limit, schoolId, role, isActive, search, sortBy, sortOrder } = queryParams;
            const skip = (page - 1) * limit;
            const query = {};
            if (schoolId) {
                query.schoolId = schoolId;
            }
            if (role && role !== 'all') {
                query.role = role;
            }
            if (isActive && isActive !== 'all') {
                query.isActive = isActive === 'true';
            }
            if (search) {
                query.$or = [
                    { firstName: { $regex: new RegExp(search, 'i') } },
                    { lastName: { $regex: new RegExp(search, 'i') } },
                    { username: { $regex: new RegExp(search, 'i') } },
                    { email: { $regex: new RegExp(search, 'i') } },
                ];
            }
            const sort = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
            const [users, totalCount] = await Promise.all([
                user_model_1.User.find(query)
                    .populate('schoolId', 'name status')
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                user_model_1.User.countDocuments(query),
            ]);
            const totalPages = Math.ceil(totalCount / limit);
            return {
                users: users.map((user) => this.formatUserResponse(user)),
                totalCount,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            };
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch users: ${getErrorMessage(error)}`);
        }
    }
    async getUserById(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid user ID format');
            }
            const user = await user_model_1.User.findById(id).populate('schoolId', 'name status').lean();
            if (!user) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
            }
            return this.formatUserResponse(user);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch user: ${getErrorMessage(error)}`);
        }
    }
    async updateUser(id, updateData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid user ID format');
            }
            const user = await user_model_1.User.findById(id);
            if (!user) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
            }
            const updatedUser = await user_model_1.User.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).populate('schoolId', 'name status').lean();
            return this.formatUserResponse(updatedUser);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to update user: ${getErrorMessage(error)}`);
        }
    }
    async deleteUser(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid user ID format');
            }
            const user = await user_model_1.User.findById(id);
            if (!user) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
            }
            await user.deleteOne();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to delete user: ${getErrorMessage(error)}`);
        }
    }
    async changePassword(id, passwordData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid user ID format');
            }
            const user = await user_model_1.User.findById(id).select('+passwordHash');
            if (!user) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
            }
            const isCurrentPasswordValid = await user.validatePassword(passwordData.currentPassword);
            if (!isCurrentPasswordValid) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Current password is incorrect');
            }
            await user.updatePassword(passwordData.newPassword);
            if (user.isFirstLogin) {
                await user.markFirstLoginComplete();
            }
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to change password: ${getErrorMessage(error)}`);
        }
    }
    async forcePasswordChange(id, newPassword) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid user ID format');
            }
            const user = await user_model_1.User.findById(id);
            if (!user) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
            }
            await user.updatePassword(newPassword);
            await user.markFirstLoginComplete();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to change password: ${getErrorMessage(error)}`);
        }
    }
    async resetPassword(id, newPassword) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid user ID format');
            }
            const user = await user_model_1.User.findById(id);
            if (!user) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
            }
            await user.updatePassword(newPassword);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to reset password: ${getErrorMessage(error)}`);
        }
    }
    async login(loginData) {
        try {
            if (loginData.username === config_1.default.superadmin_username &&
                loginData.password === config_1.default.superadmin_password) {
                let superadmin = await user_model_1.User.findOne({ username: config_1.default.superadmin_username });
                if (!superadmin) {
                    superadmin = await user_model_1.User.create({
                        username: config_1.default.superadmin_username,
                        passwordHash: config_1.default.superadmin_password,
                        firstName: 'Super',
                        lastName: 'Admin',
                        role: 'superadmin',
                        isActive: true,
                    });
                }
                await superadmin.updateLastLogin();
                const accessToken = (0, jwtUtils_1.generateAccessToken)(superadmin);
                const tokenExpires = (0, jwtUtils_1.getTokenExpiration)();
                return {
                    user: this.formatUserResponse(superadmin),
                    accessToken,
                    tokenExpires,
                };
            }
            const user = await user_model_1.User.findByUsername(loginData.username);
            if (!user) {
                throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'Invalid username or password');
            }
            if (!user.isActive) {
                throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'User account is disabled');
            }
            const isPasswordValid = await user.validatePassword(loginData.password);
            if (!isPasswordValid) {
                throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'Invalid username or password');
            }
            if (user.schoolId) {
                const school = await school_model_1.School.findById(user.schoolId);
                if (!school || school.status !== 'active') {
                    throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'School is inactive');
                }
            }
            await user.updateLastLogin();
            await user.populate('schoolId', 'name status');
            const accessToken = (0, jwtUtils_1.generateAccessToken)(user);
            const tokenExpires = (0, jwtUtils_1.getTokenExpiration)();
            return {
                user: this.formatUserResponse(user),
                accessToken,
                tokenExpires,
                requiresPasswordChange: user.isFirstLogin,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to login: ${getErrorMessage(error)}`);
        }
    }
    async getUsersBySchool(schoolId) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid school ID format');
            }
            const users = await user_model_1.User.findBySchool(schoolId);
            return users.map((user) => this.formatUserResponse(user));
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch users by school: ${getErrorMessage(error)}`);
        }
    }
    async getUsersByRole(role) {
        try {
            const users = await user_model_1.User.findByRole(role);
            return users.map((user) => this.formatUserResponse(user));
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch users by role: ${getErrorMessage(error)}`);
        }
    }
    formatUserResponse(user) {
        return {
            id: user._id?.toString() || user.id,
            schoolId: user.schoolId?._id?.toString() || user.schoolId?.toString(),
            role: user.role,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            phone: user.phone,
            isActive: user.isActive,
            isFirstLogin: user.isFirstLogin,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            school: user.schoolId?.name ? {
                id: user.schoolId._id?.toString() || user.schoolId.id,
                name: user.schoolId.name,
            } : undefined,
        };
    }
}
exports.userService = new UserService();
//# sourceMappingURL=user.service.js.map