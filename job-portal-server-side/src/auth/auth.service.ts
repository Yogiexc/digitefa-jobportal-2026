import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,) { }

    async getUser(user: any) {
        let users;
        if (user.role === 'job_seeker') {
            users = await this.prisma.job_seekers.findUnique({ where: { job_seeker_id: user.job_seeker_id } });
            users = { ...users, role: 'job_seeker' }
        } else if (user.role === 'university') {
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
            users = { ...users, university_name: users.university_detail.university_name, role: 'university' }
        } else if (user.role === 'company') {
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
            users = { ...users, legal_name: users.company_detail.legal_name, role: 'company' }
        } else if (user.role === 'superadmin') {
            users = await this.prisma.admins.findUnique({ where: { admin_id: user.admin_id } });
            users = { ...users, role: 'superadmin' }
        }
        if (!users) {
            throw new UnauthorizedException('Token not found!, Please login again');
        }
        const detailUser = Object.fromEntries(
            Object.entries(users).filter(([key]) => !['otp', 'otpExpires', 'password', 'updated_at', 'created_at', 'company_detail', 'university_detail'].includes(key))
        );
        return {
            status: "success",
            message: 'Login Successful',
            data: {
                user: detailUser
            }
        };
    }

}
