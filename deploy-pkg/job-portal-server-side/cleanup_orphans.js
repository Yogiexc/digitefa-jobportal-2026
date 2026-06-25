const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Deleting orphan invitations...');
  const deleted = await prisma.$executeRaw`DELETE FROM invitations WHERE job_id NOT IN (SELECT job_id FROM jobs)`;
  console.log('Deleted invitations:', deleted);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
