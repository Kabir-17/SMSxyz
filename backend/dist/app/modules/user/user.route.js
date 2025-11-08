"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_1 = require("../../middlewares/auth");
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.get('/me', auth_1.authenticate, user_controller_1.getCurrentUser);
router.put('/:id/change-password', auth_1.authenticate, (0, validateRequest_1.validateRequest)(user_validation_1.changePasswordValidationSchema), user_controller_1.changePassword);
router.get('/school/:schoolId', auth_1.requireSchoolAdmin, user_controller_1.getUsersBySchool);
router.get('/role/:role', auth_1.requireSchoolAdmin, user_controller_1.getUsersByRole);
router.post('/', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(user_validation_1.createUserValidationSchema), user_controller_1.createUser);
router.get('/', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(user_validation_1.getUsersValidationSchema), user_controller_1.getUsers);
router.get('/:id', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(user_validation_1.getUserValidationSchema), user_controller_1.getUserById);
router.put('/:id', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(user_validation_1.updateUserValidationSchema), user_controller_1.updateUser);
router.delete('/:id', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(user_validation_1.deleteUserValidationSchema), user_controller_1.deleteUser);
router.put('/:id/reset-password', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(user_validation_1.resetPasswordValidationSchema), user_controller_1.resetPassword);
exports.userRoutes = router;
//# sourceMappingURL=user.route.js.map