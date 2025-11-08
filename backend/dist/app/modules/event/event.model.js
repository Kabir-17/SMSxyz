"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true,
        maxlength: 200
    },
    type: {
        type: String,
        required: true,
        enum: ['academic', 'extracurricular', 'administrative', 'holiday', 'exam', 'meeting', 'announcement', 'other']
    },
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
        index: true
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    targetAudience: {
        roles: {
            type: [String],
            enum: ['admin', 'teacher', 'student', 'parent'],
            required: true,
            default: ['student', 'teacher', 'parent']
        },
        grades: {
            type: [Number],
            min: 1,
            max: 12
        },
        sections: {
            type: [String]
        },
        specificUsers: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User'
            }]
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true,
    versionKey: false
});
eventSchema.index({ schoolId: 1, date: 1 });
eventSchema.index({ schoolId: 1, type: 1 });
eventSchema.index({ date: 1, isActive: 1 });
eventSchema.index({ 'targetAudience.roles': 1 });
eventSchema.virtual('id').get(function () {
    return this._id?.toHexString();
});
eventSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
exports.Event = (0, mongoose_1.model)('Event', eventSchema);
//# sourceMappingURL=event.model.js.map