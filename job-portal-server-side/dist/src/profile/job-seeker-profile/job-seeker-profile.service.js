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
exports.JobSeekerProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const class_validator_1 = require("class-validator");
const fs = require("fs");
const path_1 = require("path");
let JobSeekerProfileService = class JobSeekerProfileService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPersonalInfo(user) {
        const existingJobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { job_seeker: true, personal_info: true }
        });
        if (!existingJobSeekerDetail.personal_info) {
        }
        const modifiedData = {
            full_name: existingJobSeekerDetail.job_seeker?.full_name,
            email: existingJobSeekerDetail.job_seeker?.email,
            address: existingJobSeekerDetail.personal_info ? existingJobSeekerDetail.personal_info.address : null,
            phone_number: existingJobSeekerDetail.personal_info ? existingJobSeekerDetail.personal_info.phone_number : null,
            date_of_birth: existingJobSeekerDetail.personal_info ? existingJobSeekerDetail.personal_info.date_of_birth : null,
            profile_picture_url: existingJobSeekerDetail.profile_picture_url,
        };
        return {
            status: "success",
            data: modifiedData
        };
    }
    async updateProfilePicture(user, profile_picture) {
        if (!profile_picture) {
            throw new common_1.BadRequestException('Profile picture is required');
        }
        const existingJobSeeker = await this.prisma.job_seekers.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { job_seeker_detail: true, }
        });
        const currentProfilePictureUrl = existingJobSeeker.job_seeker_detail?.profile_picture_url;
        try {
            await this.prisma.job_seekers.update({
                where: { job_seeker_id: user.job_seeker_id },
                data: {
                    job_seeker_detail: {
                        update: { profile_picture_url: profile_picture?.path },
                    }
                },
            });
            if (profile_picture && currentProfilePictureUrl) {
                const oldFilePath = (0, path_1.join)(currentProfilePictureUrl);
                if (fs.existsSync(oldFilePath)) {
                    try {
                        await fs.promises.unlink(oldFilePath);
                    }
                    catch (error) {
                        console.error('Failed to delete old profile picture file:', error);
                    }
                }
                else {
                    console.warn('Old profile picture file not found at:', oldFilePath);
                }
            }
            return {
                status: 'success',
                message: 'Job Seeker profile picture updated successfully',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to update job seeker profile picture');
        }
    }
    async updatePersonalInfo(user, updatePersonalInfoDto) {
        const errors = await (0, class_validator_1.validate)(updatePersonalInfoDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException('Validation failed');
        }
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        try {
            const { full_name, address, phone_number, date_of_birth } = updatePersonalInfoDto;
            let dateOfBirthDate;
            if (date_of_birth) {
                dateOfBirthDate = new Date(date_of_birth);
                dateOfBirthDate.setUTCHours(0, 0, 0, 0);
            }
            await this.prisma.job_seekers.update({
                where: { job_seeker_id: user.job_seeker_id },
                data: {
                    full_name
                }
            });
            await this.prisma.job_seeker_details.update({
                where: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id },
                data: {
                    personal_info: {
                        upsert: {
                            update: { address, phone_number, date_of_birth: dateOfBirthDate },
                            create: { address, phone_number, date_of_birth: dateOfBirthDate },
                        },
                    }
                },
            });
            return {
                status: 'success',
                message: 'Job Seeker Profile updated successfully',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to update job seeker profile');
        }
    }
    async getPersonalSummary(user) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { job_seeker: true }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        return {
            status: 'success',
            message: 'Job Seeker Personal Summary retrieved successfully',
            data: jobSeekerDetail.personal_summary
        };
    }
    async updatePersonalSummary(user, updatePersonalSummaryDto) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        try {
            const { personal_summary } = updatePersonalSummaryDto;
            await this.prisma.job_seeker_details.update({
                where: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id },
                data: {
                    personal_summary
                }
            });
            return {
                status: 'success',
                message: 'Job Seeker Personal Summary updated successfully',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to update job seeker personal summary');
        }
    }
    async getEducation(user) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { education: true }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const modifiedDataEducation = {
            university_name: jobSeekerDetail.education ? jobSeekerDetail.education.university_name : null,
            degree: jobSeekerDetail.education ? jobSeekerDetail.education.degree : null,
            major: jobSeekerDetail.education ? jobSeekerDetail.education.major : null,
            start_date: jobSeekerDetail.education ? jobSeekerDetail.education.start_date : null,
            end_date: jobSeekerDetail.education ? jobSeekerDetail.education.end_date : null,
            grade: jobSeekerDetail.education ? (jobSeekerDetail.education.grade ? jobSeekerDetail.education.grade : null) : null,
        };
        return {
            status: 'success',
            message: 'Job Seeker Education retrieved successfully',
            data: modifiedDataEducation
        };
    }
    async updateEducation(user, updateEducationDto) {
        const errors = await (0, class_validator_1.validate)(updateEducationDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException('Validation failed');
        }
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        try {
            const getUniversity = await this.prisma.university_details.findUnique({
                where: { university_name: updateEducationDto.university_name }
            });
            await this.prisma.education.upsert({
                where: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id },
                update: {
                    university_name: updateEducationDto.university_name,
                    degree: updateEducationDto.degree,
                    major: updateEducationDto.major,
                    start_date: new Date(updateEducationDto.start_date),
                    end_date: new Date(updateEducationDto.end_date),
                    grade: updateEducationDto.grade,
                },
                create: {
                    university_name: updateEducationDto.university_name,
                    degree: updateEducationDto.degree,
                    major: updateEducationDto.major,
                    start_date: new Date(updateEducationDto.start_date),
                    end_date: new Date(updateEducationDto.end_date),
                    grade: updateEducationDto.grade,
                    job_seeker_details: {
                        connect: {
                            job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id,
                        }
                    },
                }
            });
            if (getUniversity) {
                await this.prisma.education.update({
                    where: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id },
                    data: {
                        university: {
                            connect: {
                                university_id: getUniversity.university_id
                            }
                        }
                    }
                });
            }
            else {
                await this.prisma.education.update({
                    where: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id },
                    data: {
                        university: {
                            disconnect: true
                        }
                    }
                });
            }
            return {
                status: 'success',
                message: 'Job Seeker Education updated successfully',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to update job seeker education');
        }
    }
};
exports.JobSeekerProfileService = JobSeekerProfileService;
exports.JobSeekerProfileService = JobSeekerProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobSeekerProfileService);
//# sourceMappingURL=job-seeker-profile.service.js.map