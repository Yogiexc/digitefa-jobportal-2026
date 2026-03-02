import { PrismaService } from 'prisma/prisma.service';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
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
