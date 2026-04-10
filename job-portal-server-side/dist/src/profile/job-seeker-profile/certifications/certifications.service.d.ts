import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { LmsCertificateDto } from './certifications.controller';
export declare class CertificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getCertifications(user: any): Promise<{
        status: string;
        data: {
            certification_id: string;
            certification_name: string;
            issuing_organization: string;
            issue_date: Date;
            expiration_date: Date;
            credential_url: string;
        }[];
    }>;
    getCertification(user: any, certification_id: string): Promise<{
        status: string;
        message: string;
        data: {
            certification_id: string;
            job_seeker_detail_id: string;
            certification_name: string;
            issuing_organization: string | null;
            issue_date: Date | null;
            expiration_date: Date | null;
            credential_url: string | null;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    addCertifications(user: any, addCertificationsDto: CreateCertificationDto): Promise<{
        status: string;
        message: string;
    }>;
    updateCertifications(user: any, certification_id: string, addCertificationsDto: CreateCertificationDto): Promise<{
        status: string;
        message: string;
    }>;
    deleteCertifications(user: any, certification_id: string): Promise<{
        status: string;
        message: string;
    }>;
    addCertificationFromLms(data: LmsCertificateDto): Promise<{
        status: string;
        message: string;
    }>;
}
