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
exports.LanguagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const lodash_1 = require("lodash");
let LanguagesService = class LanguagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLanguages(user) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        try {
            const languages = await this.prisma.languages.findMany({
                where: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id },
                orderBy: { language_name: 'asc' }
            });
            const modifiedLanguages = languages.map(language => (0, lodash_1.omit)(language, ['job_seeker_detail_id', 'created_at', 'updated_at']));
            return {
                status: 'success',
                message: 'Job Seeker Languages retrieved successfully',
                data: modifiedLanguages
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to get job seeker languages');
        }
    }
    async getLanguage(user, language_id) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { languages: true }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const language = await this.prisma.languages.findUnique({
            where: { language_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
        });
        if (!language) {
            throw new common_1.NotFoundException('Language not found');
        }
        return {
            status: 'success',
            message: 'Job Seeker Language retrieved successfully',
            data: language
        };
    }
    async addLanguages(user, createLanguageDto) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const checkLanguages = await this.prisma.languages.findFirst({
            where: {
                language_name: createLanguageDto.language_name,
                job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id
            }
        });
        if (checkLanguages) {
            throw new common_1.BadRequestException('Language already exists');
        }
        try {
            const language = await this.prisma.languages.create({
                data: {
                    ...createLanguageDto,
                    job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id
                }
            });
            return {
                status: 'success',
                message: 'Job Seeker Language added successfully',
                data: language
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to add job seeker language');
        }
    }
    async updateLanguages(user, language_id, updateLanguageDto) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { languages: true }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const language = await this.prisma.languages.findUnique({
            where: { language_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
        });
        if (!language) {
            throw new common_1.NotFoundException('Language not found');
        }
        try {
            const updatedLanguage = await this.prisma.languages.update({
                where: { language_id },
                data: updateLanguageDto
            });
            return {
                status: 'success',
                message: 'Job Seeker Language updated successfully',
                data: updatedLanguage
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update job seeker language');
        }
    }
    async deleteLanguages(user, language_id) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { languages: true }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const language = await this.prisma.languages.findUnique({
            where: { language_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
        });
        if (!language) {
            throw new common_1.NotFoundException('Language not found');
        }
        try {
            await this.prisma.languages.delete({
                where: { language_id }
            });
            return {
                status: 'success',
                message: 'Job Seeker Language deleted successfully'
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to delete job seeker language');
        }
    }
};
exports.LanguagesService = LanguagesService;
exports.LanguagesService = LanguagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LanguagesService);
//# sourceMappingURL=languages.service.js.map