import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ExternalLink, ChevronRight } from "lucide-react";

import Navigation from "@/components/NavigationWrapper";
import Footer from "@/components/Footer";
import CTASection from "@/components/blocks/CTASection";
import FAQSection from "@/components/blocks/FAQSection";

const SITE_URL = "https://camiihalisi.com";
const MAIN_SITE_URL = "https://www.asilhali.com.tr?utm_source=camiihalisi&utm_medium=kategori&utm_campaign=";

interface CategoryData {
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  longDescription: string;
  image: string;
  heroImage: string;
  badge: string;
  color: string;
  advantages: string[];
  specs: Array<{ label: string; value: string }>;
  useCases: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
}

const CATEGORIES: Record<string, CategoryData> = {
  "akrilik-cami-halisi": {
    slug: "akrilik-cami-halisi",
    title: "Akrilik Cami Halısı",
    shortTitle: "Akrilik Halı",
    metaTitle: "Akrilik Cami Halısı | Fiyatları, Çeşitleri ve Özellikleri – Asil Halı",
    metaDescription:
      "Akrilik cami halısı fiyatları, çeşitleri ve özellikleri. Solmaz renk, yumuşak doku, ekonomik fiyat. Özel ölçü üretim, Türkiye geneli teslimat. Asil Halı A.Ş.",
    description:
      "Parlak renkleri, yumuşak dokusu ve ekonomik fiyatıyla Türkiye'de en çok tercih edilen cami halısı türü.",
    longDescription: `
Akrilik cami halısı, sentetik liflerin içinde en yüksek kalite-fiyat oranını sunan tercih olup Türkiye'deki camilerin büyük çoğunluğunda kullanılmaktadır. Yüksek UV direnci sayesinde uzun yıllar solmayan canlı renkler korunur. Caminin genel havasına uygun, özel desen tasarımıyla üretilir.

Akrilik liflerin gözenekli yapısı, cami ortamında oluşabilecek nemi emer ve buharlaştırarak sağlıklı bir zemin sağlar. Günlük cemaat yoğunluğuna dayanacak şekilde üretilen akrilik halılar, düzenli bakım ile 15-20 yıl sorunsuz kullanılabilir.

Asil Halı'nın akrilik serisi; mihrap önünden saf aralarına, merdivenlerden koridor kenarlarına kadar tüm cami alanlarına uygun özel kesim seçenekleriyle sunulmaktadır.
    `,
    image: "/images/cami-1.png",
    heroImage: "/images/cami-hero.png",
    badge: "En Çok Satan",
    color: "#1B4332",
    advantages: [
      "Uzun yıllar solmayan UV dirençli renkler",
      "Yumuşak ve konforlu doku — uzun ibadet seansları için ideal",
      "Nem emici ve hızlı kuruyan yapı",
      "Ekonomik fiyat-performans oranı",
      "Özel desen ve renk seçeneği",
      "Kolay temizlik ve bakım",
      "15-20 yıl kullanım ömrü",
      "Alevlenmeye karşı sertifikalı",
    ],
    specs: [
      { label: "Lif Türü", value: "Akrilik (100%)" },
      { label: "Dokuma Yöntemi", value: "Makine Dokuması" },
      { label: "Hav Yüksekliği", value: "6-10 mm" },
      { label: "Ağırlık", value: "1.800-2.400 gr/m²" },
      { label: "Bağ Yoğunluğu", value: "180.000-350.000 düğüm/m²" },
      { label: "Yangın Sınıfı", value: "Bfl-s1 (EN 13501-1)" },
      { label: "Garanti", value: "5 Yıl" },
      { label: "Üretim Yeri", value: "Türkiye" },
    ],
    useCases: [
      "Küçük ve orta boy mahalle camileri",
      "Belediye ve vakıf camileri",
      "Okul ve üniversite mescitleri",
      "Alış veriş merkezi ve iş yeri mescitleri",
      "Yurt ve öğrenci evi mescitleri",
    ],
    faqs: [
      {
        question: "Akrilik cami halısının ömrü ne kadardır?",
        answer:
          "Kaliteli akrilik cami halısı, düzenli temizlik ve bakımla 15-20 yıl sorunsuz kullanılabilir. Asil Halı ürünleri 5 yıl garantilidir.",
      },
      {
        question: "Akrilik halı mı yün halı mı daha iyi?",
        answer:
          "Bütçe ve kullanım yoğunluğuna göre değişir. Akrilik daha ekonomik ve kolay bakımlıdır; yün ise daha doğal ve uzun ömürlüdür. Her ikisi de cami için uygundur.",
      },
      {
        question: "Özel desen yaptırabilir miyim?",
        answer:
          "Evet. Caminizin mimarisine veya bölgesel geleneğe uygun özel desen tasarımı ücretsiz olarak hazırlanır, onayınızın ardından üretime geçilir.",
      },
      {
        question: "Minimum sipariş miktarı nedir?",
        answer:
          "Minimum sipariş miktarı yoktur. Küçük bir mescit için 10 m² veya büyük bir cami için 5.000 m² sipariş verilebilir.",
      },
    ],
    relatedSlugs: ["yun-cami-halisi", "polipropilen-cami-halisi", "polyamid-cami-halisi"],
  },

  "yun-cami-halisi": {
    slug: "yun-cami-halisi",
    title: "Yün Cami Halısı",
    shortTitle: "Yün Halı",
    metaTitle: "Yün Cami Halısı | Doğal, Dayanıklı, Premium Kalite – Asil Halı",
    metaDescription:
      "Yün cami halısı: doğal lif, uzun ömür, ısı yalıtımı ve doğal nem yönetimi. Premium kalite, özel ölçü üretim. Asil Halı A.Ş. – Türkiye geneli teslimat.",
    description:
      "Doğal yünün sıcaklığı, dayanıklılığı ve neme karşı doğal direnciyle ibadethaneye özel lüks deneyim.",
    longDescription: `
Yün cami halısı, binlerce yıllık gelenekte köklü bir yere sahiptir. Doğal protein lifleri sayesinde yün; ısıyı dengeler, nemi yönetir ve cami ortamının hijyenine katkı sağlar. Sentetik liflere kıyasla çok daha uzun ömürlü olan yün halılar, 25-30 yıl veya daha fazla kullanılabilir.

Yünün doğal kir itici özelliği, yoğun kullanımda bile halının görünümünü uzun süre korur. Üstelik yün, statik elektriği tutmadığı için toz birikmesini önler; bu da ibadet ortamının temizliğine doğrudan katkıda bulunur.

Asil Halı'nın yün serisi; New Zealand ve Türk yününden seçilen en kaliteli hammaddelerle, geleneksel İslami desenlerle üretilmektedir. Büyük camilerin prestijli alanları, mihrap önleri ve imam namaz yerleri için özellikle tavsiye edilir.
    `,
    image: "/images/cami-2.png",
    heroImage: "/images/cami-hero.png",
    badge: "Premium",
    color: "#2D6A4F",
    advantages: [
      "%100 doğal yün, çevre dostu üretim",
      "Doğal ısı ve nem yönetimi",
      "25-30 yıl uzun kullanım ömrü",
      "Doğal kir ve leke direnci",
      "Statik elektriği tutmaz, toz biriktirmez",
      "Yangına karşı doğal direnç",
      "Hipoalerjenik — alerjik reaksiyon riski düşük",
      "Yıllar geçtikçe patina kazanan doku",
    ],
    specs: [
      { label: "Lif Türü", value: "Yün (80-100%)" },
      { label: "Dokuma Yöntemi", value: "El ve Makine Dokuması" },
      { label: "Hav Yüksekliği", value: "8-14 mm" },
      { label: "Ağırlık", value: "2.200-3.500 gr/m²" },
      { label: "Bağ Yoğunluğu", value: "200.000-500.000 düğüm/m²" },
      { label: "Yangın Sınıfı", value: "Bfl-s1 (EN 13501-1)" },
      { label: "Garanti", value: "10 Yıl" },
      { label: "Üretim Yeri", value: "Türkiye" },
    ],
    useCases: [
      "Büyük ve prestijli cami projeleri",
      "Külliye ve tarihi cami restorasyonları",
      "İmam namaz ve mihrap alanları",
      "VIP toplantı salonları ve dini merasim alanları",
      "Yurt dışı ihracat projeleri",
    ],
    faqs: [
      {
        question: "Yün cami halısı nasıl temizlenir?",
        answer:
          "Yün halılar profesyonel kuru temizleme veya soğuk su ile yıkama ile temizlenir. Sıcak su ve ağır deterjanlardan kaçınılmalıdır. Yılda 1-2 kez profesyonel bakım önerilir.",
      },
      {
        question: "Yün halı nem çeker mi?",
        answer:
          "Yün doğal nem yönetimi sağlar; havadan nemi alır ve bırakır, ancak ıslak zemine konmamalıdır. Camide taban nem yalıtımı yapılması önerilir.",
      },
      {
        question: "Yün halının fiyatı akrilikten neden yüksek?",
        answer:
          "Doğal yün hammaddesi daha pahalıdır ve işlenme süreci daha uzundur. Ancak 2-3 kat daha uzun ömrü hesaba katıldığında, uzun vadede daha ekonomik olur.",
      },
    ],
    relatedSlugs: ["akrilik-cami-halisi", "polyamid-cami-halisi", "polipropilen-cami-halisi"],
  },

  "polipropilen-cami-halisi": {
    slug: "polipropilen-cami-halisi",
    title: "Polipropilen Cami Halısı",
    shortTitle: "Polipropilen Halı",
    metaTitle: "Polipropilen Cami Halısı | Dayanıklı, Kolay Temizlik – Asil Halı",
    metaDescription:
      "Polipropilen cami halısı: leke tutmaz, kolay temizlenir, yüksek trafik alanları için ideal. Modern teknoloji, ekonomik fiyat. Asil Halı A.Ş.",
    description:
      "Yüksek trafik alanları için üretilmiş, kolay temizlenen ve leke tutmayan modern polipropilen teknoloji.",
    longDescription: `
Polipropilen (PP) cami halısı, sentetik liflerin içinde en yüksek kimyasal dirence sahip olanıdır. Nem ve su tutmayan yapısı sayesinde leke riski minimumdur; sıvılar yüzeyden kolaylıkla temizlenir. Bu özelliği, çok sayıda cemaatin kullandığı yoğun trafik camilerinde büyük avantaj sağlar.

Polipropilen halılar UV ışınlarına karşı da dayanıklıdır; renk solması minimum düzeydedir. Hafif yapısı sayesinde kurulum ve taşıma kolaylığı sağlar. Isıya ve güneş ışığına karşı dirençli olduğu için açık avlu, teras ve dış mekan kullanım alanları için de uygundur.

Asil Halı'nın polipropilen serisi, özellikle büyük şehirlerdeki kalabalık camilerde ve sürekli kullanım gerektiren alanlarda üstün performans göstermektedir.
    `,
    image: "/images/cami-3.png",
    heroImage: "/images/cami-hero.png",
    badge: "Dayanıklı",
    color: "#1B4332",
    advantages: [
      "Su ve neme karşı üstün direnç",
      "Leke tutmaz yüzey — kolay temizlik",
      "Yüksek aşınma direnci",
      "UV'ye dayanıklı, solmaz renkler",
      "Hafif yapı — kolay kurulum",
      "İç ve dış mekan kullanımına uygun",
      "Ekonomik uzun vadeli bakım maliyeti",
      "Hızlı kuruma özelliği",
    ],
    specs: [
      { label: "Lif Türü", value: "Polipropilen (PP) 100%" },
      { label: "Dokuma Yöntemi", value: "Makine Dokuması (BCF)" },
      { label: "Hav Yüksekliği", value: "5-8 mm" },
      { label: "Ağırlık", value: "1.500-2.000 gr/m²" },
      { label: "Su Geçirmezlik", value: "Yüksek (Hidrofobik)" },
      { label: "Yangın Sınıfı", value: "Bfl-s1 (EN 13501-1)" },
      { label: "Garanti", value: "5 Yıl" },
      { label: "Üretim Yeri", value: "Türkiye" },
    ],
    useCases: [
      "Yüksek yoğunluklu şehir camileri",
      "Cami girişleri ve koridorlar",
      "Cami avlusu ve dış mekan alanları",
      "Kışlık cami alanları ve ısıtmalı zeminler",
      "Bütçe kısıtlı büyük alanlar",
    ],
    faqs: [
      {
        question: "Polipropilen halı ısıya dayanıklı mıdır?",
        answer:
          "Standart cami sıcaklıklarında (–20°C ile +40°C) sorunsuz kullanılır. Radyant ısıtma sistemleri için özel alt taban önerilir.",
      },
      {
        question: "Polipropilen cami halısı nasıl temizlenir?",
        answer:
          "Su ve hafif deterjanla kolayca temizlenir. Buhar makinesiyle yıkamaya uygundur. Endüstriyel temizlik makineleriyle de kullanılabilir.",
      },
    ],
    relatedSlugs: ["akrilik-cami-halisi", "polyamid-cami-halisi", "yun-cami-halisi"],
  },

  "polyamid-cami-halisi": {
    slug: "polyamid-cami-halisi",
    title: "Polyamid Cami Halısı",
    shortTitle: "Polyamid Halı",
    metaTitle: "Polyamid Cami Halısı | En Yüksek Aşınma Direnci – Asil Halı",
    metaDescription:
      "Polyamid (naylon) cami halısı: en yüksek aşınma direnci, canlı renkler, büyük cami projeleri için profesyonel çözüm. Asil Halı A.Ş.",
    description:
      "Sentetik liflerin en kalitelisi. Yüksek aşınma direnci ve canlı renklerle büyük camilerin tercihi.",
    longDescription: `
Polyamid (naylon) cami halısı, sentetik halı liflerinin içinde en yüksek aşınma direncine sahip olanıdır. Özellikle on binlerce kişinin haftalık olarak kullandığı büyük camilerde, bu özellik belirleyici öneme sahiptir. Polyamid lifler, yoğun baskı altında şeklini ve görünümünü uzun yıllar korur.

Boyama sürecindeki üstün renk tutma kapasitesi sayesinde polyamid halılar, en canlı ve derin renk tonlarını yıllarca muhafaza eder. İslami mimarinin görkemli desenlerini en iyi yansıtan halı türü olarak büyük cami projelerinde profesyonellerin tercihidir.

Asil Halı polyamid serisi; Solution Dyed Nylon (SDN) teknolojiyle üretilerek renk haslığı garanti altına alınmıştır. Büyük cami ihale projeleri ve uluslararası projelerde yaygın olarak kullanılmaktadır.
    `,
    image: "/images/cami-4.png",
    heroImage: "/images/cami-hero.png",
    badge: "Profesyonel",
    color: "#2D6A4F",
    advantages: [
      "En yüksek aşınma direnci — milyonlarca adım",
      "Solution Dyed teknolojisi ile solmaz renkler",
      "Derin ve canlı desen kalitesi",
      "Antistatic özellik — bakım kolaylığı",
      "Kimyasal ve deterjan direnci",
      "Ağır trafik sertifikasyonu",
      "İhale ve büyük proje uyumlu",
      "Uluslararası ihracat kalitesi",
    ],
    specs: [
      { label: "Lif Türü", value: "Polyamid / Naylon (PA6 veya PA6.6)" },
      { label: "Dokuma Yöntemi", value: "Solution Dyed BCF" },
      { label: "Hav Yüksekliği", value: "6-12 mm" },
      { label: "Ağırlık", value: "2.000-3.200 gr/m²" },
      { label: "Bağ Yoğunluğu", value: "250.000-600.000 düğüm/m²" },
      { label: "Yangın Sınıfı", value: "Bfl-s1 (EN 13501-1)" },
      { label: "Garanti", value: "10 Yıl" },
      { label: "Üretim Yeri", value: "Türkiye" },
    ],
    useCases: [
      "Büyük şehir camileri (Cuma ve bayram namazı kalabalığı)",
      "Diyanet İşleri ve vakıf büyük projeleri",
      "Uluslararası ihracat projeleri",
      "Havalimanı ve otel mescitleri",
      "Büyük külliye projeleri",
    ],
    faqs: [
      {
        question: "Polyamid ile polipropilen arasındaki fark nedir?",
        answer:
          "Polyamid daha yüksek aşınma direncine ve daha canlı renk tutma kapasitesine sahiptir; ancak fiyatı daha yüksektir. Polipropilen ise neme karşı daha dirençlidir ve daha ekonomiktir.",
      },
      {
        question: "Solution Dyed Nylon nedir?",
        answer:
          "Rengin lifin içine işlendiği üretim yöntemidir. Klasik boyamadan farklı olarak, renk yüzeyde değil lifin içindedir. Bu sayede UV, kimyasal ve mekanik etkilere karşı üstün renk haslığı sağlanır.",
      },
    ],
    relatedSlugs: ["yun-cami-halisi", "akrilik-cami-halisi", "polipropilen-cami-halisi"],
  },

  // ── Akrilik Alt Kategoriler ──
  "safli-akrilik-cami-halisi": {
    slug: "safli-akrilik-cami-halisi",
    title: "Saflı Akrilik Cami Halısı",
    shortTitle: "Saflı Akrilik",
    metaTitle: "Saflı Akrilik Cami Halısı | Saf Çizgili Namaz Halısı – Asil Halı",
    metaDescription: "Saflı akrilik cami halısı modelleri. Mihrap yönüne göre hizalanmış saf çizgileri, canlı renkler, özel ölçü üretim. Türkiye geneli teslimat. Asil Halı A.Ş.",
    description: "Mihrap yönüne göre hassas hizalanmış saf çizgileriyle cami namazını kolaylaştıran akrilik cami halısı modelleri.",
    longDescription: `Saflı akrilik cami halısı, namaz sırasında cemaatin hizalanmasını kolaylaştıran, mihrap yönüne göre tasarlanmış özel saf çizgileri içerir. Her safın genişliği standart olarak 60-65 cm'dir ve cami planına özel ayarlanabilir.\n\nAkrilik lifin UV direnci sayesinde saf çizgileri yıllar geçse de solmaz ve şekil bozmaz. Özel baskı teknolojisiyle üretilen saf çizgileri, halının dokusuna işlenmiş olup mekanik etkilere karşı dayanıklıdır.\n\nAsil Halı'nın saflı akrilik serisi; caminin ebatlarına göre özel ölçüde üretilir, dilediğiniz renk ve desen kombinasyonuyla kişiselleştirilebilir.`,
    image: "/images/cami-1.png",
    heroImage: "/images/cami-hero.png",
    badge: "Popüler",
    color: "#1B4332",
    advantages: [
      "Mihrap yönüne göre hassas hizalanmış saf çizgileri",
      "60-65 cm standart saf genişliği, özel ölçü seçeneği",
      "UV dirençli solmaz renkler",
      "Kolay temizlik ve bakım",
      "Özel desen ve renk kombinasyonu",
      "Özel ölçü üretim",
      "Yangın sertifikalı (Bfl-s1)",
    ],
    specs: [
      { label: "Lif Türü", value: "Akrilik (100%)" },
      { label: "Saf Genişliği", value: "60-65 cm (özel ölçü)" },
      { label: "Hav Yüksekliği", value: "6-10 mm" },
      { label: "Ağırlık", value: "1.800-2.400 gr/m²" },
      { label: "Yangın Sınıfı", value: "Bfl-s1 (EN 13501-1)" },
      { label: "Garanti", value: "5 Yıl" },
      { label: "Üretim", value: "Özel Sipariş" },
    ],
    useCases: ["Mahalle camileri", "Büyük cami namazlıkları", "Belediye ve vakıf camileri", "Okul ve üniversite mescitleri"],
    faqs: [
      { question: "Saf çizgileri özel ölçüde yapılabilir mi?", answer: "Evet, caminizin genişliğine göre saf aralığı ayarlanabilir. Standart 60-65 cm dışında özel genişlikte de üretilir." },
      { question: "Saflı halının bakımı nasıl yapılır?", answer: "Haftalık süpürme ve yılda 1-2 kez profesyonel yıkama önerilir. Saf çizgileri leke ve solmaya karşı dayanıklıdır." },
    ],
    relatedSlugs: ["gobekli-akrilik-cami-halisi", "seccadeli-akrilik-cami-halisi", "akrilik-cami-halisi"],
  },

  "gobekli-akrilik-cami-halisi": {
    slug: "gobekli-akrilik-cami-halisi",
    title: "Göbekli Akrilik Cami Halısı",
    shortTitle: "Göbekli Akrilik",
    metaTitle: "Göbekli Akrilik Cami Halısı | Mihrap Göbeği Özel Desen – Asil Halı",
    metaDescription: "Göbekli akrilik cami halısı modelleri. Merkezi mihrap göbeği, İslami motifler, özel desen üretim. Caminizin estetiğini tamamlayan halı çözümleri. Asil Halı A.Ş.",
    description: "Merkezi mihrap göbeği ve İslami motiflerle tasarlanmış, caminizin estetik görünümünü tamamlayan akrilik cami halısı.",
    longDescription: `Göbekli akrilik cami halısı, namaz alanının ortasında yer alan merkezi bir göbek motifi içerir. Bu göbek, genellikle mihrabın tam karşısına konumlandırılır ve cemaate görsel bir odak noktası sağlar.\n\nİslam sanatının özünü yansıtan geometrik ve arabesk motiflerle süslenen göbek kısmı, tüm halı desenini tamamlayan uyumlu bir görünüm oluşturur. Akrilik lifin parlak renkleri, göbek desenini canlı ve etkileyici kılar.\n\nAsil Halı göbekli akrilik serisi, caminizin mimari özelliklerine göre özel tasarım seçeneğiyle sunulmaktadır.`,
    image: "/images/cami-2.png",
    heroImage: "/images/cami-hero.png",
    badge: "Özel Tasarım",
    color: "#2D6A4F",
    advantages: [
      "Merkezi mihrap göbeği ile etkileyici görünüm",
      "İslami geometrik ve arabesk motifler",
      "Camiye özel desen tasarımı",
      "Canlı UV dirençli renkler",
      "Profesyonel yerleştirme hizmeti",
      "Yangın sertifikalı",
    ],
    specs: [
      { label: "Lif Türü", value: "Akrilik (100%)" },
      { label: "Göbek Boyutu", value: "Camiye özel" },
      { label: "Hav Yüksekliği", value: "6-10 mm" },
      { label: "Yangın Sınıfı", value: "Bfl-s1" },
      { label: "Garanti", value: "5 Yıl" },
    ],
    useCases: ["Büyük ve prestijli camiler", "Tarihi cami restorasyonları", "Belediye projeleri", "Özel tasarım isteyen camiler"],
    faqs: [
      { question: "Göbek motifi özel tasarlanabilir mi?", answer: "Evet, caminizin mimarisine ve bölgesel geleneğe uygun özel göbek motifi tasarımı ücretsiz yapılır." },
      { question: "Göbekli halı döşemesi zor mudur?", answer: "Asil Halı profesyonel ekibi göbek merkezini doğru konumlandırarak döşeme yapar. Ek döşeme hizmeti mevcuttur." },
    ],
    relatedSlugs: ["safli-akrilik-cami-halisi", "seccadeli-akrilik-cami-halisi", "akrilik-cami-halisi"],
  },

  "seccadeli-akrilik-cami-halisi": {
    slug: "seccadeli-akrilik-cami-halisi",
    title: "Seccadeli Akrilik Cami Halısı",
    shortTitle: "Seccadeli Akrilik",
    metaTitle: "Seccadeli Akrilik Cami Halısı | Seccade Desenli Namazlık – Asil Halı",
    metaDescription: "Seccadeli akrilik cami halısı modelleri. Her namazlık pozisyonuna seccade motifi işlenmiş, SEO uyumlu cami halısı. Asil Halı A.Ş. Türkiye geneli teslimat.",
    description: "Her namaz pozisyonuna seccade motifi işlenmiş, bireysel namazlıkları belirgin hale getiren özel akrilik cami halısı.",
    longDescription: `Seccadeli akrilik cami halısı, halı yüzeyine her namaz yeri için ayrı seccade motifi işlenmiş özel bir üretim türüdür. Bu sayede her cemaat üyesi kendi namazlık alanını kolayca belirleyebilir.\n\nSeccade motifleri mihrap formunu yansıtacak şekilde tasarlanır ve halının ana renk paleti ile uyumlu tutulur. Akrilik malzemenin dayanıklılığı sayesinde bu desenler yoğun kullanımda bile bozulmaz.\n\nOkul mescitleri, yurt ve küçük mahalle camilerinde özellikle tercih edilen bu model, cemaatin düzenli hizalanmasını sağlar.`,
    image: "/images/cami-3.png",
    heroImage: "/images/cami-hero.png",
    badge: "Pratik Çözüm",
    color: "#1B4332",
    advantages: [
      "Her namazlık pozisyona seccade motifi",
      "Cemaatin düzenli hizalanmasını sağlar",
      "Mihrap formunda estetik tasarım",
      "Akrilik dayanıklılığı",
      "Kolay temizlik",
    ],
    specs: [
      { label: "Lif Türü", value: "Akrilik (100%)" },
      { label: "Seccade Boyutu", value: "60×100 cm (standart)" },
      { label: "Hav Yüksekliği", value: "6-10 mm" },
      { label: "Yangın Sınıfı", value: "Bfl-s1" },
      { label: "Garanti", value: "5 Yıl" },
    ],
    useCases: ["Okul ve üniversite mescitleri", "Küçük mahalle camileri", "Yurt mescitleri", "İş yeri namazlıkları"],
    faqs: [
      { question: "Seccade arası mesafe ayarlanabilir mi?", answer: "Evet, seccade motiflerinin aralığı ve boyutu caminizin genişliğine göre özel ayarlanır." },
    ],
    relatedSlugs: ["safli-akrilik-cami-halisi", "gobekli-akrilik-cami-halisi", "akrilik-cami-halisi"],
  },

  // ── Yün Alt Kategoriler ──
  "safli-yun-cami-halisi": {
    slug: "safli-yun-cami-halisi",
    title: "Saflı Yün Cami Halısı",
    shortTitle: "Saflı Yün",
    metaTitle: "Saflı Yün Cami Halısı | Doğal Yün Saf Çizgili Namaz Halısı – Asil Halı",
    metaDescription: "Saflı yün cami halısı modelleri. Doğal yün, saf çizgili, ısı yalıtımlı. Büyük ve prestijli camiler için premium halı çözümü. Asil Halı A.Ş.",
    description: "Doğal yünün konforunu ve ısı yalıtımını saf çizgili namaz halısıyla birleştiren premium cami halısı.",
    longDescription: `Saflı yün cami halısı, doğal yün lifinin tüm üstünlüklerini saf çizgili tasarımla birleştiren premium bir üründür. Yünün doğal ısı yalıtımı özelliği, kış aylarında cemaatin konforunu önemli ölçüde artırır.\n\nSaf çizgileri, hassas dokuma tekniğiyle halıya işlenmiş olup yıllar geçse de şeklini ve netliğini korur. Doğal yün lifinin kendine özgü nem yönetimi sayesinde cami içi ortam dengeli tutulur.\n\nBüyük ve prestijli camilerin tercih ettiği bu model, 25-30 yıllık kullanım ömrüyle uzun vadede ekonomik bir yatırımdır.`,
    image: "/images/cami-2.png",
    heroImage: "/images/cami-hero.png",
    badge: "Premium",
    color: "#2D6A4F",
    advantages: [
      "Doğal yün — ısı ve nem yönetimi",
      "25-30 yıl kullanım ömrü",
      "Hassas saf çizgileri",
      "Hipoalerjenik doğal lif",
      "Prestijli görünüm",
      "Uzun vadede ekonomik",
    ],
    specs: [
      { label: "Lif Türü", value: "Yün (100%)" },
      { label: "Saf Genişliği", value: "60-65 cm" },
      { label: "Hav Yüksekliği", value: "8-12 mm" },
      { label: "Ağırlık", value: "2.400-3.200 gr/m²" },
      { label: "Yangın Sınıfı", value: "Bfl-s1" },
      { label: "Garanti", value: "10 Yıl" },
    ],
    useCases: ["Büyük ve prestijli camiler", "Tarihi camiler", "İl ve ilçe camileri", "Belediye projeleri"],
    faqs: [
      { question: "Yün cami halısının bakımı nasıl yapılır?", answer: "Yün halılar haftalık süpürme ve yılda 1 kez profesyonel kuru temizleme önerilir. Islak yıkamadan kaçınılmalıdır." },
    ],
    relatedSlugs: ["gobekli-yun-cami-halisi", "seccadeli-yun-cami-halisi", "yun-cami-halisi"],
  },

  "gobekli-yun-cami-halisi": {
    slug: "gobekli-yun-cami-halisi",
    title: "Göbekli Yün Cami Halısı",
    shortTitle: "Göbekli Yün",
    metaTitle: "Göbekli Yün Cami Halısı | Merkezi Motifli Premium Yün Halı – Asil Halı",
    metaDescription: "Göbekli yün cami halısı. Doğal yün, merkezi göbek motifi, İslami desen. Prestijli camiler için özel tasarım yün halı. Asil Halı A.Ş.",
    description: "Doğal yün ve merkezi göbek motifi birleşimi — büyük camilerin tercih ettiği prestijli halı çözümü.",
    longDescription: `Göbekli yün cami halısı, doğal yünün zengin dokusuyla muhteşem merkezi göbek motiflerini bir araya getirir. Bu kombinasyon, camiye hem estetik hem de konforlu bir atmosfer kazandırır.\n\nYün lifinin doğal parlaklığı, göbek desenini tüm güzelliğiyle ortaya çıkarır. El dokumasını andıran görünümüyle bu halılar, ziyaretçilerde derin bir etki bırakır.\n\nÖzellikle büyük cami projelerinde ve tarihi yapıların restorasyonlarında tercih edilen bu model, Asil Halı'nın en prestijli koleksiyonlarından biridir.`,
    image: "/images/cami-2.png",
    heroImage: "/images/cami-hero.png",
    badge: "Lüks Koleksiyon",
    color: "#2D6A4F",
    advantages: [
      "Doğal yünün zengin dokusu",
      "Görkemli merkezi göbek motifi",
      "İslami sanatı yansıtan özel tasarım",
      "25-30 yıl kullanım ömrü",
      "Doğal ısı ve nem yönetimi",
    ],
    specs: [
      { label: "Lif Türü", value: "Yün (100%)" },
      { label: "Göbek Tasarımı", value: "Camiye özel" },
      { label: "Hav Yüksekliği", value: "8-12 mm" },
      { label: "Yangın Sınıfı", value: "Bfl-s1" },
      { label: "Garanti", value: "10 Yıl" },
    ],
    useCases: ["Büyük şehir camileri", "Tarihi cami restorasyonları", "İhale projeleri", "Özel tasarım projeleri"],
    faqs: [
      { question: "Göbekli yün halı ihale projelerinde kullanılabilir mi?", answer: "Evet, gerekli sertifikalar ve teknik belgeler temin edilebilir. Asil Halı ihale süreçlerinde destek sağlamaktadır." },
    ],
    relatedSlugs: ["safli-yun-cami-halisi", "seccadeli-yun-cami-halisi", "yun-cami-halisi"],
  },

  "seccadeli-yun-cami-halisi": {
    slug: "seccadeli-yun-cami-halisi",
    title: "Seccadeli Yün Cami Halısı",
    shortTitle: "Seccadeli Yün",
    metaTitle: "Seccadeli Yün Cami Halısı | Seccade Motifli Doğal Yün Halı – Asil Halı",
    metaDescription: "Seccadeli yün cami halısı modelleri. Doğal yün, her namazlığa seccade motifi, premium kalite. Özel ölçü üretim. Asil Halı A.Ş.",
    description: "Her namazlık pozisyonuna seccade motifi işlenmiş, premium doğal yünden üretilmiş cami halısı.",
    longDescription: `Seccadeli yün cami halısı, doğal yünün konforunu bireysel seccade motifleriyle buluşturur. Her namaz pozisyonu için işlenmiş seccade deseni, hem estetik hem de pratik bir çözüm sunar.\n\nYün malzemenin doğal özellikleri, uzun namaz sürelerinde zeminin sıcak kalmasını sağlar. Bu özellik özellikle kış aylarında cemaat için büyük bir konfor sağlar.`,
    image: "/images/cami-2.png",
    heroImage: "/images/cami-hero.png",
    badge: "Konfor & Estetik",
    color: "#2D6A4F",
    advantages: ["Doğal yün konforu", "Seccade motifli bireysel namazlıklar", "Kış aylarında doğal ısı", "25-30 yıl ömür"],
    specs: [
      { label: "Lif Türü", value: "Yün (100%)" },
      { label: "Seccade Boyutu", value: "60×100 cm (standart)" },
      { label: "Hav Yüksekliği", value: "8-12 mm" },
      { label: "Garanti", value: "10 Yıl" },
    ],
    useCases: ["Prestijli camiler", "Büyük şehir camileri", "Okul ve külliye mescitleri"],
    faqs: [
      { question: "Seccadeli yün halı akrilikten daha mı pahalı?", answer: "Evet, yün hammaddesi daha pahalıdır ancak 25-30 yıl kullanım ömrüyle uzun vadede ekonomik bir tercihtir." },
    ],
    relatedSlugs: ["safli-yun-cami-halisi", "gobekli-yun-cami-halisi", "yun-cami-halisi"],
  },

  // ── Polipropilen Alt Kategoriler ──
  "safli-polipropilen-cami-halisi": {
    slug: "safli-polipropilen-cami-halisi",
    title: "Saflı Polipropilen Cami Halısı",
    shortTitle: "Saflı Polipropilen",
    metaTitle: "Saflı Polipropilen Cami Halısı | Neme Dayanıklı Saf Çizgili Halı – Asil Halı",
    metaDescription: "Saflı polipropilen cami halısı. Neme ve lekeye karşı dayanıklı, kolay temizlenen saf çizgili halı. Açık alan ve avlular için ideal. Asil Halı A.Ş.",
    description: "Neme ve lekeye karşı üstün direnciyle açık alanlar ve yoğun kullanım için tasarlanmış saf çizgili polipropilen cami halısı.",
    longDescription: `Saflı polipropilen cami halısı, nemli ortamlar ve yoğun trafik alanları için özel olarak üretilmiştir. Polipropilen lifinin doğal su direnci, caminin giriş holü, şadırvan kenarı ve açık avlu gibi nemli alanlarda üstün performans gösterir.\n\nSaf çizgileri hassas baskı tekniğiyle uygulanmış olup nem ve kimyasallara karşı dayanıklıdır. Leke tutmaz yapısıyla günlük bakım son derece kolaylaşır.`,
    image: "/images/cami-3.png",
    heroImage: "/images/cami-hero.png",
    badge: "Dayanıklı",
    color: "#1B4332",
    advantages: [
      "Neme ve suya karşı üstün direnç",
      "Leke tutmaz yüzey",
      "Kolay temizlik",
      "Dış mekan ve giriş alanları için ideal",
      "Saf çizgili düzenli görünüm",
    ],
    specs: [
      { label: "Lif Türü", value: "Polipropilen (100%)" },
      { label: "Su Direnci", value: "Yüksek" },
      { label: "Hav Yüksekliği", value: "6-8 mm" },
      { label: "Yangın Sınıfı", value: "Bfl-s1" },
      { label: "Garanti", value: "5 Yıl" },
    ],
    useCases: ["Cami giriş holleri", "Şadırvan çevresi", "Açık avlular", "Nem sorunu olan alanlar"],
    faqs: [
      { question: "Polipropilen halı dışarıda kullanılabilir mi?", answer: "Kapalı dış mekan ve gölgeli avlularda kullanılabilir. Sürekli doğrudan güneş ışığına maruz kalmaması önerilir." },
    ],
    relatedSlugs: ["gobekli-polipropilen-cami-halisi", "polipropilen-cami-halisi", "akrilik-cami-halisi"],
  },

  "gobekli-polipropilen-cami-halisi": {
    slug: "gobekli-polipropilen-cami-halisi",
    title: "Göbekli Polipropilen Cami Halısı",
    shortTitle: "Göbekli Polipropilen",
    metaTitle: "Göbekli Polipropilen Cami Halısı | Merkezi Motifli Dayanıklı Halı – Asil Halı",
    metaDescription: "Göbekli polipropilen cami halısı. Merkezi göbek motifi, neme dayanıklı polipropilen lif, kolay bakım. Asil Halı A.Ş.",
    description: "Merkezi göbek motifi ve polipropilen lifin dayanıklılığını birleştiren pratik ve estetik cami halısı.",
    longDescription: `Göbekli polipropilen cami halısı, estetik merkezi göbek desenini polipropilen lifin pratik özellikleriyle birleştiren dengeli bir çözümdür. Hem görsel etki hem de bakım kolaylığı isteyenler için idealdir.\n\nPolipropilen lifin leke tutmaz yapısı, göbek deseninin yıllar boyunca parlak ve temiz kalmasını sağlar. Bu özellik özellikle yoğun cemaat kalabalığının olduğu camilerde önemli bir avantaj sunar.`,
    image: "/images/cami-3.png",
    heroImage: "/images/cami-hero.png",
    badge: "Pratik & Estetik",
    color: "#1B4332",
    advantages: ["Leke tutmaz göbek motifi", "Kolay temizlik", "Neme dayanıklı", "Orta bütçe için ideal"],
    specs: [
      { label: "Lif Türü", value: "Polipropilen (100%)" },
      { label: "Yangın Sınıfı", value: "Bfl-s1" },
      { label: "Garanti", value: "5 Yıl" },
    ],
    useCases: ["Orta boy camiler", "Yoğun trafikli alanlar", "Kolay bakım isteyen projeler"],
    faqs: [
      { question: "Göbekli polipropilen halı göbekli yün halıya göre nasıl?", answer: "Polipropilen daha ekonomik ve lekeye dayanıklıdır. Yün ise daha prestijli ve doğaldır. Kullanım alanına göre seçim yapılmalıdır." },
    ],
    relatedSlugs: ["safli-polipropilen-cami-halisi", "seccadeli-polipropilen-cami-halisi", "polipropilen-cami-halisi"],
  },

  "seccadeli-polipropilen-cami-halisi": {
    slug: "seccadeli-polipropilen-cami-halisi",
    title: "Seccadeli Polipropilen Cami Halısı",
    shortTitle: "Seccadeli Polipropilen",
    metaTitle: "Seccadeli Polipropilen Cami Halısı | Kolay Temizlenen Seccadeli Halı – Asil Halı",
    metaDescription: "Seccadeli polipropilen cami halısı. Bireysel seccade motifleri, leke tutmaz, kolay temizlenen pratik halı çözümü. Asil Halı A.Ş.",
    description: "Bireysel seccade motifleriyle leke tutmaz polipropilen cami halısı — yüksek trafikli alanlar için pratik çözüm.",
    longDescription: `Seccadeli polipropilen cami halısı, leke tutmaz polipropilen lifin avantajlarını bireysel seccade motifleriyle birleştiren pratik bir çözümdür. Özellikle çocuk ve gençlerin yoğun kullandığı mescit ve namazlıklarda tercih edilir.`,
    image: "/images/cami-3.png",
    heroImage: "/images/cami-hero.png",
    badge: "Kolay Bakım",
    color: "#1B4332",
    advantages: ["Leke tutmaz seccade motifleri", "Kolay temizlik", "Ekonomik", "Çocuklu ortamlar için ideal"],
    specs: [
      { label: "Lif Türü", value: "Polipropilen (100%)" },
      { label: "Yangın Sınıfı", value: "Bfl-s1" },
      { label: "Garanti", value: "5 Yıl" },
    ],
    useCases: ["Okul mescitleri", "Çocuk namazlıkları", "Yurt ve konutlar", "Yoğun trafikli namazlıklar"],
    faqs: [
      { question: "Polipropilen seccadeli halı yıkanabilir mi?", answer: "Evet, ıslak yıkamaya uygundur. Su ve lekeye dayanıklı yapısıyla kolay temizlenir." },
    ],
    relatedSlugs: ["safli-polipropilen-cami-halisi", "gobekli-polipropilen-cami-halisi", "polipropilen-cami-halisi"],
  },

  // ── Polyamid Alt Kategoriler ──
  "safli-polyamid-cami-halisi": {
    slug: "safli-polyamid-cami-halisi",
    title: "Saflı Polyamid Cami Halısı",
    shortTitle: "Saflı Polyamid",
    metaTitle: "Saflı Polyamid Cami Halısı | Yüksek Dayanıklı Saf Çizgili Halı – Asil Halı",
    metaDescription: "Saflı polyamid cami halısı. En yüksek aşınma direnci, Solution Dyed teknoloji, saf çizgili tasarım. Büyük camiler için profesyonel çözüm. Asil Halı A.Ş.",
    description: "En yüksek aşınma direncini saf çizgili tasarımla sunan profesyonel polyamid cami halısı — büyük camilerin tercihi.",
    longDescription: `Saflı polyamid cami halısı, sentetik liflerin en dayanıklısı olan polyamid'in tüm avantajlarını saf çizgili namaz düzeniyle birleştirir. Büyük şehir camileri, imamlık hizmet binaları ve yoğun trafik gerektiren alanlar için en uygun tercih.\n\nSolution Dyed teknolojisiyle üretilen saf çizgileri, renklerin lifin içine işlenmesi sayesinde UV, kimyasal ve mekanik etkilere karşı üstün direnç gösterir. Bu sayede saf çizgileri onlarca yıl netliğini ve canlılığını korur.`,
    image: "/images/cami-4.png",
    heroImage: "/images/cami-hero.png",
    badge: "Profesyonel",
    color: "#2D6A4F",
    advantages: [
      "En yüksek aşınma direnci",
      "Solution Dyed teknoloji — solmaz renkler",
      "Büyük cami ve yoğun trafik için ideal",
      "20+ yıl kullanım ömrü",
      "Saf çizgili düzenli namaz alanı",
    ],
    specs: [
      { label: "Lif Türü", value: "Polyamid / Naylon" },
      { label: "Renk Teknolojisi", value: "Solution Dyed" },
      { label: "Hav Yüksekliği", value: "6-10 mm" },
      { label: "Yangın Sınıfı", value: "Bfl-s1" },
      { label: "Garanti", value: "7 Yıl" },
    ],
    useCases: ["Büyük şehir camileri", "İhale projeleri", "Külliye ve dini tesisler", "Yoğun trafik alanları"],
    faqs: [
      { question: "Polyamid halı ihale şartname gereksinimlerini karşılar mı?", answer: "Evet, gerekli yangın, renk haslığı ve dayanıklılık sertifikaları mevcuttur. İhale süreçlerinde teknik destek sağlanır." },
    ],
    relatedSlugs: ["gobekli-polyamid-cami-halisi", "seccadeli-polyamid-cami-halisi", "polyamid-cami-halisi"],
  },

  "gobekli-polyamid-cami-halisi": {
    slug: "gobekli-polyamid-cami-halisi",
    title: "Göbekli Polyamid Cami Halısı",
    shortTitle: "Göbekli Polyamid",
    metaTitle: "Göbekli Polyamid Cami Halısı | En Dayanıklı Merkezi Motifli Halı – Asil Halı",
    metaDescription: "Göbekli polyamid cami halısı. Merkezi göbek motifi, polyamid dayanıklılığı, büyük cami projeleri için premium seçim. Asil Halı A.Ş.",
    description: "Polyamid lifin dayanıklılığı ve görkemli merkezi göbek motifiyle büyük cami projeleri için premium çözüm.",
    longDescription: `Göbekli polyamid cami halısı, en dayanıklı sentetik lifin muhteşem merkezi göbek desenleriyle buluştuğu üstün bir üründür. Büyük şehir camileri ve ihale projelerinin ilk tercihi.\n\nSolution Dyed boyama teknolojisi sayesinde göbek motifleri onlarca yıl solmadan kalır. Yüksek aşınma direnci, en yoğun cemaat trafiğini dahi sorunsuz karşılar.`,
    image: "/images/cami-4.png",
    heroImage: "/images/cami-hero.png",
    badge: "İhale Favorisi",
    color: "#2D6A4F",
    advantages: [
      "Polyamid dayanıklılığı + görkemli göbek motifi",
      "Solution Dyed renk teknolojisi",
      "İhale projelerine uygun sertifikalar",
      "20+ yıl kullanım ömrü",
    ],
    specs: [
      { label: "Lif Türü", value: "Polyamid / Naylon" },
      { label: "Renk Teknolojisi", value: "Solution Dyed" },
      { label: "Yangın Sınıfı", value: "Bfl-s1" },
      { label: "Garanti", value: "7 Yıl" },
    ],
    useCases: ["Büyük şehir camileri", "İhale projeleri", "Tarihi yapı restorasyonları"],
    faqs: [
      { question: "Göbekli polyamid halı ne kadar sürede teslim edilir?", answer: "Özel üretim olduğu için genellikle 4-8 hafta üretim süresi gerekir. Büyük projeler için ön sipariş önerilir." },
    ],
    relatedSlugs: ["safli-polyamid-cami-halisi", "seccadeli-polyamid-cami-halisi", "polyamid-cami-halisi"],
  },

  "seccadeli-polyamid-cami-halisi": {
    slug: "seccadeli-polyamid-cami-halisi",
    title: "Seccadeli Polyamid Cami Halısı",
    shortTitle: "Seccadeli Polyamid",
    metaTitle: "Seccadeli Polyamid Cami Halısı | Dayanıklı Seccade Motifli Halı – Asil Halı",
    metaDescription: "Seccadeli polyamid cami halısı. Bireysel seccade motifleri, polyamid aşınma direnci, büyük camilerde uzun ömür. Asil Halı A.Ş.",
    description: "Bireysel seccade motifleri ve polyamid aşınma direnciyle büyük camilerde uzun yıllar kullanan premium halı.",
    longDescription: `Seccadeli polyamid cami halısı, bireysel seccade motiflerini polyamid lifin üstün aşınma direnciyle buluşturur. Büyük camilerde yoğun kullanım altında bile hem göbek motifleri hem de seccade çizgileri şeklini ve rengini korur.`,
    image: "/images/cami-4.png",
    heroImage: "/images/cami-hero.png",
    badge: "Uzun Ömür",
    color: "#2D6A4F",
    advantages: ["Seccade + polyamid dayanıklılığı", "20+ yıl ömür", "Solution Dyed renkler", "Büyük camiler için"],
    specs: [
      { label: "Lif Türü", value: "Polyamid / Naylon" },
      { label: "Yangın Sınıfı", value: "Bfl-s1" },
      { label: "Garanti", value: "7 Yıl" },
    ],
    useCases: ["Büyük camiler", "İhale projeleri", "Yoğun cemaat trafiği"],
    faqs: [
      { question: "Seccadeli polyamid ile seccadeli akrilik arasındaki fark nedir?", answer: "Polyamid daha yüksek aşınma direnci ve renk kalıcılığı sunar. Büyük ve yoğun kullanımlı camiler için polyamid, ekonomik projeler için akrilik önerilir." },
    ],
    relatedSlugs: ["safli-polyamid-cami-halisi", "gobekli-polyamid-cami-halisi", "polyamid-cami-halisi"],
  },

  // ── Özel Desen & Axminster ──
  "ozel-desen-axminster-cami-halisi": {
    slug: "ozel-desen-axminster-cami-halisi",
    title: "Özel Desen & Renk Axminster Cami Halısı",
    shortTitle: "Axminster",
    metaTitle: "Axminster Cami Halısı | Özel Desen ve Renk Sipariş – Asil Halı",
    metaDescription: "Özel desen Axminster cami halısı. Sınırsız renk ve desen seçeneği, Axminster dokuma teknolojisi, büyük prestijli camiler için premium çözüm. Asil Halı A.Ş.",
    description: "Sınırsız renk ve desen seçeneğiyle tamamen özelleştirilebilir Axminster dokuma cami halısı — her cami için eşsiz tasarım.",
    longDescription: `Axminster dokuma teknolojisi, sınırsız renk ve desen kombinasyonuyla her camiye özgü bir halı üretmeye olanak tanır. Bu teknoloji sayesinde caminizin mimarisi, İslami motifleriniz ve renk tercihiniz kusursuz biçimde halıya aktarılır.\n\nAxminster halılar, her düğümün tek tek işlendiği hassas bir dokuma yöntemiyle üretilir. Bu sayede çok renkli karmaşık İslami desenler, geometrik motifler ve arabesk kompozisyonlar en yüksek detay kalitesiyle ortaya çıkar.\n\nAsil Halı'nın Axminster serisi, ücretsiz tasarım danışmanlığı ve 3D görselleştirme hizmetiyle sunulmaktadır. Caminizin fotoğrafı ve ölçülerini göndererek özel tasarımınızı görebilirsiniz.`,
    image: "/images/cami-hero.png",
    heroImage: "/images/cami-hero.png",
    badge: "Özel Sipariş",
    color: "#C9972B",
    advantages: [
      "Sınırsız renk — onlarca renk aynı anda",
      "Caminize özgü eşsiz desen",
      "Yüksek detaylı İslami motifler",
      "Axminster dokuma kalitesi",
      "Ücretsiz 3D tasarım görselleştirme",
      "20+ yıl renk kalıcılığı",
      "Ücretsiz tasarım danışmanlığı",
    ],
    specs: [
      { label: "Dokuma Türü", value: "Axminster" },
      { label: "Renk Sayısı", value: "Sınırsız" },
      { label: "Lif Seçeneği", value: "Yün / Polyamid / Karma" },
      { label: "Hav Yüksekliği", value: "6-12 mm" },
      { label: "Yangın Sınıfı", value: "Bfl-s1" },
      { label: "Üretim Süresi", value: "6-10 hafta" },
      { label: "Garanti", value: "10 Yıl" },
    ],
    useCases: [
      "Büyük prestijli şehir camileri",
      "Tarihi cami restorasyonları",
      "Yurt dışı ihracat projeleri",
      "Özel desen isteyen her büyüklükte cami",
    ],
    faqs: [
      { question: "Axminster halı için minimum sipariş miktarı nedir?", answer: "Genellikle minimum 50 m² özel üretim yapılmaktadır. Daha küçük alanlar için standart koleksiyon önerilir." },
      { question: "Tasarım süreci nasıl işler?", answer: "Caminizin ölçüleri ve tasarım tercihleri alınır. 3D görselleştirme hazırlanır, onayınızdan sonra üretime geçilir. Ortalama 6-10 hafta üretim süresi gereklidir." },
    ],
    relatedSlugs: ["yun-cami-halisi", "polyamid-cami-halisi", "gobekli-yun-cami-halisi"],
  },

  // ── Halı Altı Malzemeleri ──
  "kaucuk-cami-halisi-altligi": {
    slug: "kaucuk-cami-halisi-altligi",
    title: "Kauçuk Cami Halısı Altlığı",
    shortTitle: "Kauçuk Altlık",
    metaTitle: "Kauçuk Cami Halısı Altlığı | Kaymaz Taban, Uzun Ömür – Asil Halı",
    metaDescription: "Kauçuk cami halısı altlığı. Kaymaz taban, ses yalıtımı, nem bariyeri. Halının ömrünü uzatır. TredMOR ve diğer kauçuk altlık modelleri. Asil Halı A.Ş.",
    description: "Cami halısının altına döşenen kauçuk altlık — kaymayı önler, sesi yalıtır ve halı ömrünü uzatır.",
    longDescription: `Kauçuk cami halısı altlığı, halının zemine sabitlenmesini sağlayan ve birden fazla koruyucu işlev yerine getiren önemli bir yapı malzemesidir.\n\nKaymaz kauçuk tabanı sayesinde halı yerinden oynamaz, namaz sırasında saffın düzeni bozulmaz. Aynı zamanda zemin ile halı arasında nem bariyeri oluşturarak küflenmeyi önler.\n\nSes yalıtım özelliği sayesinde halının altındaki ayak sesleri azaltılır ve namaz sırasında huzurlu bir ortam sağlanır. Halının aşınmasını da yavaşlatarak toplam kullanım ömrünü %30-40 oranında artırır.`,
    image: "/images/cami-5.png",
    heroImage: "/images/cami-hero.png",
    badge: "Kaymaz & Koruyucu",
    color: "#1B4332",
    advantages: [
      "Kaymaz kauçuk taban — halı kaymasını önler",
      "Nem bariyeri — küflenmeyi önler",
      "Ses yalıtımı",
      "Halı ömrünü %30-40 uzatır",
      "Kolay döşeme ve söküm",
    ],
    specs: [
      { label: "Malzeme", value: "Kauçuk" },
      { label: "Kalınlık", value: "3-5 mm" },
      { label: "Yoğunluk", value: "Orta-Yüksek" },
      { label: "Nem Direnci", value: "Yüksek" },
    ],
    useCases: ["Tüm cami tipleri", "Nemli zeminler", "Ses yalıtımı gerektiren alanlar"],
    faqs: [
      { question: "Kauçuk altlık halıya zarar verir mi?", answer: "Hayır. Kauçuk altlıklar halı liflerine zarar vermez, tam tersine aşınmayı azaltır." },
    ],
    relatedSlugs: ["tredmor-berber-supreme", "kece-cami-halisi-altligi", "akrilik-cami-halisi"],
  },

  "tredmor-berber-supreme": {
    slug: "tredmor-berber-supreme",
    title: "TredMOR™ Berber Supreme",
    shortTitle: "TredMOR™",
    metaTitle: "TredMOR™ Berber Supreme Cami Halısı Altlığı – Asil Halı",
    metaDescription: "TredMOR Berber Supreme kauçuk cami halısı altlığı. Premium kaymaz altlık, maksimum nem bariyeri, uzun ömür. Asil Halı A.Ş. Türkiye distribütörü.",
    description: "TredMOR™ markasının premium Berber Supreme kauçuk altlığı — cami halısı için en üst düzey koruma ve konfor.",
    longDescription: `TredMOR™ Berber Supreme, cami halısı altlıkları arasında premium segmentin en üst ürünüdür. Özel kauçuk karışımı ve Berber dokuma üst yüzeyi sayesinde hem altlık görevini hem de halı altı tampon tabakasını tek üründe sunar.\n\nBerber yüzeyinin benzersiz dokusu, üstündeki cami halısıyla mükemmel bir uyum sağlar. Halının kaymasını tamamen engeller, ses yalıtımını en üst düzeye çıkarır.\n\nAsil Halı, TredMOR™ ürünlerinin Türkiye'de yetkili distribütörüdür.`,
    image: "/images/cami-5.png",
    heroImage: "/images/cami-hero.png",
    badge: "Premium Altlık",
    color: "#C9972B",
    advantages: [
      "TredMOR™ premium marka güvencesi",
      "Berber dokuma üst yüzey",
      "Maksimum kaymaz performans",
      "Üstün nem bariyeri",
      "En yüksek ses yalıtımı",
      "Asil Halı Türkiye distribütörü",
    ],
    specs: [
      { label: "Marka", value: "TredMOR™" },
      { label: "Model", value: "Berber Supreme" },
      { label: "Malzeme", value: "Premium Kauçuk + Berber" },
      { label: "Kalınlık", value: "4-6 mm" },
      { label: "Garanti", value: "5 Yıl" },
    ],
    useCases: ["Prestijli cami projeleri", "Büyük şehir camileri", "İhale projeleri"],
    faqs: [
      { question: "TredMOR Berber Supreme nerede üretiliyor?", answer: "TredMOR premium kalite kontrol standartlarıyla üretilmektedir. Asil Halı, Türkiye'de yetkili distribütörüdür." },
    ],
    relatedSlugs: ["kaucuk-cami-halisi-altligi", "kece-cami-halisi-altligi", "600-cami-halisi-kecesi"],
  },

  "kece-cami-halisi-altligi": {
    slug: "kece-cami-halisi-altligi",
    title: "Keçe Cami Halısı Altlığı",
    shortTitle: "Keçe Altlık",
    metaTitle: "Keçe Cami Halısı Altlığı | 600 1000 1200 gr/m² Keçe – Asil Halı",
    metaDescription: "Keçe cami halısı altlığı modelleri. 600 gr, 1000 gr ve 1200 gr/m² seçenekleri. Ses ve ısı yalıtımı, halı ömrünü uzatır. Asil Halı A.Ş.",
    description: "600, 1000 ve 1200 gr/m² seçenekleriyle cami halısı için ses ve ısı yalıtımlı keçe altlık çözümleri.",
    longDescription: `Keçe cami halısı altlıkları, yoğun keçe lifinden üretilen ve halı altına döşenen yalıtım katmanlarıdır. Farklı yoğunluk seçenekleriyle her bütçe ve ihtiyaca uygun çözüm sunulur.\n\n600 gr/m² keçe ekonomik projeler için uygundur. 1000 gr/m² orta-büyük camiler için dengeli bir seçimdir. 1200 gr/m² ise en yüksek ses ve ısı yalıtımını gerektiren büyük projeler için idealdir.\n\nKeçe altlıklar, halıyı zemin sertliğinden korur ve uzun namaz sürelerinde cemaatin yorulmasını azaltır.`,
    image: "/images/cami-6.png",
    heroImage: "/images/cami-hero.png",
    badge: "Isı & Ses Yalıtımı",
    color: "#1B4332",
    advantages: [
      "3 farklı yoğunluk seçeneği",
      "Ses yalıtımı",
      "Isı yalıtımı — kış konfor",
      "Halıyı zemin sertliğinden korur",
      "Uzun namaz seanslarında konfor",
    ],
    specs: [
      { label: "Seçenekler", value: "600 / 1000 / 1200 gr/m²" },
      { label: "Malzeme", value: "Keçe" },
      { label: "Ses Yalıtımı", value: "Yüksek" },
      { label: "Isı Yalıtımı", value: "Orta-Yüksek" },
    ],
    useCases: ["Tüm cami tipleri", "Soğuk zeminler", "Ses yalıtımı gereken camiler"],
    faqs: [
      { question: "Hangi keçe yoğunluğu doğru seçim?", answer: "600 gr/m² ekonomik projeler, 1000 gr/m² standart cami projeleri ve 1200 gr/m² büyük ve prestijli camiler için önerilir." },
    ],
    relatedSlugs: ["600-cami-halisi-kecesi", "1000-cami-halisi-kecesi", "1200-cami-halisi-kecesi"],
  },

  "600-cami-halisi-kecesi": {
    slug: "600-cami-halisi-kecesi",
    title: "600 gr/m² Cami Halısı Keçesi",
    shortTitle: "600 Keçe",
    metaTitle: "600 gr/m² Cami Halısı Keçesi | Ekonomik Halı Altı Keçe – Asil Halı",
    metaDescription: "600 gr/m² cami halısı keçesi. Ekonomik fiyat, temel ses ve ısı yalıtımı. Küçük ve orta boy camiler için uygun halı altlık. Asil Halı A.Ş.",
    description: "Küçük ve orta boy camiler için ekonomik 600 gr/m² keçe cami halısı altlığı.",
    longDescription: `600 gr/m² cami halısı keçesi, ekonomik projeler ve küçük-orta boy camiler için uygun maliyetli bir halı altlık çözümüdür. Temel ses ve ısı yalıtımını sağlarken bütçe dostu bir seçenek sunar.`,
    image: "/images/cami-6.png",
    heroImage: "/images/cami-hero.png",
    badge: "Ekonomik",
    color: "#1B4332",
    advantages: ["Ekonomik fiyat", "Temel ses yalıtımı", "Temel ısı yalıtımı", "Küçük-orta boy camiler için"],
    specs: [{ label: "Yoğunluk", value: "600 gr/m²" }, { label: "Malzeme", value: "Keçe" }],
    useCases: ["Küçük cami ve mescitler", "Bütçe dostu projeler"],
    faqs: [{ question: "600 keçe ile 1000 keçe arasındaki fark nedir?", answer: "1000 gr/m² keçe daha yüksek yoğunlukta olup daha iyi ses ve ısı yalıtımı sağlar. 600 gr/m² daha ekonomik ama yeterli temel yalıtım sunar." }],
    relatedSlugs: ["1000-cami-halisi-kecesi", "1200-cami-halisi-kecesi", "kece-cami-halisi-altligi"],
  },

  "1000-cami-halisi-kecesi": {
    slug: "1000-cami-halisi-kecesi",
    title: "1000 gr/m² Cami Halısı Keçesi",
    shortTitle: "1000 Keçe",
    metaTitle: "1000 gr/m² Cami Halısı Keçesi | Standart Halı Altı Keçe – Asil Halı",
    metaDescription: "1000 gr/m² cami halısı keçesi. Standart ses ve ısı yalıtımı, orta-büyük cami projeleri için dengeli seçim. Asil Halı A.Ş.",
    description: "Orta-büyük cami projeleri için dengeli ses ve ısı yalıtımı sunan 1000 gr/m² keçe altlık.",
    longDescription: `1000 gr/m² cami halısı keçesi, orta ve büyük boy camilerin çoğu için dengeli ve yeterli bir çözümdür. Ses yalıtımı ve ısı tutma özelliği, 600 gr/m² keçeye göre belirgin biçimde daha yüksektir.`,
    image: "/images/cami-7.png",
    heroImage: "/images/cami-hero.png",
    badge: "Standart Seçim",
    color: "#1B4332",
    advantages: ["Dengeli ses yalıtımı", "İyi ısı yalıtımı", "Orta-büyük camiler için ideal", "Uzun ömür"],
    specs: [{ label: "Yoğunluk", value: "1000 gr/m²" }, { label: "Malzeme", value: "Keçe" }],
    useCases: ["Orta-büyük boy camiler", "Standart projeler"],
    faqs: [{ question: "1000 keçe için minimum sipariş var mı?", answer: "Evet, genellikle minimum 50 m² sipariş alınmaktadır. Küçük miktarlar için lütfen iletişime geçin." }],
    relatedSlugs: ["600-cami-halisi-kecesi", "1200-cami-halisi-kecesi", "kece-cami-halisi-altligi"],
  },

  "1200-cami-halisi-kecesi": {
    slug: "1200-cami-halisi-kecesi",
    title: "1200 gr/m² Cami Halısı Keçesi",
    shortTitle: "1200 Keçe",
    metaTitle: "1200 gr/m² Cami Halısı Keçesi | Premium Halı Altı Keçe – Asil Halı",
    metaDescription: "1200 gr/m² cami halısı keçesi. En yüksek ses ve ısı yalıtımı, büyük prestijli camiler için premium altlık. Asil Halı A.Ş.",
    description: "En yüksek ses ve ısı yalıtımını sunan 1200 gr/m² premium keçe — büyük prestijli camiler için.",
    longDescription: `1200 gr/m² cami halısı keçesi, en yüksek yoğunluklu keçe altlık olup büyük şehir camileri, prestijli projeler ve en üst düzey ses-ısı yalıtımı gerektiren alanlar için tercih edilir. Cemaatin uzun namaz sürelerinde maksimum konfor sağlanır.`,
    image: "/images/cami-8.png",
    heroImage: "/images/cami-hero.png",
    badge: "Premium Yalıtım",
    color: "#2D6A4F",
    advantages: ["En yüksek ses yalıtımı", "Maksimum ısı tutma", "Büyük camiler için", "Uzun namaz konforu"],
    specs: [{ label: "Yoğunluk", value: "1200 gr/m²" }, { label: "Malzeme", value: "Keçe" }, { label: "Yalıtım", value: "Maksimum" }],
    useCases: ["Büyük şehir camileri", "Prestijli projeler", "İhale projeleri"],
    faqs: [{ question: "1200 keçe ile kauçuk altlık birlikte kullanılabilir mi?", answer: "Evet, özellikle büyük projelerde 1200 gr/m² keçe üzerine halı, altına kauçuk altlık kombinasyonu en iyi sonucu verir." }],
    relatedSlugs: ["600-cami-halisi-kecesi", "1000-cami-halisi-kecesi", "kece-cami-halisi-altligi"],
  },
};

const CATEGORY_NAMES: Record<string, string> = {
  "akrilik-cami-halisi": "Akrilik Cami Halısı",
  "yun-cami-halisi": "Yün Cami Halısı",
  "polipropilen-cami-halisi": "Polipropilen Cami Halısı",
  "polyamid-cami-halisi": "Polyamid Cami Halısı",
  "safli-akrilik-cami-halisi": "Saflı Akrilik Cami Halısı",
  "gobekli-akrilik-cami-halisi": "Göbekli Akrilik Cami Halısı",
  "seccadeli-akrilik-cami-halisi": "Seccadeli Akrilik Cami Halısı",
  "safli-yun-cami-halisi": "Saflı Yün Cami Halısı",
  "gobekli-yun-cami-halisi": "Göbekli Yün Cami Halısı",
  "seccadeli-yun-cami-halisi": "Seccadeli Yün Cami Halısı",
  "safli-polipropilen-cami-halisi": "Saflı Polipropilen Cami Halısı",
  "gobekli-polipropilen-cami-halisi": "Göbekli Polipropilen Cami Halısı",
  "seccadeli-polipropilen-cami-halisi": "Seccadeli Polipropilen Cami Halısı",
  "safli-polyamid-cami-halisi": "Saflı Polyamid Cami Halısı",
  "gobekli-polyamid-cami-halisi": "Göbekli Polyamid Cami Halısı",
  "seccadeli-polyamid-cami-halisi": "Seccadeli Polyamid Cami Halısı",
  "ozel-desen-axminster-cami-halisi": "Özel Desen & Axminster",
  "kaucuk-cami-halisi-altligi": "Kauçuk Cami Halısı Altlığı",
  "tredmor-berber-supreme": "TredMOR™ Berber Supreme",
  "kece-cami-halisi-altligi": "Keçe Cami Halısı Altlığı",
  "600-cami-halisi-kecesi": "600 gr/m² Keçe Altlık",
  "1000-cami-halisi-kecesi": "1000 gr/m² Keçe Altlık",
  "1200-cami-halisi-kecesi": "1200 gr/m² Keçe Altlık",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES[slug];
  if (!cat) return { title: "Kategori bulunamadı" };

  return {
    title: cat.metaTitle,
    description: cat.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/kategori/${slug}`,
    },
    openGraph: {
      title: cat.metaTitle,
      description: cat.metaDescription,
      images: [{ url: `${SITE_URL}${cat.image}`, width: 1200, height: 630 }],
    },
  };
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).flatMap((slug) =>
    ["tr"].map((locale) => ({ locale, slug }))
  );
}

export default async function KategoriPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cat = CATEGORIES[slug];
  if (!cat) notFound();

  const prefix = locale === "tr" ? "" : `/${locale}`;

  // JSON-LD: Product + BreadcrumbList
  const productLD = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: cat.title,
    description: cat.description,
    image: `${SITE_URL}${cat.image}`,
    brand: {
      "@type": "Brand",
      name: "Asil Halı A.Ş.",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Asil Halı A.Ş.",
      url: "https://www.asilhali.com.tr",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Asil Halı A.Ş.",
      },
      priceCurrency: "TRY",
      priceSpecification: {
        "@type": "PriceSpecification",
        description: "Fiyat teklifi için iletişime geçin",
      },
    },
  };

  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Kategoriler", item: `${SITE_URL}/kategori` },
      { "@type": "ListItem", position: 3, name: cat.title, item: `${SITE_URL}/kategori/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }} />

      <Navigation locale={locale} />

      <main id="main-content">
        {/* ── Hero Bölümü ── */}
        <section className="relative h-[60vh] min-h-[400px] max-h-[600px] flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={cat.heroImage}
              alt={cat.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0D2418]/95 via-[#0D2418]/50 to-transparent" />

          <div className="relative z-20 container-site pb-12 w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-4" aria-label="Breadcrumb">
              <Link href={`${prefix}/`} className="hover:text-white transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/60">Ürünler</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#E4B84A]">{cat.shortTitle}</span>
            </nav>

            <span className="badge bg-[#C9972B]/20 text-[#E4B84A] border border-[#C9972B]/30 mb-3">
              {cat.badge}
            </span>
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {cat.title}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              {cat.description}
            </p>
          </div>
        </section>

        {/* ── İçerik ── */}
        <section className="section bg-[#F7F3EC]">
          <div className="container-site">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Sol: Detay */}
              <div className="lg:col-span-2 space-y-10">
                {/* Uzun Açıklama */}
                <div>
                  <h2 className="section-title mb-4">{cat.title} Hakkında</h2>
                  <div className="gold-line mb-6" />
                  <div className="prose prose-sm max-w-none text-[#6B6355] leading-relaxed space-y-4">
                    {cat.longDescription.trim().split("\n\n").map((para, i) => (
                      <p key={i}>{para.trim()}</p>
                    ))}
                  </div>
                </div>

                {/* Avantajlar */}
                <div>
                  <h2
                    className="text-2xl font-bold text-[#1B4332] mb-5"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Avantajlar ve Özellikler
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {cat.advantages.map((adv, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#DDD8CE]">
                        <div className="w-5 h-5 rounded-full bg-[#1B4332]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[#1B4332]" aria-hidden="true" />
                        </div>
                        <span className="text-sm text-[#1A1A1A] leading-snug">{adv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kullanım Alanları */}
                <div>
                  <h2
                    className="text-2xl font-bold text-[#1B4332] mb-5"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Kullanım Alanları
                  </h2>
                  <ul className="space-y-2.5">
                    {cat.useCases.map((uc, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-[#6B6355]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9972B] flex-shrink-0" />
                        {uc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sağ: Teknik Özellikler + CTA */}
              <div className="space-y-6">
                {/* Teknik Kart */}
                <div className="bg-white rounded-2xl border border-[#DDD8CE] overflow-hidden">
                  <div
                    className="p-5"
                    style={{ background: `${cat.color}12`, borderBottom: `1px solid ${cat.color}20` }}
                  >
                    <h3
                      className="font-bold text-[#1B4332] text-lg"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      Teknik Özellikler
                    </h3>
                  </div>
                  <div className="divide-y divide-[#EDE8DF]">
                    {cat.specs.map((spec, i) => (
                      <div key={i} className="flex items-start justify-between gap-4 px-5 py-3.5">
                        <span className="text-xs text-[#6B6355] font-medium">{spec.label}</span>
                        <span className="text-xs text-[#1A1A1A] font-semibold text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teklif CTA Kartı */}
                <div className="bg-[#1B4332] rounded-2xl p-6 text-white">
                  <h3
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Fiyat Teklifi Alın
                  </h3>
                  <p className="text-sm text-white/70 mb-5 leading-relaxed">
                    Caminizin ölçülerine göre ücretsiz fiyat teklifi ve danışmanlık hizmeti.
                  </p>
                  <a
                    href={`${MAIN_SITE_URL}${slug}`}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-gold w-full justify-center text-sm"
                  >
                    Teklif Al — asilhali.com.tr
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="tel:+905323467939"
                    className="btn btn-outline w-full justify-center text-sm mt-3"
                  >
                    Hemen Arayın
                  </a>
                </div>

                {/* İlgili Kategoriler */}
                <div className="bg-[#F7F3EC] rounded-2xl border border-[#DDD8CE] p-5">
                  <h3
                    className="font-bold text-[#1B4332] mb-4"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Diğer Kategoriler
                  </h3>
                  <div className="space-y-2">
                    {cat.relatedSlugs.map((rel) => (
                      <Link
                        key={rel}
                        href={`${prefix}/kategori/${rel}`}
                        className="flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-[#DDD8CE] hover:border-[#C9972B]/40 hover:shadow-sm transition-all text-sm font-medium text-[#1A1A1A] hover:text-[#1B4332]"
                      >
                        {CATEGORY_NAMES[rel]}
                        <ArrowRight className="w-3.5 h-3.5 text-[#C9972B]" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SSS */}
        <FAQSection faqs={cat.faqs} title={`${cat.title} — Sık Sorulan Sorular`} />

        {/* CTA */}
        <CTASection
          variant="green"
          title={`${cat.title} Siparişi İçin Hemen İletişime Geçin`}
          subtitle="Asil Halı uzmanları caminizin ölçülerine ve ihtiyaçlarına göre en uygun çözümü sunmak için hazır."
        />
      </main>

      <Footer locale={locale} />
    </>
  );
}
