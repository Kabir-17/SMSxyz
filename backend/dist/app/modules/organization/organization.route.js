"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_1 = require("../../middlewares/auth");
const organization_validation_1 = require("./organization.validation");
const organization_controller_1 = require("./organization.controller");
const router = express_1.default.Router();
router.get('/active', organization_controller_1.getActiveOrganizations);
router.post('/', auth_1.authenticate, auth_1.requireSuperadmin, (0, validateRequest_1.validateRequest)(organization_validation_1.createOrganizationValidationSchema), organization_controller_1.createOrganization);
router.get('/', auth_1.authenticate, auth_1.requireSuperadmin, (0, validateRequest_1.validateRequest)(organization_validation_1.getOrganizationsValidationSchema), organization_controller_1.getOrganizations);
router.get('/:id', auth_1.authenticate, auth_1.requireSuperadmin, (0, validateRequest_1.validateRequest)(organization_validation_1.getOrganizationValidationSchema), organization_controller_1.getOrganizationById);
router.put('/:id', auth_1.authenticate, auth_1.requireSuperadmin, (0, validateRequest_1.validateRequest)(organization_validation_1.updateOrganizationValidationSchema), organization_controller_1.updateOrganization);
router.delete('/:id', auth_1.authenticate, auth_1.requireSuperadmin, (0, validateRequest_1.validateRequest)(organization_validation_1.deleteOrganizationValidationSchema), organization_controller_1.deleteOrganization);
router.get('/:id/stats', auth_1.authenticate, auth_1.requireSuperadmin, (0, validateRequest_1.validateRequest)(organization_validation_1.getOrganizationValidationSchema), organization_controller_1.getOrganizationStats);
exports.organizationRoutes = router;
//# sourceMappingURL=organization.route.js.map