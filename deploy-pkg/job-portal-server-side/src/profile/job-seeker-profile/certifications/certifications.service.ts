import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { LmsCertificateDto } from './certifications.controller';
@Injectable()
export class CertificationsService {
  constructor(private prisma: PrismaService) { }
  async getCertifications(user: any) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { certifications: true }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    try {
      const certifications = jobSeekerDetail.certifications.map(certification => ({
        certification_id: certification.certification_id,
        certification_name: certification.certification_name,
        issuing_organization: certification.issuing_organization,
        issue_date: certification.issue_date,
        expiration_date: certification.expiration_date,
        credential_url: certification.credential_url,
      }));

      return {
        status: 'success',
        data: certifications
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get job seeker certifications');
    }
  }

  async getCertification(user: any, certification_id: string) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
      include: { certifications: true }
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const certification = await this.prisma.certifications.findUnique({
      where: {
        certification_id,
        job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id
      }
    });

    if (!certification) {
      throw new NotFoundException('Certification not found');
    }

    return {
      status: 'success',
      message: 'Job Seeker Certification retrieved successfully',
      data: certification
    };
  }

  async addCertifications(user: any, addCertificationsDto: CreateCertificationDto) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    try {
      const { certification_name, issuing_organization, issue_date, expiration_date, credential_url } = addCertificationsDto;

      await this.prisma.certifications.create({
        data: {
          certification_name,
          issuing_organization,
          credential_url,
          issue_date: new Date(issue_date),
          expiration_date: new Date(expiration_date),
          job_seeker_details: {
            connect: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
          }
        }
      });

      return {
        status: 'success',
        message: 'Job Seeker Certifications added successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to add job seeker certifications');
    }
  }

  async updateCertifications(user: any, certification_id: string, addCertificationsDto: CreateCertificationDto) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const certification = await this.prisma.certifications.findUnique({
      where: { certification_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
    });

    if (!certification) {
      throw new NotFoundException('Certification not found');
    }

    try {
      const { certification_name, issuing_organization, issue_date, expiration_date, credential_url } = addCertificationsDto;

      await this.prisma.certifications.update({
        where: { certification_id },
        data: {
          certification_name,
          issuing_organization,
          issue_date: new Date(issue_date),
          expiration_date: new Date(expiration_date),
          credential_url
        }
      });

      return {
        status: 'success',
        message: 'Job Seeker Certifications updated successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to update job seeker certifications');
    }
  }

  async deleteCertifications(user: any, certification_id: string) {
    const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!jobSeekerDetail) {
      throw new NotFoundException('Job seeker details not found');
    }

    const certification = await this.prisma.certifications.findUnique({
      where: { certification_id, job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
    });

    if (!certification) {
      throw new NotFoundException('Certification not found');
    }

    try {
      await this.prisma.certifications.delete({
        where: { certification_id }
      });

      return {
        status: 'success',
        message: 'Job Seeker Certifications deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to delete job seeker certifications');
    }
  }

  async addCertificationFromLms(data: LmsCertificateDto) {
    try {
      const jobSeekerDetail = await this.prisma.job_seeker_details.findUnique({
        where: { job_seeker_id: data.job_portal_id }
      });

      if (!jobSeekerDetail) {
        throw new NotFoundException('Job Seeker Detail not found for the given job_portal_id');
      }

      await this.prisma.certifications.create({
        data: {
          certification_name: data.certification_name,
          issuing_organization: data.issuing_organization,
          issue_date: new Date(data.issue_date),
          expiration_date: data.expiration_date ? new Date(data.expiration_date) : null,
          credential_url: data.credential_url,
          job_seeker_details: {
            connect: { job_seeker_detail_id: jobSeekerDetail.job_seeker_detail_id }
          }
        }
      });

      return {
        status: 'success',
        message: 'Certification from LMS successfully added'
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to add job seeker certification from LMS');
    }
  }
}
