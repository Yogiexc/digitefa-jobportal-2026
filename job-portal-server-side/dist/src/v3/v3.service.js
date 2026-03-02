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
exports.V3Service = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const lodash_1 = require("lodash");
let V3Service = class V3Service {
    constructor(prisma) {
        this.prisma = prisma;
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
                    location: true,
                    company: {
                        select: {
                            company_detail: {
                                select: {
                                    company_id: true,
                                    legal_name: true,
                                }
                            }
                        }
                    }
                }
            });
            const responseData = jobs.map(job => {
                return {
                    job_id: job.job_id,
                    title: job.title,
                    description: job.description,
                    location: job.location,
                    published_at: job.published_at,
                    expired_at: job.expired_at,
                    status: job.status,
                    company: {
                        company_id: job.company.company_detail.company_id,
                        legal_name: job.company.company_detail.legal_name
                    }
                };
            });
            return {
                status: "success",
                message: 'Jobs retrieved successfully',
                data: responseData
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve job vacancies');
        }
    }
    async getUserProfile(job_seeker_id) {
        const existingJobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id },
            include: {
                job_seeker: true,
                personal_info: true,
                experiences: true,
            }
        });
        if (!existingJobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker not found');
        }
        try {
            const modifiedExperiences = existingJobSeekerDetail.experiences.map(experience => (0, lodash_1.omit)(experience, ['experience_id', 'job_seeker_detail_id', 'created_at', 'updated_at']));
            const modifiedExperiences2 = modifiedExperiences.map(experience => {
                return {
                    ...experience,
                    employment_type: experience.employment_type ? experience.employment_type
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ') : null,
                };
            });
            const modifiedData = {
                full_name: existingJobSeekerDetail.job_seeker?.full_name,
                email: existingJobSeekerDetail.job_seeker?.email,
                personal_summary: existingJobSeekerDetail.personal_summary,
                experiences: modifiedExperiences2,
            };
            return {
                status: "success",
                message: "Job Seeker profile retrieved successfully",
                data: modifiedData
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to get job seeker profile');
        }
    }
};
exports.V3Service = V3Service;
exports.V3Service = V3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], V3Service);
//# sourceMappingURL=v3.service.js.map