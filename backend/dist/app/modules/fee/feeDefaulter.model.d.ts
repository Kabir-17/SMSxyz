import { IFeeDefaulter } from "./fee.interface";
import { Model } from "mongoose";
import { IFeeDefaulterModel } from "./fee.interface";
declare const FeeDefaulter: Model<IFeeDefaulter, {}, {}, {}, import("mongoose").Document<unknown, {}, IFeeDefaulter, {}, {}> & IFeeDefaulter & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any> & IFeeDefaulterModel;
export default FeeDefaulter;
//# sourceMappingURL=feeDefaulter.model.d.ts.map