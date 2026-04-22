import { ApiProperty } from '@nestjs/swagger';

export class ConfirmAutofillDto {
  @ApiProperty({
    description: 'Data hasil parsing dari CV (Personal Summary, Education, Experience, dll)',
    example: {
      personalSummary: 'I am a highly motivated software engineer...',
      education: [{ degree: 'S1 Computer Science', year: '2022' }],
    },
  })
  parsedData: any;
}
