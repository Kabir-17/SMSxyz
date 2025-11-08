"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const DB_1 = require("./app/DB");
const absence_sms_scheduler_1 = require("./app/modules/attendance/absence-sms.scheduler");
async function main() {
    try {
        await DB_1.database.connect();
        const server = app_1.default.listen(config_1.default.port, () => {
            console.log(`🚀 School Management API server is running on port ${config_1.default.port}`);
            console.log(`📝 API Documentation: http://localhost:${config_1.default.port}/api/docs`);
            console.log(`🌍 Environment: ${config_1.default.node_env}`);
            (0, absence_sms_scheduler_1.startAbsenceSmsScheduler)();
        });
        const gracefulShutdown = (signal) => {
            server.close(async () => {
                try {
                    (0, absence_sms_scheduler_1.stopAbsenceSmsScheduler)();
                    await DB_1.database.disconnect();
                    console.log('✅ Database connection closed');
                    console.log('👋 Server shut down successfully');
                    process.exit(0);
                }
                catch (error) {
                    console.error('❌ Error during shutdown:', error);
                    process.exit(1);
                }
            });
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err.message);
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    process.exit(1);
});
main();
//# sourceMappingURL=server.js.map