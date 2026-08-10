/**
 * prisma/seed-legal-pages.ts
 * "/gizlilik" ve "/kullanim-sartlari" sayfaları için Türkçe kaynak metni yazar,
 * aiComplete() (XAI → OpenRouter yedekli) ile 5 dile çevirir ve Setting
 * tablosuna "legal_pages_data" anahtarıyla kaydeder.
 *
 * Çalıştırma:
 *   npx tsx prisma/seed-legal-pages.ts
 */
import { PrismaClient } from "@prisma/client";
import { aiComplete } from "../src/lib/ai/complete";

const prisma = new PrismaClient();
const KEY = "legal_pages_data";

const TARGET_LOCALES: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  ar: "Arabic (Modern Standard Arabic, MSA)",
  ru: "Russian",
};

// AI çevirisine gitmeyen sabit "son güncelleme" etiketi — dile göre elle çevrilir.
const UPDATED_LABEL: Record<string, string> = {
  tr: "Son güncelleme: Ağustos 2026",
  en: "Last updated: August 2026",
  de: "Zuletzt aktualisiert: August 2026",
  fr: "Dernière mise à jour : août 2026",
  ar: "آخر تحديث: أغسطس 2026",
  ru: "Последнее обновление: август 2026 г.",
};

const TR_SOURCE = {
  gizlilik: {
    title: "Gizlilik Politikası",
    updated: "Son güncelleme: Ağustos 2026",
    body: `## 1. Veri Sorumlusu

camiihalisi.com ("Site"), Asil Halı A.Ş. ("Asil Halı", "biz") tarafından işletilen bir bilgi ve tanıtım portalıdır. Bu Gizlilik Politikası, Site üzerinden kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar. Veri sorumlusu Asil Halı A.Ş., Kayseri Organize Sanayi Bölgesi, Kayseri, Türkiye adresinde faaliyet göstermektedir.

## 2. Hangi Verileri Topluyoruz

Site üzerindeki iletişim formu, teklif talebi veya WhatsApp yönlendirmesi aracılığıyla bize ulaştığınızda; adınızı, telefon numaranızı, e-posta adresinizi ve mesajınızda paylaştığınız diğer bilgileri işleyebiliriz. Ayrıca Google Analytics aracılığıyla, çerezler yoluyla, IP adresi, tarayıcı türü, ziyaret edilen sayfalar ve site üzerindeki gezinme davranışına ilişkin anonim/istatistiksel veriler toplanır.

## 3. Verilerin İşlenme Amacı

Kişisel verileriniz; talebinize veya sorunuza yanıt vermek, teklif hazırlamak, müşteri hizmetleri sunmak, Site'nin kullanım kalitesini analiz etmek ve yasal yükümlülüklerimizi yerine getirmek amacıyla, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") madde 5'te belirtilen hukuki sebeplere dayanılarak işlenir.

## 4. Verilerin Paylaşımı

Kişisel verileriniz, açık rızanız veya yasal bir zorunluluk olmadıkça üçüncü kişilerle paylaşılmaz. Site'de kullanılan Google Analytics (Google LLC) ve WhatsApp (Meta Platforms, Inc.) gibi üçüncü taraf hizmet sağlayıcılar, kendi gizlilik politikaları kapsamında sınırlı teknik verilere erişebilir. Satış işlemleri Asil Halı A.Ş.'nin ana sitesi olan asilhali.com.tr üzerinden yürütülür; bu siteye yönlendirilmeniz halinde ilgili sitenin gizlilik politikası geçerli olur.

## 5. Çerezler

Site, kullanıcı deneyimini iyileştirmek ve ziyaretçi istatistiklerini ölçmek amacıyla çerezler kullanır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu durumda Site'nin bazı özellikleri düzgün çalışmayabilir.

## 6. Veri Sahibinin Hakları

KVKK madde 11 uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme ve bu işlemlerin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme haklarına sahipsiniz. Taleplerinizi info@asilhali.com.tr adresine iletebilirsiniz.

## 7. Veri Güvenliği

Kişisel verilerinizin güvenliğini sağlamak için uygun teknik ve idari tedbirler alınmaktadır. Ancak internet üzerinden veri iletiminin veya elektronik depolamanın %100 güvenli olmadığını hatırlatırız.

## 8. Politika Değişiklikleri

Bu Gizlilik Politikası zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada yayınlanır.

## 9. İletişim

Gizlilik ile ilgili sorularınız için: info@asilhali.com.tr`,
  },
  "kullanim-sartlari": {
    title: "Kullanım Şartları",
    updated: "Son güncelleme: Ağustos 2026",
    body: `## 1. Genel Bilgi

camiihalisi.com ("Site"), Asil Halı A.Ş. tarafından işletilen bir bilgi ve tanıtım portalıdır. Site; cami halısı ürün çeşitleri, teknik özellikler, referanslar ve iletişim bilgileri sunar. Site üzerinden doğrudan satış veya online ödeme işlemi gerçekleştirilmez; satış süreçleri Asil Halı A.Ş.'nin ana kurumsal sitesi olan asilhali.com.tr veya doğrudan müşteri temsilcileri üzerinden yürütülür.

## 2. Kabul

Site'yi kullanarak bu Kullanım Şartları'nı kabul etmiş sayılırsınız. Bu şartları kabul etmiyorsanız, Site'yi kullanmamanızı rica ederiz.

## 3. İçeriğin Doğruluğu

Site'de yer alan ürün görselleri, renk simülasyonları, teknik veriler ve fiyat aralıkları bilgilendirme amaçlıdır. Ekran kalibrasyonu, ışık koşulları ve üretim partisi farklılıkları nedeniyle gerçek ürün ile görseller arasında küçük farklılıklar olabilir. Kesin teknik özellikler ve fiyatlandırma, proje bazlı olarak Asil Halı uzmanlarıyla teyit edilmelidir.

## 4. Fikri Mülkiyet

Site'deki tüm metin, görsel, logo, desen ve teknik doküman içerikleri Asil Halı A.Ş.'ye aittir veya Asil Halı A.Ş. tarafından lisanslı olarak kullanılmaktadır. Önceden yazılı izin alınmaksızın bu içeriklerin ticari amaçla çoğaltılması, dağıtılması veya kullanılması yasaktır.

## 5. Kullanıcı Yükümlülükleri

Site'yi kullanırken yürürlükteki mevzuata aykırı, yanıltıcı veya üçüncü kişilerin haklarını ihlal edici şekilde davranmamayı kabul edersiniz. İletişim formu veya teklif talebi aracılığıyla paylaştığınız bilgilerin doğru ve güncel olduğunu beyan edersiniz.

## 6. Sorumluluğun Sınırlandırılması

Asil Halı A.Ş., Site'nin kesintisiz veya hatasız çalışacağını garanti etmez. Site içeriğine güvenerek alınan kararlardan doğabilecek dolaylı zararlardan Asil Halı A.Ş. sorumlu tutulamaz. Nihai sözleşme ve satış koşulları, taraflar arasında ayrıca yapılacak yazılı anlaşma ile belirlenir.

## 7. Dış Bağlantılar

Site, WhatsApp ve asilhali.com.tr gibi üçüncü taraf platformlara yönlendirme bağlantıları içerebilir. Bu platformların içerik ve gizlilik uygulamalarından Asil Halı A.Ş. sorumlu değildir.

## 8. Değişiklik Hakkı

Asil Halı A.Ş., bu Kullanım Şartları'nı önceden bildirimde bulunmaksızın güncelleme hakkını saklı tutar. Güncel sürüm her zaman bu sayfada yayınlanır.

## 9. Uygulanacak Hukuk

Bu Kullanım Şartları Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda Kayseri (Türkiye) mahkemeleri ve icra daireleri yetkilidir.

## 10. İletişim

Sorularınız için: info@asilhali.com.tr`,
  },
};

type LegalKey = keyof typeof TR_SOURCE;

async function translate(text: string, langName: string): Promise<string> {
  const prompt = [
    `You are a professional legal translator for a Turkish mosque carpet manufacturer's website.`,
    `Translate the following Markdown-formatted legal text from Turkish to ${langName}.`,
    `Rules:`,
    `- Preserve the Markdown structure (## headings) exactly`,
    `- Translate ALL text content, keep tone formal/legal`,
    `- Keep "Asil Halı A.Ş.", email addresses, law references (e.g. "KVKK", "6698") as recognizable proper nouns — you may add a brief English gloss for KVKK on first mention if translating to a non-Turkish language, e.g. "KVKK (Turkish Data Protection Law No. 6698)"`,
    `- Do not add any commentary, return ONLY the translated text`,
    ``,
    `Text:`,
    text,
  ].join("\n");

  const { content } = await aiComplete({ messages: [{ role: "user", content: prompt }], temperature: 0.2 });
  return content.trim();
}

async function main() {
  const result: Record<string, Record<string, { title: string; updated: string; body: string }>> = {};

  for (const legalKey of Object.keys(TR_SOURCE) as LegalKey[]) {
    const src = TR_SOURCE[legalKey];
    result[legalKey] = { tr: src };

    for (const [locale, langName] of Object.entries(TARGET_LOCALES)) {
      console.log(`Translating ${legalKey} -> ${locale}...`);
      const [rawTitle, body] = await Promise.all([
        translate(src.title, langName),
        translate(src.body, langName),
      ]);
      // AI bazen kısa başlıkları da "## " ile döndürüyor — temizle.
      const title = rawTitle.replace(/^#+\s*/, "").trim();
      result[legalKey][locale] = { title, updated: UPDATED_LABEL[locale] ?? UPDATED_LABEL.tr, body };
    }
  }

  const value = JSON.stringify(result);
  const existing = await prisma.setting.findUnique({ where: { key: KEY } });
  if (existing) {
    await prisma.setting.update({ where: { key: KEY }, data: { value } });
    console.log(`"${KEY}" güncellendi.`);
  } else {
    await prisma.setting.create({ data: { key: KEY, value } });
    console.log(`"${KEY}" oluşturuldu.`);
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
