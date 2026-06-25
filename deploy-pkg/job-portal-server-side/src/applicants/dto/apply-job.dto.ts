import { ApiProperty } from "@nestjs/swagger";

export class ApplyJobDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Upload CV file (jpg, jpeg, png, pdf)',
        default: 'File CV',
    })
    upload_resume?: any;

    @ApiProperty({
        type: 'string',
        description: 'Expected Salary',
        default: '10000000',
    })
    expected_salary?: string;

    @ApiProperty({
        type: 'string',
        description: 'Experience Years',
        default: '2',
    })
    experience_years?: string;
}
