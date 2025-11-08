"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grade = void 0;
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
    earnedPoints: {
        type: Number,
        required: [true, 'Earned points is required'],
        min: [0, 'Earned points cannot be negative'],
        validate: {
            validator: function (earnedPoints) {
                return earnedPoints <= this.maxPoints;
            },
            message: 'Earned points cannot exceed maximum points',
        },
    },
    comments: {
        type: String,
        trim: true,
        maxlength: [500, 'Comments cannot exceed 500 characters'],
    },
}, {
    _id: false,
});
const gradeSchema = new mongoose_1.Schema({
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School ID is required'],
        index: true,
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student ID is required'],
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
    academicYear: {
        type: String,
        required: [true, 'Academic year is required'],
        match: [/^\d{4}-\d{4}$/, 'Academic year must be in YYYY-YYYY format'],
        index: true,
    },
    semester: {
        type: String,
        required: [true, 'Semester is required'],
        enum: {
            values: ['first', 'second', 'annual'],
            message: 'Semester must be first, second, or annual',
        },
        index: true,
    },
    gradeType: {
        type: String,
        required: [true, 'Grade type is required'],
        enum: {
            values: ['assignment', 'quiz', 'test', 'project', 'homework', 'participation', 'exam', 'final'],
            message: 'Grade type must be one of: assignment, quiz, test, project, homework, participation, exam, final',
        },
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
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    marksObtained: {
        type: Number,
        required: [true, 'Marks obtained is required'],
        min: [0, 'Marks obtained cannot be negative'],
    },
    totalMarks: {
        type: Number,
        required: [true, 'Total marks is required'],
        min: [1, 'Total marks must be at least 1'],
        validate: {
            validator: function (totalMarks) {
                return this.marksObtained <= totalMarks;
            },
            message: 'Marks obtained cannot exceed total marks',
        },
    },
    percentage: {
        type: Number,
        min: [0, 'Percentage cannot be negative'],
        max: [100, 'Percentage cannot exceed 100'],
        index: true,
    },
    grade: {
        type: String,
        enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'],
        index: true,
    },
    gpa: {
        type: Number,
        min: [0, 'GPA cannot be negative'],
        max: [4.0, 'GPA cannot exceed 4.0'],
    },
    weightage: {
        type: Number,
        required: [true, 'Weightage is required'],
        min: [0, 'Weightage cannot be negative'],
        max: [100, 'Weightage cannot exceed 100'],
    },
    gradedDate: {
        type: Date,
        required: [true, 'Graded date is required'],
        index: true,
    },
    dueDate: {
        type: Date,
        index: true,
    },
    submittedDate: {
        type: Date,
    },
    isLate: {
        type: Boolean,
        default: false,
    },
    feedback: {
        type: String,
        trim: true,
        maxlength: [2000, 'Feedback cannot exceed 2000 characters'],
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
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
    },
    isExtraCredit: {
        type: Boolean,
        default: false,
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
}, {
    timestamps: true,
    versionKey: false,
});
gradeSchema.methods.calculateGPA = function () {
    const gradePoints = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0
    };
    return gradePoints[this.grade] || 0.0;
};
gradeSchema.methods.getLetterGrade = function () {
    const percentage = this.percentage;
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
gradeSchema.methods.isPassingGrade = function () {
    return this.percentage >= 60;
};
gradeSchema.methods.getDaysLate = function () {
    if (!this.dueDate || !this.submittedDate)
        return 0;
    const diffTime = this.submittedDate.getTime() - this.dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};
gradeSchema.methods.getFormattedGrade = function () {
    return `${this.grade} (${this.percentage}%)`;
};
gradeSchema.methods.calculateWeightedScore = function () {
    return (this.percentage * this.weightage) / 100;
};
gradeSchema.statics.findByStudent = function (studentId, academicYear) {
    const query = { studentId };
    if (academicYear)
        query.academicYear = academicYear;
    return this.find(query)
        .populate('teacherId', 'userId teacherId')
        .populate('subjectId', 'name code')
        .sort({ gradedDate: -1 });
};
gradeSchema.statics.findBySubject = function (subjectId, academicYear) {
    const query = { subjectId };
    if (academicYear)
        query.academicYear = academicYear;
    return this.find(query)
        .populate({
        path: 'studentId',
        select: 'userId studentId rollNumber',
        populate: {
            path: 'userId',
            select: 'firstName lastName'
        }
    })
        .sort({ gradedDate: -1 });
};
gradeSchema.statics.findByTeacher = function (teacherId, academicYear) {
    const query = { teacherId };
    if (academicYear)
        query.academicYear = academicYear;
    return this.find(query)
        .populate({
        path: 'studentId',
        select: 'userId studentId rollNumber',
        populate: {
            path: 'userId',
            select: 'firstName lastName'
        }
    })
        .populate('subjectId', 'name code')
        .sort({ gradedDate: -1 });
};
gradeSchema.statics.findBySchool = function (schoolId, academicYear) {
    const query = { schoolId };
    if (academicYear)
        query.academicYear = academicYear;
    return this.find(query)
        .populate({
        path: 'studentId',
        select: 'userId studentId rollNumber grade section',
        populate: {
            path: 'userId',
            select: 'firstName lastName'
        }
    })
        .populate('subjectId', 'name code')
        .sort({ gradedDate: -1 });
};
gradeSchema.statics.calculateStudentGPA = async function (studentId, academicYear, semester) {
    const query = { studentId, academicYear, isPublished: true };
    if (semester)
        query.semester = semester;
    const grades = await this.find(query);
    if (grades.length === 0)
        return 0;
    let totalWeightedGPA = 0;
    let totalWeightage = 0;
    grades.forEach(grade => {
        const gpa = grade.calculateGPA();
        totalWeightedGPA += gpa * grade.weightage;
        totalWeightage += grade.weightage;
    });
    return totalWeightage > 0 ? Math.round((totalWeightedGPA / totalWeightage) * 100) / 100 : 0;
};
gradeSchema.statics.calculateSubjectAverage = async function (studentId, subjectId, academicYear, semester) {
    const query = { studentId, subjectId, academicYear, isPublished: true };
    if (semester)
        query.semester = semester;
    const grades = await this.find(query)
        .populate('subjectId', 'name code')
        .sort({ gradedDate: 1 });
    if (grades.length === 0) {
        throw new Error('No grades found for the specified criteria');
    }
    const subject = grades[0].subjectId;
    let totalWeightedMarks = 0;
    let totalWeightage = 0;
    let totalMarks = 0;
    let totalObtained = 0;
    const gradeTypeStats = {
        assignment: { count: 0, total: 0 },
        quiz: { count: 0, total: 0 },
        test: { count: 0, total: 0 },
        exam: { count: 0, total: 0 },
        project: { count: 0, total: 0 },
        participation: { count: 0, total: 0 }
    };
    const trend = [];
    grades.forEach(grade => {
        totalWeightedMarks += grade.percentage * grade.weightage;
        totalWeightage += grade.weightage;
        totalMarks += grade.totalMarks;
        totalObtained += grade.marksObtained;
        if (gradeTypeStats[grade.gradeType]) {
            gradeTypeStats[grade.gradeType].count++;
            gradeTypeStats[grade.gradeType].total += grade.percentage;
        }
        trend.push({
            date: grade.gradedDate,
            grade: grade.grade,
            percentage: grade.percentage,
            title: grade.title
        });
    });
    const weightedAverage = totalWeightage > 0 ? totalWeightedMarks / totalWeightage : 0;
    const overallPercentage = totalMarks > 0 ? (totalObtained / totalMarks) * 100 : 0;
    Object.keys(gradeTypeStats).forEach(type => {
        const stats = gradeTypeStats[type];
        stats.total = stats.count > 0 ? stats.total / stats.count : 0;
    });
    const finalGrade = this.constructor.getGradeFromPercentage(weightedAverage);
    const gpa = this.constructor.getGPAFromGrade(finalGrade);
    return {
        subjectId: subject?._id?.toString() || subject.toString(),
        subjectName: subject?.name || 'Unknown Subject',
        subjectCode: subject?.code || 'N/A',
        totalMarks,
        totalObtained,
        percentage: Math.round(overallPercentage * 100) / 100,
        grade: finalGrade,
        gpa: Math.round(gpa * 100) / 100,
        weightedAverage: Math.round(weightedAverage * 100) / 100,
        gradeCount: grades.length,
        assignments: {
            count: gradeTypeStats.assignment.count,
            average: Math.round(gradeTypeStats.assignment.total * 100) / 100
        },
        quizzes: {
            count: gradeTypeStats.quiz.count,
            average: Math.round(gradeTypeStats.quiz.total * 100) / 100
        },
        tests: {
            count: gradeTypeStats.test.count,
            average: Math.round(gradeTypeStats.test.total * 100) / 100
        },
        exams: {
            count: gradeTypeStats.exam.count,
            average: Math.round(gradeTypeStats.exam.total * 100) / 100
        },
        projects: {
            count: gradeTypeStats.project.count,
            average: Math.round(gradeTypeStats.project.total * 100) / 100
        },
        participation: {
            count: gradeTypeStats.participation.count,
            average: Math.round(gradeTypeStats.participation.total * 100) / 100
        },
        trend
    };
};
gradeSchema.statics.getStudentReportCard = async function (studentId, academicYear, semester) {
    const Student = (0, mongoose_1.model)('Student');
    const student = await Student.findById(studentId)
        .populate('userId', 'firstName lastName')
        .populate('schoolId', 'name');
    if (!student) {
        throw new Error('Student not found');
    }
    const query = { studentId, academicYear, isPublished: true };
    if (semester)
        query.semester = semester;
    const grades = await this.find(query).populate('subjectId', 'name code');
    const subjectIds = [...new Set(grades.map(g => g.subjectId._id.toString()))];
    const subjects = [];
    let totalGPA = 0;
    let totalCredits = 0;
    for (const subjectId of subjectIds) {
        try {
            const subjectGrade = await this.calculateSubjectAverage(studentId, subjectId, academicYear, semester);
            subjects.push(subjectGrade);
            totalGPA += subjectGrade.gpa;
            totalCredits += subjectGrade.gradeCount;
        }
        catch (error) {
            console.warn(`Failed to calculate subject average for ${subjectId}:`, error);
        }
    }
    const overallGPA = subjects.length > 0 ? totalGPA / subjects.length : 0;
    const overallPercentage = subjects.length > 0
        ? subjects.reduce((sum, s) => sum + s.percentage, 0) / subjects.length
        : 0;
    const attendance = {
        totalDays: 200,
        presentDays: 185,
        percentage: 92.5
    };
    return {
        studentId,
        studentName: `${student.userId.firstName} ${student.userId.lastName}`,
        rollNumber: student.rollNumber || 0,
        grade: student.grade,
        section: student.section,
        academicYear,
        semester: semester || 'annual',
        generatedDate: new Date(),
        subjects,
        overallGPA: Math.round(overallGPA * 100) / 100,
        overallPercentage: Math.round(overallPercentage * 100) / 100,
        overallGrade: this.constructor.getGradeFromPercentage(overallPercentage),
        totalCredits,
        attendance,
        disciplinaryRecords: 0,
        teacherComments: [],
        achievements: []
    };
};
gradeSchema.statics.getClassGradeStats = async function (schoolId, grade, section, subjectId, academicYear) {
    const Student = (0, mongoose_1.model)('Student');
    const students = await Student.find({
        schoolId,
        grade,
        section,
        isActive: true
    }).populate('userId', 'firstName lastName');
    const studentIds = students.map(s => s._id);
    const grades = await this.find({
        studentId: { $in: studentIds },
        subjectId,
        academicYear,
        isPublished: true
    });
    const studentGrades = new Map();
    grades.forEach(grade => {
        const studentId = grade.studentId.toString();
        if (!studentGrades.has(studentId)) {
            studentGrades.set(studentId, []);
        }
        studentGrades.get(studentId).push(grade);
    });
    const studentAverages = Array.from(studentGrades.entries()).map(([studentId, studentGradeList]) => {
        const totalWeighted = studentGradeList.reduce((sum, g) => sum + (g.percentage * g.weightage), 0);
        const totalWeightage = studentGradeList.reduce((sum, g) => sum + g.weightage, 0);
        const average = totalWeightage > 0 ? totalWeighted / totalWeightage : 0;
        const student = students.find(s => s._id.toString() === studentId);
        return {
            studentId,
            studentName: student ? `${student.userId.firstName} ${student.userId.lastName}` : 'Unknown',
            rollNumber: student?.rollNumber || 0,
            percentage: Math.round(average * 100) / 100,
            grade: this.constructor.getGradeFromPercentage(average)
        };
    });
    const scores = studentAverages.map(s => s.percentage);
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
    const sortedScores = scores.sort((a, b) => a - b);
    const medianScore = sortedScores.length > 0
        ? sortedScores.length % 2 === 0
            ? (sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2
            : sortedScores[Math.floor(sortedScores.length / 2)]
        : 0;
    const variance = scores.length > 0
        ? scores.reduce((sum, score) => sum + Math.pow(score - averageScore, 2), 0) / scores.length
        : 0;
    const standardDeviation = Math.sqrt(variance);
    const gradeCount = {};
    studentAverages.forEach(s => {
        gradeCount[s.grade] = (gradeCount[s.grade] || 0) + 1;
    });
    const gradeDistribution = Object.entries(gradeCount).map(([grade, count]) => ({
        grade,
        count,
        percentage: studentAverages.length > 0 ? Math.round((count / studentAverages.length) * 100) : 0
    }));
    const passingStudents = studentAverages.filter(s => s.percentage >= 60).length;
    const passingPercentage = studentAverages.length > 0
        ? Math.round((passingStudents / studentAverages.length) * 100)
        : 0;
    return {
        classId: `${grade}-${section}`,
        className: `Grade ${grade} - Section ${section}`,
        subjectId,
        subjectName: grades[0]?.subjectId?.name || 'Unknown Subject',
        academicYear,
        totalStudents: students.length,
        gradeDistribution,
        averageScore: Math.round(averageScore * 100) / 100,
        highestScore,
        lowestScore,
        medianScore: Math.round(medianScore * 100) / 100,
        standardDeviation: Math.round(standardDeviation * 100) / 100,
        passingPercentage,
        topPerformers: studentAverages
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5),
        strugglingStudents: studentAverages
            .filter(s => s.percentage < 60)
            .sort((a, b) => a.percentage - b.percentage)
            .slice(0, 5),
        gradeTypeBreakdown: []
    };
};
gradeSchema.statics.getGradeFromPercentage = function (percentage) {
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
gradeSchema.statics.getGPAFromGrade = function (grade) {
    const gradePoints = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'F': 0.0
    };
    return gradePoints[grade] || 0.0;
};
gradeSchema.index({ schoolId: 1, academicYear: 1 });
gradeSchema.index({ studentId: 1, subjectId: 1, academicYear: 1 });
gradeSchema.index({ teacherId: 1, gradedDate: -1 });
gradeSchema.index({ subjectId: 1, academicYear: 1 });
gradeSchema.index({ gradedDate: -1 });
gradeSchema.index({ semester: 1, gradeType: 1 });
gradeSchema.index({ isPublished: 1 });
gradeSchema.pre('save', function (next) {
    if (this.totalMarks > 0) {
        this.percentage = Math.round((this.marksObtained / this.totalMarks) * 100 * 100) / 100;
    }
    this.grade = this.getLetterGrade();
    this.gpa = this.calculateGPA();
    if (this.dueDate && this.submittedDate && this.submittedDate > this.dueDate) {
        this.isLate = true;
    }
    if (this.rubric && this.rubric.length > 0) {
        const totalRubricPoints = this.rubric.reduce((sum, criteria) => sum + criteria.maxPoints, 0);
        const earnedRubricPoints = this.rubric.reduce((sum, criteria) => sum + criteria.earnedPoints, 0);
        if (Math.abs(totalRubricPoints - this.totalMarks) > 0.01) {
            return next(new Error('Rubric total points must equal total marks'));
        }
        if (Math.abs(earnedRubricPoints - this.marksObtained) > 0.01) {
            return next(new Error('Rubric earned points must equal marks obtained'));
        }
    }
    next();
});
gradeSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;
        ret.daysLate = doc.getDaysLate();
        ret.formattedGrade = doc.getFormattedGrade();
        ret.weightedScore = doc.calculateWeightedScore();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Grade = (0, mongoose_1.model)('Grade', gradeSchema);
//# sourceMappingURL=grade.model.js.map