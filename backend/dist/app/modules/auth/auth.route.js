"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_1 = require("../../middlewares/auth");
const user_validation_1 = require("../user/user.validation");
const user_controller_1 = require("../user/user.controller");
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.validateRequest)(user_validation_1.loginValidationSchema), user_controller_1.login);
router.post('/logout', user_controller_1.logout);
router.post('/force-password-change', auth_1.authenticate, user_controller_1.forcePasswordChange);
router.get('/verify', auth_1.authenticate, user_controller_1.verify);
exports.authRoutes = router;
//# sourceMappingURL=auth.route.js.map