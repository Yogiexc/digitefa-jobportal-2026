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

  async searchTalents(query: string, job_id?: string, criteria?: string) {
    if (!query) return { status: 'success', data: [] };

    // Parse criteria
    const criteriaList = criteria ? criteria.split(',') : ['skills', 'projects', 'experience', 'education'];

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
        projects: true,
        certifications: true,
      },
    });

    // Fetch existing invitations for this job if job_id is provided
    let invitedJobSeekerIds: string[] = [];
    let appliedJobSeekerIds: string[] = [];
    let invitations: any[] = [];
    let applications: any[] = [];

    if (job_id) {
      invitations = await (this.prisma as any).request_apply.findMany({
        where: { job_id },
        select: { job_seeker_id: true, status: true },
      });
      invitedJobSeekerIds = invitations.map((inv) => inv.job_seeker_id);

      applications = await this.prisma.applications.findMany({
        where: { job_id },
        select: { job_seeker_id: true },
      });
      appliedJobSeekerIds = applications.map((app) => app.job_seeker_id);
    }

    // Format for Python AI semantic search
    const talents = seekers;

    const gpythonUrl = process.env.URL_SERVER_PYTHON?.replace('localhost', '127.0.0.1') || 'http://127.0.0.1:9090';
    try {
      const response = await fetch(`${gpythonUrl}/search-talents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            job: { title: query, description: query }, 
            talents,
            data_lms: [],
            sort_fields: criteriaList,
            is_sort: criteriaList.length > 0 ? "true" : "false",
            is_filter: "false"
        }),
      });

      if (!response.ok) throw new InternalServerErrorException('AI API error');
      const result = await response.json();

      const finalResults = result.results
        .map((r: any) => {
          const seeker = seekers.find(
            (s) =>
              String(s.job_seeker_detail_id) === String(r.job_seeker_id ?? ''),
          );
          if (!seeker) return null;
          const invitation = invitations.find(inv => inv.job_seeker_id === seeker.job_seeker_id);
          const hasAppliedDirectly = applications.some(app => app.job_seeker_id === seeker.job_seeker_id);
          const isInvited = invitedJobSeekerIds.includes(seeker.job_seeker_id);
          const isApplied = appliedJobSeekerIds.includes(seeker.job_seeker_id);

          let candidate_source = null;
          if (isInvited) {
            candidate_source = 'invited';
          } else if (isApplied) {
            candidate_source = 'manual';
          }

          return {
            ...seeker,
            ai_score: r.similarity_score,
            match_details: r.match_details,
            is_invited: isInvited,
            is_applied: isApplied, applied_from_invitation: !!(isApplied && invitation),
            candidate_source,
          };
        })
        .filter(Boolean);

      console.log('finalResults AI Match Details:', finalResults.map(r => ({
        job_seeker_id: r.job_seeker_detail_id,
        ai_score: r.ai_score,
        match_details: r.match_details
      })));

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

