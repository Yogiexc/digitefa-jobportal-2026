import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class UpdatePersonalSummaryDto {
    @IsString()
    @MaxLength(700, { message: 'Personal summary cannot be longer than 700 characters' })
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Experienced Software Engineer in the information technology and services industry. Skilled in Java, Spring Boot, and MySQL. Strong engineering professional with a Bachelor of Engineering focused in Computer Science from University.',
    })
    personal_summary: string;
}
