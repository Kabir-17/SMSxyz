import { Types } from "mongoose";
export declare enum FeeType {
    TUITION = "tuition",
    TRANSPORT = "transport",
    HOSTEL = "hostel",
    LIBRARY = "library",
    LAB = "lab",
    SPORTS = "sports",
    EXAM = "exam",
    ADMISSION = "admission",
    ANNUAL = "annual",
    OTHER = "other"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PARTIAL = "partial",
    PAID = "paid",
    OVERDUE = "overdue",
    WAIVED = "waived"
}
export declare enum PaymentMethod {
    CASH = "cash",
    BANK_TRANSFER = "bank_transfer",
    CHEQUE = "cheque",
    ONLINE = "online"
}
export declare enum TransactionType {
    PAYMENT = "payment",
    REFUND = "refund",
    WAIVER = "waiver",
    PENALTY = "penalty"
}
export declare enum TransactionStatus {
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum Month {
    JANUARY = 1,
    FEBRUARY = 2,
    MARCH = 3,
    APRIL = 4,
    MAY = 5,
    JUNE = 6,
    JULY = 7,
    AUGUST = 8,
    SEPTEMBER = 9,
    OCTOBER = 10,
    NOVEMBER = 11,
    DECEMBER = 12
}
export interface IFeeComponent {
    feeType: FeeType;
    amount: number;
    description?: string;
    isMandatory: boolean;
    isOneTime: boolean;
}
export interface IFeeStructure {
    _id?: Types.ObjectId;
    school: Types.ObjectId;
    grade: string;
    academicYear: string;
    feeComponents: IFeeComponent[];
    totalAmount: number;
    dueDate: number;
    lateFeePercentage: number;
    isActive: boolean;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    totalMonthlyFee?: number;
    totalOneTimeFee?: number;
    totalYearlyFee?: number;
    deactivate(updatedBy: string): Promise<IFeeStructure>;
    canModify(): boolean;
}
export interface IMonthlyPayment {
    month: Month;
    dueAmount: number;
    paidAmount: number;
    status: PaymentStatus;
    dueDate: Date;
    paidDate?: Date;
    lateFee?: number;
    waived?: boolean;
    waiverReason?: string;
    waiverBy?: Types.ObjectId;
    waiverDate?: Date;
}
export interface IOneTimeFeePayment {
    feeType: FeeType;
    dueAmount: number;
    paidAmount: number;
    status: PaymentStatus;
    dueDate: Date;
    paidDate?: Date;
    waived?: boolean;
    waiverReason?: string;
    waiverBy?: Types.ObjectId;
    waiverDate?: Date;
}
export interface IStudentFeeRecord {
    _id?: Types.ObjectId;
    student: Types.ObjectId;
    school: Types.ObjectId;
    grade: string;
    academicYear: string;
    feeStructure: Types.ObjectId;
    totalFeeAmount: number;
    totalPaidAmount: number;
    totalDueAmount: number;
    monthlyPayments: IMonthlyPayment[];
    oneTimeFees?: IOneTimeFeePayment[];
    status: PaymentStatus;
    createdAt?: Date;
    updatedAt?: Date;
    recordPayment(month: Month, amount: number): Promise<IStudentFeeRecord>;
    applyLateFee(month: Month, lateFeePercentage: number): Promise<IStudentFeeRecord>;
    waiveFee(month: Month, reason: string, waivedBy: string): Promise<IStudentFeeRecord>;
    getOverdueMonths(): Month[];
}
export interface IFeeTransaction {
    _id?: Types.ObjectId;
    transactionId: string;
    student: Types.ObjectId;
    studentFeeRecord: Types.ObjectId;
    school: Types.ObjectId;
    transactionType: TransactionType;
    amount: number;
    paymentMethod?: PaymentMethod;
    month?: Month;
    status: TransactionStatus;
    collectedBy: Types.ObjectId;
    remarks?: string;
    receiptNumber?: string;
    cancelledBy?: Types.ObjectId;
    cancelledAt?: Date;
    cancellationReason?: string;
    auditLog: {
        ipAddress?: string;
        deviceInfo?: string;
        timestamp: Date;
    };
    createdAt?: Date;
    updatedAt?: Date;
    cancel(cancelledBy: string, reason: string): Promise<IFeeTransaction>;
    canBeCancelled(): boolean;
}
export interface IFeeDefaulter {
    _id?: Types.ObjectId;
    student: Types.ObjectId;
    studentFeeRecord: Types.ObjectId;
    school: Types.ObjectId;
    grade: string;
    totalDueAmount: number;
    overdueMonths: Month[];
    daysSinceFirstDue: number;
    lastReminderDate?: Date;
    notificationCount: number;
    createdAt?: Date;
    updatedAt?: Date;
    recordReminder(): Promise<IFeeDefaulter>;
    isReminderDue(reminderIntervalDays: number): boolean;
}
export interface IFeeCollectionRequest {
    studentId: string;
    month: Month;
    amount: number;
    paymentMethod: PaymentMethod;
    remarks?: string;
    collectedBy: string;
}
export interface IFeeStructureCreateRequest {
    school: string;
    grade: string;
    academicYear: string;
    feeComponents: IFeeComponent[];
    dueDate: number;
    lateFeePercentage: number;
    createdBy: string;
}
export interface IFinancialOverview {
    totalCollected: number;
    totalDue: number;
    totalWaived: number;
    totalDefaulters: number;
    monthlyBreakdown: {
        month: string;
        collected: number;
        due: number;
    }[];
    gradeWiseBreakdown: {
        grade: string;
        collected: number;
        due: number;
        studentCount: number;
    }[];
    recentTransactions: IFeeTransaction[];
}
export interface IStudentFeeStatus {
    student: {
        _id: string;
        studentId: string;
        name: string;
        grade: string;
        rollNumber: string;
    };
    feeRecord: IStudentFeeRecord;
    upcomingDue?: {
        month: Month;
        amount: number;
        dueDate: Date;
    };
    recentTransactions: IFeeTransaction[];
}
export interface ITransactionCancellationRequest {
    transactionId: string;
    reason: string;
    cancelledBy: string;
}
export interface IBatchFeeWaiverRequest {
    studentIds: string[];
    month: Month;
    reason: string;
    waivedBy: string;
}
export interface IFeeTransactionModel {
    detectSuspiciousPatterns(schoolId: string, collectorId: string, timeWindowHours: number): Promise<{
        hasSuspiciousPattern: boolean;
        duplicates: any[];
        totalTransactions: number;
    }>;
    createPayment(data: any): Promise<IFeeTransaction>;
    createRefund(data: any): Promise<IFeeTransaction>;
    getDailyCollectionSummary(schoolId: string, date: Date): Promise<any>;
}
export interface IFeeDefaulterModel {
    syncDefaultersForSchool(schoolId: string): Promise<void>;
    getCriticalDefaulters(schoolId: string, minAmount: number, minDays: number): Promise<IFeeDefaulter[]>;
    getDefaultersByGrade(schoolId: string, grade: string): Promise<IFeeDefaulter[]>;
}
//# sourceMappingURL=fee.interface.d.ts.map