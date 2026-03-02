"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordCompany = await bcrypt.hash('companyy', 10);
    await prisma.companies.create({
        data: {
            email: 'company@gojek.com',
            password: passwordCompany,
            full_name: 'PT Aplikasi Karya Anak Bangsa',
            phone_number: '021-5055-8500',
            verified: 'true',
            status: 'accepted',
            company_detail: {
                create: {
                    logo_url: 'https://logo.com/gojek.png',
                    legal_name: 'PT Aplikasi Karya Anak Bangsa',
                    market_name: 'Gojek',
                    category: 'Technology',
                    company_size: '5000+',
                    description: 'Gojek is a technology company that offers services ranging from transportation to payments.',
                    country: 'Indonesia',
                    province: 'DKI Jakarta',
                    city: 'Jakarta',
                    district: 'Setiabudi',
                    full_address: 'Pasaraya Blok M, Jakarta Selatan',
                    postal_code: '12160',
                    website: 'https://www.gojek.com',
                    facebook_url: 'https://www.facebook.com/GojekIndonesia',
                    twitter_url: 'https://twitter.com/gojekindonesia',
                    instagram_url: 'https://www.instagram.com/gojekindonesia',
                    youtube_url: 'https://www.youtube.com/c/GojekIndonesia',
                },
            },
        },
    });
    await prisma.companies.create({
        data: {
            email: 'company@shopee.com',
            password: passwordCompany,
            full_name: 'PT Shopee International Indonesia',
            phone_number: '021-5081-3333',
            verified: 'true',
            status: 'accepted',
            company_detail: {
                create: {
                    logo_url: 'https://logo.com/shopee.png',
                    legal_name: 'PT Shopee.com',
                    market_name: 'Shopee',
                    category: 'E-commerce',
                    company_size: '1000+',
                    description: 'Shopee is an Indonesian e-commerce platform.',
                    country: 'Indonesia',
                    province: 'DKI Jakarta',
                    city: 'Jakarta',
                    district: 'Kemang',
                    full_address: 'Office 88, Kasablanka Tower A',
                    postal_code: '12870',
                    website: 'https://www.shopee.com',
                    facebook_url: 'https://www.facebook.com/shopee',
                    twitter_url: 'https://twitter.com/shopee',
                    instagram_url: 'https://www.instagram.com/shopee',
                    youtube_url: 'https://www.youtube.com/c/shopee',
                },
            },
        },
    });
    await prisma.companies.create({
        data: {
            email: 'company@tokopedia.com',
            password: passwordCompany,
            full_name: 'PT Tokopedia',
            phone_number: '021-5369-3520',
            verified: 'true',
            status: 'accepted',
            company_detail: {
                create: {
                    logo_url: 'https://logo.com/tokopedia.png',
                    legal_name: 'PT Tokopedia',
                    market_name: 'Tokopedia',
                    category: 'E-commerce',
                    company_size: '5000+',
                    description: 'Tokopedia is an Indonesian technology company specializing in e-commerce.',
                    country: 'Indonesia',
                    province: 'DKI Jakarta',
                    city: 'Jakarta',
                    district: 'Kuningan',
                    full_address: 'Tokopedia Tower, Jakarta Selatan',
                    postal_code: '12950',
                    website: 'https://www.tokopedia.com',
                    facebook_url: 'https://www.facebook.com/tokopedia',
                    twitter_url: 'https://twitter.com/tokopedia',
                    instagram_url: 'https://www.instagram.com/tokopedia',
                    youtube_url: 'https://www.youtube.com/c/tokopedia',
                },
            },
        },
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    console.log('Database has been seeded with companies');
});
//# sourceMappingURL=companySeeder.js.map