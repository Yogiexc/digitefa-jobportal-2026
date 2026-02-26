import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admins.dto';
import { UpdateAdminDto } from './dto/update-admins.dto';
export declare class AdminsController {
    private readonly adminsService;
    constructor(adminsService: AdminsService);
    create(req: any, createAdminDto: CreateAdminDto): Promise<{
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
    findAll(page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
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
    update(req: any, admin_id: string, updateAdminDto: UpdateAdminDto): Promise<{
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
    remove(req: any, admin_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
