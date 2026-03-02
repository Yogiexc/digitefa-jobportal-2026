import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfilePictureDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Upload Profile Picture file (jpg, jpeg, png)',
        default: 'File CV',
    })
    profile_picture?: any;
}
