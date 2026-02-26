import { V3Service } from './v3.service';
export declare class V3Controller {
    private readonly v3Service;
    constructor(v3Service: V3Service);
    getJobs(): Promise<{
        status: string;
        message: string;
        data: {
            job_id: string;
            title: string;
            description: string;
            location: string;
            published_at: Date;
            expired_at: Date;
            status: import(".prisma/client").$Enums.job_status;
            company: {
                company_id: string;
                legal_name: string;
            };
        }[];
    }>;
    getUserProfile(job_seeker_id: string): Promise<{
        status: string;
        message: string;
        data: {
            full_name: string;
            email: string;
            personal_summary: string;
            experiences: any[];
        };
    }>;
}
