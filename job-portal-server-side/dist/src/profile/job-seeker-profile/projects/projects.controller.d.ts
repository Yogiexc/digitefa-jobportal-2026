import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    getProjects(req: any): Promise<{
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
    getProject(project_id: string, req: any): Promise<{
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
    addProjects(req: any, createProjectDto: CreateProjectDto): Promise<{
        status: string;
        message: string;
    }>;
    updateProjects(project_id: string, req: any, createProjectDto: CreateProjectDto): Promise<{
        status: string;
        message: string;
    }>;
    deleteProjects(project_id: string, req: any): Promise<{
        status: string;
        message: string;
    }>;
}
