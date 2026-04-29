const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const tasks = await prisma.aiTask.findMany({ where: { status: "failed" }, orderBy: { createdAt: 'desc' }, take: 5 });
  console.log(tasks);
}
main().catch(console.error).finally(() => prisma.$disconnect());
