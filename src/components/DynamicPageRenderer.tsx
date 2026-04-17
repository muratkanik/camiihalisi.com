import { PrismaClient } from "@prisma/client";
import HeroSection from "@/components/blocks/HeroSection";
import FeatureGrid from "@/components/blocks/FeatureGrid";
import CTASection from "@/components/blocks/CTASection";
import FAQSection from "@/components/blocks/FAQSection";
import StatsSection from "@/components/blocks/StatsSection";
import CategoryGrid from "@/components/blocks/CategoryGrid";
import BlogPreview from "@/components/blocks/BlogPreview";

const prisma = new PrismaClient();

interface Props {
  slug: string;
  locale: string;
}

function parseContent(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default async function DynamicPageRenderer({ slug, locale }: Props) {
  let page = null;
  try {
    page = await prisma.page.findUnique({
      where: { slug },
      include: {
        blocks: {
          where: { isActive: true },
          include: {
            translations: { where: { locale } },
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  } catch {
    // DB bağlantısı yoksa veya hata varsa sessizce geç
  }

  if (!page || page.blocks.length === 0) {
    return null; // Çağıran sayfa kendi içeriğini render eder
  }

  return (
    <div>
      {page.blocks.map((block) => {
        const raw = block.translations[0]?.contentData || block.schemaDef;
        const content = parseContent(raw);

        switch (block.componentType) {
          case "hero":
            return <HeroSection key={block.id} content={content as any} />;
          case "stats":
            return <StatsSection key={block.id} />;
          case "categories":
            return <CategoryGrid key={block.id} locale={locale} />;
          case "features":
            return <FeatureGrid key={block.id} />;
          case "cta":
            return (
              <CTASection
                key={block.id}
                variant={(content as any).variant || "green"}
                title={(content as any).title}
                subtitle={(content as any).subtitle}
              />
            );
          case "faq":
            return (
              <FAQSection
                key={block.id}
                faqs={(content as any).faqs}
                title={(content as any).title}
              />
            );
          case "blog-preview":
            return <BlogPreview key={block.id} locale={locale} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
