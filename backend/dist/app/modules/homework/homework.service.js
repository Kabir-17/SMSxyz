"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeworkService = void 0;
const mongoose_1 = require("mongoose");
const homework_model_1 = require("./homework.model");
const AppError_1 = require("../../errors/AppError");
const student_model_1 = require("../student/student.model");
const teacher_model_1 = require("../teacher/teacher.model");
const subject_model_1 = require("../subject/subject.model");
const cloudinaryUtils_1 = require("../../utils/cloudinaryUtils");
class HomeworkService {
    async createHomework(data, teacherId, attachments) {
        const teacher = await teacher_model_1.Teacher.findById(data.teacherId).populate('schoolId');
        if (!teacher || teacher.id !== teacherId) {
            throw new AppError_1.AppError(403, 'Not authorized to create homework for this teacher');
        }
        const subject = await subject_model_1.Subject.findById(data.subjectId);
        if (!subject) {
            throw new AppError_1.AppError(404, 'Subject not found');
        }
        let attachmentUrls = [];
        if (attachments && attachments.length > 0) {
            if (attachments.length > 5) {
                throw new AppError_1.AppError(400, 'Maximum 5 attachments allowed per homework');
            }
            try {
                for (const file of attachments) {
                    const uploadResult = await (0, cloudinaryUtils_1.uploadToCloudinary)(file.buffer, {
                        folder: 'homework-attachments',
                        resource_type: 'auto',
                        use_filename: true,
                        unique_filename: true,
                    });
                    attachmentUrls.push(uploadResult.secure_url);
                }
            }
            catch (error) {
                throw new AppError_1.AppError(500, 'Failed to upload attachments');
            }
        }
        const homeworkData = {
            ...data,
            schoolId: new mongoose_1.Types.ObjectId(data.schoolId),
            teacherId: new mongoose_1.Types.ObjectId(data.teacherId),
            subjectId: new mongoose_1.Types.ObjectId(data.subjectId),
            classId: data.classId ? new mongoose_1.Types.ObjectId(data.classId) : undefined,
            assignedDate: new Date(data.assignedDate),
            dueDate: new Date(data.dueDate),
            attachments: attachmentUrls,
            isPublished: false,
        };
        const homework = await homework_model_1.Homework.create(homeworkData);
        return this.formatHomeworkResponse(homework);
    }
    async getHomeworkById(id, userId, userRole) {
        const homework = await homework_model_1.Homework.findById(id)
            .populate('teacherId', 'userId teacherId')
            .populate('subjectId', 'name code')
            .populate('schoolId', 'name');
        if (!homework) {
            throw new AppError_1.AppError(404, 'Homework not found');
        }
        if (userRole === 'teacher') {
            const teacher = await teacher_model_1.Teacher.findOne({ userId });
            if (!teacher || homework.teacherId.toString() !== teacher._id.toString()) {
                throw new AppError_1.AppError(403, 'Not authorized to view this homework');
            }
        }
        else if (userRole === 'student') {
            const student = await student_model_1.Student.findOne({ userId });
            if (!student || homework.schoolId.toString() !== student.schoolId.toString() ||
                homework.grade !== student.grade ||
                (homework.section && homework.section !== student.section)) {
                throw new AppError_1.AppError(403, 'Not authorized to view this homework');
            }
        }
        const formattedHomework = this.formatHomeworkResponse(homework);
        if (userRole === 'teacher') {
            formattedHomework.submissionStats = await homework.getSubmissionStats();
        }
        if (userRole === 'student') {
            const student = await student_model_1.Student.findOne({ userId });
            if (student) {
                const submission = await homework_model_1.HomeworkSubmission.findOne({
                    homeworkId: homework._id,
                    studentId: student._id,
                });
                if (submission) {
                    formattedHomework.mySubmission = this.formatSubmissionResponse(submission);
                }
            }
        }
        return formattedHomework;
    }
    async updateHomework(id, data, userId, newAttachments) {
        const homework = await homework_model_1.Homework.findById(id);
        if (!homework) {
            throw new AppError_1.AppError(404, 'Homework not found');
        }
        const teacher = await teacher_model_1.Teacher.findOne({ userId });
        if (!teacher || homework.teacherId.toString() !== teacher._id.toString()) {
            throw new AppError_1.AppError(403, 'Not authorized to update this homework');
        }
        if (homework.isPublished) {
            const submissionCount = await homework_model_1.HomeworkSubmission.countDocuments({ homeworkId: id });
            if (submissionCount > 0 && (data.totalMarks || data.passingMarks || data.dueDate)) {
                throw new AppError_1.AppError(400, 'Cannot update critical fields when submissions exist');
            }
        }
        let newAttachmentUrls = [];
        if (newAttachments && newAttachments.length > 0) {
            try {
                for (const file of newAttachments) {
                    const uploadResult = await (0, cloudinaryUtils_1.uploadToCloudinary)(file.buffer, {
                        folder: 'homework-attachments',
                        resource_type: 'auto',
                        use_filename: true,
                        unique_filename: true,
                    });
                    newAttachmentUrls.push(uploadResult.secure_url);
                }
                const existingAttachments = homework.attachments || [];
                data.attachments = [...existingAttachments, ...newAttachmentUrls];
            }
            catch (error) {
                throw new AppError_1.AppError(500, 'Failed to upload attachments');
            }
        }
        const updateData = { ...data };
        if (data.dueDate) {
            updateData.dueDate = new Date(data.dueDate);
        }
        const updatedHomework = await homework_model_1.Homework.findByIdAndUpdate(id, updateData, { new: true })
            .populate('teacherId', 'userId teacherId')
            .populate('subjectId', 'name code')
            .populate('schoolId', 'name');
        if (!updatedHomework) {
            throw new AppError_1.AppError(404, 'Homework not found after update');
        }
        return this.formatHomeworkResponse(updatedHomework);
    }
    async deleteHomework(id, userId) {
        const homework = await homework_model_1.Homework.findById(id);
        if (!homework) {
            throw new AppError_1.AppError(404, 'Homework not found');
        }
        const teacher = await teacher_model_1.Teacher.findOne({ userId });
        if (!teacher || homework.teacherId.toString() !== teacher._id.toString()) {
            throw new AppError_1.AppError(403, 'Not authorized to delete this homework');
        }
        const submissionCount = await homework_model_1.HomeworkSubmission.countDocuments({ homeworkId: id });
        if (submissionCount > 0) {
            throw new AppError_1.AppError(400, 'Cannot delete homework with existing submissions');
        }
        await homework_model_1.Homework.findByIdAndDelete(id);
    }
    async publishHomework(id, userId) {
        const homework = await homework_model_1.Homework.findById(id);
        if (!homework) {
            throw new AppError_1.AppError(404, 'Homework not found');
        }
        const teacher = await teacher_model_1.Teacher.findOne({ userId });
        if (!teacher || homework.teacherId.toString() !== teacher._id.toString()) {
            throw new AppError_1.AppError(403, 'Not authorized to publish this homework');
        }
        homework.isPublished = true;
        await homework.save();
        const updatedHomework = await homework_model_1.Homework.findById(id)
            .populate('teacherId', 'userId teacherId')
            .populate('subjectId', 'name code')
            .populate('schoolId', 'name');
        return this.formatHomeworkResponse(updatedHomework);
    }
    async getHomeworkForTeacher(teacherId, filters) {
        const teacher = await teacher_model_1.Teacher.findById(teacherId);
        if (!teacher) {
            throw new AppError_1.AppError(404, 'Teacher not found');
        }
        const homework = await homework_model_1.Homework.findByTeacher(teacherId);
        const sortedHomework = homework.sort((a, b) => {
            const aDate = a.updatedAt || a.createdAt || new Date(0);
            const bDate = b.updatedAt || b.createdAt || new Date(0);
            return bDate.getTime() - aDate.getTime();
        });
        return sortedHomework.map(hw => this.formatHomeworkResponse(hw));
    }
    async getHomeworkForStudent(studentId, filters) {
        const student = await student_model_1.Student.findById(studentId);
        if (!student) {
            throw new AppError_1.AppError(404, 'Student not found');
        }
        const homework = await homework_model_1.Homework.findByStudent(studentId);
        const homeworkWithSubmissions = await Promise.all(homework.map(async (hw) => {
            const formatted = this.formatHomeworkResponse(hw);
            const submission = await homework_model_1.HomeworkSubmission.findOne({
                homeworkId: hw._id,
                studentId: student._id,
            });
            if (submission) {
                formatted.mySubmission = this.formatSubmissionResponse(submission);
            }
            return formatted;
        }));
        return homeworkWithSubmissions;
    }
    async getHomeworkForClass(schoolId, grade, section, filters) {
        const homework = await homework_model_1.Homework.findByClass(schoolId, grade, section);
        return homework.map(hw => this.formatHomeworkResponse(hw));
    }
    async submitHomework(data, userId) {
        const student = await student_model_1.Student.findOne({ userId });
        if (!student || student._id.toString() !== data.studentId) {
            throw new AppError_1.AppError(403, 'Not authorized to submit homework for this student');
        }
        const homework = await homework_model_1.Homework.findById(data.homeworkId);
        if (!homework) {
            throw new AppError_1.AppError(404, 'Homework not found');
        }
        if (!homework.canSubmit()) {
            throw new AppError_1.AppError(400, 'Homework cannot be submitted at this time');
        }
        const existingSubmission = await homework_model_1.HomeworkSubmission.findOne({
            homeworkId: data.homeworkId,
            studentId: data.studentId,
        });
        if (existingSubmission) {
            throw new AppError_1.AppError(400, 'Homework already submitted');
        }
        if (homework.isGroupWork && data.groupMembers) {
            if (data.groupMembers.length > homework.maxGroupSize) {
                throw new AppError_1.AppError(400, `Group size cannot exceed ${homework.maxGroupSize} members`);
            }
            const groupMembers = await student_model_1.Student.find({
                _id: { $in: data.groupMembers },
                schoolId: student.schoolId,
                grade: student.grade,
                section: student.section,
                isActive: true,
            });
            if (groupMembers.length !== data.groupMembers.length) {
                throw new AppError_1.AppError(400, 'All group members must be from the same class');
            }
        }
        const submissionData = {
            homeworkId: new mongoose_1.Types.ObjectId(data.homeworkId),
            studentId: new mongoose_1.Types.ObjectId(data.studentId),
            groupMembers: data.groupMembers?.map(id => new mongoose_1.Types.ObjectId(id)),
            submissionText: data.submissionText,
            attachments: data.attachments,
            submittedAt: new Date(),
        };
        const submission = await homework_model_1.HomeworkSubmission.create(submissionData);
        return this.formatSubmissionResponse(submission);
    }
    async gradeHomeworkSubmission(submissionId, marksObtained, feedback, teacherComments, userId) {
        const submission = await homework_model_1.HomeworkSubmission.findById(submissionId)
            .populate('homeworkId')
            .populate('studentId');
        if (!submission) {
            throw new AppError_1.AppError(404, 'Homework submission not found');
        }
        const homework = submission.homeworkId;
        if (userId) {
            const teacher = await teacher_model_1.Teacher.findOne({ userId });
            if (!teacher || homework.teacherId.toString() !== teacher._id.toString()) {
                throw new AppError_1.AppError(403, 'Not authorized to grade this submission');
            }
            submission.gradedBy = teacher.userId;
        }
        if (marksObtained > homework.totalMarks) {
            throw new AppError_1.AppError(400, 'Marks obtained cannot exceed total marks');
        }
        submission.marksObtained = marksObtained;
        submission.feedback = feedback;
        submission.teacherComments = teacherComments;
        submission.status = 'graded';
        submission.gradedAt = new Date();
        await submission.save();
        return this.formatSubmissionResponse(submission);
    }
    async getHomeworkSubmissions(homeworkId, userId) {
        const homework = await homework_model_1.Homework.findById(homeworkId);
        if (!homework) {
            throw new AppError_1.AppError(404, 'Homework not found');
        }
        const teacher = await teacher_model_1.Teacher.findOne({ userId });
        if (!teacher || homework.teacherId.toString() !== teacher._id.toString()) {
            throw new AppError_1.AppError(403, 'Not authorized to view submissions for this homework');
        }
        const submissions = await homework_model_1.HomeworkSubmission.find({ homeworkId })
            .populate('studentId', 'userId studentId rollNumber')
            .populate('groupMembers', 'userId studentId rollNumber')
            .sort({ submittedAt: -1 });
        return submissions.map(submission => this.formatSubmissionResponse(submission));
    }
    async getHomeworkCalendar(schoolId, startDate, endDate, grade, section) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const query = {
            schoolId,
            isPublished: true,
            dueDate: { $gte: start, $lte: end },
        };
        if (grade)
            query.grade = grade;
        if (section)
            query.section = section;
        const homework = await homework_model_1.Homework.find(query)
            .populate('teacherId', 'userId teacherId')
            .populate('subjectId', 'name code')
            .sort({ dueDate: 1 });
        const homeworkByDate = {};
        homework.forEach(hw => {
            const dateKey = hw.dueDate.toISOString().split('T')[0];
            if (!homeworkByDate[dateKey]) {
                homeworkByDate[dateKey] = [];
            }
            homeworkByDate[dateKey].push(this.formatHomeworkResponse(hw));
        });
        const calendarData = [];
        Object.entries(homeworkByDate).forEach(([date, homeworkList]) => {
            calendarData.push({
                date: new Date(date),
                homework: homeworkList,
            });
        });
        const totalHomework = homework.length;
        const now = new Date();
        const overdueCount = homework.filter(hw => hw.dueDate < now).length;
        const dueTodayCount = homework.filter(hw => hw.isDueToday()).length;
        const upcomingCount = homework.filter(hw => hw.dueDate > now).length;
        const byPriority = this.groupBy(homework, 'priority');
        const byType = this.groupBy(homework, 'homeworkType');
        return {
            startDate: start,
            endDate: end,
            grade,
            section,
            homework: calendarData,
            summary: {
                totalHomework,
                overdueCount,
                dueTodayCount,
                upcomingCount,
                byPriority: Object.entries(byPriority).map(([priority, count]) => ({ priority, count })),
                bySubject: [],
                byType: Object.entries(byType).map(([homeworkType, count]) => ({ homeworkType, count })),
            },
        };
    }
    async requestRevision(submissionId, reason, userId) {
        const submission = await homework_model_1.HomeworkSubmission.findById(submissionId)
            .populate('homeworkId')
            .populate('studentId');
        if (!submission) {
            throw new AppError_1.AppError(404, 'Homework submission not found');
        }
        const homework = submission.homeworkId;
        const teacher = await teacher_model_1.Teacher.findOne({ userId });
        if (!teacher || homework.teacherId.toString() !== teacher._id.toString()) {
            throw new AppError_1.AppError(403, 'Not authorized to request revision for this submission');
        }
        submission.revision = {
            requested: true,
            requestedAt: new Date(),
            reason,
            completed: false,
        };
        submission.status = 'returned';
        await submission.save();
        return this.formatSubmissionResponse(submission);
    }
    formatHomeworkResponse(homework) {
        const formatted = homework.toJSON();
        if (homework.schoolId && typeof homework.schoolId === 'object') {
            formatted.school = {
                id: homework.schoolId._id.toString(),
                name: homework.schoolId.name,
            };
        }
        if (homework.teacherId && typeof homework.teacherId === 'object') {
            const teacher = homework.teacherId;
            formatted.teacher = {
                id: teacher._id.toString(),
                userId: teacher.userId?.toString(),
                teacherId: teacher.teacherId,
                fullName: teacher.userId ? `${teacher.userId.firstName} ${teacher.userId.lastName}` : 'Unknown Teacher',
            };
        }
        if (homework.subjectId && typeof homework.subjectId === 'object') {
            const subject = homework.subjectId;
            formatted.subject = {
                id: subject._id.toString(),
                name: subject.name,
                code: subject.code,
            };
        }
        return formatted;
    }
    formatSubmissionResponse(submission) {
        const formatted = submission.toJSON();
        if (submission.studentId && typeof submission.studentId === 'object') {
            const student = submission.studentId;
            formatted.student = {
                id: student._id.toString(),
                userId: student.userId?.toString(),
                studentId: student.studentId,
                fullName: student.userId ? `${student.userId.firstName} ${student.userId.lastName}` : 'Unknown Student',
                rollNumber: student.rollNumber,
            };
        }
        if (submission.groupMembers && submission.groupMembers.length > 0) {
            formatted.groupMemberDetails = submission.groupMembers
                .filter((member) => typeof member === 'object')
                .map((member) => ({
                id: member._id.toString(),
                fullName: member.userId ? `${member.userId.firstName} ${member.userId.lastName}` : 'Unknown Student',
                rollNumber: member.rollNumber,
            }));
        }
        return formatted;
    }
    groupBy(array, key) {
        return array.reduce((result, item) => {
            const group = item[key];
            result[group] = (result[group] || 0) + 1;
            return result;
        }, {});
    }
}
exports.homeworkService = new HomeworkService();
//# sourceMappingURL=homework.service.js.map