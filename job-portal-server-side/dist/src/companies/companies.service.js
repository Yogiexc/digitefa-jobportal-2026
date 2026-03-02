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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const class_validator_1 = require("class-validator");
const approval_email_template_1 = require("./email-templates/approval-email-template");
let CompaniesService = class CompaniesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCompanyDto) {
        const errors = await (0, class_validator_1.validate)(createCompanyDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingEmail = await this.prisma.companies.findUnique({
            where: {
                email: createCompanyDto.email,
            },
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email is already taken');
        }
        try {
            const { password, ...userData } = createCompanyDto;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newCompany = await this.prisma.companies.create({
                data: {
                    ...userData,
                    password: hashedPassword,
                },
            });
            return {
                status: 'success',
                message: 'Company created successfully',
                data: newCompany,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to create company');
        }
    }
    async findAllCompanyManagement(params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc', } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = {
                status: {
                    in: ['submitted', 'accepted', 'rejected'],
                },
                ...(search && {
                    OR: [
                        {
                            company_detail: {
                                legal_name: { contains: search },
                            },
                        },
                        {
                            company_detail: {
                                market_name: { contains: search },
                            },
                        },
                        { email: { contains: search } },
                    ],
                }),
            };
            const totalData = await this.prisma.companies.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            const companies = await this.prisma.companies.findMany({
                where,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                select: {
                    company_id: true,
                    email: true,
                    status: true,
                    created_at: true,
                    company_detail: {
                        select: {
                            legal_name: true,
                            market_name: true,
                        },
                    },
                },
            });
            const modifiedCompanies = companies.map((company) => {
                let newStatus;
                switch (company.status) {
                    case 'submitted':
                        newStatus = 'Pending';
                        break;
                    case 'accepted':
                        newStatus = 'Accepted';
                        break;
                    case 'rejected':
                        newStatus = 'Rejected';
                        break;
                    default:
                        newStatus = company.status;
                }
                return {
                    company_id: company.company_id,
                    email: company.email,
                    status: newStatus,
                    created_at: company.created_at,
                    legal_name: company.company_detail.legal_name,
                    market_name: company.company_detail.market_name,
                };
            });
            return {
                status: 'success',
                message: 'Companies retrieved successfully',
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: modifiedCompanies,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve companies');
        }
    }
    async findAll(params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc', } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = search
                ? {
                    OR: [
                        {
                            company_detail: {
                                legal_name: { contains: search },
                            },
                        },
                        {
                            company_detail: {
                                market_name: { contains: search },
                            },
                        },
                        { email: { contains: search } },
                    ],
                }
                : {};
            const totalData = await this.prisma.companies.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            const companies = await this.prisma.companies.findMany({
                where,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                select: {
                    company_id: true,
                    full_name: true,
                    email: true,
                    status: true,
                    created_at: true,
                    company_detail: {
                        select: {
                            legal_name: true,
                            market_name: true,
                        },
                    },
                },
            });
            const modifiedCompanies = companies.map((company) => {
                return {
                    company_id: company.company_id,
                    full_name: company.full_name,
                    email: company.email,
                    status: company.status,
                    created_at: company.created_at,
                    legal_name: company.company_detail.legal_name,
                    market_name: company.company_detail.market_name,
                };
            });
            return {
                status: 'success',
                message: 'Companies retrieved successfully',
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: modifiedCompanies,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve companies');
        }
    }
    async findOne(company_id) {
        const companies = await this.prisma.companies.findUnique({
            where: { company_id },
            select: {
                company_id: true,
                email: true,
                phone_number: true,
                status: true,
                company_detail: true,
            },
        });
        if (!companies) {
            throw new common_1.NotFoundException(`Company with ID ${company_id} not found`);
        }
        try {
            return {
                status: 'success',
                data: companies,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve companies');
        }
    }
    async searchTalents(query) {
        if (!query)
            return { status: 'success', data: [] };
        const seekers = await this.prisma.job_seeker_details.findMany({
            include: {
                job_seeker: { select: { email: true, full_name: true } },
                skills: true,
                experiences: true,
                education: true,
            },
        });
        const talents = seekers.map((s) => {
            const skillsText = s.skills.map((skill) => skill.skill_name).join(', ');
            const expText = s.experiences
                .map((e) => `${e.experience_title} at ${e.company_name} - ${e.description}`)
                .join('; ');
            const eduText = s.education
                ? `${s.education.degree} in ${s.education.major} at ${s.education.university_name}`
                : '';
            const profileText = `Name: ${s.job_seeker.full_name}. Skills: ${skillsText}. Experience: ${expText}. Education: ${eduText}. Summary: ${s.personal_summary || ''}`;
            return { id: s.job_seeker_detail_id, profile_text: profileText };
        });
        const gpythonUrl = process.env.URL_SERVER_PYTHON;
        try {
            const response = await fetch(`${gpythonUrl}/search-talents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, talents }),
            });
            if (!response.ok)
                throw new common_1.InternalServerErrorException('AI API error');
            const result = await response.json();
            const finalResults = result.results.map((r) => {
                const seeker = seekers.find((s) => s.job_seeker_detail_id === r.talent_id);
                return { ...seeker, ai_score: r.score };
            });
            return { status: 'success', data: finalResults };
        }
        catch (e) {
            console.error(e);
            throw new common_1.InternalServerErrorException('Failed to semantic search talents');
        }
    }
    async changeStatusCompany(company_id, status, notes) {
        const companies = await this.prisma.companies.findUnique({
            where: { company_id, status: 'submitted' },
            select: {
                company_id: true,
                email: true,
                status: true,
                company_detail: true,
            },
        });
        if (!companies) {
            throw new common_1.NotFoundException(`University with ID ${company_id} not found`);
        }
        try {
            await this.prisma.companies.update({
                where: { company_id },
                data: { status },
            });
            await this.prisma.approval.upsert({
                where: { company_id },
                update: { notes, company_id },
                create: { notes, company_id },
            });
            await this.sendApprovalEmail(companies.email, status, notes);
            return {
                status: 'success',
                message: 'Company status updated successfully',
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to change status company');
        }
    }
    async sendApprovalEmail(email, status, notes) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const htmlContent = (0, approval_email_template_1.approvalEmailTemplate)(email, status, notes);
        await transporter.sendMail({
            from: '"Digitefa" <no-reply@zenify.my.id>',
            to: email,
            subject: 'Approval Notification Digitefa',
            text: `Approval Notification for ${email}`,
            html: htmlContent,
        });
    }
    async update(company_id, updateCompaniesDto) {
        const errors = await (0, class_validator_1.validate)(updateCompaniesDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingCompany = await this.prisma.companies.findUnique({
            where: { company_id },
        });
        if (!existingCompany) {
            throw new common_1.NotFoundException(`Company with ID ${company_id} not found`);
        }
        try {
            const updatedCompany = await this.prisma.companies.update({
                where: { company_id },
                data: updateCompaniesDto,
            });
            return {
                status: 'success',
                message: 'Company updated successfully',
                data: updatedCompany,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update company');
        }
    }
    async remove(company_id) {
        const existingCompany = await this.prisma.companies.findUnique({
            where: { company_id },
        });
        if (!existingCompany) {
            throw new common_1.NotFoundException(`Company with ID ${company_id} not found`);
        }
        try {
            await this.prisma.companies.delete({
                where: { company_id },
            });
            return {
                status: 'success',
                message: 'User removed successfully',
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to remove company');
        }
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map