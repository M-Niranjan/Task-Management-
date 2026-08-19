import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from './user.schema';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    loginAsGuest(): Promise<{
        user: {
            _id: import("mongoose").Types.ObjectId;
            name: string;
            email: string;
            initials: string;
            isGuest: boolean;
        };
        token: string;
    }>;
    validateToken(token: string): Promise<any>;
}
