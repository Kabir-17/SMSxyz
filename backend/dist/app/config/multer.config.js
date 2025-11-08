"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinaryUpload", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const index_1 = __importDefault(require("./index"));
cloudinary_1.v2.config({
    cloud_name: index_1.default.cloudinary_cloud_name,
    api_key: index_1.default.cloudinary_api_key,
    api_secret: index_1.default.cloudinary_api_secret,
});
const removeExtension = (filename) => {
    return filename.split(".").slice(0, -1).join(".");
};
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        public_id: (_req, file) => Math.random().toString(36).substring(2) +
            "-" +
            Date.now() +
            "-" +
            file.fieldname +
            "-" +
            removeExtension(file.originalname),
    },
});
exports.multerUpload = (0, multer_1.default)({ storage: storage });
//# sourceMappingURL=multer.config.js.map