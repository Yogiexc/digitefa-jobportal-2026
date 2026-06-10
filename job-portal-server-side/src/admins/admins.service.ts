import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admins.dto';
import { UpdateAdminDto } from './dto/update-admins.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { validate } from 'class-validator';
import { LogActivityService } from 'src/log-activity/log-activity.service';

@Injectable()
export class AdminsService {
  constructor(
    private prisma: PrismaService,
    private logActivityService: LogActivityService
  ) { }
  async create(user: any, createAdminDto: CreateAdminDto) {
    const errors = await validate(createAdminDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //Check Email
    const existingEmail = await this.prisma.admins.findUnique({
      where:
        { email: createAdminDto.email } as Prisma.adminsWhereUniqueInput
    });

    if (existingEmail) {
      throw new ConflictException('Email is already taken');
    }
    try {
      const { password, ...userData } = createAdminDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Log activity
      await this.logActivityService.logActivity(user.admin_id, 'superadmin', `Create admin ${userData.full_name}`);

      const newAdmin = await this.prisma.admins.create({ data: { ...userData, password: hashedPassword } as Prisma.adminsCreateInput });
      return {
        status: "success",
        message: 'Admin created successfully',
        data: newAdmin
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to create admin');
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
      const where: Prisma.adminsWhereInput = {
        role: "admin",
        ...(search && {
          OR: [
            { full_name: { contains: search } },
            { email: { contains: search } },
          ]
        })
      };
      // Calculate total data
      const totalData = await this.prisma.admins.count({ where });

      // Calculate total pages
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
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve admins');
    }
  }

  async findOne(admin_id: string) {
    const admins = await this.prisma.admins.findUnique({
      where: { admin_id },
      select: {
        admin_id: true,
        full_name: true,
        email: true,
      }
    });

    if (!admins) {
      throw new NotFoundException(`Admin with ID ${admin_id} not found`);
    }
    try {
      return {
        status: "success",
        data: admins
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve admins');
    }
  }

  async update(user: any, admin_id: string, updateAdminsDto: UpdateAdminDto) {
    const errors = await validate(updateAdminsDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingAdmin = await this.prisma.admins.findUnique({
      where: { admin_id }
    });

    if (!existingAdmin) {
      throw new NotFoundException(`Admin with ID ${admin_id} not found`);
    }

    if (updateAdminsDto.email) {
      const existingEmail = await this.prisma.admins.findUnique({
        where: { email: updateAdminsDto.email }
      });

      if (existingEmail && existingEmail.admin_id !== admin_id) {
        throw new ConflictException('Email is already taken');
      }
    }

    try {
      const updateData = { ...updateAdminsDto };
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const updatedAdmin = await this.prisma.admins.update({
        where: { admin_id },
        data: updateData
      });

      // Log activity
      await this.logActivityService.logActivity(user.admin_id, 'superadmin', `Update admin ${updatedAdmin.full_name}`);

      return {
        status: "success",
        message: 'Admin updated successfully',
        data: updatedAdmin
      };

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update admin');
    }
  }

  async remove(user: any, admin_id: string) {
    const existingAdmin = await this.prisma.admins.findUnique({
      where: { admin_id }
    });

    if (!existingAdmin) {
      throw new NotFoundException(`Admin with ID ${admin_id} not found`);
    }
    try {
      await this.prisma.admins.delete({
        where: { admin_id }
      });

      // Log activity
      await this.logActivityService.logActivity(user.admin_id, 'superadmin', `Remove admin ${existingAdmin.full_name}`);

      return {
        status: "success",
        message: 'Admin removed successfully'
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to remove admin');
    }
  }
}
