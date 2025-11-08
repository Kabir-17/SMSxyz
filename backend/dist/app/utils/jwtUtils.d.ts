import { IUserDocument } from '../modules/user/user.interface';
export interface JWTPayload {
    id: string;
    username: string;
    role: string;
    schoolId: string;
    iat?: number;
    exp?: number;
}
export declare const generateAccessToken: (user: IUserDocument) => string;
export declare const verifyToken: (token: string) => JWTPayload;
export declare const getTokenExpiration: () => Date;
//# sourceMappingURL=jwtUtils.d.ts.map