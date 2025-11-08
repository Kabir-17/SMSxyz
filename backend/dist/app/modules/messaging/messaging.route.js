"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagingRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const messaging_validation_1 = require("./messaging.validation");
const messaging_controller_1 = require("./messaging.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate, (0, auth_1.authorize)(user_interface_1.UserRole.TEACHER, user_interface_1.UserRole.STUDENT, user_interface_1.UserRole.PARENT));
router.get("/contacts", messaging_controller_1.messagingController.listContacts);
router.get("/threads", (0, validateRequest_1.validateRequest)(messaging_validation_1.listThreadsQuerySchema), messaging_controller_1.messagingController.listThreads);
router.post("/threads", (0, validateRequest_1.validateRequest)(messaging_validation_1.createThreadSchema), messaging_controller_1.messagingController.createThread);
router.get("/threads/:id/messages", (0, validateRequest_1.validateRequest)(messaging_validation_1.listMessagesQuerySchema), messaging_controller_1.messagingController.listMessages);
router.post("/threads/:id/messages", (0, validateRequest_1.validateRequest)(messaging_validation_1.newMessageSchema), messaging_controller_1.messagingController.sendMessage);
exports.messagingRoutes = router;
//# sourceMappingURL=messaging.route.js.map