import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
export declare class LanguagesController {
    private readonly languagesService;
    constructor(languagesService: LanguagesService);
    getLanguages(req: any): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
    getLanguage(language_id: string, req: any): Promise<{
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
    addLanguages(req: any, createLanguageDto: CreateLanguageDto): Promise<{
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
    updateLanguages(language_id: string, req: any, updateLanguageDto: UpdateLanguageDto): Promise<{
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
    deleteLanguages(language_id: string, req: any): Promise<{
        status: string;
        message: string;
    }>;
}
