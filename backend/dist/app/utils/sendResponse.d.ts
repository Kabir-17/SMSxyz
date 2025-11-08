import { Response } from 'express';
type IApiResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
    data: T;
};
declare const sendResponse: <T>(res: Response, data: IApiResponse<T>) => void;
export { sendResponse };
//# sourceMappingURL=sendResponse.d.ts.map