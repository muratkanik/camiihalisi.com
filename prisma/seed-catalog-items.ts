/**
 * prisma/seed-catalog-items.ts
 * Kategori sayfalarındaki "Ürün Çeşitleri" filtre/kart bileşeninin (CategoryFiltersClient)
 * verisini Setting tablosuna "catalog_items" anahtarıyla yazar. Başlıklar next-intl'in
 * "categoryNames" namespace'inden (slug ile) çözülür — burada sadece Türkçe referans
 * metni ve yapısal veri (desen, rozet anahtarı, görsel, renkler) tutulur.
 *
 * Çalıştırma:
 *   npx tsx prisma/seed-catalog-items.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const KEY = "catalog_items";

const COMMON_COLORS = ["#0097A7", "#1B2E5E", "#8B1A1A", "#1A4E8B", "#C9972B", "#7A7A7A"];
const NATURAL_COLORS = ["#0097A7", "#1B2E5E", "#8B1A1A", "#6B4226", "#C9972B", "#F5EDD7"];

type CatalogDesen = "Standart" | "Saflı" | "Göbekli" | "Seccadeli" | "Özel";
type CatalogBadgeKey = "enCokSatan" | "premium" | "dayanikli" | "profesyonel" | "ozelSiparis";

interface SeedItem {
  slug: string;
  categorySlug: string;
  code: string;
  title: string;
  desen: CatalogDesen;
  image: string;
  colors: string[];
  badgeKey?: CatalogBadgeKey;
}

const ITEMS: SeedItem[] = [
  // Akrilik
  { slug: "akrilik-cami-halisi", categorySlug: "akrilik-cami-halisi", code: "AKR-STD", title: "Akrilik Cami Halısı", desen: "Standart", image: "/images/cami-katalog-01.png", colors: COMMON_COLORS, badgeKey: "enCokSatan" },
  { slug: "safli-akrilik-cami-halisi", categorySlug: "akrilik-cami-halisi", code: "AKR-SAF", title: "Saflı Akrilik Cami Halısı", desen: "Saflı", image: "/images/cami-katalog-02.png", colors: COMMON_COLORS },
  { slug: "gobekli-akrilik-cami-halisi", categorySlug: "akrilik-cami-halisi", code: "AKR-GOB", title: "Göbekli Akrilik Cami Halısı", desen: "Göbekli", image: "/images/gobekli-cami-halisi.png", colors: COMMON_COLORS },
  { slug: "seccadeli-akrilik-cami-halisi", categorySlug: "akrilik-cami-halisi", code: "AKR-SEC", title: "Seccadeli Akrilik Cami Halısı", desen: "Seccadeli", image: "/images/cami-katalog-04.png", colors: COMMON_COLORS },
  // Yün
  { slug: "yun-cami-halisi", categorySlug: "yun-cami-halisi", code: "YUN-STD", title: "Yün Cami Halısı", desen: "Standart", image: "/images/cami-katalog-05.png", colors: NATURAL_COLORS, badgeKey: "premium" },
  { slug: "safli-yun-cami-halisi", categorySlug: "yun-cami-halisi", code: "YUN-SAF", title: "Saflı Yün Cami Halısı", desen: "Saflı", image: "/images/cami-katalog-06.png", colors: NATURAL_COLORS },
  { slug: "gobekli-yun-cami-halisi", categorySlug: "yun-cami-halisi", code: "YUN-GOB", title: "Göbekli Yün Cami Halısı", desen: "Göbekli", image: "/images/cami-katalog-07.png", colors: NATURAL_COLORS },
  { slug: "seccadeli-yun-cami-halisi", categorySlug: "yun-cami-halisi", code: "YUN-SEC", title: "Seccadeli Yün Cami Halısı", desen: "Seccadeli", image: "/images/cami-katalog-08.png", colors: NATURAL_COLORS },
  // Polipropilen
  { slug: "polipropilen-cami-halisi", categorySlug: "polipropilen-cami-halisi", code: "PP-STD", title: "Polipropilen Cami Halısı", desen: "Standart", image: "/images/cami-katalog-09.png", colors: COMMON_COLORS, badgeKey: "dayanikli" },
  { slug: "safli-polipropilen-cami-halisi", categorySlug: "polipropilen-cami-halisi", code: "PP-SAF", title: "Saflı Polipropilen Cami Halısı", desen: "Saflı", image: "/images/cami-katalog-10.png", colors: COMMON_COLORS },
  { slug: "gobekli-polipropilen-cami-halisi", categorySlug: "polipropilen-cami-halisi", code: "PP-GOB", title: "Göbekli Polipropilen Cami Halısı", desen: "Göbekli", image: "/images/cami-katalog-11.png", colors: COMMON_COLORS },
  { slug: "seccadeli-polipropilen-cami-halisi", categorySlug: "polipropilen-cami-halisi", code: "PP-SEC", title: "Seccadeli Polipropilen Cami Halısı", desen: "Seccadeli", image: "/images/cami-katalog-12.png", colors: COMMON_COLORS },
  // Polyamid
  { slug: "polyamid-cami-halisi", categorySlug: "polyamid-cami-halisi", code: "PA-STD", title: "Polyamid Cami Halısı", desen: "Standart", image: "/images/cami-katalog-13.png", colors: COMMON_COLORS, badgeKey: "profesyonel" },
  { slug: "safli-polyamid-cami-halisi", categorySlug: "polyamid-cami-halisi", code: "PA-SAF", title: "Saflı Polyamid Cami Halısı", desen: "Saflı", image: "/images/cami-katalog-14.png", colors: COMMON_COLORS },
  { slug: "gobekli-polyamid-cami-halisi", categorySlug: "polyamid-cami-halisi", code: "PA-GOB", title: "Göbekli Polyamid Cami Halısı", desen: "Göbekli", image: "/images/cami-katalog-15.png", colors: COMMON_COLORS },
  { slug: "seccadeli-polyamid-cami-halisi", categorySlug: "polyamid-cami-halisi", code: "PA-SEC", title: "Seccadeli Polyamid Cami Halısı", desen: "Seccadeli", image: "/images/cami-katalog-16.png", colors: COMMON_COLORS },
  // Özel desen
  { slug: "ozel-desen-axminster-cami-halisi", categorySlug: "ozel-desen-axminster-cami-halisi", code: "AXM-OZL", title: "Özel Desen Axminster Cami Halısı", desen: "Özel", image: "/images/cami-katalog-17.png", colors: [...COMMON_COLORS, ...NATURAL_COLORS], badgeKey: "ozelSiparis" },
];

async function main() {
  const items = ITEMS.map((item) => ({
    id: item.slug,
    categorySlug: item.categorySlug,
    slug: item.slug,
    code: item.code,
    title: item.title,
    desen: item.desen,
    image: item.image,
    colors: item.colors,
    ...(item.badgeKey ? { badgeKey: item.badgeKey } : {}),
  }));

  const value = JSON.stringify(items);

  const existing = await prisma.setting.findUnique({ where: { key: KEY } });
  if (existing) {
    await prisma.setting.update({ where: { key: KEY }, data: { value } });
    console.log(`"${KEY}" güncellendi (${items.length} ürün).`);
  } else {
    await prisma.setting.create({ data: { key: KEY, value } });
    console.log(`"${KEY}" oluşturuldu (${items.length} ürün).`);
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
