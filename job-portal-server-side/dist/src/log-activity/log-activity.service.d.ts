import { PrismaService } from 'prisma/prisma.service';
export declare class LogActivityService {
    private prisma;
    constructor(prisma: PrismaService);
    logActivity(user_id: string, user_role: 'superadmin' | 'company' | 'university' | 'job_seeker', activity: string): Promise<void>;
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
        data: any;
    }>;
    modifyData(dataArray: any): Promise<any[]>;
}
