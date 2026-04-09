import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ChangeStatusApplicationsDto } from './dto/change-status-applications.dto';
import { InviteTalentDto } from './dto/invite-talent.dto';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    createJob(createJobDto: CreateJobDto, req: any): Promise<{
        status: string;
        message: string;
        data: {
            minimum_salary: number;
            maximum_salary: number;
            job_id: string;
            company_id: string;
            title: string;
            category: import(".prisma/client").$Enums.job_category;
            employment_type: string;
            work_type: import(".prisma/client").$Enums.work_type;
            description: string;
            location: string;
            salary_type: import(".prisma/client").$Enums.salary_type;
            skills_category_id: string;
            education_requirement: string | null;
            experience_requirement: string | null;
            status: import(".prisma/client").$Enums.job_status;
            published_at: Date | null;
            expired_at: Date | null;
            deleted_at: Date | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    findAll(req: any, page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', status?: string): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalActive: number;
        totalDraft: number;
        totalExpired: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: {
            status: string;
            total_applicants: number;
            title: string;
            job_id: string;
            published_at: Date;
            expired_at: Date;
        }[];
    }>;
    getCompanyInterviews(req: any, page?: string, limit?: string, search?: string): Promise<{
        status: string;
        data: any;
        meta: {
            total: any;
            page: number;
            last_page: number;
        };
    }>;
    findAllJobCompany(req: any, company_id: string, page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', status?: string): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: {
            status: string;
            total_applicants: number;
            title: string;
            job_id: string;
            published_at: Date;
            expired_at: Date;
        }[];
    }>;
    findOne(job_id: string): Promise<{
        status: string;
        data: {
            skills_category: string;
            employment_type: string;
            work_type: string;
            salary_type: string;
            category: string;
            minimum_salary: number;
            maximum_salary: number;
            status: string;
            skills_requirement: {
                skill: string;
            }[];
            benefits: {
                benefit: string;
            }[];
            job_id: string;
            company_id: string;
            title: string;
            description: string;
            location: string;
            skills_category_id: string;
            education_requirement: string | null;
            experience_requirement: string | null;
            published_at: Date | null;
            expired_at: Date | null;
            deleted_at: Date | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    update(job_id: string, updateJobDto: UpdateJobDto, req: any): Promise<{
        status: string;
        message: string;
        data: {
            minimum_salary: number;
            maximum_salary: number;
            job_id: string;
            company_id: string;
            title: string;
            category: import(".prisma/client").$Enums.job_category;
            employment_type: string;
            work_type: import(".prisma/client").$Enums.work_type;
            description: string;
            location: string;
            salary_type: import(".prisma/client").$Enums.salary_type;
            skills_category_id: string;
            education_requirement: string | null;
            experience_requirement: string | null;
            status: import(".prisma/client").$Enums.job_status;
            published_at: Date | null;
            expired_at: Date | null;
            deleted_at: Date | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    reupload(job_id: string, req: any): Promise<{
        status: string;
        message: string;
        data: {
            minimum_salary: number;
            maximum_salary: number;
            job_id: string;
            company_id: string;
            title: string;
            category: import(".prisma/client").$Enums.job_category;
            employment_type: string;
            work_type: import(".prisma/client").$Enums.work_type;
            description: string;
            location: string;
            salary_type: import(".prisma/client").$Enums.salary_type;
            skills_category_id: string;
            education_requirement: string | null;
            experience_requirement: string | null;
            status: import(".prisma/client").$Enums.job_status;
            published_at: Date | null;
            expired_at: Date | null;
            deleted_at: Date | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    deleteJob(job_id: string, req: any): Promise<{
        status: string;
        message: string;
    }>;
    saveJobs(job_id: string, req: any): Promise<{
        status: string;
        message: string;
    }>;
    unsaveJobs(job_id: string, req: any): Promise<{
        status: string;
        message: string;
    }>;
    findAllJobsSaved(req: any, page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: {
            job_id: string;
            title: string;
            published_at: Date;
            expired_at: Date;
            employment_type: string;
            work_type: string;
            category: string;
            education_requirement: string;
            salary_type: string;
            minimum_salary: number;
            maximum_salary: number;
            experience_requirement: string;
            location: string;
            company: {
                company_id: string;
                logo_url: string;
                legal_name: string;
                market_name: string;
                city: string;
                country: string;
            };
        }[];
    }>;
    getJobSeekerByApplicationId(req: any, application_id: string): Promise<{
        status: string;
        message: string;
        data?: undefined;
    } | {
        status: string;
        message: string;
        data: {
            jobSeeker: {
                personal_info: {
                    personal_info_id: string;
                    job_seeker_detail_id: string;
                    address: string | null;
                    phone_number: string | null;
                    date_of_birth: Date | null;
                    created_at: Date;
                    updated_at: Date;
                };
                education: {
                    education_id: string;
                    job_seeker_detail_id: string;
                    university_id: string | null;
                    university_name: string;
                    degree: string;
                    major: string;
                    start_date: Date;
                    end_date: Date | null;
                    grade: string | null;
                    created_at: Date;
                    updated_at: Date;
                };
                experiences: {
                    experience_id: string;
                    job_seeker_detail_id: string;
                    experience_title: string;
                    employment_type: string | null;
                    company_name: string;
                    location: string | null;
                    location_type: string | null;
                    description: string | null;
                    start_date: Date | null;
                    end_date: Date | null;
                    created_at: Date;
                    updated_at: Date;
                }[];
                languages: {
                    language_id: string;
                    language_name: string;
                    created_at: Date;
                    updated_at: Date;
                    job_seeker_detail_id: string | null;
                }[];
                skills: {
                    skill_id: string;
                    skill_name: string;
                    created_at: Date;
                    updated_at: Date;
                    job_seeker_detail_id: string | null;
                }[];
                projects: {
                    project_id: string;
                    job_seeker_detail_id: string;
                    project_name: string;
                    description: string | null;
                    start_date: Date | null;
                    end_date: Date | null;
                    created_at: Date;
                    updated_at: Date;
                }[];
                certifications: {
                    certification_id: string;
                    job_seeker_detail_id: string;
                    certification_name: string;
                    issuing_organization: string | null;
                    issue_date: Date | null;
                    expiration_date: Date | null;
                    credential_url: string | null;
                    created_at: Date;
                    updated_at: Date;
                }[];
                job_seeker: {
                    job_seeker_id: string;
                    email: string;
                    password: string;
                    full_name: string;
                    otp: string | null;
                    otpExpires: Date | null;
                    verified: import(".prisma/client").$Enums.verified;
                    created_at: Date;
                    updated_at: Date;
                    lmsUserId: string | null;
                    lmsLinkedAt: Date | null;
                };
            } & {
                job_seeker_detail_id: string;
                job_seeker_id: string;
                profile_picture_url: string | null;
                personal_summary: string | null;
                created_at: Date;
                updated_at: Date;
            };
            completed_courses: any[];
            suitability_score: number;
        };
    }>;
    findApplicants(req: any, job_id: string, page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', status?: string, location?: string, startDate?: string, endDate?: string, startSalary?: number, endSalary?: number, startExperience?: number, endExperience?: number): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalPending: number;
        totalWaitingInterview: number;
        totalAccepted: number;
        totalRejected: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: {
            application_id: string;
            status: string;
            expected_salary: number;
            experience_years: string;
            applied_at: Date;
            job_seeker: {
                job_seeker_id: string;
                full_name: string;
                lmsUserId: string;
                profile_picture_url: string;
                address: string;
                major: string;
                completed_courses: any[];
                suitability_score: number;
            };
            job: {
                experience_requirement: string;
            };
            match_scores: {
                match_score_id: string;
                application_id: string;
                overall: number | null;
                summary: number | null;
                skills: number | null;
                experience: number | null;
                education: number | null;
                projects: number | null;
                certifications: number | null;
                created_at: Date;
                updated_at: Date;
            };
        }[];
    }>;
    getResumeApplicants(req: any, application_id: string): Promise<{
        status: string;
        message: string;
        data: string;
    }>;
    changeStatusApplicant(req: any, application_id: string, changeStatusApplicationsDto: ChangeStatusApplicationsDto): Promise<{
        status: string;
        message: string;
    }>;
    inviteTalent(req: any, job_id: string, inviteTalentDto: InviteTalentDto): Promise<{
        status: string;
        message: string;
    }>;
    exportApplicants(req: any, job_id: string, format: 'csv' | 'xlsx', start: number, end: number, res: any): Promise<import("express").Response<any, Record<string, any>>>;
    findAllJobsSavedForLms(job_seeker_id: string): Promise<{
        status: string;
        message: string;
        data: {
            job_id: string;
            title: string;
            location: string;
            work_type: import(".prisma/client").$Enums.work_type;
            employment_type: string;
            company: {
                market_name: string;
                logo_url: string;
            };
            saved_at: Date;
        }[];
    }>;
    findOneForLms(job_id: string): Promise<{
        status: string;
        message: string;
        data: {
            skills_category: string;
            benefits: string[];
            skills_requirement: string[];
            company: {
                logo_url: string;
                market_name: string;
                country: string;
                city: string;
            };
            employment_type: string;
            work_type: string;
            salary_type: string;
            category: string;
            minimum_salary: number;
            maximum_salary: number;
            job_id: string;
            company_id: string;
            title: string;
            description: string;
            location: string;
            skills_category_id: string;
            education_requirement: string | null;
            experience_requirement: string | null;
            status: import(".prisma/client").$Enums.job_status;
            published_at: Date | null;
            expired_at: Date | null;
            deleted_at: Date | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
}
