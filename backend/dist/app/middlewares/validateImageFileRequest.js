"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = require("../utils/catchAsync");
const validateImageFileRequest = (schema) => {
    return (0, catchAsync_1.catchAsync)(async (req, res, next) => {
        const parsedFile = await schema.parseAsync({
            files: req.files,
        });
        req.files = parsedFile.files;
        next();
    });
};
exports.default = validateImageFileRequest;
//# sourceMappingURL=validateImageFileRequest.js.map