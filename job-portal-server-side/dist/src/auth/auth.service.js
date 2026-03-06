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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUser(user) {
        let users;
        if (user.role === 'job_seeker') {
            users = await this.prisma.job_seekers.findUnique({ where: { job_seeker_id: user.job_seeker_id } });
            if (users)
                users = { ...users, role: 'job_seeker' };
        }
        else if (user.role === 'university') {
            users = await this.prisma.universities.findUnique({
                where: { university_id: user.university_id },
                select: {
                    university_id: true,
                    email: true,
                    full_name: true,
                    verified: true,
                    status: true,
                    university_detail: {
                        select: {
                            university_name: true,
                        }
                    }
                }
            });
            if (users)
                users = { ...users, university_name: users.university_detail?.university_name || '', role: 'university' };
        }
        else if (user.role === 'company') {
            users = await this.prisma.companies.findUnique({
                where: { company_id: user.company_id },
                select: {
                    company_id: true,
                    email: true,
                    full_name: true,
                    phone_number: true,
                    verified: true,
                    status: true,
                    company_detail: {
                        select: {
                            legal_name: true,
                        }
                    }
                }
            });
            if (users)
                users = { ...users, legal_name: users.company_detail?.legal_name || '', role: 'company' };
        }
        else if (user.role === 'superadmin') {
            users = await this.prisma.admins.findUnique({ where: { admin_id: user.admin_id } });
            if (users)
                users = { ...users, role: 'superadmin' };
        }
        if (!users) {
            throw new common_1.UnauthorizedException('Token not found!, Please login again');
        }
        const detailUser = Object.fromEntries(Object.entries(users).filter(([key]) => !['otp', 'otpExpires', 'password', 'updated_at', 'created_at', 'company_detail', 'university_detail'].includes(key)));
        return {
            status: "success",
            message: 'Login Successful',
            data: {
                user: detailUser
            }
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map