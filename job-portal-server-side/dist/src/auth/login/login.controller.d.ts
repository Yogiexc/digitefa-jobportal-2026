import { LoginService } from './login.service';
import { LoginJobSeekerDto } from './dto/loginJobSeeker.dto';
import { LoginCMSDto } from './dto/loginCMS.dto';
import { LoginGoogleDto } from './dto/loginGoogle.dto';
export declare class LoginController {
    private loginService;
    constructor(loginService: LoginService);
    loginGoogle(loginGoogleDto: LoginGoogleDto): Promise<{
        status: string;
        message: string;
        data: {
            token: string;
            user: {
                [k: string]: string | Date;
            };
        };
    }>;
    loginJobSeeker(loginJobSeekerDto: LoginJobSeekerDto): Promise<{
        status: string;
        message: string;
        data: {
            token: string;
            user: {
                [k: string]: unknown;
            };
        };
    }>;
    loginCMS(loginCMSDto: LoginCMSDto): Promise<{
        status: string;
        message: string;
        data: {
            token: string;
            user: {
                [k: string]: unknown;
            };
        };
    }>;
}
