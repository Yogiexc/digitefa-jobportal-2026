import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { LoginJobSeekerDto } from './dto/loginJobSeeker.dto';
import { LoginCMSDto } from './dto/loginCMS.dto';
import { SsoLmsDto } from './dto/ssoLms.dto';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async validateJobSeeker(loginJobSeekerDto: LoginJobSeekerDto): Promise<any> {
    const [job_seeker, university, admin, company] = await Promise.all([
      this.prisma.job_seekers.findUnique({
        where: { email: loginJobSeekerDto.email },
      }),
      this.prisma.universities.findUnique({
        where: { email: loginJobSeekerDto.email },
      }),
      this.prisma.admins.findUnique({
        where: { email: loginJobSeekerDto.email },
      }),
      this.prisma.companies.findUnique({
        where: { email: loginJobSeekerDto.email },
      }),
    ]);
    if (!job_seeker && !university && !admin && !company) {
      throw new NotFoundException(
        'User not found. Please register to create an account.',
      );
    }
    if (company || university || admin) {
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
      if (admin) {
        throw new ConflictException(
          'Email is already registered in CMS. Please login instead.',
        );
      }
    }
    if (
      !(await bcrypt.compareSync(
        loginJobSeekerDto.password,
        job_seeker.password,
      ))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const job_seeker_detail = { ...job_seeker, role: 'job_seeker' };
    return job_seeker_detail;
  }

  async validateCMS(loginCMSDto: LoginCMSDto): Promise<any> {
    const [job_seeker, university, admin, company] = await Promise.all([
      this.prisma.job_seekers.findUnique({
        where: { email: loginCMSDto.email },
      }),
      this.prisma.universities.findUnique({
        where: { email: loginCMSDto.email },
      }),
      this.prisma.admins.findUnique({ where: { email: loginCMSDto.email } }),
      this.prisma.companies.findUnique({ where: { email: loginCMSDto.email } }),
    ]);

    // Not found
    if (!job_seeker && !university && !admin && !company) {
      throw new NotFoundException(
        'User not found. Please register to create an account.',
      );
    }
    if (job_seeker && job_seeker.verified === 'true') {
      throw new ConflictException(
        'Email is already registered for job seeker. Please login for job seeker.',
      );
    }

    // Check the password
    let user;
    if (
      university &&
      (await bcrypt.compare(loginCMSDto.password, university.password))
    ) {
      user = { ...university, role: 'university' };
    } else if (
      company &&
      (await bcrypt.compare(loginCMSDto.password, company.password))
    ) {
      user = { ...company, role: 'company' };
    } else if (
      admin &&
      (await bcrypt.compare(loginCMSDto.password, admin.password))
    ) {
      user = { ...admin, role: 'superadmin' };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: any) {
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
    } else if (user.role === 'superadmin') {
      payload = { admin_id: user.admin_id, email: user.email, role: user.role };
    }
    const token = await this.jwtService.signAsync(payload);
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
      message: 'Login Successful',
      data: {
        token: token,
        user: detailUser,
      },
    };
  }

  async loginGoogle(credential: any) {
    const userData = this.jwtService.decode(credential);
    if (!userData) {
      throw new UnauthorizedException('Invalid credentials');
    }
    let user = await this.prisma.job_seekers.findUnique({
      where: { email: userData.email },
    });
    if (!user) {
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await this.prisma.job_seekers.create({
        data: {
          email: userData.email,
          full_name: userData.name,
          verified: 'true',
          password: hashedPassword,
          job_seeker_detail: {
            create: {},
          },
        },
      });
    }
    const payload = {
      job_seeker_id: user.job_seeker_id,
      email: user.email,
      role: 'job_seeker',
    };
    const token = await this.jwtService.signAsync(payload);
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
      message: 'Login Successful',
      data: {
        token: token,
        user: detailUser,
      },
    };
  }

  async ssoLms(dto: SsoLmsDto) {
    let user = await this.prisma.job_seekers.findFirst({
      where: {
        OR: [
          { lmsUserId: dto.lmsUserId },
          { email: dto.email }
        ]
      }
    });

    if (!user) {
      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await this.prisma.job_seekers.create({
        data: {
          email: dto.email,
          full_name: dto.name,
          verified: 'true',
          password: hashedPassword,
          lmsUserId: dto.lmsUserId,
          lmsLinkedAt: new Date(),
          job_seeker_detail: {
            create: {},
          },
        },
      });
    } else if (!user.lmsUserId) {
      // user exists by email but lmsUserId not linked yet
      user = await this.prisma.job_seekers.update({
        where: { job_seeker_id: user.job_seeker_id },
        data: {
          lmsUserId: dto.lmsUserId,
          lmsLinkedAt: new Date(),
        }
      });
    }

    const payload = {
      job_seeker_id: user.job_seeker_id,
      email: user.email,
      role: 'job_seeker',
    };
    const token = await this.jwtService.signAsync(payload);
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
      message: 'Login Successful',
      data: {
        token: token,
        user: detailUser,
      },
    };
  }

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
      });
      users = { ...users, role: 'university' };
    } else if (user.role === 'company') {
      users = await this.prisma.companies.findUnique({
        where: { company_id: user.company_id },
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
        ([key]) => !['password', 'updated_at', 'created_at'].includes(key),
      ),
    );
    return {
      status: 'success',
      message: 'Login Successful',
      data: {
        user: detailUser,
      },
    };
  }
}
