"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const student_controller_1 = require("./student.controller");
const student_validation_1 = require("./student.validation");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 20,
        fieldSize: 2 * 1024 * 1024,
        fieldNameSize: 100,
        fields: 50,
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
router.get("/", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER), (0, validateRequest_1.validateRequest)(student_validation_1.getStudentsValidationSchema), student_controller_1.StudentController.getAllStudents);
router.get("/stats/:schoolId", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(student_validation_1.getStudentStatsValidationSchema), student_controller_1.StudentController.getStudentStats);
router.get("/school/:schoolId/grade/:grade/section/:section", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER), (0, validateRequest_1.validateRequest)(student_validation_1.getStudentsByGradeAndSectionSchema), student_controller_1.StudentController.getStudentsByGradeAndSection);
router.get("/dashboard", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.STUDENT), student_controller_1.StudentController.getStudentDashboard);
router.get("/attendance", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.STUDENT), student_controller_1.StudentController.getStudentAttendance);
router.get("/grades", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.STUDENT), student_controller_1.StudentController.getStudentGrades);
router.get("/homework", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.STUDENT), student_controller_1.StudentController.getStudentHomework);
router.get("/schedule", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.STUDENT), student_controller_1.StudentController.getStudentSchedule);
router.get("/calendar", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.STUDENT), student_controller_1.StudentController.getStudentCalendar);
router.get("/disciplinary/actions", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.STUDENT), student_controller_1.StudentController.getStudentDisciplinaryActions);
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER, user_interface_1.UserRole.STUDENT, user_interface_1.UserRole.PARENT), (0, validateRequest_1.validateRequest)(student_validation_1.getStudentValidationSchema), student_controller_1.StudentController.getStudentById);
router.patch("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(student_validation_1.updateStudentValidationSchema), student_controller_1.StudentController.updateStudent);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(student_validation_1.deleteStudentValidationSchema), student_controller_1.StudentController.deleteStudent);
router.post("/:id/photos", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), upload.array("photos"), (0, validateRequest_1.validateRequest)(student_validation_1.uploadPhotosValidationSchema), student_controller_1.StudentController.uploadStudentPhotos);
router.get("/:id/photos", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER, user_interface_1.UserRole.STUDENT, user_interface_1.UserRole.PARENT), (0, validateRequest_1.validateRequest)(student_validation_1.getStudentValidationSchema), student_controller_1.StudentController.getStudentPhotos);
router.get("/:id/photos/available-slots", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(student_validation_1.getStudentValidationSchema), student_controller_1.StudentController.getAvailablePhotoSlots);
router.get("/:id/credentials", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(student_validation_1.getStudentValidationSchema), student_controller_1.StudentController.getStudentCredentials);
router.delete("/:studentId/photos/:photoId", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(student_validation_1.deletePhotoValidationSchema), student_controller_1.StudentController.deleteStudentPhoto);
exports.StudentRoutes = router;
//# sourceMappingURL=student.route.js.map