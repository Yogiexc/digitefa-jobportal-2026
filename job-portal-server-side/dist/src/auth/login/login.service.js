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
exports.LoginService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../../prisma/prisma.service");
let LoginService = class LoginService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateJobSeeker(loginJobSeekerDto) {
        const [job_seeker, university, admin, company] = await Promise.all([
            this.prisma.job_seekers.findUnique({
                where: { email: loginJobSeekerDto.email },
            }),
            this.prisma.universities.findUnique({
                where: { email: loginJobSeekerDto.email },
            }),
            this.prisma.admins.findUnique({
                where: { email: loginJobSeekerDto.email },
            }),
            this.prisma.companies.findUnique({
                where: { email: loginJobSeekerDto.email },
            }),
        ]);
        if (!job_seeker && !university && !admin && !company) {
            throw new common_1.NotFoundException('User not found. Please register to create an account.');
        }
        if (company || university || admin) {
            if (company && company.verified === 'true') {
                throw new common_1.ConflictException('Email is already registered and verified for company. Please login for company.');
            }
            if (university && university.verified === 'true') {
                throw new common_1.ConflictException('Email is already registered and verified for university. Please login for university.');
            }
            if (admin) {
                throw new common_1.ConflictException('Email is already registered in CMS. Please login instead.');
            }
        }
        if (!(await bcrypt.compareSync(loginJobSeekerDto.password, job_seeker.password))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const job_seeker_detail = { ...job_seeker, role: 'job_seeker' };
        return job_seeker_detail;
    }
    async validateCMS(loginCMSDto) {
        const [job_seeker, university, admin, company] = await Promise.all([
            this.prisma.job_seekers.findUnique({
                where: { email: loginCMSDto.email },
            }),
            this.prisma.universities.findUnique({
                where: { email: loginCMSDto.email },
            }),
            this.prisma.admins.findUnique({ where: { email: loginCMSDto.email } }),
            this.prisma.companies.findUnique({ where: { email: loginCMSDto.email } }),
        ]);
        if (!job_seeker && !university && !admin && !company) {
            throw new common_1.NotFoundException('User not found. Please register to create an account.');
        }
        if (job_seeker && job_seeker.verified === 'true') {
            throw new common_1.ConflictException('Email is already registered for job seeker. Please login for job seeker.');
        }
        let user;
        if (university &&
            (await bcrypt.compare(loginCMSDto.password, university.password))) {
            user = { ...university, role: 'university' };
        }
        else if (company &&
            (await bcrypt.compare(loginCMSDto.password, company.password))) {
            user = { ...company, role: 'company' };
        }
        else if (admin &&
            (await bcrypt.compare(loginCMSDto.password, admin.password))) {
            user = { ...admin, role: 'superadmin' };
        }
        else {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
    async login(user) {
        let payload;
        if (user.role === 'job_seeker') {
            payload = {
                job_seeker_id: user.job_seeker_id,
                email: user.email,
                role: user.role,
            };
        }
        else if (user.role === 'university') {
            payload = {
                university_id: user.university_id,
                email: user.email,
                role: user.role,
            };
        }
        else if (user.role === 'company') {
            payload = {
                company_id: user.company_id,
                email: user.email,
                role: user.role,
            };
        }
        else if (user.role === 'superadmin') {
            payload = { admin_id: user.admin_id, email: user.email, role: user.role };
        }
        const token = await this.jwtService.signAsync(payload);
        const detailUser = Object.fromEntries(Object.entries(user).filter(([key]) => ![
            'otp',
            'otpExpires',
            'password',
            'updated_at',
            'created_at',
        ].includes(key)));
        return {
            status: 'success',
            message: 'Login Successful',
            data: {
                token: token,
                user: detailUser,
            },
        };
    }
    async loginGoogle(credential) {
        const userData = this.jwtService.decode(credential);
        if (!userData) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        let user = await this.prisma.job_seekers.findUnique({
            where: { email: userData.email },
        });
        if (!user) {
            const password = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await this.prisma.job_seekers.create({
                data: {
                    email: userData.email,
                    full_name: userData.name,
                    verified: 'true',
                    password: hashedPassword,
                    job_seeker_detail: {
                        create: {},
                    },
                },
            });
        }
        const payload = {
            job_seeker_id: user.job_seeker_id,
            email: user.email,
            role: 'job_seeker',
        };
        const token = await this.jwtService.signAsync(payload);
        const detailUser = Object.fromEntries(Object.entries(user).filter(([key]) => ![
            'otp',
            'otpExpires',
            'password',
            'updated_at',
            'created_at',
        ].includes(key)));
        return {
            status: 'success',
            message: 'Login Successful',
            data: {
                token: token,
                user: detailUser,
            },
        };
    }
    async ssoLms(dto) {
        let user = await this.prisma.job_seekers.findFirst({
            where: {
                OR: [
                    { lmsUserId: dto.lmsUserId },
                    { email: dto.email }
                ]
            }
        });
        if (!user) {
            const password = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await this.prisma.job_seekers.create({
                data: {
                    email: dto.email,
                    full_name: dto.name,
                    verified: 'true',
                    password: hashedPassword,
                    lmsUserId: dto.lmsUserId,
                    lmsLinkedAt: new Date(),
                    job_seeker_detail: {
                        create: {},
                    },
                },
            });
        }
        else if (!user.lmsUserId) {
            user = await this.prisma.job_seekers.update({
                where: { job_seeker_id: user.job_seeker_id },
                data: {
                    lmsUserId: dto.lmsUserId,
                    lmsLinkedAt: new Date(),
                }
            });
        }
        const payload = {
            job_seeker_id: user.job_seeker_id,
            email: user.email,
            role: 'job_seeker',
        };
        const token = await this.jwtService.signAsync(payload);
        const detailUser = Object.fromEntries(Object.entries(user).filter(([key]) => ![
            'otp',
            'otpExpires',
            'password',
            'updated_at',
            'created_at',
        ].includes(key)));
        return {
            status: 'success',
            message: 'Login Successful',
            data: {
                token: token,
                user: detailUser,
            },
        };
    }
    async getUser(user) {
        let users;
        if (user.role === 'job_seeker') {
            users = await this.prisma.job_seekers.findUnique({
                where: { job_seeker_id: user.job_seeker_id },
            });
            users = { ...users, role: 'job_seeker' };
        }
        else if (user.role === 'university') {
            users = await this.prisma.universities.findUnique({
                where: { university_id: user.university_id },
            });
            users = { ...users, role: 'university' };
        }
        else if (user.role === 'company') {
            users = await this.prisma.companies.findUnique({
                where: { company_id: user.company_id },
            });
            users = { ...users, role: 'company' };
        }
        else if (user.role === 'superadmin') {
            users = await this.prisma.admins.findUnique({
                where: { admin_id: user.admin_id },
            });
            users = { ...users, role: 'superadmin' };
        }
        if (!users) {
            throw new common_1.UnauthorizedException('Token not found!, Please login again');
        }
        const detailUser = Object.fromEntries(Object.entries(users).filter(([key]) => !['password', 'updated_at', 'created_at'].includes(key)));
        return {
            status: 'success',
            message: 'Login Successful',
            data: {
                user: detailUser,
            },
        };
    }
};
exports.LoginService = LoginService;
exports.LoginService = LoginService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], LoginService);
//# sourceMappingURL=login.service.js.map