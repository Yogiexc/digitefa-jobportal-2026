import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'prisma/prisma.module';
import { RegisterModule } from './register/register.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';

@Module({
  imports: [
    PrismaModule,
    RegisterModule,
    ForgotPasswordModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,]
})
export class AuthModule { }
