"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.Schema({
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "School",
        required: function () {
            return this.role !== "superadmin";
        },
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        enum: Object.values(user_interface_1.UserRole),
        index: true,
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [3, "Username must be at least 3 characters"],
        maxLength: [30, "Username cannot exceed 30 characters"],
        match: [
            /^[a-z0-9_.-]+$/,
            "Username can only contain lowercase letters, numbers, dots, hyphens, and underscores",
        ],
        index: true,
    },
    passwordHash: {
        type: String,
        required: [true, "Password is required"],
        select: false,
    },
    displayPassword: {
        type: String,
        trim: true,
    },
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return !email || /^\S+@\S+\.\S+$/.test(email);
            },
            message: "Invalid email format",
        },
        index: { sparse: true },
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function (phone) {
                return !phone || /^\+?[\d\s\-\(\)]+$/.test(phone);
            },
            message: "Invalid phone number format",
        },
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
    isFirstLogin: {
        type: Boolean,
        default: true,
    },
    lastLogin: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false,
});
userSchema.methods.validatePassword = async function (password) {
    return await bcryptjs_1.default.compare(password, this.passwordHash);
};
userSchema.methods.updatePassword = async function (newPassword) {
    this.passwordHash = await bcryptjs_1.default.hash(newPassword, 12);
    return await this.save();
};
userSchema.methods.getFullName = function () {
    return `${this.firstName} ${this.lastName}`.trim();
};
userSchema.methods.canAccessSchool = function (schoolId) {
    if (this.role === "superadmin")
        return true;
    return this.schoolId?.toString() === schoolId;
};
userSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date();
    return this.save();
};
userSchema.methods.markFirstLoginComplete =
    async function () {
        this.isFirstLogin = false;
        this.lastLogin = new Date();
        return await this.save();
    };
userSchema.statics.findByUsername = function (username) {
    return this.findOne({ username: username.toLowerCase() }).select("+passwordHash");
};
userSchema.statics.findBySchool = function (schoolId) {
    return this.find({ schoolId, isActive: true })
        .populate("schoolId", "name status")
        .sort({ firstName: 1, lastName: 1 });
};
userSchema.statics.findByRole = function (role) {
    return this.find({ role, isActive: true })
        .populate("schoolId", "name status")
        .sort({ firstName: 1, lastName: 1 });
};
userSchema.statics.findActiveUsers = function () {
    return this.find({ isActive: true })
        .populate("schoolId", "name status")
        .sort({ role: 1, firstName: 1, lastName: 1 });
};
userSchema.index({ schoolId: 1, role: 1 });
userSchema.index({ schoolId: 1, isActive: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ email: 1 }, { sparse: true });
userSchema.pre("save", async function (next) {
    if (this.isModified("passwordHash") &&
        !this.passwordHash.startsWith("$2a$")) {
        this.passwordHash = await bcryptjs_1.default.hash(this.passwordHash, 12);
    }
    if (this.isModified("firstName")) {
        this.firstName = this.firstName
            .trim()
            .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    if (this.isModified("lastName")) {
        this.lastName = this.lastName
            .trim()
            .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    if (this.isModified("username")) {
        this.username = this.username.toLowerCase();
    }
    if (this.role === "superadmin" && this.schoolId) {
        const error = new Error("Superadmin users cannot be associated with a school");
        return next(error);
    }
    if (this.role !== "superadmin" && !this.schoolId) {
        const error = new Error("Non-superadmin users must be associated with a school");
        return next(error);
    }
    next();
});
userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    if (this.role === "superadmin") {
        const error = new Error("Superadmin users cannot be deleted");
        return next(error);
    }
    next();
});
userSchema.virtual("fullName").get(function () {
    return this.getFullName();
});
userSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
    },
});
userSchema.set("toObject", {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
    },
});
exports.User = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.model.js.map