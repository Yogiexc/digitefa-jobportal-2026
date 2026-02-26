import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { RegisterUniversityDto } from './dto/register-university.dto';
import { JwtService } from '@nestjs/jwt';
export declare class RegisterService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    registerJobSeeker(registerJobSeekerDto: RegisterJobSeekerDto): Promise<any>;
    registerCompany(registerCompanyDto: RegisterCompanyDto): Promise<any>;
    registerUniversity(registerUniversityDto: RegisterUniversityDto): Promise<any>;
    sendOtpEmail(email: string, otp: string): Promise<void>;
    verifyOtp(email: string, otp: string): Promise<any>;
}
