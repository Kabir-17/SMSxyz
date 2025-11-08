"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = void 0;
const mongoose_1 = require("mongoose");
const classSchema = new mongoose_1.Schema({
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School ID is required'],
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
        required: [true, 'Section is required'],
        trim: true,
        uppercase: true,
        match: [/^[A-Z]$/, 'Section must be a single uppercase letter'],
        index: true,
    },
    className: {
        type: String,
        required: [true, 'Class name is required'],
        trim: true,
    },
    academicYear: {
        type: String,
        required: [true, 'Academic year is required'],
        match: [/^\d{4}-\d{4}$/, 'Academic year must be in YYYY-YYYY format'],
        index: true,
    },
    maxStudents: {
        type: Number,
        required: [true, 'Maximum students is required'],
        min: [10, 'Maximum students must be at least 10'],
        max: [60, 'Maximum students cannot exceed 60'],
        default: 40,
    },
    currentStudents: {
        type: Number,
        default: 0,
        min: [0, 'Current students cannot be negative'],
        validate: {
            validator: function (value) {
                return value <= this.maxStudents;
            },
            message: 'Current students cannot exceed maximum capacity',
        },
    },
    classTeacher: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Teacher',
        index: true,
    },
    subjects: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Subject',
        }],
    schedule: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Schedule',
    },
    absenceSmsSettings: {
        type: new mongoose_1.Schema({
            enabled: {
                type: Boolean,
                default: false,
            },
            sendAfterTime: {
                type: String,
                default: '11:00',
                validate: {
                    validator: function (value) {
                        return /^\d{2}:\d{2}$/.test(value);
                    },
                    message: 'Send-after time must be in HH:MM format',
                },
            },
        }, { _id: false }),
        default: () => ({
            enabled: false,
            sendAfterTime: '11:00',
        }),
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
classSchema.methods.getClassName = function () {
    return `Grade ${this.grade} - Section ${this.section}`;
};
classSchema.methods.isFull = function () {
    return this.currentStudents >= this.maxStudents;
};
classSchema.methods.canAddStudents = function (count = 1) {
    return (this.currentStudents + count) <= this.maxStudents;
};
classSchema.methods.getAvailableSeats = function () {
    return Math.max(0, this.maxStudents - this.currentStudents);
};
classSchema.methods.getStudentCount = async function () {
    const Student = (0, mongoose_1.model)('Student');
    const count = await Student.countDocuments({
        schoolId: this.schoolId,
        grade: this.grade,
        section: this.section,
        isActive: true,
    });
    return count;
};
classSchema.methods.updateStudentCount = async function () {
    const actualCount = await this.getStudentCount();
    this.currentStudents = actualCount;
    await this.save();
};
classSchema.methods.getNextSection = function () {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const currentIndex = alphabet.indexOf(this.section);
    return currentIndex < alphabet.length - 1 ? alphabet[currentIndex + 1] : 'A';
};
classSchema.methods.addStudent = async function (studentId) {
    if (!this.canAddStudents(1)) {
        throw new Error('Class is at maximum capacity');
    }
    this.currentStudents += 1;
    await this.save();
};
classSchema.methods.removeStudent = async function (studentId) {
    if (this.currentStudents > 0) {
        this.currentStudents -= 1;
        await this.save();
    }
};
classSchema.statics.findBySchool = function (schoolId) {
    return this.find({ schoolId, isActive: true })
        .populate('classTeacher', 'teacherId userId')
        .populate({
        path: 'classTeacher',
        populate: {
            path: 'userId',
            select: 'firstName lastName'
        }
    })
        .populate('subjects', 'name code')
        .sort({ grade: 1, section: 1 });
};
classSchema.statics.findByGrade = function (schoolId, grade) {
    return this.find({ schoolId, grade, isActive: true })
        .populate('classTeacher', 'teacherId userId')
        .populate({
        path: 'classTeacher',
        populate: {
            path: 'userId',
            select: 'firstName lastName'
        }
    })
        .populate('subjects', 'name code')
        .sort({ section: 1 });
};
classSchema.statics.findByAcademicYear = function (schoolId, academicYear) {
    return this.find({ schoolId, academicYear, isActive: true })
        .populate('classTeacher', 'teacherId userId')
        .populate('subjects', 'name code')
        .sort({ grade: 1, section: 1 });
};
classSchema.statics.findByGradeAndSection = function (schoolId, grade, section) {
    return this.findOne({ schoolId, grade, section, isActive: true })
        .populate('classTeacher', 'teacherId userId')
        .populate({
        path: 'classTeacher',
        populate: {
            path: 'userId',
            select: 'firstName lastName'
        }
    })
        .populate('subjects', 'name code');
};
classSchema.statics.createClassWithAutoSection = async function (schoolId, grade, maxStudents, academicYear) {
    const existingClasses = await this.find({
        schoolId,
        grade,
        academicYear,
        isActive: true,
    }).sort({ section: 1 });
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let nextSection = 'A';
    if (existingClasses.length > 0) {
        const usedSections = existingClasses.map(cls => cls.section).sort();
        const lastSection = usedSections[usedSections.length - 1];
        const lastIndex = alphabet.indexOf(lastSection);
        if (lastIndex < alphabet.length - 1) {
            nextSection = alphabet[lastIndex + 1];
        }
        else {
            throw new Error('Maximum number of sections (26) reached for this grade');
        }
    }
    const className = `Grade ${grade} - Section ${nextSection}`;
    const newClass = new this({
        schoolId,
        grade,
        section: nextSection,
        className,
        academicYear,
        maxStudents,
        currentStudents: 0,
        isActive: true,
    });
    return await newClass.save();
};
classSchema.statics.getClassStats = async function (schoolId) {
    const classes = await this.find({ schoolId, isActive: true });
    const totalClasses = classes.length;
    const activeClasses = classes.filter(cls => cls.isActive).length;
    const totalCapacity = classes.reduce((sum, cls) => sum + cls.maxStudents, 0);
    const totalStudents = classes.reduce((sum, cls) => sum + cls.currentStudents, 0);
    const utilizationRate = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;
    const gradeGroups = new Map();
    classes.forEach(cls => {
        const grade = cls.grade;
        if (!gradeGroups.has(grade)) {
            gradeGroups.set(grade, {
                grade,
                classes: 0,
                capacity: 0,
                students: 0,
                sections: [],
            });
        }
        const gradeData = gradeGroups.get(grade);
        gradeData.classes += 1;
        gradeData.capacity += cls.maxStudents;
        gradeData.students += cls.currentStudents;
        gradeData.sections.push(cls.section);
    });
    const byGrade = Array.from(gradeGroups.values()).sort((a, b) => a.grade - b.grade);
    const fullClasses = classes.filter(cls => cls.isFull()).length;
    const underutilizedClasses = classes
        .filter(cls => {
        const utilization = cls.maxStudents > 0 ? (cls.currentStudents / cls.maxStudents) * 100 : 0;
        return utilization < 50 && cls.currentStudents > 0;
    })
        .map(cls => ({
        id: cls._id.toString(),
        className: cls.getClassName(),
        capacity: cls.maxStudents,
        students: cls.currentStudents,
        utilizationRate: cls.maxStudents > 0 ? Math.round((cls.currentStudents / cls.maxStudents) * 100) : 0,
    }))
        .sort((a, b) => a.utilizationRate - b.utilizationRate);
    return {
        totalClasses,
        activeClasses,
        totalCapacity,
        totalStudents,
        utilizationRate,
        byGrade,
        fullClasses,
        underutilizedClasses,
    };
};
classSchema.statics.checkCapacityForGrade = async function (schoolId, grade) {
    const classes = await this.find({
        schoolId,
        grade,
        isActive: true,
    }).sort({ section: 1 });
    const totalCapacity = classes.reduce((sum, cls) => sum + cls.maxStudents, 0);
    const currentStudents = classes.reduce((sum, cls) => sum + cls.currentStudents, 0);
    const availableSeats = totalCapacity - currentStudents;
    const sectionsNearCapacity = classes.filter(cls => {
        const utilization = cls.maxStudents > 0 ? (cls.currentStudents / cls.maxStudents) : 0;
        return utilization >= 0.8;
    }).length;
    const needsNewSection = availableSeats < 10 || sectionsNearCapacity === classes.length;
    const existingSections = classes.map(cls => cls.section).sort();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let nextAvailableSection = 'A';
    if (existingSections.length > 0) {
        for (let i = 0; i < alphabet.length; i++) {
            if (!existingSections.includes(alphabet[i])) {
                nextAvailableSection = alphabet[i];
                break;
            }
        }
    }
    return {
        grade,
        totalCapacity,
        currentStudents,
        availableSeats,
        needsNewSection,
        existingSections,
        nextAvailableSection,
    };
};
classSchema.statics.createNewSectionIfNeeded = async function (schoolId, grade, academicYear) {
    const capacityCheck = await this.checkCapacityForGrade(schoolId, grade);
    if (capacityCheck.needsNewSection) {
        const School = (0, mongoose_1.model)('School');
        const school = await School.findById(schoolId);
        const maxStudents = school?.settings?.maxStudentsPerSection || 40;
        return await this.createClassWithAutoSection(schoolId, grade, maxStudents, academicYear);
    }
    return null;
};
classSchema.index({ schoolId: 1, grade: 1, section: 1, academicYear: 1 }, { unique: true });
classSchema.index({ schoolId: 1, academicYear: 1 });
classSchema.index({ classTeacher: 1 });
classSchema.index({ schoolId: 1, grade: 1, isActive: 1 });
classSchema.pre('save', function (next) {
    if (!this.className || this.isModified('grade') || this.isModified('section')) {
        this.className = this.getClassName();
    }
    if (this.section) {
        this.section = this.section.toUpperCase();
    }
    next();
});
classSchema.post('save', async function (doc) {
    const actualCount = await doc.getStudentCount();
    if (actualCount !== doc.currentStudents) {
        await this.model('Class').updateOne({ _id: doc._id }, { currentStudents: actualCount });
    }
});
classSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        ret.isFull = doc.isFull();
        ret.availableSeats = doc.getAvailableSeats();
        ret.utilizationRate = doc.maxStudents > 0 ? Math.round((doc.currentStudents / doc.maxStudents) * 100) : 0;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Class = (0, mongoose_1.model)('Class', classSchema);
//# sourceMappingURL=class.model.js.map