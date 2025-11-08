"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = void 0;
const catchAsync_1 = require("../utils/catchAsync");
exports.parseBody = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    if (req.body && req.body.data) {
        try {
            req.body = JSON.parse(req.body.data);
        }
        catch (error) {
        }
    }
    else if (req.body) {
        const body = req.body;
        const parsedBody = {};
        for (const [key, value] of Object.entries(body)) {
            if (key.includes("[") && key.includes("]")) {
                const match = key.match(/^([^[]+)\[([^\]]+)\]$/);
                if (match) {
                    const [, parentKey, childKey] = match;
                    if (!parsedBody[parentKey]) {
                        parsedBody[parentKey] = {};
                    }
                    parsedBody[parentKey][childKey] = value;
                }
            }
            else {
                parsedBody[key] = value;
            }
        }
        req.body = { ...body, ...parsedBody };
    }
    next();
});
//# sourceMappingURL=bodyParser.js.map