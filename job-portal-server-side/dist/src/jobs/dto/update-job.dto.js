"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateJobDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_job_dto_1 = require("./create-job.dto");
class UpdateJobDto extends (0, swagger_1.PartialType)(create_job_dto_1.CreateJobDto) {
}
exports.UpdateJobDto = UpdateJobDto;
//# sourceMappingURL=update-job.dto.js.map