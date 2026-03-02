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
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const lodash_1 = require("lodash");
const ExcelJS = require("exceljs");
const moment = require("moment-timezone");
let StudentService = class StudentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllStudents(user, params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc', classYear = null, startDate = null, endDate = null } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = {
                education: {
                    university_id: user.university_id
                },
                ...(search && {
                    OR: [
                        { job_seeker: { full_name: { contains: search } } },
                        { job_seeker: { email: { contains: search } } },
                    ]
                }),
                ...(classYear && {
                    education: {
                        start_date: {
                            gte: new Date(`${classYear}-01-01`),
                            lte: new Date(`${classYear}-12-31`),
                        }
                    }
                }),
                ...(startDate && {
                    created_at: {
                        gte: new Date(startDate),
                    }
                }),
                ...(endDate && {
                    created_at: {
                        lte: new Date(endDate),
                    }
                })
            };
            const totalData = await this.prisma.job_seeker_details.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            const students = await this.prisma.job_seeker_details.findMany({
                where,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder
                },
                select: {
                    job_seeker_id: true,
                    created_at: true,
                    job_seeker: {
                        select: {
                            full_name: true,
                            email: true,
                        }
                    },
                    education: {
                        select: {
                            degree: true,
                            major: true,
                            start_date: true,
                            end_date: true,
                        }
                    }
                }
            });
            return {
                status: "success",
                message: 'Students retrieved successfully',
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: students
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve students');
        }
    }
    async getStudentByJobSeekerId(user, job_seeker_id) {
        try {
            let student = await this.prisma.job_seeker_details.findUnique({
                where: { job_seeker_id, education: { university_id: user.university_id } },
                include: {
                    job_seeker: true,
                    personal_info: true,
                    education: true,
                    experiences: true,
                    skills: true,
                    projects: true,
                    languages: true,
                    certifications: true,
                }
            });
            if (!student) {
                return {
                    status: "error",
                    message: 'Student not found',
                };
            }
            if (student) {
                student = (0, lodash_1.omit)(student, ['created_at', 'updated_at']);
            }
            if (student.job_seeker) {
                student.job_seeker = (0, lodash_1.omit)(student.job_seeker, ['password', 'otpExpires', 'otp', 'created_at', 'updated_at']);
            }
            if (student.personal_info) {
                student.personal_info = (0, lodash_1.omit)(student.personal_info, ['created_at', 'updated_at']);
            }
            if (student.education) {
                student.education = (0, lodash_1.omit)(student.education, ['created_at', 'updated_at']);
            }
            if (student.experiences) {
                student.experiences = student.experiences.map(exp => (0, lodash_1.omit)(exp, ['created_at', 'updated_at']));
            }
            if (student.skills) {
                student.skills = student.skills.map(skill => (0, lodash_1.omit)(skill, ['created_at', 'updated_at']));
            }
            if (student.projects) {
                student.projects = student.projects.map(project => (0, lodash_1.omit)(project, ['created_at', 'updated_at']));
            }
            if (student.languages) {
                student.languages = student.languages.map(lang => (0, lodash_1.omit)(lang, ['created_at', 'updated_at']));
            }
            if (student.certifications) {
                student.certifications = student.certifications.map(cert => (0, lodash_1.omit)(cert, ['created_at', 'updated_at']));
            }
            return {
                status: "success",
                message: 'Student retrieved successfully',
                data: student
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve student');
        }
    }
    async getStudentEmploymentHistory(user, params) {
        const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc', classYear = null, status = null, employmentType } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        try {
            const where = {
                job_seeker: {
                    job_seeker_detail: {
                        education: {
                            university_id: user.university_id
                        },
                    }
                },
                ...(search && {
                    OR: [
                        { job_seeker: { full_name: { contains: search } } },
                        { job_seeker: { email: { contains: search } } },
                    ]
                }),
                ...(classYear && {
                    job_seeker: {
                        job_seeker_detail: {
                            education: {
                                start_date: {
                                    gte: new Date(`${classYear}-01-01`),
                                    lte: new Date(`${classYear}-12-31`),
                                }
                            }
                        }
                    }
                }),
                ...(status && { status }),
                ...(employmentType && {
                    job: {
                        employment_type: employmentType
                    }
                })
            };
            const totalData = await this.prisma.applications.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            const students = await this.prisma.applications.findMany({
                where,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder
                },
                select: {
                    application_id: true,
                    status: true,
                    applied_at: true,
                    job_seeker: {
                        select: {
                            job_seeker_id: true,
                            full_name: true,
                            job_seeker_detail: {
                                select: {
                                    education: {
                                        select: {
                                            start_date: true,
                                        }
                                    }
                                }
                            }
                        }
                    },
                    job: {
                        select: {
                            job_id: true,
                            title: true,
                            employment_type: true,
                            company: {
                                select: {
                                    company_detail: {
                                        select: {
                                            legal_name: true,
                                            market_name: true,
                                            logo_url: true,
                                        }
                                    }
                                },
                            },
                        }
                    }
                }
            });
            const responseData = students.map(student => {
                console.log(student.job_seeker.job_seeker_detail.education.start_date);
                return {
                    application_id: student.application_id,
                    applied_at: student.applied_at,
                    status: student.status.charAt(0).toUpperCase() + student.status.slice(1),
                    job_seeker: {
                        job_seeker_id: student.job_seeker.job_seeker_id,
                        full_name: student.job_seeker.full_name,
                        class_year: student.job_seeker.job_seeker_detail.education.start_date,
                    },
                    job: {
                        job_id: student.job.job_id,
                        title: student.job.title,
                        employment_type: student.job.employment_type.split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' '),
                    },
                    company: {
                        legal_name: student.job.company.company_detail.legal_name,
                        market_name: student.job.company.company_detail.market_name,
                        logo_url: student.job.company.company_detail.logo_url,
                    }
                };
            });
            return {
                status: "success",
                message: 'Students retrieved successfully',
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: responseData
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve students');
        }
    }
    async exportRegisteredStudent(user, start, end, format = 'csv', res) {
        try {
            if (!start && !end) {
                start = null;
                end = null;
            }
            else {
                if (!start)
                    start = 1;
                if (!end)
                    end = 10;
            }
            const validStart = start ? Math.max(start - 1, 0) : null;
            const validEnd = end ? (end > validStart ? end : validStart) : null;
            const take = validStart !== null && validEnd !== null ? (validEnd - validStart) : null;
            const students = await this.prisma.job_seeker_details.findMany({
                where: {
                    education: {
                        university_id: user.university_id
                    }
                },
                orderBy: {
                    ['created_at']: 'desc',
                },
                ...(validStart !== null ? { skip: validStart } : {}),
                ...(take !== null ? { take: take } : {}),
                select: {
                    job_seeker_id: true,
                    created_at: true,
                    job_seeker: {
                        select: {
                            full_name: true,
                            email: true,
                        }
                    },
                    education: {
                        select: {
                            degree: true,
                            major: true,
                            start_date: true,
                            end_date: true,
                        }
                    }
                }
            });
            const responseData = students.map(student => {
                return {
                    job_seeker_id: student.job_seeker_id,
                    full_name: student.job_seeker.full_name,
                    email: student.job_seeker.email,
                    degree: student.education.degree,
                    major: student.education.major,
                    start_date: moment(student.education.start_date, 'YYYY-MM-DD HH:mm:ss').format('MM/YYYY'),
                    end_date: moment(student.education.end_date, 'YYYY-MM-DD HH:mm:ss').format('MM/YYYY'),
                    created_at: student.created_at,
                };
            });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Students');
            worksheet.columns = [
                { header: 'No', key: 'no', width: 5 },
                { header: 'Job Seeker ID', key: 'job_seeker_id', width: 20 },
                { header: 'Full Name', key: 'full_name', width: 30 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Degree', key: 'degree', width: 20 },
                { header: 'Major', key: 'major', width: 20 },
                { header: 'Start Date', key: 'start_date', width: 15 },
                { header: 'End Date', key: 'end_date', width: 15 },
                { header: 'Registered At', key: 'registered_at', width: 20 },
            ];
            responseData.forEach((data, index) => {
                worksheet.addRow({
                    no: index + 1,
                    job_seeker_id: data.job_seeker_id,
                    full_name: data.full_name,
                    email: data.email,
                    degree: data.degree,
                    major: data.major,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    registered_at: data.created_at,
                });
            });
            if (format === 'csv') {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename="student-registered.csv"');
                await workbook.csv.write(res);
            }
            else if (format === 'xlsx') {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename="student-registered.xlsx"');
                await workbook.xlsx.write(res);
            }
            return res.end();
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to export students');
        }
    }
    async exportHistoryStudent(user, start, end, format = 'csv', res) {
        try {
            if (!start && !end) {
                start = null;
                end = null;
            }
            else {
                if (!start)
                    start = 1;
                if (!end)
                    end = 10;
            }
            const validStart = start ? Math.max(start - 1, 0) : null;
            const validEnd = end ? (end > validStart ? end : validStart) : null;
            const take = validStart !== null && validEnd !== null ? (validEnd - validStart) : null;
            const students = await this.prisma.applications.findMany({
                where: {
                    job_seeker: {
                        job_seeker_detail: {
                            education: {
                                university_id: user.university_id
                            },
                        }
                    }
                },
                orderBy: {
                    ['applied_at']: 'desc',
                },
                ...(validStart !== null ? { skip: validStart } : {}),
                ...(take !== null ? { take: take } : {}),
                select: {
                    application_id: true,
                    status: true,
                    applied_at: true,
                    job_seeker: {
                        select: {
                            job_seeker_id: true,
                            full_name: true,
                            email: true,
                        }
                    },
                    job: {
                        select: {
                            job_id: true,
                            title: true,
                            employment_type: true,
                            company: {
                                select: {
                                    company_detail: {
                                        select: {
                                            legal_name: true,
                                            market_name: true,
                                        }
                                    }
                                },
                            },
                        }
                    }
                }
            });
            const responseData = students.map(student => {
                return {
                    application_id: student.application_id,
                    applied_at: student.applied_at,
                    status: student.status,
                    job_seeker: {
                        job_seeker_id: student.job_seeker.job_seeker_id,
                        full_name: student.job_seeker.full_name,
                        email: student.job_seeker.email,
                    },
                    job: {
                        job_id: student.job.job_id,
                        title: student.job.title,
                        employment_type: student.job.employment_type,
                    },
                    company: {
                        legal_name: student.job.company.company_detail.legal_name,
                        market_name: student.job.company.company_detail.market_name,
                    }
                };
            });
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Students');
            worksheet.columns = [
                { header: 'No', key: 'no', width: 5 },
                { header: 'Application ID', key: 'application_id', width: 20 },
                { header: 'Applied At', key: 'applied_at', width: 20 },
                { header: 'Status', key: 'status', width: 20 },
                { header: 'Job Seeker ID', key: 'job_seeker_id', width: 20 },
                { header: 'Full Name', key: 'full_name', width: 30 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Job Title', key: 'title', width: 20 },
                { header: 'Employment Type', key: 'employment_type', width: 20 },
                { header: 'Company Legal Name', key: 'legal_name', width: 20 },
                { header: 'Company Market Name', key: 'market_name', width: 20 },
            ];
            responseData.forEach((data, index) => {
                worksheet.addRow({
                    no: index + 1,
                    application_id: data.application_id,
                    applied_at: data.applied_at,
                    status: data.status,
                    job_seeker_id: data.job_seeker.job_seeker_id,
                    full_name: data.job_seeker.full_name,
                    email: data.job_seeker.email,
                    title: data.job.title,
                    employment_type: data.job.employment_type,
                    legal_name: data.company.legal_name,
                    market_name: data.company.market_name,
                });
            });
            if (format === 'csv') {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename="student-employment-history.csv"');
                await workbook.csv.write(res);
            }
            else if (format === 'xlsx') {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename="student-employment-history.xlsx"');
                await workbook.xlsx.write(res);
            }
            return res.end();
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to export students');
        }
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentService);
//# sourceMappingURL=student.service.js.map