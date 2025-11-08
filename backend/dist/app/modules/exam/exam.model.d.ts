import { IExamModel, IExamResultDocument } from './exam.interface';
export declare const Exam: IExamModel;
export declare const ExamResult: import("mongoose").Model<IExamResultDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, IExamResultDocument, {}, {}> & IExamResultDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=exam.model.d.ts.map