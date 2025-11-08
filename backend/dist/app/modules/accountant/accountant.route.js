"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountantRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const parseAccountantData_1 = require("../../middlewares/parseAccountantData");
const user_interface_1 = require("../user/user.interface");
const accountant_controller_1 = require("./accountant.controller");
const accountant_validation_1 = require("./accountant.validation");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 20,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed"));
        }
    },
});
router.post("/", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), upload.array("photos", 20), parseAccountantData_1.parseAccountantData, (0, validateRequest_1.validateRequest)(accountant_validation_1.createAccountantValidationSchema), accountant_controller_1.AccountantController.createAccountant);
router.get("/", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(accountant_validation_1.getAccountantsValidationSchema), accountant_controller_1.AccountantController.getAllAccountants);
router.get("/stats/:schoolId", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(accountant_validation_1.getAccountantsStatsValidationSchema), accountant_controller_1.AccountantController.getAccountantStats);
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(accountant_validation_1.getAccountantValidationSchema), accountant_controller_1.AccountantController.getAccountantById);
router.patch("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(accountant_validation_1.updateAccountantValidationSchema), accountant_controller_1.AccountantController.updateAccountant);
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(accountant_validation_1.updateAccountantValidationSchema), accountant_controller_1.AccountantController.updateAccountant);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(accountant_validation_1.deleteAccountantValidationSchema), accountant_controller_1.AccountantController.deleteAccountant);
router.get("/:accountantId/credentials", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), accountant_controller_1.AccountantController.getAccountantCredentials);
router.post("/:accountantId/credentials/reset", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), accountant_controller_1.AccountantController.resetAccountantPassword);
exports.AccountantRoutes = router;
//# sourceMappingURL=accountant.route.js.map