declare class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    constructor(statusCode: number, message: string, stack?: string);
}
export { AppError };
//# sourceMappingURL=AppError.d.ts.map