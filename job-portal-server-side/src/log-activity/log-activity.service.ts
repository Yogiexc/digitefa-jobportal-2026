import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LogActivityService {
  constructor(private prisma: PrismaService) { }
  async logActivity(user_id: string, user_role: 'superadmin' | 'company' | 'university' | 'job_seeker', activity: string) {
    try {
      await this.prisma.log_activities.create({
        data: {
          user_id,
          user_role,
          activity,
        },
      });
    } catch (error) {
      console.error('Failed to log activity', error);
    }
  }

  async findAll(params: {
    page?: number,
    pageSize?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  }) {
    const { page = 1, pageSize = 10, search, sortBy = 'created_at', sortOrder = 'desc' } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    try {
      const where = {
        ...(search && {
          OR: [
            {
              activity: {
                contains: search,
              },
            },
          ]
        }),
      };

      const data = await this.prisma.log_activities.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take,
      });

      const modifiedData = await this.modifyData.call(this, data);

      // Calculate total data
      const totalData = await this.prisma.log_activities.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);

      return {
        status: "success",
        message: "Log activities retrieved successfully",
        totalData: +totalData,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: modifiedData,
      };
    } catch (error) {
      console.error('Failed to find all log activities', error);
      throw new Error('Failed to find all log activities');
    }
  }

  async modifyData(dataArray) {
    const modifiedData = [];

    for (const data of dataArray) {
      let user;
      if (data.user_role === 'superadmin') {
        user = await this.prisma.admins.findUnique({
          where: {
            admin_id: data.user_id,
          },
        });
      } else if (data.user_role === 'company') {
        user = await this.prisma.companies.findUnique({
          where: {
            company_id: data.user
          },
        });
      } else if (data.user_role === 'university') {
        user = await this.prisma.universities.findUnique({
          where: {
            university_id: data.user_id,
          },
        });
      }
      else if (data.user_role === 'job_seeker') {
        user = await this.prisma.job_seekers.findUnique({
          where: {
            job_seeker_id: data.user_id,
          },
        });
      }

      const deletedSensitiveInfo = Object.fromEntries(
        Object.entries(user).filter(([key]) => !['otp', 'otpExpires', 'password', 'updated_at', 'created_at'].includes(key))
      );

      const removeUserId = Object.fromEntries(
        Object.entries(data).filter(([key]) => !['user_id', 'user_role'].includes(key))
      );

      modifiedData.push({
        ...removeUserId,
        user: deletedSensitiveInfo,
      });
    }

    return modifiedData;
  }
}
