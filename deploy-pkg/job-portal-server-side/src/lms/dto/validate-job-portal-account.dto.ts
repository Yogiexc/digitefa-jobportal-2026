import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ValidateJobPortalAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsUUID()
  @IsNotEmpty()
  lmsUserId: string;
}
