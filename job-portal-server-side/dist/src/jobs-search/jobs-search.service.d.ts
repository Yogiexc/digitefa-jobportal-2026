import { PrismaService } from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
export declare class JobsSearchService {
    private prisma;
    private httpService;
    constructor(prisma: PrismaService, httpService: HttpService);
    findJobs(user: any, params: {
        page?: number;
        pageSize?: number;
        search?: string;
        location?: string;
        sortBy?: 'most_relevant' | 'most_recent';
        recommendationSort?: string[];
        employmentType?: string[];
        salaryType?: string[];
        minimumSalary?: number;
        maximumSalary?: number;
        category?: string[];
        educationLevel?: string[];
        experienceLevel?: string[];
    }): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: {
            job_id: string;
            similarity_score: any;
            is_saved: boolean;
            is_applied: boolean;
            application_status: any;
            applied_at: any;
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
    getDetailJob(user: any, job_id: string): Promise<{
        status: string;
        message: string;
        data: {
            job_id: string;
            is_saved: boolean;
            is_applied: boolean;
            application_status: any;
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
            description: string;
            skills_requirement: string[];
            benefits: string[];
            company: {
                company_id: string;
                logo_url: string;
                legal_name: string;
                market_name: string;
                city: string;
                province: string;
                country: string;
                description: string;
            };
            recommendation: {
                matched_job: boolean;
                matched_section: string;
                match_description: string;
            };
        };
    }>;
    getDetailCompany(user: any, company_id: string): Promise<{
        status: string;
        message: string;
        data: {
            company_id: string;
            logo_url: string;
            legal_name: string;
            market_name: string;
            category: string;
            company_size: string;
            description: string;
            city: string;
            province: string;
            country: string;
            district: string;
            full_address: string;
            postal_code: string;
            website: string;
            facebook_url: string;
            twitter_url: string;
            instagram_url: string;
            youtube_url: string;
            jobs: {
                job_id: string;
                title: string;
                published_at: Date;
                expired_at: Date;
                location: string;
                employment_type: string;
                work_type: string;
                category: string;
                education_requirement: string;
                salary_type: string;
                minimum_salary: number;
                maximum_salary: number;
                experience_requirement: string;
            }[];
        };
    }>;
}
