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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const common_1 = require("@nestjs/common");
const student_service_1 = require("./student.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let StudentController = class StudentController {
    constructor(studentService) {
        this.studentService = studentService;
    }
    findAllStudents(req, page, pageSize, search, sortBy, sortOrder, classYear, startDate, endDate) {
        return this.studentService.findAllStudents(req.user, { page, pageSize, search, sortBy, sortOrder, classYear, startDate, endDate });
    }
    getStudentByJobSeekerId(req, job_seeker_id) {
        return this.studentService.getStudentByJobSeekerId(req.user, job_seeker_id);
    }
    async getStudentEmploymentHistory(req, page, pageSize, search, sortBy, sortOrder, classYear, status, employmentType) {
        return this.studentService.getStudentEmploymentHistory(req.user, { page, pageSize, search, sortBy, sortOrder, classYear, status, employmentType });
    }
    exportRegisteredStudent(req, format, start, end, res) {
        return this.studentService.exportRegisteredStudent(req.user, start, end, format, res);
    }
    exportHistoryStudent(req, format, start, end, res) {
        return this.studentService.exportHistoryStudent(req.user, start, end, format, res);
    }
};
exports.StudentController = StudentController;
__decorate([
    (0, common_1.Get)('management/registered'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['university'])),
    (0, swagger_1.ApiOperation)({ summary: 'List all students Registered to university' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, example: '', description: 'Search term' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: '', description: 'Sort order' }),
    (0, swagger_1.ApiQuery)({ name: 'classYear', required: false, type: Number, description: 'Class year' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Number, description: 'Start date' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Number, description: 'End date' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('sortBy')),
    __param(5, (0, common_1.Query)('sortOrder')),
    __param(6, (0, common_1.Query)('classYear')),
    __param(7, (0, common_1.Query)('startDate')),
    __param(8, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, String, Number, String, String]),
    __metadata("design:returntype", void 0)
], StudentController.prototype, "findAllStudents", null);
__decorate([
    (0, common_1.Get)('/:job_seeker_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['university'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get student detail by job seeker id' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('job_seeker_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StudentController.prototype, "getStudentByJobSeekerId", null);
__decorate([
    (0, common_1.Get)('management/history'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['university'])),
    (0, swagger_1.ApiOperation)({ summary: 'List all student employment history' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, example: '', description: 'Search term' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: '', description: 'Sort order' }),
    (0, swagger_1.ApiQuery)({ name: 'classYear', required: false, type: Number, description: 'Class year' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['pending', 'accepted', 'rejected'], description: 'Employment status' }),
    (0, swagger_1.ApiQuery)({ name: 'employmentType', required: false, enum: ['freelance', 'full_time', 'part_time'], description: 'Employment type' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('sortBy')),
    __param(5, (0, common_1.Query)('sortOrder')),
    __param(6, (0, common_1.Query)('classYear')),
    __param(7, (0, common_1.Query)('status')),
    __param(8, (0, common_1.Query)('employmentType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, String, Number, String, String]),
    __metadata("design:returntype", Promise)
], StudentController.prototype, "getStudentEmploymentHistory", null);
__decorate([
    (0, common_1.Post)('management/registered/export'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['university'])),
    (0, swagger_1.ApiOperation)({ summary: 'Export Registered Student' }),
    (0, swagger_1.ApiQuery)({ name: 'format', required: true, enum: ['csv', 'xlsx'], description: 'Export format' }),
    (0, swagger_1.ApiQuery)({ name: 'start', required: true, type: Number, description: 'Start row' }),
    (0, swagger_1.ApiQuery)({ name: 'end', required: true, type: Number, description: 'End row' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('format')),
    __param(2, (0, common_1.Query)('start')),
    __param(3, (0, common_1.Query)('end')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number, Object]),
    __metadata("design:returntype", void 0)
], StudentController.prototype, "exportRegisteredStudent", null);
__decorate([
    (0, common_1.Post)('management/history/export'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['university'])),
    (0, swagger_1.ApiOperation)({ summary: 'Export Student Employment History' }),
    (0, swagger_1.ApiQuery)({ name: 'format', required: true, enum: ['csv', 'xlsx'], description: 'Export format' }),
    (0, swagger_1.ApiQuery)({ name: 'start', required: true, type: Number, description: 'Start row' }),
    (0, swagger_1.ApiQuery)({ name: 'end', required: true, type: Number, description: 'End row' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('format')),
    __param(2, (0, common_1.Query)('start')),
    __param(3, (0, common_1.Query)('end')),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number, Object]),
    __metadata("design:returntype", void 0)
], StudentController.prototype, "exportHistoryStudent", null);
exports.StudentController = StudentController = __decorate([
    (0, swagger_1.ApiTags)('student-management'),
    (0, common_1.Controller)('student'),
    __metadata("design:paramtypes", [student_service_1.StudentService])
], StudentController);
//# sourceMappingURL=student.controller.js.map