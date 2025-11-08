"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopAbsenceSmsScheduler = exports.startAbsenceSmsScheduler = void 0;
const config_1 = __importDefault(require("../../config"));
const absence_sms_service_1 = require("./absence-sms.service");
let intervalHandle = null;
const MIN_INTERVAL_MS = 60 * 1000;
const resolveInterval = () => {
    const candidate = Number(config_1.default.absence_sms_dispatch_interval_minutes);
    const minutes = Number.isFinite(candidate) && candidate > 0 ? candidate : 5;
    return Math.max(minutes * 60 * 1000, MIN_INTERVAL_MS);
};
const startAbsenceSmsScheduler = () => {
    if (intervalHandle) {
        return;
    }
    const intervalMs = resolveInterval();
    const run = async () => {
        try {
            await absence_sms_service_1.attendanceAbsenceSmsService.runScheduledDispatch();
        }
        catch (error) {
            console.error('[AbsenceSmsScheduler] Failed to dispatch absence SMS:', error);
        }
    };
    void run();
    intervalHandle = setInterval(run, intervalMs);
};
exports.startAbsenceSmsScheduler = startAbsenceSmsScheduler;
const stopAbsenceSmsScheduler = () => {
    if (intervalHandle) {
        clearInterval(intervalHandle);
        intervalHandle = null;
    }
};
exports.stopAbsenceSmsScheduler = stopAbsenceSmsScheduler;
//# sourceMappingURL=absence-sms.scheduler.js.map