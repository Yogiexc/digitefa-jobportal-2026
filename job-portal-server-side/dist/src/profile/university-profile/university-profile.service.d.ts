import { UpdateUniversityProfileDto } from './dto/update-university-profile.dto';
import { PrismaService } from '../../../prisma/prisma.service';
export declare class UniversityProfileService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(user: any): Promise<{
        status: string;
        message: string;
        data: {
            [k: string]: string | Date | {
                university_detail_id: string;
                university_id: string;
                university_name: string;
                logo_url: string | null;
                phone_number: string | null;
                category: string | null;
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
    newUniversity(user: any, updateUniversityProfileDto: UpdateUniversityProfileDto, upload_logo?: Express.Multer.File): Promise<{
        status: string;
        message: string;
    }>;
    update(user: any, updateUniversityProfileDto: UpdateUniversityProfileDto, upload_logo?: Express.Multer.File): Promise<{
        status: string;
        message: string;
        data: {
            university_id: string;
            email: string;
            password: string;
            full_name: string;
            otp: string | null;
            otpExpires: Date | null;
            verified: import(".prisma/client").$Enums.verified;
            status: import(".prisma/client").$Enums.status;
            created_at: Date;
            updated_at: Date;
        };
    }>;
}
