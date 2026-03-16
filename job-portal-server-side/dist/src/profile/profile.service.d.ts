import { PrismaService } from 'prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { VerifyChangeEmailDto } from './dto/verify-change-email.dto';
export declare class ProfileService {
    private prisma;
    constructor(prisma: PrismaService);
    getUser(user: any): Promise<{
        status: string;
        message: string;
        data: {
            user: {
                [k: string]: unknown;
            };
        };
    }>;
    changePassword(user: any, changePasswordDto: ChangePasswordDto): Promise<{
        status: string;
        message: string;
    }>;
    changeEmail(user: any, changeEmailDto: ChangeEmailDto): Promise<{
        status: string;
        message: string;
    }>;
    verifyChangeEmail(user: any, verifyChangeEmailDto: VerifyChangeEmailDto): Promise<{
        status: string;
        message: string;
    }>;
    sendOtpEmail(email: string, otp: string): Promise<void>;
    getProfilePicture(user: any): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    cvAutofill(user: any, file: any): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    cvAutofillConfirm(user: any, parsedData: any): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    deleteEducation(user: any): Promise<{
        status: string;
        message: string;
    }>;
}
