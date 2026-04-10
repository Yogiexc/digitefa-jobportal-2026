import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { omit } from 'lodash';
import { ChangeStatusApplicationsDto } from './dto/change-status-applications.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as nodemailer from 'nodemailer';
import { interviewEmailTemplate } from './email-templates/interview-email-template';
import { acceptedEmailTemplate } from './email-templates/accepted-email-template';
import { rejectedEmailTemplate } from './email-templates/rejected-email-template';

@Injectable()
export class JobsService {
  private readonly lmsApiBaseUrl: string;
  private readonly pythonApiBaseUrl: string;
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {
    this.lmsApiBaseUrl = 'http://localhost:8000/api';
    this.pythonApiBaseUrl = 'http://localhost:9090';
  }
  async createJob(createJobDto: CreateJobDto, user: any) {
    const {
      benefits,
      skills_category,
      skills_requirement,
      hide_salary,
      ...data
    } = createJobDto;
    const findSkillCategory = await this.prisma.skills_category.findUnique({
      where: {
        category_name: skills_category,
      },
    });
    if (!findSkillCategory) {
      throw new NotFoundException('Skills category not found');
    }
    try {
      if (data.status == 'active') {
        (data as any).published_at = new Date();
        (data as any).expired_at = new Date(
          new Date().setDate(new Date().getDate() + 30),
        );
      }
      if (hide_salary === 'true') {
        (data as any).minimum_salary = null;
        (data as any).maximum_salary = null;
      }
      const savedJob = await this.prisma.jobs.create({
        data: {
          ...data,
          skills_category: {
            connect: {
              skill_category_id: findSkillCategory.skill_category_id,
            },
          },
          company: {
            connect: {
              company_id: user.company_id,
            },
          },
        },
      });

      // Save benefits
      if (benefits) {
        const benefitsData = benefits.map((benefit) => ({
          benefit: benefit,
          job_id: savedJob.job_id,
        }));
        await this.prisma.job_benefits.createMany({
          data: benefitsData,
        });
      }

      // Save SKills
      if (skills_requirement) {
        const skillsData = skills_requirement.map((skill) => ({
          skill: skill,
          job_id: savedJob.job_id,
          skill_category_id: findSkillCategory.skill_category_id,
        }));
        await this.prisma.skills_requirement.createMany({
          data: skillsData,
        });
      }

      // Convert salary to number
      const responseData = {
        ...savedJob,
        minimum_salary: Number(savedJob.minimum_salary),
        maximum_salary: Number(savedJob.maximum_salary),
      };

      return {
        status: 'success',
        message: 'Job saved successfully',
        data: responseData,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to create job');
    }
  }

  async findAll(
    user: any,
    params: {
      page?: number;
      pageSize?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      status?: string;
    },
  ) {
    const {
      page = 1,
      pageSize = 10,
      search,
      sortBy = 'updated_at',
      sortOrder = 'desc',
      status = 'active',
    } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    try {
      const where: any = {
        company_id: user.company_id,
        deleted_at: null,
        ...(search && {
          OR: [{ title: { contains: search } }],
        }),
        ...(status == 'draft' && { status: 'draft' }),
        ...(status == 'active' && {
          status: 'active',
          expired_at: {
            gt: new Date(),
          },
        }),
        ...(status == 'expired' && {
          expired_at: {
            lte: new Date(),
          },
        }),
      };
      // Calculate total data
      const totalData = await this.prisma.jobs.count({
        where: {
          company_id: user.company_id,
          deleted_at: null,
          ...(search && {
            OR: [{ title: { contains: search } }],
          }),
        },
      });

      const totalExpired = await this.prisma.jobs.count({
        where: {
          company_id: user.company_id,
          deleted_at: null,
          status: 'active',
          expired_at: {
            lte: new Date(),
          },
          ...(search && {
            OR: [{ title: { contains: search } }],
          }),
        },
      });

      const totalActive = await this.prisma.jobs.count({
        where: {
          company_id: user.company_id,
          deleted_at: null,
          status: 'active',
          expired_at: {
            gt: new Date(),
          },
          ...(search && {
            OR: [{ title: { contains: search } }],
          }),
        },
      });

      const totalDraft = await this.prisma.jobs.count({
        where: {
          company_id: user.company_id,
          deleted_at: null,
          status: 'draft',
        },
      });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);

      const jobs = await this.prisma.jobs.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          job_id: true,
          title: true,
          published_at: true,
          expired_at: true,
          status: true,
        },
      });

      const jobsWithApplicants = await Promise.all(
        jobs.map(async (job) => {
          const totalApplicants = await this.prisma.applications.count({
            where: {
              job_id: job.job_id, // Menghitung jumlah pelamar berdasarkan job_id
              job: {
                company_id: user.company_id,
                deleted_at: null,
              },
            },
          });

          return {
            ...job,
            status:
              job.expired_at != null && job.expired_at < new Date()
                ? 'expired'
                : job.status,
            total_applicants: totalApplicants, // Menambahkan jumlah pelamar per job
          };
        }),
      );

      return {
        status: 'success',
        message: 'Jobs retrieved successfully',
        totalData: +totalData,
        totalActive: +totalActive,
        totalDraft: +totalDraft,
        totalExpired: +totalExpired,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: jobsWithApplicants,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to retrieve job vacancies',
      );
    }
  }

  async findAllJobCompany(
    user: any,
    company_id: string,
    params: {
      page?: number;
      pageSize?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      status?: string;
    },
  ) {
    const {
      page = 1,
      pageSize = 10,
      search,
      sortBy = 'updated_at',
      sortOrder = 'desc',
      status = 'active',
    } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    try {
      const where: any = {
        company_id,
        deleted_at: null,
        ...(search && {
          OR: [
            { title: { contains: search } },
            { category: { contains: search } },
          ],
        }),
        ...(status == 'draft' && { status: 'draft' }),
        ...(status == 'active' && { status: 'active' }),
        ...(status == 'expired' && {
          expired_at: {
            lte: new Date(),
          },
        }),
      };
      // Calculate total data
      const totalData = await this.prisma.jobs.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);

      const jobs = await this.prisma.jobs.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          job_id: true,
          title: true,
          published_at: true,
          expired_at: true,
          status: true,
        },
      });

      const jobsWithApplicants = await Promise.all(
        jobs.map(async (job) => {
          const totalApplicants = await this.prisma.applications.count({
            where: {
              job_id: job.job_id, // Menghitung jumlah pelamar berdasarkan job_id
              job: {
                company_id: user.company_id,
                deleted_at: null,
              },
            },
          });

          return {
            ...job,
            status:
              job.expired_at != null && job.expired_at < new Date()
                ? 'expired'
                : job.status,
            total_applicants: totalApplicants, // Menambahkan jumlah pelamar per job
          };
        }),
      );

      return {
        status: 'success',
        message: 'Jobs retrieved successfully',
        totalData: +totalData,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: jobsWithApplicants,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to retrieve job vacancies',
      );
    }
  }

  async findOne(job_id: string) {
    const jobs = await this.prisma.jobs.findUnique({
      where: {
        job_id,
        deleted_at: null,
      },
      include: {
        benefits: {
          select: {
            benefit: true,
          },
        },
        skills_category: {
          select: {
            category_name: true,
          },
        },
        skills_requirement: {
          select: {
            skill: true,
          },
        },
      },
    });

    if (!jobs) {
      throw new NotFoundException(`Jobs with ID ${job_id} not found`);
    }

    // Convert salary to number
    const responseData = {
      ...jobs,
      skills_category: jobs.skills_category.category_name,
      employment_type: jobs.employment_type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      work_type: jobs.work_type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      salary_type: jobs.salary_type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      category: jobs.category
        .split('_')
        .map((word) =>
          word.toLowerCase() === 'and'
            ? word
            : word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join(' '),
      minimum_salary: Number(jobs.minimum_salary),
      maximum_salary: Number(jobs.maximum_salary),
      status:
        jobs.expired_at != null && jobs.expired_at < new Date()
          ? 'expired'
          : jobs.status,
    };

    try {
      return {
        status: 'success',
        data: responseData,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to retrieve jobs');
    }
  }

  async update(job_id: string, updateJobDto: UpdateJobDto, user: any) {
    const {
      benefits,
      skills_category,
      skills_requirement,
      hide_salary,
      ...data
    } = updateJobDto;
    const findSkillCategory = await this.prisma.skills_category.findUnique({
      where: {
        category_name: skills_category,
      },
    });
    if (!findSkillCategory) {
      throw new NotFoundException('Skills category not found');
    }
    try {
      const job = await this.prisma.jobs.findUnique({
        where: {
          job_id,
          deleted_at: null,
        },
      });

      if (!job) {
        throw new NotFoundException(`Job with ID ${job_id} not found`);
      }

      // Ensure the job belongs to the user's company
      if (job.company_id !== user.company_id) {
        throw new NotFoundException(`Job with ID ${job_id} not found`);
      }

      if (hide_salary === 'true') {
        (data as any).minimum_salary = null;
        (data as any).maximum_salary = null;
      }

      // Update the job
      const updatedJob = await this.prisma.jobs.update({
        where: {
          job_id,
          deleted_at: null,
        },
        data: {
          ...data,
          skills_category: {
            connect: {
              skill_category_id: findSkillCategory.skill_category_id,
            },
          },
          updated_at: new Date(),
        },
      });

      // Update benefits and skills
      if (benefits) {
        await this.prisma.job_benefits.deleteMany({
          where: { job_id },
        });

        const benefitsData = benefits.map((benefit) => ({
          benefit,
          job_id,
        }));

        await this.prisma.job_benefits.createMany({
          data: benefitsData,
        });
      }

      if (skills_requirement) {
        await this.prisma.skills_requirement.deleteMany({
          where: { job_id },
        });

        const skillsData = skills_requirement.map((skill) => ({
          skill,
          job_id,
          skill_category_id: findSkillCategory.skill_category_id,
        }));

        await this.prisma.skills_requirement.createMany({
          data: skillsData,
        });
      }

      // Convert salary to number
      const responseData = {
        ...updatedJob,
        minimum_salary: Number(updatedJob.minimum_salary),
        maximum_salary: Number(updatedJob.maximum_salary),
      };

      return {
        status: 'success',
        message: 'Job updated successfully',
        data: responseData,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update job');
    }
  }

  async reupload(job_id: string, user: any) {
    try {
      const job = await this.prisma.jobs.findUnique({
        where: {
          job_id,
          company_id: user.company_id,
          deleted_at: null,
        },
      });

      if (!job) {
        throw new NotFoundException(`Job with ID ${job_id} not found`);
      }

      const updatedJob = await this.prisma.jobs.update({
        where: { job_id },
        data: {
          status: 'active',
          published_at: new Date(),
          expired_at: new Date(new Date().setDate(new Date().getDate() + 30)),
        },
      });

      // Convert salary to number
      const responseData = {
        ...updatedJob,
        minimum_salary: Number(updatedJob.minimum_salary),
        maximum_salary: Number(updatedJob.maximum_salary),
      };

      return {
        status: 'success',
        message: `Job '${job.title}' reuploaded successfully`,
        data: responseData,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to reupload job');
    }
  }

  async deleteJob(job_id: string, user: any) {
    try {
      const job = await this.prisma.jobs.findUnique({
        where: {
          job_id,
          company_id: user.company_id,
          deleted_at: null,
        },
      });

      if (!job) {
        throw new NotFoundException(`Job with ID ${job_id} not found`);
      }

      await this.prisma.jobs.update({
        where: { job_id },
        data: {
          deleted_at: new Date(),
        },
      });

      return {
        status: 'success',
        message: `Job '${job.title}' deleted successfully`,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to delete job');
    }
  }

  async saveJobs(job_id: string, user: any) {
    try {
      const job = await this.prisma.jobs.findUnique({
        where: {
          job_id,
          deleted_at: null,
        },
      });

      if (!job) {
        throw new NotFoundException(`Job with ID ${job_id} not found`);
      }

      const savedJob = await this.prisma.saved_jobs.findFirst({
        where: {
          job_id,
          job_seeker_id: user.job_seeker_id,
        },
      });

      if (savedJob) {
        throw new InternalServerErrorException('Job already saved');
      }

      await this.prisma.saved_jobs.create({
        data: {
          job_id,
          job_seeker_id: user.job_seeker_id,
        },
      });

      return {
        status: 'success',
        message: `Job '${job.title}' saved successfully`,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to save job');
    }
  }

  async unsaveJobs(job_id: string, user: any) {
    try {
      const job = await this.prisma.jobs.findUnique({
        where: {
          job_id,
          deleted_at: null,
        },
      });

      if (!job) {
        throw new NotFoundException(`Job with ID ${job_id} not found`);
      }

      const savedJob = await this.prisma.saved_jobs.findFirst({
        where: {
          job_id,
          job_seeker_id: user.job_seeker_id,
        },
      });

      if (!savedJob) {
        throw new InternalServerErrorException('Job not saved');
      }

      await this.prisma.saved_jobs.delete({
        where: {
          saved_job_id: savedJob.saved_job_id,
        },
      });

      return {
        status: 'success',
        message: `Job '${job.title}' unsaved successfully`,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to unsave job');
    }
  }

  async findAllJobsSaved(
    user: any,
    params: {
      page?: number;
      pageSize?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    },
  ) {
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
      const where: any = {
        job_seeker_id: user.job_seeker_id,
        ...(search && {
          OR: [
            {
              job: {
                title: { contains: search },
              },
            },
          ],
        }),
      };
      // Calculate total data
      const totalData = await this.prisma.saved_jobs.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);

      const savedJobs = await this.prisma.saved_jobs.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          job: {
            select: {
              job_id: true,
              title: true,
              location: true,
              employment_type: true,
              work_type: true,
              category: true,
              education_requirement: true,
              salary_type: true,
              minimum_salary: true,
              maximum_salary: true,
              experience_requirement: true,
              published_at: true,
              expired_at: true,
              company: {
                select: {
                  company_id: true,
                  company_detail: {
                    select: {
                      logo_url: true,
                      legal_name: true,
                      market_name: true,
                      city: true,
                      country: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const responseData = savedJobs.map((savedJob) => {
        return {
          job_id: savedJob.job.job_id,
          title: savedJob.job.title,
          published_at: savedJob.job.published_at,
          expired_at: savedJob.job.expired_at,
          employment_type: savedJob.job.employment_type
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          work_type: savedJob.job.work_type
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          category: savedJob.job.category
            .split('_')
            .map((word) =>
              word.toLowerCase() === 'and'
                ? word
                : word.charAt(0).toUpperCase() + word.slice(1),
            )
            .join(' '),
          education_requirement: savedJob.job.education_requirement,
          salary_type: savedJob.job.salary_type
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          minimum_salary: Number(savedJob.job.minimum_salary),
          maximum_salary: Number(savedJob.job.maximum_salary),
          experience_requirement: savedJob.job.experience_requirement,
          location: savedJob.job.location,
          company: {
            company_id: savedJob.job.company.company_id,
            logo_url: savedJob.job.company.company_detail.logo_url,
            legal_name: savedJob.job.company.company_detail.legal_name,
            market_name: savedJob.job.company.company_detail.market_name,
            city: savedJob.job.company.company_detail.city,
            country: savedJob.job.company.company_detail.country,
          },
        };
      });

      return {
        status: 'success',
        message: 'Jobs saved retrieved successfully',
        totalData: +totalData,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: responseData,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to retrieve saved jobs');
    }
  }

  async findApplicants(
    job_id: string,
    user: any,
    params: {
      page?: number;
      pageSize?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      status?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      startSalary?: number;
      endSalary?: number;
      startExperience?: number;
      endExperience?: number;
    },
  ) {
    const {
      page = 1,
      pageSize = 10,
      search,
      sortBy = 'match_scores',
      sortOrder = 'desc',
      status = 'all',
      location,
      startDate,
      endDate,
      startSalary,
      endSalary,
      startExperience,
      endExperience,
    } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    let jobDescription = '';
    try {
      const jobDetailsResponse = await this.findOne(job_id);
      if (
        jobDetailsResponse &&
        jobDetailsResponse.data &&
        jobDetailsResponse.data.description
      ) {
        jobDescription = jobDetailsResponse.data.description;
      } else {
        console.warn(
          `Job description not found for job_id: ${job_id}. Suitability scores might be 0 or inaccurate.`,
        );
      }
    } catch (error) {
      console.warn(
        `Could not fetch job details for job_id ${job_id}: ${error.message}. Suitability scores might be 0 or inaccurate.`,
      );
    }

    const job = await this.prisma.jobs.findUnique({
      where: {
        job_id,
        deleted_at: null,
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${job_id} not found`);
    }

    try {
      // Ensure the job belongs to the user's company
      if (job.company_id !== user.company_id) {
        throw new NotFoundException(`Job with ID ${job_id} not found`);
      }

      const where: any = {
        job_id: job_id,
        ...(status !== 'all' && { status }),
        ...(search && {
          OR: [
            {
              job_seeker: {
                full_name: { contains: search },
              },
            },
            {
              job_seeker: {
                job_seeker_detail: {
                  personal_info: {
                    address: { contains: search },
                  },
                },
              },
            },
            {
              job_seeker: {
                job_seeker_detail: {
                  education: {
                    major: { contains: search },
                  },
                },
              },
            },
          ],
        }),
        ...(location && {
          job_seeker: {
            job_seeker_detail: {
              personal_info: {
                address: { contains: location },
              },
            },
          },
        }),
        ...(startDate && {
          applied_at: {
            gte: new Date(startDate),
          },
        }),
        ...(endDate && {
          applied_at: {
            lte: new Date(endDate),
          },
        }),
        ...(startSalary && {
          expected_salary: {
            gte: startSalary,
          },
        }),
        ...(endSalary && {
          expected_salary: {
            lte: endSalary,
          },
        }),
        ...(startExperience && {
          experience_years: {
            gte: startExperience,
          },
        }),
        ...(endExperience && {
          experience_years: {
            lte: endExperience,
          },
        }),
      };

      const applicantsFromDb = await this.prisma.applications.findMany({
        where,
        skip,
        take,
        orderBy: {
          ...(sortBy === 'match_scores'
            ? {
              match_scores: {
                overall: sortOrder,
              },
            }
            : { [sortBy]: sortOrder }),
        },
        select: {
          application_id: true,
          status: true,
          expected_salary: true,
          experience_years: true,
          applied_at: true,
          job: {
            select: { experience_requirement: true, description: true },
          },
          match_scores: true,
          job_seeker: {
            select: {
              job_seeker_id: true,
              full_name: true,
              lmsUserId: true,
              job_seeker_detail: {
                select: {
                  profile_picture_url: true,
                  personal_info: { select: { address: true } },
                  education: { select: { major: true } },
                },
              },
            },
          },
        },
      });

      if (
        !jobDescription &&
        applicantsFromDb.length > 0 &&
        applicantsFromDb[0].job?.description
      ) {
        jobDescription = applicantsFromDb[0].job.description;
      }

      const applicantsWithCoursesAndSuitability = await Promise.all(
        applicantsFromDb.map(async (applicant) => {
          let completed_courses = [];
          if (applicant.job_seeker.lmsUserId) {
            try {
              const lmsCoursesUrl = `${this.lmsApiBaseUrl}/lms/students/${applicant.job_seeker.lmsUserId}/completed-courses`;
              const lmsResponse = await firstValueFrom(
                this.httpService.get(lmsCoursesUrl),
              );
              if (
                lmsResponse.data &&
                lmsResponse.data.success &&
                Array.isArray(lmsResponse.data.data)
              ) {
                completed_courses = lmsResponse.data.data.map((course) => ({
                  title: course.title,
                  description: course.description,
                }));
              } else {
                console.warn(
                  `Gagal mengambil atau mem-parse completed courses untuk LMS User ID ${applicant.job_seeker.lmsUserId}: `,
                  lmsResponse.data?.message || 'Respons tidak terduga dari LMS',
                );
              }
            } catch (error) {
              console.error(
                `Error mengambil completed courses untuk LMS User ID ${applicant.job_seeker.lmsUserId}:`,
                error.response?.data || error.message || error,
              );
            }
          }

          let suitability_score = 0.0;
          if (jobDescription && completed_courses.length > 0) {
            const coursesForSuitability = completed_courses.filter(
              (c) => c.description && c.description.trim() !== '',
            );
            if (coursesForSuitability.length > 0) {
              try {
                const payload = {
                  job_description: jobDescription,
                  completed_courses: coursesForSuitability.map((c) => ({
                    title: c.title,
                    description: c.description,
                  })),
                };
                const suitabilityResponse = await firstValueFrom(
                  this.httpService.post(
                    `${this.pythonApiBaseUrl}/calculate-candidate-suitability`,
                    payload,
                    { timeout: 15000 },
                  ),
                );
                if (
                  suitabilityResponse.data &&
                  typeof suitabilityResponse.data.suitability_score === 'number'
                ) {
                  suitability_score =
                    suitabilityResponse.data.suitability_score;
                } else {
                  console.warn(
                    `Invalid suitability score response for applicant ${applicant.job_seeker.job_seeker_id}:`,
                    suitabilityResponse.data,
                  );
                }
              } catch (pyError) {
                console.error(
                  `Error calculating suitability for applicant ${applicant.job_seeker.job_seeker_id} (LMS User ID ${applicant.job_seeker.lmsUserId}):`,
                  pyError.response?.data || pyError.message || pyError,
                );
              }
            }
          }

          return {
            ...applicant,
            job_seeker: {
              ...applicant.job_seeker,
              completed_courses,
              suitability_score,
            },
          };
        }),
      );

      const responseData = applicantsWithCoursesAndSuitability.map((app) => ({
        application_id: app.application_id,
        status: app.status.charAt(0).toUpperCase() + app.status.slice(1),
        expected_salary: Number(app.expected_salary),
        experience_years: app.experience_years,
        applied_at: app.applied_at,
        job_seeker: {
          job_seeker_id: app.job_seeker.job_seeker_id,
          full_name: app.job_seeker.full_name,
          lmsUserId: app.job_seeker.lmsUserId,
          profile_picture_url:
            app.job_seeker.job_seeker_detail?.profile_picture_url || null,
          address:
            app.job_seeker.job_seeker_detail?.personal_info?.address || null,
          major: app.job_seeker.job_seeker_detail?.education?.major || null,
          completed_courses: app.job_seeker.completed_courses,
          suitability_score: app.job_seeker.suitability_score,
        },
        job: {
          experience_requirement: app.job.experience_requirement,
        },
        match_scores: app.match_scores ? app.match_scores : null,
      }));

      // Calculate total data
      const totalData = await this.prisma.applications.count({
        where: {
          job_id,
          ...(search && {
            OR: [
              {
                job_seeker: {
                  full_name: { contains: search },
                },
              },
              {
                job_seeker: {
                  job_seeker_detail: {
                    personal_info: {
                      address: { contains: search },
                    },
                  },
                },
              },
              {
                job_seeker: {
                  job_seeker_detail: {
                    education: {
                      major: { contains: search },
                    },
                  },
                },
              },
            ],
          }),
          ...(location && {
            job_seeker: {
              job_seeker_detail: {
                personal_info: {
                  address: { contains: location },
                },
              },
            },
          }),
        },
      });

      const totalPending = await this.prisma.applications.count({
        where: {
          job_id,
          status: 'pending',
          ...(search && {
            OR: [
              {
                job_seeker: {
                  full_name: { contains: search },
                },
              },
              {
                job_seeker: {
                  job_seeker_detail: {
                    personal_info: {
                      address: { contains: search },
                    },
                  },
                },
              },
              {
                job_seeker: {
                  job_seeker_detail: {
                    education: {
                      major: { contains: search },
                    },
                  },
                },
              },
            ],
          }),
          ...(location && {
            job_seeker: {
              job_seeker_detail: {
                personal_info: {
                  address: { contains: location },
                },
              },
            },
          }),
        },
      });

      const totalAccepted = await this.prisma.applications.count({
        where: {
          job_id,
          status: 'accepted',
          ...(search && {
            OR: [
              {
                job_seeker: {
                  full_name: { contains: search },
                },
              },
              {
                job_seeker: {
                  job_seeker_detail: {
                    personal_info: {
                      address: { contains: search },
                    },
                  },
                },
              },
              {
                job_seeker: {
                  job_seeker_detail: {
                    education: {
                      major: { contains: search },
                    },
                  },
                },
              },
            ],
          }),
          ...(location && {
            job_seeker: {
              job_seeker_detail: {
                personal_info: {
                  address: { contains: location },
                },
              },
            },
          }),
        },
      });

      const totalWaitingInterview = await this.prisma.applications.count({
        where: {
          job_id,
          status: 'waiting_interview',
          ...(search && {
            OR: [
              {
                job_seeker: {
                  full_name: { contains: search },
                },
              },
              {
                job_seeker: {
                  job_seeker_detail: {
                    personal_info: {
                      address: { contains: search },
                    },
                  },
                },
              },
              {
                job_seeker: {
                  job_seeker_detail: {
                    education: {
                      major: { contains: search },
                    },
                  },
                },
              },
            ],
          }),
          ...(location && {
            job_seeker: {
              job_seeker_detail: {
                personal_info: {
                  address: { contains: location },
                },
              },
            },
          }),
        },
      });

      const totalRejected = await this.prisma.applications.count({
        where: {
          job_id,
          status: 'rejected',
          ...(search && {
            OR: [
              {
                job_seeker: {
                  full_name: { contains: search },
                },
              },
              {
                job_seeker: {
                  job_seeker_detail: {
                    personal_info: {
                      address: { contains: search },
                    },
                  },
                },
              },
              {
                job_seeker: {
                  job_seeker_detail: {
                    education: {
                      major: { contains: search },
                    },
                  },
                },
              },
            ],
          }),
          ...(location && {
            job_seeker: {
              job_seeker_detail: {
                personal_info: {
                  address: { contains: location },
                },
              },
            },
          }),
        },
      });
      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);

      return {
        status: 'success',
        message: 'Applicants retrieved successfully',
        totalData: +totalData,
        totalPending: +totalPending,
        totalWaitingInterview: +totalWaitingInterview,
        totalAccepted: +totalAccepted,
        totalRejected: +totalRejected,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: responseData,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to retrieve applicants');
    }
  }

  async getJobSeekerByApplicationId(user: any, application_id: string) {
    const application = await this.prisma.applications.findUnique({
      where: { application_id },
      select: {
        job_seeker_id: true,
        job_id: true,
      },
    });
    if (!application) {
      throw new NotFoundException(
        `Application with ID ${application_id} not found`,
      );
    }
    try {
      let jobSeeker = await this.prisma.job_seeker_details.findUnique({
        where: { job_seeker_id: application.job_seeker_id },
        include: {
          job_seeker: true,
          personal_info: true,
          education: true,
          experiences: true,
          skills: true,
          projects: true,
          languages: true,
          certifications: true,
        },
      });

      if (!jobSeeker) {
        return { status: 'error', message: 'Job Seeker not found' };
      }

      // Fetch job description for suitability calculation
      const job = await this.prisma.jobs.findUnique({
        where: { job_id: application.job_id },
        select: { description: true },
      });

      let completed_courses = [];
      let suitability_score = 0.0;

      if (jobSeeker.job_seeker.lmsUserId) {
        try {
          // Fetch completed courses
          const lmsCoursesUrl = `${this.lmsApiBaseUrl}/lms/students/${jobSeeker.job_seeker.lmsUserId}/completed-courses`;
          const lmsResponse = await firstValueFrom(
            this.httpService.get(lmsCoursesUrl),
          );
          completed_courses = lmsResponse.data?.data || [];

          // Calculate suitability score
          if (job?.description && completed_courses.length > 0) {
            try {
              const payload = {
                job_description: job.description,
                completed_courses: completed_courses.map((course) => ({
                  title: course.title,
                  description: course.description,
                })),
              };
              const suitabilityResponse = await firstValueFrom(
                this.httpService.post(
                  `${this.pythonApiBaseUrl}/calculate-candidate-suitability`,
                  payload,
                ),
              );
              suitability_score =
                suitabilityResponse.data?.suitability_score || 0.0;
            } catch (suitabilityError) {
              console.warn(
                `Failed to calculate suitability score for job seeker ${jobSeeker.job_seeker.job_seeker_id}:`,
                suitabilityError.message,
              );
              suitability_score = 0.0;
            }
          }
        } catch (lmsError) {
          console.warn(
            `Failed to fetch LMS data for user ${jobSeeker.job_seeker.lmsUserId}:`,
            lmsError.message,
          );
          completed_courses = [];
          suitability_score = 0.0;
        }
      }

      // Remove sensitive data using lodash.omit
      if (jobSeeker.job_seeker) {
        jobSeeker.job_seeker = omit(jobSeeker.job_seeker, [
          'password',
          'otpExpires',
          'otp',
          'created_at',
          'updated_at',
        ]);
      }
      if (jobSeeker.personal_info) {
        jobSeeker.personal_info = omit(jobSeeker.personal_info, [
          'created_at',
          'updated_at',
        ]);
      }
      if (jobSeeker.education) {
        jobSeeker.education = omit(jobSeeker.education, [
          'created_at',
          'updated_at',
        ]);
      }
      if (jobSeeker.experiences) {
        jobSeeker.experiences = jobSeeker.experiences.map((exp) =>
          omit(exp, ['created_at', 'updated_at']),
        );
      }
      if (jobSeeker.skills) {
        jobSeeker.skills = jobSeeker.skills.map((skill) =>
          omit(skill, ['created_at', 'updated_at']),
        );
      }
      if (jobSeeker.projects) {
        jobSeeker.projects = jobSeeker.projects.map((project) =>
          omit(project, ['created_at', 'updated_at']),
        );
      }
      if (jobSeeker.languages) {
        jobSeeker.languages = jobSeeker.languages.map((lang) =>
          omit(lang, ['created_at', 'updated_at']),
        );
      }
      if (jobSeeker.certifications) {
        jobSeeker.certifications = jobSeeker.certifications.map((cert) =>
          omit(cert, ['created_at', 'updated_at']),
        );
      }

      return {
        status: 'success',
        message: 'Job Seeker retrieved successfully',
        data: {
          jobSeeker,
          completed_courses,
          suitability_score,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve job seeker');
    }
  }

  async getResumeApplicants(user: any, application_id: string) {
    const application = await this.prisma.applications.findUnique({
      where: { application_id },
    });
    if (!application) {
      throw new NotFoundException(
        `Application with ID ${application_id} not found`,
      );
    }
    try {
      return {
        status: 'success',
        message: 'Resume applicant retrieved successfully',
        data: application.resume_url,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to retrieve resume applicant',
      );
    }
  }

  async sendApplicationStatusEmail(email: string, status: string, jobTitle: string, companyName: string, jobseekerName?: string, interviewDetails?: any) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let subject = '';
    let html = '';
    let attachments: any[] = [];

    if (status === 'waiting_interview') {
      subject = `Interview Invitation - ${jobTitle}`;
      attachments = [{
        filename: 'Digitefa.png',
        path: process.cwd() + '/../job-portal-client-side/src/assets/images/Digitefa.png',
        cid: 'digitefa-logo'
      }];
      html = interviewEmailTemplate(
        jobseekerName || 'Jobseeker',
        jobTitle,
        companyName,
        interviewDetails?.interview_date ? new Date(interviewDetails.interview_date).toLocaleString() : 'TBD',
        interviewDetails?.meeting_link || 'TBD',
        interviewDetails?.notes || 'None'
      );
    } else if (status === 'accepted') {
      subject = `Application Status - ${jobTitle}`;
      attachments = [{
        filename: 'Digitefa.png',
        path: process.cwd() + '/../job-portal-client-side/src/assets/images/Digitefa.png',
        cid: 'digitefa-logo'
      }];
      html = acceptedEmailTemplate(
        jobseekerName || 'Jobseeker',
        jobTitle,
        companyName
      );
    } else if (status === 'rejected') {
      subject = `Application Status - ${jobTitle}`;
      attachments = [{
        filename: 'Digitefa.png',
        path: process.cwd() + '/../job-portal-client-side/src/assets/images/Digitefa.png',
        cid: 'digitefa-logo'
      }];
      html = rejectedEmailTemplate(
        jobseekerName || 'Jobseeker',
        jobTitle,
        companyName
      );
    } else {
      return;
    }

    try {
      await transporter.sendMail({
        from: `"${process.env.APP_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to: email,
        subject,
        html,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
    } catch (error) {
      console.error('Failed to send status email:', error);
    }
  }

  async changeStatusApplicant(
    user: any,
    application_id: string,
    changeStatusApplicationsDto: ChangeStatusApplicationsDto,
  ) {
    const { status, interview_date, meeting_link, notes } = changeStatusApplicationsDto;
    const application = await this.prisma.applications.findUnique({
      where: { application_id },
      include: {
        job: {
          include: {
            company: {
              include: { company_detail: true }
            },
          },
        },
        job_seeker: true
      },
    });
    if (!application) {
      throw new NotFoundException(
        `Application with ID ${application_id} not found`,
      );
    }
    if (application.job.company_id !== user.company_id) {
      throw new NotFoundException(
        `Application with ID ${application_id} not found`,
      );
    }
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.applications.update({
          where: { application_id },
          data: { status: status as any },
        });

        if (status === 'waiting_interview') {
          const existingInterview = await (tx as any).interviews.findUnique({
            where: { application_id }
          });

          if (existingInterview) {
            await (tx as any).interviews.update({
              where: { application_id },
              data: {
                interview_date: interview_date ? new Date(interview_date) : new Date(),
                meeting_link,
                notes
              }
            });
          } else {
            await (tx as any).interviews.create({
              data: {
                application_id,
                interview_date: interview_date ? new Date(interview_date) : new Date(),
                meeting_link,
                notes
              }
            });
          }
        }
      });

      if (application.job_seeker?.email) {
        const companyName = application.job.company?.company_detail?.market_name || 'DigiTefa Company';
        await this.sendApplicationStatusEmail(
          application.job_seeker.email,
          status,
          application.job.title,
          companyName,
          application.job_seeker.full_name,
          { interview_date, meeting_link, notes }
        );
      }

      return {
        status: 'success',
        message: 'Application status updated successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to update application status',
      );
    }
  }

  async getCompanyInterviews(user: any, page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      application: {
        job: {
          company_id: user.company_id
        }
      }
    };

    if (search) {
      whereCondition.application.job_seeker = {
        full_name: {
          contains: search
        }
      };
    }

    const interviews = await (this.prisma as any).interviews.findMany({
      where: whereCondition,
      include: {
        application: {
          include: {
            job: true,
            job_seeker: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { interview_date: 'desc' }
    });

    const total = await (this.prisma as any).interviews.count({ where: whereCondition });

    return {
      status: 'success',
      data: interviews,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit)
      }
    };
  }

  async inviteTalent(user: any, job_id: string, job_seeker_id: string) {
    const job = await this.prisma.jobs.findUnique({
      where: { job_id },
      include: { company: { include: { company_detail: true } } }
    });
    if (!job || job.company_id !== user.company_id) {
      throw new NotFoundException('Job not found or not owned by company');
    }

    const jobSeeker = await this.prisma.job_seekers.findUnique({
      where: { job_seeker_id }
    });
    if (!jobSeeker) {
      throw new NotFoundException('Job seeker not found');
    }

    const existing = await (this.prisma as any).invitations.findUnique({
      where: {
        job_id_job_seeker_id: {
          job_id,
          job_seeker_id
        }
      }
    });

    if (existing) {
      throw new InternalServerErrorException('Talent is already invited to this job');
    }

    await (this.prisma as any).invitations.create({
      data: {
        job_id,
        job_seeker_id,
        status: 'pending'
      }
    });

    if (jobSeeker.email) {
      const companyName = job.company?.company_detail?.market_name || 'A Company';
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      });

      const subject = `[DigiTefa] You have been invited to apply for ${job.title}`;
      const html = `<p>Hello ${jobSeeker.full_name || 'Talent'},</p>
      <p><strong>${companyName}</strong> has reviewed your profile and thinks you would be a great fit for their open <strong>${job.title}</strong> position.</p>
      <p>Log in to your DigiTefa account to view the details and apply (or ignore the invitation if you aren't interested)!</p>`;

      try {
        await transporter.sendMail({
          from: `"${process.env.APP_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
          to: jobSeeker.email,
          subject,
          html,
        });
      } catch (error) {
        console.error('Failed to send invitation email:', error);
      }
    }

    return { status: 'success', message: 'Invitation sent successfully' };
  }

  async generateCSVOrXLSX(
    job_id: string,
    user: any,
    start: number,
    end: number,
    format: 'csv' | 'xlsx' = 'xlsx',
    res: Response,
  ) {
    const job = await this.prisma.jobs.findUnique({
      where: {
        job_id,
        deleted_at: null,
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${job_id} not found`);
    }

    try {
      // Ensure the job belongs to the user's company
      if (job.company_id !== user.company_id) {
        throw new NotFoundException(`Job with ID ${job_id} not found`);
      }

      if (!start && !end) {
        start = null;
        end = null;
      } else {
        if (!start) start = 1;
        if (!end) end = 10;
      }

      // Validate and adjust `start` and `end` parameters
      const validStart = start ? Math.max(start - 1, 0) : null; // Convert to zero-based index
      const validEnd = end ? (end > validStart ? end : validStart) : null; // Ensure end >= start
      const take =
        validStart !== null && validEnd !== null ? validEnd - validStart : null; // Number of rows to take

      const applicants = await this.prisma.applications.findMany({
        where: {
          job_id: job_id,
        },
        orderBy: {
          ['applied_at']: 'desc',
        },
        ...(validStart !== null ? { skip: validStart } : {}), // Skip rows sebelum `start` jika ada
        ...(take !== null ? { take: take } : {}), // Ambil baris dari `start` ke `end` jika ada
        select: {
          application_id: true,
          status: true,
          expected_salary: true,
          applied_at: true,
          job_seeker: {
            select: {
              job_seeker_id: true,
              full_name: true,
              job_seeker_detail: {
                select: {
                  profile_picture_url: true,
                  personal_info: {
                    select: {
                      address: true,
                    },
                  },
                  education: {
                    select: {
                      major: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Convert salary to number
      const responseData = applicants.map((applicant) => ({
        application_id: applicant.application_id,
        status:
          applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1),
        expected_salary: Number(applicant.expected_salary),
        applied_at: applicant.applied_at,
        job_seeker: {
          job_seeker_id: applicant.job_seeker.job_seeker_id,
          full_name: applicant.job_seeker.full_name,
          profile_picture_url: applicant.job_seeker.job_seeker_detail
            .profile_picture_url
            ? applicant.job_seeker.job_seeker_detail.profile_picture_url
            : null,
          address: applicant.job_seeker.job_seeker_detail.personal_info
            ? applicant.job_seeker.job_seeker_detail.personal_info.address
            : null,
          major: applicant.job_seeker.job_seeker_detail.education
            ? applicant.job_seeker.job_seeker_detail.education.major
            : null,
        },
      }));

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Applicants');

      worksheet.columns = [
        { header: 'Application ID', key: 'application_id', width: 20 },
        { header: 'Full Name', key: 'full_name', width: 30 },
        { header: 'Expected Salary', key: 'expected_salary', width: 15 },
        { header: 'Address', key: 'address', width: 50 },
        { header: 'Major', key: 'major', width: 30 },
        { header: 'Applied At', key: 'applied_at', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
      ];

      responseData.forEach((data) => {
        worksheet.addRow({
          application_id: data.application_id,
          full_name: data.job_seeker.full_name,
          expected_salary: data.expected_salary,
          address: data.job_seeker.address,
          major: data.job_seeker.major,
          applied_at: data.applied_at,
          status: data.status,
        });
      });

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename="applicants.csv"',
        );
        await workbook.csv.write(res);
      } else if (format === 'xlsx') {
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
          'Content-Disposition',
          'attachment; filename="applicants.xlsx"',
        );
        await workbook.xlsx.write(res);
      }

      return res.end();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to export applicants');
    }
  }
  async findAllJobsSavedForLms(job_seeker_id: string) {
    const jobSeeker = await this.prisma.job_seekers.findUnique({
      where: { job_seeker_id },
    });

    if (!jobSeeker) {
      throw new NotFoundException(
        `Job Seeker with ID ${job_seeker_id} not found.`,
      );
    }

    try {
      const savedJobs = await this.prisma.saved_jobs.findMany({
        where: { job_seeker_id },
        orderBy: {
          created_at: 'desc',
        },
        include: {
          job: {
            include: {
              company: {
                select: {
                  company_detail: {
                    select: {
                      market_name: true,
                      logo_url: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const responseData = savedJobs.map(({ job }) => ({
        job_id: job.job_id,
        title: job.title,
        location: job.location,
        work_type: job.work_type,
        employment_type: job.employment_type,
        company: {
          market_name: job.company.company_detail.market_name,
          logo_url: job.company.company_detail.logo_url,
        },
        saved_at: job.created_at,
      }));

      return {
        status: 'success',
        message: 'Saved jobs retrieved successfully for LMS.',
        data: responseData,
      };
    } catch (error) {
      console.error('Error in findAllJobsSavedForLms:', error);
      throw new InternalServerErrorException('Failed to retrieve saved jobs.');
    }
  }

  async findOneForLms(job_id: string) {
    const job = await this.prisma.jobs.findUnique({
      where: {
        job_id,
        deleted_at: null,
        status: 'active',
        expired_at: {
          gt: new Date(),
        },
      },
      include: {
        benefits: {
          select: {
            benefit: true,
          },
        },
        skills_category: {
          select: {
            category_name: true,
          },
        },
        skills_requirement: {
          select: {
            skill: true,
          },
        },
        company: {
          select: {
            company_detail: {
              select: {
                market_name: true,
                logo_url: true,
                country: true,
                city: true,
              },
            },
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(
        `Job with ID ${job_id} not found or is not active.`,
      );
    }

    const responseData = {
      ...job,
      skills_category: job.skills_category.category_name,
      benefits: job.benefits.map((b) => b.benefit),
      skills_requirement: job.skills_requirement.map((s) => s.skill),
      company: job.company.company_detail,
      employment_type: job.employment_type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      work_type: job.work_type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      salary_type: job.salary_type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      category: job.category
        .split('_')
        .map((word) =>
          word.toLowerCase() === 'and'
            ? word
            : word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join(' '),
      minimum_salary: Number(job.minimum_salary),
      maximum_salary: Number(job.maximum_salary),
    };

    delete responseData.company_id;
    delete responseData.skills_category_id;

    return {
      status: 'success',
      message: 'Job details retrieved successfully for LMS.',
      data: responseData,
    };
  }
}
