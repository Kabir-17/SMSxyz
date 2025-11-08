"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.classService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const AppError_1 = require("../../errors/AppError");
const class_model_1 = require("./class.model");
const school_model_1 = require("../school/school.model");
class ClassService {
    async createClass(schoolId, classData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid school ID format');
            }
            const school = await school_model_1.School.findById(schoolId);
            if (!school) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'School not found');
            }
            if (classData.section) {
                const existingClass = await class_model_1.Class.findByGradeAndSection(schoolId, classData.grade, classData.section);
                if (existingClass) {
                    throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Class already exists for Grade ${classData.grade} Section ${classData.section}`);
                }
            }
            let newClass;
            if (classData.section) {
                const absenceSettings = this.normalizeAbsenceSmsSettingsForCreate(classData.absenceSmsSettings);
                const classPayload = {
                    schoolId,
                    grade: classData.grade,
                    section: classData.section.toUpperCase(),
                    className: `Grade ${classData.grade} - Section ${classData.section.toUpperCase()}`,
                    academicYear: classData.academicYear,
                    maxStudents: classData.maxStudents || school.settings?.maxStudentsPerSection || 40,
                    classTeacher: classData.classTeacher ? new mongoose_1.Types.ObjectId(classData.classTeacher) : undefined,
                    subjects: classData.subjects?.map(id => new mongoose_1.Types.ObjectId(id)) || [],
                };
                if (absenceSettings) {
                    classPayload.absenceSmsSettings = absenceSettings;
                }
                newClass = new class_model_1.Class(classPayload);
                await newClass.save();
            }
            else {
                newClass = await class_model_1.Class.createClassWithAutoSection(schoolId, classData.grade, classData.maxStudents || school.settings?.maxStudentsPerSection || 40, classData.academicYear);
                if (classData.classTeacher) {
                    newClass.classTeacher = new mongoose_1.Types.ObjectId(classData.classTeacher);
                }
                if (classData.subjects && classData.subjects.length > 0) {
                    newClass.subjects = classData.subjects.map(id => new mongoose_1.Types.ObjectId(id));
                }
                const absenceSettings = this.normalizeAbsenceSmsSettingsForCreate(classData.absenceSmsSettings);
                if (absenceSettings) {
                    newClass.absenceSmsSettings = absenceSettings;
                }
                await newClass.save();
            }
            const populatedClass = await class_model_1.Class.findById(newClass._id)
                .populate('classTeacher', 'teacherId userId')
                .populate({
                path: 'classTeacher',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            })
                .populate('subjects', 'name code');
            return this.formatClassResponse(populatedClass);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to create class: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getClasses(queryParams) {
        try {
            const { page, limit, schoolId, grade, section, academicYear, isActive, sortBy, sortOrder, } = queryParams;
            const query = {};
            if (schoolId) {
                if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                    throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid school ID format');
                }
                query.schoolId = schoolId;
            }
            if (grade !== undefined)
                query.grade = grade;
            if (section)
                query.section = section.toUpperCase();
            if (academicYear)
                query.academicYear = academicYear;
            if (isActive !== undefined)
                query.isActive = isActive;
            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
            if (sortBy !== 'grade')
                sortOptions.grade = 1;
            if (sortBy !== 'section')
                sortOptions.section = 1;
            const totalCount = await class_model_1.Class.countDocuments(query);
            const totalPages = Math.ceil(totalCount / limit);
            const skip = (page - 1) * limit;
            const classes = await class_model_1.Class.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate('classTeacher', 'teacherId userId')
                .populate({
                path: 'classTeacher',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            })
                .populate('subjects', 'name code');
            return {
                classes: classes.map(cls => this.formatClassResponse(cls)),
                totalCount,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch classes: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getClassById(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid class ID format');
            }
            const classDoc = await class_model_1.Class.findById(id)
                .populate('classTeacher', 'teacherId userId')
                .populate({
                path: 'classTeacher',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            })
                .populate('subjects', 'name code');
            if (!classDoc) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Class not found');
            }
            return this.formatClassResponse(classDoc);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch class: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async updateClass(id, updateData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid class ID format');
            }
            const classDoc = await class_model_1.Class.findById(id);
            if (!classDoc) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Class not found');
            }
            if (updateData.maxStudents !== undefined && updateData.maxStudents < classDoc.currentStudents) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Cannot reduce maximum students to ${updateData.maxStudents} as there are currently ${classDoc.currentStudents} students enrolled`);
            }
            if (updateData.maxStudents !== undefined)
                classDoc.maxStudents = updateData.maxStudents;
            if (updateData.classTeacher !== undefined) {
                classDoc.classTeacher = updateData.classTeacher ? new mongoose_1.Types.ObjectId(updateData.classTeacher) : undefined;
            }
            if (updateData.subjects !== undefined) {
                classDoc.subjects = updateData.subjects.map(id => new mongoose_1.Types.ObjectId(id));
            }
            if (updateData.isActive !== undefined)
                classDoc.isActive = updateData.isActive;
            if (updateData.absenceSmsSettings !== undefined) {
                const updatedSettings = this.normalizeAbsenceSmsSettingsForUpdate(updateData.absenceSmsSettings);
                if (!classDoc.absenceSmsSettings) {
                    classDoc.absenceSmsSettings = {
                        enabled: false,
                        sendAfterTime: '11:00',
                    };
                }
                if (updatedSettings) {
                    if (updatedSettings.enabled !== undefined) {
                        classDoc.absenceSmsSettings.enabled = updatedSettings.enabled;
                    }
                    if (updatedSettings.sendAfterTime !== undefined) {
                        classDoc.absenceSmsSettings.sendAfterTime = updatedSettings.sendAfterTime;
                    }
                }
            }
            await classDoc.save();
            const updatedClass = await class_model_1.Class.findById(id)
                .populate('classTeacher', 'teacherId userId')
                .populate({
                path: 'classTeacher',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            })
                .populate('subjects', 'name code');
            return this.formatClassResponse(updatedClass);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to update class: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteClass(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid class ID format');
            }
            const classDoc = await class_model_1.Class.findById(id);
            if (!classDoc) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Class not found');
            }
            if (classDoc.currentStudents > 0) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Cannot delete class with ${classDoc.currentStudents} enrolled students. Please transfer students first.`);
            }
            classDoc.isActive = false;
            await classDoc.save();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to delete class: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getClassesByGrade(schoolId, grade) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid school ID format');
            }
            const classes = await class_model_1.Class.findByGrade(schoolId, grade);
            return classes.map(cls => this.formatClassResponse(cls));
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch classes by grade: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getClassByGradeAndSection(schoolId, grade, section) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid school ID format');
            }
            const classDoc = await class_model_1.Class.findByGradeAndSection(schoolId, grade, section);
            return classDoc ? this.formatClassResponse(classDoc) : null;
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch class by grade and section: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getClassStats(schoolId) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid school ID format');
            }
            return await class_model_1.Class.getClassStats(schoolId);
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch class statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async checkCapacity(schoolId, grade) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid school ID format');
            }
            return await class_model_1.Class.checkCapacityForGrade(schoolId, grade);
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to check capacity: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async createNewSectionIfNeeded(schoolId, grade, academicYear, maxStudents) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid school ID format');
            }
            const newClass = await class_model_1.Class.createNewSectionIfNeeded(schoolId, grade, academicYear);
            if (newClass) {
                if (maxStudents) {
                    newClass.maxStudents = maxStudents;
                    await newClass.save();
                }
                const populatedClass = await class_model_1.Class.findById(newClass._id)
                    .populate('classTeacher', 'teacherId userId')
                    .populate({
                    path: 'classTeacher',
                    populate: {
                        path: 'userId',
                        select: 'firstName lastName'
                    }
                })
                    .populate('subjects', 'name code');
                return this.formatClassResponse(populatedClass);
            }
            return null;
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to create new section: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    formatClassResponse(classDoc) {
        const absenceSettings = classDoc.absenceSmsSettings
            ? {
                enabled: Boolean(classDoc.absenceSmsSettings.enabled),
                sendAfterTime: classDoc.absenceSmsSettings.sendAfterTime || '11:00',
            }
            : {
                enabled: false,
                sendAfterTime: '11:00',
            };
        return {
            id: classDoc._id.toString(),
            schoolId: classDoc.schoolId.toString(),
            grade: classDoc.grade,
            section: classDoc.section,
            className: classDoc.className,
            academicYear: classDoc.academicYear,
            maxStudents: classDoc.maxStudents,
            currentStudents: classDoc.currentStudents,
            availableSeats: classDoc.getAvailableSeats(),
            isFull: classDoc.isFull(),
            classTeacher: classDoc.classTeacher ? {
                id: classDoc.classTeacher._id.toString(),
                name: classDoc.classTeacher.userId
                    ? `${classDoc.classTeacher.userId.firstName} ${classDoc.classTeacher.userId.lastName}`
                    : 'Unknown Teacher',
                teacherId: classDoc.classTeacher.teacherId,
            } : undefined,
            subjects: classDoc.subjects ? classDoc.subjects.map((subject) => ({
                id: subject._id.toString(),
                name: subject.name,
                code: subject.code,
            })) : [],
            isActive: classDoc.isActive,
            absenceSmsSettings: absenceSettings,
            createdAt: classDoc.createdAt,
            updatedAt: classDoc.updatedAt,
        };
    }
    normalizeAbsenceSmsSettingsForCreate(settings) {
        if (!settings) {
            return undefined;
        }
        const normalizedSendTime = settings.sendAfterTime ?? '11:00';
        if (!/^\d{2}:\d{2}$/.test(normalizedSendTime)) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Send-after time must be provided in HH:MM format (24-hour clock)');
        }
        return {
            enabled: settings.enabled ?? false,
            sendAfterTime: normalizedSendTime,
        };
    }
    normalizeAbsenceSmsSettingsForUpdate(settings) {
        if (!settings) {
            return undefined;
        }
        const result = {};
        if (settings.enabled !== undefined) {
            result.enabled = settings.enabled;
        }
        if (settings.sendAfterTime !== undefined) {
            if (!/^\d{2}:\d{2}$/.test(settings.sendAfterTime)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Send-after time must be provided in HH:MM format (24-hour clock)');
            }
            result.sendAfterTime = settings.sendAfterTime;
        }
        return Object.keys(result).length ? result : undefined;
    }
}
exports.classService = new ClassService();
//# sourceMappingURL=class.service.js.map