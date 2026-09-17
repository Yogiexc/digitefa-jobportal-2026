const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE education DROP INDEX education_job_seeker_detail_id_key');
    console.log('Successfully dropped the unique index education_job_seeker_detail_id_key');
  } catch (e) {
    console.error('Failed to drop index (it might not exist or there was another error):', e.message);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
