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
exports.JobSeekersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
let JobSeekersService = class JobSeekersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createJobSeekerDto) {
        const errors = await (0, class_validator_1.validate)(createJobSeekerDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingEmail = await this.prisma.job_seekers.findUnique({
            where: { email: createJobSeekerDto.email }
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email is already taken');
        }
        try {
            const { password, ...userData } = createJobSeekerDto;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newJobSeeker = await this.prisma.job_seekers.create({ data: { ...userData, password: hashedPassword } });
            return {
                status: "success",
                message: 'User created successfully',
                data: newJobSeeker
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to create user');
        }
    }
    async findAllTalents(params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = {
                verified: 'true',
                ...(search && {
                    OR: [
                        { full_name: { contains: search } },
                        { email: { contains: search } },
                    ]
                })
            };
            const totalData = await this.prisma.job_seekers.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            const jobSeekers = await this.prisma.job_seekers.findMany({
                where,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder
                },
                select: {
                    job_seeker_id: true,
                    full_name: true,
                    email: true,
                    job_seeker_detail: {
                        select: {
                            education: {
                                select: {
                                    university_name: true,
                                }
                            }
                        }
                    }
                }
            });
            const responseData = jobSeekers.map(jobSeeker => {
                return {
                    job_seeker_id: jobSeeker.job_seeker_id,
                    full_name: jobSeeker.full_name,
                    email: jobSeeker.email,
                    university_name: jobSeeker.job_seeker_detail.education ? jobSeeker.job_seeker_detail.education.university_name : null
                };
            });
            return {
                status: "success",
                message: 'Job Seekers retrieved successfully',
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: responseData
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve job seekers');
        }
    }
    async findAll(params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = search ? {
                OR: [
                    { full_name: { contains: search } },
                    { email: { contains: search } },
                ]
            } : {};
            const totalData = await this.prisma.job_seekers.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            const jobSeekers = await this.prisma.job_seekers.findMany({
                where,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder
                }
            });
            return {
                status: "success",
                message: 'Job Seekers retrieved successfully',
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: jobSeekers
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve job seekers');
        }
    }
    async findOne(job_seeker_id) {
        const existingJobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id },
            include: {
                job_seeker: true,
                personal_info: true,
                education: true,
                skills: true,
                projects: true,
                experiences: true,
                certifications: true,
                languages: true,
            }
        });
        if (!existingJobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker not found');
        }
        try {
            const modifiedEducation = (0, lodash_1.omit)(existingJobSeekerDetail.education, ['education_id', 'job_seeker_detail_id', 'university_id', 'created_at', 'updated_at']);
            const modifiedProjects = existingJobSeekerDetail.projects.map(project => (0, lodash_1.omit)(project, ['project_id', 'job_seeker_detail_id', 'created_at', 'updated_at']));
            const modifiedExperiences = existingJobSeekerDetail.experiences.map(experience => (0, lodash_1.omit)(experience, ['experience_id', 'job_seeker_detail_id', 'created_at', 'updated_at']));
            const modifiedCertifications = existingJobSeekerDetail.certifications.map(certification => (0, lodash_1.omit)(certification, ['certification_id', 'job_seeker_detail_id', 'created_at', 'updated_at']));
            const modifiedLanguages = existingJobSeekerDetail.languages.map(language => (0, lodash_1.omit)(language, ['language_id', 'job_seeker_detail_id', 'created_at', 'updated_at']));
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
                address: existingJobSeekerDetail.personal_info?.address,
                phone_number: existingJobSeekerDetail.personal_info?.phone_number,
                date_of_birth: existingJobSeekerDetail.personal_info?.date_of_birth,
                personal_summary: existingJobSeekerDetail.personal_summary,
                profile_picture_url: existingJobSeekerDetail.profile_picture_url,
                education: modifiedEducation,
                skills: existingJobSeekerDetail.skills.map(skill => skill.skill_name),
                projects: modifiedProjects,
                experiences: modifiedExperiences2,
                certifications: modifiedCertifications,
                languages: modifiedLanguages,
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
    async update(job_seeker_id, updateJobSeekerDto) {
        const errors = await (0, class_validator_1.validate)(updateJobSeekerDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingJobSeeker = await this.prisma.job_seekers.findUnique({
            where: { job_seeker_id }
        });
        if (!existingJobSeeker) {
            throw new common_1.NotFoundException(`Job Seeker with ID ${job_seeker_id} not found`);
        }
        try {
            const updatedJobSeeker = await this.prisma.job_seekers.update({
                where: { job_seeker_id },
                data: updateJobSeekerDto
            });
            return {
                status: "success",
                message: 'User updated successfully',
                data: updatedJobSeeker
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update user');
        }
    }
    async remove(job_seeker_id) {
        const existingJobSeeker = await this.prisma.job_seekers.findUnique({
            where: { job_seeker_id }
        });
        if (!existingJobSeeker) {
            throw new common_1.NotFoundException(`Job Seeker with ID ${job_seeker_id} not found`);
        }
        try {
            await this.prisma.job_seekers.delete({
                where: { job_seeker_id }
            });
            return {
                status: "success",
                message: 'User removed successfully'
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to remove user');
        }
    }
};
exports.JobSeekersService = JobSeekersService;
exports.JobSeekersService = JobSeekersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobSeekersService);
//# sourceMappingURL=job_seekers.service.js.map