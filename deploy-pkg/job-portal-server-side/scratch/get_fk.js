const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`
    SELECT CONSTRAINT_NAME 
    FROM information_schema.KEY_COLUMN_USAGE 
    WHERE TABLE_NAME = 'education' 
    AND COLUMN_NAME = 'job_seeker_detail_id' 
    AND REFERENCED_TABLE_NAME IS NOT NULL`;
  console.log(JSON.stringify(result, null, 2));
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());
