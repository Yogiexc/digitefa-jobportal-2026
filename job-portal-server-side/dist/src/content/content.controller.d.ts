import { ContentService } from './content.service';
import { UpdateAboutUsDto } from './dto/update-about-us.dto';
import { UpdatePrivacyPolicyDto } from './dto/update-privacy-policy.dto';
import { CreateEventNewsDto } from './dto/create-event-news.dto';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    getAboutUs(): Promise<{
        status: string;
        message: string;
        data: string;
    }>;
    updateAboutUs(updateAboutUsDto: UpdateAboutUsDto): Promise<{
        status: string;
        message: string;
    }>;
    getPrivacyPolicy(): Promise<{
        status: string;
        message: string;
        data: string;
    }>;
    updatePrivacyPolicy(updatePrivacyPolicyDto: UpdatePrivacyPolicyDto): Promise<{
        status: string;
        message: string;
    }>;
    findAllEventNews(category: 'all' | 'event' | 'news', page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
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
    getEventNews(slug: string): Promise<{
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
    createEventNews(createEventNewsDto: CreateEventNewsDto, upload_image?: Express.Multer.File): Promise<{
        status: string;
        message: string;
    }>;
    updateEventNews(page_id: string, createEventNewsDto: CreateEventNewsDto, upload_image?: Express.Multer.File): Promise<{
        status: string;
        message: string;
    }>;
    deleteEventNews(page_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
