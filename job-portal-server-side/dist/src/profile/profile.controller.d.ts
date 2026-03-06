import { ProfileService } from './profile.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { VerifyChangeEmailDto } from './dto/verify-change-email.dto';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    user(req: any): Promise<{
        status: string;
        message: string;
        data: {
            user: {
                [k: string]: unknown;
            };
        };
    }>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        status: string;
        message: string;
    }>;
    changeEmail(req: any, changeEmailDto: ChangeEmailDto): Promise<{
        status: string;
        message: string;
    }>;
    verifyChangeEmail(req: any, verifyChangeEmailDto: VerifyChangeEmailDto): Promise<{
        status: string;
        message: string;
    }>;
    profilePicture(req: any): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    cvAutofill(req: any, file: any): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    deleteEducation(req: any): Promise<{
        status: string;
        message: string;
    }>;
}
