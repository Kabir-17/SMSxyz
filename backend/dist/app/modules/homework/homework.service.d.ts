import { ICreateHomeworkRequest, IUpdateHomeworkRequest, ISubmitHomeworkRequest, IHomeworkResponse, IHomeworkSubmissionResponse, IHomeworkFilters, IHomeworkCalendar } from './homework.interface';
declare class HomeworkService {
    createHomework(data: ICreateHomeworkRequest, teacherId: string, attachments?: Express.Multer.File[]): Promise<IHomeworkResponse>;
    getHomeworkById(id: string, userId: string, userRole: string): Promise<IHomeworkResponse>;
    updateHomework(id: string, data: IUpdateHomeworkRequest, userId: string, newAttachments?: Express.Multer.File[]): Promise<IHomeworkResponse>;
    deleteHomework(id: string, userId: string): Promise<void>;
    publishHomework(id: string, userId: string): Promise<IHomeworkResponse>;
    getHomeworkForTeacher(teacherId: string, filters?: IHomeworkFilters): Promise<IHomeworkResponse[]>;
    getHomeworkForStudent(studentId: string, filters?: IHomeworkFilters): Promise<IHomeworkResponse[]>;
    getHomeworkForClass(schoolId: string, grade: number, section?: string, filters?: IHomeworkFilters): Promise<IHomeworkResponse[]>;
    submitHomework(data: ISubmitHomeworkRequest, userId: string): Promise<IHomeworkSubmissionResponse>;
    gradeHomeworkSubmission(submissionId: string, marksObtained: number, feedback?: string, teacherComments?: string, userId?: string): Promise<IHomeworkSubmissionResponse>;
    getHomeworkSubmissions(homeworkId: string, userId: string): Promise<IHomeworkSubmissionResponse[]>;
    getHomeworkCalendar(schoolId: string, startDate: string, endDate: string, grade?: number, section?: string): Promise<IHomeworkCalendar>;
    requestRevision(submissionId: string, reason: string, userId: string): Promise<IHomeworkSubmissionResponse>;
    private formatHomeworkResponse;
    private formatSubmissionResponse;
    private groupBy;
}
export declare const homeworkService: HomeworkService;
export {};
//# sourceMappingURL=homework.service.d.ts.map