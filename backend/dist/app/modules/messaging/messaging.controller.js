"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagingController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const messaging_service_1 = require("./messaging.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const listContacts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const contacts = await messaging_service_1.messagingService.listContacts(req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Available contacts retrieved successfully",
        data: contacts,
    });
});
const listThreads = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const threads = await messaging_service_1.messagingService.listConversations(req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Conversations retrieved successfully",
        data: threads,
    });
});
const createThread = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const conversation = await messaging_service_1.messagingService.createConversation(req.user, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Conversation created successfully",
        data: conversation,
    });
});
const listMessages = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const cursor = typeof req.query.cursor === "string"
        ? new Date(req.query.cursor)
        : undefined;
    const limit = typeof req.query.limit === "string"
        ? Number.parseInt(req.query.limit, 10)
        : undefined;
    const payload = await messaging_service_1.messagingService.listMessages(req.user, req.params.id, {
        cursor: cursor && !Number.isNaN(cursor.getTime()) ? cursor : undefined,
        limit,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Messages retrieved successfully",
        data: payload,
    });
});
const sendMessage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const message = await messaging_service_1.messagingService.sendMessage(req.user, req.params.id, req.body.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Message sent successfully",
        data: message,
    });
});
exports.messagingController = {
    listContacts,
    listThreads,
    createThread,
    listMessages,
    sendMessage,
};
//# sourceMappingURL=messaging.controller.js.map