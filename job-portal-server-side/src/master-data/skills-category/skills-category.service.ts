import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSkillsCategoryDto } from './dto/create-skills-category.dto';
import { UpdateSkillsCategoryDto } from './dto/update-skills-category.dto';
import { validate } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SkillsCategoryService {
  constructor(private prisma: PrismaService) { }

  async create(createSkillsCategoryDto: CreateSkillsCategoryDto) {
    const errors = await validate(createSkillsCategoryDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //Check Skill Name
    const existingSkillName = await this.prisma.skills_category.findUnique({
      where:
      {
        category_name: createSkillsCategoryDto.category_name,
        deleted_at: null
      }
    });

    if (existingSkillName) {
      throw new ConflictException('Skills category name is already taken');
    }
    try {
      const newSkillName = await this.prisma.skills_category.create({ data: createSkillsCategoryDto as Prisma.skills_categoryCreateInput });
      return {
        status: "success",
        message: 'Skills Category created successfully',
        data: newSkillName
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to create skills category');
    }
  }

  async findAll(params: {
    page?: number,
    pageSize?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  }) {
    const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    try {
      const where: any = {
        deleted_at: null,
        ...(search && {
          OR: [
            { category_name: { contains: search } },
          ]
        }),
      };
      // Calculate total data
      const totalData = await this.prisma.skills_category.count({ where });

      // Calculate total pages
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
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve skills category');
    }
  }

  async findOne(skill_category_id: string) {
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
      throw new NotFoundException(`Skills Category with ID ${skill_category_id} not found`);
    }
    try {
      return {
        status: "success",
        data: skills_category
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve skills_category');
    }
  }

  async update(skill_category_id: string, updateSkillsCategoryDto: UpdateSkillsCategoryDto) {
    const errors = await validate(updateSkillsCategoryDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingSkillsCategory = await this.prisma.skills_category.findUnique({
      where: { skill_category_id, deleted_at: null }
    });

    if (!existingSkillsCategory) {
      throw new NotFoundException(`Skills Category with ID ${skill_category_id} not found`);
    }

    if (updateSkillsCategoryDto.category_name) {
      const existingName = await this.prisma.skills_category.findUnique({
        where: { category_name: updateSkillsCategoryDto.category_name }
      });

      if (existingName && existingName.skill_category_id !== skill_category_id) {
        throw new ConflictException('Skill Name is already taken');
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

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update skills category');
    }
  }

  async remove(skill_category_id: string) {
    const existingPositionLevel = await this.prisma.skills_category.findUnique({
      where: { skill_category_id, deleted_at: null }
    });

    if (!existingPositionLevel) {
      throw new NotFoundException(`Skills Category with ID ${skill_category_id} not found`);
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

    } catch (error) {
      throw new InternalServerErrorException('Failed to remove skills category');
    }
  }

  async getListSkills(skill_category_id: string) {
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
      throw new NotFoundException(`Skills Category with ID ${skill_category_id} not found`);
    }
    try {
      const responseData = [...new Set(skills.skills.map((item) => item.skill))];
      return {
        status: "success",
        message: 'Skills retrieved successfully',
        data: responseData
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve skills');
    }
  }

  async getListSkillsByCategoryName(category_name: string) {
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
      throw new NotFoundException(`Skills Category with name ${category_name} not found`);
    }
    try {
      const responseData = [...new Set(skills.skills.map((item) => item.skill))];
      return {
        status: "success",
        message: 'Skills retrieved successfully',
        data: responseData
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve skills');
    }
  }
}
