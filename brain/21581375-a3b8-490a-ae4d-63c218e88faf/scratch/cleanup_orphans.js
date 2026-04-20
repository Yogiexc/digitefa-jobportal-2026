const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Checking for orphan invitations...');
    const orphans = await prisma.$queryRawUnsafe(`
      SELECT invitation_id FROM invitations 
      WHERE job_id NOT IN (SELECT job_id FROM jobs)
    `);
    console.log('Orphan invitations found:', orphans);

    if (Array.isArray(orphans) && orphans.length > 0) {
      console.log('Deleting orphan invitations...');
      const deleted = await prisma.$executeRawUnsafe(`
        DELETE FROM invitations 
        WHERE job_id NOT IN (SELECT job_id FROM jobs)
      `);
      console.log('Deleted', deleted, 'orphan invitations.');
    } else {
      console.log('No orphan invitations found.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
