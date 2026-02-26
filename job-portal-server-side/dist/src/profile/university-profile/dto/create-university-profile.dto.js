"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUniversityProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUniversityProfileDto {
}
exports.CreateUniversityProfileDto = CreateUniversityProfileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'Upload Logo Company File (jpg, jpeg, png)',
        default: 'File Logo University',
    }),
    __metadata("design:type", Object)
], CreateUniversityProfileDto.prototype, "upload_logo", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        required: true,
        default: '0123456789',
    }),
    __metadata("design:type", String)
], CreateUniversityProfileDto.prototype, "phone_number", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        required: true,
        default: 'State University',
    }),
    __metadata("design:type", String)
], CreateUniversityProfileDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        required: true,
        default: 'Indonesia',
    }),
    __metadata("design:type", String)
], CreateUniversityProfileDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        required: true,
        default: 'Central Java',
    }),
    __metadata("design:type", String)
], CreateUniversityProfileDto.prototype, "province", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        required: true,
        default: 'Surakarta',
    }),
    __metadata("design:type", String)
], CreateUniversityProfileDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        required: true,
        default: 'Jebres',
    }),
    __metadata("design:type", String)
], CreateUniversityProfileDto.prototype, "district", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        required: true,
        default: 'Jalan Ir. Sutami No.36',
    }),
    __metadata("design:type", String)
], CreateUniversityProfileDto.prototype, "full_address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        required: true,
        default: '57126',
    }),
    __metadata("design:type", String)
], CreateUniversityProfileDto.prototype, "postal_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a optional property',
    }),
    __metadata("design:type", String)
], CreateUniversityProfileDto.prototype, "website", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a optional property',
    }),
    __metadata("design:type", String)
], CreateUniversityProfileDto.prototype, "facebook_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a optional property',
    }),
    __metadata("design:type", String)
], CreateUniversityProfileDto.prototype, "twitter_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a optional property',
    }),
    __metadata("design:type", String)
], CreateUniversityProfileDto.prototype, "instagram_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a optional property',
    }),
    __metadata("design:type", String)
], CreateUniversityProfileDto.prototype, "youtube_url", void 0);
//# sourceMappingURL=create-university-profile.dto.js.map