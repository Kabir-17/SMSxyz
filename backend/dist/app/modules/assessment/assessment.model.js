"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentAdminPreference = exports.AssessmentResult = exports.AssessmentCategory = exports.Assessment = void 0;
const mongoose_1 = require("mongoose");
const assessmentSchema = new mongoose_1.Schema({
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "School",
        required: true,
        index: true,
    },
    classId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Class",
    },
    subjectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
        index: true,
    },
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
        index: true,
    },
    grade: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
        index: true,
    },
    section: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        match: /^[A-Z]$/,
        index: true,
    },
    examName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
    },
    examTypeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "AssessmentCategory",
        index: true,
    },
    examTypeLabel: {
        type: String,
        trim: true,
        maxlength: 100,
    },
    examDate: {
        type: Date,
        required: true,
        index: true,
    },
    totalMarks: {
        type: Number,
        required: true,
        min: 1,
        max: 1000,
    },
    note: {
        type: String,
        trim: true,
        maxlength: 1000,
    },
    academicYear: {
        type: String,
        trim: true,
        match: /^\d{4}-\d{4}$/,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    publishedAt: {
        type: Date,
    },
    isArchived: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {
    timestamps: true,
});
assessmentSchema.index({
    schoolId: 1,
    grade: 1,
    section: 1,
    subjectId: 1,
    examDate: -1,
}, {
    name: "assessment_scope_index",
});
const assessmentCategorySchema = new mongoose_1.Schema({
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "School",
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 200,
    },
    order: {
        type: Number,
        default: 0,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
assessmentCategorySchema.index({ schoolId: 1, name: 1 }, { unique: true, name: "unique_category_per_school" });
const assessmentResultSchema = new mongoose_1.Schema({
    assessmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Assessment",
        required: true,
        index: true,
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
        index: true,
    },
    marksObtained: {
        type: Number,
        required: true,
        min: 0,
    },
    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    grade: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5,
    },
    remarks: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    gradedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    gradedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
assessmentResultSchema.index({ assessmentId: 1, studentId: 1 }, { unique: true, name: "unique_result_per_student_assessment" });
const assessmentAdminPreferenceSchema = new mongoose_1.Schema({
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "School",
        required: true,
        index: true,
    },
    assessmentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Assessment",
        required: true,
        index: true,
    },
    adminUserId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
    isHidden: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
assessmentAdminPreferenceSchema.index({ adminUserId: 1, assessmentId: 1 }, {
    unique: true,
    name: "unique_admin_preference_per_assessment",
});
exports.Assessment = (0, mongoose_1.model)("Assessment", assessmentSchema);
exports.AssessmentCategory = (0, mongoose_1.model)("AssessmentCategory", assessmentCategorySchema);
exports.AssessmentResult = (0, mongoose_1.model)("AssessmentResult", assessmentResultSchema);
exports.AssessmentAdminPreference = (0, mongoose_1.model)("AssessmentAdminPreference", assessmentAdminPreferenceSchema);
//# sourceMappingURL=assessment.model.js.map