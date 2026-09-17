import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { omit } from 'lodash';

@Injectable()
export class V3Service {
  constructor(private prisma: PrismaService) { }
  async getJobs(
  ) {
    try {
      const where: any = {
        status: 'active',
        expired_at: { gte: new Date() },
        deleted_at: null,
      }

      const jobs = await this.prisma.jobs.findMany({
        where,
        select: {
          job_id: true,
          title: true,
          description: true,
          published_at: true,
          expired_at: true,
          status: true,
          location: true,
          company: {
            select: {
              company_detail: {
                select: {
                  company_id: true,
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
          description: job.description,
          location: job.location,
          published_at: job.published_at,
          expired_at: job.expired_at,
          status: job.status,
          company: {
            company_id: job.company.company_detail.company_id,
            legal_name: job.company.company_detail.legal_name
          }
        }
      })

      return {
        status: "success",
        message: 'Jobs retrieved successfully',
        data: responseData
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve job vacancies');
    }
  }
  async getUserProfile(
    job_seeker_id: string
  ) {
    const existingJobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id },
      include: {
        job_seeker: true,
        personal_info: true,
        // education: true,
        // skills: true,
        // projects: true,
        experiences: true,
        // certifications: true,
        // languages: true,
      }
    });

    if (!existingJobSeekerDetail) {
      throw new NotFoundException('Job seeker not found');
    }

    try {
      const modifiedExperiences = existingJobSeekerDetail.experiences.map(experience => omit(experience, ['experience_id', 'job_seeker_detail_id', 'created_at', 'updated_at']));

      const modifiedExperiences2 = modifiedExperiences.map(experience => {
        return {
          ...experience,
          employment_type: experience.employment_type ? experience.employment_type
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ') : null,
        }
      });

      const modifiedData = {
        full_name: existingJobSeekerDetail.job_seeker?.full_name,
        email: existingJobSeekerDetail.job_seeker?.email,
        personal_summary: existingJobSeekerDetail.personal_summary,
        experiences: modifiedExperiences2,
      };

      return {
        status: "success",
        message: "Job Seeker profile retrieved successfully",
        data: modifiedData
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to get job seeker profile');
    }
  }
}
