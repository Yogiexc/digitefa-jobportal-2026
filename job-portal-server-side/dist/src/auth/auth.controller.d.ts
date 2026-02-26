import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    user(req: any): Promise<{
        status: string;
        message: string;
        data: {
            user: {
                [k: string]: unknown;
            };
        };
    }>;
}
