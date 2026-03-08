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
exports.LmsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const axios_2 = require("axios");
const bcrypt = require("bcrypt");
let LmsService = class LmsService {
    constructor(prisma, httpService) {
        this.prisma = prisma;
        this.httpService = httpService;
    }
    async unlinkFromLmsCommand(dto) {
        const { job_seeker_id } = dto;
        console.log(`[LmsService] Received unlink command from LMS for job_seeker_id: ${job_seeker_id}`);
        try {
            await this.prisma.job_seekers.update({
                where: { job_seeker_id: job_seeker_id },
                data: {
                    lmsUserId: null,
                    lmsLinkedAt: null,
                },
            });
            console.log(`[LmsService] Job seeker ${job_seeker_id} unlinked successfully by LMS command.`);
        }
        catch (prismaError) {
            if (prismaError.code === 'P2025') {
                console.warn(`[LmsService] Job seeker with ID ${job_seeker_id} not found during unlink command. Ignoring.`);
                return;
            }
            console.error('[LmsService] Prisma error during unlinkFromLmsCommand:', prismaError);
            throw new common_1.InternalServerErrorException('Failed to unlink Job Portal account due to a database error.');
        }
    }
    async validateAndLinkJobPortalAccount(dto) {
        const { email, password, lmsUserId } = dto;
        const jobSeeker = await this.prisma.job_seekers.findUnique({
            where: { email },
        });
        if (!jobSeeker) {
            throw new common_1.NotFoundException('Job Portal account with this email does not exist.');
        }
        const isPasswordMatching = await bcrypt.compare(password, jobSeeker.password);
        if (!isPasswordMatching) {
            throw new common_1.UnauthorizedException('Invalid credentials for Job Portal account.');
        }
        if (jobSeeker.lmsUserId && jobSeeker.lmsUserId !== lmsUserId) {
            throw new common_1.ConflictException('This Job Portal account is already linked to another LMS account.');
        }
        await this.prisma.job_seekers.update({
            where: { job_seeker_id: jobSeeker.job_seeker_id },
            data: {
                lmsUserId,
                lmsLinkedAt: new Date(),
            },
        });
        console.log(`[LmsService] Job Portal account ${jobSeeker.job_seeker_id} linked with LMS user ${lmsUserId} successfully.`);
        try {
            const detail = await this.prisma.job_seeker_details.findUnique({
                where: { job_seeker_id: jobSeeker.job_seeker_id }
            });
            if (detail) {
                const lmsCoursesUrl = `${process.env.URL_API_LMS || 'http://localhost:8888/api'}/lms/students/${lmsUserId}/completed-courses`;
                const lmsResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(lmsCoursesUrl));
                const completedCourses = lmsResponse.data?.data || [];
                for (const course of completedCourses) {
                    const existing = await this.prisma.certifications.findFirst({
                        where: {
                            job_seeker_detail_id: detail.job_seeker_detail_id,
                            certification_name: course.title,
                            issuing_organization: 'Digitefa LMS'
                        }
                    });
                    if (!existing) {
                        await this.prisma.certifications.create({
                            data: {
                                job_seeker_detail_id: detail.job_seeker_detail_id,
                                certification_name: course.title,
                                issuing_organization: 'Digitefa LMS',
                                issue_date: new Date(),
                                credential_url: `http://localhost:8000/certificate/${course.id_course}`
                            }
                        });
                        console.log(`[LmsService] Synced retro certificate: ${course.title}`);
                    }
                }
            }
        }
        catch (e) {
            console.error('[LmsService] Failed to sync retroactive certificates from LMS:', e.message);
        }
        return { job_seeker_id: jobSeeker.job_seeker_id };
    }
    async validateLmsCredentials(email, password, jobSeekerId) {
        const lmsUrl = process.env.LMS_VALIDATE_CREDENTIALS_URL;
        const apiKey = process.env.LMS_INTEGRATION_API_KEY;
        if (!lmsUrl || !apiKey) {
            console.error('[LmsService] LMS URL or API Key is not configured in .env');
            throw new common_1.InternalServerErrorException('LMS integration is not configured properly.');
        }
        const payload = {
            email,
            password,
            job_portal_id: jobSeekerId,
        };
        console.log(`[LmsService] Sending to LMS: URL=${lmsUrl}, Payload=${JSON.stringify({ email, password })}, APIKey provided.`);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(lmsUrl, payload, {
                headers: {
                    'X-API-KEY': apiKey,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }));
            console.log('[LmsService] LMS validation successful. Response data:', response.data);
            return response.data;
        }
        catch (error) {
            let errorMessage = 'Failed to validate LMS credentials';
            let statusCode = 500;
            if (error instanceof axios_2.AxiosError && error.response) {
                console.error('[LmsService] Error from LMS API:');
                console.error('  Status:', error.response.status);
                console.error('  Data:', JSON.stringify(error.response.data, null, 2));
                statusCode = error.response.status;
                if (error.response.data) {
                    if (error.response.data.errors) {
                        const firstErrorField = Object.keys(error.response.data.errors)[0];
                        if (firstErrorField &&
                            error.response.data.errors[firstErrorField].length > 0) {
                            errorMessage = `${firstErrorField}: ${error.response.data.errors[firstErrorField][0]}`;
                        }
                        else if (error.response.data.message) {
                            errorMessage = error.response.data.message;
                        }
                    }
                    else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    }
                }
            }
            else {
                console.error('[LmsService] Network or other error calling LMS API:', error.message || error);
            }
            if (statusCode >= 400 &&
                statusCode < 500 &&
                statusCode !== 401 &&
                statusCode !== 403) {
                throw new common_1.InternalServerErrorException(`LMS Request Error (${statusCode}): ${errorMessage}`);
            }
            else if (statusCode === 401) {
                throw new common_1.UnauthorizedException(`LMS Unauthorized: ${errorMessage}`);
            }
            else if (statusCode === 403) {
                throw new common_1.ForbiddenException(`LMS Forbidden: ${errorMessage}`);
            }
            throw new common_1.InternalServerErrorException(errorMessage);
        }
    }
    async linkLmsAccount(jobSeekerId, lmsUserId) {
        console.log(`[LmsService] Updating job_seeker in DB: jobSeekerId=${jobSeekerId}, lmsUserId=${lmsUserId}`);
        try {
            await this.prisma.job_seekers.update({
                where: { job_seeker_id: jobSeekerId },
                data: {
                    lmsUserId,
                    lmsLinkedAt: new Date(),
                },
            });
            console.log(`[LmsService] Job seeker ${jobSeekerId} linked with LMS user ${lmsUserId} successfully.`);
        }
        catch (prismaError) {
            console.error('[LmsService] Prisma error during linkLmsAccount:', prismaError);
            if (prismaError.code === 'P2025') {
                throw new common_1.InternalServerErrorException(`Failed to link LMS account: Job seeker with ID ${jobSeekerId} not found.`);
            }
            throw new common_1.InternalServerErrorException('Failed to link LMS account due to a database error.');
        }
    }
    async unlinkLmsAccount(jobSeekerId) {
        const lmsUnlinkUrl = process.env.LMS_UNLINK_ACCOUNT_URL;
        const apiKey = process.env.LMS_INTEGRATION_API_KEY;
        if (lmsUnlinkUrl && apiKey) {
            console.log(`[LmsService] Notifying LMS to unlink for jobSeekerId=${jobSeekerId}`);
            try {
                await (0, rxjs_1.firstValueFrom)(this.httpService.post(lmsUnlinkUrl, { job_portal_id: jobSeekerId }, {
                    headers: {
                        'X-API-KEY': apiKey,
                        Accept: 'application/json',
                    },
                }));
                console.log(`[LmsService] LMS notification successful.`);
            }
            catch (error) {
                console.error('[LmsService] Failed to notify LMS for unlinking:', error instanceof axios_2.AxiosError ? error.response?.data : error.message);
            }
        }
        else {
            console.warn('[LmsService] LMS_UNLINK_ACCOUNT_URL or API Key is not configured. Skipping LMS notification.');
        }
        console.log(`[LmsService] Unlinking LMS account in local DB for jobSeekerId=${jobSeekerId}`);
        try {
            await this.prisma.job_seekers.update({
                where: { job_seeker_id: jobSeekerId },
                data: {
                    lmsUserId: null,
                    lmsLinkedAt: null,
                },
            });
            console.log(`[LmsService] Job seeker ${jobSeekerId} unlinked successfully in local DB.`);
        }
        catch (prismaError) {
            console.error('[LmsService] Prisma error during unlinkLmsAccount:', prismaError);
            if (prismaError.code === 'P2025') {
                throw new common_1.InternalServerErrorException(`Failed to unlink LMS account: Job seeker with ID ${jobSeekerId} not found.`);
            }
            throw new common_1.InternalServerErrorException('Failed to unlink LMS account due to a local database error.');
        }
    }
    async getJobs() {
        try {
            const where = {
                status: 'active',
                expired_at: { gte: new Date() },
                deleted_at: null,
            };
            const jobs = await this.prisma.jobs.findMany({
                where,
                select: {
                    job_id: true,
                    title: true,
                    description: true,
                    published_at: true,
                    expired_at: true,
                    status: true,
                    company: {
                        select: {
                            company_detail: {
                                select: {
                                    company_id: true,
                                    legal_name: true,
                                    market_name: true,
                                },
                            },
                        },
                    },
                    location: true,
                    employment_type: true,
                    work_type: true,
                    category: true,
                    minimum_salary: true,
                    maximum_salary: true,
                    education_requirement: true,
                    skills_requirement: true,
                    experience_requirement: true,
                },
            });
            const responseData = jobs.map((job) => {
                return {
                    job_id: job.job_id,
                    company: {
                        company_id: job.company.company_detail.company_id,
                        legal_name: job.company.company_detail.legal_name,
                        market_name: job.company.company_detail.market_name,
                    },
                    title: job.title,
                    description: job.description,
                    published_at: job.published_at,
                    expired_at: job.expired_at,
                    status: job.status,
                    location: job.location,
                    employment_type: job.employment_type,
                    work_type: job.work_type,
                    category: job.category,
                    minimum_salary: Number(job.minimum_salary),
                    maximum_salary: Number(job.maximum_salary),
                    education_requirement: job.education_requirement,
                    skills_requirement: job.skills_requirement.map((skill) => skill.skill),
                    experience_requirement: job.experience_requirement,
                };
            });
            return {
                status: 'success',
                message: 'Jobs retrieved successfully',
                data: responseData,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve job vacancies');
        }
    }
};
exports.LmsService = LmsService;
exports.LmsService = LmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        axios_1.HttpService])
], LmsService);
//# sourceMappingURL=lms.service.js.map