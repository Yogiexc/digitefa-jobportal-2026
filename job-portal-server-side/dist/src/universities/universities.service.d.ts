import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { PrismaService } from 'prisma/prisma.service';
export declare class UniversitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUniversityDto: CreateUniversityDto): Promise<{
        status: string;
        message: string;
        data: {
            university_id: string;
            email: string;
            password: string;
            full_name: string;
            otp: string | null;
            otpExpires: Date | null;
            verified: import(".prisma/client").$Enums.verified;
            status: import(".prisma/client").$Enums.status;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    findAllUniversityManagement(params: {
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
            university_id: string;
            email: string;
            status: any;
            created_at: Date;
            university_name: string;
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
            university_id: string;
            full_name: string;
            email: string;
            status: import(".prisma/client").$Enums.status;
            created_at: Date;
            university_name: string;
        }[];
    }>;
    findAllList(): Promise<{
        status: string;
        message: string;
        data: {
            university_name: string;
        }[];
    }>;
    findOne(university_id: string): Promise<{
        status: string;
        data: {
            university_id: string;
            email: string;
            full_name: string;
            status: import(".prisma/client").$Enums.status;
            university_detail: {
                university_detail_id: string;
                university_id: string;
                university_name: string;
                logo_url: string | null;
                phone_number: string | null;
                category: string | null;
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
    changeStatusUniversity(university_id: string, status: "accepted" | "rejected", notes: string): Promise<{
        status: string;
        message: string;
    }>;
    sendApprovalEmail(email: string, status: 'accepted' | 'rejected', notes: string): Promise<void>;
    update(university_id: string, updateCompaniesDto: UpdateUniversityDto): Promise<{
        status: string;
        message: string;
        data: {
            university_id: string;
            email: string;
            password: string;
            full_name: string;
            otp: string | null;
            otpExpires: Date | null;
            verified: import(".prisma/client").$Enums.verified;
            status: import(".prisma/client").$Enums.status;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    remove(university_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
