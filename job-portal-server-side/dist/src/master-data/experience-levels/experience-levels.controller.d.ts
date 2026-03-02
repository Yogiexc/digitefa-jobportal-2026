import { ExperienceLevelsService } from './experience-levels.service';
import { CreateExperienceLevelDto } from './dto/create-experience-level.dto';
import { UpdateExperienceLevelDto } from './dto/update-experience-level.dto';
export declare class ExperienceLevelsController {
    private readonly experienceLevelsService;
    constructor(experienceLevelsService: ExperienceLevelsService);
    create(createExperienceLevelDto: CreateExperienceLevelDto): Promise<{
        status: string;
        message: string;
        data: {
            experience_level_id: string;
            name: string;
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
            created_at: Date;
            updated_at: Date;
            name: string;
            experience_level_id: string;
        }[];
    }>;
    findOne(experience_level_id: string): Promise<{
        status: string;
        data: {
            created_at: Date;
            updated_at: Date;
            name: string;
            experience_level_id: string;
        };
    }>;
    update(experience_level_id: string, updateExperienceLevelDto: UpdateExperienceLevelDto): Promise<{
        status: string;
        message: string;
        data: {
            experience_level_id: string;
            name: string;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    remove(experience_level_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
