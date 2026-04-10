import { JobSeekerProfileService } from './job-seeker-profile.service';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { UpdatePersonalSummaryDto } from './dto/update-personal-summary.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
export declare class JobSeekerProfileController {
    private readonly jobSeekerProfileService;
    constructor(jobSeekerProfileService: JobSeekerProfileService);
    getPersonalInfo(req: any): Promise<{
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
    updateProfilePicture(req: any, uploadProfilePictureDto: UpdateProfilePictureDto, profile_picture?: Express.Multer.File): Promise<{
        status: string;
        message: string;
    }>;
    deleteProfilePicture(req: any): Promise<{
        status: string;
        message: string;
    }>;
    updatePersonalInfo(req: any, updatePersonalInfoDto: UpdatePersonalInfoDto): Promise<{
        status: string;
        message: string;
    }>;
    getPersonalSummary(req: any): Promise<{
        status: string;
        message: string;
        data: string;
    }>;
    updatePersonalSummary(req: any, updatePersonalSummaryDto: UpdatePersonalSummaryDto): Promise<{
        status: string;
        message: string;
    }>;
    getEducation(req: any): Promise<{
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
    updateEducation(req: any, updateEducationDto: UpdateEducationDto): Promise<{
        status: string;
        message: string;
    }>;
}
