"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentPhoto = exports.Student = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const studentPhotoSchema = new mongoose_1.Schema({
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Student",
        required: [true, "Student ID is required"],
        index: true,
    },
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "School",
        required: [true, "School ID is required"],
        index: true,
    },
    photoPath: {
        type: String,
        required: [true, "Photo path is required"],
    },
    photoNumber: {
        type: Number,
        required: [true, "Photo number is required"],
        min: [1, "Photo number must be at least 1"],
        max: [20, "Photo number cannot exceed 20"],
    },
    filename: {
        type: String,
        required: [true, "Filename is required"],
    },
    originalName: {
        type: String,
        required: [true, "Original filename is required"],
    },
    mimetype: {
        type: String,
        required: [true, "File mimetype is required"],
        validate: {
            validator: function (mimetype) {
                return ["image/jpeg", "image/jpg", "image/png"].includes(mimetype);
            },
            message: "Only JPEG and PNG images are allowed",
        },
    },
    size: {
        type: Number,
        required: [true, "File size is required"],
        max: [
            config_1.default.max_file_size,
            `File size cannot exceed ${config_1.default.max_file_size} bytes`,
        ],
    },
}, {
    timestamps: true,
    versionKey: false,
});
const studentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
        unique: true,
        index: true,
    },
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "School",
        required: [true, "School ID is required"],
        index: true,
    },
    studentId: {
        type: String,
        required: [true, "Student ID is required"],
        unique: true,
        trim: true,
        match: [/^(SCH\d{3,4}-STU-\d{6}-\d{4}|\d{10})$/, "Student ID must follow format SCH001-STU-YYYYGG-RRRR or YYYYGGRRR"],
        index: true,
    },
    grade: {
        type: Number,
        required: [true, "Grade is required"],
        min: [1, "Grade must be at least 1"],
        max: [12, "Grade cannot exceed 12"],
        index: true,
    },
    section: {
        type: String,
        required: [true, "Section is required"],
        trim: true,
        uppercase: true,
        match: [/^[A-Z]$/, "Section must be a single uppercase letter"],
        index: true,
    },
    bloodGroup: {
        type: String,
        required: [true, "Blood group is required"],
        enum: {
            values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            message: "Invalid blood group",
        },
    },
    dob: {
        type: Date,
        required: [true, "Date of birth is required"],
        validate: {
            validator: function (dob) {
                const today = new Date();
                const minAge = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
                const maxAge = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
                return dob >= minAge && dob <= maxAge;
            },
            message: "Student age must be between 3 and 25 years",
        },
    },
    admissionDate: {
        type: Date,
        required: [true, "Admission date is required"],
        default: Date.now,
    },
    admissionYear: {
        type: Number,
        required: [true, "Admission year is required"],
        min: [2000, "Admission year must be 2000 or later"],
        max: [
            new Date().getFullYear() + 1,
            "Admission year cannot be in the future",
        ],
        index: true,
    },
    parentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Parent",
        index: true,
    },
    rollNumber: {
        type: Number,
        min: [1, "Roll number must be at least 1"],
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
    address: {
        street: {
            type: String,
            trim: true,
            maxlength: [100, "Street address cannot exceed 100 characters"],
        },
        city: {
            type: String,
            trim: true,
            maxlength: [50, "City cannot exceed 50 characters"],
        },
        state: {
            type: String,
            trim: true,
            maxlength: [50, "State cannot exceed 50 characters"],
        },
        country: {
            type: String,
            trim: true,
            maxlength: [50, "Country cannot exceed 50 characters"],
        },
        postalCode: {
            type: String,
            trim: true,
            maxlength: [20, "Postal code cannot exceed 20 characters"],
        },
    },
}, {
    timestamps: true,
    versionKey: false,
});
studentSchema.methods.generateStudentId = function () {
    const year = new Date().getFullYear();
    const grade = this.grade.toString().padStart(2, "0");
    const sequence = Math.floor(Math.random() * 900) + 100;
    return `${year}-${grade}-${sequence}`;
};
studentSchema.methods.getAgeInYears = function () {
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
studentSchema.methods.getFullName = function () {
    const userId = this.userId;
    return `${userId?.firstName || ""} ${userId?.lastName || ""}`.trim();
};
studentSchema.methods.getFolderPath = function () {
    const userId = this.userId || {};
    const age = this.getAgeInYears();
    const admitDate = this.admissionDate.toISOString().split("T")[0];
    return `student@${userId.firstName || "unknown"}@${age}@${this.grade}@${this.section}@${this.bloodGroup}@${admitDate}@${this.studentId}`;
};
studentSchema.methods.canUploadMorePhotos =
    async function () {
        const photoCount = await exports.StudentPhoto.countDocuments({
            studentId: this._id,
        });
        return photoCount < config_1.default.max_photos_per_student;
    };
studentSchema.statics.findBySchool = function (schoolId) {
    return this.find({ schoolId, isActive: true })
        .populate("userId", "firstName lastName username email phone")
        .populate("schoolId", "name")
        .populate("parentId")
        .sort({ grade: 1, section: 1, rollNumber: 1 });
};
studentSchema.statics.findByGradeAndSection = function (schoolId, grade, section) {
    return this.find({ schoolId, grade, section, isActive: true })
        .populate("userId", "firstName lastName username email phone")
        .populate("schoolId", "_id name")
        .populate({
        path: "parentId",
        select: "_id userId occupation address relationship",
        populate: {
            path: "userId",
            select: "_id firstName lastName username email phone",
        },
    })
        .sort({ rollNumber: 1 });
};
studentSchema.statics.findByStudentId = function (studentId) {
    return this.findOne({ studentId })
        .populate("userId", "firstName lastName username email phone")
        .populate("schoolId", "_id name")
        .populate({
        path: "parentId",
        select: "_id userId occupation address relationship",
        populate: {
            path: "userId",
            select: "_id firstName lastName username email phone",
        },
    });
};
studentSchema.statics.generateNextStudentId = async function (schoolId, grade, year = new Date().getFullYear()) {
    const gradeStr = grade.toString().padStart(2, "0");
    const prefix = `${year}-${gradeStr}-`;
    const lastStudent = await this.findOne({
        schoolId,
        studentId: { $regex: `^${prefix}` },
    }).sort({ studentId: -1 });
    let nextSequence = 1;
    if (lastStudent) {
        const lastSequence = parseInt(lastStudent.studentId.split("-")[2]);
        nextSequence = lastSequence + 1;
    }
    const sequenceStr = nextSequence.toString().padStart(3, "0");
    return `${prefix}${sequenceStr}`;
};
studentSchema.index({ schoolId: 1, grade: 1, section: 1 });
studentSchema.index({ schoolId: 1, isActive: 1 });
studentSchema.index({ admissionDate: -1 });
studentSchema.index({ grade: 1, section: 1, rollNumber: 1 });
studentPhotoSchema.index({ studentId: 1, photoNumber: 1 }, { unique: true });
studentPhotoSchema.index({ schoolId: 1 });
studentSchema.pre("save", async function (next) {
    if (this.isNew && !this.studentId) {
        this.studentId = await this.constructor.generateNextStudentId(this.schoolId.toString(), this.grade);
    }
    if (this.isModified("section")) {
        this.section = this.section.toUpperCase();
    }
    next();
});
studentSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    await exports.StudentPhoto.deleteMany({ studentId: this._id });
    next();
});
studentSchema.virtual("photos", {
    ref: "StudentPhoto",
    localField: "_id",
    foreignField: "studentId",
    options: { sort: { photoNumber: 1 } },
});
studentSchema.virtual("photoCount", {
    ref: "StudentPhoto",
    localField: "_id",
    foreignField: "studentId",
    count: true,
});
studentSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
studentSchema.set("toObject", {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
studentPhotoSchema.set("toJSON", {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Student = (0, mongoose_1.model)("Student", studentSchema);
exports.StudentPhoto = (0, mongoose_1.model)("StudentPhoto", studentPhotoSchema);
//# sourceMappingURL=student.model.js.map