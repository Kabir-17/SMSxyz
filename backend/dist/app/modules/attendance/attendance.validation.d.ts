import { z } from "zod";
declare const autoAttendEventValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        event: z.ZodObject<{
            eventId: z.ZodString;
            descriptor: z.ZodString;
            studentId: z.ZodString;
            firstName: z.ZodString;
            age: z.ZodString;
            grade: z.ZodString;
            section: z.ZodString;
            bloodGroup: z.ZodString;
            capturedAt: z.ZodEffects<z.ZodString, string, string>;
            capturedDate: z.ZodString;
            capturedTime: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            firstName: string;
            studentId: string;
            grade: string;
            section: string;
            bloodGroup: string;
            capturedAt: string;
            eventId: string;
            age: string;
            descriptor: string;
            capturedDate: string;
            capturedTime: string;
        }, {
            firstName: string;
            studentId: string;
            grade: string;
            section: string;
            bloodGroup: string;
            capturedAt: string;
            eventId: string;
            age: string;
            descriptor: string;
            capturedDate: string;
            capturedTime: string;
        }>;
        source: z.ZodObject<{
            app: z.ZodString;
            version: z.ZodString;
            deviceId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            version: string;
            app: string;
            deviceId?: string | undefined;
        }, {
            version: string;
            app: string;
            deviceId?: string | undefined;
        }>;
        test: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        test: boolean;
        source: {
            version: string;
            app: string;
            deviceId?: string | undefined;
        };
        event: {
            firstName: string;
            studentId: string;
            grade: string;
            section: string;
            bloodGroup: string;
            capturedAt: string;
            eventId: string;
            age: string;
            descriptor: string;
            capturedDate: string;
            capturedTime: string;
        };
    }, {
        source: {
            version: string;
            app: string;
            deviceId?: string | undefined;
        };
        event: {
            firstName: string;
            studentId: string;
            grade: string;
            section: string;
            bloodGroup: string;
            capturedAt: string;
            eventId: string;
            age: string;
            descriptor: string;
            capturedDate: string;
            capturedTime: string;
        };
        test?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        test: boolean;
        source: {
            version: string;
            app: string;
            deviceId?: string | undefined;
        };
        event: {
            firstName: string;
            studentId: string;
            grade: string;
            section: string;
            bloodGroup: string;
            capturedAt: string;
            eventId: string;
            age: string;
            descriptor: string;
            capturedDate: string;
            capturedTime: string;
        };
    };
}, {
    body: {
        source: {
            version: string;
            app: string;
            deviceId?: string | undefined;
        };
        event: {
            firstName: string;
            studentId: string;
            grade: string;
            section: string;
            bloodGroup: string;
            capturedAt: string;
            eventId: string;
            age: string;
            descriptor: string;
            capturedDate: string;
            capturedTime: string;
        };
        test?: boolean | undefined;
    };
}>;
declare const createAttendanceValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        classId: z.ZodString;
        subjectId: z.ZodString;
        date: z.ZodEffects<z.ZodString, string, string>;
        period: z.ZodNumber;
        students: z.ZodArray<z.ZodObject<{
            studentId: z.ZodString;
            status: z.ZodEnum<["present", "absent", "late", "excused"]>;
        }, "strip", z.ZodTypeAny, {
            status: "present" | "absent" | "late" | "excused";
            studentId: string;
        }, {
            status: "present" | "absent" | "late" | "excused";
            studentId: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        date: string;
        subjectId: string;
        classId: string;
        period: number;
        students: {
            status: "present" | "absent" | "late" | "excused";
            studentId: string;
        }[];
    }, {
        date: string;
        subjectId: string;
        classId: string;
        period: number;
        students: {
            status: "present" | "absent" | "late" | "excused";
            studentId: string;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        date: string;
        subjectId: string;
        classId: string;
        period: number;
        students: {
            status: "present" | "absent" | "late" | "excused";
            studentId: string;
        }[];
    };
}, {
    body: {
        date: string;
        subjectId: string;
        classId: string;
        period: number;
        students: {
            status: "present" | "absent" | "late" | "excused";
            studentId: string;
        }[];
    };
}>;
declare const updateAttendanceValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<["present", "absent", "late", "excused"]>>;
        modificationReason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status?: "present" | "absent" | "late" | "excused" | undefined;
        modificationReason?: string | undefined;
    }, {
        status?: "present" | "absent" | "late" | "excused" | undefined;
        modificationReason?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        status?: "present" | "absent" | "late" | "excused" | undefined;
        modificationReason?: string | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        status?: "present" | "absent" | "late" | "excused" | undefined;
        modificationReason?: string | undefined;
    };
}>;
declare const getAttendanceValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
}, {
    params: {
        id: string;
    };
}>;
declare const getClassAttendanceValidationSchema: z.ZodObject<{
    query: z.ZodObject<{
        classId: z.ZodString;
        date: z.ZodString;
        period: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        classId: string;
        period?: number | undefined;
    }, {
        date: string;
        classId: string;
        period?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        date: string;
        classId: string;
        period?: number | undefined;
    };
}, {
    query: {
        date: string;
        classId: string;
        period?: string | undefined;
    };
}>;
declare const getStudentAttendanceValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        studentId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        studentId: string;
    }, {
        studentId: string;
    }>;
    query: z.ZodEffects<z.ZodObject<{
        startDate: z.ZodString;
        endDate: z.ZodString;
        subjectId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        startDate: string;
        endDate: string;
        subjectId?: string | undefined;
    }, {
        startDate: string;
        endDate: string;
        subjectId?: string | undefined;
    }>, {
        startDate: string;
        endDate: string;
        subjectId?: string | undefined;
    }, {
        startDate: string;
        endDate: string;
        subjectId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        startDate: string;
        endDate: string;
        subjectId?: string | undefined;
    };
    params: {
        studentId: string;
    };
}, {
    query: {
        startDate: string;
        endDate: string;
        subjectId?: string | undefined;
    };
    params: {
        studentId: string;
    };
}>;
declare const getAttendanceStatsValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        schoolId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        schoolId: string;
    }, {
        schoolId: string;
    }>;
    query: z.ZodEffects<z.ZodObject<{
        startDate: z.ZodString;
        endDate: z.ZodString;
        grade: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>;
        section: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        startDate: string;
        endDate: string;
        grade?: number | undefined;
        section?: string | undefined;
    }, {
        startDate: string;
        endDate: string;
        grade?: string | undefined;
        section?: string | undefined;
    }>, {
        startDate: string;
        endDate: string;
        grade?: number | undefined;
        section?: string | undefined;
    }, {
        startDate: string;
        endDate: string;
        grade?: string | undefined;
        section?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        startDate: string;
        endDate: string;
        grade?: number | undefined;
        section?: string | undefined;
    };
    params: {
        schoolId: string;
    };
}, {
    query: {
        startDate: string;
        endDate: string;
        grade?: string | undefined;
        section?: string | undefined;
    };
    params: {
        schoolId: string;
    };
}>;
declare const markBulkAttendanceValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        classId: z.ZodString;
        subjectId: z.ZodString;
        date: z.ZodString;
        periods: z.ZodArray<z.ZodObject<{
            period: z.ZodNumber;
            students: z.ZodArray<z.ZodObject<{
                studentId: z.ZodString;
                status: z.ZodEnum<["present", "absent", "late", "excused"]>;
            }, "strip", z.ZodTypeAny, {
                status: "present" | "absent" | "late" | "excused";
                studentId: string;
            }, {
                status: "present" | "absent" | "late" | "excused";
                studentId: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            period: number;
            students: {
                status: "present" | "absent" | "late" | "excused";
                studentId: string;
            }[];
        }, {
            period: number;
            students: {
                status: "present" | "absent" | "late" | "excused";
                studentId: string;
            }[];
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        date: string;
        subjectId: string;
        classId: string;
        periods: {
            period: number;
            students: {
                status: "present" | "absent" | "late" | "excused";
                studentId: string;
            }[];
        }[];
    }, {
        date: string;
        subjectId: string;
        classId: string;
        periods: {
            period: number;
            students: {
                status: "present" | "absent" | "late" | "excused";
                studentId: string;
            }[];
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        date: string;
        subjectId: string;
        classId: string;
        periods: {
            period: number;
            students: {
                status: "present" | "absent" | "late" | "excused";
                studentId: string;
            }[];
        }[];
    };
}, {
    body: {
        date: string;
        subjectId: string;
        classId: string;
        periods: {
            period: number;
            students: {
                status: "present" | "absent" | "late" | "excused";
                studentId: string;
            }[];
        }[];
    };
}>;
declare const getAttendanceReportValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        schoolId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        schoolId: string;
    }, {
        schoolId: string;
    }>;
    query: z.ZodObject<{
        startDate: z.ZodString;
        endDate: z.ZodString;
        grade: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>;
        section: z.ZodOptional<z.ZodString>;
        studentId: z.ZodOptional<z.ZodString>;
        format: z.ZodDefault<z.ZodOptional<z.ZodEnum<["json", "csv", "pdf"]>>>;
        minAttendance: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>;
    }, "strip", z.ZodTypeAny, {
        startDate: string;
        endDate: string;
        format: "pdf" | "csv" | "json";
        studentId?: string | undefined;
        grade?: number | undefined;
        section?: string | undefined;
        minAttendance?: number | undefined;
    }, {
        startDate: string;
        endDate: string;
        studentId?: string | undefined;
        grade?: string | undefined;
        section?: string | undefined;
        format?: "pdf" | "csv" | "json" | undefined;
        minAttendance?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        startDate: string;
        endDate: string;
        format: "pdf" | "csv" | "json";
        studentId?: string | undefined;
        grade?: number | undefined;
        section?: string | undefined;
        minAttendance?: number | undefined;
    };
    params: {
        schoolId: string;
    };
}, {
    query: {
        startDate: string;
        endDate: string;
        studentId?: string | undefined;
        grade?: string | undefined;
        section?: string | undefined;
        format?: "pdf" | "csv" | "json" | undefined;
        minAttendance?: string | undefined;
    };
    params: {
        schoolId: string;
    };
}>;
export { autoAttendEventValidationSchema, createAttendanceValidationSchema, updateAttendanceValidationSchema, getAttendanceValidationSchema, getClassAttendanceValidationSchema, getStudentAttendanceValidationSchema, getAttendanceStatsValidationSchema, markBulkAttendanceValidationSchema, getAttendanceReportValidationSchema, };
//# sourceMappingURL=attendance.validation.d.ts.map