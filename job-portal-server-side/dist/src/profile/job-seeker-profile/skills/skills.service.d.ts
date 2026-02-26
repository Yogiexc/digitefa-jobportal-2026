import { PrismaService } from 'prisma/prisma.service';
export declare class SkillsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSkills(user: any): Promise<{
        status: string;
        message: string;
        data: {
            skill_id: string;
            skill_name: string;
        }[];
    }>;
    createSkills(user: any, createSkillsDto: any): Promise<{
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
    deleteSkill(user: any, skill_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
