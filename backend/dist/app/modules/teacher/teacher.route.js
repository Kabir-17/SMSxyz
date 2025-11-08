"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const parseTeacherData_1 = require("../../middlewares/parseTeacherData");
const user_interface_1 = require("../user/user.interface");
const teacher_controller_1 = require("./teacher.controller");
const teacher_validation_1 = require("./teacher.validation");
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
router.post("/", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), upload.array("photos", 20), parseTeacherData_1.parseTeacherData, (0, validateRequest_1.validateRequest)(teacher_validation_1.createTeacherValidationSchema), teacher_controller_1.TeacherController.createTeacher);
router.get("/", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER), (0, validateRequest_1.validateRequest)(teacher_validation_1.getTeachersValidationSchema), teacher_controller_1.TeacherController.getAllTeachers);
router.get("/stats/:schoolId", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(teacher_validation_1.getTeachersStatsValidationSchema), teacher_controller_1.TeacherController.getTeacherStats);
router.get("/school/:schoolId/subject/:subject", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER), (0, validateRequest_1.validateRequest)(teacher_validation_1.getTeachersBySubjectSchema), teacher_controller_1.TeacherController.getTeachersBySubject);
router.get("/dashboard", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getDashboard);
router.get("/my-schedule", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getMySchedule);
router.get("/my-classes", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getMyClasses);
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER), (0, validateRequest_1.validateRequest)(teacher_validation_1.getTeacherValidationSchema), teacher_controller_1.TeacherController.getTeacherById);
router.patch("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(teacher_validation_1.updateTeacherValidationSchema), teacher_controller_1.TeacherController.updateTeacher);
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(teacher_validation_1.updateTeacherValidationSchema), teacher_controller_1.TeacherController.updateTeacher);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(teacher_validation_1.deleteTeacherValidationSchema), teacher_controller_1.TeacherController.deleteTeacher);
router.post("/:id/photos", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), upload.array("photos"), (0, validateRequest_1.validateRequest)(teacher_validation_1.uploadPhotosValidationSchema), teacher_controller_1.TeacherController.uploadTeacherPhotos);
router.get("/:id/photos", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER), (0, validateRequest_1.validateRequest)(teacher_validation_1.getTeacherValidationSchema), teacher_controller_1.TeacherController.getTeacherPhotos);
router.get("/:id/photos/available-slots", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(teacher_validation_1.getTeacherValidationSchema), teacher_controller_1.TeacherController.getAvailablePhotoSlots);
router.delete("/:teacherId/photos/:photoId", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(teacher_validation_1.deletePhotoValidationSchema), teacher_controller_1.TeacherController.deleteTeacherPhoto);
router.get("/:teacherId/credentials", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), teacher_controller_1.TeacherController.getTeacherCredentials);
router.post("/:teacherId/credentials/reset", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), teacher_controller_1.TeacherController.resetTeacherPassword);
router.get("/attendance/periods", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getCurrentPeriods);
router.get("/attendance/my-students", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getMyStudentsForAttendance);
router.post("/attendance/mark", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.markAttendance);
router.get("/attendance/students/:classId/:subjectId/:period", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getStudentsForAttendance);
router.post("/homework/assign", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), upload.array("attachments", 5), teacher_controller_1.TeacherController.assignHomework);
router.get("/homework/my-assignments", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getMyHomeworkAssignments);
router.post("/discipline/warning", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.issueWarning);
router.post("/discipline/punishment", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), (0, validateRequest_1.validateRequest)(teacher_validation_1.issuePunishmentValidationSchema), teacher_controller_1.TeacherController.issuePunishment);
router.post("/discipline/red-warrant", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.issueRedWarrant);
router.get("/discipline/my-actions", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getMyDisciplinaryActions);
router.patch("/discipline/resolve/:actionId", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(teacher_validation_1.resolveDisciplinaryActionValidationSchema), teacher_controller_1.TeacherController.resolveDisciplinaryAction);
router.post("/discipline/comment/:actionId", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(teacher_validation_1.addDisciplinaryActionCommentValidationSchema), teacher_controller_1.TeacherController.addDisciplinaryActionComment);
router.get("/students/grade/:grade", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getStudentsByGrade);
router.get("/students/grade/:grade/section/:section", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getStudentsByGradeAndSection);
router.get("/discipline/students", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getTeacherStudents);
router.get("/grading/exams", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getMyGradingTasks);
router.get("/grading/tasks", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getMyGradingTasks);
router.get("/grading/exam/:examId", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getExamGradingDetails);
router.get("/grading/exam/:examId/item/:examItemId", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.getExamGradingDetailsWithItem);
router.post("/grading/submit", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER), teacher_controller_1.TeacherController.submitGrades);
exports.TeacherRoutes = router;
//# sourceMappingURL=teacher.route.js.map