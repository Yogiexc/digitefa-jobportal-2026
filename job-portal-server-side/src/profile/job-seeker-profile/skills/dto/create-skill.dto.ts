import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSkillDto {
    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: "Skill 1",
    })
    skill_name: string;
}
