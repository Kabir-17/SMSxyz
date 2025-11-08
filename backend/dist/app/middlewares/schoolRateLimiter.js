"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictRateLimiter = exports.schoolRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.schoolRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200,
    keyGenerator: (req) => {
        const contextId = req?.schoolContextId;
        if (contextId) {
            return `school:${contextId}`;
        }
        const schoolId = req.user?.schoolId || req.school?._id;
        if (schoolId) {
            return `school:${schoolId}`;
        }
        return `ip:${req.ip}`;
    },
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests from your school. Please try again later.',
        retryAfter: 900,
    },
    skip: (req) => {
        const path = req.path;
        return path === '/health' || path === '/api/status' || path === '/';
    },
    handler: (req, res) => {
        console.warn(`[RateLimit] School rate limit exceeded: ${req.path}`, {
            schoolId: req.user?.schoolId || req.school?._id || 'unknown',
            ip: req.ip,
            path: req.path,
        });
        res.status(429).json({
            success: false,
            message: 'Too many requests from your school. Please try again later.',
            retryAfter: 900,
        });
    },
});
exports.strictRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    keyGenerator: (req) => {
        const username = req.body?.username;
        if (username) {
            return `auth:${req.ip}:${username}`;
        }
        return `auth:${req.ip}`;
    },
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many authentication attempts. Please try again later.',
        retryAfter: 900,
    },
    handler: (req, res) => {
        console.warn(`[RateLimit] Strict rate limit exceeded (auth attempt)`, {
            ip: req.ip,
            username: req.body?.username,
            path: req.path,
        });
        res.status(429).json({
            success: false,
            message: 'Too many authentication attempts. Please try again in 15 minutes.',
            retryAfter: 900,
        });
    },
});
//# sourceMappingURL=schoolRateLimiter.js.map