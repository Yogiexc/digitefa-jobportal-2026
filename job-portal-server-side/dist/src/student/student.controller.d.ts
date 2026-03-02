import { StudentService } from './student.service';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
    findAllStudents(req: any, page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', classYear?: number, startDate?: string, endDate?: string): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: {
            education: {
                degree: string;
                major: string;
                start_date: Date;
                end_date: Date;
            };
            created_at: Date;
            job_seeker_id: string;
            job_seeker: {
                email: string;
                full_name: string;
            };
        }[];
    }>;
    getStudentByJobSeekerId(req: any, job_seeker_id: string): Promise<{
        status: string;
        message: string;
        data?: undefined;
    } | {
        status: string;
        message: string;
        data: {
            personal_info: {
                personal_info_id: string;
                job_seeker_detail_id: string;
                address: string | null;
                phone_number: string | null;
                date_of_birth: Date | null;
                created_at: Date;
                updated_at: Date;
            };
            education: {
                education_id: string;
                job_seeker_detail_id: string;
                university_id: string | null;
                university_name: string;
                degree: string;
                major: string;
                start_date: Date;
                end_date: Date | null;
                grade: string | null;
                created_at: Date;
                updated_at: Date;
            };
            experiences: {
                experience_id: string;
                job_seeker_detail_id: string;
                experience_title: string;
                employment_type: string | null;
                company_name: string;
                location: string | null;
                location_type: string | null;
                description: string | null;
                start_date: Date | null;
                end_date: Date | null;
                created_at: Date;
                updated_at: Date;
            }[];
            languages: {
                language_id: string;
                language_name: string;
                created_at: Date;
                updated_at: Date;
                job_seeker_detail_id: string | null;
            }[];
            skills: {
                skill_id: string;
                skill_name: string;
                created_at: Date;
                updated_at: Date;
                job_seeker_detail_id: string | null;
            }[];
            projects: {
                project_id: string;
                job_seeker_detail_id: string;
                project_name: string;
                description: string | null;
                start_date: Date | null;
                end_date: Date | null;
                created_at: Date;
                updated_at: Date;
            }[];
            certifications: {
                certification_id: string;
                job_seeker_detail_id: string;
                certification_name: string;
                issuing_organization: string | null;
                issue_date: Date | null;
                expiration_date: Date | null;
                credential_url: string | null;
                created_at: Date;
                updated_at: Date;
            }[];
            job_seeker: {
                job_seeker_id: string;
                email: string;
                password: string;
                full_name: string;
                otp: string | null;
                otpExpires: Date | null;
                verified: import(".prisma/client").$Enums.verified;
                created_at: Date;
                updated_at: Date;
                lmsUserId: string | null;
                lmsLinkedAt: Date | null;
            };
        } & {
            job_seeker_detail_id: string;
            job_seeker_id: string;
            profile_picture_url: string | null;
            personal_summary: string | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    getStudentEmploymentHistory(req: any, page?: number, pageSize?: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc', classYear?: number, status?: 'pending' | 'accepted' | 'rejected', employmentType?: 'internship' | 'fulltime' | 'parttime'): Promise<{
        status: string;
        message: string;
        totalData: number;
        totalPages: number;
        currentPage: number;
        size: number;
        data: {
            application_id: string;
            applied_at: Date;
            status: string;
            job_seeker: {
                job_seeker_id: string;
                full_name: string;
                class_year: Date;
            };
            job: {
                job_id: string;
                title: string;
                employment_type: string;
            };
            company: {
                legal_name: string;
                market_name: string;
                logo_url: string;
            };
        }[];
    }>;
    exportRegisteredStudent(req: any, format: 'csv' | 'xlsx', start: number, end: number, res: any): Promise<import("express").Response<any, Record<string, any>>>;
    exportHistoryStudent(req: any, format: 'csv' | 'xlsx', start: number, end: number, res: any): Promise<import("express").Response<any, Record<string, any>>>;
}
