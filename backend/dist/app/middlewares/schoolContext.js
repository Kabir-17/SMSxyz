"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachSchoolContext = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = require("../utils/catchAsync");
const school_model_1 = require("../modules/school/school.model");
exports.attachSchoolContext = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const requestWithContext = req;
    let schoolId = requestWithContext.user?.schoolId;
    if (!schoolId) {
        const attendanceMatch = req.path?.match(/^\/attendance\/([^/]+)/);
        const apiKeyHeader = req.headers["x-attendance-key"];
        if (attendanceMatch && typeof apiKeyHeader === "string") {
            const identifier = decodeURIComponent(attendanceMatch[1]);
            const orConditions = [{ slug: identifier }, { schoolId: identifier }];
            if (mongoose_1.default.Types.ObjectId.isValid(identifier)) {
                orConditions.push({ _id: identifier });
            }
            const school = await school_model_1.School.findOne({
                $or: orConditions,
                apiKey: apiKeyHeader,
            }).select("_id name slug schoolId apiKey isActive settings.timezone");
            if (school) {
                requestWithContext.school = school;
                schoolId = school._id.toString();
                res.locals.school = school;
                res.locals.schoolId = schoolId;
            }
        }
    }
    if (schoolId) {
        requestWithContext.schoolContextId = schoolId;
        if (!res.locals.schoolId) {
            res.locals.schoolId = schoolId;
        }
    }
    next();
});
//# sourceMappingURL=schoolContext.js.map