import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ChangeSecureLog } from './dto/changeSecureLog.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) { }
  async changeSecureLog(changeSecureLog: ChangeSecureLog) {
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
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to change status of secure log');
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
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to get secure log status');
    }
  }
}
