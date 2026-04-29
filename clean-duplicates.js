const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dynRow = await prisma.setting.findUnique({ where: { key: "dynamic_blog_posts" } });
  if (!dynRow) return console.log("No dynamic posts");
  
  const posts = JSON.parse(dynRow.value);
  const deduped = [];
  const seenKeywords = new Set();
  
  // Tersten giderek (en yenileri saklayarak) deduplicate yapalım
  for (let i = posts.length - 1; i >= 0; i--) {
    const p = posts[i];
    const kw = p.seoKeyword || p.slug; // Fallback
    if (!seenKeywords.has(kw)) {
      seenKeywords.add(kw);
      deduped.unshift(p); // Başa ekle ki orijinal sıralama (en yeni sonda) korunsun
    } else {
      console.log(`Siliniyor (Tekrar): Slug: ${p.slug} | Keyword: ${p.seoKeyword}`);
    }
  }
  
  console.log(`Kalan post sayısı: ${deduped.length} (Önceki: ${posts.length})`);
  
  await prisma.setting.update({
    where: { key: "dynamic_blog_posts" },
    data: { value: JSON.stringify(deduped) }
  });
  console.log("Veritabanı güncellendi.");
}
main().catch(console.error).finally(() => prisma.$disconnect());
