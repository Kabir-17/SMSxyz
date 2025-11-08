"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const AppError_1 = require("../../errors/AppError");
const organization_model_1 = require("./organization.model");
const getErrorMessage = (error) => {
    if (error instanceof Error)
        return getErrorMessage(error);
    if (typeof error === 'string')
        return error;
    return 'Unknown error occurred';
};
class OrganizationService {
    async createOrganization(organizationData) {
        try {
            const existingOrganization = await organization_model_1.Organization.findOne({
                name: { $regex: new RegExp(`^${organizationData.name}$`, 'i') },
            });
            if (existingOrganization) {
                throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Organization with name '${organizationData.name}' already exists`);
            }
            const newOrganization = await organization_model_1.Organization.create(organizationData);
            return this.formatOrganizationResponse(newOrganization);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to create organization: ${getErrorMessage(error)}`);
        }
    }
    async getOrganizations(queryParams) {
        try {
            const { page, limit, status, search, sortBy, sortOrder } = queryParams;
            const skip = (page - 1) * limit;
            const query = {};
            if (status && status !== 'all') {
                query.status = status;
            }
            if (search) {
                query.name = { $regex: new RegExp(search, 'i') };
            }
            const sort = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
            const [organizations, totalCount] = await Promise.all([
                organization_model_1.Organization.find(query)
                    .populate('schoolsCount')
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                organization_model_1.Organization.countDocuments(query),
            ]);
            const totalPages = Math.ceil(totalCount / limit);
            return {
                organizations: organizations.map(org => this.formatOrganizationResponse(org)),
                totalCount,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            };
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch organizations: ${getErrorMessage(error)}`);
        }
    }
    async getOrganizationById(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid organization ID format');
            }
            const organization = await organization_model_1.Organization.findById(id).populate('schoolsCount').lean();
            if (!organization) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Organization not found');
            }
            return this.formatOrganizationResponse(organization);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch organization: ${getErrorMessage(error)}`);
        }
    }
    async updateOrganization(id, updateData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid organization ID format');
            }
            const organization = await organization_model_1.Organization.findById(id);
            if (!organization) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Organization not found');
            }
            if (updateData.name && updateData.name !== organization.name) {
                const existingOrganization = await organization_model_1.Organization.findOne({
                    name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
                    _id: { $ne: id },
                });
                if (existingOrganization) {
                    throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Organization with name '${updateData.name}' already exists`);
                }
            }
            const updatedOrganization = await organization_model_1.Organization.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).populate('schoolsCount').lean();
            return this.formatOrganizationResponse(updatedOrganization);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to update organization: ${getErrorMessage(error)}`);
        }
    }
    async deleteOrganization(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid organization ID format');
            }
            const organization = await organization_model_1.Organization.findById(id);
            if (!organization) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Organization not found');
            }
            await organization.deleteOne();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to delete organization: ${getErrorMessage(error)}`);
        }
    }
    async getActiveOrganizations() {
        try {
            const organizations = await organization_model_1.Organization.findActiveOrganizations();
            return organizations.map(org => this.formatOrganizationResponse(org));
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch active organizations: ${getErrorMessage(error)}`);
        }
    }
    async getOrganizationStats(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid organization ID format');
            }
            const organization = await organization_model_1.Organization.findById(id).lean();
            if (!organization) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Organization not found');
            }
            const stats = {
                totalSchools: 0,
                activeSchools: 0,
                totalStudents: 0,
                totalTeachers: 0,
            };
            return {
                organization: this.formatOrganizationResponse(organization),
                stats,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch organization stats: ${getErrorMessage(error)}`);
        }
    }
    formatOrganizationResponse(organization) {
        return {
            id: organization._id?.toString() || organization.id,
            name: organization.name,
            status: organization.status,
            createdAt: organization.createdAt,
            updatedAt: organization.updatedAt,
            schoolsCount: organization.schoolsCount || 0,
        };
    }
}
exports.organizationService = new OrganizationService();
//# sourceMappingURL=organization.service.js.map