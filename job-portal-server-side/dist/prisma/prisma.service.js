"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const moment = require("moment-timezone");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
        this.$use(async (params, next) => {
            const result = await next(params);
            const convertDates = (obj) => {
                if (Array.isArray(obj)) {
                    return obj.map(convertDates);
                }
                else if (obj !== null && typeof obj === 'object') {
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            const value = obj[key];
                            if (value instanceof Date) {
                                obj[key] = moment(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
                            }
                            else if (typeof value === 'string') {
                                const parsedDate = moment(value, moment.ISO_8601, true);
                                if (parsedDate.isValid()) {
                                    obj[key] = parsedDate.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
                                }
                            }
                            else if (typeof value === 'object') {
                                obj[key] = convertDates(value);
                            }
                        }
                    }
                }
                return obj;
            };
            return convertDates(result);
        });
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map