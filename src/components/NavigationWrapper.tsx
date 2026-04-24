import { getSettings, buildTrackedWaUrl } from "@/lib/settings";
import { getTranslations } from "next-intl/server";
import Navigation from "./Navigation";

interface Props {
  locale: string;
}

/**
 * Server component wrapper — fetches DB settings and translations,
 * passes them down to the client Navigation component.
 */
export default async function NavigationWrapper({ locale }: Props) {
  const [settings, t] = await Promise.all([
    getSettings(),
    getTranslations({ locale, namespace: "nav" }),
  ]);
  return (
    <Navigation
      locale={locale}
      waUrl={buildTrackedWaUrl(settings, "nav", "whatsapp")}
      phone={settings.phone}
      t={{
        mainSite: t("mainSite"),
        mainSiteLink: t("mainSiteLink"),
        whatsapp: t("whatsapp"),
        instagram: t("instagram"),
        linkedin: t("linkedin"),
        products: t("products"),
        carpets: t("carpets"),
        underlay: t("underlay"),
        gallery: t("gallery"),
        blog: t("blog"),
        about: t("about"),
        contact: t("contact"),
        references: t("references"),
        technicalSpecs: t("technicalSpecs"),
        getQuote: t("getQuote"),
        whatsappChat: t("whatsappChat"),
      }}
    />
  );
}
