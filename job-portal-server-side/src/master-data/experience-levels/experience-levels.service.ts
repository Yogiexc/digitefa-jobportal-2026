import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateExperienceLevelDto } from './dto/create-experience-level.dto';
import { UpdateExperienceLevelDto } from './dto/update-experience-level.dto';
import { validate } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExperienceLevelsService {
  constructor(private prisma: PrismaService) { }
  async create(createExperienceLevelDto: CreateExperienceLevelDto) {
    const errors = await validate(createExperienceLevelDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //Check Experience Name
    const existingExperienceName = await this.prisma.experience_levels.findUnique({
      where:
        { name: createExperienceLevelDto.name }
    });

    if (existingExperienceName) {
      throw new ConflictException('Experience name is already taken');
    }
    try {
      const newExperienceName = await this.prisma.experience_levels.create({ data: createExperienceLevelDto as Prisma.experience_levelsCreateInput });
      return {
        status: "success",
        message: 'Experience Level created successfully',
        data: newExperienceName
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to create experience level');
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
      const where = search ? {
        OR: [
          { name: { contains: search } },
        ]
      } : {};
      // Calculate total data
      const totalData = await this.prisma.experience_levels.count({ where });

      // Calculate total pages
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
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve experience levels');
    }
  }

  async findOne(experience_level_id: string) {
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
      throw new NotFoundException(`Experience Level with ID ${experience_level_id} not found`);
    }
    try {
      return {
        status: "success",
        data: experience_levels
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve experience_levels');
    }
  }

  async update(experience_level_id: string, updateExperienceLevelsDto: UpdateExperienceLevelDto) {
    const errors = await validate(updateExperienceLevelsDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingExperienceLevel = await this.prisma.experience_levels.findUnique({
      where: { experience_level_id }
    });

    if (!existingExperienceLevel) {
      throw new NotFoundException(`Experience Level with ID ${experience_level_id} not found`);
    }

    if (updateExperienceLevelsDto.name) {
      const existingName = await this.prisma.experience_levels.findUnique({
        where: { name: updateExperienceLevelsDto.name }
      });

      if (existingName && existingName.experience_level_id !== experience_level_id) {
        throw new ConflictException('Experience Name is already taken');
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

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update experience level');
    }
  }

  async remove(experience_level_id: string) {
    const existingExperienceLevel = await this.prisma.experience_levels.findUnique({
      where: { experience_level_id }
    });

    if (!existingExperienceLevel) {
      throw new NotFoundException(`Experience Level with ID ${experience_level_id} not found`);
    }
    try {
      await this.prisma.experience_levels.delete({
        where: { experience_level_id }
      });

      return {
        status: "success",
        message: 'Experience Level removed successfully'
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to remove experience level');
    }
  }
}
