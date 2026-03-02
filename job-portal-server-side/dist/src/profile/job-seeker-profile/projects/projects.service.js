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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProjects(user) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { projects: true }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        try {
            const projects = jobSeekerDetail.projects.map(project => ({
                project_id: project.project_id,
                project_name: project.project_name,
                description: project.description,
                start_date: project.start_date,
                end_date: project.end_date,
            }));
            return {
                status: 'success',
                message: 'Job Seeker Projects retrieved successfully',
                data: projects
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to get job seeker projects');
        }
    }
    async getProject(user, project_id) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { projects: true }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const project = await this.prisma.projects.findUnique({
            where: { project_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        return {
            status: 'success',
            message: 'Job Seeker Project retrieved successfully',
            data: project
        };
    }
    async addProjects(user, addProjectsDto) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        try {
            const { project_name, description, start_date, end_date } = addProjectsDto;
            await this.prisma.projects.create({
                data: {
                    project_name,
                    description,
                    start_date: new Date(start_date),
                    end_date: new Date(end_date),
                    job_seeker_details: {
                        connect: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
                    }
                }
            });
            return {
                status: 'success',
                message: 'Job Seeker Projects added successfully',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to add job seeker projects');
        }
    }
    async updateProjects(user, project_id, updateProjectsDto) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const project = await this.prisma.projects.findUnique({
            where: { project_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        try {
            const { project_name, description, start_date, end_date } = updateProjectsDto;
            await this.prisma.projects.update({
                where: { project_id },
                data: {
                    project_name,
                    description,
                    start_date: new Date(start_date),
                    end_date: new Date(end_date),
                }
            });
            return {
                status: 'success',
                message: 'Job Seeker Projects updated successfully',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to update job seeker projects');
        }
    }
    async deleteProjects(user, project_id) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const project = await this.prisma.projects.findUnique({
            where: { project_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
        });
        if (!project) {
            throw new common_1.NotFoundException('Project not found');
        }
        try {
            await this.prisma.projects.delete({
                where: { project_id }
            });
            return {
                status: 'success',
                message: 'Job Seeker Projects deleted successfully',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to delete job seeker projects');
        }
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map