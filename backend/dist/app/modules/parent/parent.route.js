"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const user_interface_1 = require("../user/user.interface");
const parent_controller_1 = require("./parent.controller");
const router = express_1.default.Router();
router.get("/dashboard", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.PARENT), parent_controller_1.ParentController.getParentDashboard);
router.get("/children", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.PARENT), parent_controller_1.ParentController.getParentChildren);
router.get("/children/:childId/attendance", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.PARENT), parent_controller_1.ParentController.getChildAttendance);
router.get("/children/:childId/homework", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.PARENT), parent_controller_1.ParentController.getChildHomework);
router.get("/children/:childId/grades", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.PARENT), parent_controller_1.ParentController.getChildGrades);
router.get("/children/:childId/schedule", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.PARENT), parent_controller_1.ParentController.getChildSchedule);
router.get("/children/:childId/notices", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.PARENT), parent_controller_1.ParentController.getChildNotices);
router.get("/disciplinary/actions", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.PARENT), parent_controller_1.ParentController.getChildDisciplinaryActions);
exports.parentRoutes = router;
//# sourceMappingURL=parent.route.js.map