"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const class_validation_1 = require("./class.validation");
const class_controller_1 = require("./class.controller");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.post('/', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(class_validation_1.createClassValidationSchema), class_controller_1.ClassController.createClass);
router.get('/', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(class_validation_1.getClassesValidationSchema), class_controller_1.ClassController.getAllClasses);
router.get('/school/:schoolId/stats', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(class_validation_1.getClassStatsValidationSchema), class_controller_1.ClassController.getClassStats);
router.get('/school/:schoolId/grade/:grade', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(class_validation_1.getClassesByGradeValidationSchema), class_controller_1.ClassController.getClassesByGrade);
router.get('/school/:schoolId/grade/:grade/section/:section', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(class_validation_1.getClassByGradeAndSectionValidationSchema), class_controller_1.ClassController.getClassByGradeAndSection);
router.get('/school/:schoolId/grade/:grade/capacity', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(class_validation_1.checkCapacityValidationSchema), class_controller_1.ClassController.checkCapacity);
router.post('/school/:schoolId/grade/:grade/new-section', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(class_validation_1.createNewSectionValidationSchema), class_controller_1.ClassController.createNewSectionIfNeeded);
router.get('/:id', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(class_validation_1.getClassValidationSchema), class_controller_1.ClassController.getClassById);
router.put('/:id', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(class_validation_1.updateClassValidationSchema), class_controller_1.ClassController.updateClass);
router.delete('/:id', auth_1.requireSchoolAdmin, (0, validateRequest_1.validateRequest)(class_validation_1.deleteClassValidationSchema), class_controller_1.ClassController.deleteClass);
exports.classRoutes = router;
//# sourceMappingURL=class.route.js.map