import { TransactionType, TransactionStatus } from "./fee.interface";
declare class FeeTransactionService {
    getTransactionById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./fee.interface").IFeeTransaction, {}, {}> & import("./fee.interface").IFeeTransaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getTransactions(filters: {
        school?: string;
        student?: string;
        collectedBy?: string;
        transactionType?: TransactionType;
        status?: TransactionStatus;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
        skip?: number;
    }): Promise<{
        transactions: (import("mongoose").Document<unknown, {}, import("./fee.interface").IFeeTransaction, {}, {}> & import("./fee.interface").IFeeTransaction & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        pages: number;
    }>;
    cancelTransaction(transactionId: string, cancelledBy: string, reason: string): Promise<import("mongoose").Document<unknown, {}, import("./fee.interface").IFeeTransaction, {}, {}> & import("./fee.interface").IFeeTransaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createRefund(data: {
        studentId: string;
        studentFeeRecordId: string;
        schoolId: string;
        amount: number;
        refundedBy: string;
        reason: string;
        auditInfo?: {
            ipAddress?: string;
            deviceInfo?: string;
        };
    }): Promise<import("mongoose").Document<unknown, {}, import("./fee.interface").IFeeTransaction, {}, {}> & import("./fee.interface").IFeeTransaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getDailyCollectionSummary(schoolId: string, date: Date): Promise<any[]>;
    detectSuspiciousPatterns(schoolId: string, collectorId: string, timeWindowHours?: number): Promise<{
        hasSuspiciousPattern: boolean;
        duplicates: any[];
        totalTransactions: number;
    }>;
    getReceiptByTransactionId(transactionId: string): Promise<import("mongoose").Document<unknown, {}, import("./fee.interface").IFeeTransaction, {}, {}> & import("./fee.interface").IFeeTransaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getReceiptByReceiptNumber(receiptNumber: string): Promise<import("mongoose").Document<unknown, {}, import("./fee.interface").IFeeTransaction, {}, {}> & import("./fee.interface").IFeeTransaction & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getTransactionStatistics(schoolId: string, startDate: Date, endDate: Date): Promise<any[]>;
}
declare const _default: FeeTransactionService;
export default _default;
//# sourceMappingURL=feeTransaction.service.d.ts.map