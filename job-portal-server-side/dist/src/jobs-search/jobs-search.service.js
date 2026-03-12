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
exports.JobsSearchService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let JobsSearchService = class JobsSearchService {
    constructor(prisma, httpService) {
        this.prisma = prisma;
        this.httpService = httpService;
    }
    async findJobs(user, params) {
        const { page = 1, pageSize = 10, search, location, sortBy = 'most_recent', recommendationSort, minimumSalary, maximumSalary, } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        let { salaryType, employmentType, category, educationLevel, experienceLevel, } = params;
        salaryType = salaryType && [salaryType].flat().filter(Boolean);
        employmentType = employmentType && [employmentType].flat().filter(Boolean);
        category = category && [category].flat().filter(Boolean);
        educationLevel = educationLevel && [educationLevel].flat().filter(Boolean);
        experienceLevel =
            experienceLevel && [experienceLevel].flat().filter(Boolean);
        let jobSeeker;
        if (user && user.job_seeker_id) {
            jobSeeker = await this.prisma.job_seeker_details.findUnique({
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
                            lmsUserId: true,
                            saved_jobs: true,
                            applications: true,
                        },
                    },
                },
            });
        }
        try {
            const where = {
                status: 'active',
                expired_at: { gte: new Date() },
                deleted_at: null,
                ...(location && {
                    location: { contains: location },
                }),
                ...(employmentType && {
                    employment_type: { in: employmentType },
                }),
                ...(salaryType && {
                    salary_type: { in: salaryType },
                }),
                ...(minimumSalary && { minimum_salary: { gte: +minimumSalary } }),
                ...(maximumSalary && { maximum_salary: { lte: +maximumSalary } }),
                ...(category && {
                    category: {
                        in: category,
                    },
                }),
                ...(educationLevel && {
                    education_requirement: { in: educationLevel },
                }),
                ...(experienceLevel && {
                    experience_requirement: { in: experienceLevel },
                }),
                ...(sortBy === 'most_recent' && {
                    published_at: { lte: new Date() },
                }),
            };
            let totalData = await this.prisma.jobs.count({ where });
            let totalPages = Math.ceil(totalData / pageSize);
            const jobs = await this.prisma.jobs.findMany({
                where,
                ...(sortBy !== 'most_relevant' && !search && { skip }),
                ...(sortBy !== 'most_relevant' && !search && { take }),
                orderBy: {
                    ['published_at']: 'desc',
                },
                select: {
                    job_id: true,
                    title: true,
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
                    skills_requirement: {
                        select: {
                            skill: true,
                        },
                    },
                    location: true,
                    employment_type: true,
                    work_type: true,
                    category: true,
                    education_requirement: true,
                    salary_type: true,
                    minimum_salary: true,
                    maximum_salary: true,
                    experience_requirement: true,
                },
            });
            let sortedJobs = jobs;
            if (sortBy === 'most_relevant' || search) {
                const allJobs = await this.prisma.jobs.findMany({
                    where: {
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
                let dataLMS;
                if (jobSeeker.job_seeker.lmsUserId &&
                    recommendationSort.includes('lms')) {
                    try {
                        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${process.env.URL_API_LMS}/lms/students/${jobSeeker.job_seeker.lmsUserId}/completed-courses`, { timeout: 2000 }));
                        dataLMS = response.data.data;
                    }
                    catch (error) {
                        console.error('Error fetching LMS data:', error);
                    }
                }
                let recommendedJobs = [];
                if (jobSeeker) {
                    const skillsText = jobSeeker.skills?.map((skill) => skill.skill_name).join(', ') || '';
                    const expText = jobSeeker.experiences
                        ?.map((e) => `${e.experience_title} at ${e.company_name} - ${e.description}`)
                        .join('; ') || '';
                    const eduText = jobSeeker.education
                        ? `${jobSeeker.education.degree} in ${jobSeeker.education.major} at ${jobSeeker.education.university_name}`
                        : '';
                    let profileText = `Skills: ${skillsText}. Experience: ${expText}. Education: ${eduText}. Summary: ${jobSeeker.personal_summary || ''}`;
                    let jobsPayload = [];
                    if (sortBy === 'most_relevant') {
                        jobsPayload = allJobs.map((j) => ({
                            id: j.job_id,
                            job_text: `Title: ${j.title}. Description: ${j.description}. Location: ${j.location}. Work Type: ${j.work_type}. Skills Requirement: ${j.skills_requirement.map((s) => s.skill).join(', ')}`,
                        }));
                    }
                    else if (search) {
                        jobsPayload = allJobs.map((j) => ({
                            id: j.job_id,
                            job_text: `Title: ${j.title}. Description: ${j.description}. Location: ${j.location}`,
                        }));
                        profileText = search;
                    }
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
                                match_details: { skills_match: r.score },
                            }));
                        }
                    }
                    catch (error) {
                        console.error('Error hitting Python API:', error);
                    }
                }
                let filteredJobs = [];
                console.log('recommendedJobs', recommendedJobs);
                if (Array.isArray(recommendedJobs) && recommendedJobs.length > 0) {
                    filteredJobs = jobs
                        .filter((job) => recommendedJobs.some((item) => item.job_id === job.job_id))
                        .map((job) => {
                        const similarity_score = recommendedJobs.find((item) => item.job_id === job.job_id)
                            ?.similarity_score || 0;
                        return {
                            ...job,
                            similarity_score,
                        };
                    })
                        .sort((a, b) => b.similarity_score - a.similarity_score);
                }
                else {
                    filteredJobs = [];
                }
                totalData = filteredJobs.length;
                totalPages = Math.ceil(totalData / pageSize);
                sortedJobs = filteredJobs.slice(skip, skip + take);
            }
            const responseData = sortedJobs.map((job) => {
                let savedJob;
                if (jobSeeker) {
                    savedJob = jobSeeker.job_seeker.saved_jobs.find((savedJob) => savedJob.job_id === job.job_id);
                }
                let appliedJob;
                if (jobSeeker) {
                    appliedJob = jobSeeker.job_seeker.applications.find((appliedJob) => appliedJob.job_id === job.job_id);
                }
                return {
                    job_id: job.job_id,
                    similarity_score: job.similarity_score ?? undefined,
                    is_saved: savedJob ? true : false,
                    is_applied: appliedJob ? true : false,
                    application_status: appliedJob ? appliedJob.status : null,
                    applied_at: appliedJob ? appliedJob.applied_at : null,
                    title: job.title,
                    published_at: job.published_at,
                    expired_at: job.expired_at,
                    employment_type: job.employment_type
                        .split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '),
                    work_type: job.work_type
                        .split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '),
                    category: job.category
                        .split('_')
                        .map((word) => word.toLowerCase() === 'and'
                        ? word
                        : word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '),
                    education_requirement: job.education_requirement,
                    salary_type: job.salary_type
                        .split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '),
                    minimum_salary: Number(job.minimum_salary),
                    maximum_salary: Number(job.maximum_salary),
                    experience_requirement: job.experience_requirement,
                    location: job.location,
                    company: {
                        company_id: job.company.company_id,
                        logo_url: job.company.company_detail.logo_url,
                        legal_name: job.company.company_detail.legal_name,
                        market_name: job.company.company_detail.market_name,
                        city: job.company.company_detail.city,
                        country: job.company.company_detail.country,
                    },
                };
            });
            return {
                status: 'success',
                message: 'Jobs retrieved successfully',
                totalData,
                totalPages,
                currentPage: page,
                size: pageSize,
                data: responseData,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_2.InternalServerErrorException('Failed to retrieve jobs');
        }
    }
    async getDetailJob(user, job_id) {
        let jobSeeker;
        if (user && user.job_seeker_id) {
            jobSeeker = await this.prisma.job_seeker_details.findUnique({
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
        }
        const getJob = await this.prisma.jobs.findUnique({
            where: {
                job_id,
            },
        });
        if (!getJob) {
            throw new common_1.NotFoundException(`Job with id ${job_id} not found`);
        }
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
        console.log('job', job);
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
                        match_details: { skills_match: r.score },
                    }));
                }
            }
            catch (error) {
                console.error('Error hitting Python API:', error);
            }
        }
        try {
            const job = await this.prisma.jobs.findUnique({
                where: {
                    job_id,
                },
                select: {
                    job_id: true,
                    title: true,
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
                                    province: true,
                                    country: true,
                                    description: true,
                                    category: true,
                                },
                            },
                        },
                    },
                    location: true,
                    employment_type: true,
                    work_type: true,
                    category: true,
                    education_requirement: true,
                    salary_type: true,
                    minimum_salary: true,
                    maximum_salary: true,
                    experience_requirement: true,
                    description: true,
                    skills_requirement: true,
                    benefits: true,
                },
            });
            let savedJob;
            if (jobSeeker) {
                savedJob = jobSeeker.job_seeker.saved_jobs.find((savedJob) => savedJob.job_id === job.job_id);
            }
            let appliedJob;
            if (jobSeeker) {
                appliedJob = jobSeeker.job_seeker.applications.find((appliedJob) => appliedJob.job_id === job.job_id);
            }
            const responseData = {
                job_id: job.job_id,
                is_saved: savedJob ? true : false,
                is_applied: appliedJob ? true : false,
                application_status: appliedJob ? appliedJob.status : null,
                title: job.title,
                published_at: job.published_at,
                expired_at: job.expired_at,
                employment_type: job.employment_type
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                work_type: job.work_type
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                category: job.category
                    .split('_')
                    .map((word) => word.toLowerCase() === 'and'
                    ? word
                    : word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                education_requirement: job.education_requirement,
                salary_type: job.salary_type
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                minimum_salary: Number(job.minimum_salary),
                maximum_salary: Number(job.maximum_salary),
                experience_requirement: job.experience_requirement,
                location: job.location,
                description: job.description,
                skills_requirement: job.skills_requirement.map((skill) => skill.skill),
                benefits: job.benefits.map((benefit) => benefit.benefit),
                company: {
                    company_id: job.company.company_id,
                    logo_url: job.company.company_detail.logo_url,
                    legal_name: job.company.company_detail.legal_name,
                    market_name: job.company.company_detail.market_name,
                    city: job.company.company_detail.city,
                    province: job.company.company_detail.province,
                    country: job.company.company_detail.country,
                    description: job.company.company_detail.description,
                },
                recommendation: {
                    matched_job: recommendedJobs.some((item) => item.job_id === job.job_id),
                    matched_section: (() => {
                        const matchedJob = recommendedJobs.find((item) => item.job_id === job.job_id);
                        if (!matchedJob || !matchedJob.match_details)
                            return null;
                        const matchDetails = matchedJob.match_details;
                        const topMatch = Object.entries(matchDetails).reduce((max, [key, value]) => value > max.value ? { key, value } : max, { key: null, value: -Infinity }).key;
                        const labelMap = {
                            personal_summary_match: 'Personal Summary',
                            projects_match: 'Projects',
                            certifications_match: 'Certifications',
                            education_match: 'Education',
                            skills_match: 'Skills',
                            experience_match: 'Experience',
                        };
                        return topMatch ? labelMap[topMatch] || null : null;
                    })(),
                    match_description: (() => {
                        const matchedJob = recommendedJobs.find((item) => item.job_id === job.job_id);
                        if (!matchedJob || !matchedJob.match_details)
                            return null;
                        const matchDetails = matchedJob.match_details;
                        const topMatch = Object.entries(matchDetails).reduce((max, [key, value]) => value > max.value ? { key, value } : max, { key: null, value: -Infinity }).key;
                        switch (topMatch) {
                            case 'personal_summary_match':
                                return 'This opportunity strongly reflects the direction and aspirations expressed in your personal summary, making it a promising match for your professional goals and values.';
                            case 'projects_match':
                                return 'This role aligns closely with the types of work and initiatives you’ve showcased in your projects, suggesting a natural fit for your experience in hands-on, practical applications.';
                            case 'certifications_match':
                                return 'Based on the certifications listed in your profile, this position appears to be well-suited to your verified training and specialized knowledge, offering you a chance to apply them meaningfully.';
                            case 'education_match':
                                return 'The academic background you’ve built provides a solid foundation for this job, making the educational requirements of the position well-aligned with your qualifications.';
                            case 'skills_match':
                                return 'Your listed skill set matches the key competencies needed for this role, indicating that you are well-prepared to contribute effectively from day one.';
                            case 'experience_match':
                                return 'Your past work experience demonstrates a strong alignment with the responsibilities and expectations of this position, positioning you as a capable and experienced candidate.';
                            default:
                                return null;
                        }
                    })(),
                },
            };
            return {
                status: 'success',
                message: 'Job retrieved successfully',
                data: responseData,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_2.InternalServerErrorException('Failed to retrieve job');
        }
    }
    async getDetailCompany(user, company_id) {
        const getCompany = await this.prisma.company_details.findUnique({
            where: {
                company_id,
            },
        });
        if (!getCompany) {
            throw new common_1.NotFoundException(`Company with id ${company_id} not found`);
        }
        try {
            const company = await this.prisma.company_details.findUnique({
                where: {
                    company_id,
                },
                select: {
                    company_id: true,
                    logo_url: true,
                    legal_name: true,
                    market_name: true,
                    category: true,
                    company_size: true,
                    description: true,
                    city: true,
                    province: true,
                    country: true,
                    district: true,
                    full_address: true,
                    postal_code: true,
                    website: true,
                    facebook_url: true,
                    twitter_url: true,
                    instagram_url: true,
                    youtube_url: true,
                    company: {
                        select: {
                            jobs: {
                                where: {
                                    status: 'active',
                                    expired_at: { gte: new Date() },
                                    deleted_at: null,
                                },
                                select: {
                                    job_id: true,
                                    title: true,
                                    published_at: true,
                                    expired_at: true,
                                    location: true,
                                    employment_type: true,
                                    work_type: true,
                                    category: true,
                                    education_requirement: true,
                                    salary_type: true,
                                    minimum_salary: true,
                                    maximum_salary: true,
                                    experience_requirement: true,
                                },
                            },
                        },
                    },
                },
            });
            const responseData = {
                company_id: company.company_id,
                logo_url: company.logo_url,
                legal_name: company.legal_name,
                market_name: company.market_name,
                category: company.category,
                company_size: company.company_size,
                description: company.description,
                city: company.city,
                province: company.province,
                country: company.country,
                district: company.district,
                full_address: company.full_address,
                postal_code: company.postal_code,
                website: company.website,
                facebook_url: company.facebook_url,
                twitter_url: company.twitter_url,
                instagram_url: company.instagram_url,
                youtube_url: company.youtube_url,
                jobs: company.company.jobs.map((job) => ({
                    job_id: job.job_id,
                    title: job.title,
                    published_at: job.published_at,
                    expired_at: job.expired_at,
                    location: job.location,
                    employment_type: job.employment_type
                        .split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '),
                    work_type: job.work_type
                        .split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '),
                    category: job.category
                        .split('_')
                        .map((word) => word.toLowerCase() === 'and'
                        ? word
                        : word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '),
                    education_requirement: job.education_requirement,
                    salary_type: job.salary_type
                        .split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' '),
                    minimum_salary: Number(job.minimum_salary),
                    maximum_salary: Number(job.maximum_salary),
                    experience_requirement: job.experience_requirement,
                })),
            };
            return {
                status: 'success',
                message: 'Company retrieved successfully',
                data: responseData,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_2.InternalServerErrorException('Failed to retrieve company');
        }
    }
};
exports.JobsSearchService = JobsSearchService;
exports.JobsSearchService = JobsSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        axios_1.HttpService])
], JobsSearchService);
//# sourceMappingURL=jobs-search.service.js.map