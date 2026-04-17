import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Yükleme (Seeding) Başlatılıyor...");

  // 1. Admin Kullanıcısı Oluştur
  const email = "admin@asilhali.com.tr";
  const pwd = "AsilHaliAdmin2024!";
  const hash = await bcrypt.hash(pwd, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash },
    create: {
      email,
      passwordHash: hash,
      role: 'admin'
    }
  });
  console.log("👤 Admin user created/updated.");

  // 2. Base İletişim Bilgileri (Site Settings)
  const settings = [
    { key: "contact_address", value: "Cami Halısı Üretim Tesisleri, Organize Sanayi, Türkiye" },
    { key: "contact_phone", value: "+90 850 000 0000" },
    { key: "contact_email", value: "info@asilhali.com.tr" },
    { key: "instagram_link", value: "https://instagram.com/asilhali" }
  ];

  for (const set of settings) {
    await prisma.setting.upsert({
      where: { key: set.key },
      update: { value: set.value },
      create: set
    });
  }
  console.log("⚙️ Settings applied.");

  // 3. Dynamic Pages Routing Setup based on Sitemap
  const sitemap = [
    { slug: "home", title: "Ana Sayfa" },
    { slug: "kategori/akrilik-cami-halisi", title: "Akrilik Cami Halısı" },
    { slug: "kategori/yun-cami-halisi", title: "Yün Cami Halısı" },
    { slug: "kategori/polipropilen-cami-halisi", title: "Polipropilen Cami Halısı" },
    { slug: "kategori/polyamid-cami-halisi", title: "Polyamid Cami Halısı" },
    { slug: "hakkimizda", title: "Hakkımızda" },
    { slug: "iletisim", title: "İletişim" }
  ];

  for (const page of sitemap) {
    // Only create if not exists
    let existing = await prisma.page.findUnique({ where: { slug: page.slug } });
    if (!existing) {
      existing = await prisma.page.create({
        data: {
          slug: page.slug,
          titleInternal: page.title
        }
      });

      // Insert minimal Block and default Translation for new pages
      const block = await prisma.contentBlock.create({
        data: {
          pageId: existing.id,
          componentType: "hero"
        }
      });
      await prisma.translation.create({
        data: {
          blockId: block.id,
          locale: "tr",
          contentData: JSON.stringify({ title: page.title, subtitle: `${page.title} hakkında detaylar.` })
        }
      });
    }
  }
  console.log("🗺️ Dynamic Pages structure initialized.");

  // 4. Parse PDFs from JSON Array
  const jsonPath = path.join(process.cwd(), "scripts", "parsed_pdfs.json");
  if (fs.existsSync(jsonPath)) {
    const parsedData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    console.log(`\n📚 Mapped ${parsedData.length} records. Uploading to DB...`);
    
    for (const article of parsedData) {
      await prisma.contentArchive.create({
        data: {
           title: article.title,
           category: article.category || "blog",
           originalText: article.text.substring(0, 50000)
        }
      });
    }
  }

  console.log("\n✅ Veritabanı Yüklemesi Tamamlandı!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
