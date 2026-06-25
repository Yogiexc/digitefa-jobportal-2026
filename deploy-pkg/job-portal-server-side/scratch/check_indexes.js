const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SHOW INDEX FROM education`;
  console.log(JSON.stringify(result, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
