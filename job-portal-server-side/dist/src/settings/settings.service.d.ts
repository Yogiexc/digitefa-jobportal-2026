import { PrismaService } from '../../prisma/prisma.service';
import { ChangeSecureLog } from './dto/changeSecureLog.dto';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    changeSecureLog(changeSecureLog: ChangeSecureLog): Promise<{
        status: string;
        message: string;
    }>;
    getSecureLogStatus(): Promise<{
        status: string;
        data: {
            secureLogEnabled: string;
            secureLogInterval: number;
        };
    }>;
}
