declare class FeeReportService {
    getFinancialOverview(schoolId: string, academicYear: string, startDate?: Date, endDate?: Date): Promise<{
        overview: {
            totalExpectedRevenue: any;
            totalCollected: any;
            totalDue: any;
            totalWaived: any;
            totalDefaulters: number;
            collectionPercentage: number;
        };
        monthlyBreakdown: any[];
        gradeWiseBreakdown: any[];
        recentTransactions: (import("mongoose").Document<unknown, {}, import("./fee.interface").IFeeTransaction, {}, {}> & import("./fee.interface").IFeeTransaction & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getDefaultersReport(schoolId: string, options?: {
        grade?: string;
        minAmount?: number;
        minDays?: number;
        limit?: number;
    }): Promise<{
        defaulters: (import("mongoose").Document<unknown, {}, import("./fee.interface").IFeeDefaulter, {}, {}> & import("./fee.interface").IFeeDefaulter & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        statistics: any;
        criticalDefaulters: number;
    }>;
    getCollectionByCollector(schoolId: string, startDate: Date, endDate: Date): Promise<any[]>;
    getPaymentTrends(schoolId: string, academicYear: string, groupBy?: "month" | "week" | "day"): Promise<any[]>;
    getFeeCollectionRate(schoolId: string, academicYear: string): Promise<{
        totalStudents: number;
        totalExpected: number;
        totalCollected: number;
        totalDue: number;
        collectionRate: number;
        statusBreakdown: {
            paid: number;
            partial: number;
            pending: number;
            overdue: number;
        };
    }>;
    getMonthlyCollectionComparison(schoolId: string, currentYear: string, previousYear: string): Promise<{
        currentYear: any[];
        previousYear: any[];
        comparison: {
            month: any;
            currentYearAmount: any;
            previousYearAmount: any;
            growth: number;
        }[];
    }>;
    exportTransactionsCSV(schoolId: string, startDate: Date, endDate: Date): Promise<{
        transactionId: any;
        receiptNumber: any;
        date: any;
        studentId: any;
        studentName: string;
        grade: any;
        type: any;
        amount: any;
        paymentMethod: any;
        collectedBy: any;
        status: any;
        remarks: any;
    }[]>;
}
declare const _default: FeeReportService;
export default _default;
//# sourceMappingURL=feeReport.service.d.ts.map