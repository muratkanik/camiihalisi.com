const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tasks = await prisma.aiTask.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
  tasks.forEach(t => {
    console.log(`[${t.createdAt.toISOString()}] ${t.keyword} | ${t.status} | ${t.logs ? t.logs.slice(0, 100) : ''}`);
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());
