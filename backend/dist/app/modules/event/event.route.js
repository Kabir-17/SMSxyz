"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRoutes = void 0;
const express_1 = require("express");
const event_controller_1 = require("./event.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const event_validation_1 = require("./event.validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', (0, auth_1.authorize)('admin', 'superadmin', 'teacher'), (0, validateRequest_1.validateRequest)(event_validation_1.eventValidation.createEventSchema), event_controller_1.eventController.createEvent);
router.get('/', (0, validateRequest_1.validateRequest)(event_validation_1.eventValidation.getEventsSchema), event_controller_1.eventController.getEvents);
router.get('/today', event_controller_1.eventController.getTodaysEvents);
router.get('/upcoming', event_controller_1.eventController.getUpcomingEvents);
router.get('/:id', (0, validateRequest_1.validateRequest)(event_validation_1.eventValidation.getEventByIdSchema), event_controller_1.eventController.getEventById);
router.put('/:id', (0, auth_1.authorize)('admin', 'superadmin', 'teacher'), (0, validateRequest_1.validateRequest)(event_validation_1.eventValidation.updateEventSchema), event_controller_1.eventController.updateEvent);
router.delete('/:id', (0, auth_1.authorize)('admin', 'superadmin', 'teacher'), event_controller_1.eventController.deleteEvent);
exports.EventRoutes = router;
//# sourceMappingURL=event.route.js.map