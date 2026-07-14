import { getSettings, buildTrackedWaUrl } from "@/lib/settings";
import WhatsAppButtonClient from "./WhatsAppButtonClient";

export default async function WhatsAppButton() {
  const settings = await getSettings();
  const waUrl = buildTrackedWaUrl(settings, "floating-btn", "whatsapp");

  return <WhatsAppButtonClient waUrl={waUrl} />;
}
