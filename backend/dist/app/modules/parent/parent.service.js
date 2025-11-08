"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const AppError_1 = require("../../errors/AppError");
const school_model_1 = require("../school/school.model");
const student_model_1 = require("../student/student.model");
const user_model_1 = require("../user/user.model");
const parent_model_1 = require("./parent.model");
const attendance_model_1 = require("../attendance/attendance.model");
const homework_model_1 = require("../homework/homework.model");
const academic_calendar_model_1 = require("../academic-calendar/academic-calendar.model");
const notification_model_1 = require("../notification/notification.model");
const schedule_model_1 = require("../schedule/schedule.model");
class ParentService {
    async createParent(parentData) {
        try {
            const school = await school_model_1.School.findById(parentData.schoolId);
            if (!school) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "School not found");
            }
            const children = await student_model_1.Student.find({
                _id: { $in: parentData.children },
                schoolId: parentData.schoolId,
            });
            if (children.length !== parentData.children.length) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "One or more students not found in the specified school");
            }
            const parentId = await parent_model_1.Parent.generateNextParentId(parentData.schoolId);
            const username = parentId.replace(/-/g, "").toLowerCase();
            const newUser = await user_model_1.User.create({
                schoolId: parentData.schoolId,
                role: "parent",
                username,
                passwordHash: parentId,
                firstName: parentData.firstName,
                lastName: parentData.lastName,
                email: parentData.email,
                phone: parentData.phone,
            });
            const newParent = await parent_model_1.Parent.create({
                userId: newUser._id,
                schoolId: parentData.schoolId,
                parentId,
                children: parentData.children,
                relationship: parentData.relationship,
                occupation: parentData.occupation,
                qualification: parentData.qualification,
                monthlyIncome: parentData.monthlyIncome
                    ? {
                        ...parentData.monthlyIncome,
                        currency: parentData.monthlyIncome.currency || "INR",
                    }
                    : undefined,
                address: {
                    ...parentData.address,
                    country: parentData.address.country,
                },
                emergencyContact: parentData.emergencyContact,
                preferences: {
                    communicationMethod: parentData.preferences?.communicationMethod || "All",
                    receiveNewsletters: parentData.preferences?.receiveNewsletters ?? true,
                    receiveAttendanceAlerts: parentData.preferences?.receiveAttendanceAlerts ?? true,
                    receiveExamResults: parentData.preferences?.receiveExamResults ?? true,
                    receiveEventNotifications: parentData.preferences?.receiveEventNotifications ?? true,
                },
            });
            await student_model_1.Student.updateMany({ _id: { $in: parentData.children } }, { parentId: newParent._id });
            await newParent.populate([
                { path: "userId", select: "firstName lastName username email phone" },
                { path: "schoolId", select: "name" },
                {
                    path: "children",
                    select: "studentId grade section rollNumber",
                    populate: { path: "userId", select: "firstName lastName" },
                },
            ]);
            return this.formatParentResponse(newParent);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to create parent: ${error.message}`);
        }
    }
    async getParents(queryParams) {
        try {
            const { page, limit, schoolId, relationship, isActive, search, sortBy, sortOrder, } = queryParams;
            const skip = (page - 1) * limit;
            const query = {};
            if (schoolId) {
                query.schoolId = schoolId;
            }
            if (relationship) {
                query.relationship = relationship;
            }
            if (isActive && isActive !== "all") {
                query.isActive = isActive === "true";
            }
            let userQuery = {};
            if (search) {
                userQuery.$or = [
                    { firstName: { $regex: new RegExp(search, "i") } },
                    { lastName: { $regex: new RegExp(search, "i") } },
                    { username: { $regex: new RegExp(search, "i") } },
                ];
            }
            let userIds = [];
            if (Object.keys(userQuery).length > 0) {
                const matchingUsers = await user_model_1.User.find(userQuery).select("_id");
                userIds = matchingUsers.map((user) => user._id);
                query.userId = { $in: userIds };
            }
            if (search && !userQuery.$or) {
                query.$or = [{ parentId: { $regex: new RegExp(search, "i") } }];
            }
            const sort = {};
            if (sortBy === "firstName" || sortBy === "lastName") {
                sort.relationship = 1;
                sort.createdAt = -1;
            }
            else {
                sort[sortBy] = sortOrder === "desc" ? -1 : 1;
            }
            const [parents, totalCount] = await Promise.all([
                parent_model_1.Parent.find(query)
                    .populate("userId", "firstName lastName username email phone")
                    .populate("schoolId", "name")
                    .populate("children", "studentId grade section rollNumber userId")
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                parent_model_1.Parent.countDocuments(query),
            ]);
            const totalPages = Math.ceil(totalCount / limit);
            return {
                parents: parents.map((parent) => this.formatParentResponse(parent)),
                totalCount,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            };
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch parents: ${error.message}`);
        }
    }
    async getParentById(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid parent ID format");
            }
            const parent = await parent_model_1.Parent.findById(id)
                .populate("userId", "firstName lastName username email phone")
                .populate("schoolId", "name")
                .populate("children", "studentId grade section rollNumber userId")
                .lean();
            if (!parent) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parent not found");
            }
            return this.formatParentResponse(parent);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch parent: ${error.message}`);
        }
    }
    async updateParent(id, updateData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid parent ID format");
            }
            const parent = await parent_model_1.Parent.findById(id);
            if (!parent) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parent not found");
            }
            if (updateData.children) {
                const children = await student_model_1.Student.find({
                    _id: { $in: updateData.children },
                    schoolId: parent.schoolId,
                });
                if (children.length !== updateData.children.length) {
                    throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "One or more students not found in the school");
                }
                await student_model_1.Student.updateMany({ parentId: parent._id }, { $unset: { parentId: 1 } });
                await student_model_1.Student.updateMany({ _id: { $in: updateData.children } }, { parentId: parent._id });
            }
            const updatedParent = await parent_model_1.Parent.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
                .populate("userId", "firstName lastName username email phone")
                .populate("schoolId", "name")
                .populate("children", "studentId grade section rollNumber userId")
                .lean();
            return this.formatParentResponse(updatedParent);
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to update parent: ${error.message}`);
        }
    }
    async deleteParent(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid parent ID format");
            }
            const parent = await parent_model_1.Parent.findById(id);
            if (!parent) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parent not found");
            }
            await student_model_1.Student.updateMany({ parentId: parent._id }, { $unset: { parentId: 1 } });
            if (parent.userId) {
                await user_model_1.User.findByIdAndDelete(parent.userId);
            }
            await parent.deleteOne();
        }
        catch (error) {
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to delete parent: ${error.message}`);
        }
    }
    async getParentStats(schoolId) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Invalid school ID format");
            }
            const [totalParents, activeParents, relationshipStats, communicationStats, childrenCountStats, recentRegistrations,] = await Promise.all([
                parent_model_1.Parent.countDocuments({ schoolId }),
                parent_model_1.Parent.countDocuments({ schoolId, isActive: true }),
                parent_model_1.Parent.aggregate([
                    { $match: { schoolId: new mongoose_1.Types.ObjectId(schoolId) } },
                    { $group: { _id: "$relationship", count: { $sum: 1 } } },
                    { $sort: { _id: 1 } },
                ]),
                parent_model_1.Parent.aggregate([
                    { $match: { schoolId: new mongoose_1.Types.ObjectId(schoolId) } },
                    {
                        $group: {
                            _id: "$preferences.communicationMethod",
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]),
                parent_model_1.Parent.aggregate([
                    { $match: { schoolId: new mongoose_1.Types.ObjectId(schoolId) } },
                    { $group: { _id: { $size: "$children" }, count: { $sum: 1 } } },
                    { $sort: { _id: 1 } },
                ]),
                parent_model_1.Parent.countDocuments({
                    schoolId,
                    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
                }),
            ]);
            return {
                totalParents,
                activeParents,
                byRelationship: relationshipStats.map((stat) => ({
                    relationship: stat._id,
                    count: stat.count,
                })),
                byCommunicationPreference: communicationStats.map((stat) => ({
                    method: stat._id,
                    count: stat.count,
                })),
                byChildrenCount: childrenCountStats.map((stat) => ({
                    childrenCount: stat._id,
                    parentCount: stat.count,
                })),
                recentRegistrations,
            };
        }
        catch (error) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to fetch parent stats: ${error.message}`);
        }
    }
    formatParentResponse(parent) {
        return {
            id: parent._id?.toString() || parent.id,
            userId: parent.userId?._id?.toString() || parent.userId?.toString(),
            schoolId: parent.schoolId?._id?.toString() || parent.schoolId?.toString(),
            parentId: parent.parentId,
            children: parent.children?.map((child) => ({
                id: child._id?.toString() || child.id,
                studentId: child.studentId,
                fullName: child.userId &&
                    typeof child.userId === "object" &&
                    child.userId !== null &&
                    "firstName" in child.userId &&
                    "lastName" in child.userId
                    ? `${child.userId.firstName} ${child.userId.lastName}`.trim()
                    : "",
                grade: child.grade,
                section: child.section,
                rollNumber: child.rollNumber,
            })) || [],
            childrenCount: parent.children?.length || 0,
            relationship: parent.relationship,
            occupation: parent.occupation,
            qualification: parent.qualification,
            monthlyIncome: parent.monthlyIncome,
            address: parent.address,
            emergencyContact: parent.emergencyContact,
            preferences: parent.preferences || {
                communicationMethod: "All",
                receiveNewsletters: true,
                receiveAttendanceAlerts: true,
                receiveExamResults: true,
                receiveEventNotifications: true,
            },
            isActive: parent.isActive !== false,
            createdAt: parent.createdAt,
            updatedAt: parent.updatedAt,
            user: parent.userId
                ? {
                    id: parent.userId._id?.toString() || parent.userId.id,
                    username: parent.userId.username,
                    firstName: parent.userId.firstName,
                    lastName: parent.userId.lastName,
                    fullName: `${parent.userId.firstName} ${parent.userId.lastName}`.trim(),
                    email: parent.userId.email,
                    phone: parent.userId.phone,
                }
                : undefined,
            school: parent.schoolId?.name
                ? {
                    id: parent.schoolId._id?.toString() || parent.schoolId.id,
                    name: parent.schoolId.name,
                }
                : undefined,
        };
    }
    async getChildDisciplinaryActions(userId) {
        try {
            const parent = await parent_model_1.Parent.findOne({ userId }).populate("children");
            if (!parent) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parent not found");
            }
            const { DisciplinaryAction } = await Promise.resolve().then(() => __importStar(require("../disciplinary/disciplinary.model")));
            const actions = await DisciplinaryAction.find({
                studentId: { $in: parent.children },
                isRedWarrant: true,
            })
                .populate({
                path: "studentId",
                select: "userId rollNumber grade section",
                populate: {
                    path: "userId",
                    select: "firstName lastName",
                },
            })
                .populate({
                path: "teacherId",
                select: "userId",
                populate: {
                    path: "userId",
                    select: "firstName lastName",
                },
            })
                .sort({ issuedDate: -1 });
            const stats = await DisciplinaryAction.getDisciplinaryStats(parent.schoolId.toString(), {
                studentId: { $in: parent.children },
                isRedWarrant: true,
            });
            const formattedActions = actions.map((action) => {
                const student = action.studentId;
                const teacher = action.teacherId;
                const studentUser = student?.userId;
                const teacherUser = teacher?.userId;
                return {
                    id: action._id,
                    studentName: studentUser
                        ? `${studentUser.firstName} ${studentUser.lastName}`
                        : "N/A",
                    studentRoll: student?.rollNumber || "N/A",
                    grade: student?.grade || "N/A",
                    section: student?.section || "N/A",
                    teacherName: teacherUser
                        ? `${teacherUser.firstName} ${teacherUser.lastName}`
                        : "N/A",
                    actionType: action.actionType,
                    severity: action.severity,
                    category: action.category,
                    title: action.title,
                    description: action.description,
                    reason: action.reason,
                    status: action.status,
                    issuedDate: action.issuedDate,
                    isRedWarrant: action.isRedWarrant,
                    warrantLevel: action.warrantLevel,
                    parentNotified: action.parentNotified,
                    studentAcknowledged: action.studentAcknowledged,
                    followUpRequired: action.followUpRequired,
                    followUpDate: action.followUpDate,
                    resolutionNotes: action.resolutionNotes,
                    canAppeal: action.canAppeal ? action.canAppeal() : false,
                    isOverdue: action.isOverdue ? action.isOverdue() : false,
                };
            });
            return {
                actions: formattedActions,
                stats,
                childrenCount: parent.children.length,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to get child disciplinary actions: ${error.message}`);
        }
    }
    async getParentDashboard(parentUserId) {
        try {
            const parent = await parent_model_1.Parent.findOne({ userId: parentUserId })
                .populate("children", "studentId grade section rollNumber userId")
                .populate({
                path: "children",
                populate: {
                    path: "userId",
                    select: "firstName lastName",
                },
            });
            if (!parent) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parent not found");
            }
            const children = parent.children || [];
            let totalAttendanceAlerts = 0;
            let totalPendingHomework = 0;
            let totalUpcomingEvents = 0;
            let totalNotices = 0;
            const currentMonth = new Date();
            currentMonth.setDate(1);
            const nextMonth = new Date(currentMonth);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            totalUpcomingEvents = await academic_calendar_model_1.AcademicCalendar.countDocuments({
                startDate: { $gte: new Date() },
                isActive: true,
                schoolId: parent.schoolId,
            });
            totalNotices = await notification_model_1.Notification.countDocuments({
                schoolId: parent.schoolId,
                $or: [
                    { recipientType: "parent" },
                    { recipientType: "all" },
                    { recipientId: parentUserId }
                ],
                isActive: true,
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            });
            for (const child of children) {
                const studentChild = child;
                const attendanceRecords = await attendance_model_1.Attendance.aggregate([
                    {
                        $match: {
                            "students.studentId": studentChild._id,
                            date: { $gte: currentMonth, $lt: nextMonth },
                        },
                    },
                    { $unwind: "$students" },
                    { $match: { "students.studentId": studentChild._id } },
                ]);
                const totalDays = attendanceRecords.length;
                const presentDays = attendanceRecords.filter((record) => record.students.status === "present").length;
                const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;
                if (attendancePercentage < 75) {
                    totalAttendanceAlerts++;
                }
                const pendingHomeworkCount = await homework_model_1.Homework.countDocuments({
                    grade: studentChild.grade,
                    section: studentChild.section,
                    isPublished: true,
                    dueDate: { $gte: new Date() },
                });
                const submittedHomework = await homework_model_1.HomeworkSubmission.countDocuments({
                    studentId: studentChild._id,
                });
                const childPendingHomework = Math.max(0, pendingHomeworkCount - submittedHomework);
                totalPendingHomework += childPendingHomework;
            }
            const dashboardStats = {
                totalChildren: children.length,
                totalAttendanceAlerts,
                totalPendingHomework,
                totalUpcomingEvents,
                totalNotices,
            };
            return {
                parent: {
                    id: parent._id,
                    parentId: parent.parentId,
                    fullName: parent.userId &&
                        typeof parent.userId === "object" &&
                        "firstName" in parent.userId &&
                        "lastName" in parent.userId
                        ? `${parent.userId.firstName} ${parent.userId.lastName}`.trim()
                        : "",
                    relationship: parent.relationship,
                },
                children: children.map((child) => ({
                    id: child._id,
                    studentId: child.studentId,
                    firstName: child.userId?.firstName || "",
                    lastName: child.userId?.lastName || "",
                    fullName: child.userId &&
                        typeof child.userId === "object" &&
                        child.userId.firstName &&
                        child.userId.lastName
                        ? `${child.userId.firstName} ${child.userId.lastName}`.trim()
                        : "",
                    grade: child.grade,
                    section: child.section,
                    rollNumber: child.rollNumber,
                })),
                stats: dashboardStats,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to get parent dashboard: ${error.message}`);
        }
    }
    async getParentChildren(parentUserId) {
        try {
            const parent = await parent_model_1.Parent.findOne({ userId: parentUserId })
                .populate("children", "studentId grade section rollNumber userId schoolId")
                .populate({
                path: "children",
                populate: {
                    path: "userId",
                    select: "firstName lastName email phone",
                },
            })
                .populate({
                path: "children",
                populate: {
                    path: "schoolId",
                    select: "name",
                },
            });
            if (!parent) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Parent not found");
            }
            return {
                children: parent.children.map((child) => ({
                    id: child._id,
                    studentId: child.studentId,
                    fullName: child.userId &&
                        typeof child.userId === "object" &&
                        "firstName" in child.userId &&
                        "lastName" in child.userId
                        ? `${child.userId.firstName} ${child.userId.lastName}`.trim()
                        : "",
                    firstName: child.userId?.firstName || "",
                    lastName: child.userId?.lastName || "",
                    email: child.userId?.email || "",
                    phone: child.userId?.phone || "",
                    grade: child.grade,
                    section: child.section,
                    rollNumber: child.rollNumber,
                    school: child.schoolId?.name || "",
                })),
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to get parent children: ${error.message}`);
        }
    }
    async getChildAttendance(parentUserId, childId, filters) {
        try {
            const parent = await parent_model_1.Parent.findOne({
                userId: parentUserId,
                children: childId,
            });
            if (!parent) {
                throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Access denied to this child's data");
            }
            const child = await student_model_1.Student.findById(childId).populate("userId", "firstName lastName");
            if (!child) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Child not found");
            }
            const month = filters?.month || new Date().getMonth() + 1;
            const year = filters?.year || new Date().getFullYear();
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 1);
            const attendanceRecords = await attendance_model_1.Attendance.aggregate([
                {
                    $match: {
                        "students.studentId": child._id,
                        date: { $gte: startDate, $lt: endDate },
                    },
                },
                { $unwind: "$students" },
                { $match: { "students.studentId": child._id } },
                {
                    $lookup: {
                        from: "subjects",
                        localField: "subjectId",
                        foreignField: "_id",
                        as: "subject",
                    },
                },
                { $unwind: "$subject" },
                {
                    $project: {
                        date: 1,
                        status: "$students.status",
                        subject: "$subject.name",
                        period: 1,
                        markedAt: "$students.markedAt",
                    },
                },
                { $sort: { date: -1, period: 1 } },
            ]);
            const totalRecords = attendanceRecords.length;
            const presentCount = attendanceRecords.filter((r) => r.status === "present").length;
            const absentCount = attendanceRecords.filter((r) => r.status === "absent").length;
            const lateCount = attendanceRecords.filter((r) => r.status === "late").length;
            return {
                child: {
                    id: child._id,
                    studentId: child.studentId,
                    fullName: child.userId
                        ? typeof child.userId === "object" &&
                            "firstName" in child.userId &&
                            "lastName" in child.userId
                            ? `${child.userId.firstName} ${child.userId.lastName}`.trim()
                            : ""
                        : "",
                    grade: child.grade,
                    section: child.section,
                },
                month,
                year,
                summary: {
                    totalDays: totalRecords,
                    presentDays: presentCount,
                    absentDays: absentCount,
                    lateDays: lateCount,
                    attendancePercentage: totalRecords > 0
                        ? Math.round((presentCount / totalRecords) * 100)
                        : 0,
                },
                records: attendanceRecords,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to get child attendance: ${error.message}`);
        }
    }
    async getChildHomework(parentUserId, childId) {
        try {
            const parent = await parent_model_1.Parent.findOne({
                userId: parentUserId,
                children: childId,
            });
            if (!parent) {
                throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Access denied to this child's data");
            }
            const child = await student_model_1.Student.findById(childId).populate("userId", "firstName lastName");
            if (!child) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Child not found");
            }
            const homework = await homework_model_1.Homework.find({
                grade: child.grade,
                section: child.section,
                isPublished: true,
            })
                .populate("teacherId", "userId teacherId")
                .populate({
                path: "teacherId",
                populate: {
                    path: "userId",
                    select: "firstName lastName",
                },
            })
                .populate("subjectId", "name code")
                .sort({ dueDate: 1, assignedDate: -1 })
                .lean();
            const submissions = await homework_model_1.HomeworkSubmission.find({
                studentId: child._id,
            }).lean();
            const submissionMap = new Map(submissions.map((sub) => [sub.homeworkId.toString(), sub]));
            const homeworkWithStatus = homework.map((hw) => {
                const submission = submissionMap.get(hw._id.toString());
                const teacherUser = hw.teacherId?.userId;
                return {
                    homeworkId: hw._id,
                    title: hw.title,
                    description: hw.description,
                    instructions: hw.instructions,
                    subject: hw.subjectId?.name || "Unknown",
                    subjectCode: hw.subjectId?.code || "",
                    teacherName: teacherUser
                        ? `${teacherUser.firstName} ${teacherUser.lastName}`.trim()
                        : "Unknown",
                    teacherId: hw.teacherId?._id,
                    homeworkType: hw.homeworkType,
                    priority: hw.priority,
                    assignedDate: hw.assignedDate,
                    dueDate: hw.dueDate,
                    estimatedDuration: hw.estimatedDuration,
                    totalMarks: hw.totalMarks,
                    passingMarks: hw.passingMarks,
                    submissionType: hw.submissionType,
                    allowLateSubmission: hw.allowLateSubmission,
                    latePenalty: hw.latePenalty,
                    maxLateDays: hw.maxLateDays,
                    isGroupWork: hw.isGroupWork,
                    maxGroupSize: hw.maxGroupSize,
                    rubric: hw.rubric || [],
                    tags: hw.tags || [],
                    status: submission?.status || "pending",
                    submittedAt: submission?.submittedAt,
                    marksObtained: submission?.marksObtained,
                    grade: submission?.grade,
                    feedback: submission?.feedback,
                    attachments: hw.attachments || [],
                    isLate: submission?.isLate || false,
                    isOverdue: !submission && new Date(hw.dueDate) < new Date(),
                    daysUntilDue: Math.ceil((new Date(hw.dueDate).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)),
                };
            });
            const totalHomework = homeworkWithStatus.length;
            const completedHomework = homeworkWithStatus.filter((h) => h.status === "submitted" || h.status === "graded").length;
            const pendingHomework = homeworkWithStatus.filter((h) => h.status === "pending").length;
            const overdueHomework = homeworkWithStatus.filter((h) => h.isOverdue).length;
            return {
                child: {
                    id: child._id,
                    studentId: child.studentId,
                    fullName: child.userId &&
                        typeof child.userId === "object" &&
                        "firstName" in child.userId &&
                        "lastName" in child.userId
                        ? `${child.userId.firstName} ${child.userId.lastName}`.trim()
                        : "",
                    grade: child.grade,
                    section: child.section,
                },
                summary: {
                    totalHomework,
                    completedHomework,
                    pendingHomework,
                    overdueHomework,
                    completionRate: totalHomework > 0
                        ? Math.round((completedHomework / totalHomework) * 100)
                        : 0,
                },
                homework: homeworkWithStatus,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to get child homework: ${error.message}`);
        }
    }
    async getChildSchedule(parentUserId, childId) {
        try {
            const parent = await parent_model_1.Parent.findOne({
                userId: parentUserId,
                children: childId,
            });
            if (!parent) {
                throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Access denied to this child's data");
            }
            const child = await student_model_1.Student.findById(childId).populate("userId", "firstName lastName");
            if (!child) {
                throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Child not found");
            }
            const schedule = await schedule_model_1.Schedule.aggregate([
                {
                    $match: {
                        grade: child.grade,
                        section: child.section,
                        isActive: true,
                    },
                },
                {
                    $lookup: {
                        from: "subjects",
                        localField: "subjectId",
                        foreignField: "_id",
                        as: "subject",
                    },
                },
                { $unwind: "$subject" },
                {
                    $lookup: {
                        from: "teachers",
                        localField: "teacherId",
                        foreignField: "_id",
                        as: "teacher",
                    },
                },
                { $unwind: "$teacher" },
                {
                    $lookup: {
                        from: "users",
                        localField: "teacher.userId",
                        foreignField: "_id",
                        as: "teacherUser",
                    },
                },
                { $unwind: "$teacherUser" },
                {
                    $lookup: {
                        from: "classes",
                        localField: "classId",
                        foreignField: "_id",
                        as: "class",
                    },
                },
                { $unwind: "$class" },
                {
                    $project: {
                        dayOfWeek: 1,
                        period: 1,
                        startTime: 1,
                        endTime: 1,
                        subject: "$subject.name",
                        subjectId: "$subject._id",
                        teacherName: "$teacherUser.fullName",
                        teacherId: "$teacher._id",
                        className: "$class.name",
                        room: 1,
                        isActive: 1,
                    },
                },
                { $sort: { dayOfWeek: 1, period: 1 } },
            ]);
            const daysOfWeek = [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
            ];
            const scheduleByDay = daysOfWeek.map((day) => ({
                day,
                periods: schedule
                    .filter((s) => s.dayOfWeek === day)
                    .sort((a, b) => a.period - b.period),
            }));
            return {
                child: {
                    id: child._id,
                    studentId: child.studentId,
                    fullName: child.userId &&
                        typeof child.userId === "object" &&
                        "firstName" in child.userId &&
                        "lastName" in child.userId
                        ? `${child.userId.firstName} ${child.userId.lastName}`.trim()
                        : "",
                    grade: child.grade,
                    section: child.section,
                },
                scheduleByDay,
                totalPeriods: schedule.length,
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to get child schedule: ${error.message}`);
        }
    }
    async getChildNotices(parentUserId, childId) {
        try {
            const parent = await parent_model_1.Parent.findOne({
                userId: parentUserId,
                children: childId,
            });
            if (!parent) {
                throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Access denied to this child's data");
            }
            const notices = await notification_model_1.Notification.find({
                $and: [
                    {
                        $or: [
                            { recipientId: parentUserId },
                            { recipientType: "parent" },
                            { recipientType: "all" },
                        ],
                    },
                    { schoolId: parent.schoolId },
                ],
            })
                .populate("senderId", "firstName lastName")
                .sort({ createdAt: -1 })
                .limit(50);
            return {
                notices: notices.map((notice) => ({
                    id: notice._id,
                    title: notice.title,
                    content: notice.message,
                    type: notice.type,
                    priority: notice.priority,
                    targetAudience: notice.recipientType,
                    createdAt: notice.createdAt,
                    isRead: notice.isRead,
                    createdBy: notice.senderId &&
                        typeof notice.senderId === "object" &&
                        "firstName" in notice.senderId &&
                        "lastName" in notice.senderId
                        ? `${notice.senderId.firstName} ${notice.senderId.lastName}`.trim()
                        : "System",
                })),
            };
        }
        catch (error) {
            if (error instanceof AppError_1.AppError)
                throw error;
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, `Failed to get child notices: ${error.message}`);
        }
    }
}
exports.parentService = new ParentService();
//# sourceMappingURL=parent.service.js.map