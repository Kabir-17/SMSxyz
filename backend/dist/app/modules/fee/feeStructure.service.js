"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feeStructure_model_1 = __importDefault(require("./feeStructure.model"));
const AppError_1 = require("../../errors/AppError");
class FeeStructureService {
    async createFeeStructure(data) {
        const existingStructure = await feeStructure_model_1.default.findOne({
            school: data.school,
            grade: data.grade,
            academicYear: data.academicYear,
            isActive: true,
        });
        if (existingStructure) {
            throw new AppError_1.AppError(409, `Active fee structure already exists for ${data.grade} in ${data.academicYear}`);
        }
        const feeStructure = await feeStructure_model_1.default.create({
            ...data,
            isActive: true,
        });
        return feeStructure;
    }
    async getFeeStructureById(id) {
        const feeStructure = await feeStructure_model_1.default.findById(id).populate("school", "name schoolId");
        if (!feeStructure) {
            throw new AppError_1.AppError(404, "Fee structure not found");
        }
        return feeStructure;
    }
    async getActiveFeeStructure(schoolId, grade, academicYear) {
        const feeStructure = await feeStructure_model_1.default.findOne({
            school: schoolId,
            grade,
            academicYear,
            isActive: true,
        });
        return feeStructure;
    }
    async getFeeStructuresBySchool(schoolId, filters) {
        const query = { school: schoolId };
        if (filters?.grade) {
            query.grade = filters.grade;
        }
        if (filters?.academicYear) {
            query.academicYear = filters.academicYear;
        }
        if (filters?.isActive !== undefined) {
            query.isActive = filters.isActive;
        }
        const feeStructures = await feeStructure_model_1.default.find(query).sort({
            academicYear: -1,
            grade: 1,
        });
        return feeStructures;
    }
    async updateFeeStructure(id, data) {
        const feeStructure = await feeStructure_model_1.default.findById(id);
        if (!feeStructure) {
            throw new AppError_1.AppError(404, "Fee structure not found");
        }
        if (!feeStructure.canModify()) {
            throw new AppError_1.AppError(403, "Cannot modify fee structure that is already in use");
        }
        if (data.feeComponents) {
            feeStructure.feeComponents = data.feeComponents;
        }
        if (data.dueDate) {
            feeStructure.dueDate = data.dueDate;
        }
        if (data.lateFeePercentage !== undefined) {
            feeStructure.lateFeePercentage = data.lateFeePercentage;
        }
        feeStructure.updatedBy = data.updatedBy;
        await feeStructure.save();
        return feeStructure;
    }
    async deactivateFeeStructure(id, updatedBy) {
        const feeStructure = await feeStructure_model_1.default.findById(id);
        if (!feeStructure) {
            throw new AppError_1.AppError(404, "Fee structure not found");
        }
        if (!feeStructure.isActive) {
            throw new AppError_1.AppError(400, "Fee structure is already inactive");
        }
        await feeStructure.deactivate(updatedBy);
        return feeStructure;
    }
    async getGradesWithFeeStructure(schoolId, academicYear) {
        return feeStructure_model_1.default.distinct("grade", {
            school: schoolId,
            academicYear,
            isActive: true,
        });
    }
    async cloneFeeStructure(sourceId, targetAcademicYear, createdBy) {
        const sourceFeeStructure = await feeStructure_model_1.default.findById(sourceId);
        if (!sourceFeeStructure) {
            throw new AppError_1.AppError(404, "Source fee structure not found");
        }
        const existingTarget = await feeStructure_model_1.default.findOne({
            school: sourceFeeStructure.school,
            grade: sourceFeeStructure.grade,
            academicYear: targetAcademicYear,
            isActive: true,
        });
        if (existingTarget) {
            throw new AppError_1.AppError(409, `Fee structure already exists for ${sourceFeeStructure.grade} in ${targetAcademicYear}`);
        }
        const clonedFeeStructure = await feeStructure_model_1.default.create({
            school: sourceFeeStructure.school,
            grade: sourceFeeStructure.grade,
            academicYear: targetAcademicYear,
            feeComponents: sourceFeeStructure.feeComponents,
            totalAmount: sourceFeeStructure.totalAmount,
            dueDate: sourceFeeStructure.dueDate,
            lateFeePercentage: sourceFeeStructure.lateFeePercentage,
            isActive: true,
            createdBy,
        });
        return clonedFeeStructure;
    }
    async bulkCreateFeeStructures(data) {
        const createdStructures = [];
        const errors = [];
        for (const gradeData of data.grades) {
            try {
                const feeStructure = await this.createFeeStructure({
                    school: data.school,
                    grade: gradeData.grade,
                    academicYear: data.academicYear,
                    feeComponents: gradeData.feeComponents,
                    dueDate: gradeData.dueDate,
                    lateFeePercentage: gradeData.lateFeePercentage,
                    createdBy: data.createdBy,
                });
                createdStructures.push(feeStructure);
            }
            catch (error) {
                errors.push(`${gradeData.grade}: ${error.message || "Failed to create"}`);
            }
        }
        if (errors.length > 0 && createdStructures.length === 0) {
            throw new AppError_1.AppError(400, `Failed to create fee structures: ${errors.join(", ")}`);
        }
        return createdStructures;
    }
}
exports.default = new FeeStructureService();
//# sourceMappingURL=feeStructure.service.js.map