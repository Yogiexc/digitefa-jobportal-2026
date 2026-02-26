import { JobSeekersService } from './job_seekers.service';
export declare class JobSeekersController {
    private readonly jobSeekersService;
    constructor(jobSeekersService: JobSeekersService);
    findAllTalents(page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: {
            job_seeker_id: string;
            full_name: string;
            email: string;
            university_name: string;
        }[];
    }>;
    findAll(page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: {
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
        }[];
    }>;
    findOne(job_seeker_id: string): Promise<{
        status: string;
        message: string;
        data: {
            full_name: string;
            email: string;
            address: string;
            phone_number: string;
            date_of_birth: Date;
            personal_summary: string;
            profile_picture_url: string;
            education: any;
            skills: string[];
            projects: any[];
            experiences: any[];
            certifications: any[];
            languages: any[];
        };
    }>;
}
