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
exports.LogActivityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let LogActivityService = class LogActivityService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logActivity(user_id, user_role, activity) {
        try {
            await this.prisma.log_activities.create({
                data: {
                    user_id,
                    user_role,
                    activity,
                },
            });
        }
        catch (error) {
            console.error('Failed to log activity', error);
        }
    }
    async findAll(params) {
        const { page = 1, pageSize = 10, search, sortBy = 'created_at', sortOrder = 'desc' } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = {
                ...(search && {
                    OR: [
                        {
                            activity: {
                                contains: search,
                            },
                        },
                    ]
                }),
            };
            const data = await this.prisma.log_activities.findMany({
                where,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip,
                take,
            });
            const modifiedData = await this.modifyData.call(this, data);
            const totalData = await this.prisma.log_activities.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            return {
                status: "success",
                message: "Log activities retrieved successfully",
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: modifiedData,
            };
        }
        catch (error) {
            console.error('Failed to find all log activities', error);
            throw new Error('Failed to find all log activities');
        }
    }
    async modifyData(dataArray) {
        const modifiedData = [];
        for (const data of dataArray) {
            let user;
            if (data.user_role === 'superadmin') {
                user = await this.prisma.admins.findUnique({
                    where: {
                        admin_id: data.user_id,
                    },
                });
            }
            else if (data.user_role === 'company') {
                user = await this.prisma.companies.findUnique({
                    where: {
                        company_id: data.user
                    },
                });
            }
            else if (data.user_role === 'university') {
                user = await this.prisma.universities.findUnique({
                    where: {
                        university_id: data.user_id,
                    },
                });
            }
            else if (data.user_role === 'job_seeker') {
                user = await this.prisma.job_seekers.findUnique({
                    where: {
                        job_seeker_id: data.user_id,
                    },
                });
            }
            const deletedSensitiveInfo = Object.fromEntries(Object.entries(user).filter(([key]) => !['otp', 'otpExpires', 'password', 'updated_at', 'created_at'].includes(key)));
            const removeUserId = Object.fromEntries(Object.entries(data).filter(([key]) => !['user_id', 'user_role'].includes(key)));
            modifiedData.push({
                ...removeUserId,
                user: deletedSensitiveInfo,
            });
        }
        return modifiedData;
    }
};
exports.LogActivityService = LogActivityService;
exports.LogActivityService = LogActivityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LogActivityService);
//# sourceMappingURL=log-activity.service.js.map