import { Document, Types, Model } from 'mongoose';
export interface IExam {
    schoolId: Types.ObjectId;
    examName: string;
    examType: 'unit-test' | 'mid-term' | 'final' | 'quarterly' | 'half-yearly' | 'annual' | 'entrance' | 'mock';
    academicYear: string;
    grade: number;
    section?: string;
    subjectId: Types.ObjectId;
    teacherId: Types.ObjectId;
    examDate: Date;
    startTime: string;
    endTime: string;
    duration: number;
    totalMarks: number;
    passingMarks: number;
    venue?: string;
    instructions?: string;
    syllabus?: string[];
    isPublished: boolean;
    resultsPublished: boolean;
    gradingScale?: {
        gradeA: number;
        gradeB: number;
        gradeC: number;
        gradeD: number;
        gradeF: number;
    };
    weightage?: number;
    createdBy: Types.ObjectId;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IExamDocument extends IExam, Document, IExamMethods {
    _id: Types.ObjectId;
}
export interface IExamMethods {
    getDurationInHours(): number;
    isUpcoming(): boolean;
    isOngoing(): boolean;
    isCompleted(): boolean;
    getFormattedTimeSlot(): string;
    canPublishResults(): boolean;
    getGradeFromMarks(marks: number): string;
    getPercentage(marks: number): number;
    getEligibleStudents(): Promise<any[]>;
}
export interface IExamModel extends Model<IExamDocument> {
    findBySchool(schoolId: string): Promise<IExamDocument[]>;
    findByClass(schoolId: string, grade: number, section?: string): Promise<IExamDocument[]>;
    findByTeacher(teacherId: string): Promise<IExamDocument[]>;
    findBySubject(subjectId: string): Promise<IExamDocument[]>;
    findUpcoming(schoolId: string, days?: number): Promise<IExamDocument[]>;
    findByDateRange(schoolId: string, startDate: Date, endDate: Date): Promise<IExamDocument[]>;
    getGradeRange(grade: string, gradingScale: any, totalMarks: number): string;
    getExamSchedule(schoolId: string, grade: number, section?: string, startDate?: Date, endDate?: Date): Promise<IExamSchedule>;
    getExamStats(schoolId: string, examId: string): Promise<IExamStats>;
}
export interface ICreateExamRequest {
    schoolId: string;
    examName: string;
    examType: 'unit-test' | 'mid-term' | 'final' | 'quarterly' | 'half-yearly' | 'annual' | 'entrance' | 'mock';
    academicYear: string;
    grade: number;
    section?: string;
    subjectId: string;
    teacherId: string;
    examDate: string;
    startTime: string;
    endTime: string;
    totalMarks: number;
    passingMarks: number;
    venue?: string;
    instructions?: string;
    syllabus?: string[];
    gradingScale?: {
        gradeA: number;
        gradeB: number;
        gradeC: number;
        gradeD: number;
        gradeF: number;
    };
    weightage?: number;
}
export interface IUpdateExamRequest {
    examName?: string;
    examDate?: string;
    startTime?: string;
    endTime?: string;
    totalMarks?: number;
    passingMarks?: number;
    venue?: string;
    instructions?: string;
    syllabus?: string[];
    isPublished?: boolean;
    resultsPublished?: boolean;
    gradingScale?: {
        gradeA: number;
        gradeB: number;
        gradeC: number;
        gradeD: number;
        gradeF: number;
    };
    weightage?: number;
    isActive?: boolean;
}
export interface IExamResponse {
    id: string;
    schoolId: string;
    examName: string;
    examType: string;
    academicYear: string;
    grade: number;
    section?: string;
    examDate: Date;
    startTime: string;
    endTime: string;
    duration: number;
    durationHours: number;
    totalMarks: number;
    passingMarks: number;
    venue?: string;
    instructions?: string;
    syllabus?: string[];
    isPublished: boolean;
    resultsPublished: boolean;
    gradingScale?: {
        gradeA: number;
        gradeB: number;
        gradeC: number;
        gradeD: number;
        gradeF: number;
    };
    weightage?: number;
    status: 'upcoming' | 'ongoing' | 'completed';
    timeSlot: string;
    canPublishResults: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    school?: {
        id: string;
        name: string;
    };
    subject?: {
        id: string;
        name: string;
        code: string;
    };
    teacher?: {
        id: string;
        userId: string;
        teacherId: string;
        fullName: string;
    };
    createdBy?: {
        id: string;
        fullName: string;
    };
    studentCount?: number;
    submissionCount?: number;
}
export interface IExamSchedule {
    grade: number;
    section?: string;
    academicYear: string;
    exams: Array<{
        date: Date;
        exams: IExamResponse[];
    }>;
    summary: {
        totalExams: number;
        upcomingExams: number;
        ongoingExams: number;
        completedExams: number;
        publishedExams: number;
        byExamType: Array<{
            examType: string;
            count: number;
        }>;
        bySubject: Array<{
            subjectId: string;
            subjectName: string;
            count: number;
        }>;
    };
    timeline: Array<{
        date: Date;
        dayOfWeek: string;
        exams: Array<{
            examName: string;
            subject: string;
            timeSlot: string;
            venue?: string;
            duration: number;
        }>;
    }>;
}
export interface IExamStats {
    examId: string;
    examName: string;
    totalStudents: number;
    appearedStudents: number;
    passedStudents: number;
    failedStudents: number;
    absentStudents: number;
    averageMarks: number;
    highestMarks: number;
    lowestMarks: number;
    passPercentage: number;
    attendancePercentage: number;
    gradeDistribution: Array<{
        grade: string;
        count: number;
        percentage: number;
        marksRange: string;
    }>;
    marksDistribution: Array<{
        range: string;
        count: number;
        percentage: number;
    }>;
    topPerformers: Array<{
        studentId: string;
        studentName: string;
        rollNumber: number;
        marksObtained: number;
        percentage: number;
        grade: string;
    }>;
}
export interface IExamResult {
    examId: Types.ObjectId;
    studentId: Types.ObjectId;
    marksObtained: number;
    percentage: number;
    grade: string;
    isPass: boolean;
    isAbsent: boolean;
    submittedAt?: Date;
    checkedBy?: Types.ObjectId;
    checkedAt?: Date;
    remarks?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IExamResultDocument extends IExamResult, Document {
    _id: Types.ObjectId;
}
export interface ISubmitResultRequest {
    examId: string;
    results: Array<{
        studentId: string;
        marksObtained: number;
        isAbsent?: boolean;
        remarks?: string;
    }>;
}
export interface IExamFilters {
    schoolId?: string;
    grade?: number;
    section?: string;
    examType?: string;
    subjectId?: string;
    teacherId?: string;
    academicYear?: string;
    isPublished?: boolean;
    resultsPublished?: boolean;
    startDate?: Date;
    endDate?: Date;
    isActive?: boolean;
}
export interface IExamNotification {
    examId: string;
    examName: string;
    examDate: Date;
    subject: string;
    grade: number;
    section?: string;
    recipients: Array<{
        userId: string;
        userType: 'student' | 'parent' | 'teacher';
        notificationType: 'exam-scheduled' | 'exam-reminder' | 'results-published';
    }>;
    sentAt?: Date;
}
export interface IExamTimetable {
    schoolId: string;
    grade: number;
    section?: string;
    academicYear: string;
    examType: string;
    startDate: Date;
    endDate: Date;
    exams: Array<{
        date: Date;
        dayOfWeek: string;
        timeSlot: string;
        subject: string;
        venue?: string;
        duration: number;
        totalMarks: number;
    }>;
    instructions: string[];
    contactInfo: {
        examController: string;
        phone: string;
        email: string;
    };
}
//# sourceMappingURL=exam.interface.d.ts.map