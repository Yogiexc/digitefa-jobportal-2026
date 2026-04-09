import { PrismaService } from '../../../../prisma/prisma.service';
export declare class SuperadminService {
    private prisma;
    constructor(prisma: PrismaService);
    getTotalTalents(time?: 'week' | 'month' | 'all'): Promise<{
        status: string;
        message: string;
        data: number;
    }>;
    getTotalCompanies(time?: 'week' | 'month' | 'all'): Promise<{
        status: string;
        message: string;
        data: number;
    }>;
    getTotalUniversities(time?: 'week' | 'month' | 'all'): Promise<{
        status: string;
        message: string;
        data: number;
    }>;
    getRecentJobs(limit?: number): Promise<{
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
