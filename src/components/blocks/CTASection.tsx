import { ExternalLink, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getSettings } from "@/lib/settings";

const MAIN_SITE_URL =
  "/api/r?to=https%3A%2F%2Fwww.asilhali.com.tr%3Futm_source%3Dcamiihalisi%26utm_medium%3Dcta%26utm_campaign%3Dsite&from=cta&label=fiyat-teklifi&cat=outbound";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  variant?: "green" | "cream";
}

export default async function CTASection({
  title,
  subtitle,
  variant = "green",
}: CTASectionProps) {
  const [t, settings] = await Promise.all([getTranslations("cta"), getSettings()]);
  const isGreen = variant === "green";

  const displayTitle = title ?? (isGreen ? t("greenTitle") : t("creamTitle"));
  const displaySubtitle = subtitle ?? (isGreen ? t("greenSubtitle") : t("creamSubtitle"));

  return (
    <section
      className={`section relative overflow-hidden ${
        isGreen ? "bg-[#006064]" : "bg-[#F0FDFE]"
      }`}
    >
      {/* Geometrik arkaplan motifi */}
      {isGreen && (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%23C9972B' stroke-width='1' fill='none'/%3E%3Ccircle cx='50' cy='50' r='28' stroke='%23C9972B' stroke-width='1' fill='none'/%3E%3Ccircle cx='50' cy='50' r='16' stroke='%23C9972B' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
          }}
        />
      )}

      <div className="container-site relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Dekoratif çizgi */}
          <div className="arabesque-divider mb-8">
            <span
              className={`text-sm font-semibold tracking-widest uppercase ${
                isGreen ? "text-[#C9972B]" : "text-[#006064]"
              }`}
            >
              ☽ Asil Halı A.Ş. ☾
            </span>
          </div>

          {/* Başlık */}
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${
              isGreen ? "text-white" : "text-[#006064]"
            }`}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {displayTitle}
          </h2>

          {/* Açıklama */}
          <p
            className={`text-base md:text-lg leading-relaxed mb-10 ${
              isGreen ? "text-[#F0FDFE]/80" : "text-[#6B6355]"
            }`}
          >
            {displaySubtitle}
          </p>

          {/* Butonlar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={MAIN_SITE_URL}
              target="_blank"
              rel="noopener"
              className="btn btn-gold text-base !px-8 !py-3.5"
            >
              {t("getQuoteBtn")}
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className={`btn text-base !px-8 !py-3.5 ${
                isGreen ? "btn-outline" : "btn-outline-dark"
              }`}
            >
              <Phone className="w-4 h-4" />
              {t("callNow")}
            </a>
          </div>

          {/* Güven notu */}
          <p
            className={`mt-8 text-sm ${
              isGreen ? "text-[#F0FDFE]/50" : "text-[#6B6355]/70"
            }`}
          >
            {t("trustNote")}
          </p>
        </div>
      </div>
    </section>
  );
}
