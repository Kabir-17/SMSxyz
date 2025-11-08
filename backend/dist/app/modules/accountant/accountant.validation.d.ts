import { z } from 'zod';
declare const createAccountantValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        schoolId: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        employeeId: z.ZodOptional<z.ZodString>;
        department: z.ZodEnum<["Finance", "Payroll", "Accounts Payable", "Accounts Receivable", "Budget Management", "Financial Reporting", "Audit", "Tax", "General Accounting"]>;
        designation: z.ZodEnum<["Chief Financial Officer", "Finance Manager", "Chief Accountant", "Senior Accountant", "Accountant", "Junior Accountant", "Accounts Assistant", "Payroll Officer", "Financial Analyst", "Auditor"]>;
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
            previousOrganizations: z.ZodOptional<z.ZodArray<z.ZodObject<{
                organizationName: z.ZodString;
                position: z.ZodString;
                duration: z.ZodString;
                fromDate: z.ZodString;
                toDate: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }, {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            totalYears: number;
            previousOrganizations?: {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }[] | undefined;
        }, {
            totalYears: number;
            previousOrganizations?: {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
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
            allowances: z.ZodOptional<z.ZodNumber>;
            deductions: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        }, {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        }>>;
        responsibilities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        certifications: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        schoolId: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        address: {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        };
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        designation: "Accountant" | "Chief Financial Officer" | "Finance Manager" | "Chief Accountant" | "Senior Accountant" | "Junior Accountant" | "Accounts Assistant" | "Payroll Officer" | "Financial Analyst" | "Auditor";
        qualifications: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[];
        experience: {
            totalYears: number;
            previousOrganizations?: {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }[] | undefined;
        };
        emergencyContact: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        };
        department: "Finance" | "Payroll" | "Accounts Payable" | "Accounts Receivable" | "Budget Management" | "Financial Reporting" | "Audit" | "Tax" | "General Accounting";
        email?: string | undefined;
        phone?: string | undefined;
        employeeId?: string | undefined;
        joinDate?: string | undefined;
        salary?: {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        responsibilities?: string[] | undefined;
        certifications?: string[] | undefined;
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
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        designation: "Accountant" | "Chief Financial Officer" | "Finance Manager" | "Chief Accountant" | "Senior Accountant" | "Junior Accountant" | "Accounts Assistant" | "Payroll Officer" | "Financial Analyst" | "Auditor";
        qualifications: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[];
        experience: {
            totalYears: number;
            previousOrganizations?: {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }[] | undefined;
        };
        emergencyContact: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        };
        department: "Finance" | "Payroll" | "Accounts Payable" | "Accounts Receivable" | "Budget Management" | "Financial Reporting" | "Audit" | "Tax" | "General Accounting";
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
        responsibilities?: string[] | undefined;
        certifications?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        schoolId: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        address: {
            city: string;
            state: string;
            country: string;
            zipCode: string;
            street?: string | undefined;
        };
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        designation: "Accountant" | "Chief Financial Officer" | "Finance Manager" | "Chief Accountant" | "Senior Accountant" | "Junior Accountant" | "Accounts Assistant" | "Payroll Officer" | "Financial Analyst" | "Auditor";
        qualifications: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[];
        experience: {
            totalYears: number;
            previousOrganizations?: {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }[] | undefined;
        };
        emergencyContact: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        };
        department: "Finance" | "Payroll" | "Accounts Payable" | "Accounts Receivable" | "Budget Management" | "Financial Reporting" | "Audit" | "Tax" | "General Accounting";
        email?: string | undefined;
        phone?: string | undefined;
        employeeId?: string | undefined;
        joinDate?: string | undefined;
        salary?: {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        responsibilities?: string[] | undefined;
        certifications?: string[] | undefined;
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
        bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
        dob: string;
        designation: "Accountant" | "Chief Financial Officer" | "Finance Manager" | "Chief Accountant" | "Senior Accountant" | "Junior Accountant" | "Accounts Assistant" | "Payroll Officer" | "Financial Analyst" | "Auditor";
        qualifications: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[];
        experience: {
            totalYears: number;
            previousOrganizations?: {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }[] | undefined;
        };
        emergencyContact: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        };
        department: "Finance" | "Payroll" | "Accounts Payable" | "Accounts Receivable" | "Budget Management" | "Financial Reporting" | "Audit" | "Tax" | "General Accounting";
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
        responsibilities?: string[] | undefined;
        certifications?: string[] | undefined;
    };
}>;
declare const updateAccountantValidationSchema: z.ZodObject<{
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
        employeeId: z.ZodOptional<z.ZodString>;
        department: z.ZodOptional<z.ZodEnum<["Finance", "Payroll", "Accounts Payable", "Accounts Receivable", "Budget Management", "Financial Reporting", "Audit", "Tax", "General Accounting"]>>;
        designation: z.ZodOptional<z.ZodEnum<["Chief Financial Officer", "Finance Manager", "Chief Accountant", "Senior Accountant", "Accountant", "Junior Accountant", "Accounts Assistant", "Payroll Officer", "Financial Analyst", "Auditor"]>>;
        bloodGroup: z.ZodOptional<z.ZodEnum<["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]>>;
        dob: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        joinDate: z.ZodOptional<z.ZodString>;
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
            previousOrganizations: z.ZodOptional<z.ZodArray<z.ZodObject<{
                organizationName: z.ZodString;
                position: z.ZodString;
                duration: z.ZodString;
                fromDate: z.ZodString;
                toDate: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }, {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            totalYears: number;
            previousOrganizations?: {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }[] | undefined;
        }, {
            totalYears: number;
            previousOrganizations?: {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
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
            basic: z.ZodOptional<z.ZodNumber>;
            allowances: z.ZodOptional<z.ZodNumber>;
            deductions: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        }, {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        }>>;
        responsibilities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        certifications: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
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
        bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
        dob?: string | undefined;
        employeeId?: string | undefined;
        designation?: "Accountant" | "Chief Financial Officer" | "Finance Manager" | "Chief Accountant" | "Senior Accountant" | "Junior Accountant" | "Accounts Assistant" | "Payroll Officer" | "Financial Analyst" | "Auditor" | undefined;
        joinDate?: string | undefined;
        qualifications?: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[] | undefined;
        experience?: {
            totalYears: number;
            previousOrganizations?: {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }[] | undefined;
        } | undefined;
        emergencyContact?: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        } | undefined;
        salary?: {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        department?: "Finance" | "Payroll" | "Accounts Payable" | "Accounts Receivable" | "Budget Management" | "Financial Reporting" | "Audit" | "Tax" | "General Accounting" | undefined;
        responsibilities?: string[] | undefined;
        certifications?: string[] | undefined;
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
        bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
        dob?: string | undefined;
        employeeId?: string | undefined;
        designation?: "Accountant" | "Chief Financial Officer" | "Finance Manager" | "Chief Accountant" | "Senior Accountant" | "Junior Accountant" | "Accounts Assistant" | "Payroll Officer" | "Financial Analyst" | "Auditor" | undefined;
        joinDate?: string | undefined;
        qualifications?: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[] | undefined;
        experience?: {
            totalYears: number;
            previousOrganizations?: {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }[] | undefined;
        } | undefined;
        emergencyContact?: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        } | undefined;
        salary?: {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        department?: "Finance" | "Payroll" | "Accounts Payable" | "Accounts Receivable" | "Budget Management" | "Financial Reporting" | "Audit" | "Tax" | "General Accounting" | undefined;
        responsibilities?: string[] | undefined;
        certifications?: string[] | undefined;
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
        bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
        dob?: string | undefined;
        employeeId?: string | undefined;
        designation?: "Accountant" | "Chief Financial Officer" | "Finance Manager" | "Chief Accountant" | "Senior Accountant" | "Junior Accountant" | "Accounts Assistant" | "Payroll Officer" | "Financial Analyst" | "Auditor" | undefined;
        joinDate?: string | undefined;
        qualifications?: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[] | undefined;
        experience?: {
            totalYears: number;
            previousOrganizations?: {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }[] | undefined;
        } | undefined;
        emergencyContact?: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        } | undefined;
        salary?: {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        department?: "Finance" | "Payroll" | "Accounts Payable" | "Accounts Receivable" | "Budget Management" | "Financial Reporting" | "Audit" | "Tax" | "General Accounting" | undefined;
        responsibilities?: string[] | undefined;
        certifications?: string[] | undefined;
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
        bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | undefined;
        dob?: string | undefined;
        employeeId?: string | undefined;
        designation?: "Accountant" | "Chief Financial Officer" | "Finance Manager" | "Chief Accountant" | "Senior Accountant" | "Junior Accountant" | "Accounts Assistant" | "Payroll Officer" | "Financial Analyst" | "Auditor" | undefined;
        joinDate?: string | undefined;
        qualifications?: {
            degree: string;
            institution: string;
            year: number;
            specialization?: string | undefined;
        }[] | undefined;
        experience?: {
            totalYears: number;
            previousOrganizations?: {
                position: string;
                duration: string;
                fromDate: string;
                toDate: string;
                organizationName: string;
            }[] | undefined;
        } | undefined;
        emergencyContact?: {
            phone: string;
            name: string;
            relationship: string;
            email?: string | undefined;
        } | undefined;
        salary?: {
            basic?: number | undefined;
            allowances?: number | undefined;
            deductions?: number | undefined;
        } | undefined;
        department?: "Finance" | "Payroll" | "Accounts Payable" | "Accounts Receivable" | "Budget Management" | "Financial Reporting" | "Audit" | "Tax" | "General Accounting" | undefined;
        responsibilities?: string[] | undefined;
        certifications?: string[] | undefined;
    };
}>;
declare const getAccountantValidationSchema: z.ZodObject<{
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
declare const deleteAccountantValidationSchema: z.ZodObject<{
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
declare const getAccountantsValidationSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
        department: z.ZodOptional<z.ZodString>;
        designation: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
        isActive: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    }, "strip", z.ZodTypeAny, {
        isActive?: "false" | "true" | undefined;
        search?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        designation?: string | undefined;
        department?: string | undefined;
    }, {
        isActive?: "false" | "true" | undefined;
        search?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        designation?: string | undefined;
        department?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        isActive?: "false" | "true" | undefined;
        search?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        designation?: string | undefined;
        department?: string | undefined;
    };
}, {
    query: {
        isActive?: "false" | "true" | undefined;
        search?: string | undefined;
        limit?: string | undefined;
        page?: string | undefined;
        sortBy?: string | undefined;
        sortOrder?: "asc" | "desc" | undefined;
        designation?: string | undefined;
        department?: string | undefined;
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
        accountantId: z.ZodString;
        photoId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        accountantId: string;
        photoId: string;
    }, {
        accountantId: string;
        photoId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        accountantId: string;
        photoId: string;
    };
}, {
    params: {
        accountantId: string;
        photoId: string;
    };
}>;
declare const getAccountantsByDepartmentSchema: z.ZodObject<{
    params: z.ZodObject<{
        schoolId: z.ZodString;
        department: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        schoolId: string;
        department: string;
    }, {
        schoolId: string;
        department: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        schoolId: string;
        department: string;
    };
}, {
    params: {
        schoolId: string;
        department: string;
    };
}>;
declare const getAccountantsStatsValidationSchema: z.ZodObject<{
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
export { createAccountantValidationSchema, updateAccountantValidationSchema, getAccountantValidationSchema, deleteAccountantValidationSchema, getAccountantsValidationSchema, uploadPhotosValidationSchema, deletePhotoValidationSchema, getAccountantsByDepartmentSchema, getAccountantsStatsValidationSchema, };
//# sourceMappingURL=accountant.validation.d.ts.map