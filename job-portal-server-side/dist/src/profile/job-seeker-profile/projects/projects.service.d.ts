import { PrismaService } from 'prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    getProjects(user: any): Promise<{
        status: string;
        message: string;
        data: {
            project_id: string;
            project_name: string;
            description: string;
            start_date: Date;
            end_date: Date;
        }[];
    }>;
    getProject(user: any, project_id: string): Promise<{
        status: string;
        message: string;
        data: {
            project_id: string;
            job_seeker_detail_id: string;
            project_name: string;
            description: string | null;
            start_date: Date | null;
            end_date: Date | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    addProjects(user: any, addProjectsDto: CreateProjectDto): Promise<{
        status: string;
        message: string;
    }>;
    updateProjects(user: any, project_id: string, updateProjectsDto: CreateProjectDto): Promise<{
        status: string;
        message: string;
    }>;
    deleteProjects(user: any, project_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
