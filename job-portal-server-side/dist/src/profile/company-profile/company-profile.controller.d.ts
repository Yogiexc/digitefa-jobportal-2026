import { CompanyProfileService } from './company-profile.service';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
export declare class CompanyProfileController {
    private readonly companyProfileService;
    constructor(companyProfileService: CompanyProfileService);
    findOne(req: any): Promise<{
        status: string;
        message: string;
        data: {
            [k: string]: string | Date | {
                company_detail_id: string;
                company_id: string;
                logo_url: string | null;
                legal_name: string | null;
                market_name: string | null;
                category: string | null;
                company_size: string | null;
                description: string | null;
                country: string | null;
                province: string | null;
                city: string | null;
                district: string | null;
                full_address: string | null;
                postal_code: string | null;
                website: string | null;
                facebook_url: string | null;
                twitter_url: string | null;
                instagram_url: string | null;
                youtube_url: string | null;
                created_at: Date;
                updated_at: Date;
            };
        };
    }>;
    newCompany(req: any, updateCompanyProfileDto: UpdateCompanyProfileDto, upload_logo?: Express.Multer.File): Promise<{
        status: string;
        message: string;
    }>;
    update(req: any, updateCompanyProfileDto: UpdateCompanyProfileDto, upload_logo?: Express.Multer.File): Promise<{
        status: string;
        message: string;
        data: {
            company_id: string;
            email: string;
            password: string;
            full_name: string;
            phone_number: string;
            otp: string | null;
            otpExpires: Date | null;
            verified: import(".prisma/client").$Enums.verified;
            status: import(".prisma/client").$Enums.status;
            created_at: Date;
            updated_at: Date;
        };
    }>;
}
