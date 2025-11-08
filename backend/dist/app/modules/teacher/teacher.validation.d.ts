import { z } from 'zod';
declare const createTeacherValidationSchema: z.ZodObject<{
    body: z.ZodEffects<z.ZodObject<{
        schoolId: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        employeeId: z.ZodOptional<z.ZodString>;
        subjects: z.ZodArray<z.ZodString, "many">;
        grades: z.ZodArray<z.ZodNumber, "many">;
        sections: z.ZodArray<z.ZodString, "many">;
        designation: z.ZodEnum<["Principal", "Vice Principal", "Head Teacher", "Senior Teacher", "Teacher", "Assistant Teacher", "Subject Coordinator", "Sports Teacher", "Music Teacher", "Art Teacher", "Librarian", "Lab Assistant"]>;
        bloodGroup: z.ZodEnum<["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]>;
        dob: z.ZodEffects<z.ZodString, string, string>;
        joinDate: z.ZodEffects<z.ZodOptional<z.ZodString>, string | undefined, string | undefined>;
        qualifications: z.ZodArray<z.ZodObject<{
            degree: z.ZodString;
            institution: z.ZodString;
            year: z.ZodNumber;
            specialization: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }, {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }>, "many">;
        experience: z.ZodObject<{
            totalYears: z.ZodNumber;
            previousSchools: z.ZodOptional<z.ZodArray<z.ZodObject<{
                schoolName: z.ZodString;
                position: z.ZodString;
                duration: z.ZodString;
                fromDate: z.ZodString;
                toDate: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }, {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        }, {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        }>;
        address: z.ZodObject<{
            street: z.ZodOptional<z.ZodString>;
            city: z.ZodString;
            state: z.ZodString;
            zipCode: z.ZodString;
            country: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        }, {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        }>;
        emergencyContact: z.ZodObject<{
            name: z.ZodString;
            relationship: z.ZodString;
            phone: z.ZodString;
            email: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        }, {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        }>;
        salary: z.ZodOptional<z.ZodObject<{
            basic: z.ZodOptional<z.ZodNumber>;
            allowances: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
            deductions: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        }, {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        }>>;
        isClassTeacher: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        classTeacherFor: z.ZodOptional<z.ZodObject<{
            grade: z.ZodNumber;
            section: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            grade: number;
            section: string;
        }, {
            grade: number;
            section: string;
        }>>;
        isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        schoolId: string;
        firstName: string;
        lastName: string;
        address: {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        };
        grades: number[];
        sections: string[];
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        subjects: string[];
        designation: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant";
        qualifications: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[];
        experience: {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        };
        emergencyContact: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        };
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
        employeeId?: string | undefined;
        joinDate?: string | undefined;
        salary?: {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        isClassTeacher?: boolean | undefined;
        classTeacherFor?: {
            grade: number;
            section: string;
        } | undefined;
    }, {
        schoolId: string;
        firstName: string;
        lastName: string;
        address: {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        };
        grades: number[];
        sections: string[];
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        subjects: string[];
        designation: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant";
        qualifications: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[];
        experience: {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        };
        emergencyContact: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        };
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
        employeeId?: string | undefined;
        joinDate?: string | undefined;
        salary?: {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        isClassTeacher?: boolean | undefined;
        classTeacherFor?: {
            grade: number;
            section: string;
        } | undefined;
    }>, {
        schoolId: string;
        firstName: string;
        lastName: string;
        address: {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        };
        grades: number[];
        sections: string[];
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        subjects: string[];
        designation: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant";
        qualifications: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[];
        experience: {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        };
        emergencyContact: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        };
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
        employeeId?: string | undefined;
        joinDate?: string | undefined;
        salary?: {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        isClassTeacher?: boolean | undefined;
        classTeacherFor?: {
            grade: number;
            section: string;
        } | undefined;
    }, {
        schoolId: string;
        firstName: string;
        lastName: string;
        address: {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        };
        grades: number[];
        sections: string[];
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        subjects: string[];
        designation: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant";
        qualifications: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[];
        experience: {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        };
        emergencyContact: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        };
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
        employeeId?: string | undefined;
        joinDate?: string | undefined;
        salary?: {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        isClassTeacher?: boolean | undefined;
        classTeacherFor?: {
            grade: number;
            section: string;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        schoolId: string;
        firstName: string;
        lastName: string;
        address: {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        };
        grades: number[];
        sections: string[];
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        subjects: string[];
        designation: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant";
        qualifications: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[];
        experience: {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        };
        emergencyContact: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        };
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
        employeeId?: string | undefined;
        joinDate?: string | undefined;
        salary?: {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        isClassTeacher?: boolean | undefined;
        classTeacherFor?: {
            grade: number;
            section: string;
        } | undefined;
    };
}, {
    body: {
        schoolId: string;
        firstName: string;
        lastName: string;
        address: {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        };
        grades: number[];
        sections: string[];
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        subjects: string[];
        designation: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant";
        qualifications: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[];
        experience: {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        };
        emergencyContact: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        };
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
        employeeId?: string | undefined;
        joinDate?: string | undefined;
        salary?: {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        isClassTeacher?: boolean | undefined;
        classTeacherFor?: {
            grade: number;
            section: string;
        } | undefined;
    };
}>;
declare const updateTeacherValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    body: z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        dob: z.ZodOptional<z.ZodString>;
        joinDate: z.ZodOptional<z.ZodString>;
        employeeId: z.ZodOptional<z.ZodString>;
        subjects: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        grades: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        sections: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        designation: z.ZodOptional<z.ZodEnum<["Principal", "Vice Principal", "Head Teacher", "Senior Teacher", "Teacher", "Assistant Teacher", "Subject Coordinator", "Sports Teacher", "Music Teacher", "Art Teacher", "Librarian", "Lab Assistant"]>>;
        bloodGroup: z.ZodOptional<z.ZodEnum<["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]>>;
        qualifications: z.ZodOptional<z.ZodArray<z.ZodObject<{
            degree: z.ZodString;
            institution: z.ZodString;
            year: z.ZodNumber;
            specialization: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }, {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }>, "many">>;
        experience: z.ZodOptional<z.ZodObject<{
            totalYears: z.ZodNumber;
            previousSchools: z.ZodOptional<z.ZodArray<z.ZodObject<{
                schoolName: z.ZodString;
                position: z.ZodString;
                duration: z.ZodString;
                fromDate: z.ZodString;
                toDate: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }, {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        }, {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        }>>;
        address: z.ZodOptional<z.ZodObject<{
            street: z.ZodOptional<z.ZodString>;
            city: z.ZodString;
            state: z.ZodString;
            zipCode: z.ZodString;
            country: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        }, {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        }>>;
        emergencyContact: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            relationship: z.ZodString;
            phone: z.ZodString;
            email: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        }, {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        }>>;
        salary: z.ZodOptional<z.ZodObject<{
            basic: z.ZodNumber;
            allowances: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
            deductions: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            basic: number;
            allowances?: number | undefined;
            deductions?: number | undefined;
        }, {
            basic: number;
            allowances?: number | undefined;
            deductions?: number | undefined;
        }>>;
        isClassTeacher: z.ZodOptional<z.ZodBoolean>;
        classTeacherFor: z.ZodOptional<z.ZodObject<{
            grade: z.ZodNumber;
            section: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            grade: number;
            section: string;
        }, {
            grade: number;
            section: string;
        }>>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        firstName?: string | undefined;
        lastName?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
        address?: {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        } | undefined;
        grades?: number[] | undefined;
        sections?: string[] | undefined;
        bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
        dob?: string | undefined;
        employeeId?: string | undefined;
        subjects?: string[] | undefined;
        designation?: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant" | undefined;
        joinDate?: string | undefined;
        qualifications?: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[] | undefined;
        experience?: {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        } | undefined;
        emergencyContact?: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        } | undefined;
        salary?: {
            basic: number;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        isClassTeacher?: boolean | undefined;
        classTeacherFor?: {
            grade: number;
            section: string;
        } | undefined;
    }, {
        firstName?: string | undefined;
        lastName?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
        address?: {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        } | undefined;
        grades?: number[] | undefined;
        sections?: string[] | undefined;
        bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
        dob?: string | undefined;
        employeeId?: string | undefined;
        subjects?: string[] | undefined;
        designation?: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant" | undefined;
        joinDate?: string | undefined;
        qualifications?: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[] | undefined;
        experience?: {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        } | undefined;
        emergencyContact?: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        } | undefined;
        salary?: {
            basic: number;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        isClassTeacher?: boolean | undefined;
        classTeacherFor?: {
            grade: number;
            section: string;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        id: string;
    };
    body: {
        firstName?: string | undefined;
        lastName?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
        address?: {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        } | undefined;
        grades?: number[] | undefined;
        sections?: string[] | undefined;
        bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
        dob?: string | undefined;
        employeeId?: string | undefined;
        subjects?: string[] | undefined;
        designation?: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant" | undefined;
        joinDate?: string | undefined;
        qualifications?: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[] | undefined;
        experience?: {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        } | undefined;
        emergencyContact?: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        } | undefined;
        salary?: {
            basic: number;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        isClassTeacher?: boolean | undefined;
        classTeacherFor?: {
            grade: number;
            section: string;
        } | undefined;
    };
}, {
    params: {
        id: string;
    };
    body: {
        firstName?: string | undefined;
        lastName?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        isActive?: boolean | undefined;
        address?: {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        } | undefined;
        grades?: number[] | undefined;
        sections?: string[] | undefined;
        bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
        dob?: string | undefined;
        employeeId?: string | undefined;
        subjects?: string[] | undefined;
        designation?: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant" | undefined;
        joinDate?: string | undefined;
        qualifications?: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[] | undefined;
        experience?: {
            totalYears: number;
            previousSchools?: {
                position: string;
                schoolName: string;
                duration: string;
                fromDate: string;
                toDate: string;
            }[] | undefined;
        } | undefined;
        emergencyContact?: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        } | undefined;
        salary?: {
            basic: number;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        isClassTeacher?: boolean | undefined;
        classTeacherFor?: {
            grade: number;
            section: string;
        } | undefined;
    };
}>;
declare const getTeacherValidationSchema: z.ZodObject<{
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
declare const deleteTeacherValidationSchema: z.ZodObject<{
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
declare const getTeachersValidationSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
        limit: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>>;
        schoolId: z.ZodOptional<z.ZodString>;
        subject: z.ZodOptional<z.ZodString>;
        grade: z.ZodOptional<z.ZodEffects<z.ZodEffects<z.ZodString, number, string>, number, string>>;
        designation: z.ZodOptional<z.ZodEnum<["Principal", "Vice Principal", "Head Teacher", "Senior Teacher", "Teacher", "Assistant Teacher", "Subject Coordinator", "Sports Teacher", "Music Teacher", "Art Teacher", "Librarian", "Lab Assistant"]>>;
        isActive: z.ZodOptional<z.ZodEnum<["true", "false", "all"]>>;
        isClassTeacher: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
        search: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodDefault<z.ZodOptional<z.ZodEnum<["firstName", "lastName", "teacherId", "designation", "joinDate", "experience.totalYears"]>>>;
        sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        sortBy: "firstName" | "lastName" | "teacherId" | "designation" | "joinDate" | "experience.totalYears";
        sortOrder: "asc" | "desc";
        schoolId?: string | undefined;
        isActive?: "false" | "all" | "true" | undefined;
        search?: string | undefined;
        grade?: number | undefined;
        designation?: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant" | undefined;
        isClassTeacher?: "false" | "true" | undefined;
        subject?: string | undefined;
    }, {
        schoolId?: string | undefined;
        isActive?: "false" | "all" | "true" | undefined;
        search?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: "firstName" | "lastName" | "teacherId" | "designation" | "joinDate" | "experience.totalYears" | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        grade?: string | undefined;
        designation?: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant" | undefined;
        isClassTeacher?: "false" | "true" | undefined;
        subject?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        sortBy: "firstName" | "lastName" | "teacherId" | "designation" | "joinDate" | "experience.totalYears";
        sortOrder: "asc" | "desc";
        schoolId?: string | undefined;
        isActive?: "false" | "all" | "true" | undefined;
        search?: string | undefined;
        grade?: number | undefined;
        designation?: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant" | undefined;
        isClassTeacher?: "false" | "true" | undefined;
        subject?: string | undefined;
    };
}, {
    query: {
        schoolId?: string | undefined;
        isActive?: "false" | "all" | "true" | undefined;
        search?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: "firstName" | "lastName" | "teacherId" | "designation" | "joinDate" | "experience.totalYears" | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        grade?: string | undefined;
        designation?: "Teacher" | "Principal" | "Vice Principal" | "Head Teacher" | "Senior Teacher" | "Assistant Teacher" | "Subject Coordinator" | "Sports Teacher" | "Music Teacher" | "Art Teacher" | "Librarian" | "Lab Assistant" | undefined;
        isClassTeacher?: "false" | "true" | undefined;
        subject?: string | undefined;
    };
}>;
declare const uploadPhotosValidationSchema: z.ZodObject<{
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
declare const deletePhotoValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        teacherId: z.ZodString;
        photoId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        teacherId: string;
        photoId: string;
    }, {
        teacherId: string;
        photoId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        teacherId: string;
        photoId: string;
    };
}, {
    params: {
        teacherId: string;
        photoId: string;
    };
}>;
declare const getTeachersBySubjectSchema: z.ZodObject<{
    params: z.ZodObject<{
        schoolId: z.ZodString;
        subject: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        schoolId: string;
        subject: string;
    }, {
        schoolId: string;
        subject: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        schoolId: string;
        subject: string;
    };
}, {
    params: {
        schoolId: string;
        subject: string;
    };
}>;
declare const getTeachersStatsValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        schoolId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        schoolId: string;
    }, {
        schoolId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        schoolId: string;
    };
}, {
    params: {
        schoolId: string;
    };
}>;
declare const issuePunishmentValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        studentIds: z.ZodArray<z.ZodString, "many">;
        punishmentType: z.ZodString;
        severity: z.ZodEnum<["low", "medium", "high", "critical"]>;
        category: z.ZodEnum<["behavior", "attendance", "academic", "discipline", "uniform", "other"]>;
        title: z.ZodString;
        description: z.ZodString;
        reason: z.ZodString;
        actionTaken: z.ZodOptional<z.ZodString>;
        incidentDate: z.ZodOptional<z.ZodString>;
        witnesses: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        urgentNotification: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        followUpRequired: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        isAppealable: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        appealDeadline: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        description: string;
        reason: string;
        title: string;
        studentIds: string[];
        severity: "critical" | "low" | "medium" | "high";
        category: "academic" | "other" | "behavior" | "attendance" | "discipline" | "uniform";
        followUpRequired: boolean;
        witnesses: string[];
        isAppealable: boolean;
        punishmentType: string;
        urgentNotification: boolean;
        incidentDate?: string | undefined;
        actionTaken?: string | undefined;
        appealDeadline?: string | undefined;
    }, {
        description: string;
        reason: string;
        title: string;
        studentIds: string[];
        severity: "critical" | "low" | "medium" | "high";
        category: "academic" | "other" | "behavior" | "attendance" | "discipline" | "uniform";
        punishmentType: string;
        incidentDate?: string | undefined;
        actionTaken?: string | undefined;
        followUpRequired?: boolean | undefined;
        witnesses?: string[] | undefined;
        isAppealable?: boolean | undefined;
        appealDeadline?: string | undefined;
        urgentNotification?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        description: string;
        reason: string;
        title: string;
        studentIds: string[];
        severity: "critical" | "low" | "medium" | "high";
        category: "academic" | "other" | "behavior" | "attendance" | "discipline" | "uniform";
        followUpRequired: boolean;
        witnesses: string[];
        isAppealable: boolean;
        punishmentType: string;
        urgentNotification: boolean;
        incidentDate?: string | undefined;
        actionTaken?: string | undefined;
        appealDeadline?: string | undefined;
    };
}, {
    body: {
        description: string;
        reason: string;
        title: string;
        studentIds: string[];
        severity: "critical" | "low" | "medium" | "high";
        category: "academic" | "other" | "behavior" | "attendance" | "discipline" | "uniform";
        punishmentType: string;
        incidentDate?: string | undefined;
        actionTaken?: string | undefined;
        followUpRequired?: boolean | undefined;
        witnesses?: string[] | undefined;
        isAppealable?: boolean | undefined;
        appealDeadline?: string | undefined;
        urgentNotification?: boolean | undefined;
    };
}>;
declare const resolveDisciplinaryActionValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        actionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        actionId: string;
    }, {
        actionId: string;
    }>;
    body: z.ZodObject<{
        resolutionNotes: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        resolutionNotes: string;
    }, {
        resolutionNotes: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        actionId: string;
    };
    body: {
        resolutionNotes: string;
    };
}, {
    params: {
        actionId: string;
    };
    body: {
        resolutionNotes: string;
    };
}>;
declare const addDisciplinaryActionCommentValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        actionId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        actionId: string;
    }, {
        actionId: string;
    }>;
    body: z.ZodObject<{
        comment: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        comment: string;
    }, {
        comment: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        actionId: string;
    };
    body: {
        comment: string;
    };
}, {
    params: {
        actionId: string;
    };
    body: {
        comment: string;
    };
}>;
export { createTeacherValidationSchema, updateTeacherValidationSchema, getTeacherValidationSchema, deleteTeacherValidationSchema, getTeachersValidationSchema, uploadPhotosValidationSchema, deletePhotoValidationSchema, getTeachersBySubjectSchema, getTeachersStatsValidationSchema, issuePunishmentValidationSchema, resolveDisciplinaryActionValidationSchema, addDisciplinaryActionCommentValidationSchema, };
//# sourceMappingURL=teacher.validation.d.ts.map