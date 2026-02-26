import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'prisma/prisma.service';
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCompanyDto: CreateCompanyDto): Promise<{
        status: string;
        message: string;
        data: {
            company_id: string;
            email: string;
            password: string;
            full_name: string;
            phone_number: string;
            otp: string | null;
            otpExpires: Date | null;
            verified: import(".prisma/client").$Enums.verified;
            status: import(".prisma/client").$Enums.status;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    findAllCompanyManagement(params: {
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
        data: {
            company_id: string;
            email: string;
            status: any;
            created_at: Date;
            legal_name: string;
            market_name: string;
        }[];
    }>;
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
    changeStatusCompany(company_id: string, status: "accepted" | "rejected", notes: string): Promise<{
        status: string;
        message: string;
    }>;
    sendApprovalEmail(email: string, status: 'accepted' | 'rejected', notes: string): Promise<void>;
    update(company_id: string, updateCompaniesDto: UpdateCompanyDto): Promise<{
        status: string;
        message: string;
        data: {
            company_id: string;
            email: string;
            password: string;
            full_name: string;
            phone_number: string;
            otp: string | null;
            otpExpires: Date | null;
            verified: import(".prisma/client").$Enums.verified;
            status: import(".prisma/client").$Enums.status;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    remove(company_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
