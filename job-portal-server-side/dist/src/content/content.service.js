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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const fs = require("fs");
const path_1 = require("path");
let ContentService = class ContentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAboutUs() {
        const aboutUs = await this.prisma.pages.findUnique({
            where: {
                slug: 'about-us',
            },
        });
        if (!aboutUs) {
            throw new common_1.NotFoundException('About us not found. Please add content to the about us page');
        }
        try {
            const aboutUsContent = aboutUs.content;
            return {
                status: 'success',
                message: 'About us retrieved successfully',
                data: aboutUsContent,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve the about us page');
        }
    }
    async updateAboutUs(content) {
        try {
            await this.prisma.pages.upsert({
                update: {
                    content: content,
                },
                create: {
                    slug: 'about-us',
                    category: 'about_us',
                    content: content,
                },
                where: {
                    slug: 'about-us',
                    category: 'about_us',
                },
            });
            return {
                status: 'success',
                message: 'About us updated successfully',
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update the about us page');
        }
    }
    async getPrivacyPolicy() {
        const privacyPolicy = await this.prisma.pages.findUnique({
            where: {
                slug: 'privacy-policy',
            },
        });
        if (!privacyPolicy) {
            throw new common_1.NotFoundException('Privacy policy not found. Please add content to the privacy policy page');
        }
        try {
            const privacyPolicyContent = privacyPolicy.content;
            return {
                status: 'success',
                message: 'Privacy policy retrieved successfully',
                data: privacyPolicyContent,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve the privacy policy page');
        }
    }
    async updatePrivacyPolicy(content) {
        try {
            await this.prisma.pages.upsert({
                update: {
                    content: content,
                },
                create: {
                    slug: 'privacy-policy',
                    category: 'privacy_policy',
                    content: content,
                },
                where: {
                    slug: 'privacy-policy',
                    category: 'privacy_policy',
                },
            });
            return {
                status: 'success',
                message: 'Privacy policy updated successfully',
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update the privacy policy page');
        }
    }
    async findAllEventNews(params) {
        const { category = 'all', page = 1, pageSize = 10, search, sortBy = 'updated_at', sortOrder = 'desc' } = params;
        const skip = (page - 1) * pageSize;
        const take = +pageSize;
        if (category === 'all') {
            delete params.category;
        }
        try {
            const where = {
                ...(category == 'all' ? {
                    OR: [
                        { category: 'event' },
                        { category: 'news' }
                    ]
                } : { category }),
                ...(search && {
                    OR: [
                        { title: { contains: search } },
                        { content: { contains: search } }
                    ]
                })
            };
            const totalData = await this.prisma.pages.count({ where });
            const totalPages = Math.ceil(totalData / pageSize);
            const pages = await this.prisma.pages.findMany({
                where,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder
                },
            });
            return {
                status: "success",
                message: 'Event News retrieved successfully',
                totalData: +totalData,
                totalPages: +totalPages,
                currentPage: +page,
                size: +pageSize,
                data: pages
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to retrieve companies');
        }
    }
    async getEventNewsById(page_id) {
        const eventNews = await this.prisma.pages.findUnique({
            where: {
                page_id
            },
        });
        if (!eventNews) {
            throw new common_1.NotFoundException('Event or news not found. Please add content to the event or news page');
        }
        try {
            return {
                status: 'success',
                message: 'Event or news retrieved successfully',
                data: eventNews,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve the event or news page');
        }
    }
    async getEventNewsBySlug(slug) {
        const eventNews = await this.prisma.pages.findUnique({
            where: {
                slug: slug,
            },
        });
        if (!eventNews) {
            throw new common_1.NotFoundException('Event or news not found. Please add content to the event or news page');
        }
        try {
            return {
                status: 'success',
                message: 'Event or news retrieved successfully',
                data: eventNews,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve the event or news page');
        }
    }
    async createEventNews(createEventNewsDto, upload_image) {
        const { title, slug, category, event_date, content } = createEventNewsDto;
        console.log(slug);
        let newSlug;
        if (slug || slug == '') {
            newSlug = title.split(' ').join('-');
            console.log("cokkk");
        }
        else {
            newSlug = slug;
        }
        console.log(newSlug);
        const pages = await this.prisma.pages.findUnique({
            where: {
                slug: newSlug,
            },
        });
        console.log(pages);
        if (pages) {
            upload_image ? await fs.promises.unlink(upload_image.path) : null;
            throw new common_1.BadRequestException('Event or news slug already exists. Please create a new event or news with a different slug');
        }
        const currentImageUrl = pages?.image_url;
        try {
            if (upload_image && currentImageUrl) {
                const oldFilePath = (0, path_1.join)(currentImageUrl);
                if (fs.existsSync(oldFilePath)) {
                    try {
                        await fs.promises.unlink(oldFilePath);
                    }
                    catch (error) {
                    }
                }
                else {
                }
            }
            await this.prisma.pages.create({
                data: {
                    slug: newSlug,
                    title,
                    event_date: event_date ? new Date(event_date) : null,
                    image_url: upload_image ? upload_image.path : null,
                    category,
                    content,
                },
            });
            if (category === 'event') {
                return {
                    status: 'success',
                    message: 'Event created successfully',
                };
            }
            else if (category === 'news') {
                return {
                    status: 'success',
                    message: 'News created successfully',
                };
            }
        }
        catch (error) {
            upload_image ? await fs.promises.unlink(upload_image.path) : null;
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to create event or news');
        }
    }
    async updateEventNewsById(page_id, createEventNewsDto, upload_image) {
        const news = await this.prisma.pages.findUnique({
            where: {
                page_id
            },
        });
        if (!news) {
            upload_image ? await fs.promises.unlink(upload_image.path) : null;
            throw new common_1.NotFoundException('News not found. Please create a new news');
        }
        const currentImageUrl = news?.image_url;
        try {
            if (upload_image && currentImageUrl) {
                const oldFilePath = (0, path_1.join)(currentImageUrl);
                if (fs.existsSync(oldFilePath)) {
                    try {
                        await fs.promises.unlink(oldFilePath);
                    }
                    catch (error) {
                    }
                }
                else {
                }
            }
            const { title, slug, category, event_date, content } = createEventNewsDto;
            let newSlug;
            if (slug || slug == '') {
                newSlug = title.split(' ').join('-');
            }
            else {
                newSlug = slug;
            }
            await this.prisma.pages.update({
                data: {
                    title,
                    slug: newSlug,
                    event_date,
                    ...(upload_image && { image_url: upload_image.path }),
                    category,
                    content,
                },
                where: {
                    page_id
                },
            });
            if (category === 'event') {
                return {
                    status: 'success',
                    message: 'Event updated successfully',
                };
            }
            else if (category === 'news') {
                return {
                    status: 'success',
                    message: 'News updated successfully',
                };
            }
        }
        catch (error) {
            upload_image ? await fs.promises.unlink(upload_image.path) : null;
            throw new common_1.InternalServerErrorException('Failed to update news');
        }
    }
    async deleteEventNewsById(page_id) {
        const news = await this.prisma.pages.findUnique({
            where: {
                page_id
            },
        });
        if (!news) {
            throw new common_1.NotFoundException('News not found. Please create a new news');
        }
        try {
            await this.prisma.pages.delete({
                where: {
                    page_id
                },
            });
            const type = news.category === 'event' ? 'Event' : 'News';
            const title = news.title;
            return {
                status: 'success',
                message: `${type} '${title}' deleted successfully`,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to delete news');
        }
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentService);
//# sourceMappingURL=content.service.js.map