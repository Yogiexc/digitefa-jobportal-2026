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
exports.UpdatePersonalInfoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdatePersonalInfoDto {
}
exports.UpdatePersonalInfoDto = UpdatePersonalInfoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        default: 'New Job Seeker',
    }),
    __metadata("design:type", String)
], UpdatePersonalInfoDto.prototype, "full_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        default: 'Surakarta',
    }),
    __metadata("design:type", String)
], UpdatePersonalInfoDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a optional property',
        default: '081234567890',
    }),
    __metadata("design:type", String)
], UpdatePersonalInfoDto.prototype, "phone_number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, swagger_1.ApiProperty)({
        type: Date,
        description: 'This is a optional property',
        default: '1990-01-01',
    }),
    __metadata("design:type", Date)
], UpdatePersonalInfoDto.prototype, "date_of_birth", void 0);
//# sourceMappingURL=update-personal-info.dto.js.map