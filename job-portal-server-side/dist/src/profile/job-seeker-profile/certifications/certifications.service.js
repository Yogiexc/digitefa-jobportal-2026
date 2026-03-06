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
exports.CertificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let CertificationsService = class CertificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCertifications(user) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { certifications: true }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        try {
            const certifications = jobSeekerDetail.certifications.map(certification => ({
                certification_id: certification.certification_id,
                certification_name: certification.certification_name,
                issuing_organization: certification.issuing_organization,
                issue_date: certification.issue_date,
                expiration_date: certification.expiration_date,
                credential_url: certification.credential_url,
            }));
            return {
                status: 'success',
                data: certifications
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to get job seeker certifications');
        }
    }
    async getCertification(user, certification_id) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
            include: { certifications: true }
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const certification = await this.prisma.certifications.findUnique({
            where: {
                certification_id,
                job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id
            }
        });
        if (!certification) {
            throw new common_1.NotFoundException('Certification not found');
        }
        return {
            status: 'success',
            message: 'Job Seeker Certification retrieved successfully',
            data: certification
        };
    }
    async addCertifications(user, addCertificationsDto) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        try {
            const { certification_name, issuing_organization, issue_date, expiration_date, credential_url } = addCertificationsDto;
            await this.prisma.certifications.create({
                data: {
                    certification_name,
                    issuing_organization,
                    credential_url,
                    issue_date: new Date(issue_date),
                    expiration_date: new Date(expiration_date),
                    job_seeker_details: {
                        connect: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
                    }
                }
            });
            return {
                status: 'success',
                message: 'Job Seeker Certifications added successfully',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to add job seeker certifications');
        }
    }
    async updateCertifications(user, certification_id, addCertificationsDto) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const certification = await this.prisma.certifications.findUnique({
            where: { certification_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
        });
        if (!certification) {
            throw new common_1.NotFoundException('Certification not found');
        }
        try {
            const { certification_name, issuing_organization, issue_date, expiration_date, credential_url } = addCertificationsDto;
            await this.prisma.certifications.update({
                where: { certification_id },
                data: {
                    certification_name,
                    issuing_organization,
                    issue_date: new Date(issue_date),
                    expiration_date: new Date(expiration_date),
                    credential_url
                }
            });
            return {
                status: 'success',
                message: 'Job Seeker Certifications updated successfully',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to update job seeker certifications');
        }
    }
    async deleteCertifications(user, certification_id) {
        const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!jobSeekerDetail) {
            throw new common_1.NotFoundException('Job seeker details not found');
        }
        const certification = await this.prisma.certifications.findUnique({
            where: { certification_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
        });
        if (!certification) {
            throw new common_1.NotFoundException('Certification not found');
        }
        try {
            await this.prisma.certifications.delete({
                where: { certification_id }
            });
            return {
                status: 'success',
                message: 'Job Seeker Certifications deleted successfully',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to delete job seeker certifications');
        }
    }
    async addCertificationFromLms(data) {
        try {
            const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
                where: { job_seeker_id: data.job_portal_id }
            });
            if (!jobSeekerDetail) {
                throw new common_1.NotFoundException('Job Seeker Detail not found for the given job_portal_id');
            }
            await this.prisma.certifications.create({
                data: {
                    certification_name: data.certification_name,
                    issuing_organization: data.issuing_organization,
                    issue_date: new Date(data.issue_date),
                    expiration_date: data.expiration_date ? new Date(data.expiration_date) : null,
                    credential_url: data.credential_url,
                    job_seeker_details: {
                        connect: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
                    }
                }
            });
            return {
                status: 'success',
                message: 'Certification from LMS successfully added'
            };
        }
        catch (error) {
            console.log(error);
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to add job seeker certification from LMS');
        }
    }
};
exports.CertificationsService = CertificationsService;
exports.CertificationsService = CertificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CertificationsService);
//# sourceMappingURL=certifications.service.js.map