import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSkillsCategoryDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Category Name',
        required: true
    })
    category_name: string;
}
