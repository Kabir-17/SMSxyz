"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenExpiration = exports.verifyToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const generateAccessToken = (user) => {
    const payload = {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
        schoolId: user.schoolId?.toString() || 'system',
    };
    const options = {
        expiresIn: config_1.default.jwt_expires_in,
    };
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwt_secret, options);
};
exports.generateAccessToken = generateAccessToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
};
exports.verifyToken = verifyToken;
const getTokenExpiration = () => {
    const expiresIn = config_1.default.jwt_expires_in;
    const now = new Date();
    if (expiresIn.endsWith('h')) {
        const hours = parseInt(expiresIn.slice(0, -1));
        return new Date(now.getTime() + hours * 60 * 60 * 1000);
    }
    else if (expiresIn.endsWith('d')) {
        const days = parseInt(expiresIn.slice(0, -1));
        return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    }
    else if (expiresIn.endsWith('m')) {
        const minutes = parseInt(expiresIn.slice(0, -1));
        return new Date(now.getTime() + minutes * 60 * 1000);
    }
    else {
        return new Date(now.getTime() + 8 * 60 * 60 * 1000);
    }
};
exports.getTokenExpiration = getTokenExpiration;
//# sourceMappingURL=jwtUtils.js.map