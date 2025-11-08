"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.Conversation = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const user_interface_1 = require("../user/user.interface");
const messagingTtlDays = Math.max(config_1.default.messaging_ttl_days || 30, 1);
const messagingTtlSeconds = messagingTtlDays * 24 * 60 * 60;
const conversationParticipantSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.UserRole),
        required: true,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
}, { _id: false });
const conversationSchema = new mongoose_1.Schema({
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "School",
        required: true,
        index: true,
    },
    participantIds: {
        type: [conversationParticipantSchema],
        validate: {
            validator: function (value) {
                return Array.isArray(value) && value.length >= 2;
            },
            message: "A conversation must have at least two participants",
        },
        required: true,
    },
    participantHash: {
        type: String,
        required: true,
        index: true,
    },
    contextType: {
        type: String,
        enum: ["direct", "student-thread"],
        default: "direct",
        index: true,
    },
    contextStudentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Student",
        index: true,
    },
    lastMessageAt: {
        type: Date,
        index: true,
    },
    lastMessagePreview: {
        type: String,
        maxlength: 200,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
    },
}, {
    timestamps: true,
});
conversationSchema.index({
    schoolId: 1,
    participantHash: 1,
    contextType: 1,
    contextStudentId: 1,
}, { unique: false });
conversationSchema.index({
    schoolId: 1,
    "participantIds.userId": 1,
    lastMessageAt: -1,
});
const messageSchema = new mongoose_1.Schema({
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "MessagingConversation",
        required: true,
        index: true,
    },
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "School",
        required: true,
        index: true,
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    body: {
        type: String,
        required: true,
        trim: true,
        maxlength: config_1.default.messaging_max_body_length || 2000,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
}, {
    timestamps: false,
    versionKey: false,
});
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: messagingTtlSeconds });
exports.Conversation = (0, mongoose_1.model)("MessagingConversation", conversationSchema);
exports.Message = (0, mongoose_1.model)("MessagingMessage", messageSchema);
//# sourceMappingURL=messaging.model.js.map