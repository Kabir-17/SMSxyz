"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schoolRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_1 = require("../../middlewares/auth");
const school_validation_1 = require("./school.validation");
const school_controller_1 = require("./school.controller");
const router = express_1.default.Router();
router.post("/", auth_1.requireSuperadmin, (0, validateRequest_1.validateRequest)(school_validation_1.createSchoolValidationSchema), school_controller_1.createSchool);
router.get("/", auth_1.requireSuperadmin, (0, validateRequest_1.validateRequest)(school_validation_1.getSchoolsValidationSchema), school_controller_1.getAllSchools);
router.get("/system/stats", auth_1.requireSuperadmin, school_controller_1.getSystemStats);
router.delete("/:id", auth_1.requireSuperadmin, (0, validateRequest_1.validateRequest)(school_validation_1.deleteSchoolValidationSchema), school_controller_1.deleteSchool);
router.get("/:id", auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(school_validation_1.getSchoolValidationSchema), school_controller_1.getSchool);
router.put("/:id", auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(school_validation_1.updateSchoolValidationSchema), school_controller_1.updateSchool);
router.get("/:id/stats", auth_1.requireSuperadmin, school_controller_1.getSchoolStats);
router.post("/:id/assign-admin", auth_1.requireSuperadmin, school_controller_1.assignAdmin);
router.put("/:id/status", auth_1.requireSuperadmin, school_controller_1.updateSchoolStatus);
router.post("/:id/regenerate-api-key", auth_1.requireSuperadmin, school_controller_1.regenerateApiKey);
exports.schoolRoutes = router;
//# sourceMappingURL=school.route.js.map