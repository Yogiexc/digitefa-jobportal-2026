"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCompanyProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_company_profile_dto_1 = require("./create-company-profile.dto");
class UpdateCompanyProfileDto extends (0, swagger_1.PartialType)(create_company_profile_dto_1.CreateCompanyProfileDto) {
}
exports.UpdateCompanyProfileDto = UpdateCompanyProfileDto;
//# sourceMappingURL=update-company-profile.dto.js.map