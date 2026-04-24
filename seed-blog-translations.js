/**
 * Seed blog translations for the 3 ProblemSection posts.
 * Run from repo root: node seed-blog-translations.js
 */
const { PrismaClient } = require("@prisma/client");

const TRANSLATIONS = {
  "yanlis-teknik-secim-neden-hali-yipratiyor": {
    en: {
      title: "Wrong Technical Choice",
      excerpt: "If the wrong thread, density and base are chosen, carpets deform quickly.",
    },
    ar: {
      title: "الاختيار التقني الخاطئ",
      excerpt: "إذا لم يتم اختيار الخيط والكثافة والقاعدة الصحيحة، تتشوه السجاجيد بسرعة.",
    },
    fr: {
      title: "Mauvais Choix Technique",
      excerpt: "Si le mauvais fil, la densité et la base ne sont pas choisis, les tapis se déforment rapidement.",
    },
  },
  "eksik-zemin-analizi-cami-halisini-nasil-etkiler": {
    en: {
      title: "Insufficient Floor Analysis",
      excerpt: "If floor details and usage intensity are not properly analyzed, unavoidable problems arise.",
    },
    ar: {
      title: "تحليل الأرضية غير الكافي",
      excerpt: "إذا لم يتم تحليل تفاصيل الأرضية وكثافة الاستخدام بشكل صحيح، تنشأ مشاكل لا يمكن تجنبها.",
    },
    fr: {
      title: "Analyse du Sol Insuffisante",
      excerpt: "Si les détails du sol et l'intensité d'utilisation ne sont pas correctement analysés, des problèmes inévitables surviennent.",
    },
  },
  "kalitesiz-montaj-sureci-hali-omrunu-kisaltiyor": {
    en: {
      title: "Poor Installation Process",
      excerpt: "Irregular and unprofessional installation shortens the lifespan of the carpet.",
    },
    ar: {
      title: "عملية تركيب رديئة",
      excerpt: "التركيب غير المنتظم وغير الاحترافي يقصر من عمر السجادة.",
    },
    fr: {
      title: "Mauvais Processus d'Installation",
      excerpt: "Une installation irrégulière et non professionnelle raccourcit la durée de vie du tapis.",
    },
  },
};

async function main() {
  const prisma = new PrismaClient();
  try {
    const row = await prisma.setting.findUnique({ where: { key: "blog_translations" } });
    const existing = row ? JSON.parse(row.value) : {};

    for (const [slug, localeMap] of Object.entries(TRANSLATIONS)) {
      if (!existing[slug]) existing[slug] = {};
      for (const [locale, fields] of Object.entries(localeMap)) {
        existing[slug][locale] = { ...(existing[slug][locale] ?? {}), ...fields };
      }
    }

    await prisma.setting.upsert({
      where: { key: "blog_translations" },
      create: { key: "blog_translations", value: JSON.stringify(existing) },
      update: { value: JSON.stringify(existing) },
    });

    console.log("✓ Blog translations seeded successfully");
    console.log("Slugs:", Object.keys(TRANSLATIONS).join(", "));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
