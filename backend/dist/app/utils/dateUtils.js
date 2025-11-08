"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchoolDate = getSchoolDate;
exports.parseSchoolDate = parseSchoolDate;
exports.getCurrentSchoolDate = getCurrentSchoolDate;
exports.formatSchoolDate = formatSchoolDate;
exports.isValidTimezone = isValidTimezone;
exports.normaliseDateKey = normaliseDateKey;
const date_fns_tz_1 = require("date-fns-tz");
const config_1 = __importDefault(require("../config"));
function getSchoolDate(date, timezone = config_1.default.school_timezone || 'UTC') {
    try {
        const zonedDate = (0, date_fns_tz_1.toZonedTime)(date, timezone);
        zonedDate.setHours(0, 0, 0, 0);
        const dateKey = (0, date_fns_tz_1.format)(zonedDate, 'yyyy-MM-dd', { timeZone: timezone });
        return { date: zonedDate, dateKey };
    }
    catch (error) {
        console.error(`[dateUtils] Error converting date to timezone ${timezone}:`, error);
        const utcDate = new Date(date);
        utcDate.setUTCHours(0, 0, 0, 0);
        const dateKey = utcDate.toISOString().split('T')[0];
        return { date: utcDate, dateKey };
    }
}
function parseSchoolDate(dateString, timezone = config_1.default.school_timezone || 'UTC') {
    try {
        const localDate = new Date(dateString + 'T00:00:00');
        return (0, date_fns_tz_1.fromZonedTime)(localDate, timezone);
    }
    catch (error) {
        console.error(`[dateUtils] Error parsing date string ${dateString}:`, error);
        return new Date(dateString);
    }
}
function getCurrentSchoolDate(timezone) {
    return getSchoolDate(new Date(), timezone);
}
function formatSchoolDate(date, formatStr = 'yyyy-MM-dd', timezone = config_1.default.school_timezone || 'UTC') {
    try {
        const zonedDate = (0, date_fns_tz_1.toZonedTime)(date, timezone);
        return (0, date_fns_tz_1.format)(zonedDate, formatStr, { timeZone: timezone });
    }
    catch (error) {
        console.error(`[dateUtils] Error formatting date:`, error);
        return date.toISOString().split('T')[0];
    }
}
function isValidTimezone(timezone) {
    try {
        Intl.DateTimeFormat(undefined, { timeZone: timezone });
        return true;
    }
    catch {
        return false;
    }
}
function normaliseDateKey(date) {
    return getSchoolDate(date, 'UTC');
}
//# sourceMappingURL=dateUtils.js.map