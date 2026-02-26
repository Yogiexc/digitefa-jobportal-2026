"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SettingsService = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async changeSecureLog(changeSecureLog) {
        try {
            const { interval, status } = changeSecureLog;
            await this.prisma.settings.upsert({
                where: { key: 'secureLogEnabled' },
                update: { value: status },
                create: { key: "secureLogEnabled", value: status },
            });
            await this.prisma.settings.upsert({
                where: { key: 'secureLogInterval' },
                update: { value: interval },
                create: { key: "secureLogInterval", value: interval },
            });
            return {
                status: 'success',
                message: 'Secure log status changed successfully',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to change status of secure log');
        }
    }
    async getSecureLogStatus() {
        try {
            let secureLogEnabled = await this.prisma.settings.findUnique({
                where: { key: 'secureLogEnabled' },
            });
            let secureLogInterval = await this.prisma.settings.findUnique({
                where: { key: 'secureLogInterval' },
            });
            if (!secureLogEnabled) {
                secureLogEnabled = await this.prisma.settings.create({
                    data: { key: 'secureLogEnabled', value: 'false' },
                });
            }
            if (!secureLogInterval) {
                secureLogInterval = await this.prisma.settings.create({
                    data: { key: 'secureLogInterval', value: '60' },
                });
            }
            return {
                status: 'success',
                data: {
                    secureLogEnabled: secureLogEnabled.value,
                    secureLogInterval: Number(secureLogInterval.value),
                }
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to get secure log status');
        }
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map