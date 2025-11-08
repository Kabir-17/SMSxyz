"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = __importDefault(require("../DB"));
const student_model_1 = require("../modules/student/student.model");
const event_model_1 = require("../modules/event/event.model");
async function checkStudentEvents() {
    try {
        await DB_1.default.connect();
        const student = await student_model_1.Student.findById('68de1e892ff4ba32259c78db');
        if (!student) {
            return;
        }
        const allEvents = await event_model_1.Event.find({ isActive: true });
        if (allEvents.length > 0) {
            allEvents.slice(0, 3).forEach(event => {
            });
        }
        const studentEvents = await event_model_1.Event.find({
            isActive: true,
            'targetAudience.roles': { $in: ['student'] },
            $or: [
                { 'targetAudience.grades': { $in: [student.grade] } },
                { 'targetAudience.grades': { $exists: false } },
                { 'targetAudience.grades': { $size: 0 } }
            ]
        });
        studentEvents.forEach(event => {
        });
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
checkStudentEvents();
//# sourceMappingURL=check-student-events.js.map