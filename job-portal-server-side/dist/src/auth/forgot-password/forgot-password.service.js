"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const otp_email_template_1 = require("./email-templates/otp-email-template");
let ForgotPasswordService = class ForgotPasswordService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const [job_seeker, university, company] = await Promise.all([
            this.prisma.job_seekers.findUnique({ where: { email } }),
            this.prisma.universities.findUnique({ where: { email } }),
            this.prisma.companies.findUnique({ where: { email } }),
        ]);
        if (!job_seeker && !university && !company) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
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
        }
        else if (university) {
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
    async resetPassword(resetPasswordDto) {
        const { email, otp, newPassword } = resetPasswordDto;
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        const [job_seeker, university, company] = await Promise.all([
            this.prisma.job_seekers.findUnique({ where: { email } }),
            this.prisma.universities.findUnique({ where: { email } }),
            this.prisma.companies.findUnique({ where: { email } }),
        ]);
        if (!job_seeker && !university && !company) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (job_seeker) {
            if (job_seeker.otp !== otpHash || new Date() > job_seeker.otpExpires) {
                throw new common_1.HttpException('Invalid or expired OTP', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        else if (university) {
            if (university.otp !== otpHash || new Date() > university.otpExpires) {
                throw new common_1.HttpException('Invalid or expired OTP', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        else if (company) {
            if (company.otp !== otpHash || new Date() > company.otpExpires) {
                throw new common_1.HttpException('Invalid or expired OTP', common_1.HttpStatus.BAD_REQUEST);
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
        }
        else if (university) {
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
    async sendOtpEmail(email, otp) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const htmlContent = (0, otp_email_template_1.otpEmailTemplate)(otp, email);
        await transporter.sendMail({
            from: '"Digitefa" <no-reply@zenify.my.id>',
            to: email,
            subject: 'Digitefa OTP Reset Password',
            text: `Your Reset Password OTP code is ${otp}`,
            html: htmlContent,
        });
    }
    async verifyOtp(verifOTPDto) {
        const { email, otp } = verifOTPDto;
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        const [job_seeker, university, company] = await Promise.all([
            this.prisma.job_seekers.findUnique({ where: { email } }),
            this.prisma.universities.findUnique({ where: { email } }),
            this.prisma.companies.findUnique({ where: { email } }),
        ]);
        if (!job_seeker && !university && !company) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (job_seeker) {
            if (job_seeker.otp !== otpHash || new Date() > job_seeker.otpExpires) {
                throw new common_1.HttpException('Invalid or expired OTP', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        else if (university) {
            if (university.otp !== otpHash || new Date() > university.otpExpires) {
                throw new common_1.HttpException('Invalid or expired OTP', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        else if (company) {
            if (company.otp !== otpHash || new Date() > company.otpExpires) {
                throw new common_1.HttpException('Invalid or expired OTP', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        return {
            status: 'success',
            message: 'OTP verified successfully. You can now reset your password.',
        };
    }
};
exports.ForgotPasswordService = ForgotPasswordService;
exports.ForgotPasswordService = ForgotPasswordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ForgotPasswordService);
//# sourceMappingURL=forgot-password.service.js.map