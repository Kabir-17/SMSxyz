"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const parseTeacherData_1 = require("../../middlewares/parseTeacherData");
const memoryUpload = (0, multer_1.default)({
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
const student_validation_1 = require("../student/student.validation");
const student_controller_1 = require("../student/student.controller");
const teacher_validation_1 = require("../teacher/teacher.validation");
const teacher_controller_1 = require("../teacher/teacher.controller");
const userCredentials_controller_1 = require("../user/userCredentials.controller");
const subject_validation_1 = require("../subject/subject.validation");
const subject_controller_1 = require("../subject/subject.controller");
const admin_controller_1 = require("./admin.controller");
const absence_sms_controller_1 = require("../attendance/absence-sms.controller");
const absence_sms_validation_1 = require("../attendance/absence-sms.validation");
const router = express_1.default.Router();
const admin_controller_2 = require("./admin.controller");
router.get("/export/schools", admin_controller_2.listExportableSchools);
router.post("/export/schools/:schoolId/students", express_1.default.json(), admin_controller_2.exportStudentsForSchool);
router.use(auth_1.authenticate);
router.use(auth_1.requireSchoolAdmin);
router.get("/dashboard", admin_controller_1.getAdminDashboard);
router.get("/attendance/absence-sms/logs", (0, validateRequest_1.validateRequest)(absence_sms_validation_1.getAbsenceSmsLogsValidationSchema), absence_sms_controller_1.getAbsenceSmsLogsController);
router.get("/attendance/absence-sms/overview", (0, validateRequest_1.validateRequest)(absence_sms_validation_1.getAbsenceSmsOverviewValidationSchema), absence_sms_controller_1.getAbsenceSmsOverviewController);
router.post("/attendance/absence-sms/trigger", absence_sms_controller_1.triggerAbsenceSmsDispatchController);
router.post("/attendance/absence-sms/test", (0, validateRequest_1.validateRequest)(absence_sms_validation_1.sendAbsenceSmsTestValidationSchema), absence_sms_controller_1.sendAbsenceSmsTestController);
router.post("/students", memoryUpload.fields([{ name: "photos" }]), bodyParser_1.parseBody, (0, validateRequest_1.validateRequest)(student_validation_1.createStudentValidationSchema), student_controller_1.StudentController.createStudent);
router.get("/students", (0, validateRequest_1.validateRequest)(student_validation_1.getStudentsValidationSchema), student_controller_1.StudentController.getAllStudents);
router.get("/students/:id", (0, validateRequest_1.validateRequest)(student_validation_1.getStudentValidationSchema), student_controller_1.StudentController.getStudentById);
router.put("/students/:id", (0, validateRequest_1.validateRequest)(student_validation_1.updateStudentValidationSchema), student_controller_1.StudentController.updateStudent);
router.delete("/students/:id", (0, validateRequest_1.validateRequest)(student_validation_1.deleteStudentValidationSchema), student_controller_1.StudentController.deleteStudent);
router.get("/credentials", userCredentials_controller_1.CredentialsController.getAllCredentials);
router.get("/students/:studentId/credentials", userCredentials_controller_1.CredentialsController.getStudentCredentials);
router.post("/teachers", multer_config_1.multerUpload.fields([{ name: "photo" }]), parseTeacherData_1.parseTeacherData, (0, validateRequest_1.validateRequest)(teacher_validation_1.createTeacherValidationSchema), teacher_controller_1.TeacherController.createTeacher);
router.get("/teachers", (0, validateRequest_1.validateRequest)(teacher_validation_1.getTeachersValidationSchema), teacher_controller_1.TeacherController.getAllTeachers);
router.get("/teachers/:id", (0, validateRequest_1.validateRequest)(teacher_validation_1.getTeacherValidationSchema), teacher_controller_1.TeacherController.getTeacherById);
router.put("/teachers/:id", (0, validateRequest_1.validateRequest)(teacher_validation_1.updateTeacherValidationSchema), teacher_controller_1.TeacherController.updateTeacher);
router.delete("/teachers/:id", (0, validateRequest_1.validateRequest)(teacher_validation_1.deleteTeacherValidationSchema), teacher_controller_1.TeacherController.deleteTeacher);
router.post("/subjects", (0, validateRequest_1.validateRequest)(subject_validation_1.createSubjectValidationSchema), subject_controller_1.createSubject);
router.get("/subjects", (0, validateRequest_1.validateRequest)(subject_validation_1.getSubjectsValidationSchema), subject_controller_1.getAllSubjects);
router.get("/subjects/:id", (0, validateRequest_1.validateRequest)(subject_validation_1.getSubjectValidationSchema), subject_controller_1.getSubjectById);
router.put("/subjects/:id", (0, validateRequest_1.validateRequest)(subject_validation_1.updateSubjectValidationSchema), subject_controller_1.updateSubject);
router.delete("/subjects/:id", (0, validateRequest_1.validateRequest)(subject_validation_1.deleteSubjectValidationSchema), subject_controller_1.deleteSubject);
router.post("/schedules", admin_controller_1.createSchedule);
router.get("/schedules", admin_controller_1.getAllSchedules);
router.get("/schedules/:id", admin_controller_1.getScheduleById);
router.put("/schedules/:id", admin_controller_1.updateSchedule);
router.delete("/schedules/:id", admin_controller_1.deleteSchedule);
router.post("/calendar", multer_config_1.multerUpload.array("attachments", 5), bodyParser_1.parseBody, admin_controller_1.createCalendarEvent);
router.get("/calendar", admin_controller_1.getAllCalendarEvents);
router.get("/calendar/:id", admin_controller_1.getCalendarEventById);
router.put("/calendar/:id", multer_config_1.multerUpload.array("attachments", 5), bodyParser_1.parseBody, admin_controller_1.updateCalendarEvent);
router.delete("/calendar/:id", admin_controller_1.deleteCalendarEvent);
const admin_controller_3 = require("./admin.controller");
const teacher_validation_2 = require("../teacher/teacher.validation");
const school_controller_1 = require("../school/school.controller");
router.get("/disciplinary/actions", admin_controller_3.getAllDisciplinaryActions);
router.patch("/disciplinary/actions/resolve/:actionId", (0, validateRequest_1.validateRequest)(teacher_validation_2.resolveDisciplinaryActionValidationSchema), admin_controller_3.resolveDisciplinaryAction);
router.post("/disciplinary/actions/comment/:actionId", (0, validateRequest_1.validateRequest)(teacher_validation_2.addDisciplinaryActionCommentValidationSchema), admin_controller_3.addDisciplinaryActionComment);
router.get("/school/settings", admin_controller_3.getSchoolSettings);
router.put("/school/settings", admin_controller_3.updateSchoolSettings);
router.put("/school/section-capacity", admin_controller_3.updateSectionCapacity);
router.get("/school/capacity-report", admin_controller_3.getSectionCapacityReport);
router.get('/school/attendance-api', school_controller_1.getAttendanceApiInfo);
exports.adminRoutes = router;
//# sourceMappingURL=admin.route.js.map