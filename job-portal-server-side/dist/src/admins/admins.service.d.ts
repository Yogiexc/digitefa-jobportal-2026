import { CreateAdminDto } from './dto/create-admins.dto';
import { UpdateAdminDto } from './dto/update-admins.dto';
import { PrismaService } from 'prisma/prisma.service';
import { LogActivityService } from 'src/log-activity/log-activity.service';
export declare class AdminsService {
    private prisma;
    private logActivityService;
    constructor(prisma: PrismaService, logActivityService: LogActivityService);
    create(user: any, createAdminDto: CreateAdminDto): Promise<{
        status: string;
        message: string;
        data: {
            admin_id: string;
            email: string;
            full_name: string;
            password: string;
            role: import(".prisma/client").$Enums.role;
            created_at: Date;
            updated_at: Date;
        };
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
            email: string;
            full_name: string;
            created_at: Date;
            admin_id: string;
        }[];
    }>;
    findOne(admin_id: string): Promise<{
        status: string;
        data: {
            email: string;
            full_name: string;
            admin_id: string;
        };
    }>;
    update(user: any, admin_id: string, updateAdminsDto: UpdateAdminDto): Promise<{
        status: string;
        message: string;
        data: {
            admin_id: string;
            email: string;
            full_name: string;
            password: string;
            role: import(".prisma/client").$Enums.role;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    remove(user: any, admin_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
