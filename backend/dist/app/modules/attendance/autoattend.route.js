"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoAttendRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_1 = require("../../middlewares/auth");
const attendance_validation_1 = require("./attendance.validation");
const autoattend_controller_1 = require("./autoattend.controller");
const router = express_1.default.Router();
router.get("/events/stats", auth_1.authenticate, autoattend_controller_1.getAttendanceEventStats);
router.get("/events", auth_1.authenticate, autoattend_controller_1.getAttendanceEvents);
router.patch("/events/:eventId", auth_1.authenticate, autoattend_controller_1.updateAttendanceEventStatus);
router.get("/reconcile", auth_1.authenticate, autoattend_controller_1.getReconciliationReport);
router.get("/suggest", auth_1.authenticate, autoattend_controller_1.getAttendanceSuggestions);
router.post("/:schoolSlug/events", express_1.default.json(), (0, validateRequest_1.validateRequest)(attendance_validation_1.autoAttendEventValidationSchema), autoattend_controller_1.processAutoAttendEvent);
exports.autoAttendRoutes = router;
//# sourceMappingURL=autoattend.route.js.map