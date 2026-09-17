import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginGoogleDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'This is a required property',
    default: 'Google token',
  })
  credential: string;
}
