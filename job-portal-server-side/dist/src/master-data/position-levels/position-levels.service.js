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
exports.PositionLevelsService = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../../../prisma/prisma.service");
let PositionLevelsService = class PositionLevelsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPositionLevelDto) {
        const errors = await (0, class_validator_1.validate)(createPositionLevelDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingPositionName = await this.prisma.position_levels.findUnique({
            where: { position_name: createPositionLevelDto.position_name }
        });
        if (existingPositionName) {
            throw new common_1.ConflictException('Position name is already taken');
        }
        try {
            const newPositionName = await this.prisma.position_levels.create({ data: createPositionLevelDto });
            return {
                status: "success",
                message: 'Position Level created successfully',
                data: newPositionName
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to create position level');
        }
    }
    async findAll(params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = search ? {
                OR: [
                    { position_name: { contains: search } },
                ]
            } : {};
            const totalData = await this.prisma.position_levels.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            const position_levels = await this.prisma.position_levels.findMany({
                where,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder
                },
                select: {
                    position_level_id: true,
                    position_name: true,
                    created_at: true,
                    updated_at: true
                }
            });
            return {
                status: "success",
                message: 'Position Levels retrieved successfully',
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: position_levels
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve position levels');
        }
    }
    async findOne(position_level_id) {
        const position_levels = await this.prisma.position_levels.findUnique({
            where: { position_level_id },
            select: {
                position_level_id: true,
                position_name: true,
                created_at: true,
                updated_at: true
            }
        });
        if (!position_levels) {
            throw new common_1.NotFoundException(`Position Level with ID ${position_level_id} not found`);
        }
        try {
            return {
                status: "success",
                data: position_levels
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve position_levels');
        }
    }
    async update(position_level_id, updatePositionLevelsDto) {
        const errors = await (0, class_validator_1.validate)(updatePositionLevelsDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingPositionLevel = await this.prisma.position_levels.findUnique({
            where: { position_level_id }
        });
        if (!existingPositionLevel) {
            throw new common_1.NotFoundException(`Position Level with ID ${position_level_id} not found`);
        }
        if (updatePositionLevelsDto.position_name) {
            const existingName = await this.prisma.position_levels.findUnique({
                where: { position_name: updatePositionLevelsDto.position_name }
            });
            if (existingName && existingName.position_level_id !== position_level_id) {
                throw new common_1.ConflictException('Position Name is already taken');
            }
        }
        try {
            const updatedPositionLevel = await this.prisma.position_levels.update({
                where: { position_level_id },
                data: updatePositionLevelsDto
            });
            return {
                status: "success",
                message: 'Position Level updated successfully',
                data: updatedPositionLevel
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to update position level');
        }
    }
    async remove(position_level_id) {
        const existingPositionLevel = await this.prisma.position_levels.findUnique({
            where: { position_level_id }
        });
        if (!existingPositionLevel) {
            throw new common_1.NotFoundException(`Position Level with ID ${position_level_id} not found`);
        }
        try {
            await this.prisma.position_levels.delete({
                where: { position_level_id }
            });
            return {
                status: "success",
                message: 'Position Level removed successfully'
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to remove position level');
        }
    }
};
exports.PositionLevelsService = PositionLevelsService;
exports.PositionLevelsService = PositionLevelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PositionLevelsService);
//# sourceMappingURL=position-levels.service.js.map