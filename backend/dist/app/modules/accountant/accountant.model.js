"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountantPhoto = exports.Accountant = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const accountantPhotoSchema = new mongoose_1.Schema({
    accountantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Accountant',
        required: [true, 'Accountant ID is required'],
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
const accountantSchema = new mongoose_1.Schema({
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
    accountantId: {
        type: String,
        required: [true, 'Accountant ID is required'],
        unique: true,
        trim: true,
        match: [/^(SCH\d{3,4}-ACC-\d{4}-\d{3}|ACC-\d{4}-\d{3})$/, 'Accountant ID must follow format SCH001-ACC-YYYY-XXX or ACC-YYYY-XXX'],
        index: true,
    },
    employeeId: {
        type: String,
        trim: true,
        index: true,
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        enum: {
            values: [
                'Finance',
                'Payroll',
                'Accounts Payable',
                'Accounts Receivable',
                'Budget Management',
                'Financial Reporting',
                'Audit',
                'Tax',
                'General Accounting',
            ],
            message: 'Invalid department',
        },
        index: true,
    },
    designation: {
        type: String,
        required: [true, 'Designation is required'],
        enum: {
            values: [
                'Chief Financial Officer',
                'Finance Manager',
                'Chief Accountant',
                'Senior Accountant',
                'Accountant',
                'Junior Accountant',
                'Accounts Assistant',
                'Payroll Officer',
                'Financial Analyst',
                'Auditor',
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
            message: 'Accountant age must be between 21 and 65 years',
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
        previousOrganizations: {
            type: [
                {
                    organizationName: {
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
    responsibilities: {
        type: [String],
        default: [],
    },
    certifications: {
        type: [String],
        default: [],
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
accountantSchema.methods.generateAccountantId = function () {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 900) + 100;
    return `ACC-${year}-${sequence}`;
};
accountantSchema.methods.getAgeInYears = function () {
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};
accountantSchema.methods.getFullName = function () {
    const userId = this.userId;
    return `${userId?.firstName || ''} ${userId?.lastName || ''}`.trim();
};
accountantSchema.methods.getFolderPath = function () {
    const userId = this.userId || {};
    const age = this.getAgeInYears();
    const joinDate = this.joinDate.toISOString().split('T')[0];
    return `accountant@${userId.firstName || 'unknown'}@${age}@${this.bloodGroup}@${joinDate}@${this.accountantId}`;
};
accountantSchema.methods.canUploadMorePhotos = async function () {
    const photoCount = await exports.AccountantPhoto.countDocuments({ accountantId: this._id });
    return photoCount < config_1.default.max_photos_per_student;
};
accountantSchema.methods.getTotalExperience = function () {
    return this.experience.totalYears;
};
accountantSchema.methods.getNetSalary = function () {
    if (!this.salary)
        return 0;
    const basic = this.salary.basic || 0;
    const allowances = this.salary.allowances || 0;
    const deductions = this.salary.deductions || 0;
    return basic + allowances - deductions;
};
accountantSchema.statics.findBySchool = function (schoolId) {
    return this.find({ schoolId, isActive: true })
        .populate('userId', 'firstName lastName username email phone')
        .populate('schoolId', 'name')
        .sort({ joinDate: -1 });
};
accountantSchema.statics.findByDepartment = function (schoolId, department) {
    return this.find({ schoolId, department, isActive: true })
        .populate('userId', 'firstName lastName username email phone')
        .sort({ designation: 1, joinDate: -1 });
};
accountantSchema.statics.findByAccountantId = function (accountantId) {
    return this.findOne({ accountantId })
        .populate('userId', 'firstName lastName username email phone')
        .populate('schoolId', 'name');
};
accountantSchema.statics.generateNextAccountantId = async function (schoolId, year = new Date().getFullYear()) {
    const prefix = `ACC-${year}-`;
    const lastAccountant = await this.findOne({
        schoolId,
        accountantId: { $regex: `^${prefix}` }
    }).sort({ accountantId: -1 });
    let nextSequence = 1;
    if (lastAccountant) {
        const lastSequence = parseInt(lastAccountant.accountantId.split('-')[2]);
        nextSequence = lastSequence + 1;
    }
    const sequenceStr = nextSequence.toString().padStart(3, '0');
    return `${prefix}${sequenceStr}`;
};
accountantSchema.index({ schoolId: 1, isActive: 1 });
accountantSchema.index({ schoolId: 1, department: 1 });
accountantSchema.index({ joinDate: -1 });
accountantSchema.index({ designation: 1 });
accountantPhotoSchema.index({ accountantId: 1, photoNumber: 1 }, { unique: true });
accountantPhotoSchema.index({ schoolId: 1 });
accountantSchema.pre('save', async function (next) {
    if (this.isNew && !this.accountantId) {
        this.accountantId = await this.constructor.generateNextAccountantId(this.schoolId.toString());
    }
    if (this.salary) {
        const basic = this.salary.basic || 0;
        const allowances = this.salary.allowances || 0;
        const deductions = this.salary.deductions || 0;
        this.salary.netSalary = basic + allowances - deductions;
    }
    next();
});
accountantSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    await exports.AccountantPhoto.deleteMany({ accountantId: this._id });
    next();
});
accountantSchema.virtual('photos', {
    ref: 'AccountantPhoto',
    localField: '_id',
    foreignField: 'accountantId',
    options: { sort: { photoNumber: 1 } },
});
accountantSchema.virtual('photoCount', {
    ref: 'AccountantPhoto',
    localField: '_id',
    foreignField: 'accountantId',
    count: true,
});
accountantSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
accountantSchema.set('toObject', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
accountantPhotoSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Accountant = (0, mongoose_1.model)('Accountant', accountantSchema);
exports.AccountantPhoto = (0, mongoose_1.model)('AccountantPhoto', accountantPhotoSchema);
//# sourceMappingURL=accountant.model.js.map