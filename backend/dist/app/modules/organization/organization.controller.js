"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizationStats = exports.getActiveOrganizations = exports.deleteOrganization = exports.updateOrganization = exports.getOrganizationById = exports.getOrganizations = exports.createOrganization = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const organization_service_1 = require("./organization.service");
const createOrganization = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const organization = await organization_service_1.organizationService.createOrganization(req.body);
    res.status(http_status_1.default.CREATED).json({
        success: true,
        message: 'Organization created successfully',
        data: organization,
    });
});
exports.createOrganization = createOrganization;
const getOrganizations = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await organization_service_1.organizationService.getOrganizations(req.query);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Organizations fetched successfully',
        data: result.organizations,
        pagination: {
            totalCount: result.totalCount,
            currentPage: result.currentPage,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
        },
    });
});
exports.getOrganizations = getOrganizations;
const getOrganizationById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const organization = await organization_service_1.organizationService.getOrganizationById(req.params.id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Organization fetched successfully',
        data: organization,
    });
});
exports.getOrganizationById = getOrganizationById;
const updateOrganization = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const organization = await organization_service_1.organizationService.updateOrganization(req.params.id, req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Organization updated successfully',
        data: organization,
    });
});
exports.updateOrganization = updateOrganization;
const deleteOrganization = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await organization_service_1.organizationService.deleteOrganization(req.params.id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Organization deleted successfully',
        data: null,
    });
});
exports.deleteOrganization = deleteOrganization;
const getActiveOrganizations = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const organizations = await organization_service_1.organizationService.getActiveOrganizations();
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Active organizations fetched successfully',
        data: organizations,
    });
});
exports.getActiveOrganizations = getActiveOrganizations;
const getOrganizationStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await organization_service_1.organizationService.getOrganizationStats(req.params.id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Organization statistics fetched successfully',
        data: result,
    });
});
exports.getOrganizationStats = getOrganizationStats;
//# sourceMappingURL=organization.controller.js.map