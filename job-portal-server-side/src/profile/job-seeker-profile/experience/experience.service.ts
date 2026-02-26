import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) { }

  async getExperiences(user: any) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { experiences: true }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    try {
      const experience = jobSeekerDetail.experiences.map(exp => ({
        experience_id: exp.experience_id,
        experience_title: exp.experience_title,
        employment_type: exp.employment_type,
        company_name: exp.company_name,
        location: exp.location,
        location_type: exp.location_type,
        description: exp.description,
        start_date: exp.start_date,
        end_date: exp.end_date,
      }));

      return {
        status: 'success',
        message: 'Job Seeker Experience retrieved successfully',
        data: experience
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get job seeker experience');
    }
  }

  async getExperience(user: any, experience_id: string) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { experiences: true }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const experience = await this.prisma.experiences.findUnique({
      where: { experience_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    return {
      status: 'success',
      message: 'Job Seeker Experience retrieved successfully',
      data: experience
    };
  }

  async addExperience(user: any, createExperienceDto: CreateExperienceDto) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const { experience_title, employment_type, company_name, location, location_type, description } = createExperienceDto;

    try {
      const experience = await this.prisma.experiences.create({
        data: {
          experience_title,
          employment_type,
          company_name,
          location,
          location_type,
          description,
          start_date: createExperienceDto.start_date ? new Date(createExperienceDto.start_date) : null,
          end_date: createExperienceDto.end_date ? new Date(createExperienceDto.end_date) : null,
          job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id
        }
      });

      return {
        status: 'success',
        message: 'Job Seeker Experience added successfully',
        data: experience
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to add job seeker experience');
    }
  }

  async updateExperience(user: any, experience_id: string, updateExperienceDto: UpdateExperienceDto) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { experiences: true }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const experience = await this.prisma.experiences.findUnique({
      where: { experience_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    const { experience_title, employment_type, company_name, location, location_type, description } = updateExperienceDto;

    try {
      await this.prisma.experiences.update({
        where: { experience_id },
        data: {
          experience_title,
          employment_type,
          company_name,
          location,
          location_type,
          description,
          start_date: updateExperienceDto.start_date ? new Date(updateExperienceDto.start_date) : null,
          end_date: updateExperienceDto.end_date ? new Date(updateExperienceDto.end_date) : null,
        }
      });

      return {
        status: 'success',
        message: 'Job Seeker Experience updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update job seeker experience');
    }
  }

  async deleteExperience(user: any, experience_id: string) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { experiences: true }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const experience = await this.prisma.experiences.findUnique({
      where: { experience_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
    });

    if (!experience) {
      throw new NotFoundException('Experience not found');
    }

    try {
      await this.prisma.experiences.delete({
        where: { experience_id }
      });

      return {
        status: 'success',
        message: 'Job Seeker Experience deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete job seeker experience');
    }
  }
}
