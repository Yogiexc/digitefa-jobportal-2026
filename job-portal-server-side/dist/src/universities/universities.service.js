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
exports.UniversitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const class_validator_1 = require("class-validator");
const approval_email_template_1 = require("./email-templates/approval-email-template");
const nodemailer = require("nodemailer");
let UniversitiesService = class UniversitiesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUniversityDto) {
        const errors = await (0, class_validator_1.validate)(createUniversityDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingEmail = await this.prisma.universities.findUnique({
            where: { email: createUniversityDto.email }
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email is already taken');
        }
        try {
            const { password, ...userData } = createUniversityDto;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUniversity = await this.prisma.universities.create({ data: { ...userData, password: hashedPassword } });
            return {
                status: "success",
                message: 'University created successfully',
                data: newUniversity
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to create university');
        }
    }
    async findAllUniversityManagement(params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = {
                status: {
                    in: ['submitted', 'accepted', 'rejected']
                },
                ...(search && {
                    OR: [
                        {
                            university_detail: {
                                university_name: { contains: search }
                            }
                        },
                        { email: { contains: search } },
                    ]
                })
            };
            const totalData = await this.prisma.universities.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            const universities = await this.prisma.universities.findMany({
                where,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder
                },
                select: {
                    university_id: true,
                    email: true,
                    status: true,
                    created_at: true,
                    university_detail: {
                        select: {
                            university_name: true,
                        }
                    }
                }
            });
            const modifiedUniversities = universities.map(university => {
                let newStatus;
                switch (university.status) {
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
                        newStatus = university.status;
                }
                return {
                    university_id: university.university_id,
                    email: university.email,
                    status: newStatus,
                    created_at: university.created_at,
                    university_name: university.university_detail.university_name
                };
            });
            return {
                status: "success",
                message: 'University retrieved successfully',
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: modifiedUniversities
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve universities');
        }
    }
    async findAll(params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = search ? {
                OR: [
                    { university_detail: { university_name: { contains: search } } },
                    { email: { contains: search } },
                ]
            } : {};
            const totalData = await this.prisma.universities.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            const universities = await this.prisma.universities.findMany({
                where,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder
                },
                select: {
                    university_id: true,
                    full_name: true,
                    email: true,
                    status: true,
                    created_at: true,
                    university_detail: {
                        select: {
                            university_name: true,
                        }
                    }
                }
            });
            const modifiedUniversities = universities.map(university => {
                return {
                    university_id: university.university_id,
                    full_name: university.full_name,
                    email: university.email,
                    status: university.status,
                    created_at: university.created_at,
                    university_name: university.university_detail.university_name
                };
            });
            return {
                status: "success",
                message: 'University retrieved successfully',
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: modifiedUniversities
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve universities');
        }
    }
    async findAllList() {
        try {
            const universities = await this.prisma.universities.findMany({
                select: {
                    university_detail: {
                        select: {
                            university_name: true,
                        }
                    }
                },
                orderBy: {
                    university_detail: {
                        university_name: 'asc'
                    }
                }
            });
            const modifiedUniversities = universities.map(university => {
                return {
                    university_name: university.university_detail.university_name
                };
            });
            return {
                status: "success",
                message: 'University retrieved successfully',
                data: modifiedUniversities
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve universities');
        }
    }
    async findOne(university_id) {
        const universities = await this.prisma.universities.findUnique({
            where: { university_id },
            select: {
                university_id: true,
                full_name: true,
                email: true,
                status: true,
                university_detail: true,
            }
        });
        if (!universities) {
            throw new common_1.NotFoundException(`University with ID ${university_id} not found`);
        }
        try {
            return {
                status: "success",
                data: universities
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve universities');
        }
    }
    async changeStatusUniversity(university_id, status, notes) {
        const universities = await this.prisma.universities.findUnique({
            where: { university_id, status: 'submitted' },
            select: {
                university_id: true,
                full_name: true,
                email: true,
                status: true,
                university_detail: true,
            }
        });
        if (!universities) {
            throw new common_1.NotFoundException(`University with ID ${university_id} not found`);
        }
        try {
            await this.prisma.universities.update({
                where: { university_id },
                data: { status }
            });
            await this.prisma.approval.upsert({
                where: { university_id },
                update: { notes, university_id },
                create: { notes, university_id }
            });
            await this.sendApprovalEmail(universities.email, status, notes);
            return {
                status: "success",
                message: 'University status updated successfully',
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to change status university');
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
                rejectUnauthorized: false
            }
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
    async update(university_id, updateCompaniesDto) {
        const errors = await (0, class_validator_1.validate)(updateCompaniesDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingUniversity = await this.prisma.universities.findUnique({
            where: { university_id }
        });
        if (!existingUniversity) {
            throw new common_1.NotFoundException(`University with ID ${university_id} not found`);
        }
        try {
            const updatedUniversity = await this.prisma.universities.update({
                where: { university_id },
                data: updateCompaniesDto
            });
            return {
                status: "success",
                message: 'University updated successfully',
                data: updatedUniversity
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update university');
        }
    }
    async remove(university_id) {
        const existingUniversity = await this.prisma.universities.findUnique({
            where: { university_id }
        });
        if (!existingUniversity) {
            throw new common_1.NotFoundException(`University with ID ${university_id} not found`);
        }
        try {
            await this.prisma.universities.delete({
                where: { university_id }
            });
            return {
                status: "success",
                message: 'User removed successfully'
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to remove university');
        }
    }
};
exports.UniversitiesService = UniversitiesService;
exports.UniversitiesService = UniversitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UniversitiesService);
//# sourceMappingURL=universities.service.js.map