"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventController = void 0;
const mongoose_1 = require("mongoose");
const event_service_1 = require("./event.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const student_model_1 = require("../student/student.model");
const teacher_model_1 = require("../teacher/teacher.model");
const createEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    const eventData = req.body;
    if (user.role !== 'superadmin' && user.schoolId && user.schoolId !== 'system') {
        eventData.schoolId = user.schoolId;
    }
    else if (user.role === 'superadmin' && !eventData.schoolId) {
        const { School } = await Promise.resolve().then(() => __importStar(require('../school/school.model')));
        const defaultSchool = await School.findOne({ status: 'active' });
        if (defaultSchool) {
            eventData.schoolId = defaultSchool._id;
        }
    }
    const result = await event_service_1.eventService.createEvent(eventData, new mongoose_1.Types.ObjectId(user.id));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Event created successfully',
        data: result
    });
});
const getEvents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    let userGrade;
    let userSection;
    if (user.role === 'student') {
        const student = await student_model_1.Student.findOne({ userId: user.id });
        userGrade = student?.grade;
        userSection = student?.section;
    }
    else if (user.role === 'teacher') {
        const teacher = await teacher_model_1.Teacher.findOne({ userId: user.id });
        userGrade = teacher?.grades?.[0];
        userSection = teacher?.sections?.[0];
    }
    const result = await event_service_1.eventService.getEvents(new mongoose_1.Types.ObjectId(user.schoolId), user.role, userGrade, userSection, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Events fetched successfully',
        data: result
    });
});
const getTodaysEvents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    let userGrade;
    let userSection;
    if (user.role === 'student') {
        const student = await student_model_1.Student.findOne({ userId: user.id });
        userGrade = student?.grade;
        userSection = student?.section;
    }
    else if (user.role === 'teacher') {
        const teacher = await teacher_model_1.Teacher.findOne({ userId: user.id });
        userGrade = teacher?.grades?.[0];
        userSection = teacher?.sections?.[0];
    }
    const result = await event_service_1.eventService.getTodaysEvents(new mongoose_1.Types.ObjectId(user.schoolId), user.role, userGrade, userSection);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Today's events fetched successfully",
        data: result
    });
});
const getUpcomingEvents = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { user } = req;
    let userGrade;
    let userSection;
    const limit = parseInt(req.query.limit) || 5;
    if (user.role === 'student') {
        const student = await student_model_1.Student.findOne({ userId: user.id });
        userGrade = student?.grade;
        userSection = student?.section;
    }
    else if (user.role === 'teacher') {
        const teacher = await teacher_model_1.Teacher.findOne({ userId: user.id });
        userGrade = teacher?.grades?.[0];
        userSection = teacher?.sections?.[0];
    }
    const result = await event_service_1.eventService.getUpcomingEvents(new mongoose_1.Types.ObjectId(user.schoolId), user.role, userGrade, userSection, limit);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Upcoming events fetched successfully',
        data: result
    });
});
const getEventById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    const result = await event_service_1.eventService.getEventById(id, new mongoose_1.Types.ObjectId(user.schoolId));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Event fetched successfully',
        data: result
    });
});
const updateEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    const updateData = req.body;
    const result = await event_service_1.eventService.updateEvent(id, updateData, new mongoose_1.Types.ObjectId(user.schoolId), new mongoose_1.Types.ObjectId(user.id));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Event updated successfully',
        data: result
    });
});
const deleteEvent = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    await event_service_1.eventService.deleteEvent(id, new mongoose_1.Types.ObjectId(user.schoolId), new mongoose_1.Types.ObjectId(user.id));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Event deleted successfully',
        data: null
    });
});
exports.eventController = {
    createEvent,
    getEvents,
    getTodaysEvents,
    getUpcomingEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
//# sourceMappingURL=event.controller.js.map