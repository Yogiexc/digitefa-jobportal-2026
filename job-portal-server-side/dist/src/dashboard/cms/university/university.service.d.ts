import { PrismaService } from 'prisma/prisma.service';
export declare class UniversityService {
    private prisma;
    constructor(prisma: PrismaService);
    getTotalStudents(user: any): Promise<{
        status: string;
        message: string;
        data: number;
    }>;
    studentActivities(user: any, year?: number): Promise<{
        status: string;
        message: string;
        data: {
            months: string[];
            totalRegistered: any[];
            totalEmployed: any[];
        };
    }>;
    getEnrolledStudents(user: any): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    studentEmploymentRatio(user: any): Promise<{
        status: string;
        message: string;
        data: {
            total_talents: number;
            total_accepted: number;
            ratio: string | number;
        };
    }>;
}
