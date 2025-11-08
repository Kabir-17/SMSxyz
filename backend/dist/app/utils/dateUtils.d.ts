export declare function getSchoolDate(date: Date, timezone?: string): {
    date: Date;
    dateKey: string;
};
export declare function parseSchoolDate(dateString: string, timezone?: string): Date;
export declare function getCurrentSchoolDate(timezone?: string): {
    date: Date;
    dateKey: string;
};
export declare function formatSchoolDate(date: Date, formatStr?: string, timezone?: string): string;
export declare function isValidTimezone(timezone: string): boolean;
export declare function normaliseDateKey(date: Date): {
    date: Date;
    dateKey: string;
};
//# sourceMappingURL=dateUtils.d.ts.map