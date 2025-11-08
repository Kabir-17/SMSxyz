import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodArray, ZodEffects, ZodRecord } from "zod";
declare const validateImageFileRequest: (schema: AnyZodObject | ZodEffects<any> | ZodArray<any> | ZodRecord<any>) => (req: Request, res: Response, next: NextFunction) => void;
export default validateImageFileRequest;
//# sourceMappingURL=validateImageFileRequest.d.ts.map