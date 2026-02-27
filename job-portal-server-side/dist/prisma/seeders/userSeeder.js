"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const totalGenerated = 15;
    const passwordJobSeeker = await bcrypt.hash('jobseeker', 10);
    const passwordUniversity = await bcrypt.hash('university', 10);
    const passwordCompany = await bcrypt.hash('companyy', 10);
    const passwordSuperadmin = await bcrypt.hash('superadmin', 10);
    const passwordAdmin = await bcrypt.hash('admin123', 10);
    for (let i = 1; i <= totalGenerated; i++) {
        let number = i;
        while (true) {
            const email = `jobseeker${number}@mail.com`;
            const jobSeeker = await prisma.job_seekers.findUnique({ where: { email } });
            if (jobSeeker) {
                number += totalGenerated;
            }
            else {
                break;
            }
        }
        await prisma.job_seekers.create({
            data: {
                email: `jobseeker${number}@mail.com`,
                password: passwordJobSeeker,
                full_name: `Job Seeker ${number}`,
                verified: 'true',
                job_seeker_detail: {
                    create: {
                        profile_picture_url: `profile/js${number}.jpg`,
                        personal_summary: `Experienced job seeker ${number}`,
                        personal_info: {
                            create: {
                                address: `123 Job Seeker St ${number}`,
                                phone_number: `012345678${number}`,
                                date_of_birth: new Date(`2000-01-${Math.floor(Math.random() * 30) + 1}`),
                            },
                        },
                        education: {
                            create: {
                                university_name: `Sebelas Maret University ${number}`,
                                degree: 'Bachelor',
                                major: 'University',
                                start_date: new Date(`2020-01-01`),
                                end_date: new Date(`2024-01-01`),
                            },
                        },
                        experiences: {
                            create: {
                                experience_title: `Software Engineer ${number}`,
                                company_name: `Company ${number}`,
                                start_date: new Date(`2024-01-01`),
                                end_date: new Date(`2026-01-01`),
                                description: `Developing software ${number}`,
                            },
                        },
                        skills: {
                            create: {
                                skill_name: `Java ${number}`
                            },
                        },
                        projects: {
                            create: {
                                project_name: `Project ${number}`,
                                description: `Description ${number}`,
                                start_date: new Date(`2024-01-01`),
                                end_date: new Date(`2026-01-01`),
                            },
                        },
                        certifications: {
                            create: {
                                certification_name: `Certification ${number}`,
                                issuing_organization: `Organization ${number}`,
                                issue_date: new Date(`2024-01-01`),
                                expiration_date: new Date(`2026-01-01`),
                            },
                        },
                    },
                },
            }
        });
    }
    for (let i = 1; i <= totalGenerated; i++) {
        let number = i;
        while (true) {
            const email = `university${number}@mail.com`;
            const university = await prisma.universities.findUnique({ where: { email } });
            if (university) {
                number += totalGenerated;
            }
            else {
                break;
            }
        }
        await prisma.universities.create({
            data: {
                email: `university${number}@mail.com`,
                password: passwordUniversity,
                full_name: `University ${number}`,
                verified: 'true',
                status: 'accepted',
                university_detail: {
                    create: {
                        university_name: `University ${number}`,
                        logo_url: `logo/logo${number}.png`,
                        phone_number: `012345678${number}`,
                        country: 'Indonesia',
                        province: 'Central Java',
                        city: 'Surakarta',
                        district: 'Laweyan',
                        full_address: `123 University St ${number}`,
                        postal_code: '57126',
                        website: `http://example.com/${number}`,
                        facebook_url: `http://facebook.com/${number}`,
                        twitter_url: `http://twitter.com/${number}`,
                        instagram_url: `http://instagram.com/${number}`,
                        youtube_url: `http://youtube.com/${number}`,
                    },
                },
            },
        });
    }
    for (let i = 1; i <= totalGenerated; i++) {
        let number = i;
        while (true) {
            const email = `company${number}@mail.com`;
            const company = await prisma.companies.findUnique({ where: { email } });
            if (company) {
                number += totalGenerated;
            }
            else {
                break;
            }
        }
        await prisma.companies.create({
            data: {
                email: `company${number}@mail.com`,
                password: passwordCompany,
                full_name: `Company ${number}`,
                phone_number: `012345678${number}`,
                verified: 'true',
                status: 'accepted',
                company_detail: {
                    create: {
                        logo_url: `http://example.com/logo${number}.png`,
                        legal_name: `PT. Company ${number}`,
                        market_name: `Company ${number}`,
                        category: 'Technology',
                        company_size: '100-500',
                        description: `Description ${number}`,
                        country: 'Indonesia',
                        province: 'Central Java',
                        city: 'Surakarta',
                        district: 'Laweyan',
                        full_address: `123 Company St ${number}`,
                        postal_code: '57126',
                        website: `http://example.com/${number}`,
                        facebook_url: `http://facebook.com/${number}`,
                        twitter_url: `http://twitter.com/${number}`,
                        instagram_url: `http://instagram.com/${number}`,
                        youtube_url: `http://youtube.com/${number}`,
                    },
                },
            },
        });
    }
    const admin = await prisma.admins.findFirst({ where: { OR: [{ email: 'superadmin@mail.com' }, { email: 'admin@mail.com' }] } });
    if (admin) {
        return;
    }
    await prisma.admins.createMany({
        data: [
            { full_name: 'Superadmin', email: 'superadmin@mail.com', password: passwordSuperadmin, role: 'superadmin' },
            { full_name: 'Admin', email: 'admin@mail.com', password: passwordAdmin, role: 'admin' },
        ],
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    console.log('Database has been seeded');
});
//# sourceMappingURL=userSeeder.js.map