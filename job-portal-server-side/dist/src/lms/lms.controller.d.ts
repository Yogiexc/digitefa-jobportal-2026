import { Request } from 'express';
import { LmsService } from './lms.service';
import { LinkLmsAccountDto } from './dto/link-lms-account.dto';
import { ValidateJobPortalAccountDto } from './dto/validate-job-portal-account.dto';
import { UnlinkJobPortalAccountDto } from './dto/unlink-job-portal-account.dto';
export declare class LmsController {
    private readonly lmsService;
    constructor(lmsService: LmsService);
    unlinkByLmsCommand(body: UnlinkJobPortalAccountDto): Promise<{
        message: string;
    }>;
    validateAndLinkFromLms(body: ValidateJobPortalAccountDto): Promise<{
        message: string;
        data: {
            job_seeker_id: string;
        };
    }>;
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
    linkAccount(body: LinkLmsAccountDto, req: Request): Promise<{
        message: string;
    }>;
    unlinkAccount(req: Request): Promise<{
        message: string;
    }>;
}
