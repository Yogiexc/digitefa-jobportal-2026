import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { PrismaService } from 'prisma/prisma.service';
export declare class ExperienceService {
    private prisma;
    constructor(prisma: PrismaService);
    getExperiences(user: any): Promise<{
        status: string;
        message: string;
        data: {
            experience_id: string;
            experience_title: string;
            employment_type: string;
            company_name: string;
            location: string;
            location_type: string;
            description: string;
            start_date: Date;
            end_date: Date;
        }[];
    }>;
    getExperience(user: any, experience_id: string): Promise<{
        status: string;
        message: string;
        data: {
            experience_id: string;
            job_seeker_detail_id: string;
            experience_title: string;
            employment_type: string | null;
            company_name: string;
            location: string | null;
            location_type: string | null;
            description: string | null;
            start_date: Date | null;
            end_date: Date | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    addExperience(user: any, createExperienceDto: CreateExperienceDto): Promise<{
        status: string;
        message: string;
        data: {
            experience_id: string;
            job_seeker_detail_id: string;
            experience_title: string;
            employment_type: string | null;
            company_name: string;
            location: string | null;
            location_type: string | null;
            description: string | null;
            start_date: Date | null;
            end_date: Date | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    updateExperience(user: any, experience_id: string, updateExperienceDto: UpdateExperienceDto): Promise<{
        status: string;
        message: string;
    }>;
    deleteExperience(user: any, experience_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
