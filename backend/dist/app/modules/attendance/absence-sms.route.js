"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAbsenceSmsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const absence_sms_controller_1 = require("./absence-sms.controller");
const absence_sms_validation_1 = require("./absence-sms.validation");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.use(auth_1.requireSchoolAdmin);
router.get('/absence-sms/logs', (0, validateRequest_1.validateRequest)(absence_sms_validation_1.getAbsenceSmsLogsValidationSchema), absence_sms_controller_1.getAbsenceSmsLogsController);
router.get('/absence-sms/overview', (0, validateRequest_1.validateRequest)(absence_sms_validation_1.getAbsenceSmsOverviewValidationSchema), absence_sms_controller_1.getAbsenceSmsOverviewController);
router.post('/absence-sms/trigger', absence_sms_controller_1.triggerAbsenceSmsDispatchController);
router.post('/absence-sms/test', (0, validateRequest_1.validateRequest)(absence_sms_validation_1.sendAbsenceSmsTestValidationSchema), absence_sms_controller_1.sendAbsenceSmsTestController);
exports.adminAbsenceSmsRoutes = router;
//# sourceMappingURL=absence-sms.route.js.map