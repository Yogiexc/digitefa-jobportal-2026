import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOTPDto } from './dto/verify-otp.dto';
export declare class ForgotPasswordController {
    private readonly forgotPasswordService;
    constructor(forgotPasswordService: ForgotPasswordService);
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any>;
    verifyOtpForReset(verifyOtp: VerifyOTPDto): Promise<any>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any>;
}
