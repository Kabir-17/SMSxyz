import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodEffects } from "zod";
declare const validateRequest: (schema: AnyZodObject | ZodEffects<AnyZodObject>) => (req: Request, res: Response, next: NextFunction) => void;
export { validateRequest };
//# sourceMappingURL=validateRequest.d.ts.map