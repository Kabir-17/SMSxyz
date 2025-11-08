"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = require("../../errors/AppError");
const userCredentials_model_1 = require("../user/userCredentials.model");
const mongoose_1 = require("mongoose");
const getStudentCredentials = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { studentId } = req.params;
    const adminUser = req.user;
    if (!adminUser || !["admin", "superadmin"].includes(adminUser.role)) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Only admin and superadmin can view credentials");
    }
    if (!mongoose_1.Types.ObjectId.isValid(studentId)) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid student ID format");
    }
    const credentials = await userCredentials_model_1.UserCredentials.find({
        $or: [
            {
                role: "student",
                userId: { $in: await getUserIdsByStudentId(studentId) },
            },
            { role: "parent", associatedStudentId: studentId },
        ],
    })
        .populate("userId", "firstName lastName username")
        .populate("issuedBy", "firstName lastName username")
        .sort({ role: 1 })
        .lean({ includePassword: true });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Student credentials retrieved successfully",
        data: credentials,
    });
});
const getAllCredentials = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const adminUser = req.user;
    const { schoolId, role, hasChangedPassword } = req.query;
    if (!adminUser || !["admin", "superadmin"].includes(adminUser.role)) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Only admin and superadmin can view credentials");
    }
    const query = {};
    if (schoolId) {
        if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid school ID format");
        }
        query.schoolId = schoolId;
    }
    else if (adminUser.role === "admin") {
        query.schoolId = adminUser.schoolId;
    }
    if (role && ["student", "parent", "teacher"].includes(role)) {
        query.role = role;
    }
    if (hasChangedPassword !== undefined) {
        query.hasChangedPassword = hasChangedPassword === "true";
    }
    const credentials = await userCredentials_model_1.UserCredentials.find(query)
        .populate("userId", "firstName lastName username email")
        .populate("issuedBy", "firstName lastName username")
        .populate("associatedStudentId", "studentId")
        .sort({ createdAt: -1 })
        .limit(100)
        .lean({ includePassword: true });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Credentials retrieved successfully",
        data: credentials,
    });
});
async function getUserIdsByStudentId(studentId) {
    const { Student } = await Promise.resolve().then(() => __importStar(require("../student/student.model")));
    const student = await Student.findById(studentId).select("userId");
    return student ? [student.userId] : [];
}
exports.CredentialsController = {
    getStudentCredentials,
    getAllCredentials,
};
//# sourceMappingURL=userCredentials.controller.js.map