import { CompanyService } from './company.service';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    totalTalents(req: any): Promise<{
        status: string;
        message: string;
        data: number;
    }>;
    jobOverview(req: any, year?: number): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
    talentsAcceptanceRatio(req: any): Promise<{
        status: string;
        message: string;
        data: {
            total_applicants: number;
            total_accepted: number;
            ratio: string | number;
        };
    }>;
}
