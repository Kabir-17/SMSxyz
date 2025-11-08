"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbsenceSmsLog = void 0;
const mongoose_1 = require("mongoose");
const absenceSmsLogSchema = new mongoose_1.Schema({
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
        index: true,
    },
    classId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
        index: true,
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true,
    },
    parentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Parent',
    },
    parentUserId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    dateKey: {
        type: String,
        required: true,
        index: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending',
        index: true,
    },
    providerMessageId: {
        type: String,
    },
    errorMessage: {
        type: String,
    },
    attempts: {
        type: Number,
        default: 0,
    },
    lastAttemptAt: {
        type: Date,
        default: Date.now,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
    },
}, {
    timestamps: true,
    versionKey: false,
});
absenceSmsLogSchema.index({ studentId: 1, parentUserId: 1, dateKey: 1 }, { unique: true, sparse: true });
exports.AbsenceSmsLog = (0, mongoose_1.model)('AbsenceSmsLog', absenceSmsLogSchema);
//# sourceMappingURL=absence-sms-log.model.js.map