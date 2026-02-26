import { RegisterService } from './register.service';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';
import { VerifyOTPDto } from './dto/verify-otp.dto';
import { RegisterUniversityDto } from './dto/register-university.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
export declare class RegisterController {
    private readonly registerService;
    constructor(registerService: RegisterService);
    registerJobSeeker(registerJobSeekerDto: RegisterJobSeekerDto): Promise<any>;
    registerCompany(registerCompanyDto: RegisterCompanyDto): Promise<any>;
    registerUniversity(registerUniversityDto: RegisterUniversityDto): Promise<any>;
    verifyOtp(verifyOtpDto: VerifyOTPDto): Promise<string>;
}
