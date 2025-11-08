"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrangeSmsCredential = void 0;
const mongoose_1 = require("mongoose");
const orangeSmsCredentialSchema = new mongoose_1.Schema({
    clientId: {
        type: String,
        required: true,
    },
    clientSecret: {
        type: String,
        required: true,
        select: false,
    },
    senderAddress: {
        type: String,
    },
    senderName: {
        type: String,
    },
    countryCode: {
        type: String,
        default: '224',
    },
    lastUpdatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    lastUpdatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    versionKey: false,
});
orangeSmsCredentialSchema.index({ updatedAt: -1 });
exports.OrangeSmsCredential = (0, mongoose_1.model)('OrangeSmsCredential', orangeSmsCredentialSchema);
//# sourceMappingURL=orange-sms.model.js.map