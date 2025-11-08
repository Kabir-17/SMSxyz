"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackAggregatedMetrics = exports.metricsAggregator = exports.trackMemoryUsage = exports.trackRoutePerformance = exports.trackSchoolMetrics = void 0;
const trackSchoolMetrics = (req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const resolvedSchoolId = res.locals?.schoolId?.toString() ||
            req.schoolContextId ||
            req.user?.schoolId ||
            req.school?._id?.toString() ||
            'unauthenticated';
        const metric = {
            timestamp: new Date(),
            schoolId: resolvedSchoolId,
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            durationMs: duration,
            userAgent: req.get('user-agent') || 'unknown',
            ip: req.ip || 'unknown',
        };
        if (duration > 2000) {
            console.warn(`[SLOW QUERY] School ${resolvedSchoolId}: ${req.method} ${req.path} took ${duration}ms`, {
                schoolId: resolvedSchoolId,
                path: metric.path,
                duration: metric.durationMs,
                statusCode: metric.statusCode,
            });
        }
        if (duration > 5000) {
            console.error(`[CRITICAL SLOW QUERY] School ${resolvedSchoolId}: ${req.method} ${req.path} took ${duration}ms`, {
                schoolId: resolvedSchoolId,
                path: metric.path,
                duration: metric.durationMs,
                statusCode: metric.statusCode,
            });
        }
        if (res.statusCode >= 500) {
            console.error(`[SERVER ERROR] School ${resolvedSchoolId}: ${req.method} ${req.path} returned ${res.statusCode}`, {
                schoolId: resolvedSchoolId,
                path: metric.path,
                duration: metric.durationMs,
                statusCode: metric.statusCode,
            });
        }
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API] ${metric.method} ${metric.path} - ${metric.statusCode} - ${metric.durationMs}ms - School: ${metric.schoolId}`);
        }
    });
    next();
};
exports.trackSchoolMetrics = trackSchoolMetrics;
const trackRoutePerformance = (routeName) => {
    return (req, res, next) => {
        const startTime = Date.now();
        const schoolId = req.user?.schoolId || req.school?._id;
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            console.log(`[ROUTE] ${routeName} - School ${schoolId} - ${duration}ms - ${res.statusCode}`);
            if (duration > 1000) {
                console.warn(`[ROUTE WARNING] ${routeName} took ${duration}ms for school ${schoolId}`);
            }
        });
        next();
    };
};
exports.trackRoutePerformance = trackRoutePerformance;
const trackMemoryUsage = (req, res, next) => {
    const schoolId = req.user?.schoolId || req.school?._id;
    res.on('finish', () => {
        const memoryUsage = process.memoryUsage();
        const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
        const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
        if (heapUsedMB > 1024) {
            console.warn(`[MEMORY WARNING] High memory usage: ${heapUsedMB}MB / ${heapTotalMB}MB`, {
                schoolId: schoolId?.toString() || 'unknown',
                path: req.path,
                heapUsed: heapUsedMB,
                heapTotal: heapTotalMB,
            });
        }
    });
    next();
};
exports.trackMemoryUsage = trackMemoryUsage;
class MetricsAggregator {
    constructor() {
        this.metrics = new Map();
    }
    track(schoolId, duration, isError = false) {
        const current = this.metrics.get(schoolId) || { count: 0, totalDuration: 0, errors: 0 };
        current.count++;
        current.totalDuration += duration;
        if (isError)
            current.errors++;
        this.metrics.set(schoolId, current);
    }
    getStats(schoolId) {
        const data = this.metrics.get(schoolId);
        if (!data)
            return null;
        return {
            requestCount: data.count,
            averageDuration: Math.round(data.totalDuration / data.count),
            errorCount: data.errors,
            errorRate: ((data.errors / data.count) * 100).toFixed(2) + '%',
        };
    }
    getAllStats() {
        const stats = [];
        this.metrics.forEach((data, schoolId) => {
            stats.push({
                schoolId,
                requestCount: data.count,
                averageDuration: Math.round(data.totalDuration / data.count),
                errorCount: data.errors,
                errorRate: ((data.errors / data.count) * 100).toFixed(2) + '%',
            });
        });
        return stats.sort((a, b) => b.requestCount - a.requestCount);
    }
    reset() {
        this.metrics.clear();
    }
}
exports.metricsAggregator = new MetricsAggregator();
const trackAggregatedMetrics = (req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const isError = res.statusCode >= 500;
        const resolvedSchoolId = res.locals?.schoolId?.toString() ||
            req.schoolContextId ||
            req.user?.schoolId ||
            req.school?._id?.toString();
        if (resolvedSchoolId) {
            exports.metricsAggregator.track(resolvedSchoolId, duration, isError);
        }
    });
    next();
};
exports.trackAggregatedMetrics = trackAggregatedMetrics;
//# sourceMappingURL=schoolMetrics.js.map