import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';
import { otpChangeEmailTemplate } from './email-templates/otp-change-email-template';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { VerifyChangeEmailDto } from './dto/verify-change-email.dto';
import axios from 'axios';
import * as FormDataNode from 'form-data';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) { }
  async getUser(user: any) {
    let users;
    if (user.role === 'job_seeker') {
      users = await this.prisma.job_seekers.findUnique({
        where: { job_seeker_id: user.job_seeker_id },
      });
      if (users) users = { ...users, role: 'job_seeker' };
    } else if (user.role === 'university') {
      users = await this.prisma.universities.findUnique({
        where: { university_id: user.university_id },
        include: {
          university_detail: true,
        },
      });
      if (users) users = { ...users, role: 'university' };
    } else if (user.role === 'company') {
      users = await this.prisma.companies.findUnique({
        where: { company_id: user.company_id },
        include: {
          company_detail: true,
        },
      });
      if (users) users = { ...users, role: 'company' };
    } else if (user.role === 'superadmin') {
      users = await this.prisma.admins.findUnique({
        where: { admin_id: user.admin_id },
      });
      if (users) users = { ...users, role: 'superadmin' };
    }
    if (!users) {
      throw new UnauthorizedException('Token not found!, Please login again');
    }
    const detailUser = Object.fromEntries(
      Object.entries(users).filter(
        ([key]) =>
          ![
            'otp',
            'otpExpires',
            'password',
            'updated_at',
            'created_at',
          ].includes(key),
      ),
    );
    return {
      status: 'success',
      message: 'Profile fetched successfully',
      data: {
        user: detailUser,
      },
    };
  }

  async changePassword(user: any, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword === changePasswordDto.oldPassword) {
      throw new BadRequestException(
        'New password cannot be the same as old password!',
      );
    }
    let users;
    if (user.role === 'job_seeker') {
      users = await this.prisma.job_seekers.findUnique({
        where: { job_seeker_id: user.job_seeker_id },
      });
    } else if (user.role === 'university') {
      users = await this.prisma.universities.findUnique({
        where: { university_id: user.university_id },
      });
    } else if (user.role === 'company') {
      users = await this.prisma.companies.findUnique({
        where: { company_id: user.company_id },
      });
    } else if (user.role === 'superadmin') {
      users = await this.prisma.admins.findUnique({
        where: { admin_id: user.admin_id },
      });
    }
    if (!users) {
      throw new UnauthorizedException('Token not found!, Please login again');
    }
    if (
      !(await bcrypt.compareSync(changePasswordDto.oldPassword, users.password))
    ) {
      throw new HttpException(
        { status: 'failed', message: 'Old password is incorrect!' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    if (user.role === 'job_seeker') {
      await this.prisma.job_seekers.update({
        where: { job_seeker_id: user.job_seeker_id },
        data: {
          password: hashedPassword,
        },
      });
    } else if (user.role === 'university') {
      await this.prisma.universities.update({
        where: { university_id: user.university_id },
        data: {
          password: hashedPassword,
        },
      });
    } else if (user.role === 'company') {
      await this.prisma.companies.update({
        where: { company_id: user.company_id },
        data: {
          password: hashedPassword,
        },
      });
    } else if (user.role === 'superadmin') {
      await this.prisma.admins.update({
        where: { admin_id: user.admin_id },
        data: {
          password: hashedPassword,
        },
      });
    }
    return {
      status: 'success',
      message: 'Password changed successfully',
    };
  }

  async changeEmail(user: any, changeEmailDto: ChangeEmailDto) {
    let users;
    if (user.role === 'job_seeker') {
      users = await this.prisma.job_seekers.findUnique({
        where: { job_seeker_id: user.job_seeker_id },
      });
    } else if (user.role === 'university') {
      users = await this.prisma.universities.findUnique({
        where: { university_id: user.university_id },
      });
    } else if (user.role === 'company') {
      users = await this.prisma.companies.findUnique({
        where: { company_id: user.company_id },
      });
    } else if (user.role === 'superadmin') {
      users = await this.prisma.admins.findUnique({
        where: { admin_id: user.admin_id },
      });
    }
    if (!users) {
      throw new UnauthorizedException('Token not found!, Please login again');
    }
    if (!(await bcrypt.compareSync(changeEmailDto.password, users.password))) {
      throw new BadRequestException('Password is incorrect!');
    }
    const otp = crypto.randomInt(1000, 9999).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    if (user.role === 'job_seeker') {
      await this.prisma.job_seekers.update({
        where: { job_seeker_id: users.job_seeker_id },
        data: {
          otp: otpHash,
          otpExpires: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    } else if (user.role === 'university') {
      await this.prisma.universities.update({
        where: { university_id: users.university_id },
        data: {
          otp: otpHash,
          otpExpires: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    } else if (user.role === 'company') {
      await this.prisma.companies.update({
        where: { company_id: users.company_id },
        data: {
          otp: otpHash,
          otpExpires: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
    }

    await this.sendOtpEmail(changeEmailDto.newEmail, otp);

    return {
      status: 'success',
      message:
        'Email OTP sent successfully. Please check your email for the OTP code.',
    };
  }

  async verifyChangeEmail(
    user: any,
    verifyChangeEmailDto: VerifyChangeEmailDto,
  ) {
    const { newEmail, otp } = verifyChangeEmailDto;
    let users;
    if (user.role === 'job_seeker') {
      users = await this.prisma.job_seekers.findUnique({
        where: { job_seeker_id: user.job_seeker_id },
      });
    } else if (user.role === 'university') {
      users = await this.prisma.universities.findUnique({
        where: { university_id: user.university_id },
      });
    } else if (user.role === 'company') {
      users = await this.prisma.companies.findUnique({
        where: { company_id: user.company_id },
      });
    } else if (user.role === 'superadmin') {
      users = await this.prisma.admins.findUnique({
        where: { admin_id: user.admin_id },
      });
    }
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (!users) {
      throw new UnauthorizedException('Token not found!, Please login again');
    }
    if (users.otp !== otpHash) {
      throw new BadRequestException('OTP is incorrect!');
    }
    if (users.otpExpires < new Date()) {
      throw new BadRequestException('OTP has expired!');
    }
    if (user.role === 'job_seeker') {
      await this.prisma.job_seekers.update({
        where: { job_seeker_id: user.job_seeker_id },
        data: {
          email: newEmail,
          otp: null,
          otpExpires: null,
        },
      });
    } else if (user.role === 'university') {
      await this.prisma.universities.update({
        where: { university_id: user.university_id },
        data: {
          email: newEmail,
          otp: null,
          otpExpires: null,
        },
      });
    } else if (user.role === 'company') {
      await this.prisma.companies.update({
        where: { company_id: user.company_id },
        data: {
          email: newEmail,
          otp: null,
          otpExpires: null,
        },
      });
    }
    return {
      status: 'success',
      message: 'Email changed successfully, Please login again',
    };
  }

  async sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const htmlContent = otpChangeEmailTemplate(otp, email);

    await transporter.sendMail({
      from: `"Digitefa" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Digitefa OTP Verification Code',
      text: `Your OTP code is ${otp}`,
      html: htmlContent,
      attachments: [{
        filename: 'Digitefa.png',
        path: process.cwd() + '/../job-portal-client-side/src/assets/images/Digitefa.png',
        cid: 'digitefa-logo'
      }],
    });
  }

  async getProfilePicture(user: any) {
    let users;
    let picture = null;
    if (user.role === 'job_seeker') {
      users = await this.prisma.job_seeker_details.findFirst({
        where: {
          job_seeker_id: user.job_seeker_id,
        },
        select: {
          profile_picture_url: true,
        },
      });
      picture = users?.profile_picture_url || null;
    } else if (user.role === 'university') {
      users = await this.prisma.university_details.findUnique({
        where: {
          university_id: user.university_id,
        },
        select: {
          logo_url: true,
        },
      });
      picture = users?.logo_url || null;
    } else if (user.role === 'company') {
      users = await this.prisma.company_details.findUnique({
        where: {
          company_id: user.company_id,
        },
        select: {
          logo_url: true,
        },
      });
      picture = users?.logo_url || null;
    } else if (user.role === 'superadmin') {
      users = await this.prisma.admins.findUnique({
        where: {
          admin_id: user.admin_id,
        },
      });
      picture = null;
    }
    return {
      status: 'success',
      message: 'Profile picture fetched successfully',
      data: picture,
    };
  }

  async cvAutofill(user: any, file: any) {
    if (user.role !== 'job_seeker') {
      throw new ForbiddenException('Only job seekers can use this feature');
    }

    const gpythonUrl = process.env.URL_SERVER_PYTHON;
    if (!gpythonUrl) {
      throw new InternalServerErrorException(
        'Python microservice URL not configured',
      );
    }

    const formData = new FormDataNode();
    formData.append('file', file.buffer, { filename: file.originalname });

    try {
      const response = await axios.post(`${gpythonUrl}/parse-cv`, formData, {
        headers: formData.getHeaders(),
      });

      const parsedData =
        response?.data?.parsed_data ?? response?.data?.data ?? response?.data;
      if (!parsedData || typeof parsedData !== 'object') {
        throw new BadRequestException('Invalid parsed CV payload from parser service');
      }

      // Auto-save data immediately without needing frontend confirmation step
      await this.cvAutofillConfirm(user, parsedData);

      return {
        status: 'success',
        message: 'CV parsed and profile updated successfully',
        data: parsedData,
      };
    } catch (error) {
      console.error('Error autofilling CV:', error);
      const errDetail = error.response?.data ? JSON.stringify(error.response.data) : error.message;

      const fs = require('fs');
      try { fs.writeFileSync('d:\\BelajarCoding\\digitefa-jobportal-2026\\python_error.log', errDetail); } catch (e) { }

      throw new InternalServerErrorException(
        'Failed to process CV: Python API error: ' + errDetail,
      );
    }
  }

  async cvAutofillConfirm(user: any, parsedData: any) {
    if (user.role !== 'job_seeker') {
      throw new ForbiddenException('Only job seekers can use this feature');
    }

    try {
      const detail = await this.prisma.job_seeker_details.findUnique({
        where: { job_seeker_id: user.job_seeker_id },
      });

      if (!detail) {
        throw new BadRequestException('Job seeker profile details not found');
      }

      const normalizeStringArray = (value: unknown): string[] => {
        if (Array.isArray(value)) {
          return value
            .map((item) => String(item).trim())
            .filter(Boolean);
        }
        if (typeof value === 'string') {
          return value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
        }
        return [];
      };

      const skillsFromCv = normalizeStringArray(parsedData.skills);
      const languagesFromCv = normalizeStringArray(parsedData.languages);
      const experiencesFromCv = Array.isArray(parsedData.experience_structured)
        ? parsedData.experience_structured
        : [];
      const educationFromCv = Array.isArray(parsedData.education_structured)
        ? parsedData.education_structured
        : [];
      const projectsFromCv = Array.isArray(parsedData.projects_structured)
        ? parsedData.projects_structured
        : [];
      const certificationsFromCv = Array.isArray(parsedData.certifications_structured)
        ? parsedData.certifications_structured
        : [];

      // Auto-fill extracted info
      if (skillsFromCv.length > 0) {
        const existingSkills = await this.prisma.skills.findMany({
          where: { job_seeker_detail_id: detail.job_seeker_detail_id },
        });
        const existingSkillNames = existingSkills.map((s) =>
          s.skill_name.toLowerCase(),
        );

        for (const skill of skillsFromCv) {
          if (!existingSkillNames.includes(skill.toLowerCase())) {
            await this.prisma.skills.create({
              data: {
                skill_name: skill,
                job_seeker_detail_id: detail.job_seeker_detail_id,
              },
            });
          }
        }
      }

      // 3. EXPERIENCE
      const safeDate = (dateStr: string) => {
        if (!dateStr || dateStr.toLowerCase() === 'present' || dateStr.toLowerCase() === 'sekarang') return null;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
      };

      if (experiencesFromCv.length > 0) {
        for (const exp of experiencesFromCv) {
          await this.prisma.experiences.create({
            data: {
              job_seeker_detail_id: detail.job_seeker_detail_id,
              experience_title: exp.title || 'Experience',
              company_name: exp.company || 'Unknown',
              employment_type: exp.employment_type || 'Full-time',
              location_type: exp.location_type || 'On-site',
              location: exp.location || 'Jakarta',
              description: (exp.description || '').substring(0, 250),
              start_date: safeDate(exp.start_date),
              end_date: safeDate(exp.end_date)
            },
          });
        }
      } else if (parsedData.experience) {
        await this.prisma.experiences.create({
          data: {
            job_seeker_detail_id: detail.job_seeker_detail_id,
            experience_title: 'Experience from CV',
            company_name: 'Various',
            description: parsedData.experience.substring(0, 250),
          },
        });
      }

      if (educationFromCv.length > 0) {
        const existingeducation = await this.prisma.education.findMany({
          where: { job_seeker_detail_id: detail.job_seeker_detail_id },
        });

        for (const edu of educationFromCv) {
          if (edu.university && edu.university !== 'Extracted University' && edu.university !== 'From CV') {
            const isDuplicate = existingeducation.some(existing =>
              existing.university_name.toLowerCase() === edu.university.toLowerCase() &&
              (existing.degree || '').toLowerCase() === (edu.degree || '').toLowerCase() &&
              (existing.major || '').toLowerCase() === (edu.major || '').toLowerCase()
            );

            if (isDuplicate) continue;

            const validUniv = await this.prisma.university_details.findFirst({
              where: {
                university_name: {
                  contains: edu.university,
                }
              }
            });

            await this.prisma.education.create({
              data: {
                job_seeker_detail_id: detail.job_seeker_detail_id,
                university_name: validUniv ? validUniv.university_name : (edu.university || 'Unknown'),
                degree: edu.degree || 'Auto-filled',
                major: edu.major || 'General',
                grade: edu.grade || null,
                start_date: safeDate(edu.start_date) || new Date('2020-01-01'),
                end_date: safeDate(edu.end_date),
              },
            });
          }
        }
      }

      // 3.5 PERSONAL_INFO
      if (parsedData.address || parsedData.date_of_birth || parsedData.phone) {
        let dobDate = null;
        if (parsedData.date_of_birth) {
          const parsedDate = new Date(parsedData.date_of_birth);
          if (!isNaN(parsedDate.getTime())) {
            dobDate = parsedDate;
          }
        }
        await this.prisma.personal_info.upsert({
          where: { job_seeker_detail_id: detail.job_seeker_detail_id },
          update: {
            ...(parsedData.address && { address: parsedData.address }),
            ...(parsedData.phone && { phone_number: parsedData.phone.substring(0, 15) }),
            ...(dobDate && { date_of_birth: dobDate }),
          },
          create: {
            job_seeker_detail_id: detail.job_seeker_detail_id,
            address: parsedData.address || null,
            phone_number: parsedData.phone ? parsedData.phone.substring(0, 15) : null,
            date_of_birth: dobDate,
          }
        });
      }

      // 4. SUMMARY
      if (parsedData.personal_summary) {
        await this.prisma.job_seeker_details.update({
          where: { job_seeker_detail_id: detail.job_seeker_detail_id },
          data: { personal_summary: parsedData.personal_summary }
        });
      }

      // 5. PROJECTS
      if (projectsFromCv.length > 0) {
        for (const proj of projectsFromCv) {
          await this.prisma.projects.create({
            data: {
              job_seeker_detail_id: detail.job_seeker_detail_id,
              project_name: proj.title || 'Project from CV',
              description: (proj.description || '').substring(0, 250),
              start_date: safeDate(proj.start_date),
              end_date: safeDate(proj.end_date)
            },
          });
        }
      } else if (parsedData.projects) {
        await this.prisma.projects.create({
          data: {
            job_seeker_detail_id: detail.job_seeker_detail_id,
            project_name: 'Project from CV',
            description: parsedData.projects.substring(0, 250),
          },
        });
      }

      // 6. CERTIFICATIONS
      if (certificationsFromCv.length > 0) {
        for (const cert of certificationsFromCv) {
          await this.prisma.certifications.create({
            data: {
              job_seeker_detail_id: detail.job_seeker_detail_id,
              certification_name: cert.certification_name || cert.title || 'Certification from CV',
              issuing_organization: cert.issuing_organization || 'Extracted Org',
              credential_url: (cert.credential_url || cert.description || '').substring(0, 250),
              issue_date: safeDate(cert.issue_date) || new Date(),
              expiration_date: safeDate(cert.expiration_date),
            },
          });
        }
      } else if (parsedData.certifications) {
        const rawCert = Array.isArray(parsedData.certifications)
          ? parsedData.certifications.join(' ')
          : String(parsedData.certifications);

        await this.prisma.certifications.create({
          data: {
            job_seeker_detail_id: detail.job_seeker_detail_id,
            certification_name: 'Certification from CV',
            issuing_organization: 'Extracted Org',
            credential_url: rawCert.substring(0, 250),
            issue_date: new Date(),
          },
        });
      }

      // 7. LANGUAGES
      if (languagesFromCv.length > 0) {
        const existingLangs = await this.prisma.languages.findMany({
          where: { job_seeker_detail_id: detail.job_seeker_detail_id },
        });
        const existingLangNames = existingLangs.map((l) => l.language_name.toLowerCase());
        for (const lang of languagesFromCv) {
          if (!existingLangNames.includes(lang.toLowerCase())) {
            await this.prisma.languages.create({
              data: {
                language_name: lang,
                job_seeker_detail_id: detail.job_seeker_detail_id,
              },
            });
          }
        }
      }

      return {
        status: 'success',
        message: 'CV data confirmed and profile updated',
        data: parsedData,
      };
    } catch (error) {
      console.error('Error confirming CV data:', error);
      throw new InternalServerErrorException(
        'Failed to confirm CV data: ' + error.message,
      );
    }
  }

  async deleteEducation(user: any) {
    if (user.role !== 'job_seeker') {
      throw new ForbiddenException('Only job seekers can use this feature');
    }

    const detail = await this.prisma.job_seeker_details.findUnique({
      where: { job_seeker_id: user.job_seeker_id },
    });

    if (!detail) {
      throw new BadRequestException('Job seeker profile details not found');
    }

    const existingEdu = await this.prisma.education.findFirst({
      where: { job_seeker_detail_id: detail.job_seeker_detail_id },
      orderBy: { start_date: 'desc' },
    });

    if (existingEdu) {
      await this.prisma.education.delete({
        where: { education_id: existingEdu.education_id },
      });
    }

    return {
      status: 'success',
      message: 'Education deleted successfully',
    };
  }
}
