#!/usr/bin/env ts-node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const seed_events_1 = require("./seed-events");
async function runEventSeeding() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        if (!config_1.default.mongodb_uri) {
            throw new Error('Database URL not configured');
        }
        await mongoose_1.default.connect(config_1.default.mongodb_uri);
        console.log('✅ Connected to MongoDB');
        await (0, seed_events_1.seedEvents)();
    }
    catch (error) {
        console.error('❌ Error during event seeding:', error);
        process.exit(1);
    }
    finally {
        await mongoose_1.default.connection.close();
        console.log('📡 Database connection closed');
        process.exit(0);
    }
}
runEventSeeding();
//# sourceMappingURL=run-event-seeder.js.map