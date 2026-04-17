import { Shield, Truck, Ruler, Palette, Award, HeartHandshake, Star, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";

const ICONS = [Shield, Ruler, Palette, Truck, Award, HeartHandshake, Star, Clock];
const COLORS = ["#006064","#C9972B","#006064","#C9972B","#006064","#C9972B","#006064","#C9972B"];
const FEAT_KEYS = [
  ["quality",       "qualityDesc"],
  ["customSize",    "customSizeDesc"],
  ["customDesign",  "customDesignDesc"],
  ["delivery",      "deliveryDesc"],
  ["experience",    "experienceDesc"],
  ["afterSales",    "afterSalesDesc"],
  ["references",    "referencesDesc"],
  ["fastProduction","fastProductionDesc"],
] as const;

export default async function FeatureGrid() {
  const t = await getTranslations("features");

  const features = FEAT_KEYS.map(([titleKey, descKey], i) => ({
    icon: ICONS[i],
    title: t(titleKey),
    description: t(descKey),
    color: COLORS[i],
  }));

  return (
    <section className="section bg-white">
      <div className="container-site">
        {/* Başlık */}
        <div className="text-center mb-14">
          <span className="badge badge-green mb-4">{t("badge")}</span>
          <h2 className="section-title mb-4">
            {t("mainTitle")}
          </h2>
          <div className="gold-line mx-auto mb-4" />
          <p className="section-subtitle mx-auto">
            {t("mainSubtitle")}
          </p>
        </div>

        {/* Özellik Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#F0FDFE] border border-[#B2EBF2] hover:border-[#C9972B]/40 hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
                  style={{ backgroundColor: `${feat.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feat.color }} aria-hidden="true" />
                </div>
                <h3
                  className="font-bold text-[#1A1A1A] mb-2 text-base leading-snug"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem" }}
                >
                  {feat.title}
                </h3>
                <p className="text-sm text-[#6B6355] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
