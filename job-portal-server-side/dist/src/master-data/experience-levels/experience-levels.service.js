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
exports.ExperienceLevelsService = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../../../prisma/prisma.service");
let ExperienceLevelsService = class ExperienceLevelsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createExperienceLevelDto) {
        const errors = await (0, class_validator_1.validate)(createExperienceLevelDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingExperienceName = await this.prisma.experience_levels.findUnique({
            where: { name: createExperienceLevelDto.name }
        });
        if (existingExperienceName) {
            throw new common_1.ConflictException('Experience name is already taken');
        }
        try {
            const newExperienceName = await this.prisma.experience_levels.create({ data: createExperienceLevelDto });
            return {
                status: "success",
                message: 'Experience Level created successfully',
                data: newExperienceName
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to create experience level');
        }
    }
    async findAll(params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = search ? {
                OR: [
                    { name: { contains: search } },
                ]
            } : {};
            const totalData = await this.prisma.experience_levels.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            const experience_levels = await this.prisma.experience_levels.findMany({
                where,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder
                },
                select: {
                    experience_level_id: true,
                    name: true,
                    created_at: true,
                    updated_at: true
                }
            });
            return {
                status: "success",
                message: 'Experience Levels retrieved successfully',
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: experience_levels
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve experience levels');
        }
    }
    async findOne(experience_level_id) {
        const experience_levels = await this.prisma.experience_levels.findUnique({
            where: { experience_level_id },
            select: {
                experience_level_id: true,
                name: true,
                created_at: true,
                updated_at: true
            }
        });
        if (!experience_levels) {
            throw new common_1.NotFoundException(`Experience Level with ID ${experience_level_id} not found`);
        }
        try {
            return {
                status: "success",
                data: experience_levels
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve experience_levels');
        }
    }
    async update(experience_level_id, updateExperienceLevelsDto) {
        const errors = await (0, class_validator_1.validate)(updateExperienceLevelsDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingExperienceLevel = await this.prisma.experience_levels.findUnique({
            where: { experience_level_id }
        });
        if (!existingExperienceLevel) {
            throw new common_1.NotFoundException(`Experience Level with ID ${experience_level_id} not found`);
        }
        if (updateExperienceLevelsDto.name) {
            const existingName = await this.prisma.experience_levels.findUnique({
                where: { name: updateExperienceLevelsDto.name }
            });
            if (existingName && existingName.experience_level_id !== experience_level_id) {
                throw new common_1.ConflictException('Experience Name is already taken');
            }
        }
        try {
            const updatedExperienceLevel = await this.prisma.experience_levels.update({
                where: { experience_level_id },
                data: updateExperienceLevelsDto
            });
            return {
                status: "success",
                message: 'Experience Level updated successfully',
                data: updatedExperienceLevel
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to update experience level');
        }
    }
    async remove(experience_level_id) {
        const existingExperienceLevel = await this.prisma.experience_levels.findUnique({
            where: { experience_level_id }
        });
        if (!existingExperienceLevel) {
            throw new common_1.NotFoundException(`Experience Level with ID ${experience_level_id} not found`);
        }
        try {
            await this.prisma.experience_levels.delete({
                where: { experience_level_id }
            });
            return {
                status: "success",
                message: 'Experience Level removed successfully'
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to remove experience level');
        }
    }
};
exports.ExperienceLevelsService = ExperienceLevelsService;
exports.ExperienceLevelsService = ExperienceLevelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExperienceLevelsService);
//# sourceMappingURL=experience-levels.service.js.map