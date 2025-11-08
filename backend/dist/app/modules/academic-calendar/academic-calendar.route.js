"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicCalendarRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const academic_calendar_controller_1 = require("./academic-calendar.controller");
const academic_calendar_validation_1 = require("./academic-calendar.validation");
const router = express_1.default.Router();
router.post("/", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), auth_1.enforceSchoolIsolation, multer_config_1.multerUpload.array("attachments", 5), bodyParser_1.parseBody, (0, validateRequest_1.validateRequest)(academic_calendar_validation_1.AcademicCalendarValidation.createAcademicCalendarValidationSchema), academic_calendar_controller_1.AcademicCalendarController.createCalendarEvent);
router.get("/", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER, user_interface_1.UserRole.STUDENT, user_interface_1.UserRole.PARENT, user_interface_1.UserRole.ACCOUNTANT), auth_1.enforceSchoolIsolation, academic_calendar_controller_1.AcademicCalendarController.getAllCalendarEvents);
router.get("/stats/:schoolId", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), academic_calendar_controller_1.AcademicCalendarController.getCalendarStats);
router.get("/monthly/:schoolId/:year/:month", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER, user_interface_1.UserRole.STUDENT, user_interface_1.UserRole.PARENT, user_interface_1.UserRole.ACCOUNTANT), academic_calendar_controller_1.AcademicCalendarController.getMonthlyCalendar);
router.get("/upcoming/:schoolId", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER, user_interface_1.UserRole.STUDENT, user_interface_1.UserRole.PARENT, user_interface_1.UserRole.ACCOUNTANT), academic_calendar_controller_1.AcademicCalendarController.getUpcomingEvents);
router.post("/exam-schedule", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(academic_calendar_validation_1.AcademicCalendarValidation.createExamScheduleValidationSchema), academic_calendar_controller_1.AcademicCalendarController.createExamSchedule);
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER, user_interface_1.UserRole.STUDENT, user_interface_1.UserRole.PARENT, user_interface_1.UserRole.ACCOUNTANT), academic_calendar_controller_1.AcademicCalendarController.getCalendarEventById);
router.patch("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), auth_1.enforceSchoolIsolation, multer_config_1.multerUpload.array("attachments", 5), bodyParser_1.parseBody, (0, validateRequest_1.validateRequest)(academic_calendar_validation_1.AcademicCalendarValidation.updateAcademicCalendarValidationSchema), academic_calendar_controller_1.AcademicCalendarController.updateCalendarEvent);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), auth_1.enforceSchoolIsolation, academic_calendar_controller_1.AcademicCalendarController.deleteCalendarEvent);
exports.AcademicCalendarRoutes = router;
//# sourceMappingURL=academic-calendar.route.js.map