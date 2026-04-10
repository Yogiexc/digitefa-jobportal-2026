import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateUniversityProfileDto } from './dto/update-university-profile.dto';
import { validate } from 'class-validator';
import { PrismaService } from '../../../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class UniversityProfileService {
  constructor(private prisma: PrismaService) { }
  async findOne(user: any) {
    const university = await this.prisma.universities.findUnique({
      where: { university_id: user.university_id },
      include: { university_detail: true }
    });

    // Remove sensitive information
    const detailUniversity = Object.fromEntries(
      Object.entries(university).filter(([key]) => !['otp', 'otpExpires', 'password'].includes(key))
    );

    return {
      status: "success",
      message: 'University Profile retrieved successfully',
      data: detailUniversity
    };
  }

  async newUniversity(user: any, updateUniversityProfileDto: UpdateUniversityProfileDto, upload_logo?: Express.Multer.File) {
    const errors = await validate(updateUniversityProfileDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingUniversity = await this.prisma.universities.findUnique({
      where: { university_id: user.university_id },
      include: { university_detail: true }
    });

    if (existingUniversity.status == 'submitted') {
      await fs.promises.unlink(upload_logo.path);
      throw new BadRequestException('University already submitted. Please wait for approval.');
    } else if (existingUniversity.status == 'accepted') {
      await fs.promises.unlink(upload_logo.path);
      throw new BadRequestException('University already accepted. No need to submit again.');
    }

    // Simpan URL Logo saat ini
    const currentLogoUrl = existingUniversity.university_detail?.logo_url;

    try {
      // Delete old profile picture file if new file uploaded and old file exists
      if (upload_logo && currentLogoUrl) {
        const oldFilePath = join(currentLogoUrl);
        if (fs.existsSync(oldFilePath)) {
          try {
            await fs.promises.unlink(oldFilePath);
          } catch (error) {
            //
          }
        } else {
          //
        }
      }

      await this.prisma.universities.update({
        where: { university_id: user.university_id },
        data: {
          status: 'submitted',
          university_detail: {
            update: { ...updateUniversityProfileDto, logo_url: upload_logo?.path }
          },
        },
      });

      return {
        status: "success",
        message: 'Request university approval submitted successfully. Please wait for approval. Please check your email for information on the approval status.',
      };

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to submit university profile for approval');
    }
  }

  async update(user: any, updateUniversityProfileDto: UpdateUniversityProfileDto, upload_logo?: Express.Multer.File) {
    const errors = await validate(updateUniversityProfileDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingUniversity = await this.prisma.universities.findUnique({
      where: { university_id: user.university_id },
      include: { university_detail: true }
    });

    if (existingUniversity.status == 'submitted' || existingUniversity.status == 'not_submitted') {
      await fs.promises.unlink(upload_logo.path);
      throw new BadRequestException('University not yet accepted or rejected. Please wait for approval checking before update profile.');
    }

    // Simpan URL Logo saat ini
    const currentLogoUrl = existingUniversity.university_detail?.logo_url;

    try {
      // Delete old profile picture file if new file uploaded and old file exists
      if (upload_logo && currentLogoUrl) {
        const oldFilePath = join(currentLogoUrl);
        if (fs.existsSync(oldFilePath)) {
          try {
            await fs.promises.unlink(oldFilePath);
          } catch (error) {
            //
          }
        } else {
          //
        }
      }

      const updatedUniversity = await this.prisma.universities.update({
        where: { university_id: user.university_id },
        data: {
          university_detail: {
            update: { ...updateUniversityProfileDto, logo_url: upload_logo?.path }
          },
        },
      });

      return {
        status: "success",
        message: 'University Profile updated successfully',
        data: updatedUniversity
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to update university');
    }
  }
}
