import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { promises as fs } from 'fs';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ApplicantsService {
  constructor(private prisma: PrismaService) {}
  async applyJob(
    user: any,
    job_id: string,
    applyJobDto: any,
    resume: Express.Multer.File,
  ) {
    if (!resume) {
      throw new BadRequestException('Resume file is required');
    }
    const { expected_salary, experience_years } = applyJobDto;
    const existingJob = await this.prisma.jobs.findUnique({
      where: { job_id },
    });
    if (!existingJob) {
      await fs.unlink(resume?.path);
      throw new NotFoundException(`Job with ID ${job_id} not found`);
    }
    const existingJobSeeker = await this.prisma.job_seekers.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });
    if (!existingJobSeeker) {
      await fs.unlink(resume?.path);
      throw new NotFoundException('Job Seeker not found');
    }

    const applicant = await this.prisma.applications.findFirst({
      where: {
        job_id,
        job_seeker_id: user.job_seeker_id,
      },
    });

    if (applicant) {
      await fs.unlink(resume.path);
      throw new BadRequestException(
        'Job is already applied. Please wait for the result.',
      );
    }

    const jobSeeker = await this.prisma.job_seeker_details.findUnique({
      where: {
        job_seeker_id: user.job_seeker_id,
      },
      select: {
        skills: true,
        personal_summary: true,
        education: true,
        experiences: true,
        projects: true,
        certifications: true,
        job_seeker: {
          select: {
            saved_jobs: true,
            applications: true,
          },
        },
      },
    });

    const job = await this.prisma.jobs.findUnique({
      where: {
        job_id,
        status: 'active',
        expired_at: { gte: new Date() },
        deleted_at: null,
      },
      select: {
        job_id: true,
        title: true,
        description: true,
        location: true,
        work_type: true,
        category: true,
        education_requirement: true,
        experience_requirement: true,
        skills_requirement: {
          select: {
            skill: true,
          },
        },
      },
    });

    let recommendedJobs = [];

    if (jobSeeker) {
      const skillsText =
        jobSeeker.skills?.map((skill) => skill.skill_name).join(', ') || '';
      const expText =
        jobSeeker.experiences
          ?.map(
            (e) =>
              `${e.experience_title} at ${e.company_name} - ${e.description}`,
          )
          .join('; ') || '';
      const eduText = jobSeeker.education
        ? `${jobSeeker.education.degree} in ${jobSeeker.education.major} at ${jobSeeker.education.university_name}`
        : '';
      const profileText = `Skills: ${skillsText}. Experience: ${expText}. Education: ${eduText}. Summary: ${jobSeeker.personal_summary || ''}`;

      const jobPayload = {
        title: job.title || '',
        description: job.description || '',
        skills_requirement: job.skills_requirement.map((s) => s.skill).join(', ') || '',
        education_requirement: job.education_requirement || '',
        experience_requirement: job.experience_requirement || '',
      };

      const candidatePayload = {
        skills: jobSeeker.skills?.map((skill) => skill.skill_name).join(', ') || '',
        experience: jobSeeker.experiences?.map((e) => `${e.experience_title} at ${e.company_name} - ${e.description}`).join('; ') || '',
        summary: jobSeeker.personal_summary || '',
        education: jobSeeker.education ? `${jobSeeker.education.degree} in ${jobSeeker.education.major} at ${jobSeeker.education.university_name}` : '',
        others: [
          ...(jobSeeker.projects?.map(p => p.project_name) || []),
          ...(jobSeeker.certifications?.map(c => c.certification_name) || [])
        ].join(', ')
      };

      try {
        const gpythonUrl = process.env.URL_SERVER_PYTHON;
        const res = await fetch(`${gpythonUrl}/calculate-match-score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job: jobPayload,
            candidate: candidatePayload,
          }),
        });

        if (res.ok) {
          const parsed = await res.json();
          if (parsed.status === 'success') {
            const scores = parsed.data;
            recommendedJobs = [
              {
                job_id: job.job_id,
                similarity_score: scores.overall,
                match_details: {
                  personal_summary_match: scores.summary,
                  skills_match: scores.skills,
                  education_match: scores.education,
                  experience_match: scores.experience,
                  certifications_match: scores.others,
                  projects_match: scores.others,
                },
              }
            ];
          }
        }
      } catch (error) {
        console.error('Error hitting Python calculate-match-score API:', error);
      }
    }

    // Fallback if AI fails
    if (!recommendedJobs.length) {
      recommendedJobs = [
        {
          job_id: job.job_id,
          similarity_score: 0,
          match_details: {},
        },
      ];
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        // 1) Buat aplikasi
        const application = await tx.applications.create({
          data: {
            job_id,
            job_seeker_id: user.job_seeker_id,
            resume_url: resume.path,
            expected_salary: expected_salary,
            experience_years: experience_years,
          },
        });

        // 2) Buat match_scores yang terkait
        const matchScores = recommendedJobs[0].match_details;
        await tx.match_scores.create({
          data: {
            application_id: application.application_id,
            overall: Number(
              (recommendedJobs[0].similarity_score * 100).toFixed(2),
            ),
            summary: matchScores.personal_summary_match !== undefined ? Number((matchScores.personal_summary_match * 100).toFixed(2)) : null,
            skills: matchScores.skills_match !== undefined ? Number((matchScores.skills_match * 100).toFixed(2)) : null,
            education: matchScores.education_match !== undefined ? Number((matchScores.education_match * 100).toFixed(2)) : null,
            experience: matchScores.experience_match !== undefined ? Number((matchScores.experience_match * 100).toFixed(2)) : null,
            certifications: matchScores.certifications_match !== undefined ? Number((matchScores.certifications_match * 100).toFixed(2)) : null,
            projects: matchScores.projects_match !== undefined ? Number((matchScores.projects_match * 100).toFixed(2)) : null,
          },
        });

        // Jika perlu, bisa kirim email di sini atau di luar transaction
        return application;
      });

      // Send email to employer
      return {
        status: 'success',
        message: 'Job applied successfully.',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to apply jobs');
    }
  }

  async findAllJobsApplied(
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
      status,
    } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    let jobSeeker;
    if (user && user.job_seeker_id) {
      jobSeeker = await this.prisma.job_seeker_details.findUnique({
        where: {
          job_seeker_id: user.job_seeker_id,
        },
        select: {
          skills: true,
          job_seeker: {
            select: {
              saved_jobs: true,
              applications: true,
            },
          },
        },
      });
    }

    try {
      const where: any = {
        job_seeker_id: user.job_seeker_id,
        ...(search && {
          OR: [
            {
              job: {
                company: {
                  company_detail: { legal_name: { contains: search } },
                },
              },
            },
            { job: { title: { contains: search } } },
          ],
          ...(status && {
            status: status,
          }),
        }),
      };
      // Calculate total data
      const totalData = await this.prisma.applications.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);

      const appliedJobs = await this.prisma.applications.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          application_id: true,
          status: true,
          applied_at: true,
          job_id: true,
          job: {
            select: {
              title: true,
              employment_type: true,
              salary_type: true,
              minimum_salary: true,
              maximum_salary: true,
              location: true,
              published_at: true,
              company: {
                select: {
                  company_detail: {
                    select: {
                      legal_name: true,
                      market_name: true,
                      logo_url: true,
                      country: true,
                      city: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Convert salary to number
      const responseData = appliedJobs.map((appliedJob) => {
        let savedJob;
        if (jobSeeker) {
          savedJob = jobSeeker.job_seeker.saved_jobs.find(
            (savedJob) => savedJob.job_id === appliedJob.job_id,
          );
        }
        let applied;
        if (jobSeeker) {
          applied = jobSeeker.job_seeker.applications.find(
            (appliedJob) => appliedJob.job_id === appliedJob.job_id,
          );
        }
        return {
          application_id: appliedJob.application_id,
          is_saved: savedJob ? true : false,
          is_applied: applied ? true : false,
          status:
            appliedJob.status.charAt(0).toUpperCase() +
            appliedJob.status.slice(1),
          applied_at: appliedJob.applied_at,
          job: {
            job_id: appliedJob.job_id,
            title: appliedJob.job.title,
            location: appliedJob.job.location,
            employment_type: appliedJob.job.employment_type,
            salary_type: appliedJob.job.salary_type,
            minimum_salary: Number(appliedJob.job.minimum_salary),
            maximum_salary: Number(appliedJob.job.maximum_salary),
            published_at: appliedJob.job.published_at,
          },
          company: {
            legal_name: appliedJob.job.company.company_detail.legal_name,
            market_name: appliedJob.job.company.company_detail.market_name,
            logo_url: appliedJob.job.company.company_detail.logo_url,
            country: appliedJob.job.company.company_detail.country,
            city: appliedJob.job.company.company_detail.city,
          },
        };
      });

      return {
        status: 'success',
        message: 'Jobs applied retrieved successfully',
        totalData: +totalData,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: responseData,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to retrieve applied jobs');
    }
  }

  async detailJobsApplied(user: any, application_id: string) {
    const application = await this.prisma.applications.findUnique({
      where: {
        application_id,
        job_seeker_id: user.job_seeker_id,
      },
      select: {
        application_id: true,
        status: true,
        applied_at: true,
        job_id: true,
        job: {
          select: {
            title: true,
            employment_type: true,
            salary_type: true,
            minimum_salary: true,
            maximum_salary: true,
            experience_requirement: true,
            location: true,
            published_at: true,
            company: {
              select: {
                company_detail: {
                  select: {
                    legal_name: true,
                    market_name: true,
                    logo_url: true,
                    country: true,
                    city: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Job application not found');
    }

    return {
      status: 'success',
      message: 'Job application retrieved successfully',
      data: {
        application_id: application.application_id,
        status:
          application.status.charAt(0).toUpperCase() +
          application.status.slice(1),
        applied_at: application.applied_at,
        job: {
          job_id: application.job_id,
          title: application.job.title,
          location: application.job.location,
          employment_type: application.job.employment_type,
          salary_type: application.job.salary_type,
          minimum_salary: Number(application.job.minimum_salary),
          maximum_salary: Number(application.job.maximum_salary),
          experience_requirement: application.job.experience_requirement,
          published_at: application.job.published_at,
        },
        company: {
          legal_name: application.job.company.company_detail.legal_name,
          market_name: application.job.company.company_detail.market_name,
          logo_url: application.job.company.company_detail.logo_url,
          country: application.job.company.company_detail.country,
          city: application.job.company.company_detail.city,
        },
      },
    };
  }

  async findAllJobsAppliedHistory(
    job_seeker_id: string,
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
      status,
    } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    //Find job seeker
    const jobSeeker = await this.prisma.job_seekers.findUnique({
      where: {
        job_seeker_id,
      },
    });

    if (!jobSeeker) {
      throw new NotFoundException('Job Seeker not found');
    }

    try {
      const where: any = {
        job_seeker_id,
        ...(search && {
          OR: [
            {
              job: {
                company: {
                  company_detail: { legal_name: { contains: search } },
                },
              },
            },
            { job: { title: { contains: search } } },
          ],
        }),
        ...(status && {
          status: status,
        }),
      };
      // Calculate total data
      const totalData = await this.prisma.applications.count({ where });

      // Calculate total pages
      const totalPages = Math.ceil(totalData / pageSize);

      const appliedJobs = await this.prisma.applications.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        select: {
          application_id: true,
          status: true,
          applied_at: true,
          job_id: true,
          job: {
            select: {
              title: true,
              employment_type: true,
              salary_type: true,
              minimum_salary: true,
              maximum_salary: true,
              experience_requirement: true,
              location: true,
              published_at: true,
              company: {
                select: {
                  company_detail: {
                    select: {
                      legal_name: true,
                      market_name: true,
                      logo_url: true,
                      country: true,
                      city: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Convert salary to number
      const responseData = appliedJobs.map((appliedJob) => {
        return {
          application_id: appliedJob.application_id,
          status:
            appliedJob.status.charAt(0).toUpperCase() +
            appliedJob.status.slice(1),
          applied_at: appliedJob.applied_at,
          job: {
            job_id: appliedJob.job_id,
            title: appliedJob.job.title,
            location: appliedJob.job.location,
            employment_type: appliedJob.job.employment_type,
            salary_type: appliedJob.job.salary_type,
            minimum_salary: Number(appliedJob.job.minimum_salary),
            maximum_salary: Number(appliedJob.job.maximum_salary),
            experience_requirement: appliedJob.job.experience_requirement,
            published_at: appliedJob.job.published_at,
          },
          company: {
            legal_name: appliedJob.job.company.company_detail.legal_name,
            market_name: appliedJob.job.company.company_detail.market_name,
            logo_url: appliedJob.job.company.company_detail.logo_url,
            country: appliedJob.job.company.company_detail.country,
            city: appliedJob.job.company.company_detail.city,
          },
        };
      });

      return {
        status: 'success',
        message: 'Jobs applied retrieved successfully',
        totalData: +totalData,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: responseData,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to retrieve applied jobs');
    }
  }

  async exportAllJobsAppliedHistory(
    job_seeker_id: string,
    format: 'csv' | 'xlsx' = 'xlsx',
    res: Response,
  ) {
    //Find job seeker
    const jobSeeker = await this.prisma.job_seekers.findUnique({
      where: {
        job_seeker_id,
      },
    });

    if (!jobSeeker) {
      throw new NotFoundException('Job Seeker not found');
    }

    try {
      const appliedJobs = await this.prisma.applications.findMany({
        where: {
          job_seeker_id,
        },
        select: {
          application_id: true,
          status: true,
          applied_at: true,
          job_id: true,
          job: {
            select: {
              title: true,
              employment_type: true,
              salary_type: true,
              minimum_salary: true,
              maximum_salary: true,
              experience_requirement: true,
              location: true,
              published_at: true,
              company: {
                select: {
                  company_detail: {
                    select: {
                      legal_name: true,
                      market_name: true,
                      logo_url: true,
                      country: true,
                      city: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Convert salary to number
      const responseData = appliedJobs.map((appliedJob) => {
        return {
          application_id: appliedJob.application_id,
          status:
            appliedJob.status.charAt(0).toUpperCase() +
            appliedJob.status.slice(1),
          applied_at: appliedJob.applied_at,
          job: {
            job_id: appliedJob.job_id,
            title: appliedJob.job.title,
            location: appliedJob.job.location,
            employment_type: appliedJob.job.employment_type,
            salary_type: appliedJob.job.salary_type,
            minimum_salary: Number(appliedJob.job.minimum_salary),
            maximum_salary: Number(appliedJob.job.maximum_salary),
            experience_requirement: appliedJob.job.experience_requirement,
            published_at: appliedJob.job.published_at,
          },
          company: {
            legal_name: appliedJob.job.company.company_detail.legal_name,
            market_name: appliedJob.job.company.company_detail.market_name,
            country: appliedJob.job.company.company_detail.country,
            city: appliedJob.job.company.company_detail.city,
          },
        };
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students');

      // Add header row
      worksheet.columns = [
        { header: 'Application ID', key: 'application_id', width: 20 },
        { header: 'Status', key: 'status', width: 20 },
        { header: 'Applied At', key: 'applied_at', width: 20 },
        { header: 'Job ID', key: 'job_id', width: 20 },
        { header: 'Job Title', key: 'title', width: 20 },
        { header: 'Location', key: 'location', width: 20 },
        { header: 'Employment Type', key: 'employment_type', width: 20 },
        { header: 'Salary Type', key: 'salary_type', width: 20 },
        { header: 'Minimum Salary', key: 'minimum_salary', width: 20 },
        { header: 'Maximum Salary', key: 'maximum_salary', width: 20 },
        {
          header: 'Experience Requirement',
          key: 'experience_requirement',
          width: 20,
        },
        { header: 'Published At', key: 'published_at', width: 20 },
        { header: 'Company Legal Name', key: 'legal_name', width: 20 },
        { header: 'Company Market Name', key: 'market_name', width: 20 },
        { header: 'Company Country', key: 'country', width: 20 },
        { header: 'Company City', key: 'city', width: 20 },
      ];

      // Add rows
      responseData.forEach((data) => {
        worksheet.addRow({
          application_id: data.application_id,
          status: data.status,
          applied_at: data.applied_at,
          job_id: data.job.job_id,
          title: data.job.title,
          location: data.job.location,
          employment_type: data.job.employment_type,
          salary_type: data.job.salary_type,
          minimum_salary: data.job.minimum_salary,
          maximum_salary: data.job.maximum_salary,
          experience_requirement: data.job.experience_requirement,
          published_at: data.job.published_at,
          legal_name: data.company.legal_name,
          market_name: data.company.market_name,
          country: data.company.country,
          city: data.company.city,
        });
      });

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename="applied-jobs.csv"',
        );
        await workbook.csv.write(res);
      } else if (format === 'xlsx') {
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
          'Content-Disposition',
          'attachment; filename="applied-jobs.xlsx"',
        );
        await workbook.xlsx.write(res);
      }
      await workbook.xlsx.write(res);
      return res.end();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to retrieve applied jobs');
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

  async findAllJobsAppliedForLms(
    job_seeker_id: string,
    queryOptions: {
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      status?: string;
    },
  ) {
    const {
      search,
      sortBy = 'applied_at',
      sortOrder = 'desc',
      status,
    } = queryOptions;

    const jobSeeker = await this.prisma.job_seekers.findUnique({
      where: { job_seeker_id },
    });

    if (!jobSeeker) {
      throw new NotFoundException(
        `Job Seeker with ID ${job_seeker_id} not found.`,
      );
    }

    const where: any = {
      job_seeker_id: job_seeker_id,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { job: { title: { contains: search, mode: 'insensitive' } } },
        {
          job: {
            company: {
              company_detail: {
                market_name: { contains: search, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    const applications = await this.prisma.applications.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        job: {
          select: {
            job_id: true,
            title: true,
            location: true,
            company: {
              select: {
                company_detail: {
                  select: {
                    market_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      message: 'Successfully retrieved all applied jobs history for LMS.',
      data: applications.map((app) => ({
        application_id: app.application_id,
        applied_at: app.applied_at,
        status: app.status,
        job_details: {
          job_id: app.job.job_id,
          title: app.job.title,
          company_name: app.job.company.company_detail.market_name,
          location: app.job.location,
        },
      })),
    };
  }
}
