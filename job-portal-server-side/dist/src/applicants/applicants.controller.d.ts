import { ApplicantsService } from './applicants.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { FindAllAppliedJobsForLmsDto } from './dto/find-all-applied-jobs-for-lms.dto';
export declare class ApplicantsController {
    private readonly applicantsService;
    constructor(applicantsService: ApplicantsService);
    applyJob(req: any, job_id: string, applyJobDto: ApplyJobDto, resume?: Express.Multer.File): Promise<{
        status: string;
        message: string;
    }>;
    findAllJobsApplied(req: any, page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', status?: string): Promise<{
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
    detailJobsApplied(req: any, application_id: string): Promise<{
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
    exportAllJobsAppliedHistory(job_seeker_id: string, format: 'csv' | 'xlsx', res: any): Promise<import("express").Response<any, Record<string, any>>>;
    findAllJobsAppliedHistory(job_seeker_id: string, page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', status?: string): Promise<{
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
    findAllJobsAppliedForLms(job_seeker_id: string, queryOptions: FindAllAppliedJobsForLmsDto): Promise<{
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
