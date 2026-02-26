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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let CompanyService = class CompanyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTotalJobVacancies(user) {
        try {
            const total = await this.prisma.jobs.count({
                where: {
                    company_id: user.company_id,
                    status: 'active',
                    deleted_at: null,
                    expired_at: {
                        gte: new Date(),
                    },
                },
            });
            return {
                status: 'success',
                message: 'Total job vacancies retrieved successfully',
                data: total,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve total job vacancies');
        }
    }
    async getJobOverview(user, year) {
        try {
            const months = [
                'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
            ];
            const data = [];
            for (let month = 0; month < 12; month++) {
                const startDate = new Date(year, month, 1);
                const endDate = new Date(year, month + 1, 0);
                const totalVacancies = await this.prisma.jobs.count({
                    where: {
                        company_id: user.company_id,
                        created_at: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                });
                const totalApplicants = await this.prisma.applications.count({
                    where: {
                        job: {
                            company_id: user.company_id,
                        },
                        applied_at: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                });
                const totalAccepted = await this.prisma.applications.count({
                    where: {
                        applied_at: {
                            gte: startDate,
                            lte: endDate,
                        },
                        status: 'accepted',
                    },
                });
                data.push({
                    label: months[month],
                    totalVacancies,
                    totalApplicants,
                    totalAccepted,
                });
            }
            return {
                status: 'success',
                message: 'Job overview retrieved successfully',
                data
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve job overview');
        }
    }
    async talentsAcceptanceRatio(user) {
        try {
            const totalApplicants = await this.prisma.applications.findMany({
                where: {
                    job: {
                        company_id: user.company_id,
                    },
                },
                distinct: ['job_seeker_id'],
            });
            const totalAccepted = await this.prisma.applications.findMany({
                where: {
                    job: {
                        company_id: user.company_id,
                    },
                    status: 'accepted',
                },
                distinct: ['job_seeker_id'],
            });
            const totalApplicantsCount = totalApplicants.length;
            const totalAcceptedCount = totalAccepted.length;
            const ratio = totalApplicantsCount === 0
                ? 0
                : ((totalAcceptedCount / totalApplicantsCount) * 100).toFixed(0);
            return {
                status: 'success',
                message: 'Talents acceptance ratio retrieved successfully',
                data: {
                    total_applicants: totalApplicants.length,
                    total_accepted: totalAccepted.length,
                    ratio: ratio,
                },
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve talents acceptance ratio');
        }
    }
};
exports.CompanyService = CompanyService;
exports.CompanyService = CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyService);
//# sourceMappingURL=company.service.js.map