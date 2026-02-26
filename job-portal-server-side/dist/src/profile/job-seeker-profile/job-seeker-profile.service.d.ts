import { PrismaService } from 'prisma/prisma.service';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { UpdatePersonalSummaryDto } from './dto/update-personal-summary.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
export declare class JobSeekerProfileService {
    private prisma;
    constructor(prisma: PrismaService);
    getPersonalInfo(user: any): Promise<{
        status: string;
        data: {
            full_name: string;
            email: string;
            address: string;
            phone_number: string;
            date_of_birth: Date;
            profile_picture_url: string;
        };
    }>;
    updateProfilePicture(user: any, profile_picture: Express.Multer.File): Promise<{
        status: string;
        message: string;
    }>;
    updatePersonalInfo(user: any, updatePersonalInfoDto: UpdatePersonalInfoDto): Promise<{
        status: string;
        message: string;
    }>;
    getPersonalSummary(user: any): Promise<{
        status: string;
        message: string;
        data: string;
    }>;
    updatePersonalSummary(user: any, updatePersonalSummaryDto: UpdatePersonalSummaryDto): Promise<{
        status: string;
        message: string;
    }>;
    getEducation(user: any): Promise<{
        status: string;
        message: string;
        data: {
            university_name: string;
            degree: string;
            major: string;
            start_date: Date;
            end_date: Date;
            grade: string;
        };
    }>;
    updateEducation(user: any, updateEducationDto: UpdateEducationDto): Promise<{
        status: string;
        message: string;
    }>;
}
