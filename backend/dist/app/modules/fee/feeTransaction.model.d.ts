import { IFeeTransaction } from "./fee.interface";
import { Model } from "mongoose";
import { IFeeTransactionModel } from "./fee.interface";
declare const FeeTransaction: Model<IFeeTransaction, {}, {}, {}, import("mongoose").Document<unknown, {}, IFeeTransaction, {}, {}> & IFeeTransaction & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any> & IFeeTransactionModel;
export default FeeTransaction;
//# sourceMappingURL=feeTransaction.model.d.ts.map