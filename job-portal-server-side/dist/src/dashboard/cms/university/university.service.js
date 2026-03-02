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
exports.UniversityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
let UniversityService = class UniversityService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTotalStudents(user) {
        try {
            const total = await this.prisma.job_seeker_details.count({
                where: {
                    education: {
                        university_id: user.university_id
                    },
                },
            });
            return {
                status: 'success',
                message: 'Total students retrieved successfully',
                data: total,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve total students');
        }
    }
    async studentActivities(user, year) {
        try {
            const data = {
                months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',],
                totalRegistered: [],
                totalEmployed: [],
            };
            for (let month = 0; month < 12; month++) {
                const startDate = new Date(year, month, 1);
                const endDate = new Date(year, month + 1, 0);
                const totalRegistered = await this.prisma.job_seeker_details.count({
                    where: {
                        education: {
                            university_id: user.university_id
                        },
                        created_at: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                });
                const totalEmployed = await this.prisma.job_seekers.count({
                    where: {
                        job_seeker_detail: {
                            education: {
                                university_id: user.university_id
                            },
                        },
                        applications: {
                            some: {
                                status: 'accepted',
                            }
                        },
                        created_at: {
                            gte: startDate,
                            lte: endDate,
                        },
                    }
                });
                data.totalEmployed.push(totalEmployed);
                data.totalRegistered.push(totalRegistered);
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
    async getEnrolledStudents(user) {
        try {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth();
            const totalThisMonth = await this.prisma.job_seeker_details.count({
                where: {
                    created_at: {
                        gte: new Date(currentYear, currentMonth, 1),
                        lte: new Date(currentYear, currentMonth + 1, 0),
                    },
                    education: {
                        university_id: user.university_id,
                    },
                },
            });
            const totalLastMonth = await this.prisma.job_seeker_details.count({
                where: {
                    created_at: {
                        gte: new Date(currentYear, currentMonth - 1, 1),
                        lte: new Date(currentYear, currentMonth, 0),
                    },
                    education: {
                        university_id: user.university_id,
                    },
                },
            });
            let percentage;
            if (totalLastMonth > 0) {
                const increase = Math.max(0, totalThisMonth - totalLastMonth);
                percentage = Math.min((increase / totalLastMonth) * 100, 100).toFixed(0) + '%';
            }
            else if (totalThisMonth > 0) {
                percentage = '100%';
            }
            else {
                percentage = '0%';
            }
            return {
                status: 'success',
                message: 'Enrolled students retrieved successfully',
                data: percentage,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve enrolled students');
        }
    }
    async studentEmploymentRatio(user) {
        try {
            const totalTalents = await this.prisma.job_seeker_details.count({
                where: {
                    education: {
                        university_id: user.university_id
                    },
                },
            });
            const totalAccepted = await this.prisma.applications.findMany({
                where: {
                    job_seeker: {
                        job_seeker_detail: {
                            education: {
                                university_id: user.university_id
                            },
                        }
                    },
                    status: 'accepted',
                },
                distinct: ['job_seeker_id'],
            });
            const totalAcceptedCount = totalAccepted.length;
            const ratio = totalTalents === 0 ? 0 : ((totalAcceptedCount / totalTalents) * 100).toFixed(0);
            return {
                status: 'success',
                message: 'Talents acceptance ratio retrieved successfully',
                data: {
                    total_talents: totalTalents,
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
exports.UniversityService = UniversityService;
exports.UniversityService = UniversityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UniversityService);
//# sourceMappingURL=university.service.js.map