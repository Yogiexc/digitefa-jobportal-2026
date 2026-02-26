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
exports.CreateCompanyProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCompanyProfileDto {
}
exports.CreateCompanyProfileDto = CreateCompanyProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'Upload Logo Company File (jpg, jpeg, png)',
        default: 'File Logo Company'
    }),
    __metadata("design:type", Object)
], CreateCompanyProfileDto.prototype, "upload_logo", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Market Name of the company',
        required: true,
        default: 'KODEGIRI',
    }),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "market_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Category of the company',
        required: true,
        default: 'Technology',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Size of the company',
        required: true,
        default: '1-10',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "company_size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Description of the company',
        required: true,
        default: 'KODEGIRI is a technology company that focuses on developing software products.',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Country where the company is located',
        required: true,
        default: 'Indonesia',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Province where the company is located',
        required: true,
        default: 'Central Java',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'City where the company is located',
        required: true,
        default: 'Yogyakarta',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'District where the company is located',
        required: true,
        default: 'Sleman',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Full address of the company',
        required: true,
        default: 'Jalan Waras, Panggung Sari, Sariharjo, Ngaglik',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "full_address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Postal code of the company location',
        required: true,
        default: '55284',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "postal_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Website of the company',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Facebook URL of the company',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "facebook_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Twitter URL of the company',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "twitter_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Instagram URL of the company',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "instagram_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'YouTube URL of the company',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCompanyProfileDto.prototype, "youtube_url", void 0);
//# sourceMappingURL=create-company-profile.dto.js.map