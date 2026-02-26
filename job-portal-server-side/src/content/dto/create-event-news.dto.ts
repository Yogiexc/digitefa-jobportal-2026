import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreateEventNewsDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Upload Image Content File (jpg, jpeg, png)',
        default: 'File Logo Content Image'
    })
    upload_image?: any;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Event or news title',
    })
    title: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        required: false,
        description: 'This is a required property',
        default: 'event-or-news-slug',
    })
    slug: string;

    @IsEnum(['event', 'news'])
    @ApiProperty({
        enum: ['event', 'news'],
        description: 'This is a required property',
        default: 'event',
    })
    category: 'event' | 'news';

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: Date,
        required: false,
        description: 'This is a required property',
        default: '2024-03-21 20:00:00',
    })
    event_date: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Content of the event or news page',
    })
    content: string;
}
