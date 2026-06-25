import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { startOfWeek, addDays } from 'date-fns';

@Injectable()
export class SuperadminService {
  constructor(private prisma: PrismaService) { }

  async getTotalTalents(time: 'week' | 'month' | 'all' = 'all') {
    try {
      const now = new Date();

      let startDate: Date | undefined;

      if (time === 'week') {
        const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startDate = new Date(firstDayOfWeek.setHours(0, 0, 0, 0)); // Set waktu ke awal hari
      } else if (time === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const total = await this.prisma.job_seekers.count({
        where: {
          created_at: {
            gte: startDate,
          },
        },
      });

      return {
        status: 'success',
        message: 'Total talents retrieved successfully',
        data: total,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve total talents');
    }
  }

  async getTotalCompanies(time: 'week' | 'month' | 'all' = 'all') {
    try {
      const now = new Date();

      let startDate: Date | undefined;

      if (time === 'week') {
        const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startDate = new Date(firstDayOfWeek.setHours(0, 0, 0, 0)); // Set waktu ke awal hari
      } else if (time === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const total = await this.prisma.companies.count({
        where: {
          created_at: {
            gte: startDate,
          },
        },
      });

      return {
        status: 'success',
        message: 'Total companies retrieved successfully',
        data: total,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve total companies');
    }
  }

  async getTotalUniversities(time: 'week' | 'month' | 'all' = 'all') {
    try {
      const now = new Date();

      let startDate: Date | undefined;

      if (time === 'week') {
        const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startDate = new Date(firstDayOfWeek.setHours(0, 0, 0, 0)); // Set waktu ke awal hari
      } else if (time === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const total = await this.prisma.universities.count({
        where: {
          created_at: {
            gte: startDate,
          },
        },
      });

      return {
        status: 'success',
        message: 'Total universities retrieved successfully',
        data: total,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve total universities');
    }
  }
  
  async getRecentJobs(limit: number = 5) {
    try {
      const jobs = await this.prisma.jobs.findMany({
        where: {
          status: 'active',
          deleted_at: null,
          expired_at: {
            gte: new Date(),
          },
        },
        take: +limit,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          job_id: true,
          title: true,
          published_at: true,
          company: {
            select: {
              company_detail: {
                select: {
                  market_name: true,
                  legal_name: true,
                }
              }
            }
          }
        }
      });

      const responseData = jobs.map(job => {
        return {
          job_id: job.job_id,
          title: job.title,
          published_at: job.published_at,
          company: job.company.company_detail,
        };
      });

      return {
        status: 'success',
        message: 'Recent jobs retrieved successfully',
        data: responseData,
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve recent jobs');
    }
  }

  async getTalentsOverview(week: number, month: number) {
    try {
      const year = new Date().getFullYear();

      // Calculate the start of the requested week
      const startOfMonth = new Date(year, month - 1, 1);
      const startOfRequestedWeek = startOfWeek(
        addDays(startOfMonth, (week - 1) * 7),
        { weekStartsOn: 1 } // Week starts on Monday
      );

      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const days = [];
      const data = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfRequestedWeek);
        currentDate.setDate(currentDate.getDate() + i);

        // Check if currentDate is within the same month, otherwise skip
        if (currentDate.getMonth() !== month - 1) continue;

        const dayOfWeekIndex = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
        const dayOfWeek = daysOfWeek[dayOfWeekIndex];

        const talentsCount = await this.prisma.job_seekers.count({
          where: {
            created_at: {
              gte: new Date(currentDate.setHours(0, 0, 0, 0)),
              lt: new Date(currentDate.setHours(23, 59, 59, 999)),
            },
          },
        });

        days.push(dayOfWeek);
        data.push(talentsCount);
      }

      return {
        status: 'success',
        message: 'Talents overview retrieved successfully',
        data: {
          label: days,
          talentsData: data,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve talents overview');
    }
  }

  async getCompaniesUniversitiesOverview(month: number) {
    try {
      const year = new Date().getFullYear();
      const endOfMonth = new Date(year, month, 0);
      const data = {
        week: [],
        companies: [],
        universities: []
      }

      let week = 1;
      const startDate = new Date(year, month - 1, 1);
      while (startDate <= endOfMonth) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        if (endDate > endOfMonth) {
          endDate.setDate(endOfMonth.getDate());
        }

        const companies = await this.prisma.companies.count({
          where: {
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const universities = await this.prisma.universities.count({
          where: {
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        data.week.push("Week " + week);
        data.companies.push(companies);
        data.universities.push(universities);

        // Geser ke minggu berikutnya
        startDate.setDate(startDate.getDate() + 7);
        week++;
      }

      return {
        status: 'success',
        message: 'Companies and universities overview retrieved successfully',
        data: {
          weeks: data.week,
          companies: data.companies,
          universities: data.universities,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve companies and universities overview');
    }
  }


}
