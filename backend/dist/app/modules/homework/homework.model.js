"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeworkSubmission = exports.Homework = void 0;
const mongoose_1 = require("mongoose");
const rubricCriteriaSchema = new mongoose_1.Schema({
    criteria: {
        type: String,
        required: [true, 'Rubric criteria is required'],
        trim: true,
        maxlength: [200, 'Criteria cannot exceed 200 characters'],
    },
    maxPoints: {
        type: Number,
        required: [true, 'Maximum points is required'],
        min: [0, 'Maximum points cannot be negative'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
    },
}, {
    _id: false,
});
const homeworkSchema = new mongoose_1.Schema({
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School ID is required'],
        index: true,
    },
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: [true, 'Teacher ID is required'],
        index: true,
    },
    subjectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Subject',
        required: [true, 'Subject ID is required'],
        index: true,
    },
    classId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Class',
        index: true,
    },
    grade: {
        type: Number,
        required: [true, 'Grade is required'],
        min: [1, 'Grade must be at least 1'],
        max: [12, 'Grade cannot exceed 12'],
        index: true,
    },
    section: {
        type: String,
        trim: true,
        uppercase: true,
        match: [/^[A-Z]$/, 'Section must be a single uppercase letter'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
        index: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    instructions: {
        type: String,
        trim: true,
        maxlength: [2000, 'Instructions cannot exceed 2000 characters'],
    },
    homeworkType: {
        type: String,
        required: [true, 'Homework type is required'],
        enum: {
            values: ['assignment', 'project', 'reading', 'practice', 'research', 'presentation', 'other'],
            message: 'Homework type must be one of: assignment, project, reading, practice, research, presentation, other',
        },
        index: true,
    },
    priority: {
        type: String,
        required: [true, 'Priority is required'],
        enum: {
            values: ['low', 'medium', 'high', 'urgent'],
            message: 'Priority must be one of: low, medium, high, urgent',
        },
        default: 'medium',
        index: true,
    },
    assignedDate: {
        type: Date,
        required: [true, 'Assigned date is required'],
        default: Date.now,
        index: true,
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date is required'],
        validate: {
            validator: function (dueDate) {
                return dueDate > this.assignedDate;
            },
            message: 'Due date must be after assigned date',
        },
        index: true,
    },
    estimatedDuration: {
        type: Number,
        required: [true, 'Estimated duration is required'],
        min: [15, 'Estimated duration must be at least 15 minutes'],
        max: [1440, 'Estimated duration cannot exceed 24 hours (1440 minutes)'],
    },
    totalMarks: {
        type: Number,
        required: [true, 'Total marks is required'],
        min: [1, 'Total marks must be at least 1'],
        max: [1000, 'Total marks cannot exceed 1000'],
    },
    passingMarks: {
        type: Number,
        required: [true, 'Passing marks is required'],
        min: [0, 'Passing marks cannot be negative'],
        validate: {
            validator: function (passingMarks) {
                return passingMarks <= this.totalMarks;
            },
            message: 'Passing marks cannot exceed total marks',
        },
    },
    attachments: {
        type: [String],
        validate: {
            validator: function (attachments) {
                return attachments.length <= 10;
            },
            message: 'Cannot have more than 10 attachments',
        },
    },
    submissionType: {
        type: String,
        required: [true, 'Submission type is required'],
        enum: {
            values: ['text', 'file', 'both', 'none'],
            message: 'Submission type must be one of: text, file, both, none',
        },
    },
    allowLateSubmission: {
        type: Boolean,
        default: true,
    },
    latePenalty: {
        type: Number,
        min: [0, 'Late penalty cannot be negative'],
        max: [100, 'Late penalty cannot exceed 100%'],
        default: 10,
    },
    maxLateDays: {
        type: Number,
        min: [1, 'Max late days must be at least 1'],
        max: [30, 'Max late days cannot exceed 30'],
        default: 3,
    },
    isGroupWork: {
        type: Boolean,
        default: false,
    },
    maxGroupSize: {
        type: Number,
        min: [2, 'Max group size must be at least 2'],
        max: [10, 'Max group size cannot exceed 10'],
        required: function () { return this.isGroupWork; },
    },
    rubric: {
        type: [rubricCriteriaSchema],
        validate: {
            validator: function (rubric) {
                return rubric.length <= 20;
            },
            message: 'Cannot have more than 20 rubric criteria',
        },
    },
    tags: {
        type: [String],
        validate: {
            validator: function (tags) {
                return tags.length <= 10;
            },
            message: 'Cannot have more than 10 tags',
        },
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
    },
    reminderSent: {
        type: Boolean,
        default: false,
        index: true,
    },
    reminderDate: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false,
});
const homeworkSubmissionSchema = new mongoose_1.Schema({
    homeworkId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Homework',
        required: [true, 'Homework ID is required'],
        index: true,
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student ID is required'],
        index: true,
    },
    groupMembers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Student',
        }],
    submissionText: {
        type: String,
        trim: true,
        maxlength: [5000, 'Submission text cannot exceed 5000 characters'],
    },
    attachments: {
        type: [String],
        validate: {
            validator: function (attachments) {
                return attachments.length <= 10;
            },
            message: 'Cannot have more than 10 attachments',
        },
    },
    submittedAt: {
        type: Date,
        required: [true, 'Submitted at time is required'],
        default: Date.now,
        index: true,
    },
    isLate: {
        type: Boolean,
        default: false,
        index: true,
    },
    daysLate: {
        type: Number,
        default: 0,
        min: [0, 'Days late cannot be negative'],
    },
    latePenalty: {
        type: Number,
        default: 0,
        min: [0, 'Late penalty cannot be negative'],
        max: [100, 'Late penalty cannot exceed 100%'],
    },
    status: {
        type: String,
        enum: ['submitted', 'graded', 'returned', 'missing'],
        default: 'submitted',
        index: true,
    },
    marksObtained: {
        type: Number,
        min: [0, 'Marks obtained cannot be negative'],
    },
    grade: {
        type: String,
        enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'],
    },
    percentage: {
        type: Number,
        min: [0, 'Percentage cannot be negative'],
        max: [100, 'Percentage cannot exceed 100'],
    },
    feedback: {
        type: String,
        trim: true,
        maxlength: [2000, 'Feedback cannot exceed 2000 characters'],
    },
    teacherComments: {
        type: String,
        trim: true,
        maxlength: [1000, 'Teacher comments cannot exceed 1000 characters'],
    },
    gradedAt: {
        type: Date,
    },
    gradedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    revision: {
        requested: {
            type: Boolean,
            default: false,
        },
        requestedAt: {
            type: Date,
        },
        reason: {
            type: String,
            trim: true,
            maxlength: [500, 'Revision reason cannot exceed 500 characters'],
        },
        completed: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
        },
    },
}, {
    timestamps: true,
    versionKey: false,
});
homeworkSchema.methods.isOverdue = function () {
    const now = new Date();
    return this.dueDate < now && this.isPublished;
};
homeworkSchema.methods.isDueToday = function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.dueDate >= today && this.dueDate < tomorrow;
};
homeworkSchema.methods.isDueTomorrow = function () {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    return this.dueDate >= tomorrow && this.dueDate < dayAfter;
};
homeworkSchema.methods.getDaysUntilDue = function () {
    const now = new Date();
    const timeDiff = this.dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
};
homeworkSchema.methods.getDaysOverdue = function () {
    const now = new Date();
    if (this.dueDate >= now)
        return 0;
    const timeDiff = now.getTime() - this.dueDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
};
homeworkSchema.methods.getFormattedDueDate = function () {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return this.dueDate.toLocaleDateString('en-US', options);
};
homeworkSchema.methods.getEstimatedDurationHours = function () {
    return Math.round((this.estimatedDuration / 60) * 100) / 100;
};
homeworkSchema.methods.canSubmit = function () {
    if (!this.isPublished)
        return false;
    if (!this.allowLateSubmission && this.isOverdue())
        return false;
    if (this.allowLateSubmission && this.maxLateDays) {
        const daysOverdue = this.getDaysOverdue();
        return daysOverdue <= this.maxLateDays;
    }
    return true;
};
homeworkSchema.methods.getLatePenaltyPercentage = function (submissionDate) {
    if (submissionDate <= this.dueDate)
        return 0;
    const timeDiff = submissionDate.getTime() - this.dueDate.getTime();
    const daysLate = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const penalty = daysLate * (this.latePenalty || 0);
    return Math.min(penalty, 100);
};
homeworkSchema.methods.getEligibleStudents = async function () {
    const Student = (0, mongoose_1.model)('Student');
    const query = {
        schoolId: this.schoolId,
        grade: this.grade,
        isActive: true,
    };
    if (this.section) {
        query.section = this.section;
    }
    return await Student.find(query)
        .populate('userId', 'firstName lastName')
        .sort({ rollNumber: 1 });
};
homeworkSchema.methods.getSubmissionStats = async function () {
    const HomeworkSubmission = (0, mongoose_1.model)('HomeworkSubmission');
    const submissions = await HomeworkSubmission.find({ homeworkId: this._id });
    const eligibleStudents = await this.getEligibleStudents();
    const totalStudents = eligibleStudents.length;
    const submittedCount = submissions.length;
    const pendingCount = totalStudents - submittedCount;
    const lateCount = submissions.filter(s => s.isLate).length;
    const gradedCount = submissions.filter(s => s.status === 'graded').length;
    const gradedSubmissions = submissions.filter(s => s.marksObtained !== undefined);
    const averageScore = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / gradedSubmissions.length
        : 0;
    const scores = gradedSubmissions.map(s => s.percentage || 0);
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
    const onTimeSubmissions = submissions.filter(s => !s.isLate).length;
    const onTimePercentage = submittedCount > 0 ? (onTimeSubmissions / submittedCount) * 100 : 0;
    const submissionPercentage = totalStudents > 0 ? (submittedCount / totalStudents) * 100 : 0;
    const gradeCount = {};
    submissions.forEach(s => {
        if (s.grade) {
            gradeCount[s.grade] = (gradeCount[s.grade] || 0) + 1;
        }
    });
    const gradeDistribution = Object.entries(gradeCount).map(([grade, count]) => ({
        grade,
        count,
        percentage: submittedCount > 0 ? Math.round((count / submittedCount) * 100) : 0
    }));
    return {
        totalStudents,
        submittedCount,
        pendingCount,
        lateCount,
        gradedCount,
        averageScore: Math.round(averageScore * 100) / 100,
        highestScore,
        lowestScore,
        onTimePercentage: Math.round(onTimePercentage * 100) / 100,
        submissionPercentage: Math.round(submissionPercentage * 100) / 100,
        gradeDistribution
    };
};
homeworkSchema.statics.findBySchool = function (schoolId) {
    return this.find({ schoolId })
        .populate('teacherId', 'userId teacherId')
        .populate('subjectId', 'name code')
        .sort({ dueDate: -1, assignedDate: -1 });
};
homeworkSchema.statics.findByTeacher = function (teacherId) {
    return this.find({ teacherId })
        .populate('subjectId', 'name code')
        .sort({ dueDate: -1, assignedDate: -1 });
};
homeworkSchema.statics.findBySubject = function (subjectId) {
    return this.find({ subjectId })
        .populate({
        path: 'teacherId',
        select: 'userId teacherId',
        populate: {
            path: 'userId',
            select: 'firstName lastName'
        }
    })
        .sort({ dueDate: -1, assignedDate: -1 });
};
homeworkSchema.statics.findByClass = function (schoolId, grade, section) {
    const query = { schoolId, grade, isPublished: true };
    if (section)
        query.section = section;
    return this.find(query)
        .populate({
        path: 'teacherId',
        select: 'userId teacherId',
        populate: {
            path: 'userId',
            select: 'firstName lastName'
        }
    })
        .populate('subjectId', 'name code')
        .sort({ dueDate: 1, priority: -1 });
};
homeworkSchema.statics.findByStudent = function (studentId) {
    return (0, mongoose_1.model)('Student').findById(studentId)
        .then(student => {
        if (!student)
            throw new Error('Student not found');
        const query = {
            schoolId: student.schoolId,
            grade: student.grade,
            isPublished: true
        };
        if (student.section)
            query.section = student.section;
        return this.find(query)
            .populate({
            path: 'teacherId',
            select: 'userId teacherId',
            populate: {
                path: 'userId',
                select: 'firstName lastName'
            }
        })
            .populate('subjectId', 'name code')
            .sort({ dueDate: 1, priority: -1 });
    });
};
homeworkSchema.statics.findUpcoming = function (schoolId, days = 7) {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    return this.find({
        schoolId,
        isPublished: true,
        dueDate: { $gte: now, $lte: futureDate },
    })
        .populate({
        path: 'teacherId',
        select: 'userId teacherId',
        populate: {
            path: 'userId',
            select: 'firstName lastName'
        }
    })
        .populate('subjectId', 'name code')
        .sort({ dueDate: 1, priority: -1 });
};
homeworkSchema.statics.findOverdue = function (schoolId) {
    const now = new Date();
    return this.find({
        schoolId,
        isPublished: true,
        dueDate: { $lt: now },
    })
        .populate({
        path: 'teacherId',
        select: 'userId teacherId',
        populate: {
            path: 'userId',
            select: 'firstName lastName'
        }
    })
        .populate('subjectId', 'name code')
        .sort({ dueDate: -1 });
};
homeworkSchema.statics.findDueToday = function (schoolId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.find({
        schoolId,
        isPublished: true,
        dueDate: { $gte: today, $lt: tomorrow },
    })
        .populate({
        path: 'teacherId',
        select: 'userId teacherId',
        populate: {
            path: 'userId',
            select: 'firstName lastName'
        }
    })
        .populate('subjectId', 'name code')
        .sort({ dueDate: 1 });
};
homeworkSchema.index({ schoolId: 1, dueDate: 1 });
homeworkSchema.index({ teacherId: 1, assignedDate: -1 });
homeworkSchema.index({ subjectId: 1, dueDate: 1 });
homeworkSchema.index({ grade: 1, section: 1, dueDate: 1 });
homeworkSchema.index({ isPublished: 1, dueDate: 1 });
homeworkSchema.index({ priority: 1, dueDate: 1 });
homeworkSubmissionSchema.index({ homeworkId: 1, studentId: 1 }, { unique: true });
homeworkSubmissionSchema.index({ studentId: 1, submittedAt: -1 });
homeworkSubmissionSchema.index({ status: 1 });
homeworkSubmissionSchema.index({ isLate: 1 });
homeworkSchema.pre('save', function (next) {
    if (this.rubric && this.rubric.length > 0) {
        const totalRubricPoints = this.rubric.reduce((sum, criteria) => sum + criteria.maxPoints, 0);
        if (Math.abs(totalRubricPoints - this.totalMarks) > 0.01) {
            return next(new Error('Rubric total points must equal total marks'));
        }
    }
    next();
});
homeworkSubmissionSchema.pre('save', async function (next) {
    const homework = await (0, mongoose_1.model)('Homework').findById(this.homeworkId);
    if (homework) {
        if (this.submittedAt > homework.dueDate) {
            this.isLate = true;
            const timeDiff = this.submittedAt.getTime() - homework.dueDate.getTime();
            this.daysLate = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            this.latePenalty = homework.getLatePenaltyPercentage(this.submittedAt);
        }
        if (this.marksObtained !== undefined) {
            let adjustedMarks = this.marksObtained;
            if (this.isLate && this.latePenalty > 0) {
                adjustedMarks = this.marksObtained * (1 - this.latePenalty / 100);
            }
            this.percentage = Math.round((adjustedMarks / homework.totalMarks) * 100);
            this.grade = getGradeFromPercentage(this.percentage);
        }
    }
    next();
});
function getGradeFromPercentage(percentage) {
    if (percentage >= 97)
        return 'A+';
    if (percentage >= 93)
        return 'A';
    if (percentage >= 90)
        return 'A-';
    if (percentage >= 87)
        return 'B+';
    if (percentage >= 83)
        return 'B';
    if (percentage >= 80)
        return 'B-';
    if (percentage >= 77)
        return 'C+';
    if (percentage >= 73)
        return 'C';
    if (percentage >= 70)
        return 'C-';
    if (percentage >= 67)
        return 'D+';
    if (percentage >= 65)
        return 'D';
    return 'F';
}
homeworkSubmissionSchema.methods.getGradeFromPercentage = function (percentage) {
    if (percentage >= 97)
        return 'A+';
    if (percentage >= 93)
        return 'A';
    if (percentage >= 90)
        return 'A-';
    if (percentage >= 87)
        return 'B+';
    if (percentage >= 83)
        return 'B';
    if (percentage >= 80)
        return 'B-';
    if (percentage >= 77)
        return 'C+';
    if (percentage >= 73)
        return 'C';
    if (percentage >= 70)
        return 'C-';
    if (percentage >= 67)
        return 'D+';
    if (percentage >= 63)
        return 'D';
    if (percentage >= 60)
        return 'D-';
    return 'F';
};
homeworkSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        ret.estimatedDurationHours = doc.getEstimatedDurationHours();
        ret.isOverdue = doc.isOverdue();
        ret.isDueToday = doc.isDueToday();
        ret.isDueTomorrow = doc.isDueTomorrow();
        ret.daysUntilDue = doc.getDaysUntilDue();
        ret.daysOverdue = doc.getDaysOverdue();
        ret.formattedDueDate = doc.getFormattedDueDate();
        ret.canSubmit = doc.canSubmit();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
homeworkSubmissionSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Homework = (0, mongoose_1.model)('Homework', homeworkSchema);
exports.HomeworkSubmission = (0, mongoose_1.model)('HomeworkSubmission', homeworkSubmissionSchema);
//# sourceMappingURL=homework.model.js.map