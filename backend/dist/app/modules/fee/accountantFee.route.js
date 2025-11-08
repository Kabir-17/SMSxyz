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
const accountantFeeController = __importStar(require("./accountantFee.controller"));
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const accountantFee_validation_1 = require("./accountantFee.validation");
const router = express_1.default.Router();
router.get("/students/search", auth_1.authenticate, (0, auth_1.authorize)("accountant"), (0, validateRequest_1.validateRequest)(accountantFee_validation_1.searchStudentSchema), accountantFeeController.searchStudent);
router.get("/students/:studentId/fee-status", auth_1.authenticate, (0, auth_1.authorize)("accountant"), (0, validateRequest_1.validateRequest)(accountantFee_validation_1.getStudentFeeStatusSchema), accountantFeeController.getStudentFeeStatus);
router.post("/validate", auth_1.authenticate, (0, auth_1.authorize)("accountant"), (0, validateRequest_1.validateRequest)(accountantFee_validation_1.validateFeeCollectionSchema), accountantFeeController.validateFeeCollection);
router.post("/collect", auth_1.authenticate, (0, auth_1.authorize)("accountant"), (0, validateRequest_1.validateRequest)(accountantFee_validation_1.collectFeeSchema), accountantFeeController.collectFee);
router.get("/transactions", auth_1.authenticate, (0, auth_1.authorize)("accountant"), (0, validateRequest_1.validateRequest)(accountantFee_validation_1.getAccountantTransactionsSchema), accountantFeeController.getAccountantTransactions);
router.get("/daily-summary", auth_1.authenticate, (0, auth_1.authorize)("accountant"), (0, validateRequest_1.validateRequest)(accountantFee_validation_1.getDailyCollectionSummarySchema), accountantFeeController.getDailyCollectionSummary);
router.get("/receipt/:transactionId", auth_1.authenticate, (0, auth_1.authorize)("accountant"), accountantFeeController.getReceipt);
router.get("/dashboard", auth_1.authenticate, (0, auth_1.authorize)("accountant"), accountantFeeController.getDashboard);
router.get("/students", auth_1.authenticate, (0, auth_1.authorize)("accountant"), accountantFeeController.getStudentsByGradeSection);
router.get("/defaulters", auth_1.authenticate, (0, auth_1.authorize)("accountant"), accountantFeeController.getDefaulters);
router.get("/reports", auth_1.authenticate, (0, auth_1.authorize)("accountant"), accountantFeeController.getFinancialReports);
router.post("/collect-one-time", auth_1.authenticate, (0, auth_1.authorize)("accountant"), accountantFeeController.collectOneTimeFee);
router.get("/student-fee-status/:studentId", auth_1.authenticate, accountantFeeController.getStudentFeeStatusDetailed);
router.get("/parent-children-fees", auth_1.authenticate, (0, auth_1.authorize)("parent"), accountantFeeController.getParentChildrenFeeStatus);
exports.default = router;
//# sourceMappingURL=accountantFee.route.js.map