"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdminDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_admins_dto_1 = require("./create-admins.dto");
class UpdateAdminDto extends (0, swagger_1.PartialType)(create_admins_dto_1.CreateAdminDto) {
}
exports.UpdateAdminDto = UpdateAdminDto;
//# sourceMappingURL=update-admins.dto.js.map