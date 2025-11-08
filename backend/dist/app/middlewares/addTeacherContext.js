"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTeacherContext = void 0;
const teacher_model_1 = require("../modules/teacher/teacher.model");
const AppError_1 = require("../errors/AppError");
const addTeacherContext = async (req, res, next) => {
    try {
        const { user } = req;
        if (!user || user.role !== 'teacher') {
            throw new AppError_1.AppError(403, 'Only teachers can access this resource');
        }
        const teacher = await teacher_model_1.Teacher.findOne({ userId: user.id }).populate('schoolId');
        if (!teacher) {
            throw new AppError_1.AppError(404, 'Teacher not found');
        }
        req.body.teacherId = teacher._id.toString();
        req.body.schoolId = teacher.schoolId._id.toString();
        req.teacher = teacher;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.addTeacherContext = addTeacherContext;
//# sourceMappingURL=addTeacherContext.js.map