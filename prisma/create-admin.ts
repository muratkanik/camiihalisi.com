/**
 * prisma/create-admin.ts
 * Admin kullanıcısı oluşturur veya şifresini günceller.
 *
 * Kullanım:
 *   npx tsx prisma/create-admin.ts
 *   npx tsx prisma/create-admin.ts admin@camiihalisi.com YeniSifre123
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email    = process.argv[2] ?? "admin@camiihalisi.com";
  const password = process.argv[3] ?? "Admin2024!";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where:  { email },
    update: { passwordHash },
    create: { email, passwordHash, role: "admin" },
  });

  console.log(`✓ Admin kullanıcı hazır: ${user.email}`);
  console.log(`  Şifre: ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
