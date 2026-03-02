import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { PrismaService } from 'prisma/prisma.service';
import { omit } from 'lodash';

@Injectable()
export class LanguagesService {
  constructor(private prisma: PrismaService) { }

  async getLanguages(user: any) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    try {
      const languages = await this.prisma.languages.findMany({
        where: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id },
        orderBy: { language_name: 'asc' }
      });

      const modifiedLanguages = languages.map(language => omit(language, ['job_seeker_detail_id', 'created_at', 'updated_at']));

      return {
        status: 'success',
        message: 'Job Seeker Languages retrieved successfully',
        data: modifiedLanguages
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get job seeker languages');
    }
  }

  async getLanguage(user: any, language_id: string) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { languages: true }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const language = await this.prisma.languages.findUnique({
      where: { language_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    return {
      status: 'success',
      message: 'Job Seeker Language retrieved successfully',
      data: language
    };
  }

  async addLanguages(user: any, createLanguageDto: CreateLanguageDto) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const checkLanguages = await this.prisma.languages.findFirst({
      where: {
        language_name: createLanguageDto.language_name,
        job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id
      }
    });

    if (checkLanguages) {
      throw new BadRequestException('Language already exists');
    }

    try {
      const language = await this.prisma.languages.create({
        data: {
          ...createLanguageDto,
          job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id
        }
      });

      return {
        status: 'success',
        message: 'Job Seeker Language added successfully',
        data: language
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to add job seeker language');
    }
  }

  async updateLanguages(user: any, language_id: string, updateLanguageDto: UpdateLanguageDto) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { languages: true }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const language = await this.prisma.languages.findUnique({
      where: { language_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    try {
      const updatedLanguage = await this.prisma.languages.update({
        where: { language_id },
        data: updateLanguageDto
      });

      return {
        status: 'success',
        message: 'Job Seeker Language updated successfully',
        data: updatedLanguage
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update job seeker language');
    }
  }

  async deleteLanguages(user: any, language_id: string) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { languages: true }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const language = await this.prisma.languages.findUnique({
      where: { language_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    try {
      await this.prisma.languages.delete({
        where: { language_id }
      });

      return {
        status: 'success',
        message: 'Job Seeker Language deleted successfully'
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete job seeker language');
    }
  }
}
