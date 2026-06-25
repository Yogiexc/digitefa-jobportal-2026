const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Dropping foreign key...');
    await prisma.$executeRawUnsafe('ALTER TABLE education DROP FOREIGN KEY education_job_seeker_detail_id_fkey');
    
    console.log('Dropping unique index...');
    await prisma.$executeRawUnsafe('ALTER TABLE education DROP INDEX education_job_seeker_detail_id_key');
    
    console.log('Adding non-unique index...');
    await prisma.$executeRawUnsafe('ALTER TABLE education ADD INDEX education_job_seeker_detail_id_fkey (job_seeker_detail_id)');
    
    console.log('Re-adding foreign key...');
    await prisma.$executeRawUnsafe('ALTER TABLE education ADD CONSTRAINT education_job_seeker_detail_id_fkey FOREIGN KEY (job_seeker_detail_id) REFERENCES job_seeker_details(job_seeker_detail_id) ON DELETE CASCADE');
    
    console.log('Successfully converted education relationship to One-to-Many!');
  } catch (e) {
    console.error('Error during conversion:', e.message);
  }
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());
