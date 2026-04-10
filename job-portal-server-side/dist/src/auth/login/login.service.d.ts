import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { LoginJobSeekerDto } from './dto/loginJobSeeker.dto';
import { LoginCMSDto } from './dto/loginCMS.dto';
import { SsoLmsDto } from './dto/ssoLms.dto';
export declare class LoginService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateJobSeeker(loginJobSeekerDto: LoginJobSeekerDto): Promise<any>;
    validateCMS(loginCMSDto: LoginCMSDto): Promise<any>;
    login(user: any): Promise<{
        status: string;
        message: string;
        data: {
            token: string;
            user: {
                [k: string]: unknown;
            };
        };
    }>;
    loginGoogle(credential: any): Promise<{
        status: string;
        message: string;
        data: {
            token: string;
            user: {
                [k: string]: string | Date;
            };
        };
    }>;
    ssoLms(dto: SsoLmsDto): Promise<{
        status: string;
        message: string;
        data: {
            token: string;
            user: {
                [k: string]: string | Date;
            };
        };
    }>;
    getUser(user: any): Promise<{
        status: string;
        message: string;
        data: {
            user: {
                [k: string]: unknown;
            };
        };
    }>;
}
