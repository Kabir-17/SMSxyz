"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHomeworkFormData = exports.parseBody = void 0;
const AppError_1 = require("../errors/AppError");
const catchAsync_1 = require("../utils/catchAsync");
exports.parseBody = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    if (!req.body.data) {
        throw new AppError_1.AppError(400, "Please provide data in the body under data key");
    }
    req.body = JSON.parse(req.body.data);
    next();
});
const parseHomeworkFormData = (req, res, next) => {
    try {
        if (req.body) {
            const numericFields = ['grade', 'estimatedDuration', 'totalMarks', 'passingMarks', 'latePenalty', 'maxLateDays', 'maxGroupSize'];
            numericFields.forEach(field => {
                if (req.body[field] !== undefined && req.body[field] !== '') {
                    const value = parseFloat(req.body[field]);
                    if (!isNaN(value)) {
                        req.body[field] = value;
                    }
                }
            });
            const booleanFields = ['allowLateSubmission', 'isGroupWork', 'isPublished'];
            booleanFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    if (typeof req.body[field] === 'string') {
                        req.body[field] = req.body[field].toLowerCase() === 'true';
                    }
                }
            });
            const optionalFields = ['instructions', 'section', 'classId'];
            optionalFields.forEach(field => {
                if (req.body[field] === '') {
                    req.body[field] = undefined;
                }
            });
            const requiredStringFields = ['title', 'description', 'subjectId', 'homeworkType', 'submissionType'];
            requiredStringFields.forEach(field => {
                if (req.body[field] === '') {
                    req.body[field] = undefined;
                }
            });
        }
        next();
    }
    catch (error) {
        console.error('Error parsing FormData:', error);
        next(error);
    }
};
exports.parseHomeworkFormData = parseHomeworkFormData;
//# sourceMappingURL=parseFormData.js.map