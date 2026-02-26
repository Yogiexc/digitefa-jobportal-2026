import { PrismaService } from 'prisma/prisma.service';
export declare class CompanyService {
    private prisma;
    constructor(prisma: PrismaService);
    getTotalJobVacancies(user: any): Promise<{
        status: string;
        message: string;
        data: number;
    }>;
    getJobOverview(user: any, year?: number): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
    talentsAcceptanceRatio(user: any): Promise<{
        status: string;
        message: string;
        data: {
            total_applicants: number;
            total_accepted: number;
            ratio: string | number;
        };
    }>;
}
