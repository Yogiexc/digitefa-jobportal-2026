// @ts-nocheck
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { omit } from 'lodash';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import * as moment from 'moment-timezone';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) { }

  async findAllStudents(user: any, params: {
    page?: number,
    pageSize?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    classYear?: number,
    startDate?: string,
    endDate?: string
  }) {
    const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc', classYear = null, startDate = null, endDate = null } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    try {
      const where: any = {
        education: {
          some: { university_id: user.university_id },
        },
        ...(search && {
          OR: [
            { job_seeker: { full_name: { contains: search } } },
            { job_seeker: { email: { contains: search } } },
          ]
        }),
        ...(classYear && {
          education: {
            some: {
              start_date: {
                gte: new Date(`${classYear}-01-01`),
                lte: new Date(`${classYear}-12-31`),
              },
            },
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

      // Calculate total data
      const totalData = await this.prisma.job_seeker_details.count({ where });

      // Calculate total pages
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
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve students');
    }
  }

  async getStudentByJobSeekerId(user: any, job_seeker_id: string) {
    try {
      let student: any = await this.prisma.job_seeker_details.findFirst({
        where: { job_seeker_id, education: { some: { university_id: user.university_id } } },
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
        student = omit(student, ['created_at', 'updated_at']);
      }
      // Remove sensitive data using lodash.omit
      if (student.job_seeker) {
        student.job_seeker = omit(student.job_seeker, ['password', 'otpExpires', 'otp', 'created_at', 'updated_at']);
      }
      if (student.personal_info) {
        student.personal_info = omit(student.personal_info, ['created_at', 'updated_at']);
      }
      if (student.education) {
        student.education = student.education.map((education) => omit(education, ['created_at', 'updated_at']));
      }
      if (student.experiences) {
        student.experiences = student.experiences.map(exp => omit(exp, ['created_at', 'updated_at']));
      }
      if (student.skills) {
        student.skills = student.skills.map(skill => omit(skill, ['created_at', 'updated_at']));
      }
      if (student.projects) {
        student.projects = student.projects.map(project => omit(project, ['created_at', 'updated_at']));
      }
      if (student.languages) {
        student.languages = student.languages.map(lang => omit(lang, ['created_at', 'updated_at']));
      }
      if (student.certifications) {
        student.certifications = student.certifications.map(cert => omit(cert, ['created_at', 'updated_at']));
      }

      return {
        status: "success",
        message: 'Student retrieved successfully',
        data: student
      };

    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve student');
    }
  }

  async getStudentEmploymentHistory(user: any, params: {
    page?: number,
    pageSize?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    classYear?: number,
    status?: 'pending' | 'accepted' | 'rejected' | 'waiting interview' | 'waiting_interview',
    employmentType?: string
  }) {
    const { page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc', classYear = null, status = null, employmentType } = params;

    const skip = (page - 1) * pageSize;
    const take = +pageSize;

    try {
      const where: any = {
        job_seeker: {
          job_seeker_detail: {
            education: {
              some: { university_id: user.university_id },
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
                some: {
                  start_date: {
                    gte: new Date(`${classYear}-01-01`),
                    lte: new Date(`${classYear}-12-31`),
                  },
                },
              }
            }
          }
        }),
        ...(status && { 
          status: status === 'waiting interview' ? 'waiting_interview' : status 
        }),
        ...(employmentType && {
          job: {
            employment_type: employmentType
          }
        })
      };

      // Calculate total data
      const totalData = await this.prisma.applications.count({ where });

      // Calculate total pages
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

      const responseData = students.map((student: any) => {
        console.log(student.job_seeker.job_seeker_detail.education?.[0]?.start_date)
        return {
          application_id: student.application_id,
          applied_at: student.applied_at,
          status: student.status.charAt(0).toUpperCase() + student.status.slice(1),
          job_seeker: {
            job_seeker_id: student.job_seeker.job_seeker_id,
            full_name: student.job_seeker.full_name,
            class_year: student.job_seeker.job_seeker_detail.education?.[0]?.start_date,
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
      })

      return {
        status: "success",
        message: 'Students retrieved successfully',
        totalData: +totalData,
        totalPages: +totalPages,
        currentPage: +page,
        size: +pageSize,
        data: responseData
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve students');
    }
  }

  async exportRegisteredStudent(user: any, start: number, end: number, format: 'csv' | 'xlsx' = 'csv', res: Response) {
    try {
      if (!start && !end) {
        start = null;
        end = null;
      } else {
        if (!start) start = 1;
        if (!end) end = 10;
      }

      // Validate and adjust `start` and `end` parameters
      const validStart = start ? Math.max(start - 1, 0) : null; // Convert to zero-based index
      const validEnd = end ? (end > validStart ? end : validStart) : null; // Ensure end >= start
      const take = validStart !== null && validEnd !== null ? (validEnd - validStart) : null; // Number of rows to take

      const students: any[] = await this.prisma.job_seeker_details.findMany({
        where: {
          education: {
            some: { university_id: user.university_id },
          }
        } as any,
        orderBy: {
          ['created_at']: 'desc',
        },
        ...(validStart !== null ? { skip: validStart } : {}), // Skip rows sebelum `start` jika ada
        ...(take !== null ? { take: take } : {}), // Ambil baris dari `start` ke `end` jika ada
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
          degree: student.education?.[0]?.degree || null,
          major: student.education?.[0]?.major || null,
          start_date: student.education?.[0]?.start_date ? moment(student.education[0].start_date, 'YYYY-MM-DD HH:mm:ss').format('MM/YYYY') : null,
          end_date: student.education?.[0]?.end_date ? moment(student.education[0].end_date, 'YYYY-MM-DD HH:mm:ss').format('MM/YYYY') : null,
          created_at: student.created_at,
        };
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students');

      // Add header row
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

      // Add data rows
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
      } else if (format === 'xlsx') {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="student-registered.xlsx"');
        await workbook.xlsx.write(res);
      }

      return res.end();


    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to export students');
    }
  }

  async exportHistoryStudent(user: any, start: number, end: number, format: 'csv' | 'xlsx' = 'csv', res: Response) {
    try {
      if (!start && !end) {
        start = null;
        end = null;
      } else {
        if (!start) start = 1;
        if (!end) end = 10;
      }

      // Validate and adjust `start` and `end` parameters
      const validStart = start ? Math.max(start - 1, 0) : null; // Convert to zero-based index
      const validEnd = end ? (end > validStart ? end : validStart) : null; // Ensure end >= start
      const take = validStart !== null && validEnd !== null ? (validEnd - validStart) : null; // Number of rows to take

      const students = await this.prisma.applications.findMany({
        where: {
          job_seeker: {
            job_seeker_detail: {
              education: {
                some: { university_id: user.university_id },
              },
            }
          }
        } as any,
        orderBy: {
          ['applied_at']: 'desc',
        },
        ...(validStart !== null ? { skip: validStart } : {}), // Skip rows sebelum `start` jika ada
        ...(take !== null ? { take: take } : {}), // Ambil baris dari `start` ke `end` jika ada
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

      const responseData = students.map((student: any) => {
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
      })

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students');

      // Add header row
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

      // Add data rows
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
      } else if (format === 'xlsx') {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="student-employment-history.xlsx"');
        await workbook.xlsx.write(res);
      }

      return res.end();

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to export students');
    }
  }
}
