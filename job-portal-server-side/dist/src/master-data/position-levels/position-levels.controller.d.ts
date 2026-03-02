import { PositionLevelsService } from './position-levels.service';
import { CreatePositionLevelDto } from './dto/create-position-level.dto';
import { UpdatePositionLevelDto } from './dto/update-position-level.dto';
export declare class PositionLevelsController {
    private readonly positionLevelsService;
    constructor(positionLevelsService: PositionLevelsService);
    create(createPositionLevelDto: CreatePositionLevelDto): Promise<{
        status: string;
        message: string;
        data: {
            position_level_id: string;
            position_name: string;
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
            position_level_id: string;
            position_name: string;
        }[];
    }>;
    findOne(position_level_id: string): Promise<{
        status: string;
        data: {
            created_at: Date;
            updated_at: Date;
            position_level_id: string;
            position_name: string;
        };
    }>;
    update(position_level_id: string, updatePositionLevelDto: UpdatePositionLevelDto): Promise<{
        status: string;
        message: string;
        data: {
            position_level_id: string;
            position_name: string;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    remove(position_level_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
