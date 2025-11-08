"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCredentials = void 0;
const mongoose_1 = require("mongoose");
const userCredentialsSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
        index: true,
    },
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "School",
        required: [true, "School ID is required"],
        index: true,
    },
    initialUsername: {
        type: String,
        required: [true, "Initial username is required"],
        trim: true,
    },
    initialPassword: {
        type: String,
        required: [true, "Initial password is required"],
    },
    hasChangedPassword: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ["student", "parent", "teacher"],
        required: [true, "Role is required"],
        index: true,
    },
    associatedStudentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Student",
        required: function () {
            return this.role === "parent";
        },
        index: true,
    },
    issuedAt: {
        type: Date,
        default: Date.now,
    },
    lastAccessedAt: {
        type: Date,
    },
    issuedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Issued by admin is required"],
    },
}, {
    timestamps: true,
    versionKey: false,
});
userCredentialsSchema.index({ schoolId: 1, role: 1 });
userCredentialsSchema.index({ associatedStudentId: 1 });
userCredentialsSchema.index({ hasChangedPassword: 1 });
userCredentialsSchema.index({ userId: 1, associatedStudentId: 1 }, {
    unique: true,
    partialFilterExpression: { associatedStudentId: { $exists: true } }
});
userCredentialsSchema.index({ userId: 1 }, {
    unique: true,
    partialFilterExpression: { role: "student" }
});
userCredentialsSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        if (!options || !options.includePassword) {
            delete ret.initialPassword;
        }
        return ret;
    },
});
exports.UserCredentials = (0, mongoose_1.model)("UserCredentials", userCredentialsSchema);
//# sourceMappingURL=userCredentials.model.js.map