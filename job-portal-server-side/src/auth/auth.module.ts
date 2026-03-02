import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'prisma/prisma.module';
import { RegisterModule } from './register/register.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
<<<<<<< HEAD
import { LoginModule } from './login/login.module';
=======
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204

@Module({
  imports: [
    PrismaModule,
    RegisterModule,
    ForgotPasswordModule,
<<<<<<< HEAD
    LoginModule,
=======
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204
  ],
  controllers: [AuthController],
  providers: [AuthService,]
})
export class AuthModule { }
