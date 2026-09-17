import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { validate } from 'class-validator';
import { otpEmailTemplate } from './email-templates/otp-email-template';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { RegisterUniversityDto } from './dto/register-university.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RegisterService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async registerJobSeeker(
    registerJobSeekerDto: RegisterJobSeekerDto,
  ): Promise<any> {
    const errors = await validate(registerJobSeekerDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Check if email is already registered
    const job_seeker = await this.prisma.job_seekers.findUnique({
      where: { email: registerJobSeekerDto.email },
    });
    const company = await this.prisma.companies.findUnique({
      where: { email: registerJobSeekerDto.email },
    });
    const university = await this.prisma.universities.findUnique({
      where: { email: registerJobSeekerDto.email },
    });
    const admin = await this.prisma.admins.findUnique({
      where: { email: registerJobSeekerDto.email },
    });

    if (job_seeker || company || university || admin) {
      if (company && company.verified === 'true') {
        throw new ConflictException(
          'Email is already registered and verified for company. Please login for company.',
        );
      }
      if (university && university.verified === 'true') {
        throw new ConflictException(
          'Email is already registered and verified for university. Please login for university.',
        );
      }
      if (job_seeker && job_seeker.verified === 'true') {
        throw new ConflictException(
          'Email is already registered as job seeker. Please login instead.',
        );
      }
      if (admin) {
        throw new ConflictException(
          'Email is already registered in this platform. Please login instead.',
        );
      }
    }

    const { email, full_name, password } = registerJobSeekerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(1000, 9999).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    try {
      if (job_seeker) {
        if (job_seeker.verified === 'false') {
          await this.prisma.job_seekers.update({
            where: { job_seeker_id: job_seeker.job_seeker_id },
            data: {
              email,
              full_name,
              password: hashedPassword,
              otp: otpHash,
              otpExpires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
            },
          });
        }
      } else {
        await this.prisma.job_seekers.create({
          data: {
            email,
            full_name,
            password: hashedPassword,
            otp: otpHash,
            otpExpires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
            job_seeker_detail: {
              create: {},
            },
          },
        });
      }

      try {
        await this.sendOtpEmail(email, otp);
      } catch (err) {
        console.error('Failed to send OTP email. For development, OTP is:', otp);
      }

      return {
        status: 'success',
        message:
          'OTP sent successfully.Please check your email for the OTP code.',
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Registration error: ' + (error.message || error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async registerCompany(registerCompanyDto: RegisterCompanyDto): Promise<any> {
    const errors = await validate(registerCompanyDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Check if email is already registered
    const job_seeker = await this.prisma.job_seekers.findUnique({
      where: { email: registerCompanyDto.email },
    });
    const company = await this.prisma.companies.findUnique({
      where: { email: registerCompanyDto.email },
    });
    const university = await this.prisma.universities.findUnique({
      where: { email: registerCompanyDto.email },
    });
    const admin = await this.prisma.admins.findUnique({
      where: { email: registerCompanyDto.email },
    });

    if (job_seeker || company || university || admin) {
      if (company && company.verified === 'true') {
        throw new ConflictException(
          'Email is already registered and verified for company. Please login for company.',
        );
      }
      if (university && university.verified === 'true') {
        throw new ConflictException(
          'Email is already registered and verified for university. Please login for university.',
        );
      }
      if (job_seeker && job_seeker.verified === 'true') {
        throw new ConflictException(
          'Email is already registered as job seeker. Please login instead.',
        );
      }
      if (admin) {
        throw new ConflictException(
          'Email is already registered as admin. Please login instead.',
        );
      }
    }

    const { legal_name, full_name, phone_number, email, password } =
      registerCompanyDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(1000, 9999).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    if (company) {
      if (company.verified === 'false') {
        await this.prisma.companies.update({
          where: { company_id: company.company_id },
          data: {
            email,
            full_name,
            phone_number,
            password: hashedPassword,
            otp: otpHash,
            otpExpires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
            company_detail: {
              upsert: {
                update: { legal_name },
                create: { legal_name },
              },
            },
          },
        });
      }
    } else {
      await this.prisma.companies.create({
        data: {
          email,
          full_name,
          phone_number,
          password: hashedPassword,
          otp: otpHash,
          otpExpires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
          company_detail: {
            create: {
              legal_name,
            },
          },
        },
      });
    }

    try {
      await this.sendOtpEmail(email, otp);
    } catch (err) {
      console.error('Failed to send OTP email. For development, OTP is:', otp);
    }

    return {
      status: 'success',
      message:
        'OTP sent successfully.Please check your email for the OTP code.',
    };
  }

  async registerUniversity(
    registerUniversityDto: RegisterUniversityDto,
  ): Promise<any> {
    const errors = await validate(registerUniversityDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    // Check if email is already registered
    const job_seeker = await this.prisma.job_seekers.findUnique({
      where: { email: registerUniversityDto.email },
    });
    const company = await this.prisma.companies.findUnique({
      where: { email: registerUniversityDto.email },
    });
    const university = await this.prisma.universities.findUnique({
      where: { email: registerUniversityDto.email },
    });
    const admin = await this.prisma.admins.findUnique({
      where: { email: registerUniversityDto.email },
    });

    if (job_seeker || company || university || admin) {
      if (company && company.verified === 'true') {
        throw new ConflictException(
          'Email is already registered and verified for company. Please login for company.',
        );
      }
      if (university && university.verified === 'true') {
        throw new ConflictException(
          'Email is already registered and verified for university. Please login for university.',
        );
      }
      if (job_seeker && job_seeker.verified === 'true') {
        throw new ConflictException(
          'Email is already registered as job seeker. Please login instead.',
        );
      }
      if (admin) {
        throw new ConflictException(
          'Email is already registered as admin. Please login instead.',
        );
      }
    }

    const { university_name, full_name, email, password } =
      registerUniversityDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(1000, 9999).toString();
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    if (university) {
      if (university.verified === 'false') {
        await this.prisma.universities.update({
          where: { university_id: university.university_id },
          data: {
            email,
            full_name,
            password: hashedPassword,
            otp: otpHash,
            otpExpires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
            university_detail: {
              upsert: {
                update: { university_name },
                create: { university_name },
              },
            },
          },
        });
      }
    } else {
      await this.prisma.universities.create({
        data: {
          email,
          full_name,
          password: hashedPassword,
          otp: otpHash,
          otpExpires: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
          university_detail: {
            create: {
              university_name,
            },
          },
        },
      });
    }

    try {
      await this.sendOtpEmail(email, otp);
    } catch (err) {
      console.error('Failed to send OTP email. For development, OTP is:', otp);
    }

    return {
      status: 'success',
      message:
        'OTP sent successfully.Please check your email for the OTP code.',
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

    const htmlContent = otpEmailTemplate(otp, email);

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

  async verifyOtp(email: string, otp: string): Promise<any> {
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex'); // Hash the OTP input
    const job_seeker = await this.prisma.job_seekers.findUnique({
      where: { email },
    });
    const company = await this.prisma.companies.findUnique({
      where: { email },
    });
    const university = await this.prisma.universities.findUnique({
      where: { email },
    });

    if (!job_seeker && !company && !university) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    console.log('[verifyOtp Debug] email:', email, 'otpHash:', otpHash);
    console.log('[verifyOtp Debug] Dates - now:', new Date(), ' company.otpExpires:', company?.otpExpires);
    console.log('[verifyOtp Debug] company:', !!company, 'otpMatch:', company?.otp === otpHash, 'unexpired:', company ? new Date() <= company.otpExpires : false);
    
    let user;
    if (job_seeker && job_seeker.otp === otpHash && new Date() <= new Date(job_seeker.otpExpires)) {
      // Update user verification
      user = await this.prisma.job_seekers.update({
        where: { email },
        data: {
          verified: 'true',
          otp: null,
          otpExpires: null,
        },
      });
      user.role = 'job_seeker';
    } else if (company && company.otp === otpHash && new Date() <= new Date(company.otpExpires)) {
      // Update user verification
      user = await this.prisma.companies.update({
        where: { email },
        data: {
          verified: 'true',
          otp: null,
          otpExpires: null,
        },
        include: { company_detail: true }
      });
      user.legal_name = user?.company_detail?.legal_name;
      user.role = 'company';
    } else if (university && university.otp === otpHash && new Date() <= new Date(university.otpExpires)) {
      // Update user verification
      user = await this.prisma.universities.update({
        where: { email },
        data: {
          verified: 'true',
          otp: null,
          otpExpires: null,
        },
        include: { university_detail: true }
      });
      user.university_name = user?.university_detail?.university_name;
      user.role = 'university';
    } else {
      throw new HttpException(
        'Invalid or expired OTP',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create payload and generate token
    let payload;
    if (user.role === 'job_seeker') {
      payload = {
        job_seeker_id: user.job_seeker_id,
        email: user.email,
        role: user.role,
      };
    } else if (user.role === 'university') {
      payload = {
        university_id: user.university_id,
        email: user.email,
        role: user.role,
      };
    } else if (user.role === 'company') {
      payload = {
        company_id: user.company_id,
        email: user.email,
        role: user.role,
      };
    }
    const token = await this.jwtService.signAsync(payload);

    // Remove sensitive information
    const detailUser = Object.fromEntries(
      Object.entries(user).filter(
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
      message: 'Email verified successfully.',
      data: {
        token: token,
        user: detailUser,
      },
    };
  }
}
