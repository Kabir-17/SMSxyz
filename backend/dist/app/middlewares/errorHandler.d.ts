import { Request, Response, NextFunction } from 'express';
export declare const asyncErrorHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare const globalErrorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
export declare const notFoundHandler: (req: Request, res: Response, next: NextFunction) => void;
export declare const timeoutHandler: (timeout?: number) => (req: Request, res: Response, next: NextFunction) => void;
export declare const rateLimitHandler: (req: Request, res: Response) => void;
export declare const corsErrorHandler: (req: Request, res: Response, next: NextFunction) => void;
export declare const securityHeaders: (req: Request, res: Response, next: NextFunction) => void;
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const formatValidationError: (errors: any[]) => string;
export declare const handleDatabaseConnectionError: () => void;
export declare const gracefulShutdown: (server: any) => void;
export declare const healthCheck: (req: Request, res: Response) => void;
declare const _default: {
    globalErrorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
    notFoundHandler: (req: Request, res: Response, next: NextFunction) => void;
    timeoutHandler: (timeout?: number) => (req: Request, res: Response, next: NextFunction) => void;
    rateLimitHandler: (req: Request, res: Response) => void;
    corsErrorHandler: (req: Request, res: Response, next: NextFunction) => void;
    securityHeaders: (req: Request, res: Response, next: NextFunction) => void;
    requestLogger: (req: Request, res: Response, next: NextFunction) => void;
    asyncErrorHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
    formatValidationError: (errors: any[]) => string;
    handleDatabaseConnectionError: () => void;
    gracefulShutdown: (server: any) => void;
    healthCheck: (req: Request, res: Response) => void;
};
export default _default;
//# sourceMappingURL=errorHandler.d.ts.map