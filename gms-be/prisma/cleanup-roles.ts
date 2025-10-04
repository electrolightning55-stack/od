import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`
    DELETE FROM "Role"
    WHERE "roleName" IN ('SuperAdmin', 'OrgAdmin', 'Manager', 'Supervisor', 'User', 'Admin', 'Client');
  `;
  console.log('❌ Deleted wrong-case roles');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
