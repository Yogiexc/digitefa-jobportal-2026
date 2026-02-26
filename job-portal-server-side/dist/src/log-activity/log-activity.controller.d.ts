import { LogActivityService } from './log-activity.service';
export declare class LogActivityController {
    private readonly logActivityService;
    constructor(logActivityService: LogActivityService);
    findAll(page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: any;
    }>;
}
