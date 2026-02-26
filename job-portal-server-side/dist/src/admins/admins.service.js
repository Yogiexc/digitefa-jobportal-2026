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
exports.AdminsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const class_validator_1 = require("class-validator");
const log_activity_service_1 = require("../log-activity/log-activity.service");
let AdminsService = class AdminsService {
    constructor(prisma, logActivityService) {
        this.prisma = prisma;
        this.logActivityService = logActivityService;
    }
    async create(user, createAdminDto) {
        const errors = await (0, class_validator_1.validate)(createAdminDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingEmail = await this.prisma.admins.findUnique({
            where: { email: createAdminDto.email }
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email is already taken');
        }
        try {
            const { password, ...userData } = createAdminDto;
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.logActivityService.logActivity(user.admin_id, 'superadmin', `Create admin ${userData.full_name}`);
            const newAdmin = await this.prisma.admins.create({ data: { ...userData, password: hashedPassword } });
            return {
                status: "success",
                message: 'Admin created successfully',
                data: newAdmin
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to create admin');
        }
    }
    async findAll(params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = {
                role: "admin",
                ...(search && {
                    OR: [
                        { full_name: { contains: search } },
                        { email: { contains: search } },
                    ]
                })
            };
            const totalData = await this.prisma.admins.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            const admins = await this.prisma.admins.findMany({
                where,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder
                },
                select: {
                    admin_id: true,
                    full_name: true,
                    email: true,
                    created_at: true,
                }
            });
            return {
                status: "success",
                message: "Admins retrieved successfully",
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: admins
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve admins');
        }
    }
    async findOne(admin_id) {
        const admins = await this.prisma.admins.findUnique({
            where: { admin_id },
            select: {
                admin_id: true,
                full_name: true,
                email: true,
            }
        });
        if (!admins) {
            throw new common_1.NotFoundException(`Admin with ID ${admin_id} not found`);
        }
        try {
            return {
                status: "success",
                data: admins
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve admins');
        }
    }
    async update(user, admin_id, updateAdminsDto) {
        const errors = await (0, class_validator_1.validate)(updateAdminsDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingAdmin = await this.prisma.admins.findUnique({
            where: { admin_id }
        });
        if (!existingAdmin) {
            throw new common_1.NotFoundException(`Admin with ID ${admin_id} not found`);
        }
        if (updateAdminsDto.email) {
            const existingEmail = await this.prisma.admins.findUnique({
                where: { email: updateAdminsDto.email }
            });
            if (existingEmail && existingEmail.admin_id !== admin_id) {
                throw new common_1.ConflictException('Email is already taken');
            }
        }
        try {
            const updatedAdmin = await this.prisma.admins.update({
                where: { admin_id },
                data: updateAdminsDto
            });
            await this.logActivityService.logActivity(user.admin_id, 'superadmin', `Update admin ${updatedAdmin.full_name}`);
            return {
                status: "success",
                message: 'Admin updated successfully',
                data: updatedAdmin
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to update admin');
        }
    }
    async remove(user, admin_id) {
        const existingAdmin = await this.prisma.admins.findUnique({
            where: { admin_id }
        });
        if (!existingAdmin) {
            throw new common_1.NotFoundException(`Admin with ID ${admin_id} not found`);
        }
        try {
            await this.prisma.admins.delete({
                where: { admin_id }
            });
            await this.logActivityService.logActivity(user.admin_id, 'superadmin', `Remove admin ${existingAdmin.full_name}`);
            return {
                status: "success",
                message: 'Admin removed successfully'
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to remove admin');
        }
    }
};
exports.AdminsService = AdminsService;
exports.AdminsService = AdminsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        log_activity_service_1.LogActivityService])
], AdminsService);
//# sourceMappingURL=admins.service.js.map