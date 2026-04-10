import { PrismaService } from '../../../prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOTPDto } from './dto/verify-otp.dto';
export declare class ForgotPasswordService {
    private prisma;
    constructor(prisma: PrismaService);
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any>;
    sendOtpEmail(email: string, otp: string): Promise<void>;
    verifyOtp(verifOTPDto: VerifyOTPDto): Promise<any>;
}
