#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seeder_1 = require("../utils/seeder");
const DB_1 = require("../DB");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const args = process.argv.slice(2);
const command = args[0];
async function runCommand() {
    try {
        console.log('🔌 Connecting to database...');
        await DB_1.database.connect();
        console.log('✅ Database connected');
        switch (command) {
            case 'seed':
                await (0, seeder_1.seedDatabase)();
                break;
            case 'seed-superadmin':
                await (0, seeder_1.seedSuperadmin)();
                break;
            case 'validate':
                const isValid = await (0, seeder_1.validateSeeding)();
                if (isValid) {
                    console.log('✅ Validation passed');
                    process.exit(0);
                }
                else {
                    console.log('❌ Validation failed');
                    process.exit(1);
                }
                break;
            case 'reset-superadmin':
                await user_model_1.User.deleteMany({ role: user_interface_1.UserRole.SUPERADMIN });
                console.log('🌱 Creating new superadmin...');
                await (0, seeder_1.seedSuperadmin)();
                break;
            case 'list-users':
                const users = await user_model_1.User.find({}).select('username role firstName lastName isActive createdAt');
                console.table(users.map(user => ({
                    Username: user.username,
                    Role: user.role,
                    Name: `${user.firstName} ${user.lastName}`,
                    Active: user.isActive ? '✅' : '❌',
                    Created: user.createdAt?.toLocaleDateString()
                })));
                break;
            case 'help':
            default:
                break;
        }
        await DB_1.database.disconnect();
        console.log('✅ Operation completed successfully');
    }
    catch (error) {
        console.error('❌ Operation failed:', error);
        await DB_1.database.disconnect();
        process.exit(1);
    }
}
runCommand();
//# sourceMappingURL=seeder-cli.js.map