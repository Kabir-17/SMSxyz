"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const oldAttendanceSchema = new Schema({
    schoolId: { type: Schema.Types.ObjectId, ref: 'School' },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    classId: { type: Schema.Types.ObjectId, ref: 'Class' },
    date: Date,
    period: Number,
    status: String,
    markedAt: Date,
    modifiedAt: Date,
    modifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    modificationReason: String,
    isLocked: Boolean,
}, { timestamps: true });
const newAttendanceSchema = new Schema({
    schoolId: { type: Schema.Types.ObjectId, ref: 'School' },
    teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
    classId: { type: Schema.Types.ObjectId, ref: 'Class' },
    date: Date,
    period: Number,
    students: [{
            studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
            status: String,
            markedAt: Date,
            modifiedAt: Date,
            modifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
            modificationReason: String,
        }],
    markedAt: Date,
    modifiedAt: Date,
    modifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isLocked: Boolean,
}, { timestamps: true });
const OldAttendance = model('OldAttendance', oldAttendanceSchema, 'attendances');
const NewAttendance = model('NewAttendance', newAttendanceSchema, 'attendances_new');
async function migrateAttendance() {
    try {
        await (0, mongoose_1.connect)(config_1.default.mongodb_uri);
        console.log('✅ Connected to MongoDB');
        console.log('📊 Analyzing existing attendance data...');
        const uniqueCombinations = await OldAttendance.aggregate([
            {
                $group: {
                    _id: {
                        schoolId: '$schoolId',
                        teacherId: '$teacherId',
                        subjectId: '$subjectId',
                        classId: '$classId',
                        date: '$date',
                        period: '$period'
                    },
                    students: {
                        $push: {
                            studentId: '$studentId',
                            status: '$status',
                            markedAt: '$markedAt',
                            modifiedAt: '$modifiedAt',
                            modifiedBy: '$modifiedBy',
                            modificationReason: '$modificationReason'
                        }
                    },
                    firstMarkedAt: { $min: '$markedAt' },
                    lastModifiedAt: { $max: { $ifNull: ['$modifiedAt', '$markedAt'] } },
                    isLocked: { $max: '$isLocked' }
                }
            }
        ]);
        if (uniqueCombinations.length === 0) {
            return;
        }
        await NewAttendance.deleteMany({});
        let migratedCount = 0;
        const batchSize = 100;
        for (let i = 0; i < uniqueCombinations.length; i += batchSize) {
            const batch = uniqueCombinations.slice(i, i + batchSize);
            const newRecords = batch.map((combination) => ({
                schoolId: combination._id.schoolId,
                teacherId: combination._id.teacherId,
                subjectId: combination._id.subjectId,
                classId: combination._id.classId,
                date: combination._id.date,
                period: combination._id.period,
                students: combination.students,
                markedAt: combination.firstMarkedAt,
                modifiedAt: combination.lastModifiedAt,
                isLocked: combination.isLocked || false
            }));
            await NewAttendance.insertMany(newRecords);
            migratedCount += batch.length;
            console.log(`✅ Migrated ${migratedCount}/${uniqueCombinations.length} attendance sessions`);
        }
        console.log('🎉 Migration completed successfully!');
        const newCount = await NewAttendance.countDocuments();
        console.log('⚠️ IMPORTANT: Please verify the migrated data before dropping the old collection');
        console.log('⚠️ To complete migration, rename collections:');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
    }
    finally {
        await (0, mongoose_1.disconnect)();
        console.log('🔌 Disconnected from MongoDB');
    }
}
async function completeMigration() {
    try {
        await (0, mongoose_1.connect)(config_1.default.mongodb_uri);
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map((c) => c.name);
        if (!collectionNames.includes('attendances_new')) {
            throw new Error('Migration collection "attendances_new" not found. Run migration first.');
        }
        if (collectionNames.includes('attendances')) {
            await db.collection('attendances').rename('attendances_backup');
            console.log('✅ Backed up old collection to "attendances_backup"');
        }
        await db.collection('attendances_new').rename('attendances');
        console.log('✅ Renamed "attendances_new" to "attendances"');
        console.log('🎉 Migration completed! New attendance structure is now active.');
    }
    catch (error) {
        console.error('❌ Failed to complete migration:', error);
    }
    finally {
        await (0, mongoose_1.disconnect)();
    }
}
const command = process.argv[2];
if (command === 'migrate') {
    migrateAttendance();
}
else if (command === 'complete') {
    completeMigration();
}
else {
}
//# sourceMappingURL=migrate-attendance.js.map