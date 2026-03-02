import { SuperadminService } from './superadmin.service';
export declare class SuperadminController {
    private readonly superadminService;
    constructor(superadminService: SuperadminService);
    totalTalents(time?: 'week' | 'month' | 'all'): Promise<{
        status: string;
        message: string;
        data: number;
    }>;
    totalCompanies(time?: 'week' | 'month' | 'all'): Promise<{
        status: string;
        message: string;
        data: number;
    }>;
    totalUniversities(time?: 'week' | 'month' | 'all'): Promise<{
        status: string;
        message: string;
        data: number;
    }>;
    recentJobs(limit?: number): Promise<{
        status: string;
        message: string;
        data: {
            job_id: string;
            title: string;
            published_at: Date;
            company: {
                legal_name: string;
                market_name: string;
            };
        }[];
    }>;
    getTalentsOverview(week: number, month: number): Promise<{
        status: string;
        message: string;
        data: {
            label: any[];
            talentsData: any[];
        };
    }>;
    getCompaniesUniversitiesOverview(month: number): Promise<{
        status: string;
        message: string;
        data: {
            weeks: any[];
            companies: any[];
            universities: any[];
        };
    }>;
}
