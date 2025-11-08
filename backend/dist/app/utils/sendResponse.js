"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    const responseData = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || undefined,
        data: data.data,
    };
    if (data.meta) {
        responseData.meta = data.meta;
    }
    res.status(data.statusCode).json(responseData);
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=sendResponse.js.map