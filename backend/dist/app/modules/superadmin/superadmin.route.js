"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.superadminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const school_controller_1 = require("../school/school.controller");
const school_validation_1 = require("../school/school.validation");
const orange_sms_controller_1 = require("../orange-sms/orange-sms.controller");
const orange_sms_validation_1 = require("../orange-sms/orange-sms.validation");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.use(auth_1.requireSuperadmin);
router.post("/schools", (0, validateRequest_1.validateRequest)(school_validation_1.createSchoolValidationSchema), school_controller_1.createSchool);
router.get("/schools", (0, validateRequest_1.validateRequest)(school_validation_1.getSchoolsValidationSchema), school_controller_1.getAllSchools);
router.get("/schools/:id", (0, validateRequest_1.validateRequest)(school_validation_1.getSchoolValidationSchema), school_controller_1.getSchool);
router.put("/schools/:id", (0, validateRequest_1.validateRequest)(school_validation_1.updateSchoolValidationSchema), school_controller_1.updateSchool);
router.delete("/schools/:id", (0, validateRequest_1.validateRequest)(school_validation_1.deleteSchoolValidationSchema), school_controller_1.deleteSchool);
router.get("/schools/:id/stats", school_controller_1.getSchoolStats);
router.post("/schools/:id/assign-admin", school_controller_1.assignAdmin);
router.put("/schools/:id/status", school_controller_1.updateSchoolStatus);
router.post("/schools/:id/regenerate-api-key", school_controller_1.regenerateApiKey);
router.get("/schools/:id/admin/credentials", school_controller_1.getAdminCredentials);
router.post("/schools/:id/admin/reset-password", school_controller_1.resetAdminPassword);
router.get("/stats", school_controller_1.getSystemStats);
router.get("/system/stats", school_controller_1.getSystemStats);
router.get("/orange-sms", orange_sms_controller_1.getOrangeSmsConfig);
router.put("/orange-sms", (0, validateRequest_1.validateRequest)(orange_sms_validation_1.updateOrangeSmsValidationSchema), orange_sms_controller_1.updateOrangeSmsConfig);
router.post("/orange-sms/test", (0, validateRequest_1.validateRequest)(orange_sms_validation_1.sendOrangeSmsTestValidationSchema), orange_sms_controller_1.sendOrangeSmsTest);
router.put("/system/settings", (req, res) => {
    res.json({
        success: true,
        message: "System settings updated successfully",
        data: req.body,
    });
});
exports.superadminRoutes = router;
//# sourceMappingURL=superadmin.route.js.map