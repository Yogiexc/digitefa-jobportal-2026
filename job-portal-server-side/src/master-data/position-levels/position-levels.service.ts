import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePositionLevelDto } from './dto/create-position-level.dto';
import { UpdatePositionLevelDto } from './dto/update-position-level.dto';
import { validate } from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PositionLevelsService {
  constructor(private prisma: PrismaService) { }
  async create(createPositionLevelDto: CreatePositionLevelDto) {
    const errors = await validate(createPositionLevelDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //Check Position Name
    const existingPositionName = await this.prisma.position_levels.findUnique({
      where:
        { position_name: createPositionLevelDto.position_name } as Prisma.position_levelsWhereUniqueInput
    });

    if (existingPositionName) {
      throw new ConflictException('Position name is already taken');
    }
    try {
      const newPositionName = await this.prisma.position_levels.create({ data: createPositionLevelDto as Prisma.position_levelsCreateInput });
      return {
        status: "success",
        message: 'Position Level created successfully',
        data: newPositionName
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to create position level');
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
          { position_name: { contains: search } },
        ]
      } : {};
      // Calculate total data
      const totalData = await this.prisma.position_levels.count({ where });

      // Calculate total pages
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
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve position levels');
    }
  }

  async findOne(position_level_id: string) {
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
      throw new NotFoundException(`Position Level with ID ${position_level_id} not found`);
    }
    try {
      return {
        status: "success",
        data: position_levels
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve position_levels');
    }
  }

  async update(position_level_id: string, updatePositionLevelsDto: UpdatePositionLevelDto) {
    const errors = await validate(updatePositionLevelsDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingPositionLevel = await this.prisma.position_levels.findUnique({
      where: { position_level_id }
    });

    if (!existingPositionLevel) {
      throw new NotFoundException(`Position Level with ID ${position_level_id} not found`);
    }

    if (updatePositionLevelsDto.position_name) {
      const existingName = await this.prisma.position_levels.findUnique({
        where: { position_name: updatePositionLevelsDto.position_name }
      });

      if (existingName && existingName.position_level_id !== position_level_id) {
        throw new ConflictException('Position Name is already taken');
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

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update position level');
    }
  }

  async remove(position_level_id: string) {
    const existingPositionLevel = await this.prisma.position_levels.findUnique({
      where: { position_level_id }
    });

    if (!existingPositionLevel) {
      throw new NotFoundException(`Position Level with ID ${position_level_id} not found`);
    }
    try {
      await this.prisma.position_levels.delete({
        where: { position_level_id }
      });

      return {
        status: "success",
        message: 'Position Level removed successfully'
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to remove position level');
    }
  }
}
