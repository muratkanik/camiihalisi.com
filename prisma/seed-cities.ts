/**
 * prisma/seed-cities.ts
 * Tüm Türkiye illerini ve seçili ilçeleri Supabase'e aktarır.
 *
 * Çalıştırma:
 *   npx tsx prisma/seed-cities.ts
 */
import { PrismaClient } from "@prisma/client";
import { CITIES } from "../src/lib/cities";

const prisma = new PrismaClient();

async function main() {
  console.log(`Toplam ${CITIES.length} şehir/ilçe içe aktarılıyor...`);

  let created = 0;
  let updated = 0;

  for (const city of CITIES) {
    const existing = await prisma.city.findUnique({ where: { slug: city.slug } });
    if (existing) {
      await prisma.city.update({
        where: { slug: city.slug },
        data: {
          name: city.name,
          type: city.type,
          parent: city.parent ?? null,
          population: city.population ?? null,
        },
      });
      updated++;
    } else {
      await prisma.city.create({
        data: {
          slug: city.slug,
          name: city.name,
          type: city.type,
          parent: city.parent ?? null,
          population: city.population ?? null,
          isActive: true,
        },
      });
      created++;
    }
  }

  console.log(`✓ ${created} yeni eklendi, ${updated} güncellendi.`);
  const total = await prisma.city.count();
  console.log(`Toplam DB kaydı: ${total}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
