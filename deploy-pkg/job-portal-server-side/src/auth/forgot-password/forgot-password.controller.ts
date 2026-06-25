import { Controller, Post, Body } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyOTPDto } from './dto/verify-otp.dto';

@ApiTags('auth-forgot-password')
@Controller('auth')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) { }

  @Post('forgot-password')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Forgot password' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.forgotPasswordService.forgotPassword(forgotPasswordDto);
  }

  @Post('verify-otp-for-reset')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Verify OTP for reset' })
  async verifyOtpForReset(@Body() verifyOtp: VerifyOTPDto) {
    return this.forgotPasswordService.verifyOtp(verifyOtp);
  }

  @Post('reset-password')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.forgotPasswordService.resetPassword(resetPasswordDto);
  }
}
