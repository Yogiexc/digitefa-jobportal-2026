import { SettingsService } from './settings.service';
import { ChangeSecureLog } from './dto/changeSecureLog.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
