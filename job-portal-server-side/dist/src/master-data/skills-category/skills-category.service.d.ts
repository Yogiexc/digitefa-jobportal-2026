import { CreateSkillsCategoryDto } from './dto/create-skills-category.dto';
import { UpdateSkillsCategoryDto } from './dto/update-skills-category.dto';
import { PrismaService } from 'prisma/prisma.service';
export declare class SkillsCategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createSkillsCategoryDto: CreateSkillsCategoryDto): Promise<{
        status: string;
        message: string;
        data: {
            skill_category_id: string;
            category_name: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
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
            created_at: Date;
            updated_at: Date;
            skill_category_id: string;
            category_name: string;
        }[];
    }>;
    findOne(skill_category_id: string): Promise<{
        status: string;
        data: {
            created_at: Date;
            updated_at: Date;
            skill_category_id: string;
            category_name: string;
        };
    }>;
    update(skill_category_id: string, updateSkillsCategoryDto: UpdateSkillsCategoryDto): Promise<{
        status: string;
        message: string;
        data: {
            skill_category_id: string;
            category_name: string;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date | null;
        };
    }>;
    remove(skill_category_id: string): Promise<{
        status: string;
        message: string;
    }>;
    getListSkills(skill_category_id: string): Promise<{
        status: string;
        message: string;
        data: string[];
    }>;
    getListSkillsByCategoryName(category_name: string): Promise<{
        status: string;
        message: string;
        data: string[];
    }>;
}
