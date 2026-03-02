import { CompaniesService } from './companies.service';
import { ChangeStatusCompanyDto } from './dto/change-status-company.dto';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    findAllCompanyManagement(page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: {
            company_id: string;
            email: string;
            status: any;
            created_at: Date;
            legal_name: string;
            market_name: string;
        }[];
    }>;
    findAll(page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: {
            company_id: string;
            full_name: string;
            email: string;
            status: import(".prisma/client").$Enums.status;
            created_at: Date;
            legal_name: string;
            market_name: string;
        }[];
    }>;
    findOne(company_id: string): Promise<{
        status: string;
        data: {
            company_id: string;
            email: string;
            phone_number: string;
            status: import(".prisma/client").$Enums.status;
            company_detail: {
                company_detail_id: string;
                company_id: string;
                logo_url: string | null;
                legal_name: string | null;
                market_name: string | null;
                category: string | null;
                company_size: string | null;
                description: string | null;
                country: string | null;
                province: string | null;
                city: string | null;
                district: string | null;
                full_address: string | null;
                postal_code: string | null;
                website: string | null;
                facebook_url: string | null;
                twitter_url: string | null;
                instagram_url: string | null;
                youtube_url: string | null;
                created_at: Date;
                updated_at: Date;
            };
        };
    }>;
    searchTalents(query: string, job_description: string): Promise<{
        status: string;
        data: any;
    }>;
    changeStatus(changeStatusDto: ChangeStatusCompanyDto): Promise<{
        status: string;
        message: string;
    }>;
}
