import { Request, Response, NextFunction } from 'express';
export declare const trackSchoolMetrics: (req: Request, res: Response, next: NextFunction) => void;
export declare const trackRoutePerformance: (routeName: string) => (req: Request, res: Response, next: NextFunction) => void;
export declare const trackMemoryUsage: (req: Request, res: Response, next: NextFunction) => void;
declare class MetricsAggregator {
    private metrics;
    track(schoolId: string, duration: number, isError?: boolean): void;
    getStats(schoolId: string): {
        requestCount: number;
        averageDuration: number;
        errorCount: number;
        errorRate: string;
    } | null;
    getAllStats(): any[];
    reset(): void;
}
export declare const metricsAggregator: MetricsAggregator;
export declare const trackAggregatedMetrics: (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=schoolMetrics.d.ts.map