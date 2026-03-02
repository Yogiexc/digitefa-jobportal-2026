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
exports.SuperadminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../prisma/prisma.service");
const date_fns_1 = require("date-fns");
let SuperadminService = class SuperadminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTotalTalents(time = 'all') {
        try {
            const now = new Date();
            let startDate;
            if (time === 'week') {
                const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                startDate = new Date(firstDayOfWeek.setHours(0, 0, 0, 0));
            }
            else if (time === 'month') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            }
            const total = await this.prisma.job_seekers.count({
                where: {
                    created_at: {
                        gte: startDate,
                    },
                },
            });
            return {
                status: 'success',
                message: 'Total talents retrieved successfully',
                data: total,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve total talents');
        }
    }
    async getTotalCompanies(time = 'all') {
        try {
            const now = new Date();
            let startDate;
            if (time === 'week') {
                const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                startDate = new Date(firstDayOfWeek.setHours(0, 0, 0, 0));
            }
            else if (time === 'month') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            }
            const total = await this.prisma.companies.count({
                where: {
                    created_at: {
                        gte: startDate,
                    },
                },
            });
            return {
                status: 'success',
                message: 'Total companies retrieved successfully',
                data: total,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve total companies');
        }
    }
    async getTotalUniversities(time = 'all') {
        try {
            const now = new Date();
            let startDate;
            if (time === 'week') {
                const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                startDate = new Date(firstDayOfWeek.setHours(0, 0, 0, 0));
            }
            else if (time === 'month') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            }
            const total = await this.prisma.universities.count({
                where: {
                    created_at: {
                        gte: startDate,
                    },
                },
            });
            return {
                status: 'success',
                message: 'Total universities retrieved successfully',
                data: total,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve total universities');
        }
    }
    async getRecentJobs(limit = 5) {
        try {
            const jobs = await this.prisma.jobs.findMany({
                where: {
                    status: 'active',
                    deleted_at: null,
                    expired_at: {
                        gte: new Date(),
                    },
                },
                take: +limit,
                orderBy: {
                    created_at: 'desc',
                },
                select: {
                    job_id: true,
                    title: true,
                    published_at: true,
                    company: {
                        select: {
                            company_detail: {
                                select: {
                                    market_name: true,
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
                    published_at: job.published_at,
                    company: job.company.company_detail,
                };
            });
            return {
                status: 'success',
                message: 'Recent jobs retrieved successfully',
                data: responseData,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve recent jobs');
        }
    }
    async getTalentsOverview(week, month) {
        try {
            const year = new Date().getFullYear();
            const startOfMonth = new Date(year, month - 1, 1);
            const startOfRequestedWeek = (0, date_fns_1.startOfWeek)((0, date_fns_1.addDays)(startOfMonth, (week - 1) * 7), { weekStartsOn: 1 });
            const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const days = [];
            const data = [];
            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(startOfRequestedWeek);
                currentDate.setDate(currentDate.getDate() + i);
                if (currentDate.getMonth() !== month - 1)
                    continue;
                const dayOfWeekIndex = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
                const dayOfWeek = daysOfWeek[dayOfWeekIndex];
                const talentsCount = await this.prisma.job_seekers.count({
                    where: {
                        created_at: {
                            gte: new Date(currentDate.setHours(0, 0, 0, 0)),
                            lt: new Date(currentDate.setHours(23, 59, 59, 999)),
                        },
                    },
                });
                days.push(dayOfWeek);
                data.push(talentsCount);
            }
            return {
                status: 'success',
                message: 'Talents overview retrieved successfully',
                data: {
                    label: days,
                    talentsData: data,
                },
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve talents overview');
        }
    }
    async getCompaniesUniversitiesOverview(month) {
        try {
            const year = new Date().getFullYear();
            const endOfMonth = new Date(year, month, 0);
            const data = {
                week: [],
                companies: [],
                universities: []
            };
            let week = 1;
            const startDate = new Date(year, month - 1, 1);
            while (startDate <= endOfMonth) {
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                if (endDate > endOfMonth) {
                    endDate.setDate(endOfMonth.getDate());
                }
                const companies = await this.prisma.companies.count({
                    where: {
                        created_at: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                });
                const universities = await this.prisma.universities.count({
                    where: {
                        created_at: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                });
                data.week.push("Week " + week);
                data.companies.push(companies);
                data.universities.push(universities);
                startDate.setDate(startDate.getDate() + 7);
                week++;
            }
            return {
                status: 'success',
                message: 'Companies and universities overview retrieved successfully',
                data: {
                    weeks: data.week,
                    companies: data.companies,
                    universities: data.universities,
                },
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve companies and universities overview');
        }
    }
};
exports.SuperadminService = SuperadminService;
exports.SuperadminService = SuperadminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuperadminService);
//# sourceMappingURL=superadmin.service.js.map