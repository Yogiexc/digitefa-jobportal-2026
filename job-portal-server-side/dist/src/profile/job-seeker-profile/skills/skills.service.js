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
exports.SkillsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let SkillsService = class SkillsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSkills(user) {
        try {
            const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
                where: { job_seeker_id: user.job_seeker_id },
            });
            const skills = await this.prisma.skills.findMany({
                where: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id },
                select: {
                    skill_id: true,
                    skill_name: true,
                },
                orderBy: {
                    skill_name: 'asc'
                }
            });
            return {
                status: 'success',
                message: 'Job Seeker Skills fetched successfully',
                data: skills
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to fetch job seeker skills');
        }
    }
    async createSkills(user, createSkillsDto) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker not found');
        }
        const getSkills = await this.prisma.skills.findFirst({
            where: {
                skill_name: createSkillsDto.skill_name,
                job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id
            }
        });
        if (getSkills) {
            throw new common_1.BadRequestException('Skill already exists');
        }
        try {
            const { skill_name } = createSkillsDto;
            const newSkill = await this.prisma.skills.create({
                data: {
                    skill_name,
                    job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id
                }
            });
            return {
                status: 'success',
                message: 'Job Seeker Skills created successfully',
                data: newSkill
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to update job seeker skills');
        }
    }
    async deleteSkill(user, skill_id) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker not found');
        }
        try {
            await this.prisma.skills.delete({
                where: { skill_id }
            });
            return {
                status: 'success',
                message: 'Job Seeker Skill deleted successfully',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to delete job seeker skill');
        }
    }
};
exports.SkillsService = SkillsService;
exports.SkillsService = SkillsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SkillsService);
//# sourceMappingURL=skills.service.js.map