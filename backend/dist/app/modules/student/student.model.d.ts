import { IStudentModel, IStudentPhotoDocument } from "./student.interface";
export declare const Student: IStudentModel;
export declare const StudentPhoto: import("mongoose").Model<IStudentPhotoDocument, {}, {}, {}, import("mongoose").Document<unknown, {}, IStudentPhotoDocument, {}, {}> & IStudentPhotoDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=student.model.d.ts.map