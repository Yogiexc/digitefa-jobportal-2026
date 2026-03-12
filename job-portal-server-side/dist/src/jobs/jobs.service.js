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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const lodash_1 = require("lodash");
const ExcelJS = require("exceljs");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let JobsService = class JobsService {
    constructor(prisma, httpService) {
        this.prisma = prisma;
        this.httpService = httpService;
        this.lmsApiBaseUrl = 'http://localhost:8000/api';
        this.pythonApiBaseUrl = 'http://localhost:9090';
    }
    async createJob(createJobDto, user) {
        const { benefits, skills_category, skills_requirement, hide_salary, ...data } = createJobDto;
        const findSkillCategory = await this.prisma.skills_category.findUnique({
            where: {
                category_name: skills_category,
            },
        });
        if (!findSkillCategory) {
            throw new common_1.NotFoundException('Skills category not found');
        }
        try {
            if (data.status == 'active') {
                data.published_at = new Date();
                data.expired_at = new Date(new Date().setDate(new Date().getDate() + 30));
            }
            if (hide_salary === 'true') {
                data.minimum_salary = null;
                data.maximum_salary = null;
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
            if (benefits) {
                const benefitsData = benefits.map((benefit) => ({
                    benefit: benefit,
                    job_id: savedJob.job_id,
                }));
                await this.prisma.job_benefits.createMany({
                    data: benefitsData,
                });
            }
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
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to create job');
        }
    }
    async findAll(user, params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc', status = 'active', } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = {
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
            const jobsWithApplicants = await Promise.all(jobs.map(async (job) => {
                const totalApplicants = await this.prisma.applications.count({
                    where: {
                        job_id: job.job_id,
                        job: {
                            company_id: user.company_id,
                            deleted_at: null,
                        },
                    },
                });
                return {
                    ...job,
                    status: job.expired_at != null && job.expired_at < new Date()
                        ? 'expired'
                        : job.status,
                    total_applicants: totalApplicants,
                };
            }));
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
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve job vacancies');
        }
    }
    async findAllJobCompany(user, company_id, params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc', status = 'active', } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = {
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
            const totalData = await this.prisma.jobs.count({ where });
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
            const jobsWithApplicants = await Promise.all(jobs.map(async (job) => {
                const totalApplicants = await this.prisma.applications.count({
                    where: {
                        job_id: job.job_id,
                        job: {
                            company_id: user.company_id,
                            deleted_at: null,
                        },
                    },
                });
                return {
                    ...job,
                    status: job.expired_at != null && job.expired_at < new Date()
                        ? 'expired'
                        : job.status,
                    total_applicants: totalApplicants,
                };
            }));
            return {
                status: 'success',
                message: 'Jobs retrieved successfully',
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: jobsWithApplicants,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve job vacancies');
        }
    }
    async findOne(job_id) {
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
            throw new common_1.NotFoundException(`Jobs with ID ${job_id} not found`);
        }
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
                .map((word) => word.toLowerCase() === 'and'
                ? word
                : word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
            minimum_salary: Number(jobs.minimum_salary),
            maximum_salary: Number(jobs.maximum_salary),
            status: jobs.expired_at != null && jobs.expired_at < new Date()
                ? 'expired'
                : jobs.status,
        };
        try {
            return {
                status: 'success',
                data: responseData,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve jobs');
        }
    }
    async update(job_id, updateJobDto, user) {
        const { benefits, skills_category, skills_requirement, hide_salary, ...data } = updateJobDto;
        const findSkillCategory = await this.prisma.skills_category.findUnique({
            where: {
                category_name: skills_category,
            },
        });
        if (!findSkillCategory) {
            throw new common_1.NotFoundException('Skills category not found');
        }
        try {
            const job = await this.prisma.jobs.findUnique({
                where: {
                    job_id,
                    deleted_at: null,
                },
            });
            if (!job) {
                throw new common_1.NotFoundException(`Job with ID ${job_id} not found`);
            }
            if (job.company_id !== user.company_id) {
                throw new common_1.NotFoundException(`Job with ID ${job_id} not found`);
            }
            if (hide_salary === 'true') {
                data.minimum_salary = null;
                data.maximum_salary = null;
            }
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
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to update job');
        }
    }
    async reupload(job_id, user) {
        try {
            const job = await this.prisma.jobs.findUnique({
                where: {
                    job_id,
                    company_id: user.company_id,
                    deleted_at: null,
                },
            });
            if (!job) {
                throw new common_1.NotFoundException(`Job with ID ${job_id} not found`);
            }
            const updatedJob = await this.prisma.jobs.update({
                where: { job_id },
                data: {
                    status: 'active',
                    published_at: new Date(),
                    expired_at: new Date(new Date().setDate(new Date().getDate() + 30)),
                },
            });
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
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to reupload job');
        }
    }
    async deleteJob(job_id, user) {
        try {
            const job = await this.prisma.jobs.findUnique({
                where: {
                    job_id,
                    company_id: user.company_id,
                    deleted_at: null,
                },
            });
            if (!job) {
                throw new common_1.NotFoundException(`Job with ID ${job_id} not found`);
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
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to delete job');
        }
    }
    async saveJobs(job_id, user) {
        try {
            const job = await this.prisma.jobs.findUnique({
                where: {
                    job_id,
                    deleted_at: null,
                },
            });
            if (!job) {
                throw new common_1.NotFoundException(`Job with ID ${job_id} not found`);
            }
            const savedJob = await this.prisma.saved_jobs.findFirst({
                where: {
                    job_id,
                    job_seeker_id: user.job_seeker_id,
                },
            });
            if (savedJob) {
                throw new common_1.InternalServerErrorException('Job already saved');
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
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to save job');
        }
    }
    async unsaveJobs(job_id, user) {
        try {
            const job = await this.prisma.jobs.findUnique({
                where: {
                    job_id,
                    deleted_at: null,
                },
            });
            if (!job) {
                throw new common_1.NotFoundException(`Job with ID ${job_id} not found`);
            }
            const savedJob = await this.prisma.saved_jobs.findFirst({
                where: {
                    job_id,
                    job_seeker_id: user.job_seeker_id,
                },
            });
            if (!savedJob) {
                throw new common_1.InternalServerErrorException('Job not saved');
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
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to unsave job');
        }
    }
    async findAllJobsSaved(user, params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc', } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = {
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
            const totalData = await this.prisma.saved_jobs.count({ where });
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
                        .map((word) => word.toLowerCase() === 'and'
                        ? word
                        : word.charAt(0).toUpperCase() + word.slice(1))
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
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve saved jobs');
        }
    }
    async findApplicants(job_id, user, params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc', status = 'all', location, startDate, endDate, startSalary, endSalary, startExperience, endExperience, } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        let jobDescription = '';
        try {
            const jobDetailsResponse = await this.findOne(job_id);
            if (jobDetailsResponse &&
                jobDetailsResponse.data &&
                jobDetailsResponse.data.description) {
                jobDescription = jobDetailsResponse.data.description;
            }
            else {
                console.warn(`Job description not found for job_id: ${job_id}. Suitability scores might be 0 or inaccurate.`);
            }
        }
        catch (error) {
            console.warn(`Could not fetch job details for job_id ${job_id}: ${error.message}. Suitability scores might be 0 or inaccurate.`);
        }
        const job = await this.prisma.jobs.findUnique({
            where: {
                job_id,
                deleted_at: null,
            },
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job with ID ${job_id} not found`);
        }
        try {
            if (job.company_id !== user.company_id) {
                throw new common_1.NotFoundException(`Job with ID ${job_id} not found`);
            }
            const where = {
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
            if (!jobDescription &&
                applicantsFromDb.length > 0 &&
                applicantsFromDb[0].job?.description) {
                jobDescription = applicantsFromDb[0].job.description;
            }
            const applicantsWithCoursesAndSuitability = await Promise.all(applicantsFromDb.map(async (applicant) => {
                let completed_courses = [];
                if (applicant.job_seeker.lmsUserId) {
                    try {
                        const lmsCoursesUrl = `${this.lmsApiBaseUrl}/lms/students/${applicant.job_seeker.lmsUserId}/completed-courses`;
                        const lmsResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(lmsCoursesUrl));
                        if (lmsResponse.data &&
                            lmsResponse.data.success &&
                            Array.isArray(lmsResponse.data.data)) {
                            completed_courses = lmsResponse.data.data.map((course) => ({
                                title: course.title,
                                description: course.description,
                            }));
                        }
                        else {
                            console.warn(`Gagal mengambil atau mem-parse completed courses untuk LMS User ID ${applicant.job_seeker.lmsUserId}: `, lmsResponse.data?.message || 'Respons tidak terduga dari LMS');
                        }
                    }
                    catch (error) {
                        console.error(`Error mengambil completed courses untuk LMS User ID ${applicant.job_seeker.lmsUserId}:`, error.response?.data || error.message || error);
                    }
                }
                let suitability_score = 0.0;
                if (jobDescription && completed_courses.length > 0) {
                    const coursesForSuitability = completed_courses.filter((c) => c.description && c.description.trim() !== '');
                    if (coursesForSuitability.length > 0) {
                        try {
                            const payload = {
                                job_description: jobDescription,
                                completed_courses: coursesForSuitability.map((c) => ({
                                    title: c.title,
                                    description: c.description,
                                })),
                            };
                            const suitabilityResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.pythonApiBaseUrl}/calculate-candidate-suitability`, payload, { timeout: 15000 }));
                            if (suitabilityResponse.data &&
                                typeof suitabilityResponse.data.suitability_score === 'number') {
                                suitability_score =
                                    suitabilityResponse.data.suitability_score;
                            }
                            else {
                                console.warn(`Invalid suitability score response for applicant ${applicant.job_seeker.job_seeker_id}:`, suitabilityResponse.data);
                            }
                        }
                        catch (pyError) {
                            console.error(`Error calculating suitability for applicant ${applicant.job_seeker.job_seeker_id} (LMS User ID ${applicant.job_seeker.lmsUserId}):`, pyError.response?.data || pyError.message || pyError);
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
            }));
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
                    profile_picture_url: app.job_seeker.job_seeker_detail?.profile_picture_url || null,
                    address: app.job_seeker.job_seeker_detail?.personal_info?.address || null,
                    major: app.job_seeker.job_seeker_detail?.education?.major || null,
                    completed_courses: app.job_seeker.completed_courses,
                    suitability_score: app.job_seeker.suitability_score,
                },
                job: {
                    experience_requirement: app.job.experience_requirement,
                },
                match_scores: app.match_scores ? app.match_scores : null,
            }));
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
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve applicants');
        }
    }
    async getJobSeekerByApplicationId(user, application_id) {
        const application = await this.prisma.applications.findUnique({
            where: { application_id },
            select: {
                job_seeker_id: true,
                job_id: true,
            },
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application with ID ${application_id} not found`);
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
            const job = await this.prisma.jobs.findUnique({
                where: { job_id: application.job_id },
                select: { description: true },
            });
            let completed_courses = [];
            let suitability_score = 0.0;
            if (jobSeeker.job_seeker.lmsUserId) {
                try {
                    const lmsCoursesUrl = `${this.lmsApiBaseUrl}/lms/students/${jobSeeker.job_seeker.lmsUserId}/completed-courses`;
                    const lmsResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.get(lmsCoursesUrl));
                    completed_courses = lmsResponse.data?.data || [];
                    if (job?.description && completed_courses.length > 0) {
                        try {
                            const payload = {
                                job_description: job.description,
                                completed_courses: completed_courses.map((course) => ({
                                    title: course.title,
                                    description: course.description,
                                })),
                            };
                            const suitabilityResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${this.pythonApiBaseUrl}/calculate-candidate-suitability`, payload));
                            suitability_score =
                                suitabilityResponse.data?.suitability_score || 0.0;
                        }
                        catch (suitabilityError) {
                            console.warn(`Failed to calculate suitability score for job seeker ${jobSeeker.job_seeker.job_seeker_id}:`, suitabilityError.message);
                            suitability_score = 0.0;
                        }
                    }
                }
                catch (lmsError) {
                    console.warn(`Failed to fetch LMS data for user ${jobSeeker.job_seeker.lmsUserId}:`, lmsError.message);
                    completed_courses = [];
                    suitability_score = 0.0;
                }
            }
            if (jobSeeker.job_seeker) {
                jobSeeker.job_seeker = (0, lodash_1.omit)(jobSeeker.job_seeker, [
                    'password',
                    'otpExpires',
                    'otp',
                    'created_at',
                    'updated_at',
                ]);
            }
            if (jobSeeker.personal_info) {
                jobSeeker.personal_info = (0, lodash_1.omit)(jobSeeker.personal_info, [
                    'created_at',
                    'updated_at',
                ]);
            }
            if (jobSeeker.education) {
                jobSeeker.education = (0, lodash_1.omit)(jobSeeker.education, [
                    'created_at',
                    'updated_at',
                ]);
            }
            if (jobSeeker.experiences) {
                jobSeeker.experiences = jobSeeker.experiences.map((exp) => (0, lodash_1.omit)(exp, ['created_at', 'updated_at']));
            }
            if (jobSeeker.skills) {
                jobSeeker.skills = jobSeeker.skills.map((skill) => (0, lodash_1.omit)(skill, ['created_at', 'updated_at']));
            }
            if (jobSeeker.projects) {
                jobSeeker.projects = jobSeeker.projects.map((project) => (0, lodash_1.omit)(project, ['created_at', 'updated_at']));
            }
            if (jobSeeker.languages) {
                jobSeeker.languages = jobSeeker.languages.map((lang) => (0, lodash_1.omit)(lang, ['created_at', 'updated_at']));
            }
            if (jobSeeker.certifications) {
                jobSeeker.certifications = jobSeeker.certifications.map((cert) => (0, lodash_1.omit)(cert, ['created_at', 'updated_at']));
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve job seeker');
        }
    }
    async getResumeApplicants(user, application_id) {
        const application = await this.prisma.applications.findUnique({
            where: { application_id },
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application with ID ${application_id} not found`);
        }
        try {
            return {
                status: 'success',
                message: 'Resume applicant retrieved successfully',
                data: application.resume_url,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve resume applicant');
        }
    }
    async changeStatusApplicant(user, application_id, changeStatusApplicationsDto) {
        const { status } = changeStatusApplicationsDto;
        const application = await this.prisma.applications.findUnique({
            where: { application_id },
            include: {
                job: {
                    include: {
                        company: true,
                    },
                },
            },
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application with ID ${application_id} not found`);
        }
        if (application.job.company_id !== user.company_id) {
            throw new common_1.NotFoundException(`Application with ID ${application_id} not found`);
        }
        try {
            await this.prisma.applications.update({
                where: { application_id },
                data: {
                    status,
                },
            });
            return {
                status: 'success',
                message: 'Application status updated successfully',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to update application status');
        }
    }
    async generateCSVOrXLSX(job_id, user, start, end, format = 'xlsx', res) {
        const job = await this.prisma.jobs.findUnique({
            where: {
                job_id,
                deleted_at: null,
            },
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job with ID ${job_id} not found`);
        }
        try {
            if (job.company_id !== user.company_id) {
                throw new common_1.NotFoundException(`Job with ID ${job_id} not found`);
            }
            if (!start && !end) {
                start = null;
                end = null;
            }
            else {
                if (!start)
                    start = 1;
                if (!end)
                    end = 10;
            }
            const validStart = start ? Math.max(start - 1, 0) : null;
            const validEnd = end ? (end > validStart ? end : validStart) : null;
            const take = validStart !== null && validEnd !== null ? validEnd - validStart : null;
            const applicants = await this.prisma.applications.findMany({
                where: {
                    job_id: job_id,
                },
                orderBy: {
                    ['applied_at']: 'desc',
                },
                ...(validStart !== null ? { skip: validStart } : {}),
                ...(take !== null ? { take: take } : {}),
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
            const responseData = applicants.map((applicant) => ({
                application_id: applicant.application_id,
                status: applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1),
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
                res.setHeader('Content-Disposition', 'attachment; filename="applicants.csv"');
                await workbook.csv.write(res);
            }
            else if (format === 'xlsx') {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename="applicants.xlsx"');
                await workbook.xlsx.write(res);
            }
            return res.end();
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to export applicants');
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
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        axios_1.HttpService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map