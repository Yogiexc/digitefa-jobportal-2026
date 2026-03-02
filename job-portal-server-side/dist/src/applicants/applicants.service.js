"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const fs_1 = require("fs");
const ExcelJS = require("exceljs");
let ApplicantsService = class ApplicantsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async applyJob(user, job_id, applyJobDto, resume) {
        if (!resume) {
            throw new common_1.BadRequestException('Resume file is required');
        }
        const { expected_salary, experience_years } = applyJobDto;
        const existingJob = await this.prisma.jobs.findUnique({
            where: { job_id },
        });
        if (!existingJob) {
            await fs_1.promises.unlink(resume?.path);
            throw new common_1.NotFoundException(`Job with ID ${job_id} not found`);
        }
        const existingJobSeeker = await this.prisma.job_seekers.findUnique({
            where: { job_seeker_id: user.job_seeker_id },
        });
        if (!existingJobSeeker) {
            await fs_1.promises.unlink(resume?.path);
            throw new common_1.NotFoundException('Job Seeker not found');
        }
        const applicant = await this.prisma.applications.findFirst({
            where: {
                job_id,
                job_seeker_id: user.job_seeker_id,
            },
        });
        if (applicant) {
            await fs_1.promises.unlink(resume.path);
            throw new common_1.BadRequestException('Job is already applied. Please wait for the result.');
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
            const skillsText = jobSeeker.skills?.map((skill) => skill.skill_name).join(', ') || '';
            const expText = jobSeeker.experiences
                ?.map((e) => `${e.experience_title} at ${e.company_name} - ${e.description}`)
                .join('; ') || '';
            const eduText = jobSeeker.education
                ? `${jobSeeker.education.degree} in ${jobSeeker.education.major} at ${jobSeeker.education.university_name}`
                : '';
            const profileText = `Skills: ${skillsText}. Experience: ${expText}. Education: ${eduText}. Summary: ${jobSeeker.personal_summary || ''}`;
            const jobsPayload = [
                {
                    id: job.job_id,
                    job_text: `Title: ${job.title}. Description: ${job.description}. Skills Requirement: ${job.skills_requirement.map((s) => s.skill).join(', ')}`,
                },
            ];
            try {
                const gpythonUrl = process.env.URL_SERVER_PYTHON;
                const res = await fetch(`${gpythonUrl}/recommend-jobs`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        talent_profile_text: profileText,
                        jobs: jobsPayload,
                    }),
                });
                if (res.ok) {
                    const parsed = await res.json();
                    recommendedJobs = parsed.results.map((r) => ({
                        job_id: r.job_id,
                        similarity_score: r.score,
                        match_details: {
                            personal_summary_match: r.score,
                            skills_match: r.score,
                            education_match: r.score,
                            experience_match: r.score,
                            certifications_match: null,
                            projects_match: null,
                        },
                    }));
                }
            }
            catch (error) {
                console.error('Error hitting Python API:', error);
            }
        }
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
                const application = await tx.applications.create({
                    data: {
                        job_id,
                        job_seeker_id: user.job_seeker_id,
                        resume_url: resume.path,
                        expected_salary: expected_salary,
                        experience_years: experience_years,
                    },
                });
                const matchScores = recommendedJobs[0].match_details;
                await tx.match_scores.create({
                    data: {
                        application_id: application.application_id,
                        overall: Number((recommendedJobs[0].similarity_score * 100).toFixed(2)),
                        summary: matchScores.personal_summary_match ?? null,
                        skills: matchScores.skills_match ?? null,
                        education: matchScores.education_match ?? null,
                        experience: matchScores.experience_match ?? null,
                        certifications: matchScores.certifications_match ?? null,
                        projects: matchScores.projects_match ?? null,
                    },
                });
                return application;
            });
            return {
                status: 'success',
                message: 'Job applied successfully.',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to apply jobs');
        }
    }
    async findAllJobsApplied(user, params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc', status, } = params;
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
            const where = {
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
            const totalData = await this.prisma.applications.count({ where });
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
            const responseData = appliedJobs.map((appliedJob) => {
                let savedJob;
                if (jobSeeker) {
                    savedJob = jobSeeker.job_seeker.saved_jobs.find((savedJob) => savedJob.job_id === appliedJob.job_id);
                }
                let applied;
                if (jobSeeker) {
                    applied = jobSeeker.job_seeker.applications.find((appliedJob) => appliedJob.job_id === appliedJob.job_id);
                }
                return {
                    application_id: appliedJob.application_id,
                    is_saved: savedJob ? true : false,
                    is_applied: applied ? true : false,
                    status: appliedJob.status.charAt(0).toUpperCase() +
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
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve applied jobs');
        }
    }
    async detailJobsApplied(user, application_id) {
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
            throw new common_1.NotFoundException('Job application not found');
        }
        return {
            status: 'success',
            message: 'Job application retrieved successfully',
            data: {
                application_id: application.application_id,
                status: application.status.charAt(0).toUpperCase() +
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
    async findAllJobsAppliedHistory(job_seeker_id, params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc', status, } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        const jobSeeker = await this.prisma.job_seekers.findUnique({
            where: {
                job_seeker_id,
            },
        });
        if (!jobSeeker) {
            throw new common_1.NotFoundException('Job Seeker not found');
        }
        try {
            const where = {
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
            const totalData = await this.prisma.applications.count({ where });
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
            const responseData = appliedJobs.map((appliedJob) => {
                return {
                    application_id: appliedJob.application_id,
                    status: appliedJob.status.charAt(0).toUpperCase() +
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
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve applied jobs');
        }
    }
    async exportAllJobsAppliedHistory(job_seeker_id, format = 'xlsx', res) {
        const jobSeeker = await this.prisma.job_seekers.findUnique({
            where: {
                job_seeker_id,
            },
        });
        if (!jobSeeker) {
            throw new common_1.NotFoundException('Job Seeker not found');
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
            const responseData = appliedJobs.map((appliedJob) => {
                return {
                    application_id: appliedJob.application_id,
                    status: appliedJob.status.charAt(0).toUpperCase() +
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
                res.setHeader('Content-Disposition', 'attachment; filename="applied-jobs.csv"');
                await workbook.csv.write(res);
            }
            else if (format === 'xlsx') {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename="applied-jobs.xlsx"');
                await workbook.xlsx.write(res);
            }
            await workbook.xlsx.write(res);
            return res.end();
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve applied jobs');
        }
    }
    async findAllJobsSavedForLms(job_seeker_id) {
        const jobSeeker = await this.prisma.job_seekers.findUnique({
            where: { job_seeker_id },
        });
        if (!jobSeeker) {
            throw new common_1.NotFoundException(`Job Seeker with ID ${job_seeker_id} not found.`);
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
        }
        catch (error) {
            console.error('Error in findAllJobsSavedForLms:', error);
            throw new common_1.InternalServerErrorException('Failed to retrieve saved jobs.');
        }
    }
    async findOneForLms(job_id) {
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
            throw new common_1.NotFoundException(`Job with ID ${job_id} not found or is not active.`);
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
                .map((word) => word.toLowerCase() === 'and'
                ? word
                : word.charAt(0).toUpperCase() + word.slice(1))
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
    async findAllJobsAppliedForLms(job_seeker_id, queryOptions) {
        const { search, sortBy = 'applied_at', sortOrder = 'desc', status, } = queryOptions;
        const jobSeeker = await this.prisma.job_seekers.findUnique({
            where: { job_seeker_id },
        });
        if (!jobSeeker) {
            throw new common_1.NotFoundException(`Job Seeker with ID ${job_seeker_id} not found.`);
        }
        const where = {
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
};
exports.ApplicantsService = ApplicantsService;
exports.ApplicantsService = ApplicantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicantsService);
//# sourceMappingURL=applicants.service.js.map