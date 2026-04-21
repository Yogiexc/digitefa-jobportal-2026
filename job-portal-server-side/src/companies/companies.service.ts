import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, status } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { validate } from 'class-validator';
import { approvalEmailTemplate } from './email-templates/approval-email-template';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) { }
  async create(createCompanyDto: CreateCompanyDto) {
    const errors = await validate(createCompanyDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    //Check Email
    const existingEmail = await this.prisma.companies.findUnique({
      where: {
        email: createCompanyDto.email,
      } as Prisma.companiesWhereUniqueInput,
    });

    if (existingEmail) {
      throw new ConflictException('Email is already taken');
    }
    try {
      const { password, ...userData } = createCompanyDto;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newCompany = await this.prisma.companies.create({
        data: {
          ...userData,
          password: hashedPassword,
        } as Prisma.companiesCreateInput,
      });
      return {
        status: 'success',
        message: 'Company created successfully',
        data: newCompany,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to create company');
    }
  }

  async findAllCompanyManagement(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page = 1,
      pageSize = 10,
      search,
      sortBy = 'updated_at',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    try {
      const where = {
        status: {
          in: ['submitted', 'accepted', 'rejected'] as status[],
        },
        ...(search && {
          OR: [
            {
              company_detail: {
                legal_name: { contains: search },
              },
            },
            {
              company_detail: {
                market_name: { contains: search },
              },
            },
            { email: { contains: search } },
          ],
        }),
      };
      // Calculate total data
      const totalData = await this.prisma.companies.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);

      const companies = await this.prisma.companies.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          company_id: true,
          email: true,
          status: true,
          created_at: true,
          company_detail: {
            select: {
              legal_name: true,
              market_name: true,
            },
          },
        },
      });

      // Modifikasi status sesuai dengan kondisi yang diberikan
      const modifiedCompanies = companies.map((company) => {
        let newStatus;
        switch (company.status) {
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
            newStatus = company.status; // jika status tidak sesuai dengan kondisi yang diberikan
        }

        return {
          company_id: company.company_id,
          email: company.email,
          status: newStatus,
          created_at: company.created_at,
          legal_name: company.company_detail.legal_name,
          market_name: company.company_detail.market_name,
        };
      });

      return {
        status: 'success',
        message: 'Companies retrieved successfully',
        totalData: +totalData,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: modifiedCompanies,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to retrieve companies');
    }
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page = 1,
      pageSize = 10,
      search,
      sortBy = 'updated_at',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    try {
      const where = search
        ? {
          OR: [
            {
              company_detail: {
                legal_name: { contains: search },
              },
            },
            {
              company_detail: {
                market_name: { contains: search },
              },
            },
            { email: { contains: search } },
          ],
        }
        : {};
      // Calculate total data
      const totalData = await this.prisma.companies.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);

      const companies = await this.prisma.companies.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          company_id: true,
          full_name: true,
          email: true,
          status: true,
          created_at: true,
          company_detail: {
            select: {
              legal_name: true,
              market_name: true,
            },
          },
        },
      });

      const modifiedCompanies = companies.map((company) => {
        return {
          company_id: company.company_id,
          full_name: company.full_name,
          email: company.email,
          status: company.status,
          created_at: company.created_at,
          legal_name: company.company_detail.legal_name,
          market_name: company.company_detail.market_name,
        };
      });

      return {
        status: 'success',
        message: 'Companies retrieved successfully',
        totalData: +totalData,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: modifiedCompanies,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to retrieve companies');
    }
  }

  async findOne(company_id: string) {
    const companies = await this.prisma.companies.findUnique({
      where: { company_id },
      select: {
        company_id: true,
        email: true,
        phone_number: true,
        status: true,
        company_detail: true,
      },
    });

    if (!companies) {
      throw new NotFoundException(`Company with ID ${company_id} not found`);
    }
    try {
      return {
        status: 'success',
        data: companies,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to retrieve companies');
    }
  }

  async searchTalents(query: string) {
    if (!query) return { status: 'success', data: [] };

    // Fetch all job seekers with details
    const seekers = await this.prisma.job_seeker_details.findMany({
      include: {
        job_seeker: {
          select: { job_seeker_id: true, email: true, full_name: true },
        },
        skills: true,
        experiences: true,
        education: true,
        languages: true,
      },
    });

    // Format for Python AI semantic search
    const talents = seekers.map((s) => {
      const skillsText = s.skills.map((skill) => skill.skill_name).join(', ');
      const expText = s.experiences
        .map(
          (e) =>
            `${e.experience_title} at ${e.company_name} - ${e.description}`,
        )
        .join('; ');
      const eduText = s.education
        ? `${s.education.degree} in ${s.education.major} at ${s.education.university_name}`
        : '';
      const langText = s.languages.map((l) => l.language_name).join(', ');

      const profileText = `Name: ${s.job_seeker.full_name}. Skills: ${skillsText}. Languages: ${langText}. Experience: ${expText}. Education: ${eduText}. Summary: ${s.personal_summary || ''}`;

      return { id: s.job_seeker_detail_id, profile_text: profileText };
    });

    const gpythonUrl = process.env.URL_SERVER_PYTHON;
    try {
      const response = await fetch(`${gpythonUrl}/search-talents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, talents }),
      });

      if (!response.ok) throw new InternalServerErrorException('AI API error');
      const result = await response.json();

      const finalResults = result.results
        .map((r: any) => {
          const seeker = seekers.find(
            (s) =>
              String(s.job_seeker_detail_id) === String(r.talent_id ?? ''),
          );
          if (!seeker) return null;
          return { ...seeker, ai_score: r.score };
        })
        .filter(Boolean);

      return { status: 'success', data: finalResults };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(
        'Failed to semantic search talents',
      );
    }
  }

  async changeStatusCompany(
    company_id: string,
    status: 'accepted' | 'rejected',
    notes: string,
  ) {
    const companies = await this.prisma.companies.findUnique({
      where: { company_id, status: 'submitted' },
      select: {
        company_id: true,
        email: true,
        status: true,
        company_detail: true,
      },
    });

    if (!companies) {
      throw new NotFoundException(`University with ID ${company_id} not found`);
    }
    try {
      await this.prisma.companies.update({
        where: { company_id },
        data: { status },
      });
      await this.prisma.approval.upsert({
        where: { company_id },
        update: { notes, company_id },
        create: { notes, company_id },
      });

      await this.sendApprovalEmail(companies.email, status, notes);

      return {
        status: 'success',
        message: 'Company status updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to change status company');
    }
  }

  async sendApprovalEmail(
    email: string,
    status: 'accepted' | 'rejected',
    notes: string,
  ) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
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

  async update(company_id: string, updateCompaniesDto: UpdateCompanyDto) {
    const errors = await validate(updateCompaniesDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const existingCompany = await this.prisma.companies.findUnique({
      where: { company_id },
    });

    if (!existingCompany) {
      throw new NotFoundException(`Company with ID ${company_id} not found`);
    }

    try {
      const updatedCompany = await this.prisma.companies.update({
        where: { company_id },
        data: updateCompaniesDto,
      });

      return {
        status: 'success',
        message: 'Company updated successfully',
        data: updatedCompany,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update company');
    }
  }

  async remove(company_id: string) {
    const existingCompany = await this.prisma.companies.findUnique({
      where: { company_id },
    });

    if (!existingCompany) {
      throw new NotFoundException(`Company with ID ${company_id} not found`);
    }
    try {
      await this.prisma.companies.delete({
        where: { company_id },
      });

      return {
        status: 'success',
        message: 'User removed successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove company');
    }
  }
}
