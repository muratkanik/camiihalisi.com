/**
 * prisma/seed-en-iyi-uretici.ts
 * "/en-iyi-cami-halisi-ureticisi" sayfası için Türkçe kaynak içeriği yazar,
 * aiComplete() (XAI → OpenRouter yedekli) ile 5 dile çevirir ve Setting
 * tablosuna "best_manufacturer_guide_data" anahtarıyla kaydeder.
 *
 * Çalıştırma:
 *   npx tsx prisma/seed-en-iyi-uretici.ts
 */
import { PrismaClient } from "@prisma/client";
import { aiComplete } from "../src/lib/ai/complete";

const prisma = new PrismaClient();
const KEY = "best_manufacturer_guide_data";

const TARGET_LOCALES: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  ar: "Arabic (Modern Standard Arabic, MSA)",
  ru: "Russian",
};

const TR_SOURCE = {
  metaTitle: "En İyi Cami Halısı Üreticisi Nasıl Seçilir?",
  metaDescription:
    "Cami halısı üreticisi seçerken nelere dikkat etmelisiniz? Sertifika, malzeme çeşitliliği, referans ve garanti kriterlerine göre uzman değerlendirme rehberi.",
  title: "En İyi Cami Halısı Üreticisi Nasıl Seçilir?",
  intro:
    "\"En iyi cami halısı üreticisi kim?\" sorusunun tek bir doğru cevabı yok — çünkü \"en iyi\", projenizin büyüklüğüne, bütçenize ve önceliklerinize göre değişir. Bu rehberde, bir cami halısı üreticisini nesnel kriterlerle nasıl değerlendireceğinizi anlatıyoruz; hangi soruları sormanız gerektiğini ve neden bu kriterlerin önemli olduğunu açıklıyoruz.",
  criteria: [
    {
      heading: "1. Sertifika ve Standartlar",
      body:
        "Cami halısı, yüksek yoğunluklu ve halka açık bir alanda kullanılır — bu yüzden yangın sınıfı (EN 13501-1, Bfl-s1), renk haslığı (ISO 105-B02) ve statik elektrik (EN 1815) gibi standartlara uygunluk şarttır. Üreticiden bu belgelerin güncel kopyalarını isteyin; belge numarası ve test tarihi olmayan genel \"kalite garantisi\" ifadelerine güvenmeyin.",
    },
    {
      heading: "2. Malzeme Çeşitliliği ve Teknik Şeffaflık",
      body:
        "Akrilik, yün, polipropilen ve polyamid gibi farklı malzemelerin her biri farklı bütçe ve kullanım yoğunluğuna uygundur. Ciddi bir üretici, her kalite kodu için hav yüksekliği, atkı sayısı, ilme yoğunluğu ve toplam ağırlık gibi teknik verileri açıkça paylaşabilmelidir — bu veriler paylaşılmıyorsa, ürünün gerçek kalitesini karşılaştırmak mümkün değildir.",
    },
    {
      heading: "3. Üretim Deneyimi ve Kapasite",
      body:
        "Kaç yıldır üretim yaptığı ve hangi ölçekteki projeleri tamamladığı, bir üreticinin büyük ve karmaşık camileri (özel ölçü, çoklu desen, kısa teslim süresi) yönetebilme kapasitesini gösterir. Deneyim tek başına yeterli değildir, ama düşük deneyimli bir üreticiyle büyük bir projeye girmek risklidir.",
    },
    {
      heading: "4. Referans ve Tamamlanmış Projeler",
      body:
        "Mümkünse, üreticiden isim verilebilir, doğrulanabilir en az bir referans proje isteyin — ideal olarak fotoğraflı ve iletişime geçilebilir bir cami yönetimiyle. \"Binlerce referans\" gibi genel ifadeler, tek bir somut örnek kadar güven vermez.",
    },
    {
      heading: "5. Garanti ve Satış Sonrası Destek",
      body:
        "Ürün garantisi süresi (malzemeye göre değişir, genelde 5–10 yıl) ve montaj sonrası destek (halı altına döşeme, bakım tavsiyeleri, yenileme hizmeti) uzun vadeli maliyeti doğrudan etkiler. Garanti şartlarının yazılı olarak verilip verilmediğini kontrol edin.",
    },
    {
      heading: "6. Özel Tasarım ve Ölçü İmkanı",
      body:
        "Her cami farklı ölçü ve mimariye sahiptir. Üreticinin özel ölçü üretim, özel desen tasarımı (örneğin Axminster dokuma) ve döşeme öncesi 3D görselleştirme gibi hizmetler sunup sunmadığı, projeye özgü çözüm kapasitesini gösterir.",
    },
  ],
  companyFit: {
    heading: "Asil Halı Bu Kriterlere Nasıl Uyuyor?",
    body:
      "Asil Halı, 1940'tan bu yana Kayseri merkezli üretim yapan, ISO 9001 kalite belgesine sahip bir firmadır. Akrilik, yün, polipropilen, polyamid ve özel desen Axminster olmak üzere 5 farklı malzeme kategorisinde üretim yapar ve her kalite kodu için hav yüksekliği, atkı sayısı, ilme yoğunluğu ve toplam ağırlık gibi teknik verileri kamuya açık teknik veri föyleri (/teknik-ozellikler) üzerinden paylaşır — sektörde her üreticinin yapmadığı bir şeffaflık düzeyi. Ayrıca, engelli bireylerin ibadetini kolaylaştırmak amacıyla görme engelliler için özel cami halısı üretimine katkıda bulunmuştur. Doğrulanabilir tek bir büyük ölçekli amiral gemisi projesini ve tüm sertifikalarının güncel kopyalarını proje bazında teknik ekibimizden talep edebilirsiniz.",
  },
  faq: [
    {
      q: "Cami halısı üreticisi seçerken en çok yapılan hata nedir?",
      a: "En sık yapılan hata, sadece fiyata bakıp teknik özellikleri (hav ağırlığı, düğüm yoğunluğu, yangın sınıfı) sormamaktır. Düşük fiyatlı bir halı, düşük yoğunluk nedeniyle 3-5 yıl içinde deforme olabilir; oysa doğru teknik özelliklere sahip bir halı 15-20 yıl sorunsuz kullanılabilir.",
    },
    {
      q: "Cami halısı üreticisinden hangi belgeleri istemeliyim?",
      a: "En az şunları isteyin: yangın sınıfı test raporu (EN 13501-1 / Bfl-s1), varsa ISO 9001 kalite belgesi, ürün garantisi belgesi ve teknik veri föyü (hav yüksekliği, ağırlık, düğüm yoğunluğu). Bu belgeler yoksa veya güncel değilse dikkatli olun.",
    },
    {
      q: "Cami halısı fiyatları neye göre değişir?",
      a: "Malzeme türü (akrilik en ekonomik, yün en pahalı), toplam alan, desen karmaşıklığı, altlık/montaj hizmeti ve teslimat süresi fiyatı belirleyen ana etkenlerdir. En doğru fiyat için proje bazlı keşif ve teklif almanız önerilir.",
    },
  ],
};

type FieldKey = "metaTitle" | "metaDescription" | "title" | "intro";

async function translate(text: string, langName: string): Promise<string> {
  const prompt = [
    `You are a professional translator for a Turkish mosque carpet company website.`,
    `Translate the following text from Turkish to ${langName}.`,
    `Rules:`,
    `- Translate ALL text content naturally, keep an informative/authoritative tone`,
    `- Keep "Asil Halı" and technical standard codes (ISO 9001, EN 13501-1, Bfl-s1, ISO 105-B02, EN 1815) unchanged`,
    `- Do not add any commentary or markdown formatting, return ONLY the translated plain text`,
    ``,
    `Text:`,
    text,
  ].join("\n");

  const { content } = await aiComplete({ messages: [{ role: "user", content: prompt }], temperature: 0.2 });
  return content.trim().replace(/^#+\s*/, "");
}

async function main() {
  const result: Record<string, any> = { tr: TR_SOURCE };

  for (const [locale, langName] of Object.entries(TARGET_LOCALES)) {
    console.log(`Translating -> ${locale}...`);

    const simpleFields = ["metaTitle", "metaDescription", "title", "intro"] as FieldKey[];
    const translatedSimple: Record<string, string> = {};
    for (const field of simpleFields) {
      translatedSimple[field] = await translate(TR_SOURCE[field], langName);
    }

    const criteria = [];
    for (const c of TR_SOURCE.criteria) {
      const [heading, body] = await Promise.all([translate(c.heading, langName), translate(c.body, langName)]);
      criteria.push({ heading, body });
    }

    const companyFit = {
      heading: await translate(TR_SOURCE.companyFit.heading, langName),
      body: await translate(TR_SOURCE.companyFit.body, langName),
    };

    const faq = [];
    for (const f of TR_SOURCE.faq) {
      const [q, a] = await Promise.all([translate(f.q, langName), translate(f.a, langName)]);
      faq.push({ q, a });
    }

    result[locale] = { ...translatedSimple, criteria, companyFit, faq };
    console.log(`  -> ${locale} done`);
  }

  const value = JSON.stringify(result);
  const existing = await prisma.setting.findUnique({ where: { key: KEY } });
  if (existing) {
    await prisma.setting.update({ where: { key: KEY }, data: { value } });
    console.log(`"${KEY}" güncellendi.`);
  } else {
    await prisma.setting.create({ data: { key: KEY, value } });
    console.log(`"${KEY}" oluşturuldu.`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
