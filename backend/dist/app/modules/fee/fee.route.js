"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feeController = __importStar(require("./fee.controller"));
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const fee_validation_1 = require("./fee.validation");
const router = express_1.default.Router();
router.post("/structures", auth_1.authenticate, (0, auth_1.authorize)("admin"), (0, validateRequest_1.validateRequest)(fee_validation_1.createFeeStructureSchema), feeController.createFeeStructure);
router.get("/structures/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), (0, validateRequest_1.validateRequest)(fee_validation_1.getFeeStructureSchema), feeController.getFeeStructure);
router.get("/structures", auth_1.authenticate, (0, auth_1.authorize)("admin"), (0, validateRequest_1.validateRequest)(fee_validation_1.queryFeeStructuresSchema), feeController.getFeeStructures);
router.patch("/structures/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), (0, validateRequest_1.validateRequest)(fee_validation_1.updateFeeStructureSchema), feeController.updateFeeStructure);
router.delete("/structures/:id", auth_1.authenticate, (0, auth_1.authorize)("admin"), (0, validateRequest_1.validateRequest)(fee_validation_1.getFeeStructureSchema), feeController.deactivateFeeStructure);
router.post("/structures/:id/clone", auth_1.authenticate, (0, auth_1.authorize)("admin"), (0, validateRequest_1.validateRequest)(fee_validation_1.getFeeStructureSchema), feeController.cloneFeeStructure);
router.get("/financial-overview", auth_1.authenticate, (0, auth_1.authorize)("admin"), (0, validateRequest_1.validateRequest)(fee_validation_1.getFinancialOverviewSchema), feeController.getFinancialOverview);
router.get("/defaulters", auth_1.authenticate, (0, auth_1.authorize)("admin"), (0, validateRequest_1.validateRequest)(fee_validation_1.getDefaultersSchema), feeController.getDefaultersReport);
router.get("/collection-rate", auth_1.authenticate, (0, auth_1.authorize)("admin"), feeController.getFeeCollectionRate);
router.get("/transactions", auth_1.authenticate, (0, auth_1.authorize)("admin"), (0, validateRequest_1.validateRequest)(fee_validation_1.getTransactionsSchema), feeController.getTransactions);
router.post("/transactions/:id/cancel", auth_1.authenticate, (0, auth_1.authorize)("admin"), (0, validateRequest_1.validateRequest)(fee_validation_1.cancelTransactionSchema), feeController.cancelTransaction);
router.get("/transactions/export", auth_1.authenticate, (0, auth_1.authorize)("admin"), feeController.exportTransactions);
router.post("/waive", auth_1.authenticate, (0, auth_1.authorize)("admin"), (0, validateRequest_1.validateRequest)(fee_validation_1.waiveFeeSchema), feeController.waiveFee);
exports.default = router;
//# sourceMappingURL=fee.route.js.map