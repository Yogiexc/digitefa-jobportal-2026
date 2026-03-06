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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const otp_change_email_template_1 = require("./email-templates/otp-change-email-template");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
let ProfileService = class ProfileService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUser(user) {
        let users;
        if (user.role === 'job_seeker') {
            users = await this.prisma.job_seekers.findUnique({
                where: { job_seeker_id: user.job_seeker_id },
            });
            if (users)
                users = { ...users, role: 'job_seeker' };
        }
        else if (user.role === 'university') {
            users = await this.prisma.universities.findUnique({
                where: { university_id: user.university_id },
                include: {
                    university_detail: true,
                },
            });
            if (users)
                users = { ...users, role: 'university' };
        }
        else if (user.role === 'company') {
            users = await this.prisma.companies.findUnique({
                where: { company_id: user.company_id },
                include: {
                    company_detail: true,
                },
            });
            if (users)
                users = { ...users, role: 'company' };
        }
        else if (user.role === 'superadmin') {
            users = await this.prisma.admins.findUnique({
                where: { admin_id: user.admin_id },
            });
            if (users)
                users = { ...users, role: 'superadmin' };
        }
        if (!users) {
            throw new common_1.UnauthorizedException('Token not found!, Please login again');
        }
        const detailUser = Object.fromEntries(Object.entries(users).filter(([key]) => ![
            'otp',
            'otpExpires',
            'password',
            'updated_at',
            'created_at',
        ].includes(key)));
        return {
            status: 'success',
            message: 'Profile fetched successfully',
            data: {
                user: detailUser,
            },
        };
    }
    async changePassword(user, changePasswordDto) {
        if (changePasswordDto.newPassword === changePasswordDto.oldPassword) {
            throw new common_1.BadRequestException('New password cannot be the same as old password!');
        }
        let users;
        if (user.role === 'job_seeker') {
            users = await this.prisma.job_seekers.findUnique({
                where: { job_seeker_id: user.job_seeker_id },
            });
        }
        else if (user.role === 'university') {
            users = await this.prisma.universities.findUnique({
                where: { university_id: user.university_id },
            });
        }
        else if (user.role === 'company') {
            users = await this.prisma.companies.findUnique({
                where: { company_id: user.company_id },
            });
        }
        else if (user.role === 'superadmin') {
            users = await this.prisma.admins.findUnique({
                where: { admin_id: user.admin_id },
            });
        }
        if (!users) {
            throw new common_1.UnauthorizedException('Token not found!, Please login again');
        }
        if (!(await bcrypt.compareSync(changePasswordDto.oldPassword, users.password))) {
            throw new common_1.HttpException({ status: 'failed', message: 'Old password is incorrect!' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        if (user.role === 'job_seeker') {
            await this.prisma.job_seekers.update({
                where: { job_seeker_id: user.job_seeker_id },
                data: {
                    password: hashedPassword,
                },
            });
        }
        else if (user.role === 'university') {
            await this.prisma.universities.update({
                where: { university_id: user.university_id },
                data: {
                    password: hashedPassword,
                },
            });
        }
        else if (user.role === 'company') {
            await this.prisma.companies.update({
                where: { company_id: user.company_id },
                data: {
                    password: hashedPassword,
                },
            });
        }
        else if (user.role === 'superadmin') {
            await this.prisma.admins.update({
                where: { admin_id: user.admin_id },
                data: {
                    password: hashedPassword,
                },
            });
        }
        return {
            status: 'success',
            message: 'Password changed successfully',
        };
    }
    async changeEmail(user, changeEmailDto) {
        let users;
        if (user.role === 'job_seeker') {
            users = await this.prisma.job_seekers.findUnique({
                where: { job_seeker_id: user.job_seeker_id },
            });
        }
        else if (user.role === 'university') {
            users = await this.prisma.universities.findUnique({
                where: { university_id: user.university_id },
            });
        }
        else if (user.role === 'company') {
            users = await this.prisma.companies.findUnique({
                where: { company_id: user.company_id },
            });
        }
        else if (user.role === 'superadmin') {
            users = await this.prisma.admins.findUnique({
                where: { admin_id: user.admin_id },
            });
        }
        if (!users) {
            throw new common_1.UnauthorizedException('Token not found!, Please login again');
        }
        if (!(await bcrypt.compareSync(changeEmailDto.password, users.password))) {
            throw new common_1.BadRequestException('Password is incorrect!');
        }
        const otp = crypto.randomInt(1000, 9999).toString();
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        if (user.role === 'job_seeker') {
            await this.prisma.job_seekers.update({
                where: { job_seeker_id: users.job_seeker_id },
                data: {
                    otp: otpHash,
                    otpExpires: new Date(Date.now() + 15 * 60 * 1000),
                },
            });
        }
        else if (user.role === 'university') {
            await this.prisma.universities.update({
                where: { university_id: users.university_id },
                data: {
                    otp: otpHash,
                    otpExpires: new Date(Date.now() + 15 * 60 * 1000),
                },
            });
        }
        else if (user.role === 'company') {
            await this.prisma.companies.update({
                where: { company_id: users.company_id },
                data: {
                    otp: otpHash,
                    otpExpires: new Date(Date.now() + 15 * 60 * 1000),
                },
            });
        }
        await this.sendOtpEmail(changeEmailDto.newEmail, otp);
        return {
            status: 'success',
            message: 'Email OTP sent successfully. Please check your email for the OTP code.',
        };
    }
    async verifyChangeEmail(user, verifyChangeEmailDto) {
        const { newEmail, otp } = verifyChangeEmailDto;
        let users;
        if (user.role === 'job_seeker') {
            users = await this.prisma.job_seekers.findUnique({
                where: { job_seeker_id: user.job_seeker_id },
            });
        }
        else if (user.role === 'university') {
            users = await this.prisma.universities.findUnique({
                where: { university_id: user.university_id },
            });
        }
        else if (user.role === 'company') {
            users = await this.prisma.companies.findUnique({
                where: { company_id: user.company_id },
            });
        }
        else if (user.role === 'superadmin') {
            users = await this.prisma.admins.findUnique({
                where: { admin_id: user.admin_id },
            });
        }
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        if (!users) {
            throw new common_1.UnauthorizedException('Token not found!, Please login again');
        }
        if (users.otp !== otpHash) {
            throw new common_1.BadRequestException('OTP is incorrect!');
        }
        if (users.otpExpires < new Date()) {
            throw new common_1.BadRequestException('OTP has expired!');
        }
        if (user.role === 'job_seeker') {
            await this.prisma.job_seekers.update({
                where: { job_seeker_id: user.job_seeker_id },
                data: {
                    email: newEmail,
                    otp: null,
                    otpExpires: null,
                },
            });
        }
        else if (user.role === 'university') {
            await this.prisma.universities.update({
                where: { university_id: user.university_id },
                data: {
                    email: newEmail,
                    otp: null,
                    otpExpires: null,
                },
            });
        }
        else if (user.role === 'company') {
            await this.prisma.companies.update({
                where: { company_id: user.company_id },
                data: {
                    email: newEmail,
                    otp: null,
                    otpExpires: null,
                },
            });
        }
        return {
            status: 'success',
            message: 'Email changed successfully, Please login again',
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
        const htmlContent = (0, otp_change_email_template_1.otpChangeEmailTemplate)(otp, email);
        await transporter.sendMail({
            from: '"Digitefa" <no-reply@zenify.my.id>',
            to: email,
            subject: 'Digitefa OTP Verification Code',
            text: `Your OTP code is ${otp}`,
            html: htmlContent,
        });
    }
    async getProfilePicture(user) {
        let users;
        let picture = null;
        if (user.role === 'job_seeker') {
            users = await this.prisma.job_seeker_details.findFirst({
                where: {
                    job_seeker_id: user.job_seeker_id,
                },
                select: {
                    profile_picture_url: true,
                },
            });
            picture = users?.profile_picture_url || null;
        }
        else if (user.role === 'university') {
            users = await this.prisma.university_details.findUnique({
                where: {
                    university_id: user.university_id,
                },
                select: {
                    logo_url: true,
                },
            });
            picture = users?.logo_url || null;
        }
        else if (user.role === 'company') {
            users = await this.prisma.company_details.findUnique({
                where: {
                    company_id: user.company_id,
                },
                select: {
                    logo_url: true,
                },
            });
            picture = users?.logo_url || null;
        }
        else if (user.role === 'superadmin') {
            users = await this.prisma.admins.findUnique({
                where: {
                    admin_id: user.admin_id,
                },
            });
            picture = null;
        }
        return {
            status: 'success',
            message: 'Profile picture fetched successfully',
            data: picture,
        };
    }
    async cvAutofill(user, file) {
        if (user.role !== 'job_seeker') {
            throw new common_1.ForbiddenException('Only job seekers can use this feature');
        }
        const gpythonUrl = process.env.URL_SERVER_PYTHON;
        if (!gpythonUrl) {
            throw new common_1.InternalServerErrorException('Python microservice URL not configured');
        }
        const formData = new FormData();
        const blob = new Blob([file.buffer], { type: file.mimetype });
        formData.append('file', blob, file.originalname);
        try {
            const response = await fetch(`${gpythonUrl}/parse-cv`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new common_1.InternalServerErrorException(`Python API error: ${response.statusText}`);
            }
            const result = await response.json();
            const parsedData = result.parsed_data;
            const detail = await this.prisma.job_seeker_details.findUnique({
                where: { job_seeker_id: user.job_seeker_id },
            });
            if (!detail) {
                throw new common_1.BadRequestException('Job seeker profile details not found');
            }
            if (parsedData.skills && parsedData.skills.length > 0) {
                const existingSkills = await this.prisma.skills.findMany({
                    where: { job_seeker_detail_id: detail.job_seeker_detail_id },
                });
                const existingSkillNames = existingSkills.map((s) => s.skill_name.toLowerCase());
                for (const skill of parsedData.skills) {
                    if (!existingSkillNames.includes(skill.toLowerCase())) {
                        await this.prisma.skills.create({
                            data: {
                                skill_name: skill,
                                job_seeker_detail_id: detail.job_seeker_detail_id,
                            },
                        });
                    }
                }
            }
            if (parsedData.experience_structured && parsedData.experience_structured.length > 0) {
                for (const exp of parsedData.experience_structured) {
                    await this.prisma.experiences.create({
                        data: {
                            job_seeker_detail_id: detail.job_seeker_detail_id,
                            experience_title: exp.title || 'Experience',
                            company_name: exp.company || 'Unknown',
                            description: (exp.description || '').substring(0, 250),
                        },
                    });
                }
            }
            else if (parsedData.experience) {
                await this.prisma.experiences.create({
                    data: {
                        job_seeker_detail_id: detail.job_seeker_detail_id,
                        experience_title: 'Experience from CV',
                        company_name: 'Various',
                        description: parsedData.experience.substring(0, 250),
                    },
                });
            }
            if (parsedData.education_structured && parsedData.education_structured.length > 0) {
                const existingEdu = await this.prisma.education.findUnique({
                    where: { job_seeker_detail_id: detail.job_seeker_detail_id },
                });
                if (existingEdu) {
                    await this.prisma.education.delete({
                        where: { education_id: existingEdu.education_id },
                    });
                }
                for (const edu of parsedData.education_structured) {
                    await this.prisma.education.create({
                        data: {
                            job_seeker_detail_id: detail.job_seeker_detail_id,
                            university_name: edu.university || 'From CV',
                            degree: edu.degree || 'Auto-filled',
                            major: edu.major || 'General',
                            start_date: new Date(),
                        },
                    });
                    break;
                }
            }
            else if (parsedData.education) {
                const existingEdu = await this.prisma.education.findUnique({
                    where: { job_seeker_detail_id: detail.job_seeker_detail_id },
                });
                if (existingEdu) {
                    await this.prisma.education.delete({
                        where: { education_id: existingEdu.education_id },
                    });
                }
                await this.prisma.education.create({
                    data: {
                        job_seeker_detail_id: detail.job_seeker_detail_id,
                        university_name: 'From CV',
                        degree: 'Auto-filled',
                        major: 'General',
                        start_date: new Date(),
                    },
                });
            }
            if (parsedData.personal_summary) {
                await this.prisma.job_seeker_details.update({
                    where: { job_seeker_detail_id: detail.job_seeker_detail_id },
                    data: { personal_summary: parsedData.personal_summary }
                });
            }
            if (parsedData.projects_structured && parsedData.projects_structured.length > 0) {
                for (const proj of parsedData.projects_structured) {
                    await this.prisma.projects.create({
                        data: {
                            job_seeker_detail_id: detail.job_seeker_detail_id,
                            project_name: proj.title || 'Project from CV',
                            description: (proj.description || '').substring(0, 250),
                        },
                    });
                }
            }
            else if (parsedData.projects) {
                await this.prisma.projects.create({
                    data: {
                        job_seeker_detail_id: detail.job_seeker_detail_id,
                        project_name: 'Project from CV',
                        description: parsedData.projects.substring(0, 250),
                    },
                });
            }
            if (parsedData.certifications_structured && parsedData.certifications_structured.length > 0) {
                for (const cert of parsedData.certifications_structured) {
                    await this.prisma.certifications.create({
                        data: {
                            job_seeker_detail_id: detail.job_seeker_detail_id,
                            certification_name: cert.title || 'Certification from CV',
                            issuing_organization: 'Extracted Org',
                            credential_url: (cert.description || '').substring(0, 250),
                            issue_date: new Date(),
                        },
                    });
                }
            }
            else if (parsedData.certifications) {
                await this.prisma.certifications.create({
                    data: {
                        job_seeker_detail_id: detail.job_seeker_detail_id,
                        certification_name: 'Certification from CV',
                        issuing_organization: 'Extracted Org',
                        credential_url: parsedData.certifications.substring(0, 250),
                        issue_date: new Date(),
                    },
                });
            }
            if (parsedData.languages && parsedData.languages.length > 0) {
                const existingLangs = await this.prisma.languages.findMany({
                    where: { job_seeker_detail_id: detail.job_seeker_detail_id },
                });
                const existingLangNames = existingLangs.map((l) => l.language_name.toLowerCase());
                for (const lang of parsedData.languages) {
                    if (!existingLangNames.includes(lang.toLowerCase())) {
                        await this.prisma.languages.create({
                            data: {
                                language_name: lang,
                                job_seeker_detail_id: detail.job_seeker_detail_id,
                            },
                        });
                    }
                }
            }
            return {
                status: 'success',
                message: 'CV processed and profile updated',
                data: parsedData,
            };
        }
        catch (error) {
            console.error('Error autofilling CV:', error);
            throw new common_1.InternalServerErrorException('Failed to process CV: ' + error.message);
        }
    }
    async deleteEducation(user) {
        if (user.role !== 'job_seeker') {
            throw new common_1.ForbiddenException('Only job seekers can use this feature');
        }
        const detail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!detail) {
            throw new common_1.BadRequestException('Job seeker profile details not found');
        }
        const existingEdu = await this.prisma.education.findUnique({
            where: { job_seeker_detail_id: detail.job_seeker_detail_id },
        });
        if (existingEdu) {
            await this.prisma.education.delete({
                where: { education_id: existingEdu.education_id },
            });
        }
        return {
            status: 'success',
            message: 'Education deleted successfully',
        };
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map