"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
const mongoose_1 = require("mongoose");
const organizationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Organization name is required'],
        trim: true,
        maxlength: [100, 'Organization name cannot exceed 100 characters'],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'inactive', 'suspended'],
            message: 'Status must be active, inactive, or suspended',
        },
        default: 'active',
        index: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
organizationSchema.methods.isActive = function () {
    return this.status === 'active';
};
organizationSchema.methods.deactivate = function () {
    this.status = 'inactive';
    return this.save();
};
organizationSchema.methods.activate = function () {
    this.status = 'active';
    return this.save();
};
organizationSchema.statics.findByStatus = function (status) {
    return this.find({ status }).sort({ createdAt: -1 });
};
organizationSchema.statics.findActiveOrganizations = function () {
    return this.find({ status: 'active' }).sort({ name: 1 });
};
organizationSchema.index({ name: 1, status: 1 });
organizationSchema.index({ createdAt: -1 });
organizationSchema.pre('save', function (next) {
    if (this.name) {
        this.name = this.name.trim().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    next();
});
organizationSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const School = (0, mongoose_1.model)('School');
    const schoolCount = await School.countDocuments({ orgId: this._id });
    if (schoolCount > 0) {
        const error = new Error(`Cannot delete organization. ${schoolCount} schools are associated with it.`);
        return next(error);
    }
    next();
});
organizationSchema.virtual('schoolsCount', {
    ref: 'School',
    localField: '_id',
    foreignField: 'orgId',
    count: true,
});
organizationSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
organizationSchema.set('toObject', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
exports.Organization = (0, mongoose_1.model)('Organization', organizationSchema);
//# sourceMappingURL=organization.model.js.map