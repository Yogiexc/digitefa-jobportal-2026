import { PrismaService } from 'prisma/prisma.service';
export declare class ContentService {
    private prisma;
    constructor(prisma: PrismaService);
    getAboutUs(): Promise<{
        status: string;
        message: string;
        data: string;
    }>;
    updateAboutUs(content: string): Promise<{
        status: string;
        message: string;
    }>;
    getPrivacyPolicy(): Promise<{
        status: string;
        message: string;
        data: string;
    }>;
    updatePrivacyPolicy(content: string): Promise<{
        status: string;
        message: string;
    }>;
    findAllEventNews(params: {
        category?: 'all' | 'event' | 'news';
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
            page_id: string;
            slug: string;
            title: string | null;
            category: import(".prisma/client").$Enums.page_category;
            content: string;
            image_url: string | null;
            event_date: Date | null;
            created_at: Date;
            updated_at: Date;
        }[];
    }>;
    getEventNewsById(page_id: string): Promise<{
        status: string;
        message: string;
        data: {
            page_id: string;
            slug: string;
            title: string | null;
            category: import(".prisma/client").$Enums.page_category;
            content: string;
            image_url: string | null;
            event_date: Date | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    getEventNewsBySlug(slug: string): Promise<{
        status: string;
        message: string;
        data: {
            page_id: string;
            slug: string;
            title: string | null;
            category: import(".prisma/client").$Enums.page_category;
            content: string;
            image_url: string | null;
            event_date: Date | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    createEventNews(createEventNewsDto: any, upload_image?: Express.Multer.File): Promise<{
        status: string;
        message: string;
    }>;
    updateEventNewsById(page_id: string, createEventNewsDto: any, upload_image?: Express.Multer.File): Promise<{
        status: string;
        message: string;
    }>;
    deleteEventNewsById(page_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
