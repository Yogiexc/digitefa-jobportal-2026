import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) { }

  async getTotalJobVacancies(user: any) {
    try {
      const total = await this.prisma.jobs.count({
        where: {
          company_id: user.company_id,
          status: 'active',
          deleted_at: null,
          expired_at: {
            gte: new Date(),
          },
        },
      });

      return {
        status: 'success',
        message: 'Total job vacancies retrieved successfully',
        data: total,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve total job vacancies');
    }
  }

  async getJobOverview(user: any, year?: number) {
    try {
      const months = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
      ];

      const data = [];

      for (let month = 0; month < 12; month++) {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0); // Last day of the month

        const totalVacancies = await this.prisma.jobs.count({
          where: {
            company_id: user.company_id,
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const totalApplicants = await this.prisma.applications.count({
          where: {
            job: {
              company_id: user.company_id,
            },
            applied_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const totalAccepted = await this.prisma.applications.count({
          where: {
            applied_at: {
              gte: startDate,
              lte: endDate,
            },
            status: 'accepted',
          },
        });

        data.push({
          label: months[month],
          totalVacancies,
          totalApplicants,
          totalAccepted,
        });
      }

      return {
        status: 'success',
        message: 'Job overview retrieved successfully',
        data
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve job overview');
    }
  }

  async talentsAcceptanceRatio(user: any) {
    try {
      const totalApplicants = await this.prisma.applications.findMany({
        where: {
          job: {
            company_id: user.company_id,
          },
        },
        distinct: ['job_seeker_id'],
      });

      const totalAccepted = await this.prisma.applications.findMany({
        where: {
          job: {
            company_id: user.company_id,
          },
          status: 'accepted',
        },
        distinct: ['job_seeker_id'],
      });

      const totalApplicantsCount = totalApplicants.length;
      const totalAcceptedCount = totalAccepted.length;

      const ratio =
        totalApplicantsCount === 0
          ? 0
          : ((totalAcceptedCount / totalApplicantsCount) * 100).toFixed(0);

      return {
        status: 'success',
        message: 'Talents acceptance ratio retrieved successfully',
        data: {
          total_applicants: totalApplicants.length,
          total_accepted: totalAccepted.length,
          ratio: ratio,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve talents acceptance ratio');
    }
  }

}
