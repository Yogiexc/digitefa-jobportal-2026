import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
export declare class SkillsController {
    private readonly skillsService;
    constructor(skillsService: SkillsService);
    getSkills(req: any): Promise<{
        status: string;
        message: string;
        data: {
            skill_id: string;
            skill_name: string;
        }[];
    }>;
    updateSkills(req: any, updateSkillsDto: CreateSkillDto): Promise<{
        status: string;
        message: string;
        data: {
            skill_id: string;
            skill_name: string;
            created_at: Date;
            updated_at: Date;
            job_seeker_detail_id: string | null;
        };
    }>;
    deleteSkill(req: any, skill_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
