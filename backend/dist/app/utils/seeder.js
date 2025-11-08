"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSampleSubjects = seedSampleSubjects;
exports.seedSuperadmin = seedSuperadmin;
exports.seedDatabase = seedDatabase;
exports.validateSeeding = validateSeeding;
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const subject_model_1 = require("../modules/subject/subject.model");
const seed_events_1 = require("../scripts/seed-events");
const config_1 = __importDefault(require("../config"));
async function seedSampleSubjects(schoolId) {
    try {
        console.log('🌱 Checking for existing subjects...');
        if (!schoolId) {
            console.log('⚠️  No school ID provided, skipping subject seeding');
            return;
        }
        const existingSubjects = await subject_model_1.Subject.findOne({ schoolId });
        if (existingSubjects) {
            console.log('✅ Subjects already exist for this school');
            return;
        }
        console.log('🌱 Creating sample subjects...');
        const sampleSubjects = [
            {
                schoolId,
                name: 'Mathematics',
                code: 'MATH',
                description: 'Core mathematics curriculum',
                grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                isCore: true,
                credits: 4,
                teachers: [],
                isActive: true,
            },
            {
                schoolId,
                name: 'English Language Arts',
                code: 'ELA',
                description: 'English language and literature',
                grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                isCore: true,
                credits: 4,
                teachers: [],
                isActive: true,
            },
            {
                schoolId,
                name: 'Science',
                code: 'SCI',
                description: 'General science curriculum',
                grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                isCore: true,
                credits: 3,
                teachers: [],
                isActive: true,
            },
            {
                schoolId,
                name: 'Social Studies',
                code: 'SS',
                description: 'History and social sciences',
                grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                isCore: true,
                credits: 3,
                teachers: [],
                isActive: true,
            },
            {
                schoolId,
                name: 'Physical Education',
                code: 'PE',
                description: 'Physical education and health',
                grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                isCore: false,
                credits: 2,
                teachers: [],
                isActive: true,
            },
            {
                schoolId,
                name: 'Art',
                code: 'ART',
                description: 'Visual arts and creative expression',
                grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                isCore: false,
                credits: 1,
                teachers: [],
                isActive: true,
            },
        ];
        const subjects = await subject_model_1.Subject.insertMany(sampleSubjects);
        console.log('✅ Sample subjects created successfully:');
        subjects.forEach(subject => {
        });
    }
    catch (error) {
        console.error('❌ Error seeding sample subjects:', error);
        throw error;
    }
}
async function seedSuperadmin() {
    try {
        console.log('🌱 Checking for existing superadmin...');
        const existingSuperadmin = await user_model_1.User.findOne({ role: user_interface_1.UserRole.SUPERADMIN });
        if (existingSuperadmin) {
            console.log('✅ Superadmin already exists:', existingSuperadmin.username);
            return;
        }
        console.log('🌱 Creating initial superadmin user...');
        const superadminData = {
            schoolId: null,
            role: user_interface_1.UserRole.SUPERADMIN,
            username: config_1.default.superadmin_username || 'superadmin',
            passwordHash: config_1.default.superadmin_password || 'superadmin123',
            firstName: 'Super',
            lastName: 'Administrator',
            email: config_1.default.superadmin_email || 'superadmin@schoolmanagement.com',
            phone: '+1234567890',
            isActive: true,
        };
        const superadmin = await user_model_1.User.create(superadminData);
        console.log('✅ Superadmin created successfully:');
        console.log('⚠️  Please change the default password after first login!');
    }
    catch (error) {
        console.error('❌ Error seeding superadmin:', error);
        throw error;
    }
}
async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');
        await seedSuperadmin();
        await (0, seed_events_1.seedEvents)();
        console.log('✅ Database seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Database seeding failed:', error);
        throw error;
    }
}
async function validateSeeding() {
    try {
        const superadmin = await user_model_1.User.findOne({ role: user_interface_1.UserRole.SUPERADMIN });
        if (!superadmin) {
            console.error('❌ Validation failed: No superadmin user found');
            return false;
        }
        if (!superadmin.isActive) {
            console.error('❌ Validation failed: Superadmin user is not active');
            return false;
        }
        console.log('✅ Seeding validation passed');
        return true;
    }
    catch (error) {
        console.error('❌ Error validating seeding:', error);
        return false;
    }
}
//# sourceMappingURL=seeder.js.map