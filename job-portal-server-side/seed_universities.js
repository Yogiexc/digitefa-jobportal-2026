require('dotenv').config({ path: '.env.development' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const universities = [
    'Universitas Indonesia',
    'Universitas Gadjah Mada',
    'Institut Teknologi Bandung',
    'Institut Pertanian Bogor',
    'Universitas Airlangga',
    'Institut Teknologi Sepuluh Nopember',
    'Universitas Brawijaya',
    'Universitas Diponegoro',
    'Universitas Sebelas Maret',
    'Universitas Padjadjaran',
    'Universitas Hasanuddin',
    'Universitas Telkom',
    'Universitas Bina Nusantara',
    'Universitas Muhammadiyah Malang',
    'Universitas Negeri Yogyakarta',
    'Universitas Negeri Semarang',
    'Universitas Negeri Malang',
    'Universitas Sumatera Utara',
    'Universitas Pendidikan Indonesia',
    'Universitas Andalas',
    'Universitas Syiah Kuala',
    'Universitas Sriwijaya',
    'Universitas Udayana',
    'Universitas Jember',
    'Universitas Riau',
    'Universitas Lampung'
];

async function main() {
    console.log('Seeding Indonesian universities...');

    const passwordHash = await bcrypt.hash('password123', 10);

    for (const name of universities) {
        const email = `${name.toLowerCase().replace(/[^a-z]/g, '')}@example.edu`;

        // Check if exists
        const existing = await prisma.university_details.findFirst({
            where: { university_name: name }
        });

        if (!existing) {
            const univ = await prisma.universities.create({
                data: {
                    full_name: name,
                    email: email,
                    password: passwordHash,
                    status: 'accepted',
                    verified: 'true'
                }
            });

            await prisma.university_details.create({
                data: {
                    university_id: univ.university_id,
                    university_name: name,
                    category: 'Public', // Default
                    country: 'Indonesia'
                }
            });
            console.log(`Added: ${name}`);
        } else {
            console.log(`Skipped (already exists): ${name}`);
        }
    }
    console.log('Done seeding.');
}

main()
    .catch(e => {
        console.error("PRISMA ERROR DETAILS:");
        console.error(e.message || e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
