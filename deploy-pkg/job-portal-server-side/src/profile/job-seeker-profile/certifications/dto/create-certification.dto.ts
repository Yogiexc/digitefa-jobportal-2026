import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCertificationDto {
    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: "Certified Information Systems Security Professional (CISSP)",
    })
    certification_name: string;

    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: "International Information System Security Certification Consortium (ISC)²",
    })
    issuing_organization: string;

    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: '2021-09',
    })
    issue_date: string;

    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: '2025-09',
    })
    expiration_date: string;

    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: 'Credential URL',
    })
    credential_url: string;
}
