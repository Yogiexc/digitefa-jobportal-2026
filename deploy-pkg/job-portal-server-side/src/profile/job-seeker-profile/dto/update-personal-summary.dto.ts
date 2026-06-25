import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'minWords', async: false })
export class MinWordsConstraint implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    if (!text) return false;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length >= 3;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Personal summary must contain at least 3 words';
  }
}

export class UpdatePersonalSummaryDto {
    @IsString()
    @Validate(MinWordsConstraint)
    @MaxLength(700, { message: 'Personal summary cannot be longer than 700 characters' })
    @ApiProperty({
        type: String,
        description: 'Personal summary text. Must contain at least 3 words (excluding spaces) and be maximum 700 characters long.',
        default: 'Experienced Software Engineer in the information technology and services industry. Skilled in Java, Spring Boot, and MySQL.',
    })
    personal_summary: string;
}
