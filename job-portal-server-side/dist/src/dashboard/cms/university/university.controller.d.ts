import { UniversityService } from './university.service';
export declare class UniversityController {
    private readonly universityService;
    constructor(universityService: UniversityService);
    totalStudents(req: any): Promise<{
        status: string;
        message: string;
        data: number;
    }>;
    studentActivities(req: any, year?: number): Promise<{
        status: string;
        message: string;
        data: {
            months: string[];
            totalRegistered: any[];
            totalEmployed: any[];
        };
    }>;
    enrolledStudents(req: any): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    studentEmploymentRatio(req: any): Promise<{
        status: string;
        message: string;
        data: {
            total_talents: number;
            total_accepted: number;
            ratio: string | number;
        };
    }>;
}
