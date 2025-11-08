"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoose = exports.database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.mongoose = mongoose_1.default;
const config_1 = __importDefault(require("../config"));
const seeder_1 = require("../utils/seeder");
class Database {
    constructor() { }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connect() {
        try {
            const options = {
                maxPoolSize: 500,
                minPoolSize: 50,
                socketTimeoutMS: 30000,
                serverSelectionTimeoutMS: 10000,
                bufferCommands: false,
                monitorCommands: true,
            };
            await mongoose_1.default.connect(config_1.default.mongodb_uri, options);
            mongoose_1.default.connection.on('connected', async () => {
                console.log('✅ MongoDB connected successfully');
                try {
                    await (0, seeder_1.seedDatabase)();
                    const isValid = await (0, seeder_1.validateSeeding)();
                    if (!isValid) {
                        console.warn('⚠️ Seeding validation failed - some issues detected');
                    }
                }
                catch (error) {
                    console.error('❌ Database seeding error:', error);
                }
            });
            mongoose_1.default.connection.on('error', (err) => {
                console.error('❌ Mongoose connection error:', err);
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.warn('⚠️ MongoDB disconnected');
            });
            mongoose_1.default.connection.on('connectionPoolCreated', (event) => {
                console.log(`[MongoDB] Connection pool created`);
            });
            mongoose_1.default.connection.on('connectionPoolClosed', (event) => {
                console.warn(`[MongoDB] Connection pool closed`);
            });
            mongoose_1.default.connection.on('connectionPoolCleared', (event) => {
                console.error(`[MongoDB] Connection pool cleared (connection error detected)`);
            });
            mongoose_1.default.connection.on('connectionCheckOutFailed', (event) => {
                console.error(`[MongoDB] Connection checkout failed - Pool may be exhausted. This indicates high load.`);
            });
            process.on('SIGINT', async () => {
                await this.disconnect();
                process.exit(0);
            });
        }
        catch (error) {
            console.error('❌ Failed to connect to MongoDB:', error);
            process.exit(1);
        }
    }
    async disconnect() {
        try {
            await mongoose_1.default.connection.close();
        }
        catch (error) {
            console.error('❌ Error while disconnecting from MongoDB:', error);
        }
    }
    getConnection() {
        return mongoose_1.default.connection;
    }
    async dropDatabase() {
        if (config_1.default.node_env === 'test') {
            await mongoose_1.default.connection.dropDatabase();
        }
        else {
            throw new Error('Database drop is only allowed in test environment');
        }
    }
    async clearCollections() {
        if (config_1.default.node_env === 'test') {
            const collections = mongoose_1.default.connection.collections;
            for (const key in collections) {
                const collection = collections[key];
                await collection.deleteMany({});
            }
        }
        else {
            throw new Error('Collection clearing is only allowed in test environment');
        }
    }
    isConnected() {
        return mongoose_1.default.connection.readyState === 1;
    }
}
exports.database = Database.getInstance();
exports.default = exports.database;
//# sourceMappingURL=index.js.map