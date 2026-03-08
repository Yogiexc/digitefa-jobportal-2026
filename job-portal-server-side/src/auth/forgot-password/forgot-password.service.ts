import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { otpEmailTemplate } from './email-templates/otp-email-template';
import { VerifyOTPDto } from './dto/verify-otp.dto';

@Injectable()
export class ForgotPasswordService {
  constructor(private prisma: PrismaService) { }
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;
    const [job_seeker, university, company] = await Promise.all([
      this.prisma.job_seekers.findUnique({ where: { email } }),
      this.prisma.universities.findUnique({ where: { email } }),
      this.prisma.companies.findUnique({ where: { email } }),
    ]);

    if (!job_seeker && !university && !company) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const otp = crypto.randomInt(1000, 9999).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    if (job_seeker) {
      await this.prisma.job_seekers.update({
        where: { email },
        data: {
          otp: otpHash,
          otpExpires: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    } else if (university) {
      await this.prisma.universities.update({
        where: { email },
        data: {
          otp: otpHash,
          otpExpires: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    }
    else if (company) {
      await this.prisma.companies.update({
        where: { email },
        data: {
          otp: otpHash,
          otpExpires: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    }

    await this.sendOtpEmail(email, otp);

    return {
      status: 'success',
      message: 'OTP sent successfully. Please check your email for the OTP code.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { email, otp, newPassword } = resetPasswordDto;
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const [job_seeker, university, company] = await Promise.all([
      this.prisma.job_seekers.findUnique({ where: { email } }),
      this.prisma.universities.findUnique({ where: { email } }),
      this.prisma.companies.findUnique({ where: { email } }),
    ]);

    if (!job_seeker && !university && !company) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (job_seeker) {
      if (job_seeker.otp !== otpHash || new Date() > job_seeker.otpExpires) {
        throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
      }
    } else if (university) {
      if (university.otp !== otpHash || new Date() > university.otpExpires) {
        throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
      }
    } else if (company) {
      if (company.otp !== otpHash || new Date() > company.otpExpires) {
        throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (job_seeker) {
      await this.prisma.job_seekers.update({
        where: { email },
        data: {
          password: hashedPassword,
          otp: null,
          otpExpires: null,
        },
      });
    } else if (university) {
      await this.prisma.universities.update({
        where: { email },
        data: {
          password: hashedPassword,
          otp: null,
          otpExpires: null,
        },
      });
    }
    else if (company) {
      await this.prisma.companies.update({
        where: { email },
        data: {
          password: hashedPassword,
          otp: null,
          otpExpires: null,
        },
      });
    }

    return {
      status: 'success',
      message: 'Password reset successfully. You can now login with your new password.',
    };
  }

  async sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const htmlContent = otpEmailTemplate(otp, email);

    await transporter.sendMail({
      from: `"Digitefa" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Digitefa OTP Reset Password',
      text: `Your Reset Password OTP code is ${otp}`,
      html: htmlContent,
    });
  }

  async verifyOtp(verifOTPDto: VerifyOTPDto): Promise<any> {
    const { email, otp } = verifOTPDto;
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex'); // Hash the OTP input
    const [job_seeker, university, company] = await Promise.all([
      this.prisma.job_seekers.findUnique({ where: { email } }),
      this.prisma.universities.findUnique({ where: { email } }),
      this.prisma.companies.findUnique({ where: { email } }),
    ]);

    if (!job_seeker && !university && !company) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (job_seeker) {
      if (job_seeker.otp !== otpHash || new Date() > job_seeker.otpExpires) {
        throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
      }
    } else if (university) {
      if (university.otp !== otpHash || new Date() > university.otpExpires) {
        throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
      }
    } else if (company) {
      if (company.otp !== otpHash || new Date() > company.otpExpires) {
        throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
      }
    }

    return {
      status: 'success',
      message: 'OTP verified successfully. You can now reset your password.',
    };
  }
}
