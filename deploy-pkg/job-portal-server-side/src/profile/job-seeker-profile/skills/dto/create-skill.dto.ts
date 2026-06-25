import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSkillDto {
    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'The name of the skill. Must be unique (case-insensitive) for the user.',
        default: "Java",
    })
    skill_name: string;
}
