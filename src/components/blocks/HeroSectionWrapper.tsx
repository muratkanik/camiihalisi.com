import { getHeroSlides, getHeroOverlayOpacity } from "@/app/[locale]/admin/hero/actions";
import HeroSection from "./HeroSection";

interface HeroContent {
  title?: string;
  subtitle?: string;
}

export default async function HeroSectionWrapper({ content }: { content?: HeroContent }) {
  const [slides, overlayOpacity] = await Promise.all([
    getHeroSlides(),
    getHeroOverlayOpacity(),
  ]);

  const activeSlides = slides.filter((s) => s.isActive);

  return (
    <HeroSection
      content={content}
      slides={activeSlides.length > 0 ? activeSlides : undefined}
      overlayOpacity={overlayOpacity}
    />
  );
}
