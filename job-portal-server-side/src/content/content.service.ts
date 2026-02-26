import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) { }

  async getAboutUs() {
    const aboutUs = await this.prisma.pages.findUnique({
      where: {
        slug: 'about-us',
      },
    });

    if (!aboutUs) {
      throw new NotFoundException('About us not found. Please add content to the about us page');
    }
    try {
      const aboutUsContent = aboutUs.content;

      return {
        status: 'success',
        message: 'About us retrieved successfully',
        data: aboutUsContent,
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve the about us page');
    }
  }

  async updateAboutUs(content: string) {
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
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to update the about us page');
    }
  }

  async getPrivacyPolicy() {
    const privacyPolicy = await this.prisma.pages.findUnique({
      where: {
        slug: 'privacy-policy',
      },
    });

    if (!privacyPolicy) {
      throw new NotFoundException('Privacy policy not found. Please add content to the privacy policy page');
    }
    try {
      const privacyPolicyContent = privacyPolicy.content;

      return {
        status: 'success',
        message: 'Privacy policy retrieved successfully',
        data: privacyPolicyContent,
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve the privacy policy page');
    }
  }

  async updatePrivacyPolicy(content: string) {
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
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to update the privacy policy page');
    }
  }

  async findAllEventNews(params: {
    category?: 'all' | 'event' | 'news',
    page?: number,
    pageSize?: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  }) {
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
        } : { category })
        , ...(search && {
          OR: [
            { title: { contains: search } },
            { content: { contains: search } }
          ]
        })
      }
      // Calculate total data
      const totalData = await this.prisma.pages.count({ where });

      // Calculate total pages
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
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve companies');
    }
  }

  async getEventNewsById(page_id: string) {
    const eventNews = await this.prisma.pages.findUnique({
      where: {
        page_id
      },
    });

    if (!eventNews) {
      throw new NotFoundException('Event or news not found. Please add content to the event or news page');
    }

    try {
      return {
        status: 'success',
        message: 'Event or news retrieved successfully',
        data: eventNews,
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve the event or news page');
    }
  }

  async getEventNewsBySlug(slug: string) {
    const eventNews = await this.prisma.pages.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!eventNews) {
      throw new NotFoundException('Event or news not found. Please add content to the event or news page');
    }
    try {
      return {
        status: 'success',
        message: 'Event or news retrieved successfully',
        data: eventNews,
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve the event or news page');
    }
  }

  async createEventNews(createEventNewsDto: any, upload_image?: Express.Multer.File) {
    const { title, slug, category, event_date, content } = createEventNewsDto;
    console.log(slug)
    let newSlug;
    if (slug || slug == '') {
      newSlug = title.split(' ').join('-');
      console.log("cokkk")
    } else {
      newSlug = slug;
    }
    console.log(newSlug)
    const pages = await this.prisma.pages.findUnique({
      where: {
        slug: newSlug,
      },
    });
    console.log(pages)
    if (pages) {
      upload_image ? await fs.promises.unlink(upload_image.path) : null;
      throw new BadRequestException('Event or news slug already exists. Please create a new event or news with a different slug');
    }

    // Simpan URL Logo saat ini
    const currentImageUrl = pages?.image_url;

    try {
      // Delete old profile picture file if new file uploaded and old file exists
      if (upload_image && currentImageUrl) {
        const oldFilePath = join(currentImageUrl);
        if (fs.existsSync(oldFilePath)) {
          try {
            await fs.promises.unlink(oldFilePath);
          } catch (error) {
            //
          }
        } else {
          //
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
        }
      } else if (category === 'news') {
        return {
          status: 'success',
          message: 'News created successfully',
        }
      }
    } catch (error) {
      upload_image ? await fs.promises.unlink(upload_image.path) : null;
      console.log(error)
      throw new InternalServerErrorException('Failed to create event or news');
    }
  }

  async updateEventNewsById(page_id: string, createEventNewsDto, upload_image?: Express.Multer.File) {
    const news = await this.prisma.pages.findUnique({
      where: {
        page_id
      },
    });

    if (!news) {
      upload_image ? await fs.promises.unlink(upload_image.path) : null;
      throw new NotFoundException('News not found. Please create a new news');
    }

    // Simpan URL Logo saat ini
    const currentImageUrl = news?.image_url;

    try {
      // Delete old profile picture file if new file uploaded and old file exists
      if (upload_image && currentImageUrl) {
        const oldFilePath = join(currentImageUrl);
        if (fs.existsSync(oldFilePath)) {
          try {
            await fs.promises.unlink(oldFilePath);
          } catch (error) {
            //
          }
        } else {
          //
        }
      }
      const { title, slug, category, event_date, content } = createEventNewsDto;
      let newSlug;
      if (slug || slug == '') {
        newSlug = title.split(' ').join('-');
      } else {
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
        }
      } else if (category === 'news') {
        return {
          status: 'success',
          message: 'News updated successfully',
        }
      }
    } catch (error) {
      upload_image ? await fs.promises.unlink(upload_image.path) : null;
      throw new InternalServerErrorException('Failed to update news');
    }
  }

  async deleteEventNewsById(page_id: string) {
    const news = await this.prisma.pages.findUnique({
      where: {
        page_id
      },
    });

    if (!news) {
      throw new NotFoundException('News not found. Please create a new news');
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
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete news');
    }
  }
}
