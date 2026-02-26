import { ApiProperty } from '@nestjs/swagger';

export class LinkLmsAccountDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'secret123' })
  password: string;
}
