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
exports.RegisterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const class_validator_1 = require("class-validator");
const otp_email_template_1 = require("./email-templates/otp-email-template");
const jwt_1 = require("@nestjs/jwt");
let RegisterService = class RegisterService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async registerJobSeeker(registerJobSeekerDto) {
        const errors = await (0, class_validator_1.validate)(registerJobSeekerDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const job_seeker = await this.prisma.job_seekers.findUnique({
            where: { email: registerJobSeekerDto.email },
        });
        const company = await this.prisma.companies.findUnique({
            where: { email: registerJobSeekerDto.email },
        });
        const university = await this.prisma.universities.findUnique({
            where: { email: registerJobSeekerDto.email },
        });
        const admin = await this.prisma.admins.findUnique({
            where: { email: registerJobSeekerDto.email },
        });
        if (job_seeker || company || university || admin) {
            if (company && company.verified === 'true') {
                throw new common_1.ConflictException('Email is already registered and verified for company. Please login for company.');
            }
            if (university && university.verified === 'true') {
                throw new common_1.ConflictException('Email is already registered and verified for university. Please login for university.');
            }
            if (job_seeker && job_seeker.verified === 'true') {
                throw new common_1.ConflictException('Email is already registered as job seeker. Please login instead.');
            }
            if (admin) {
                throw new common_1.ConflictException('Email is already registered in this platform. Please login instead.');
            }
        }
        const { email, full_name, password } = registerJobSeekerDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(1000, 9999).toString();
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        try {
            if (job_seeker) {
                if (job_seeker.verified === 'false') {
                    await this.prisma.job_seekers.update({
                        where: { job_seeker_id: job_seeker.job_seeker_id },
                        data: {
                            email,
                            full_name,
                            password: hashedPassword,
                            otp: otpHash,
                            otpExpires: new Date(Date.now() + 15 * 60 * 1000),
                        },
                    });
                }
            }
            else {
                await this.prisma.job_seekers.create({
                    data: {
                        email,
                        full_name,
                        password: hashedPassword,
                        otp: otpHash,
                        otpExpires: new Date(Date.now() + 15 * 60 * 1000),
                        job_seeker_detail: {
                            create: {},
                        },
                    },
                });
            }
            try {
                await this.sendOtpEmail(email, otp);
            }
            catch (err) {
                console.error('Failed to send OTP email. For development, OTP is:', otp);
            }
            return {
                status: 'success',
                message: 'OTP sent successfully.Please check your email for the OTP code.',
            };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Registration error: ' + (error.message || error), common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async registerCompany(registerCompanyDto) {
        const errors = await (0, class_validator_1.validate)(registerCompanyDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const job_seeker = await this.prisma.job_seekers.findUnique({
            where: { email: registerCompanyDto.email },
        });
        const company = await this.prisma.companies.findUnique({
            where: { email: registerCompanyDto.email },
        });
        const university = await this.prisma.universities.findUnique({
            where: { email: registerCompanyDto.email },
        });
        const admin = await this.prisma.admins.findUnique({
            where: { email: registerCompanyDto.email },
        });
        if (job_seeker || company || university || admin) {
            if (company && company.verified === 'true') {
                throw new common_1.ConflictException('Email is already registered and verified for company. Please login for company.');
            }
            if (university && university.verified === 'true') {
                throw new common_1.ConflictException('Email is already registered and verified for university. Please login for university.');
            }
            if (job_seeker && job_seeker.verified === 'true') {
                throw new common_1.ConflictException('Email is already registered as job seeker. Please login instead.');
            }
            if (admin) {
                throw new common_1.ConflictException('Email is already registered as admin. Please login instead.');
            }
        }
        const { legal_name, full_name, phone_number, email, password } = registerCompanyDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(1000, 9999).toString();
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        if (company) {
            if (company.verified === 'false') {
                await this.prisma.companies.update({
                    where: { company_id: company.company_id },
                    data: {
                        email,
                        full_name,
                        password: hashedPassword,
                        otp: otpHash,
                        otpExpires: new Date(Date.now() + 15 * 60 * 1000),
                        company_detail: {
                            upsert: {
                                update: { legal_name },
                                create: { legal_name },
                            },
                        },
                    },
                });
            }
        }
        else {
            await this.prisma.companies.create({
                data: {
                    email,
                    full_name,
                    phone_number,
                    password: hashedPassword,
                    otp: otpHash,
                    otpExpires: new Date(Date.now() + 15 * 60 * 1000),
                    company_detail: {
                        create: {
                            legal_name,
                        },
                    },
                },
            });
        }
        try {
            await this.sendOtpEmail(email, otp);
        }
        catch (err) {
            console.error('Failed to send OTP email. For development, OTP is:', otp);
        }
        return {
            status: 'success',
            message: 'OTP sent successfully.Please check your email for the OTP code.',
        };
    }
    async registerUniversity(registerUniversityDto) {
        const errors = await (0, class_validator_1.validate)(registerUniversityDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const job_seeker = await this.prisma.job_seekers.findUnique({
            where: { email: registerUniversityDto.email },
        });
        const company = await this.prisma.companies.findUnique({
            where: { email: registerUniversityDto.email },
        });
        const university = await this.prisma.universities.findUnique({
            where: { email: registerUniversityDto.email },
        });
        const admin = await this.prisma.admins.findUnique({
            where: { email: registerUniversityDto.email },
        });
        if (job_seeker || company || university || admin) {
            if (company && company.verified === 'true') {
                throw new common_1.ConflictException('Email is already registered and verified for company. Please login for company.');
            }
            if (university && university.verified === 'true') {
                throw new common_1.ConflictException('Email is already registered and verified for university. Please login for university.');
            }
            if (job_seeker && job_seeker.verified === 'true') {
                throw new common_1.ConflictException('Email is already registered as job seeker. Please login instead.');
            }
            if (admin) {
                throw new common_1.ConflictException('Email is already registered as admin. Please login instead.');
            }
        }
        const { university_name, full_name, email, password } = registerUniversityDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = crypto.randomInt(1000, 9999).toString();
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        if (university) {
            if (university.verified === 'false') {
                await this.prisma.universities.update({
                    where: { university_id: university.university_id },
                    data: {
                        email,
                        full_name,
                        password: hashedPassword,
                        otp: otpHash,
                        otpExpires: new Date(Date.now() + 15 * 60 * 1000),
                        university_detail: {
                            upsert: {
                                update: { university_name },
                                create: { university_name },
                            },
                        },
                    },
                });
            }
        }
        else {
            await this.prisma.universities.create({
                data: {
                    email,
                    full_name,
                    password: hashedPassword,
                    otp: otpHash,
                    otpExpires: new Date(Date.now() + 15 * 60 * 1000),
                    university_detail: {
                        create: {
                            university_name,
                        },
                    },
                },
            });
        }
        try {
            await this.sendOtpEmail(email, otp);
        }
        catch (err) {
            console.error('Failed to send OTP email. For development, OTP is:', otp);
        }
        return {
            status: 'success',
            message: 'OTP sent successfully.Please check your email for the OTP code.',
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
                rejectUnauthorized: false,
            },
        });
        const htmlContent = (0, otp_email_template_1.otpEmailTemplate)(otp, email);
        await transporter.sendMail({
            from: '"Digitefa" <no-reply@zenify.my.id>',
            to: email,
            subject: 'Digitefa OTP Verification Code',
            text: `Your OTP code is ${otp}`,
            html: htmlContent,
        });
    }
    async verifyOtp(email, otp) {
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        const job_seeker = await this.prisma.job_seekers.findUnique({
            where: { email },
        });
        const company = await this.prisma.companies.findUnique({
            where: { email },
        });
        const university = await this.prisma.universities.findUnique({
            where: { email },
        });
        if (!job_seeker && !company && !university) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        let user;
        if (job_seeker) {
            if (job_seeker.otp !== otpHash || new Date() > job_seeker.otpExpires) {
                throw new common_1.HttpException('Invalid or expired OTP', common_1.HttpStatus.BAD_REQUEST);
            }
            user = await this.prisma.job_seekers.update({
                where: { email },
                data: {
                    verified: 'true',
                    otp: null,
                    otpExpires: null,
                },
            });
            user.role = 'job_seeker';
        }
        else if (company) {
            if (company.otp !== otpHash || new Date() > company.otpExpires) {
                throw new common_1.HttpException('Invalid or expired OTP', common_1.HttpStatus.BAD_REQUEST);
            }
            user = await this.prisma.companies.update({
                where: { email },
                data: {
                    verified: 'true',
                    otp: null,
                    otpExpires: null,
                },
            });
            user.role = 'company';
        }
        else if (university) {
            if (university.otp !== otpHash || new Date() > university.otpExpires) {
                throw new common_1.HttpException('Invalid or expired OTP', common_1.HttpStatus.BAD_REQUEST);
            }
            user = await this.prisma.universities.update({
                where: { email },
                data: {
                    verified: 'true',
                    otp: null,
                    otpExpires: null,
                },
            });
            user.role = 'university';
        }
        let payload;
        if (user.role === 'job_seeker') {
            payload = {
                job_seeker_id: user.job_seeker_id,
                email: user.email,
                role: user.role,
            };
        }
        else if (user.role === 'university') {
            payload = {
                university_id: user.university_id,
                email: user.email,
                role: user.role,
            };
        }
        else if (user.role === 'company') {
            payload = {
                company_id: user.company_id,
                email: user.email,
                role: user.role,
            };
        }
        const token = await this.jwtService.signAsync(payload);
        const detailUser = Object.fromEntries(Object.entries(user).filter(([key]) => ![
            'otp',
            'otpExpires',
            'password',
            'updated_at',
            'created_at',
        ].includes(key)));
        return {
            status: 'success',
            message: 'Email verified successfully.',
            data: {
                token: token,
                user: detailUser,
            },
        };
    }
};
exports.RegisterService = RegisterService;
exports.RegisterService = RegisterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], RegisterService);
//# sourceMappingURL=register.service.js.map