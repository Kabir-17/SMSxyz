"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherPhoto = exports.Teacher = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const teacherPhotoSchema = new mongoose_1.Schema({
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: [true, 'Teacher ID is required'],
        index: true,
    },
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School ID is required'],
        index: true,
    },
    photoPath: {
        type: String,
        required: [true, 'Photo path is required'],
    },
    photoNumber: {
        type: Number,
        required: [true, 'Photo number is required'],
        min: [1, 'Photo number must be at least 1'],
        max: [20, 'Photo number cannot exceed 20'],
    },
    filename: {
        type: String,
        required: [true, 'Filename is required'],
    },
    originalName: {
        type: String,
        required: [true, 'Original filename is required'],
    },
    mimetype: {
        type: String,
        required: [true, 'File mimetype is required'],
        validate: {
            validator: function (mimetype) {
                return ['image/jpeg', 'image/jpg', 'image/png'].includes(mimetype);
            },
            message: 'Only JPEG and PNG images are allowed',
        },
    },
    size: {
        type: Number,
        required: [true, 'File size is required'],
        max: [config_1.default.max_file_size, `File size cannot exceed ${config_1.default.max_file_size} bytes`],
    },
}, {
    timestamps: true,
    versionKey: false,
});
const teacherSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        unique: true,
        index: true,
    },
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School ID is required'],
        index: true,
    },
    teacherId: {
        type: String,
        required: [true, 'Teacher ID is required'],
        unique: true,
        trim: true,
        match: [/^(SCH\d{3,4}-TCH-\d{4}-\d{3}|TCH-\d{4}-\d{3})$/, 'Teacher ID must follow format SCH001-TCH-YYYY-XXX or TCH-YYYY-XXX'],
        index: true,
    },
    employeeId: {
        type: String,
        trim: true,
        index: true,
    },
    subjects: {
        type: [String],
        required: [true, 'At least one subject is required'],
        validate: {
            validator: function (subjects) {
                return subjects.length > 0;
            },
            message: 'At least one subject must be specified',
        },
    },
    grades: {
        type: [Number],
        required: [true, 'At least one grade is required'],
        validate: {
            validator: function (grades) {
                return grades.length > 0 && grades.every(grade => grade >= 1 && grade <= 12);
            },
            message: 'At least one grade must be specified, and all grades must be between 1 and 12',
        },
        index: true,
    },
    sections: {
        type: [String],
        required: [true, 'At least one section is required'],
        validate: {
            validator: function (sections) {
                return sections.length > 0 && sections.every(section => /^[A-Z]$/.test(section));
            },
            message: 'At least one section must be specified, and all sections must be single uppercase letters',
        },
    },
    designation: {
        type: String,
        required: [true, 'Designation is required'],
        enum: {
            values: [
                'Principal',
                'Vice Principal',
                'Head Teacher',
                'Senior Teacher',
                'Teacher',
                'Assistant Teacher',
                'Subject Coordinator',
                'Sports Teacher',
                'Music Teacher',
                'Art Teacher',
                'Librarian',
                'Lab Assistant',
            ],
            message: 'Invalid designation',
        },
        index: true,
    },
    bloodGroup: {
        type: String,
        required: [true, 'Blood group is required'],
        enum: {
            values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            message: 'Invalid blood group',
        },
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required'],
        validate: {
            validator: function (dob) {
                const today = new Date();
                const minAge = new Date(today.getFullYear() - 65, today.getMonth(), today.getDate());
                const maxAge = new Date(today.getFullYear() - 21, today.getMonth(), today.getDate());
                return dob >= minAge && dob <= maxAge;
            },
            message: 'Teacher age must be between 21 and 65 years',
        },
    },
    joinDate: {
        type: Date,
        required: [true, 'Join date is required'],
        default: Date.now,
    },
    qualifications: {
        type: [
            {
                degree: {
                    type: String,
                    required: [true, 'Degree is required'],
                    trim: true,
                },
                institution: {
                    type: String,
                    required: [true, 'Institution is required'],
                    trim: true,
                },
                year: {
                    type: Number,
                    required: [true, 'Year is required'],
                    min: [1980, 'Year must be after 1980'],
                    max: [new Date().getFullYear(), 'Year cannot be in the future'],
                },
                specialization: {
                    type: String,
                    trim: true,
                },
            },
        ],
        required: [true, 'At least one qualification is required'],
        validate: {
            validator: function (qualifications) {
                return qualifications.length > 0;
            },
            message: 'At least one qualification must be provided',
        },
    },
    experience: {
        totalYears: {
            type: Number,
            required: [true, 'Total years of experience is required'],
            min: [0, 'Experience cannot be negative'],
            max: [45, 'Experience cannot exceed 45 years'],
        },
        previousSchools: {
            type: [
                {
                    schoolName: {
                        type: String,
                        required: true,
                        trim: true,
                    },
                    position: {
                        type: String,
                        required: true,
                        trim: true,
                    },
                    duration: {
                        type: String,
                        required: true,
                        trim: true,
                    },
                    fromDate: {
                        type: Date,
                        required: true,
                    },
                    toDate: {
                        type: Date,
                        required: true,
                    },
                },
            ],
            default: [],
        },
    },
    address: {
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true,
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true,
        },
        zipCode: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            trim: true,
        },
    },
    emergencyContact: {
        name: {
            type: String,
            required: [true, 'Emergency contact name is required'],
            trim: true,
        },
        relationship: {
            type: String,
            required: [true, 'Emergency contact relationship is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Emergency contact phone is required'],
            match: [/^\+?[\d\s\-\(\)]+$/, 'Invalid emergency contact phone format'],
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid emergency contact email format'],
        },
    },
    salary: {
        basic: {
            type: Number,
            min: [0, 'Basic salary cannot be negative'],
        },
        allowances: {
            type: Number,
            default: 0,
            min: [0, 'Allowances cannot be negative'],
        },
        deductions: {
            type: Number,
            default: 0,
            min: [0, 'Deductions cannot be negative'],
        },
        netSalary: {
            type: Number,
            min: [0, 'Net salary cannot be negative'],
        },
    },
    isClassTeacher: {
        type: Boolean,
        default: false,
        index: true,
    },
    classTeacherFor: {
        grade: {
            type: Number,
            min: [1, 'Grade must be at least 1'],
            max: [12, 'Grade cannot exceed 12'],
        },
        section: {
            type: String,
            match: [/^[A-Z]$/, 'Section must be a single uppercase letter'],
        },
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
teacherSchema.methods.generateTeacherId = function () {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 900) + 100;
    return `TCH-${year}-${sequence}`;
};
teacherSchema.methods.getAgeInYears = function () {
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
teacherSchema.methods.getFullName = function () {
    const userId = this.userId;
    return `${userId?.firstName || ''} ${userId?.lastName || ''}`.trim();
};
teacherSchema.methods.getFolderPath = function () {
    const userId = this.userId || {};
    const age = this.getAgeInYears();
    const joinDate = this.joinDate.toISOString().split('T')[0];
    return `teacher@${userId.firstName || 'unknown'}@${age}@${this.bloodGroup}@${joinDate}@${this.teacherId}`;
};
teacherSchema.methods.canUploadMorePhotos = async function () {
    const photoCount = await exports.TeacherPhoto.countDocuments({ teacherId: this._id });
    return photoCount < config_1.default.max_photos_per_student;
};
teacherSchema.methods.getTotalExperience = function () {
    return this.experience.totalYears;
};
teacherSchema.methods.getNetSalary = function () {
    if (!this.salary)
        return 0;
    const basic = this.salary.basic || 0;
    const allowances = this.salary.allowances || 0;
    const deductions = this.salary.deductions || 0;
    return basic + allowances - deductions;
};
teacherSchema.statics.findBySchool = function (schoolId) {
    return this.find({ schoolId, isActive: true })
        .populate('userId', 'firstName lastName username email phone')
        .populate('schoolId', 'name')
        .sort({ joinDate: -1 });
};
teacherSchema.statics.findBySubject = function (schoolId, subject) {
    return this.find({ schoolId, subjects: subject, isActive: true })
        .populate('userId', 'firstName lastName username email phone')
        .sort({ designation: 1, joinDate: -1 });
};
teacherSchema.statics.findByGrade = function (schoolId, grade) {
    return this.find({ schoolId, grades: grade, isActive: true })
        .populate('userId', 'firstName lastName username email phone')
        .sort({ designation: 1, joinDate: -1 });
};
teacherSchema.statics.findClassTeachers = function (schoolId) {
    return this.find({ schoolId, isClassTeacher: true, isActive: true })
        .populate('userId', 'firstName lastName username email phone')
        .sort({ 'classTeacherFor.grade': 1, 'classTeacherFor.section': 1 });
};
teacherSchema.statics.findByTeacherId = function (teacherId) {
    return this.findOne({ teacherId })
        .populate('userId', 'firstName lastName username email phone')
        .populate('schoolId', 'name');
};
teacherSchema.statics.generateNextTeacherId = async function (schoolId, year = new Date().getFullYear()) {
    const prefix = `TCH-${year}-`;
    const lastTeacher = await this.findOne({
        schoolId,
        teacherId: { $regex: `^${prefix}` }
    }).sort({ teacherId: -1 });
    let nextSequence = 1;
    if (lastTeacher) {
        const lastSequence = parseInt(lastTeacher.teacherId.split('-')[2]);
        nextSequence = lastSequence + 1;
    }
    const sequenceStr = nextSequence.toString().padStart(3, '0');
    return `${prefix}${sequenceStr}`;
};
teacherSchema.index({ schoolId: 1, isActive: 1 });
teacherSchema.index({ schoolId: 1, subjects: 1 });
teacherSchema.index({ schoolId: 1, grades: 1 });
teacherSchema.index({ schoolId: 1, isClassTeacher: 1 });
teacherSchema.index({ joinDate: -1 });
teacherSchema.index({ designation: 1 });
teacherPhotoSchema.index({ teacherId: 1, photoNumber: 1 }, { unique: true });
teacherPhotoSchema.index({ schoolId: 1 });
teacherSchema.pre('save', async function (next) {
    if (this.isNew && !this.teacherId) {
        this.teacherId = await this.constructor.generateNextTeacherId(this.schoolId.toString());
    }
    if (this.salary) {
        const basic = this.salary.basic || 0;
        const allowances = this.salary.allowances || 0;
        const deductions = this.salary.deductions || 0;
        this.salary.netSalary = basic + allowances - deductions;
    }
    if (this.isClassTeacher && this.classTeacherFor) {
        const existingClassTeacher = await this.constructor.findOne({
            _id: { $ne: this._id },
            schoolId: this.schoolId,
            isClassTeacher: true,
            'classTeacherFor.grade': this.classTeacherFor.grade,
            'classTeacherFor.section': this.classTeacherFor.section,
        });
        if (existingClassTeacher) {
            const error = new Error(`Class teacher already assigned for Grade ${this.classTeacherFor.grade} Section ${this.classTeacherFor.section}`);
            return next(error);
        }
    }
    if (!this.isClassTeacher) {
        this.classTeacherFor = undefined;
    }
    next();
});
teacherSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    await exports.TeacherPhoto.deleteMany({ teacherId: this._id });
    next();
});
teacherSchema.virtual('photos', {
    ref: 'TeacherPhoto',
    localField: '_id',
    foreignField: 'teacherId',
    options: { sort: { photoNumber: 1 } },
});
teacherSchema.virtual('photoCount', {
    ref: 'TeacherPhoto',
    localField: '_id',
    foreignField: 'teacherId',
    count: true,
});
teacherSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
teacherSchema.set('toObject', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
teacherPhotoSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Teacher = (0, mongoose_1.model)('Teacher', teacherSchema);
exports.TeacherPhoto = (0, mongoose_1.model)('TeacherPhoto', teacherPhotoSchema);
//# sourceMappingURL=teacher.model.js.map