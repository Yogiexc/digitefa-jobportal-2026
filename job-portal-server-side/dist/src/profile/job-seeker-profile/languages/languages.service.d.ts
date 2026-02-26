import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { PrismaService } from 'prisma/prisma.service';
export declare class LanguagesService {
    private prisma;
    constructor(prisma: PrismaService);
    getLanguages(user: any): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
    getLanguage(user: any, language_id: string): Promise<{
        status: string;
        message: string;
        data: {
            language_id: string;
            language_name: string;
            created_at: Date;
            updated_at: Date;
            job_seeker_detail_id: string | null;
        };
    }>;
    addLanguages(user: any, createLanguageDto: CreateLanguageDto): Promise<{
        status: string;
        message: string;
        data: {
            language_id: string;
            language_name: string;
            created_at: Date;
            updated_at: Date;
            job_seeker_detail_id: string | null;
        };
    }>;
    updateLanguages(user: any, language_id: string, updateLanguageDto: UpdateLanguageDto): Promise<{
        status: string;
        message: string;
        data: {
            language_id: string;
            language_name: string;
            created_at: Date;
            updated_at: Date;
            job_seeker_detail_id: string | null;
        };
    }>;
    deleteLanguages(user: any, language_id: string): Promise<{
        status: string;
        message: string;
    }>;
}
