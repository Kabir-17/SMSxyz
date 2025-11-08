"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = exports.getAvailablePhotoSlots = exports.createSchoolFolderStructure = exports.deletePhotosFromCloudinary = exports.uploadPhotosToCloudinary = exports.generateCloudinaryFolderPath = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
const credentialGenerator_1 = require("./credentialGenerator");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const existingConfig = cloudinary_1.v2.config();
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_cloud_name || existingConfig.cloud_name,
    api_key: config_1.default.cloudinary_api_key || existingConfig.api_key,
    api_secret: config_1.default.cloudinary_api_secret || existingConfig.api_secret,
    timeout: config_1.default.cloudinary_upload_timeout,
});
const generateCloudinaryFolderPath = (schoolName, role, firstName, dob, bloodGroup, date, grade, section, entityId) => {
    const sanitizedSchoolName = schoolName
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("");
    const age = (0, credentialGenerator_1.calculateAge)(dob);
    const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "");
    const sanitizedFirstName = firstName.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (role === "student" && grade && section && entityId) {
        return `${sanitizedSchoolName}/Students/${role}@${sanitizedFirstName}@${age}@${grade}@${section}@${bloodGroup}@${entityId}`;
    }
    else if (role === "teacher" && entityId) {
        return `${sanitizedSchoolName}/Teachers/${role}@${sanitizedFirstName}@${age}@${bloodGroup}@${formattedDate}@${entityId}`;
    }
    throw new Error("Invalid role or missing required parameters for folder path generation");
};
exports.generateCloudinaryFolderPath = generateCloudinaryFolderPath;
const uploadPhotosToCloudinary = async (files, folderPath, _entityId) => {
    if (!files || files.length === 0) {
        throw new Error("No files provided for upload");
    }
    if (files.length > 8) {
        throw new Error("Maximum 8 photos allowed per upload");
    }
    const maxRetries = Math.max(1, config_1.default.cloudinary_upload_retries || 1);
    const concurrency = Math.max(1, config_1.default.cloudinary_upload_concurrency || 1);
    const results = [];
    const uploadedPublicIds = [];
    const uploadSingle = async (file, index) => {
        if (!file.mimetype.startsWith("image/")) {
            throw new Error(`File ${file.originalname} is not an image`);
        }
        if (file.size > 10 * 1024 * 1024) {
            throw new Error(`File ${file.originalname} exceeds 10MB limit`);
        }
        const photoNumber = index + 1;
        const public_id = `${folderPath}/${photoNumber}`;
        let attempt = 0;
        let lastError = null;
        while (attempt < maxRetries) {
            attempt++;
            try {
                const result = await cloudinary_1.v2.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`, {
                    public_id,
                    folder: folderPath,
                    resource_type: "image",
                    format: "jpg",
                    quality: "auto:good",
                    width: 800,
                    height: 800,
                    crop: "limit",
                    overwrite: true,
                    flags: "progressive",
                    timeout: config_1.default.cloudinary_upload_timeout,
                });
                results.push({
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                    photoNumber,
                    originalName: file.originalname,
                    size: result.bytes || file.size,
                });
                uploadedPublicIds.push(result.public_id);
                lastError = null;
                break;
            }
            catch (error) {
                lastError = error;
                const isTimeoutError = error?.http_code === 499 ||
                    error?.name === "TimeoutError" ||
                    /timeout/i.test(error?.message || "");
                if (isTimeoutError && attempt < maxRetries) {
                    const backoff = 500 * attempt;
                    console.warn(`Photo ${photoNumber} upload timed out (attempt ${attempt}). Retrying in ${backoff}ms...`);
                    await delay(backoff);
                    continue;
                }
                console.error(`Failed to upload photo ${photoNumber}:`, error);
                throw new Error(`Failed to upload photo ${file.originalname}`);
            }
        }
        if (lastError) {
            console.error(`Photo ${photoNumber} failed after ${maxRetries} attempts:`, lastError);
            throw new Error(`Failed to upload photo ${file.originalname}`);
        }
    };
    let currentIndex = 0;
    const workers = [];
    const runWorker = async () => {
        while (true) {
            const index = currentIndex++;
            if (index >= files.length) {
                break;
            }
            await uploadSingle(files[index], index);
        }
    };
    for (let i = 0; i < Math.min(concurrency, files.length); i++) {
        workers.push(runWorker());
    }
    try {
        await Promise.all(workers);
        return results.sort((a, b) => a.photoNumber - b.photoNumber);
    }
    catch (error) {
        if (uploadedPublicIds.length > 0) {
            try {
                await Promise.all(uploadedPublicIds.map((publicId) => cloudinary_1.v2.uploader.destroy(publicId, { resource_type: "image" })));
            }
            catch (cleanupError) {
                console.error("Failed to clean up Cloudinary uploads:", cleanupError);
            }
        }
        throw error;
    }
};
exports.uploadPhotosToCloudinary = uploadPhotosToCloudinary;
const deletePhotosFromCloudinary = async (publicIds) => {
    if (!publicIds || publicIds.length === 0) {
        return;
    }
    try {
        const deletePromises = publicIds.map((publicId) => cloudinary_1.v2.uploader.destroy(publicId, { resource_type: "image" }));
        await Promise.all(deletePromises);
    }
    catch (error) {
        console.error("Failed to delete photos from Cloudinary:", error);
        throw new Error("Failed to delete photos from cloud storage");
    }
};
exports.deletePhotosFromCloudinary = deletePhotosFromCloudinary;
const createSchoolFolderStructure = async (schoolName) => {
    const sanitizedSchoolName = schoolName
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("");
    try {
        const folders = [
            `${sanitizedSchoolName}/Students`,
            `${sanitizedSchoolName}/Teachers`,
        ];
        const createFolderPromises = folders.map(async (folder) => {
            const placeholderData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
            await cloudinary_1.v2.uploader.upload(placeholderData, {
                public_id: `${folder}/.placeholder`,
                resource_type: "image",
                format: "png",
            });
        });
        await Promise.all(createFolderPromises);
    }
    catch (error) {
        console.error("Failed to create school folder structure:", error);
    }
};
exports.createSchoolFolderStructure = createSchoolFolderStructure;
const getAvailablePhotoSlots = (existingPhotoNumbers) => {
    const allSlots = [1, 2, 3, 4, 5, 6, 7, 8];
    return allSlots.filter((slot) => !existingPhotoNumbers.includes(slot));
};
exports.getAvailablePhotoSlots = getAvailablePhotoSlots;
const uploadToCloudinary = async (fileBuffer, options) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(`data:application/octet-stream;base64,${fileBuffer.toString("base64")}`, {
            folder: options.folder,
            resource_type: options.resource_type || "auto",
            use_filename: options.use_filename || true,
            unique_filename: options.unique_filename !== false,
        });
        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            resource_type: result.resource_type,
            format: result.format,
            bytes: result.bytes,
        };
    }
    catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw new Error("Failed to upload file to cloud storage");
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        console.error(`Failed to delete ${publicId} from Cloudinary:`, error);
        throw new Error(`Failed to delete file from cloud storage: ${publicId}`);
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
//# sourceMappingURL=cloudinaryUtils.js.map