const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  const c = await prisma.companies.findFirst({ orderBy: { created_at: 'desc' } });
  console.log('now:', new Date().toISOString(), 'saved:', c.otpExpires.toISOString(), 'valid:', new Date() <= c.otpExpires);
}
test().catch(console.error).finally(() => prisma.$disconnect());
