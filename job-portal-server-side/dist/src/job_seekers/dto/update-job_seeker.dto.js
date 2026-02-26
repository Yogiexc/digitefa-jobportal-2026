"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateJobSeekerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_job_seeker_dto_1 = require("./create-job_seeker.dto");
class UpdateJobSeekerDto extends (0, swagger_1.PartialType)(create_job_seeker_dto_1.CreateJobSeekerDto) {
}
exports.UpdateJobSeekerDto = UpdateJobSeekerDto;
//# sourceMappingURL=update-job_seeker.dto.js.map