import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';
import { otpChangeEmailTemplate } from './email-templates/otp-change-email-template';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { VerifyChangeEmailDto } from './dto/verify-change-email.dto';

@Injectable()
export class ProfileService {
<<<<<<< HEAD
  constructor(private prisma: PrismaService) { }
=======
  constructor(private prisma: PrismaService) {}
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204
  async getUser(user: any) {
    let users;
    if (user.role === 'job_seeker') {
      users = await this.prisma.job_seekers.findUnique({
        where: { job_seeker_id: user.job_seeker_id },
      });
      users = { ...users, role: 'job_seeker' };
    } else if (user.role === 'university') {
      users = await this.prisma.universities.findUnique({
        where: { university_id: user.university_id },
        include: {
          university_detail: true,
        },
      });
      users = { ...users, role: 'university' };
    } else if (user.role === 'company') {
      users = await this.prisma.companies.findUnique({
        where: { company_id: user.company_id },
        include: {
          company_detail: true,
        },
      });
      users = { ...users, role: 'company' };
    } else if (user.role === 'superadmin') {
      users = await this.prisma.admins.findUnique({
        where: { admin_id: user.admin_id },
      });
      users = { ...users, role: 'superadmin' };
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
      secure: false, // true for 465, false for other ports
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
      from: '"Digitefa" <no-reply@zenify.my.id>',
      to: email,
      subject: 'Digitefa OTP Verification Code',
      text: `Your OTP code is ${otp}`,
      html: htmlContent,
    });
  }

  async getProfilePicture(user: any) {
    let users;
    let picture;
    if (user.role === 'job_seeker') {
      users = await this.prisma.job_seeker_details.findFirst({
        where: {
          job_seeker_id: user.job_seeker_id,
        },
        select: {
          profile_picture_url: true,
        },
      });
      picture = users.profile_picture_url;
    } else if (user.role === 'university') {
      users = await this.prisma.university_details.findUnique({
        where: {
          university_id: user.university_id,
        },
        select: {
          logo_url: true,
        },
      });
      picture = users.logo_url;
    } else if (user.role === 'company') {
      users = await this.prisma.company_details.findUnique({
        where: {
          company_id: user.company_id,
        },
        select: {
          logo_url: true,
        },
      });
      picture = users.logo_url;
    } else if (user.role === 'superadmin') {
      users = await this.prisma.admins.findUnique({
        where: {
          admin_id: user.admin_id,
        },
      });
      picture = null;
    }
    if (!users) {
      throw new UnauthorizedException('Token not found!, Please login again');
    }
    return {
      status: 'success',
      message: 'Profile picture fetched successfully',
      data: picture,
    };
  }

<<<<<<< HEAD
  async cvAutofill(user: any, file: any) {
=======
  async cvAutofill(user: any, file: Express.Multer.File) {
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204
    if (user.role !== 'job_seeker') {
      throw new ForbiddenException('Only job seekers can use this feature');
    }

    const gpythonUrl = process.env.URL_SERVER_PYTHON;
    if (!gpythonUrl) {
      throw new InternalServerErrorException(
        'Python microservice URL not configured',
      );
    }

<<<<<<< HEAD
    // @ts-ignore
    const formData = new FormData();
    // @ts-ignore
=======
    const formData = new FormData();
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append('file', blob, file.originalname);

    try {
<<<<<<< HEAD
      // @ts-ignore
=======
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204
      const response = await fetch(`${gpythonUrl}/parse-cv`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new InternalServerErrorException(
          `Python API error: ${response.statusText}`,
        );
      }

      const result = await response.json();
      const parsedData = result.parsed_data;

      const detail = await this.prisma.job_seeker_details.findUnique({
        where: { job_seeker_id: user.job_seeker_id },
      });

      if (!detail) {
        throw new BadRequestException('Job seeker profile details not found');
      }

      // Auto-fill extracted info (saving to DB to make it true autofill)
      if (parsedData.skills && parsedData.skills.length > 0) {
        const existingSkills = await this.prisma.skills.findMany({
          where: { job_seeker_detail_id: detail.job_seeker_detail_id },
        });
        const existingSkillNames = existingSkills.map((s) =>
          s.skill_name.toLowerCase(),
        );

        for (const skill of parsedData.skills) {
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

<<<<<<< HEAD
      if (parsedData.experience_structured && parsedData.experience_structured.length > 0) {
        for (const exp of parsedData.experience_structured) {
          await this.prisma.experiences.create({
            data: {
              job_seeker_detail_id: detail.job_seeker_detail_id,
              experience_title: exp.title || 'Experience',
              company_name: exp.company || 'Unknown',
              description: (exp.description || '').substring(0, 250), // Prisma varchar 255
            },
          });
        }
      } else if (parsedData.experience) {
=======
      if (parsedData.experience) {
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204
        await this.prisma.experiences.create({
          data: {
            job_seeker_detail_id: detail.job_seeker_detail_id,
            experience_title: 'Experience from CV',
            company_name: 'Various',
<<<<<<< HEAD
            description: parsedData.experience.substring(0, 250),
=======
            description: parsedData.experience,
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204
          },
        });
      }

<<<<<<< HEAD
      if (parsedData.education_structured && parsedData.education_structured.length > 0) {
        // Find and delete existing education to prevent Unique Constraint failure
        const existingEdu = await this.prisma.education.findUnique({
          where: { job_seeker_detail_id: detail.job_seeker_detail_id },
        });
        if (existingEdu) {
          await this.prisma.education.delete({
            where: { education_id: existingEdu.education_id },
          });
        }

        for (const edu of parsedData.education_structured) {
          await this.prisma.education.create({
            data: {
              job_seeker_detail_id: detail.job_seeker_detail_id,
              university_name: edu.university || 'From CV',
              degree: edu.degree || 'Auto-filled',
              major: edu.major || 'General',
              start_date: new Date(),
            },
          });
          // Break after creating the first education because education is a 1-to-1 model
          break;
        }
      } else if (parsedData.education) {
        // Find and delete existing education
        const existingEdu = await this.prisma.education.findUnique({
          where: { job_seeker_detail_id: detail.job_seeker_detail_id },
        });
        if (existingEdu) {
          await this.prisma.education.delete({
            where: { education_id: existingEdu.education_id },
          });
        }

=======
      if (parsedData.education) {
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204
        await this.prisma.education.create({
          data: {
            job_seeker_detail_id: detail.job_seeker_detail_id,
            university_name: 'From CV',
            degree: 'Auto-filled',
            major: 'General',
            start_date: new Date(),
          },
        });
      }

      return {
        status: 'success',
        message: 'CV processed and profile updated',
        data: parsedData,
      };
    } catch (error) {
      console.error('Error autofilling CV:', error);
      throw new InternalServerErrorException(
        'Failed to process CV: ' + error.message,
      );
    }
  }
<<<<<<< HEAD

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

    const existingEdu = await this.prisma.education.findUnique({
      where: { job_seeker_detail_id: detail.job_seeker_detail_id },
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
=======
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204
}
