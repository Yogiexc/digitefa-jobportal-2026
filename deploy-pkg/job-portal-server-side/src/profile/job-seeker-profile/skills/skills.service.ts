import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) { }

  async getSkills(user: any) {
    try {
      const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
        where: { job_seeker_id: user.job_seeker_id },
      });
      const skills = await this.prisma.skills.findMany({
        where: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id },
        select: {
          skill_id: true,
          skill_name: true,
        },
        orderBy: {
          skill_name: 'asc'
        }
      });

      return {
        status: 'success',
        message: 'Job Seeker Skills fetched successfully',
        data: skills
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to fetch job seeker skills');
    }
  }


  async createSkills(user: any, createSkillsDto: any) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker not found');
    }

    const existingSkills = await this.prisma.skills.findMany({
      where: {
        job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id
      }
    });

    const isDuplicate = existingSkills.some(
      (skill) => skill.skill_name.toLowerCase() === createSkillsDto.skill_name.toLowerCase()
    );

    if (isDuplicate) {
      throw new BadRequestException('Skill already exists');
    }

    try {
      const { skill_name } = createSkillsDto;

      //Delete Skills
      // await this.prisma.skills.deleteMany({
      //   where: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
      // });

      // Save SKills
      // const skillsData = skill_name.map(skill => ({
      //   skill_name: skill,
      //   job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id
      // }));

      const newSkill = await this.prisma.skills.create({
        data: {
          skill_name,
          job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id
        }
      });

      return {
        status: 'success',
        message: 'Job Seeker Skills created successfully',
        data: newSkill
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update job seeker skills');
    }
  }

  async deleteSkill(user: any, skill_id: string) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker not found');
    }

    try {
      await this.prisma.skills.delete({
        where: { skill_id }
      });

      return {
        status: 'success',
        message: 'Job Seeker Skill deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to delete job seeker skill');
    }
  }
}
