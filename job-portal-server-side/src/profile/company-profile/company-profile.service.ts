import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { validate } from 'class-validator';
import { PrismaService } from '../../../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class CompanyProfileService {
  constructor(private prisma: PrismaService) { }
  async findOne(user: any) {
    const company = await this.prisma.companies.findUnique({
      where: { company_id: user.company_id },
      include: { company_detail: true }
    });

    // Remove sensitive information
    const detailCompany = Object.fromEntries(
      Object.entries(company).filter(([key]) => !['otp', 'otpExpires', 'password'].includes(key))
    );

    return {
      status: "success",
      message: 'Company Profile retrieved successfully',
      data: detailCompany
    };
  }

  async newCompany(user: any, updateCompanyProfileDto: UpdateCompanyProfileDto, upload_logo?: Express.Multer.File) {
    const errors = await validate(updateCompanyProfileDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingCompany = await this.prisma.companies.findUnique({
      where: { company_id: user.company_id },
      include: { company_detail: true }
    });

    if (existingCompany.status == 'submitted') {
      upload_logo ? await fs.promises.unlink(upload_logo.path) : null;
      throw new BadRequestException('Company already submitted. Please wait for approval.');
    } else if (existingCompany.status == 'accepted') {
      upload_logo ? await fs.promises.unlink(upload_logo.path) : null;
      throw new BadRequestException('Company already accepted. No need to submit again.');
    }

    // Simpan URL Logo saat ini
    const currentLogoUrl = existingCompany.company_detail?.logo_url;

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

      await this.prisma.companies.update({
        where: { company_id: user.company_id },
        data: {
          status: 'submitted',
          company_detail: {
            upsert: {
              update: { ...updateCompanyProfileDto, logo_url: upload_logo?.path }, create: { ...updateCompanyProfileDto, logo_url: upload_logo?.path },
            },
          },
        },
      });

      return {
        status: "success",
        message: 'Request company approval submitted successfully. Please wait for approval. Please check your email for information on the approval status.',
      };

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to submit company profile for approval');
    }
  }

  async update(user: any, updateCompanyProfileDto: UpdateCompanyProfileDto, upload_logo?: Express.Multer.File) {
    const errors = await validate(updateCompanyProfileDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingCompany = await this.prisma.companies.findUnique({
      where: { company_id: user.company_id },
      include: { company_detail: true }
    });

    if (existingCompany.status == 'submitted' || existingCompany.status == 'not_submitted') {
      upload_logo ? await fs.promises.unlink(upload_logo.path) : null;
      throw new BadRequestException('Company not yet accepted or rejected. Please wait for approval checking before update profile.');
    }

    // Simpan URL Logo saat ini
    const currentLogoUrl = existingCompany.company_detail?.logo_url;

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

      const updatedCompany = await this.prisma.companies.update({
        where: { company_id: user.company_id },
        data: {
          company_detail: {
            upsert: {
              update: { ...updateCompanyProfileDto, logo_url: upload_logo?.path }, create: { ...updateCompanyProfileDto, logo_url: upload_logo?.path },
            },
          },
        },
      });

      return {
        status: "success",
        message: 'Company Profile updated successfully',
        data: updatedCompany
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to update company');
    }
  }
}
