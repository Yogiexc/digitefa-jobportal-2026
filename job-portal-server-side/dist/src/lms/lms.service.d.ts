import { PrismaService } from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ValidateJobPortalAccountDto } from './dto/validate-job-portal-account.dto';
import { UnlinkJobPortalAccountDto } from './dto/unlink-job-portal-account.dto';
export declare class LmsService {
    private prisma;
    private httpService;
    constructor(prisma: PrismaService, httpService: HttpService);
    unlinkFromLmsCommand(dto: UnlinkJobPortalAccountDto): Promise<void>;
    validateAndLinkJobPortalAccount(dto: ValidateJobPortalAccountDto): Promise<{
        job_seeker_id: string;
    }>;
    validateLmsCredentials(email: string, password: string, jobSeekerId: string): Promise<any>;
    linkLmsAccount(jobSeekerId: string, lmsUserId: string): Promise<void>;
    unlinkLmsAccount(jobSeekerId: string): Promise<void>;
    getJobs(): Promise<{
        status: string;
        message: string;
        data: {
            job_id: string;
            company: {
                company_id: string;
                legal_name: string;
                market_name: string;
            };
            title: string;
            description: string;
            published_at: Date;
            expired_at: Date;
            status: import(".prisma/client").$Enums.job_status;
            location: string;
            employment_type: string;
            work_type: import(".prisma/client").$Enums.work_type;
            category: import(".prisma/client").$Enums.job_category;
            minimum_salary: number;
            maximum_salary: number;
            education_requirement: string;
            skills_requirement: string[];
            experience_requirement: string;
        }[];
    }>;
}
