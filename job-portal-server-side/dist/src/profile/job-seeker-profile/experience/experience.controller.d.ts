import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
export declare class ExperienceController {
    private readonly experienceService;
    constructor(experienceService: ExperienceService);
    getExperiences(req: any): Promise<{
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
    getExperience(experience_id: string, req: any): Promise<{
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
    addExperience(req: any, createExperienceDto: CreateExperienceDto): Promise<{
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
    updateExperience(experience_id: string, req: any, updateExperienceDto: UpdateExperienceDto): Promise<{
        status: string;
        message: string;
    }>;
    deleteExperience(experience_id: string, req: any): Promise<{
        status: string;
        message: string;
    }>;
}
