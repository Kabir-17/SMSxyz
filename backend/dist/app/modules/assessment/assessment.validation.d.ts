import { z } from "zod";
export declare const createAssessmentSchema: z.ZodObject<{
    body: z.ZodObject<{
        subjectId: z.ZodString;
        subjectName: z.ZodOptional<z.ZodString>;
        grade: z.ZodNumber;
        section: z.ZodString;
        examName: z.ZodString;
        examDate: z.ZodEffects<z.ZodString, string, string>;
        totalMarks: z.ZodNumber;
        note: z.ZodOptional<z.ZodString>;
        categoryId: z.ZodOptional<z.ZodString>;
        categoryLabel: z.ZodOptional<z.ZodString>;
        academicYear: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        grade: number;
        section: string;
        subjectId: string;
        examName: string;
        examDate: string;
        totalMarks: number;
        academicYear?: string | undefined;
        note?: string | undefined;
        subjectName?: string | undefined;
        categoryId?: string | undefined;
        categoryLabel?: string | undefined;
    }, {
        grade: number;
        section: string;
        subjectId: string;
        examName: string;
        examDate: string;
        totalMarks: number;
        academicYear?: string | undefined;
        note?: string | undefined;
        subjectName?: string | undefined;
        categoryId?: string | undefined;
        categoryLabel?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        grade: number;
        section: string;
        subjectId: string;
        examName: string;
        examDate: string;
        totalMarks: number;
        academicYear?: string | undefined;
        note?: string | undefined;
        subjectName?: string | undefined;
        categoryId?: string | undefined;
        categoryLabel?: string | undefined;
    };
}, {
    body: {
        grade: number;
        section: string;
        subjectId: string;
        examName: string;
        examDate: string;
        totalMarks: number;
        academicYear?: string | undefined;
        note?: string | undefined;
        subjectName?: string | undefined;
        categoryId?: string | undefined;
        categoryLabel?: string | undefined;
    };
}>;
export declare const updateAssessmentSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodEffects<z.ZodObject<{
        examName: z.ZodOptional<z.ZodString>;
        examDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        totalMarks: z.ZodOptional<z.ZodNumber>;
        note: z.ZodOptional<z.ZodString>;
        categoryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        categoryLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        academicYear: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        academicYear?: string | undefined;
        examName?: string | undefined;
        examDate?: string | undefined;
        totalMarks?: number | undefined;
        note?: string | undefined;
        categoryId?: string | null | undefined;
        categoryLabel?: string | null | undefined;
    }, {
        academicYear?: string | undefined;
        examName?: string | undefined;
        examDate?: string | undefined;
        totalMarks?: number | undefined;
        note?: string | undefined;
        categoryId?: string | null | undefined;
        categoryLabel?: string | null | undefined;
    }>, {
        academicYear?: string | undefined;
        examName?: string | undefined;
        examDate?: string | undefined;
        totalMarks?: number | undefined;
        note?: string | undefined;
        categoryId?: string | null | undefined;
        categoryLabel?: string | null | undefined;
    }, {
        academicYear?: string | undefined;
        examName?: string | undefined;
        examDate?: string | undefined;
        totalMarks?: number | undefined;
        note?: string | undefined;
        categoryId?: string | null | undefined;
        categoryLabel?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        academicYear?: string | undefined;
        examName?: string | undefined;
        examDate?: string | undefined;
        totalMarks?: number | undefined;
        note?: string | undefined;
        categoryId?: string | null | undefined;
        categoryLabel?: string | null | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        academicYear?: string | undefined;
        examName?: string | undefined;
        examDate?: string | undefined;
        totalMarks?: number | undefined;
        note?: string | undefined;
        categoryId?: string | null | undefined;
        categoryLabel?: string | null | undefined;
    };
}>;
export declare const submitResultsSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        results: z.ZodArray<z.ZodObject<{
            studentId: z.ZodString;
            marksObtained: z.ZodNumber;
            remarks: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            studentId: string;
            marksObtained: number;
            remarks?: string | undefined;
        }, {
            studentId: string;
            marksObtained: number;
            remarks?: string | undefined;
        }>, "many">;
        publish: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        results: {
            studentId: string;
            marksObtained: number;
            remarks?: string | undefined;
        }[];
        publish?: boolean | undefined;
    }, {
        results: {
            studentId: string;
            marksObtained: number;
            remarks?: string | undefined;
        }[];
        publish?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        results: {
            studentId: string;
            marksObtained: number;
            remarks?: string | undefined;
        }[];
        publish?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        results: {
            studentId: string;
            marksObtained: number;
            remarks?: string | undefined;
        }[];
        publish?: boolean | undefined;
    };
}>;
export declare const teacherAssessmentsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        subjectId: z.ZodOptional<z.ZodString>;
        grade: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        section: z.ZodOptional<z.ZodString>;
        includeStats: z.ZodOptional<z.ZodEffects<z.ZodString, boolean, string>>;
    }, "strip", z.ZodTypeAny, {
        grade?: number | undefined;
        section?: string | undefined;
        subjectId?: string | undefined;
        includeStats?: boolean | undefined;
    }, {
        grade?: string | undefined;
        section?: string | undefined;
        subjectId?: string | undefined;
        includeStats?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        grade?: number | undefined;
        section?: string | undefined;
        subjectId?: string | undefined;
        includeStats?: boolean | undefined;
    };
}, {
    query: {
        grade?: string | undefined;
        section?: string | undefined;
        subjectId?: string | undefined;
        includeStats?: string | undefined;
    };
}>;
export declare const teacherPerformanceQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        subjectId: z.ZodString;
        grade: z.ZodEffects<z.ZodString, number, string>;
        section: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        grade: number;
        section: string;
        subjectId: string;
    }, {
        grade: string;
        section: string;
        subjectId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        grade: number;
        section: string;
        subjectId: string;
    };
}, {
    query: {
        grade: string;
        section: string;
        subjectId: string;
    };
}>;
export declare const exportAssessmentSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    query: z.ZodObject<{
        format: z.ZodDefault<z.ZodEnum<["csv", "xlsx"]>>;
    }, "strip", z.ZodTypeAny, {
        format: "csv" | "xlsx";
    }, {
        format?: "csv" | "xlsx" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        format: "csv" | "xlsx";
    };
    params: {
        id: string;
    };
}, {
    query: {
        format?: "csv" | "xlsx" | undefined;
    };
    params: {
        id: string;
    };
}>;
export declare const exportAllTeacherAssessmentsSchema: z.ZodObject<{
    query: z.ZodObject<{
        subjectId: z.ZodOptional<z.ZodString>;
        grade: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        section: z.ZodOptional<z.ZodString>;
        format: z.ZodDefault<z.ZodEnum<["csv", "xlsx"]>>;
    }, "strip", z.ZodTypeAny, {
        format: "csv" | "xlsx";
        grade?: number | undefined;
        section?: string | undefined;
        subjectId?: string | undefined;
    }, {
        grade?: string | undefined;
        section?: string | undefined;
        subjectId?: string | undefined;
        format?: "csv" | "xlsx" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        format: "csv" | "xlsx";
        grade?: number | undefined;
        section?: string | undefined;
        subjectId?: string | undefined;
    };
}, {
    query: {
        grade?: string | undefined;
        section?: string | undefined;
        subjectId?: string | undefined;
        format?: "csv" | "xlsx" | undefined;
    };
}>;
export declare const adminClassAssessmentsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        schoolId: z.ZodOptional<z.ZodString>;
        grade: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        section: z.ZodOptional<z.ZodString>;
        subjectId: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
        includeStats: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["true", "false"]>]>, boolean, boolean | "false" | "true">>;
        includeHidden: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["true", "false"]>]>, boolean, boolean | "false" | "true">>;
        onlyFavorites: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["true", "false"]>]>, boolean, boolean | "false" | "true">>;
        categoryId: z.ZodOptional<z.ZodString>;
        teacherId: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodOptional<z.ZodEnum<["examDate", "averagePercentage", "totalMarks", "gradedCount", "examName"]>>;
        sortDirection: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
        fromDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, Date, string>]>>;
        toDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, Date, string>]>>;
    }, "strip", z.ZodTypeAny, {
        schoolId?: string | undefined;
        search?: string | undefined;
        sortBy?: "examName" | "examDate" | "totalMarks" | "averagePercentage" | "gradedCount" | undefined;
        grade?: number | undefined;
        section?: string | undefined;
        teacherId?: string | undefined;
        fromDate?: Date | undefined;
        toDate?: Date | undefined;
        subjectId?: string | undefined;
        includeHidden?: boolean | undefined;
        onlyFavorites?: boolean | undefined;
        categoryId?: string | undefined;
        sortDirection?: "asc" | "desc" | undefined;
        includeStats?: boolean | undefined;
    }, {
        schoolId?: string | undefined;
        search?: string | undefined;
        sortBy?: "examName" | "examDate" | "totalMarks" | "averagePercentage" | "gradedCount" | undefined;
        grade?: string | undefined;
        section?: string | undefined;
        teacherId?: string | undefined;
        fromDate?: string | Date | undefined;
        toDate?: string | Date | undefined;
        subjectId?: string | undefined;
        includeHidden?: boolean | "false" | "true" | undefined;
        onlyFavorites?: boolean | "false" | "true" | undefined;
        categoryId?: string | undefined;
        sortDirection?: "asc" | "desc" | undefined;
        includeStats?: boolean | "false" | "true" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        schoolId?: string | undefined;
        search?: string | undefined;
        sortBy?: "examName" | "examDate" | "totalMarks" | "averagePercentage" | "gradedCount" | undefined;
        grade?: number | undefined;
        section?: string | undefined;
        teacherId?: string | undefined;
        fromDate?: Date | undefined;
        toDate?: Date | undefined;
        subjectId?: string | undefined;
        includeHidden?: boolean | undefined;
        onlyFavorites?: boolean | undefined;
        categoryId?: string | undefined;
        sortDirection?: "asc" | "desc" | undefined;
        includeStats?: boolean | undefined;
    };
}, {
    query: {
        schoolId?: string | undefined;
        search?: string | undefined;
        sortBy?: "examName" | "examDate" | "totalMarks" | "averagePercentage" | "gradedCount" | undefined;
        grade?: string | undefined;
        section?: string | undefined;
        teacherId?: string | undefined;
        fromDate?: string | Date | undefined;
        toDate?: string | Date | undefined;
        subjectId?: string | undefined;
        includeHidden?: boolean | "false" | "true" | undefined;
        onlyFavorites?: boolean | "false" | "true" | undefined;
        categoryId?: string | undefined;
        sortDirection?: "asc" | "desc" | undefined;
        includeStats?: boolean | "false" | "true" | undefined;
    };
}>;
export declare const adminExportAssessmentsSchema: z.ZodObject<{
    query: z.ZodObject<{
        schoolId: z.ZodOptional<z.ZodString>;
        grade: z.ZodOptional<z.ZodEffects<z.ZodString, number, string>>;
        section: z.ZodOptional<z.ZodString>;
        subjectId: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
        includeStats: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["true", "false"]>]>, boolean, boolean | "false" | "true">>;
        includeHidden: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["true", "false"]>]>, boolean, boolean | "false" | "true">>;
        onlyFavorites: z.ZodOptional<z.ZodEffects<z.ZodUnion<[z.ZodBoolean, z.ZodEnum<["true", "false"]>]>, boolean, boolean | "false" | "true">>;
        categoryId: z.ZodOptional<z.ZodString>;
        teacherId: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodOptional<z.ZodEnum<["examDate", "averagePercentage", "totalMarks", "gradedCount", "examName"]>>;
        sortDirection: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
        fromDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, Date, string>]>>;
        toDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodEffects<z.ZodEffects<z.ZodString, string, string>, Date, string>]>>;
    } & {
        format: z.ZodDefault<z.ZodEnum<["csv", "xlsx"]>>;
        assessmentIds: z.ZodOptional<z.ZodUnion<[z.ZodArray<z.ZodString, "many">, z.ZodEffects<z.ZodString, string[], string>]>>;
    }, "strip", z.ZodTypeAny, {
        format: "csv" | "xlsx";
        schoolId?: string | undefined;
        search?: string | undefined;
        sortBy?: "examName" | "examDate" | "totalMarks" | "averagePercentage" | "gradedCount" | undefined;
        grade?: number | undefined;
        section?: string | undefined;
        teacherId?: string | undefined;
        fromDate?: Date | undefined;
        toDate?: Date | undefined;
        subjectId?: string | undefined;
        includeHidden?: boolean | undefined;
        onlyFavorites?: boolean | undefined;
        categoryId?: string | undefined;
        sortDirection?: "asc" | "desc" | undefined;
        assessmentIds?: string[] | undefined;
        includeStats?: boolean | undefined;
    }, {
        schoolId?: string | undefined;
        search?: string | undefined;
        sortBy?: "examName" | "examDate" | "totalMarks" | "averagePercentage" | "gradedCount" | undefined;
        grade?: string | undefined;
        section?: string | undefined;
        teacherId?: string | undefined;
        fromDate?: string | Date | undefined;
        toDate?: string | Date | undefined;
        subjectId?: string | undefined;
        format?: "csv" | "xlsx" | undefined;
        includeHidden?: boolean | "false" | "true" | undefined;
        onlyFavorites?: boolean | "false" | "true" | undefined;
        categoryId?: string | undefined;
        sortDirection?: "asc" | "desc" | undefined;
        assessmentIds?: string | string[] | undefined;
        includeStats?: boolean | "false" | "true" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        format: "csv" | "xlsx";
        schoolId?: string | undefined;
        search?: string | undefined;
        sortBy?: "examName" | "examDate" | "totalMarks" | "averagePercentage" | "gradedCount" | undefined;
        grade?: number | undefined;
        section?: string | undefined;
        teacherId?: string | undefined;
        fromDate?: Date | undefined;
        toDate?: Date | undefined;
        subjectId?: string | undefined;
        includeHidden?: boolean | undefined;
        onlyFavorites?: boolean | undefined;
        categoryId?: string | undefined;
        sortDirection?: "asc" | "desc" | undefined;
        assessmentIds?: string[] | undefined;
        includeStats?: boolean | undefined;
    };
}, {
    query: {
        schoolId?: string | undefined;
        search?: string | undefined;
        sortBy?: "examName" | "examDate" | "totalMarks" | "averagePercentage" | "gradedCount" | undefined;
        grade?: string | undefined;
        section?: string | undefined;
        teacherId?: string | undefined;
        fromDate?: string | Date | undefined;
        toDate?: string | Date | undefined;
        subjectId?: string | undefined;
        format?: "csv" | "xlsx" | undefined;
        includeHidden?: boolean | "false" | "true" | undefined;
        onlyFavorites?: boolean | "false" | "true" | undefined;
        categoryId?: string | undefined;
        sortDirection?: "asc" | "desc" | undefined;
        assessmentIds?: string | string[] | undefined;
        includeStats?: boolean | "false" | "true" | undefined;
    };
}>;
export declare const adminUpdateAssessmentPreferenceSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodEffects<z.ZodObject<{
        isFavorite: z.ZodOptional<z.ZodBoolean>;
        isHidden: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        isFavorite?: boolean | undefined;
        isHidden?: boolean | undefined;
    }, {
        isFavorite?: boolean | undefined;
        isHidden?: boolean | undefined;
    }>, {
        isFavorite?: boolean | undefined;
        isHidden?: boolean | undefined;
    }, {
        isFavorite?: boolean | undefined;
        isHidden?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        isFavorite?: boolean | undefined;
        isHidden?: boolean | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        isFavorite?: boolean | undefined;
        isHidden?: boolean | undefined;
    };
}>;
export declare const categoryCreateSchema: z.ZodObject<{
    body: z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        order: z.ZodOptional<z.ZodNumber>;
        isDefault: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
        isDefault?: boolean | undefined;
        order?: number | undefined;
    }, {
        name: string;
        description?: string | undefined;
        isDefault?: boolean | undefined;
        order?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        name: string;
        description?: string | undefined;
        isDefault?: boolean | undefined;
        order?: number | undefined;
    };
}, {
    body: {
        name: string;
        description?: string | undefined;
        isDefault?: boolean | undefined;
        order?: number | undefined;
    };
}>;
export declare const categoryUpdateSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodEffects<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        order: z.ZodOptional<z.ZodNumber>;
        isActive: z.ZodOptional<z.ZodBoolean>;
        isDefault: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        isActive?: boolean | undefined;
        description?: string | undefined;
        name?: string | undefined;
        isDefault?: boolean | undefined;
        order?: number | undefined;
    }, {
        isActive?: boolean | undefined;
        description?: string | undefined;
        name?: string | undefined;
        isDefault?: boolean | undefined;
        order?: number | undefined;
    }>, {
        isActive?: boolean | undefined;
        description?: string | undefined;
        name?: string | undefined;
        isDefault?: boolean | undefined;
        order?: number | undefined;
    }, {
        isActive?: boolean | undefined;
        description?: string | undefined;
        name?: string | undefined;
        isDefault?: boolean | undefined;
        order?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        isActive?: boolean | undefined;
        description?: string | undefined;
        name?: string | undefined;
        isDefault?: boolean | undefined;
        order?: number | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        isActive?: boolean | undefined;
        description?: string | undefined;
        name?: string | undefined;
        isDefault?: boolean | undefined;
        order?: number | undefined;
    };
}>;
export declare const studentAssessmentQuerySchema: z.ZodObject<{
    params: z.ZodObject<{
        studentId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        studentId?: string | undefined;
    }, {
        studentId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        studentId?: string | undefined;
    };
}, {
    params: {
        studentId?: string | undefined;
    };
}>;
//# sourceMappingURL=assessment.validation.d.ts.map