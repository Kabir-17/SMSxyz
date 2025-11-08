"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedEvents = void 0;
const event_model_1 = require("../modules/event/event.model");
const school_model_1 = require("../modules/school/school.model");
const user_model_1 = require("../modules/user/user.model");
const seedEvents = async () => {
    try {
        console.log('🌱 Seeding events...');
        const school = await school_model_1.School.findOne();
        const adminUser = await user_model_1.User.findOne({ role: 'admin' });
        if (!school || !adminUser) {
            console.log('❌ No school or admin user found. Please create them first.');
            return;
        }
        await event_model_1.Event.deleteMany({ schoolId: school._id });
        const sampleEvents = [
            {
                title: 'Annual Sports Day',
                description: 'Annual sports competition for all grades. Includes track and field events, team sports, and award ceremony.',
                date: new Date(2025, 10, 15),
                time: '09:00',
                location: 'School Sports Ground',
                type: 'extracurricular',
                targetAudience: {
                    roles: ['student', 'parent', 'teacher'],
                    grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                },
                schoolId: school._id,
                createdBy: adminUser._id,
                isActive: true
            },
            {
                title: 'Mid-Term Examinations',
                description: 'Mid-term examinations for all grades. Students must arrive 30 minutes before exam time.',
                date: new Date(2025, 10, 20),
                time: '10:00',
                location: 'Examination Halls',
                type: 'exam',
                targetAudience: {
                    roles: ['student', 'parent', 'teacher'],
                    grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                },
                schoolId: school._id,
                createdBy: adminUser._id,
                isActive: true
            },
            {
                title: 'Parent-Teacher Meeting - Grade 6',
                description: 'Quarterly parent-teacher meeting to discuss student progress and upcoming academic plans.',
                date: new Date(2025, 10, 12),
                time: '14:00',
                location: 'Grade 6 Classrooms',
                type: 'meeting',
                targetAudience: {
                    roles: ['parent', 'teacher'],
                    grades: [6]
                },
                schoolId: school._id,
                createdBy: adminUser._id,
                isActive: true
            },
            {
                title: 'Winter Break Holiday',
                description: 'School will be closed for winter break. Classes will resume on January 5th.',
                date: new Date(2025, 11, 25),
                type: 'holiday',
                targetAudience: {
                    roles: ['student', 'parent', 'teacher', 'admin']
                },
                schoolId: school._id,
                createdBy: adminUser._id,
                isActive: true
            },
            {
                title: 'Science Fair 2025',
                description: 'Annual science fair showcasing student projects and innovations. Open to all grades.',
                date: new Date(2025, 10, 8),
                time: '11:00',
                location: 'School Auditorium',
                type: 'academic',
                targetAudience: {
                    roles: ['student', 'parent', 'teacher'],
                    grades: [4, 5, 6, 7, 8, 9, 10, 11, 12]
                },
                schoolId: school._id,
                createdBy: adminUser._id,
                isActive: true
            },
            {
                title: 'Today\'s Assembly',
                description: 'Daily morning assembly with announcements and student presentations.',
                date: new Date(),
                time: '08:30',
                location: 'School Assembly Hall',
                type: 'announcement',
                targetAudience: {
                    roles: ['student', 'teacher'],
                    grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                },
                schoolId: school._id,
                createdBy: adminUser._id,
                isActive: true
            },
            {
                title: 'Staff Meeting',
                description: 'Monthly staff meeting to discuss curriculum updates and administrative matters.',
                date: new Date(2025, 10, 5),
                time: '15:30',
                location: 'Staff Room',
                type: 'administrative',
                targetAudience: {
                    roles: ['teacher', 'admin']
                },
                schoolId: school._id,
                createdBy: adminUser._id,
                isActive: true
            },
            {
                title: 'Library Reading Week',
                description: 'Special week dedicated to promoting reading habits among students. Various activities planned.',
                date: new Date(2025, 10, 18),
                time: '10:00',
                location: 'School Library',
                type: 'academic',
                targetAudience: {
                    roles: ['student', 'teacher'],
                    grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                },
                schoolId: school._id,
                createdBy: adminUser._id,
                isActive: true
            }
        ];
        const createdEvents = await event_model_1.Event.insertMany(sampleEvents);
        console.log(`✅ Successfully seeded ${createdEvents.length} events for school: ${school.name}`);
        createdEvents.forEach(event => {
        });
    }
    catch (error) {
        console.error('❌ Error seeding events:', error);
    }
};
exports.seedEvents = seedEvents;
//# sourceMappingURL=seed-events.js.map