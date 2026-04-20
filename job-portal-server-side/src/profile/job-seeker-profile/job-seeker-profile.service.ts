import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { validate } from 'class-validator';
import * as fs from 'fs';
import { join } from 'path';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { UpdatePersonalSummaryDto } from './dto/update-personal-summary.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class JobSeekerProfileService {
  constructor(private prisma: PrismaService) { }

  async getPersonalInfo(user: any) {
    const existingJobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { job_seeker: true, personal_info: true }
    });

    if (!existingJobSeekerDetail.personal_info) {

    }

    const modifiedData = {
      full_name: existingJobSeekerDetail.job_seeker?.full_name,
      email: existingJobSeekerDetail.job_seeker?.email,
      address: existingJobSeekerDetail.personal_info ? existingJobSeekerDetail.personal_info.address : null,
      phone_number: existingJobSeekerDetail.personal_info ? existingJobSeekerDetail.personal_info.phone_number : null,
      date_of_birth: existingJobSeekerDetail.personal_info ? existingJobSeekerDetail.personal_info.date_of_birth : null,
      profile_picture_url: existingJobSeekerDetail.profile_picture_url,
    };

    return {
      status: "success",
      data: modifiedData
    };
  }

  async updateProfilePicture(user: any, profile_picture: Express.Multer.File) {
    // Validate uploaded file
    if (!profile_picture) {
      throw new BadRequestException('Profile picture is required');
    }

    const existingJobSeeker = await this.prisma.job_seekers.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { job_seeker_detail: true, }
    });

    // Save current profile picture URL
    const currentProfilePictureUrl = existingJobSeeker.job_seeker_detail?.profile_picture_url;

    try {
      await this.prisma.job_seekers.update({
        where: { job_seeker_id: user.job_seeker_id },
        data: {
          job_seeker_detail: {
            update: { profile_picture_url: profile_picture?.path },
          }
        },
      });

      // Delete old profile picture file if new file uploaded and old profile picture exists
      if (profile_picture && currentProfilePictureUrl) {
        const oldFilePath = join(currentProfilePictureUrl);
        if (fs.existsSync(oldFilePath)) {
          try {
            await fs.promises.unlink(oldFilePath);
          } catch (error) {
            // Handle error if failed to delete file
            console.error('Failed to delete old profile picture file:', error);
          }
        } else {
          console.warn('Old profile picture file not found at:', oldFilePath);
        }
      }

      return {
        status: 'success',
        message: 'Job Seeker profile picture updated successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update job seeker profile picture');
    }
  }

  async updatePersonalInfo(user: any, updatePersonalInfoDto: UpdatePersonalInfoDto) {
    const errors = await validate(updatePersonalInfoDto);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    try {
      const { full_name, address, phone_number, date_of_birth } = updatePersonalInfoDto;

      // Konversi string date_of_birth menjadi Date
      let dateOfBirthDate: Date | undefined;
      if (date_of_birth) {
        dateOfBirthDate = new Date(date_of_birth);
        dateOfBirthDate.setUTCHours(0, 0, 0, 0);
      }

      await this.prisma.job_seekers.update({
        where: { job_seeker_id: user.job_seeker_id },
        data: {
          full_name
        }
      });

      await this.prisma.job_seeker_details.update({
        where: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id },
        data: {
          personal_info: {
            upsert: {
              update: { address, phone_number, date_of_birth: dateOfBirthDate },
              create: { address, phone_number, date_of_birth: dateOfBirthDate },
            },
          }
        },
      });

      return {
        status: 'success',
        message: 'Job Seeker Profile updated successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update job seeker profile');
    }
  }

  async getPersonalSummary(user: any) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { job_seeker: true }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    return {
      status: 'success',
      message: 'Job Seeker Personal Summary retrieved successfully',
      data: jobSeekerDetail.personal_summary
    };
  }

  async updatePersonalSummary(user: any, updatePersonalSummaryDto: UpdatePersonalSummaryDto) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    try {
      const { personal_summary } = updatePersonalSummaryDto;
      await this.prisma.job_seeker_details.update({
        where: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id },
        data: {
          personal_summary
        }
      });

      return {
        status: 'success',
        message: 'Job Seeker Personal Summary updated successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update job seeker personal summary');
    }
  }

  async getEducation(user: any) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { education: { orderBy: { start_date: 'desc' } } }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    return {
      status: 'success',
      message: 'Job Seeker Education retrieved successfully',
      data: jobSeekerDetail.education
    };
  }

  async createEducation(user: any, updateEducationDto: UpdateEducationDto) {
    const errors = await validate(updateEducationDto);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { education: true }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    // Duplicate Prevention (Case-insensitive check for Univ + Degree + Major)
    const existingEdu = jobSeekerDetail.education.find(edu => 
      edu.university_name.toLowerCase() === updateEducationDto.university_name.toLowerCase() &&
      edu.degree.toLowerCase() === updateEducationDto.degree.toLowerCase() &&
      edu.major.toLowerCase() === updateEducationDto.major.toLowerCase()
    );

    if (existingEdu) {
      throw new BadRequestException('Education entry already exists');
    }

    try {
      const getUniversity = await this.prisma.university_details.findFirst({
        where: { university_name: updateEducationDto.university_name }
      });

      const newEducation = await this.prisma.education.create({
        data: {
          university_name: updateEducationDto.university_name,
          degree: updateEducationDto.degree,
          major: updateEducationDto.major,
          start_date: new Date(updateEducationDto.start_date),
          end_date: new Date(updateEducationDto.end_date),
          grade: updateEducationDto.grade,
          job_seeker_details: {
            connect: {
              job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id,
            }
          },
          ...(getUniversity && {
            university: {
              connect: {
                university_id: getUniversity.university_id
              }
            }
          })
        }
      });

      return {
        status: 'success',
        message: 'Job Seeker Education created successfully',
        data: newEducation
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to create job seeker education');
    }
  }

  async updateEducation(user: any, education_id: string, updateEducationDto: UpdateEducationDto) {
    const errors = await validate(updateEducationDto);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const educationEntry = await this.prisma.education.findUnique({
      where: { education_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
    });

    if (!educationEntry) {
      throw new NotFoundException('Education entry not found');
    }

    try {
      const getUniversity = await this.prisma.university_details.findFirst({
        where: { university_name: updateEducationDto.university_name }
      });

      const updatedEducation = await this.prisma.education.update({
        where: { education_id },
        data: {
          university_name: updateEducationDto.university_name,
          degree: updateEducationDto.degree,
          major: updateEducationDto.major,
          start_date: new Date(updateEducationDto.start_date),
          end_date: new Date(updateEducationDto.end_date),
          grade: updateEducationDto.grade,
          university: getUniversity ? {
            connect: {
              university_id: getUniversity.university_id
            }
          } : {
            disconnect: true
          }
        },
      });

      return {
        status: 'success',
        message: 'Job Seeker Education updated successfully',
        data: updatedEducation
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update job seeker education');
    }
  }

  async deleteEducation(user: any, education_id: string) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const educationEntry = await this.prisma.education.findUnique({
      where: { education_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
    });

    if (!educationEntry) {
      throw new NotFoundException('Education entry not found');
    }

    try {
      await this.prisma.education.delete({
        where: { education_id }
      });

      return {
        status: 'success',
        message: 'Education deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to delete job seeker education');
    }
  }

  async deleteProfilePicture(user: any) {
    const existingJobSeeker = await this.prisma.job_seekers.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { job_seeker_detail: true },
    });

    if (!existingJobSeeker || !existingJobSeeker.job_seeker_detail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const currentProfilePictureUrl = existingJobSeeker.job_seeker_detail.profile_picture_url;

    try {
      await this.prisma.job_seeker_details.update({
        where: { job_seeker_detail_id: existingJobSeeker.job_seeker_detail.job_seeker_detail_id },
        data: {
          profile_picture_url: null,
        },
      });

      if (currentProfilePictureUrl) {
        const filePath = join(currentProfilePictureUrl);
        if (fs.existsSync(filePath)) {
          try {
            await fs.promises.unlink(filePath);
          } catch (error) {
            console.error('Failed to delete profile picture file:', error);
          }
        }
      }

      return {
        status: 'success',
        message: 'Job Seeker profile picture deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to delete job seeker profile picture');
    }
  }
}