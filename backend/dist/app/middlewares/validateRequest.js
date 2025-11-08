"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const validateRequest = (schema) => {
    return (0, catchAsync_1.catchAsync)(async (req, res, next) => {
        const parsedData = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
            cookies: req.cookies,
        });
        if (parsedData.body !== undefined)
            req.body = parsedData.body;
        if (parsedData.query !== undefined)
            req.query = parsedData.query;
        if (parsedData.params !== undefined)
            req.params = parsedData.params;
        if (parsedData.cookies !== undefined)
            req.cookies = parsedData.cookies;
        next();
    });
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map