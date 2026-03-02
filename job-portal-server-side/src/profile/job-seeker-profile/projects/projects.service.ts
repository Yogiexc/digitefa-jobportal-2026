import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) { }

  async getProjects(user: any) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { projects: true }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    try {
      const projects = jobSeekerDetail.projects.map(project => ({
        project_id: project.project_id,
        project_name: project.project_name,
        description: project.description,
        start_date: project.start_date,
        end_date: project.end_date,
      }));

      return {
        status: 'success',
        message: 'Job Seeker Projects retrieved successfully',
        data: projects
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get job seeker projects');
    }
  }

  async getProject(user: any, project_id: string) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { projects: true }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const project = await this.prisma.projects.findUnique({
      where: { project_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return {
      status: 'success',
      message: 'Job Seeker Project retrieved successfully',
      data: project
    };
  }

  async addProjects(user: any, addProjectsDto: CreateProjectDto) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    try {
      const { project_name, description, start_date, end_date } = addProjectsDto;

      await this.prisma.projects.create({
        data: {
          project_name,
          description,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          job_seeker_details: {
            connect: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
          }
        }
      });

      return {
        status: 'success',
        message: 'Job Seeker Projects added successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to add job seeker projects');
    }
  }

  async updateProjects(user: any, project_id: string, updateProjectsDto: CreateProjectDto) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const project = await this.prisma.projects.findUnique({
      where: { project_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    try {
      const { project_name, description, start_date, end_date } = updateProjectsDto;

      await this.prisma.projects.update({
        where: { project_id },
        data: {
          project_name,
          description,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
        }
      });

      return {
        status: 'success',
        message: 'Job Seeker Projects updated successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update job seeker projects');
    }
  }

  async deleteProjects(user: any, project_id: string) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const project = await this.prisma.projects.findUnique({
      where: { project_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    try {
      await this.prisma.projects.delete({
        where: { project_id }
      });

      return {
        status: 'success',
        message: 'Job Seeker Projects deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to delete job seeker projects');
    }
  }
}
