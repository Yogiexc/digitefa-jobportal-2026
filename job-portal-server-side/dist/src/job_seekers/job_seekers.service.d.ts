import { CreateJobSeekerDto } from './dto/create-job_seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job_seeker.dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class JobSeekersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createJobSeekerDto: CreateJobSeekerDto): Promise<{
        status: string;
        message: string;
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
        };
    }>;
    findAllTalents(params: {
        page?: number;
        pageSize?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
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
    findAll(params: {
        page?: number;
        pageSize?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
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
    update(job_seeker_id: string, updateJobSeekerDto: UpdateJobSeekerDto): Promise<{
        status: string;
        message: string;
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
        };
    }>;
    remove(job_seeker_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
