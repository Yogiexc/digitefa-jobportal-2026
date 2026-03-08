import { UniversitiesService } from './universities.service';
import { ChangeStatusUniversityDto } from './dto/change-status-university.dto';
export declare class UniversitiesController {
    private readonly universitiesService;
    constructor(universitiesService: UniversitiesService);
    findAllUniversityManagement(page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
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
    findAll(page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
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
    changeStatus(changeStatusDto: ChangeStatusUniversityDto): Promise<{
        status: string;
        message: string;
    }>;
}
