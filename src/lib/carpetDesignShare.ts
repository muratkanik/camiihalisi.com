import { CarpetDesignSessionData } from "@/types/carpetDesign";

export function generateWhatsAppMessage(design: CarpetDesignSessionData, shareUrl: string, locale: string = "tr", customerNote?: string): string {
  const lines: string[] = [];

  if (locale === "en") {
    lines.push(`Hello, I have created a custom color design for this mosque carpet. I would like to request a quote.`);
    lines.push(``);
    lines.push(`Product: ${design.productTitle}`);
    lines.push(`Design Link: ${shareUrl}`);
    lines.push(``);
    lines.push(`Color Changes:`);
    
    design.mappings.forEach((m) => {
      lines.push(`- Color ${Math.round(m.sourceColorPercentage)}% -> ${m.targetYarnCode} ${m.targetYarnNameEn}`);
    });
    
    if (customerNote) {
      lines.push(``);
      lines.push(`Note: ${customerNote}`);
    } else {
      lines.push(``);
      lines.push(`Note: Please provide size and pricing information.`);
    }
  } else {
    lines.push(`Merhaba, bu cami halısı deseni için özel renk çalışması yaptım. Teklif almak istiyorum.`);
    lines.push(``);
    lines.push(`Ürün: ${design.productTitle}`);
    lines.push(`Tasarım Linki: ${shareUrl}`);
    lines.push(``);
    lines.push(`Renk Değişimleri:`);

    design.mappings.forEach((m) => {
      lines.push(`- Renk %${Math.round(m.sourceColorPercentage)} -> ${m.targetYarnCode} ${m.targetYarnNameTr}`);
    });

    if (customerNote) {
      lines.push(``);
      lines.push(`Not: ${customerNote}`);
    } else {
      lines.push(``);
      lines.push(`Not: Ölçü ve fiyat bilgisi rica ederim.`);
    }
  }

  return lines.join("\n");
}

export function openWhatsAppChat(phoneNumber: string, message: string) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  window.open(url, "_blank");
}
