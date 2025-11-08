"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const subject_controller_1 = require("./subject.controller");
const subject_validation_1 = require("./subject.validation");
const router = (0, express_1.Router)();
router.post("/", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(subject_validation_1.createSubjectValidationSchema), subject_controller_1.SubjectController.createSubject);
router.get("/", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER), (0, validateRequest_1.validateRequest)(subject_validation_1.getSubjectsValidationSchema), subject_controller_1.SubjectController.getAllSubjects);
router.get("/school/:schoolId/grade/:grade", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER), subject_controller_1.SubjectController.getSubjectsByGrade);
router.get("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN, user_interface_1.UserRole.TEACHER), (0, validateRequest_1.validateRequest)(subject_validation_1.getSubjectValidationSchema), subject_controller_1.SubjectController.getSubjectById);
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(subject_validation_1.updateSubjectValidationSchema), subject_controller_1.SubjectController.updateSubject);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.SUPERADMIN, user_interface_1.UserRole.ADMIN), (0, validateRequest_1.validateRequest)(subject_validation_1.deleteSubjectValidationSchema), subject_controller_1.SubjectController.deleteSubject);
exports.SubjectRoutes = router;
//# sourceMappingURL=subject.route.js.map