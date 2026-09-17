import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as moment from 'moment-timezone';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();

        // Tambahkan middleware untuk konversi waktu hanya pada operasi baca
        this.$use(async (params, next) => {
            const result = await next(params);

            // Fungsi rekursif untuk konversi date
            const convertDates = (obj) => {
                if (Array.isArray(obj)) {
                    return obj.map(convertDates);
                } else if (obj !== null && typeof obj === 'object') {
                    for (const key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            const value = obj[key];
                            if (value instanceof Date) {
                                // Jika value adalah instance dari Date, formatkan dengan moment
                                obj[key] = moment(value).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
                            } else if (typeof value === 'string') {
                                // Jika value adalah string, periksa jika formatnya valid ISO
                                const parsedDate = moment(value, moment.ISO_8601, true);
                                if (parsedDate.isValid()) {
                                    obj[key] = parsedDate.tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
                                }
                            } else if (typeof value === 'object') {
                                // Rekursif pada nested object
                                obj[key] = convertDates(value);
                            }
                        }
                    }
                }
                return obj;
            };

            // Terapkan konversi ke hasil
            return convertDates(result);
        });
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
