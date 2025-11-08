"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../app/config"));
const student_model_1 = require("../app/modules/student/student.model");
const addAddressToExistingStudents = async () => {
    try {
        await mongoose_1.default.connect(config_1.default.mongodb_uri);
        const studentsWithoutAddress = await student_model_1.Student.find({
            $or: [
                { address: { $exists: false } },
                { address: null },
                { "address.street": { $exists: false } },
                { "address.city": { $exists: false } },
                { "address.street": "" },
                { "address.city": "" },
                { "address.street": { $in: ["", null] } },
                { "address.city": { $in: ["", null] } },
            ],
        });
        const result = await student_model_1.Student.updateMany({
            $or: [
                { address: { $exists: false } },
                { address: null },
                { "address.street": { $exists: false } },
                { "address.city": { $exists: false } },
                { "address.street": "" },
                { "address.city": "" },
                { "address.street": { $in: ["", null] } },
                { "address.city": { $in: ["", null] } },
            ],
        }, {
            $set: {
                address: {
                    street: "123 Main Street, Dhanmondi",
                    city: "Dhaka",
                    state: "Dhaka Division",
                    country: "Bangladesh",
                    postalCode: "1205",
                },
            },
        });
        const allStudents = await student_model_1.Student.find({}, { studentId: 1, address: 1 });
        allStudents.slice(0, 3).forEach((student) => {
        });
    }
    catch (error) {
        console.error("Error updating students:", error);
    }
    finally {
        await mongoose_1.default.connection.close();
    }
};
if (require.main === module) {
    addAddressToExistingStudents();
}
exports.default = addAddressToExistingStudents;
//# sourceMappingURL=addAddressToExistingStudents.js.map