"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const http_status_1 = __importDefault(require("http-status"));
const notFound = (req, res, next) => {
    return res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
        error: {
            statusCode: http_status_1.default.NOT_FOUND,
            path: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString(),
        },
    });
};
exports.notFound = notFound;
//# sourceMappingURL=notFound.js.map