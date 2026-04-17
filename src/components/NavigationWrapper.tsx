import { getSettings, buildTrackedWaUrl } from "@/lib/settings";
import Navigation from "./Navigation";

interface Props {
  locale: string;
}

/**
 * Server component wrapper — fetches DB settings and passes them
 * down to the client Navigation component.
 */
export default async function NavigationWrapper({ locale }: Props) {
  const settings = await getSettings();
  return (
    <Navigation
      locale={locale}
      waUrl={buildTrackedWaUrl(settings, "nav", "whatsapp")}
      phone={settings.phone}
    />
  );
}
