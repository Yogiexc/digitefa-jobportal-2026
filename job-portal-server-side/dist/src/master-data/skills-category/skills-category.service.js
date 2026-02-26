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
exports.SkillsCategoryService = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../../../prisma/prisma.service");
let SkillsCategoryService = class SkillsCategoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createSkillsCategoryDto) {
        const errors = await (0, class_validator_1.validate)(createSkillsCategoryDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingSkillName = await this.prisma.skills_category.findUnique({
            where: {
                category_name: createSkillsCategoryDto.category_name,
                deleted_at: null
            }
        });
        if (existingSkillName) {
            throw new common_1.ConflictException('Skills category name is already taken');
        }
        try {
            const newSkillName = await this.prisma.skills_category.create({ data: createSkillsCategoryDto });
            return {
                status: "success",
                message: 'Skills Category created successfully',
                data: newSkillName
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to create skills category');
        }
    }
    async findAll(params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = {
                deleted_at: null,
                ...(search && {
                    OR: [
                        { category_name: { contains: search } },
                    ]
                }),
            };
            const totalData = await this.prisma.skills_category.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            const skills_category = await this.prisma.skills_category.findMany({
                where,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder
                },
                select: {
                    skill_category_id: true,
                    category_name: true,
                    created_at: true,
                    updated_at: true
                }
            });
            return {
                status: "success",
                message: "Skills Category retrieved successfully",
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: skills_category
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve skills category');
        }
    }
    async findOne(skill_category_id) {
        const skills_category = await this.prisma.skills_category.findUnique({
            where: {
                skill_category_id,
                deleted_at: null
            },
            select: {
                skill_category_id: true,
                category_name: true,
                created_at: true,
                updated_at: true
            }
        });
        if (!skills_category) {
            throw new common_1.NotFoundException(`Skills Category with ID ${skill_category_id} not found`);
        }
        try {
            return {
                status: "success",
                data: skills_category
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve skills_category');
        }
    }
    async update(skill_category_id, updateSkillsCategoryDto) {
        const errors = await (0, class_validator_1.validate)(updateSkillsCategoryDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingSkillsCategory = await this.prisma.skills_category.findUnique({
            where: { skill_category_id, deleted_at: null }
        });
        if (!existingSkillsCategory) {
            throw new common_1.NotFoundException(`Skills Category with ID ${skill_category_id} not found`);
        }
        if (updateSkillsCategoryDto.category_name) {
            const existingName = await this.prisma.skills_category.findUnique({
                where: { category_name: updateSkillsCategoryDto.category_name }
            });
            if (existingName && existingName.skill_category_id !== skill_category_id) {
                throw new common_1.ConflictException('Skill Name is already taken');
            }
        }
        try {
            const updatedSkillsCategory = await this.prisma.skills_category.update({
                where: { skill_category_id, deleted_at: null },
                data: updateSkillsCategoryDto
            });
            return {
                status: "success",
                message: 'Skills Category updated successfully',
                data: updatedSkillsCategory
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to update skills category');
        }
    }
    async remove(skill_category_id) {
        const existingPositionLevel = await this.prisma.skills_category.findUnique({
            where: { skill_category_id, deleted_at: null }
        });
        if (!existingPositionLevel) {
            throw new common_1.NotFoundException(`Skills Category with ID ${skill_category_id} not found`);
        }
        try {
            await this.prisma.skills_category.update({
                where: { skill_category_id },
                data: {
                    deleted_at: new Date()
                }
            });
            return {
                status: "success",
                message: 'Skills Category removed successfully'
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to remove skills category');
        }
    }
    async getListSkills(skill_category_id) {
        const skills = await this.prisma.skills_category.findUnique({
            where: {
                skill_category_id,
                deleted_at: null
            },
            select: {
                skills: {
                    select: {
                        skill: true
                    }
                }
            }
        });
        if (!skills) {
            throw new common_1.NotFoundException(`Skills Category with ID ${skill_category_id} not found`);
        }
        try {
            const responseData = [...new Set(skills.skills.map((item) => item.skill))];
            return {
                status: "success",
                message: 'Skills retrieved successfully',
                data: responseData
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve skills');
        }
    }
    async getListSkillsByCategoryName(category_name) {
        const skills = await this.prisma.skills_category.findUnique({
            where: {
                category_name
            },
            select: {
                skills: {
                    select: {
                        skill: true
                    }
                }
            }
        });
        if (!skills) {
            throw new common_1.NotFoundException(`Skills Category with name ${category_name} not found`);
        }
        try {
            const responseData = [...new Set(skills.skills.map((item) => item.skill))];
            return {
                status: "success",
                message: 'Skills retrieved successfully',
                data: responseData
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve skills');
        }
    }
};
exports.SkillsCategoryService = SkillsCategoryService;
exports.SkillsCategoryService = SkillsCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SkillsCategoryService);
//# sourceMappingURL=skills-category.service.js.map