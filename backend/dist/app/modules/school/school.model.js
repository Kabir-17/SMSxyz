"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.School = void 0;
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../../config"));
const school_interface_1 = require("./school.interface");
const addressSchema = new mongoose_1.Schema({
    street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true,
        maxlength: [200, 'Street address cannot exceed 200 characters']
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        maxlength: [100, 'City name cannot exceed 100 characters']
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
        maxlength: [100, 'State name cannot exceed 100 characters']
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        maxlength: [100, 'Country name cannot exceed 100 characters']
    },
    postalCode: {
        type: String,
        required: [true, 'Postal code is required'],
        trim: true,
        maxlength: [20, 'Postal code cannot exceed 20 characters']
    },
    coordinates: {
        latitude: {
            type: Number,
            min: [-90, 'Latitude must be between -90 and 90'],
            max: [90, 'Latitude must be between -90 and 90']
        },
        longitude: {
            type: Number,
            min: [-180, 'Longitude must be between -180 and 180'],
            max: [180, 'Longitude must be between -180 and 180']
        }
    }
}, { _id: false });
const contactSchema = new mongoose_1.Schema({
    phone: {
        type: String,
        required: false,
        trim: true,
        validate: {
            validator: function (phone) {
                return !phone || /^\+?[\d\s\-\(\)]+$/.test(phone);
            },
            message: 'Invalid phone number format'
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email) {
                return /^\S+@\S+\.\S+$/.test(email);
            },
            message: 'Invalid email format'
        }
    },
    website: {
        type: String,
        trim: true,
        validate: {
            validator: function (url) {
                return !url || /^https?:\/\/.+\..+/.test(url);
            },
            message: 'Invalid website URL'
        }
    },
    fax: {
        type: String,
        trim: true
    }
}, { _id: false });
const settingsSchema = new mongoose_1.Schema({
    maxStudentsPerSection: {
        type: Number,
        default: config_1.default.max_students_per_section,
        min: [0, 'Maximum students per section cannot be negative']
    },
    grades: {
        type: [Number],
        default: config_1.default.default_grades,
        validate: {
            validator: function (grades) {
                return grades.every(grade => grade >= 1 && grade <= 12);
            },
            message: 'Grades must be between 1 and 12'
        }
    },
    sections: {
        type: [String],
        default: config_1.default.default_sections,
        validate: {
            validator: function (sections) {
                return sections.length > 0 && sections.every(section => /^[A-Z]$/.test(section));
            },
            message: 'Sections must be uppercase letters (A-Z)'
        }
    },
    academicYearStart: {
        type: Number,
        default: config_1.default.academic_year_start_month,
        min: [1, 'Academic year start month must be between 1 and 12'],
        max: [12, 'Academic year start month must be between 1 and 12']
    },
    academicYearEnd: {
        type: Number,
        default: config_1.default.academic_year_end_month,
        min: [1, 'Academic year end month must be between 1 and 12'],
        max: [12, 'Academic year end month must be between 1 and 12']
    },
    attendanceGracePeriod: {
        type: Number,
        default: config_1.default.attendance_grace_period_minutes,
        min: [0, 'Attendance grace period cannot be negative'],
        max: [60, 'Attendance grace period cannot exceed 60 minutes']
    },
    maxPeriodsPerDay: {
        type: Number,
        default: config_1.default.max_periods_per_day,
        min: [1, 'Must have at least 1 period per day'],
        max: [12, 'Cannot exceed 12 periods per day']
    },
    timezone: {
        type: String,
        default: config_1.default.default_timezone,
        validate: {
            validator: function (v) {
                if (!v)
                    return true;
                try {
                    Intl.DateTimeFormat(undefined, { timeZone: v });
                    return true;
                }
                catch {
                    return false;
                }
            },
            message: 'Invalid timezone identifier. Must be a valid IANA timezone (e.g., "Africa/Conakry", "UTC")'
        }
    },
    language: {
        type: String,
        default: 'en',
        enum: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'or', 'pa']
    },
    currency: {
        type: String,
        default: 'INR',
        enum: ['INR', 'USD', 'EUR', 'GBP']
    },
    attendanceLockAfterDays: {
        type: Number,
        default: config_1.default.attendance_lock_after_days,
        min: [1, 'Attendance lock must be at least 1 day'],
        max: [30, 'Attendance lock cannot exceed 30 days']
    },
    maxAttendanceEditHours: {
        type: Number,
        default: config_1.default.max_attendance_edit_hours,
        min: [1, 'Attendance edit window must be at least 1 hour'],
        max: [72, 'Attendance edit window cannot exceed 72 hours']
    },
    autoAttendFinalizationTime: {
        type: String,
        default: config_1.default.auto_attend_finalization_time,
        validate: {
            validator: function (value) {
                return /^\d{2}:\d{2}$/.test(value);
            },
            message: 'Auto-Attend finalization time must be in HH:MM format'
        }
    },
    sectionCapacity: {
        type: Object,
        default: {}
    }
}, { _id: false });
const academicSessionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Session name is required'],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'Session start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'Session end date is required']
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { _id: false });
const statsSchema = new mongoose_1.Schema({
    totalStudents: { type: Number, default: 0 },
    totalTeachers: { type: Number, default: 0 },
    totalParents: { type: Number, default: 0 },
    totalClasses: { type: Number, default: 0 },
    totalSubjects: { type: Number, default: 0 },
    attendanceRate: { type: Number, default: 0, min: 0, max: 100 },
    lastUpdated: { type: Date, default: Date.now }
}, { _id: false });
const schoolSchema = new mongoose_1.Schema({
    orgId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
        index: true
    },
    name: {
        type: String,
        required: [true, 'School name is required'],
        trim: true,
        maxlength: [100, 'School name cannot exceed 100 characters'],
        index: true
    },
    slug: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    schoolId: {
        type: String,
        unique: true,
        trim: true,
        index: true
    },
    establishedYear: {
        type: Number,
        min: [1800, 'Established year cannot be before 1800'],
        max: [new Date().getFullYear(), 'Established year cannot be in the future']
    },
    address: {
        type: addressSchema,
        required: [true, 'Address is required']
    },
    contact: {
        type: contactSchema,
        required: [true, 'Contact information is required']
    },
    status: {
        type: String,
        enum: {
            values: Object.values(school_interface_1.SchoolStatus),
            message: 'Invalid school status'
        },
        default: school_interface_1.SchoolStatus.PENDING_APPROVAL,
        index: true
    },
    adminUserId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Admin user ID is required'],
        index: true
    },
    affiliation: {
        type: String,
        trim: true,
        maxlength: [100, 'Affiliation cannot exceed 100 characters']
    },
    recognition: {
        type: String,
        trim: true,
        maxlength: [200, 'Recognition details cannot exceed 200 characters']
    },
    settings: {
        type: settingsSchema,
        default: () => ({})
    },
    currentSession: {
        type: academicSessionSchema,
        required: false
    },
    academicSessions: {
        type: [academicSessionSchema],
        default: []
    },
    apiEndpoint: {
        type: String,
        unique: true,
        index: true
    },
    apiKey: {
        type: String,
        unique: true,
        index: true
    },
    logo: {
        type: String,
        trim: true
    },
    images: {
        type: [String],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Created by field is required'],
        index: true
    },
    lastModifiedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    stats: {
        type: statsSchema,
        default: () => ({})
    }
}, {
    timestamps: true,
    versionKey: false
});
schoolSchema.methods.generateApiEndpoint = function () {
    return `/api/attendance/${this.slug || this.schoolId}`;
};
schoolSchema.methods.generateApiKey = function () {
    return crypto_1.default.randomBytes(32).toString('hex');
};
schoolSchema.methods.regenerateApiKey = async function () {
    this.apiKey = this.generateApiKey();
    await this.save();
    return this.apiKey;
};
schoolSchema.methods.updateStats = async function () {
    if (!this.stats) {
        this.stats = {
            totalStudents: 0,
            totalTeachers: 0,
            totalParents: 0,
            totalClasses: 0,
            totalSubjects: 0,
            attendanceRate: 0,
            lastUpdated: new Date()
        };
    }
    else {
        this.stats.lastUpdated = new Date();
    }
    return await this.save();
};
schoolSchema.methods.isCurrentlyActive = function () {
    return this.status === school_interface_1.SchoolStatus.ACTIVE && this.isActive;
};
schoolSchema.methods.getCurrentAcademicSession = function () {
    return this.currentSession || null;
};
schoolSchema.methods.createNewAcademicSession = async function (session) {
    const newSession = { ...session, isActive: false };
    this.academicSessions.push(newSession);
    return await this.save();
};
schoolSchema.methods.setActiveAcademicSession = async function (sessionName) {
    const session = this.academicSessions.find(s => s.name === sessionName);
    if (!session) {
        throw new Error('Academic session not found');
    }
    if (this.currentSession) {
        this.currentSession.isActive = false;
    }
    session.isActive = true;
    this.currentSession = { ...session };
    return await this.save();
};
schoolSchema.methods.getGradesOffered = function () {
    return this.settings?.grades || [];
};
schoolSchema.methods.getSectionsForGrade = function (grade) {
    if (!this.getGradesOffered().includes(grade)) {
        return [];
    }
    return this.settings?.sections || [];
};
schoolSchema.methods.canEnrollStudents = function () {
    return this.isCurrentlyActive();
};
schoolSchema.methods.getMaxStudentsForGrade = function (grade) {
    const sections = this.getSectionsForGrade(grade);
    return sections.length * (this.settings?.maxStudentsPerSection || 0);
};
schoolSchema.methods.createGoogleDriveFolder = async function () {
    return `folder_id_${this.schoolId}`;
};
schoolSchema.methods.getSectionCapacity = function (grade, section) {
    const key = `${grade}-${section}`;
    const sectionCapacity = this.settings?.sectionCapacity;
    if (sectionCapacity && sectionCapacity[key]) {
        return sectionCapacity[key];
    }
    return {
        maxStudents: this.settings?.maxStudentsPerSection || 0,
        currentStudents: 0
    };
};
schoolSchema.methods.setSectionCapacity = async function (grade, section, maxStudents) {
    const key = `${grade}-${section}`;
    if (!this.settings?.sectionCapacity) {
        this.settings.sectionCapacity = {};
    }
    const currentData = this.getSectionCapacity(grade, section);
    this.settings.sectionCapacity[key] = {
        maxStudents: Math.max(10, Math.min(60, maxStudents)),
        currentStudents: currentData.currentStudents
    };
    return await this.save();
};
schoolSchema.methods.updateCurrentStudentCount = async function (grade, section, increment = 1) {
    const key = `${grade}-${section}`;
    if (!this.settings?.sectionCapacity) {
        this.settings.sectionCapacity = {};
    }
    const currentData = this.getSectionCapacity(grade, section);
    const newCount = Math.max(0, currentData.currentStudents + increment);
    this.settings.sectionCapacity[key] = {
        maxStudents: currentData.maxStudents,
        currentStudents: newCount
    };
    return await this.save();
};
schoolSchema.methods.canEnrollInSection = function (grade, section) {
    const capacity = this.getSectionCapacity(grade, section);
    return capacity.currentStudents < capacity.maxStudents;
};
schoolSchema.methods.getAvailableSectionsForGrade = function (grade) {
    if (!this.getGradesOffered().includes(grade)) {
        return [];
    }
    return this.settings?.sections?.filter(section => this.canEnrollInSection(grade, section)) || [];
};
schoolSchema.methods.initializeSectionCapacity = async function () {
    if (!this.settings?.sectionCapacity) {
        this.settings.sectionCapacity = {};
    }
    const grades = this.settings?.grades || [];
    const sections = this.settings?.sections || [];
    const defaultCapacity = this.settings?.maxStudentsPerSection || 0;
    grades.forEach(grade => {
        sections.forEach(section => {
            const key = `${grade}-${section}`;
            if (!this.settings.sectionCapacity[key]) {
                this.settings.sectionCapacity[key] = {
                    maxStudents: defaultCapacity,
                    currentStudents: 0
                };
            }
        });
    });
    return await this.save();
};
schoolSchema.statics.findBySlug = function (slug) {
    return this.findOne({ slug: slug.toLowerCase() })
        .populate('adminUserId', 'username firstName lastName email phone')
        .populate('createdBy', 'username firstName lastName');
};
schoolSchema.statics.findBySchoolId = function (schoolId) {
    return this.findOne({ schoolId })
        .populate('adminUserId', 'username firstName lastName email phone')
        .populate('createdBy', 'username firstName lastName');
};
schoolSchema.statics.findByAdmin = function (adminId) {
    return this.findOne({ adminUserId: adminId });
};
schoolSchema.statics.findByStatus = function (status) {
    return this.find({ status })
        .populate('adminUserId', 'username firstName lastName email phone')
        .sort({ name: 1 });
};
schoolSchema.statics.findByApiKey = function (apiKey) {
    return this.findOne({ apiKey, isActive: true });
};
schoolSchema.statics.findByOrganization = function (orgId) {
    return this.find({ orgId, isActive: true })
        .populate('adminUserId', 'username firstName lastName email phone')
        .sort({ name: 1 });
};
schoolSchema.statics.generateUniqueSchoolId = async function () {
    let schoolId;
    let isUnique = false;
    let counter = 1;
    while (!isUnique) {
        schoolId = `SCH${counter.toString().padStart(4, '0')}`;
        const existing = await this.findOne({ schoolId });
        if (!existing) {
            isUnique = true;
        }
        else {
            counter++;
        }
    }
    return schoolId;
};
schoolSchema.statics.generateUniqueSlug = async function (name) {
    let baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    let slug = baseSlug;
    let counter = 1;
    let isUnique = false;
    while (!isUnique) {
        const existing = await this.findOne({ slug });
        if (!existing) {
            isUnique = true;
        }
        else {
            counter++;
            slug = `${baseSlug}-${counter}`;
        }
    }
    return slug;
};
schoolSchema.statics.search = function (query) {
    return this.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { schoolId: { $regex: query, $options: 'i' } },
            { 'address.city': { $regex: query, $options: 'i' } },
            { affiliation: { $regex: query, $options: 'i' } }
        ],
        isActive: true
    }).populate('adminUserId', 'username firstName lastName email phone')
        .sort({ name: 1 })
        .limit(50);
};
schoolSchema.index({ name: 1, isActive: 1 });
schoolSchema.index({ status: 1, isActive: 1 });
schoolSchema.index({ createdBy: 1 });
schoolSchema.index({ 'address.city': 1, 'address.state': 1 });
schoolSchema.index({ affiliation: 1 });
schoolSchema.index({ 'currentSession.isActive': 1 });
schoolSchema.index({ createdAt: -1 });
schoolSchema.index({ orgId: 1, status: 1 });
schoolSchema.pre('save', async function (next) {
    if (this.isNew) {
        if (!this.schoolId) {
            this.schoolId = await this.constructor.generateUniqueSchoolId();
        }
        if (!this.slug) {
            this.slug = await this.constructor.generateUniqueSlug(this.name);
        }
        if (!this.apiEndpoint) {
            this.apiEndpoint = this.generateApiEndpoint();
        }
        if (!this.apiKey) {
            this.apiKey = this.generateApiKey();
        }
        if (this.currentSession) {
            this.currentSession.isActive = true;
            this.academicSessions = [this.currentSession];
        }
    }
    if (this.isModified('name')) {
        this.name = this.name.trim().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    if (this.isModified('name') && !this.isNew) {
        this.slug = await this.constructor.generateUniqueSlug(this.name);
    }
    if (this.isModified('slug')) {
        this.apiEndpoint = this.generateApiEndpoint();
    }
    if (this.isModified('settings.grades') || this.isModified('settings.sections') || this.isNew) {
        if (!this.settings?.sectionCapacity) {
            this.settings.sectionCapacity = {};
        }
        const grades = this.settings?.grades || [];
        const sections = this.settings?.sections || [];
        const defaultCapacity = this.settings?.maxStudentsPerSection || 0;
        grades.forEach(grade => {
            sections.forEach(section => {
                const key = `${grade}-${section}`;
                if (!this.settings.sectionCapacity[key]) {
                    this.settings.sectionCapacity[key] = {
                        maxStudents: defaultCapacity,
                        currentStudents: 0
                    };
                }
            });
        });
    }
    if (this.currentSession && this.currentSession.endDate && this.currentSession.startDate) {
        if (this.currentSession.endDate <= this.currentSession.startDate) {
            return next(new Error('Academic session end date must be after start date'));
        }
    }
    next();
});
schoolSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    next();
});
schoolSchema.virtual('studentsCount', {
    ref: 'Student',
    localField: '_id',
    foreignField: 'schoolId',
    count: true
});
schoolSchema.virtual('teachersCount', {
    ref: 'Teacher',
    localField: '_id',
    foreignField: 'schoolId',
    count: true
});
schoolSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
schoolSchema.set('toObject', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});
exports.School = (0, mongoose_1.model)('School', schoolSchema);
//# sourceMappingURL=school.model.js.map