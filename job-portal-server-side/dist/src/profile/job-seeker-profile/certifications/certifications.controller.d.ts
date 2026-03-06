import { CertificationsService } from './certifications.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
export declare class LmsCertificateDto {
    job_portal_id: string;
    certification_name: string;
    issuing_organization: string;
    issue_date: Date;
    expiration_date?: Date;
    credential_url: string;
}
export declare class CertificationsController {
    private readonly certificationsService;
    constructor(certificationsService: CertificationsService);
    getCertifications(req: any): Promise<{
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
    getCertification(certification_id: string, req: any): Promise<{
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
    addCertifications(req: any, createCertificationDto: CreateCertificationDto): Promise<{
        status: string;
        message: string;
    }>;
    updateCertifications(certification_id: string, req: any, createCertificationDto: CreateCertificationDto): Promise<{
        status: string;
        message: string;
    }>;
    deleteCertifications(certification_id: string, req: any): Promise<{
        status: string;
        message: string;
    }>;
    addCertificationFromLms(apiKey: string, data: LmsCertificateDto): Promise<{
        status: string;
        message: string;
    }>;
}
