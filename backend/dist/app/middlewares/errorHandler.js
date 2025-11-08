"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = exports.gracefulShutdown = exports.handleDatabaseConnectionError = exports.formatValidationError = exports.requestLogger = exports.securityHeaders = exports.corsErrorHandler = exports.rateLimitHandler = exports.timeoutHandler = exports.notFoundHandler = exports.globalErrorHandler = exports.asyncErrorHandler = void 0;
const AppError_1 = require("../errors/AppError");
const config_1 = __importDefault(require("../config"));
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError_1.AppError(400, message);
};
const handleDuplicateFieldsDB = (err) => {
    const duplicateFields = Object.keys(err.keyValue).join(', ');
    const message = `Duplicate field value(s): ${duplicateFields}. Please use different value(s)`;
    return new AppError_1.AppError(400, message);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => {
        if (el && typeof el === 'object' && el.message) {
            return el.message;
        }
        return el ? el.toString() : 'Unknown validation error';
    });
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError_1.AppError(400, message);
};
const handleJWTError = () => new AppError_1.AppError(401, 'Invalid token. Please log in again!');
const handleJWTExpiredError = () => new AppError_1.AppError(401, 'Your token has expired! Please log in again.');
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            timestamp: new Date().toISOString(),
        });
    }
    else {
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
            timestamp: new Date().toISOString(),
        });
    }
};
const logError = (err, req) => {
    const errorLog = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined,
        params: req.params,
        query: req.query,
        userId: req.user?.id,
        error: {
            name: err.name,
            message: err.message,
            statusCode: err.statusCode,
            status: err.status,
            isOperational: err.isOperational,
            stack: config_1.default.node_env === 'development' ? err.stack : undefined,
        },
    };
    console.error('ERROR LOG:', JSON.stringify(errorLog, null, 2));
};
const asyncErrorHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.asyncErrorHandler = asyncErrorHandler;
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    logError(err, req);
    if (config_1.default.node_env === 'development') {
        sendErrorDev(err, res);
    }
    else {
        let error = { ...err };
        error.message = err.message;
        if (err.name === 'CastError')
            error = handleCastErrorDB(err);
        if (err.code === 11000)
            error = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (err.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
const notFoundHandler = (req, res, next) => {
    const message = `Can't find ${req.originalUrl} on this server!`;
    next(new AppError_1.AppError(404, message));
};
exports.notFoundHandler = notFoundHandler;
const timeoutHandler = (timeout = 30000) => {
    return (req, res, next) => {
        res.setTimeout(timeout, () => {
            const err = new AppError_1.AppError(408, 'Request timeout');
            next(err);
        });
        next();
    };
};
exports.timeoutHandler = timeoutHandler;
const rateLimitHandler = (req, res) => {
    res.status(429).json({
        status: 'error',
        message: 'Too many requests from this IP, please try again later.',
        timestamp: new Date().toISOString(),
    });
};
exports.rateLimitHandler = rateLimitHandler;
const corsErrorHandler = (req, res, next) => {
    const origin = req.get('Origin');
    const allowedOrigins = config_1.default.allowed_origins?.split(',') || ['http://localhost:3000'];
    if (origin && !allowedOrigins.includes(origin)) {
        return next(new AppError_1.AppError(403, `CORS policy: Origin ${origin} is not allowed`));
    }
    next();
};
exports.corsErrorHandler = corsErrorHandler;
const securityHeaders = (req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (config_1.default.node_env === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
};
exports.securityHeaders = securityHeaders;
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const requestLog = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id,
    };
    if (config_1.default.node_env === 'development') {
    }
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const responseLog = {
            ...requestLog,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        };
        if (config_1.default.node_env === 'development') {
        }
    });
    next();
};
exports.requestLogger = requestLogger;
const formatValidationError = (errors) => {
    return errors
        .map(err => {
        if (err.path && err.message) {
            return `${err.path}: ${err.message}`;
        }
        return err.message || err.toString();
    })
        .join(', ');
};
exports.formatValidationError = formatValidationError;
const handleDatabaseConnectionError = () => {
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        if (reason?.name === 'MongoError' || reason?.name === 'MongooseError') {
            console.error('Database connection error detected. Shutting down...');
            process.exit(1);
        }
    });
    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception:', err.name, err.message);
        console.error('Stack:', err.stack);
        process.exit(1);
    });
};
exports.handleDatabaseConnectionError = handleDatabaseConnectionError;
const gracefulShutdown = (server) => {
    const shutdown = (signal) => {
        server.close(() => {
            process.exit(0);
        });
        setTimeout(() => {
            process.exit(1);
        }, 10000);
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
};
exports.gracefulShutdown = gracefulShutdown;
const healthCheck = (req, res) => {
    const healthStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config_1.default.node_env,
        memory: process.memoryUsage(),
        version: process.version,
    };
    res.status(200).json(healthStatus);
};
exports.healthCheck = healthCheck;
exports.default = {
    globalErrorHandler: exports.globalErrorHandler,
    notFoundHandler: exports.notFoundHandler,
    timeoutHandler: exports.timeoutHandler,
    rateLimitHandler: exports.rateLimitHandler,
    corsErrorHandler: exports.corsErrorHandler,
    securityHeaders: exports.securityHeaders,
    requestLogger: exports.requestLogger,
    asyncErrorHandler: exports.asyncErrorHandler,
    formatValidationError: exports.formatValidationError,
    handleDatabaseConnectionError: exports.handleDatabaseConnectionError,
    gracefulShutdown: exports.gracefulShutdown,
    healthCheck: exports.healthCheck,
};
//# sourceMappingURL=errorHandler.js.map