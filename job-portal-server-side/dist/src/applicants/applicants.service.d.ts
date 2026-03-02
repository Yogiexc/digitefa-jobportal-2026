import { PrismaService } from 'prisma/prisma.service';
import { Response } from 'express';
export declare class ApplicantsService {
    private prisma;
    constructor(prisma: PrismaService);
    applyJob(user: any, job_id: string, applyJobDto: any, resume: Express.Multer.File): Promise<{
        status: string;
        message: string;
    }>;
    findAllJobsApplied(user: any, params: {
        page?: number;
        pageSize?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        status?: string;
    }): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: {
            application_id: string;
            is_saved: boolean;
            is_applied: boolean;
            status: string;
            applied_at: Date;
            job: {
                job_id: string;
                title: string;
                location: string;
                employment_type: string;
                salary_type: import(".prisma/client").$Enums.salary_type;
                minimum_salary: number;
                maximum_salary: number;
                published_at: Date;
            };
            company: {
                legal_name: string;
                market_name: string;
                logo_url: string;
                country: string;
                city: string;
            };
        }[];
    }>;
    detailJobsApplied(user: any, application_id: string): Promise<{
        status: string;
        message: string;
        data: {
            application_id: string;
            status: string;
            applied_at: Date;
            job: {
                job_id: string;
                title: string;
                location: string;
                employment_type: string;
                salary_type: import(".prisma/client").$Enums.salary_type;
                minimum_salary: number;
                maximum_salary: number;
                experience_requirement: string;
                published_at: Date;
            };
            company: {
                legal_name: string;
                market_name: string;
                logo_url: string;
                country: string;
                city: string;
            };
        };
    }>;
    findAllJobsAppliedHistory(job_seeker_id: string, params: {
        page?: number;
        pageSize?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        status?: string;
    }): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: {
            application_id: string;
            status: string;
            applied_at: Date;
            job: {
                job_id: string;
                title: string;
                location: string;
                employment_type: string;
                salary_type: import(".prisma/client").$Enums.salary_type;
                minimum_salary: number;
                maximum_salary: number;
                experience_requirement: string;
                published_at: Date;
            };
            company: {
                legal_name: string;
                market_name: string;
                logo_url: string;
                country: string;
                city: string;
            };
        }[];
    }>;
    exportAllJobsAppliedHistory(job_seeker_id: string, format: 'csv' | 'xlsx', res: Response): Promise<Response<any, Record<string, any>>>;
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
    findAllJobsAppliedForLms(job_seeker_id: string, queryOptions: {
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        status?: string;
    }): Promise<{
        message: string;
        data: {
            application_id: string;
            applied_at: Date;
            status: import(".prisma/client").$Enums.applicant_status;
            job_details: {
                job_id: string;
                title: string;
                company_name: string;
                location: string;
            };
        }[];
    }>;
}
