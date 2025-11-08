"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const config_1 = __importDefault(require("../config"));
const AppError_1 = require("../errors/AppError");
const handleCastError_1 = require("../errors/handleCastError");
const handleDuplicateError_1 = require("../errors/handleDuplicateError");
const handleValidationError_1 = require("../errors/handleValidationError");
const handleZodErrors_1 = require("../errors/handleZodErrors");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorSources = [
        {
            path: "",
            message: "Something went wrong!",
        },
    ];
    if (err?.name === "ValidationError") {
        const handled = (0, handleValidationError_1.handleValidationError)(err);
        const firstErrorMsg = handled.errorSources?.[0]?.message || handled.message;
        return res.status(handled.statusCode).json({
            success: false,
            message: firstErrorMsg,
            errorSources: handled.errorSources,
            err,
            stack: err.stack,
        });
    }
    else if (err?.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.handleCastError)(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
    }
    else if (err?.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handleDuplicateError)(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
    }
    else if (err?.name === "ZodError") {
        const simplifiedError = (0, handleZodErrors_1.handleZodErrors)(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
    }
    else if (err instanceof AppError_1.AppError) {
        statusCode = err?.statusCode;
        message = err.message;
        errorSources = [
            {
                path: "",
                message: err?.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: "",
                message: err?.message,
            },
        ];
    }
    if (config_1.default.node_env === "development") {
        console.error("🚨 Error Details:", {
            statusCode,
            message,
            errorSources,
            stack: err?.stack,
        });
    }
    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err,
        stack: config_1.default.node_env === "development" ? err?.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map