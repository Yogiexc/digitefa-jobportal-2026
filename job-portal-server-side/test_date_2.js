const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.development') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const company = await prisma.companies.findFirst({ orderBy: { created_at: 'desc' }});
  
  if (company) {
    console.log('company created at: ', company.created_at);
    console.log('company otpExpires: ', company.otpExpires);
    console.log('now:', new Date());
    console.log('is valid:', company.otpExpires && new Date() <= company.otpExpires);
  }
}
test().catch(console.error).finally(() => prisma.$disconnect());
