import { IFeeStructure, IFeeComponent } from "./fee.interface";
declare class FeeStructureService {
    createFeeStructure(data: {
        school: string;
        grade: string;
        academicYear: string;
        feeComponents: IFeeComponent[];
        dueDate: number;
        lateFeePercentage: number;
        createdBy: string;
    }): Promise<IFeeStructure>;
    getFeeStructureById(id: string): Promise<IFeeStructure>;
    getActiveFeeStructure(schoolId: string, grade: string, academicYear: string): Promise<IFeeStructure | null>;
    getFeeStructuresBySchool(schoolId: string, filters?: {
        grade?: string;
        academicYear?: string;
        isActive?: boolean;
    }): Promise<IFeeStructure[]>;
    updateFeeStructure(id: string, data: {
        feeComponents?: IFeeComponent[];
        dueDate?: number;
        lateFeePercentage?: number;
        updatedBy: string;
    }): Promise<IFeeStructure>;
    deactivateFeeStructure(id: string, updatedBy: string): Promise<IFeeStructure>;
    getGradesWithFeeStructure(schoolId: string, academicYear: string): Promise<string[]>;
    cloneFeeStructure(sourceId: string, targetAcademicYear: string, createdBy: string): Promise<IFeeStructure>;
    bulkCreateFeeStructures(data: {
        school: string;
        academicYear: string;
        grades: Array<{
            grade: string;
            feeComponents: IFeeComponent[];
            dueDate: number;
            lateFeePercentage: number;
        }>;
        createdBy: string;
    }): Promise<IFeeStructure[]>;
}
declare const _default: FeeStructureService;
export default _default;
//# sourceMappingURL=feeStructure.service.d.ts.map