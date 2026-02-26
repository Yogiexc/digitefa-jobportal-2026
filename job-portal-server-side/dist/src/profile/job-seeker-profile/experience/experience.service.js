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
exports.ExperienceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let ExperienceService = class ExperienceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getExperiences(user) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { experiences: true }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        try {
            const experience = jobSeekerDetail.experiences.map(exp => ({
                experience_id: exp.experience_id,
                experience_title: exp.experience_title,
                employment_type: exp.employment_type,
                company_name: exp.company_name,
                location: exp.location,
                location_type: exp.location_type,
                description: exp.description,
                start_date: exp.start_date,
                end_date: exp.end_date,
            }));
            return {
                status: 'success',
                message: 'Job Seeker Experience retrieved successfully',
                data: experience
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to get job seeker experience');
        }
    }
    async getExperience(user, experience_id) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { experiences: true }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const experience = await this.prisma.experiences.findUnique({
            where: { experience_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
        });
        if (!experience) {
            throw new common_1.NotFoundException('Experience not found');
        }
        return {
            status: 'success',
            message: 'Job Seeker Experience retrieved successfully',
            data: experience
        };
    }
    async addExperience(user, createExperienceDto) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const { experience_title, employment_type, company_name, location, location_type, description } = createExperienceDto;
        try {
            const experience = await this.prisma.experiences.create({
                data: {
                    experience_title,
                    employment_type,
                    company_name,
                    location,
                    location_type,
                    description,
                    start_date: createExperienceDto.start_date ? new Date(createExperienceDto.start_date) : null,
                    end_date: createExperienceDto.end_date ? new Date(createExperienceDto.end_date) : null,
                    job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id
                }
            });
            return {
                status: 'success',
                message: 'Job Seeker Experience added successfully',
                data: experience
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to add job seeker experience');
        }
    }
    async updateExperience(user, experience_id, updateExperienceDto) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { experiences: true }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const experience = await this.prisma.experiences.findUnique({
            where: { experience_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
        });
        if (!experience) {
            throw new common_1.NotFoundException('Experience not found');
        }
        const { experience_title, employment_type, company_name, location, location_type, description } = updateExperienceDto;
        try {
            await this.prisma.experiences.update({
                where: { experience_id },
                data: {
                    experience_title,
                    employment_type,
                    company_name,
                    location,
                    location_type,
                    description,
                    start_date: updateExperienceDto.start_date ? new Date(updateExperienceDto.start_date) : null,
                    end_date: updateExperienceDto.end_date ? new Date(updateExperienceDto.end_date) : null,
                }
            });
            return {
                status: 'success',
                message: 'Job Seeker Experience updated successfully',
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update job seeker experience');
        }
    }
    async deleteExperience(user, experience_id) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { experiences: true }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const experience = await this.prisma.experiences.findUnique({
            where: { experience_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
        });
        if (!experience) {
            throw new common_1.NotFoundException('Experience not found');
        }
        try {
            await this.prisma.experiences.delete({
                where: { experience_id }
            });
            return {
                status: 'success',
                message: 'Job Seeker Experience deleted successfully',
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to delete job seeker experience');
        }
    }
};
exports.ExperienceService = ExperienceService;
exports.ExperienceService = ExperienceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExperienceService);
//# sourceMappingURL=experience.service.js.map