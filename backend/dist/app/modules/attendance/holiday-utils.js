"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHolidayForClassOnDate = exports.findHolidayEventsForClass = void 0;
const mongoose_1 = require("mongoose");
const date_fns_tz_1 = require("date-fns-tz");
const config_1 = __importDefault(require("../../config"));
const event_model_1 = require("../event/event.model");
const normalizeSection = (value) => (value ?? '').trim().toUpperCase();
const appliesToClass = (event, grade, section) => {
    const audience = event.targetAudience || {};
    const roles = Array.isArray(audience.roles) && audience.roles.length
        ? audience.roles
        : ['student', 'teacher', 'parent'];
    if (!roles.includes('student') && !roles.includes('teacher')) {
        return false;
    }
    const grades = Array.isArray(audience.grades)
        ? audience.grades
        : [];
    const sections = Array.isArray(audience.sections)
        ? audience.sections.map(normalizeSection).filter(Boolean)
        : [];
    const gradeMatches = grade === undefined ||
        grade === null ||
        grades.length === 0 ||
        grades.includes(grade);
    const sectionMatches = !section ||
        sections.length === 0 ||
        sections.includes(normalizeSection(section));
    if (!gradeMatches || !sectionMatches) {
        return false;
    }
    const specificUsers = Array.isArray(audience.specificUsers)
        ? audience.specificUsers
        : [];
    if (specificUsers.length > 0) {
        return false;
    }
    return true;
};
const findHolidayEventsForClass = async (options) => {
    const { schoolId, dateKey, timezone = config_1.default.school_timezone || 'UTC', grade, section, } = options;
    const startOfDayUtc = (0, date_fns_tz_1.fromZonedTime)(new Date(`${dateKey}T00:00:00`), timezone);
    const endOfDayUtc = (0, date_fns_tz_1.fromZonedTime)(new Date(`${dateKey}T23:59:59.999`), timezone);
    const events = await event_model_1.Event.find({
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        isActive: true,
        type: 'holiday',
        date: {
            $gte: startOfDayUtc,
            $lte: endOfDayUtc,
        },
    })
        .select('targetAudience title date')
        .lean();
    return events.filter((event) => appliesToClass(event, grade, section));
};
exports.findHolidayEventsForClass = findHolidayEventsForClass;
const isHolidayForClassOnDate = async (options) => {
    const holidays = await (0, exports.findHolidayEventsForClass)(options);
    return holidays.length > 0;
};
exports.isHolidayForClassOnDate = isHolidayForClassOnDate;
//# sourceMappingURL=holiday-utils.js.map