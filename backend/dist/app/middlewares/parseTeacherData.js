"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTeacherData = void 0;
const parseTeacherData = (req, res, next) => {
    try {
        const teacherData = { ...req.body };
        const jsonFields = ['subjects', 'grades', 'sections', 'experience', 'qualifications', 'address', 'emergencyContact', 'salary', 'isClassTeacher', 'isActive', 'classTeacherFor'];
        jsonFields.forEach(field => {
            if (teacherData[field] && typeof teacherData[field] === 'string') {
                try {
                    teacherData[field] = JSON.parse(teacherData[field]);
                }
                catch (error) {
                    console.error(`Failed to parse ${field}:`, error);
                }
            }
        });
        if (teacherData.grades && Array.isArray(teacherData.grades)) {
            teacherData.grades = teacherData.grades.map((grade) => {
                return typeof grade === 'string' ? parseInt(grade, 10) : grade;
            });
        }
        if (teacherData.qualifications && Array.isArray(teacherData.qualifications)) {
            teacherData.qualifications = teacherData.qualifications.map((qual) => ({
                ...qual,
                year: typeof qual.year === 'string' ? parseInt(qual.year, 10) : qual.year
            }));
        }
        if (teacherData.isClassTeacher && typeof teacherData.isClassTeacher === 'string') {
            teacherData.isClassTeacher = teacherData.isClassTeacher === 'true';
        }
        if (teacherData.isActive && typeof teacherData.isActive === 'string') {
            teacherData.isActive = teacherData.isActive === 'true';
        }
        req.body = teacherData;
        next();
    }
    catch (error) {
        console.error("Error in parseTeacherData middleware:", error);
        next(error);
    }
};
exports.parseTeacherData = parseTeacherData;
//# sourceMappingURL=parseTeacherData.js.map