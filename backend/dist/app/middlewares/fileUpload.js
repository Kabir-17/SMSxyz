"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUploadMiddleware = exports.handleMulterError = exports.sanitizeFilenames = exports.validateFileExtensions = exports.validateFileSize = exports.validateStudentPhotoCount = exports.validateOptionalFiles = exports.validateUploadedFiles = exports.uploadAssignmentMaterials = exports.uploadHomeworkAttachments = exports.uploadMixedFiles = exports.uploadDocuments = exports.uploadSinglePhoto = exports.uploadTeacherPhotos = exports.uploadStudentPhotos = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const AppError_1 = require("../errors/AppError");
const fileUtils_1 = require("../utils/fileUtils");
const config_1 = __importDefault(require("../config"));
const createFileFilter = (allowedTypes, allowedExtensions) => {
    return (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
            return cb(null, true);
        }
        if (allowedExtensions) {
            const fileExt = path_1.default.extname(file.originalname).toLowerCase();
            if (allowedExtensions.includes(fileExt)) {
                return cb(null, true);
            }
        }
        cb(new AppError_1.AppError(400, `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`));
    };
};
const imageFilter = createFileFilter(['image/jpeg', 'image/jpg', 'image/png'], ['.jpg', '.jpeg', '.png']);
const documentFilter = createFileFilter(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], ['.pdf', '.doc', '.docx']);
const generalFilter = createFileFilter([
    'image/jpeg', 'image/jpg', 'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
], ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx']);
const memoryStorage = multer_1.default.memoryStorage();
const diskStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config_1.default.temp_upload_path);
    },
    filename: (req, file, cb) => {
        const uniqueName = fileUtils_1.FileUtils.generateUniqueFilename(file.originalname);
        cb(null, uniqueName);
    },
});
exports.uploadStudentPhotos = (0, multer_1.default)({
    storage: memoryStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: config_1.default.max_file_size,
        files: config_1.default.max_photos_per_student,
    },
}).array('photos', config_1.default.max_photos_per_student);
exports.uploadTeacherPhotos = (0, multer_1.default)({
    storage: memoryStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: config_1.default.max_file_size,
        files: config_1.default.max_photos_per_teacher || config_1.default.max_photos_per_student,
    },
}).array('photos', config_1.default.max_photos_per_teacher || config_1.default.max_photos_per_student);
exports.uploadSinglePhoto = (0, multer_1.default)({
    storage: memoryStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: config_1.default.max_file_size,
        files: 1,
    },
}).single('photo');
exports.uploadDocuments = (0, multer_1.default)({
    storage: memoryStorage,
    fileFilter: documentFilter,
    limits: {
        fileSize: config_1.default.max_file_size,
        files: 10,
    },
}).array('documents', 10);
exports.uploadMixedFiles = (0, multer_1.default)({
    storage: memoryStorage,
    fileFilter: generalFilter,
    limits: {
        fileSize: config_1.default.max_file_size,
        files: 15,
    },
}).array('files', 15);
exports.uploadHomeworkAttachments = (0, multer_1.default)({
    storage: memoryStorage,
    fileFilter: generalFilter,
    limits: {
        fileSize: config_1.default.max_file_size,
        files: 5,
    },
}).array('attachments', 5);
exports.uploadAssignmentMaterials = (0, multer_1.default)({
    storage: memoryStorage,
    fileFilter: generalFilter,
    limits: {
        fileSize: config_1.default.max_file_size,
        files: 10,
    },
}).array('materials', 10);
const validateUploadedFiles = (req, res, next) => {
    const files = req.files;
    if (!files || files.length === 0) {
        return next(new AppError_1.AppError(400, 'No files uploaded'));
    }
    for (const file of files) {
        const validation = fileUtils_1.FileUtils.validateImageFile(file);
        if (!validation.isValid) {
            return next(new AppError_1.AppError(400, validation.error));
        }
    }
    next();
};
exports.validateUploadedFiles = validateUploadedFiles;
const validateOptionalFiles = (req, res, next) => {
    const files = req.files;
    if (!files || files.length === 0) {
        return next();
    }
    for (const file of files) {
        const validation = fileUtils_1.FileUtils.validateImageFile(file);
        if (!validation.isValid) {
            return next(new AppError_1.AppError(400, validation.error));
        }
    }
    next();
};
exports.validateOptionalFiles = validateOptionalFiles;
const validateStudentPhotoCount = async (req, res, next) => {
    try {
        const files = req.files;
        const studentId = req.params.id || req.body.studentId;
        if (!studentId) {
            return next(new AppError_1.AppError(400, 'Student ID is required'));
        }
        if (!files || files.length === 0) {
            return next(new AppError_1.AppError(400, 'No photos uploaded'));
        }
        const Student = require('../modules/student/student.model').Student;
        const student = await Student.findById(studentId);
        if (!student) {
            return next(new AppError_1.AppError(404, 'Student not found'));
        }
        const canUpload = await student.canUploadMorePhotos();
        if (!canUpload) {
            return next(new AppError_1.AppError(400, `Student has reached maximum photo limit of ${config_1.default.max_photos_per_student}`));
        }
        const StudentPhoto = require('../modules/student/student.model').StudentPhoto;
        const currentPhotoCount = await StudentPhoto.countDocuments({ studentId });
        const remainingSlots = config_1.default.max_photos_per_student - currentPhotoCount;
        if (files.length > remainingSlots) {
            return next(new AppError_1.AppError(400, `Can only upload ${remainingSlots} more photos. Student has ${currentPhotoCount}/${config_1.default.max_photos_per_student} photos.`));
        }
        next();
    }
    catch (error) {
        next(new AppError_1.AppError(500, 'Error validating photo count'));
    }
};
exports.validateStudentPhotoCount = validateStudentPhotoCount;
const validateFileSize = (maxSize = config_1.default.max_file_size) => {
    return (req, res, next) => {
        const files = req.files;
        if (files && files.length > 0) {
            for (const file of files) {
                if (file.size > maxSize) {
                    return next(new AppError_1.AppError(400, `File ${file.originalname} exceeds maximum size of ${Math.round(maxSize / (1024 * 1024))}MB`));
                }
            }
        }
        next();
    };
};
exports.validateFileSize = validateFileSize;
const validateFileExtensions = (allowedExtensions) => {
    return (req, res, next) => {
        const files = req.files;
        if (files && files.length > 0) {
            for (const file of files) {
                const fileExt = path_1.default.extname(file.originalname).toLowerCase();
                if (!allowedExtensions.includes(fileExt)) {
                    return next(new AppError_1.AppError(400, `File ${file.originalname} has invalid extension. Allowed: ${allowedExtensions.join(', ')}`));
                }
            }
        }
        next();
    };
};
exports.validateFileExtensions = validateFileExtensions;
const sanitizeFilenames = (req, res, next) => {
    const files = req.files;
    if (files && files.length > 0) {
        files.forEach(file => {
            file.originalname = file.originalname
                .replace(/[^a-zA-Z0-9.\-_]/g, '_')
                .replace(/_{2,}/g, '_')
                .replace(/^_|_$/g, '');
        });
    }
    next();
};
exports.sanitizeFilenames = sanitizeFilenames;
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer_1.default.MulterError) {
        let message = 'File upload error';
        switch (error.code) {
            case 'LIMIT_FILE_SIZE':
                message = `File too large. Maximum size is ${Math.round(config_1.default.max_file_size / (1024 * 1024))}MB`;
                break;
            case 'LIMIT_FILE_COUNT':
                message = 'Too many files uploaded';
                break;
            case 'LIMIT_FIELD_COUNT':
                message = 'Too many fields in upload';
                break;
            case 'LIMIT_FIELD_KEY':
                message = 'Field name too long';
                break;
            case 'LIMIT_FIELD_VALUE':
                message = 'Field value too long';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                message = 'Unexpected file field';
                break;
            default:
                message = 'File upload error: ' + error.message;
                break;
        }
        return next(new AppError_1.AppError(400, message));
    }
    next(error);
};
exports.handleMulterError = handleMulterError;
const createUploadMiddleware = (options) => {
    const { fieldName, maxFiles = 1, fileTypes = ['image/jpeg', 'image/jpg', 'image/png'], maxSize = config_1.default.max_file_size, storage = 'memory' } = options;
    const fileFilter = createFileFilter(fileTypes);
    const storageConfig = storage === 'memory' ? memoryStorage : diskStorage;
    return (0, multer_1.default)({
        storage: storageConfig,
        fileFilter,
        limits: {
            fileSize: maxSize,
            files: maxFiles,
        },
    })[maxFiles === 1 ? 'single' : 'array'](fieldName, maxFiles);
};
exports.createUploadMiddleware = createUploadMiddleware;
exports.default = {
    uploadStudentPhotos: exports.uploadStudentPhotos,
    uploadTeacherPhotos: exports.uploadTeacherPhotos,
    uploadSinglePhoto: exports.uploadSinglePhoto,
    uploadDocuments: exports.uploadDocuments,
    uploadMixedFiles: exports.uploadMixedFiles,
    uploadHomeworkAttachments: exports.uploadHomeworkAttachments,
    uploadAssignmentMaterials: exports.uploadAssignmentMaterials,
    validateUploadedFiles: exports.validateUploadedFiles,
    validateOptionalFiles: exports.validateOptionalFiles,
    validateStudentPhotoCount: exports.validateStudentPhotoCount,
    validateFileSize: exports.validateFileSize,
    validateFileExtensions: exports.validateFileExtensions,
    sanitizeFilenames: exports.sanitizeFilenames,
    handleMulterError: exports.handleMulterError,
    createUploadMiddleware: exports.createUploadMiddleware,
};
//# sourceMappingURL=fileUpload.js.map