"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLanguageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_language_dto_1 = require("./create-language.dto");
class UpdateLanguageDto extends (0, swagger_1.PartialType)(create_language_dto_1.CreateLanguageDto) {
}
exports.UpdateLanguageDto = UpdateLanguageDto;
//# sourceMappingURL=update-language.dto.js.map