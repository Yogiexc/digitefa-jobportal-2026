import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, status } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { validate } from 'class-validator';
import { approvalEmailTemplate } from './email-templates/approval-email-template';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UniversitiesService {
  constructor(private prisma: PrismaService) { }
  async create(createUniversityDto: CreateUniversityDto) {
    const errors = await validate(createUniversityDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //Check Email
    const existingEmail = await this.prisma.universities.findUnique({
      where:
        { email: createUniversityDto.email } as Prisma.universitiesWhereUniqueInput
    });

    if (existingEmail) {
      throw new ConflictException('Email is already taken');
    }
    try {
      const { password, ...userData } = createUniversityDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUniversity = await this.prisma.universities.create({ data: { ...userData, password: hashedPassword } as Prisma.universitiesCreateInput });
      return {
        status: "success",
        message: 'University created successfully',
        data: newUniversity
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to create university');
    }
  }

  async findAllUniversityManagement(params: {
    page?: number,
    pageSize?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  }) {
    const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    try {
      const where = {
        status: {
          in: ['submitted', 'accepted', 'rejected'] as status[]
        },
        ...(search && {
          OR: [
            {
              university_detail: {
                university_name: { contains: search }
              }
            },
            { email: { contains: search } },
          ]
        })
      }
      // Calculate total data
      const totalData = await this.prisma.universities.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);
      const universities = await this.prisma.universities.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder
        },
        select: {
          university_id: true,
          email: true,
          status: true,
          created_at: true,
          university_detail: {
            select: {
              university_name: true,
            }
          }
        }
      });

      // Modifikasi status sesuai dengan kondisi yang diberikan
      const modifiedUniversities = universities.map(university => {
        let newStatus;
        switch (university.status) {
          case 'submitted':
            newStatus = 'Pending';
            break;
          case 'accepted':
            newStatus = 'Accepted';
            break;
          case 'rejected':
            newStatus = 'Rejected';
            break;
          default:
            newStatus = university.status; // jika status tidak sesuai dengan kondisi yang diberikan
        }
        return {
          university_id: university.university_id,
          email: university.email,
          status: newStatus,
          created_at: university.created_at,
          university_name: university.university_detail.university_name
        };
      });

      return {
        status: "success",
        message: 'University retrieved successfully',
        totalData: +totalData,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: modifiedUniversities
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve universities');
    }
  }

  async findAll(params: {
    page?: number,
    pageSize?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  }) {
    const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    try {
      const where = search ? {
        OR: [
          { university_detail: { university_name: { contains: search } } },
          { email: { contains: search } },
        ]
      } : {};
      // Calculate total data
      const totalData = await this.prisma.universities.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);
      const universities = await this.prisma.universities.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder
        },
        select: {
          university_id: true,
          full_name: true,
          email: true,
          status: true,
          created_at: true,
          university_detail: {
            select: {
              university_name: true,
            }
          }
        }
      });

      const modifiedUniversities = universities.map(university => {
        return {
          university_id: university.university_id,
          full_name: university.full_name,
          email: university.email,
          status: university.status,
          created_at: university.created_at,
          university_name: university.university_detail.university_name
        };
      });

      return {
        status: "success",
        message: 'University retrieved successfully',
        totalData: +totalData,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: modifiedUniversities
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve universities');
    }
  }

  async findAllList() {
    try {
      const universities = await this.prisma.universities.findMany({
        select: {
          university_detail: {
            select: {
              university_name: true,
            }
          }
        },
        orderBy: {
          university_detail: {
            university_name: 'asc'
          }
        }
      });

      const modifiedUniversities = universities.map(university => {
        return {
          university_name: university.university_detail.university_name
        };
      });

      return {
        status: "success",
        message: 'University retrieved successfully',
        data: modifiedUniversities
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve universities');
    }
  }

  async findOne(university_id: string) {
    const universities = await this.prisma.universities.findUnique({
      where: { university_id },
      select: {
        university_id: true,
        full_name: true,
        email: true,
        status: true,
        university_detail: true,
      }
    });

    if (!universities) {
      throw new NotFoundException(`University with ID ${university_id} not found`);
    }
    try {
      return {
        status: "success",
        data: universities
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve universities');
    }
  }

  async changeStatusUniversity(university_id: string, status: "accepted" | "rejected", notes: string) {
    const universities = await this.prisma.universities.findUnique({
      where: { university_id, status: 'submitted' },
      select: {
        university_id: true,
        full_name: true,
        email: true,
        status: true,
        university_detail: true,
      }
    });

    if (!universities) {
      throw new NotFoundException(`University with ID ${university_id} not found`);
    }
    try {
      await this.prisma.universities.update({
        where: { university_id },
        data: { status }
      });
      await this.prisma.approval.upsert({
        where: { university_id },
        update: { notes, university_id },
        create: { notes, university_id }
      });

      await this.sendApprovalEmail(universities.email, status, notes);

      return {
        status: "success",
        message: 'University status updated successfully',
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to change status university');
    }
  }

  async sendApprovalEmail(email: string, status: 'accepted' | 'rejected', notes: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const htmlContent = approvalEmailTemplate(email, status, notes);

    await transporter.sendMail({
      from: `"Digitefa" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Approval Notification Digitefa',
      text: `Approval Notification for ${email}`,
      html: htmlContent,
    });
  }

  async update(university_id: string, updateCompaniesDto: UpdateUniversityDto) {
    const errors = await validate(updateCompaniesDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingUniversity = await this.prisma.universities.findUnique({
      where: { university_id }
    });

    if (!existingUniversity) {
      throw new NotFoundException(`University with ID ${university_id} not found`);
    }

    try {
      const updatedUniversity = await this.prisma.universities.update({
        where: { university_id },
        data: updateCompaniesDto
      });

      return {
        status: "success",
        message: 'University updated successfully',
        data: updatedUniversity
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to update university');
    }
  }

  async remove(university_id: string) {
    const existingUniversity = await this.prisma.universities.findUnique({
      where: { university_id }
    });

    if (!existingUniversity) {
      throw new NotFoundException(`University with ID ${university_id} not found`);
    }
    try {
      await this.prisma.universities.delete({
        where: { university_id }
      });

      return {
        status: "success",
        message: 'User removed successfully'
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to remove university');
    }
  }
}
