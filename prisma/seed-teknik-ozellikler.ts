/**
 * prisma/seed-teknik-ozellikler.ts
 * /teknik-ozellikler sayfası hiç seed edilmemişti (Setting.key = "teknik_ozellikler_data"
 * satırı yoktu), bu yüzden tablo başlıkları görünüp satırlar boş kalıyordu. Sayfanın
 * kendi dosyasında zaten yazılmış ama hiç kullanılmayan SPECS_TABLE/MATERIAL_SPECS/CERTS
 * sabitlerini DB'ye taşır.
 *
 * Not: Bu sayfa henüz tek dilli (Türkçe) tasarlanmış — akrilik teknik veri föylerindeki
 * gibi locale-bazlı içerik için ayrı bir görev gerekir.
 *
 * Çalıştırma:
 *   npx tsx prisma/seed-teknik-ozellikler.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const KEY = "teknik_ozellikler_data";

const specsTable = [
  { ozellik: "Yangın Sınıfı", deger: "Bfl-s1 (EN 13501-1)", aciklama: "AB yangın yönetmeliği ibadet yerleri standardı" },
  { ozellik: "Renk Haslığı", deger: "ISO 105-B02 (≥5)", aciklama: "Güneş ışığına karşı renk kalıcılığı testi" },
  { ozellik: "Sürtme Renk Haslığı", deger: "ISO 105-X12 (≥4)", aciklama: "Sürtünmeye karşı renk dayanıklılığı" },
  { ozellik: "Hav Ağırlığı", deger: "1.800–3.200 gr/m²", aciklama: "Malzeme türüne göre değişir" },
  { ozellik: "Bağ Yoğunluğu", deger: "180.000–500.000/m²", aciklama: "Yüksek bağ yoğunluğu daha dayanıklı dokuma" },
  { ozellik: "Hav Yüksekliği", deger: "6–12 mm", aciklama: "Cami kullanımı için ideal aralık" },
  { ozellik: "Statik Elektrik", deger: "EN 1815 (≤2 kV)", aciklama: "İnsan vücuduna iletilen maksimum voltaj" },
  { ozellik: "Isıl Direnç", deger: "EN ISO 8302", aciklama: "Zemin ısı yalıtım katsayısı" },
  { ozellik: "Aşınma Direnci", deger: "EN ISO 9073-4", aciklama: "Martindale aşınma testi" },
  { ozellik: "Gürültü Azaltma", deger: "EN ISO 354", aciklama: "Ses yutma katsayısı" },
];

const materialSpecs = [
  { malzeme: "Akrilik", hav: "6–10 mm", agirlik: "1.800–2.400 gr/m²", omur: "15–20 yıl", yangin: "Bfl-s1", garanti: "5 yıl" },
  { malzeme: "Yün", hav: "8–12 mm", agirlik: "2.400–3.200 gr/m²", omur: "25–30 yıl", yangin: "Bfl-s1", garanti: "10 yıl" },
  { malzeme: "Polipropilen", hav: "6–8 mm", agirlik: "1.600–2.200 gr/m²", omur: "10–15 yıl", yangin: "Bfl-s1", garanti: "5 yıl" },
  { malzeme: "Polyamid", hav: "6–10 mm", agirlik: "2.000–2.800 gr/m²", omur: "20–25 yıl", yangin: "Bfl-s1", garanti: "7 yıl" },
];

async function main() {
  // Sertifikaların gerçek PDF/görsel dosyaları elde olmadığı için certificates ve
  // awards boş bırakılıyor — admin panelden (/admin/teknik) yüklenebilir.
  const data = { specsTable, materialSpecs, certificates: [] as unknown[], awards: [] as unknown[] };
  const value = JSON.stringify(data);

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
