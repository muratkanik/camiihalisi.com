export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
  publishedAt: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "cami-halisi-nasil-secilir",
    title: "Cami Halısı Nasıl Seçilir? Kapsamlı Rehber",
    excerpt:
      "Cami halısı seçerken dikkat edilmesi gereken temel kriterler: malzeme türü, desen özellikleri, ölçümlendirme ve bütçe planlaması.",
    category: "Rehber",
    tags: ["cami halısı", "halı seçimi", "rehber", "akrilik", "yün"],
    readTime: "8 dk",
    publishedAt: "2026-03-10",
    image: "/images/cami-5.png",
    author: "Asil Halı Uzmanları",
    metaTitle:
      "Cami Halısı Nasıl Seçilir? 2024 Kapsamlı Rehber | Asil Halı",
    metaDescription:
      "Cami halısı seçiminde dikkat edilmesi gereken malzeme, desen, ölçü ve bütçe kriterleri. Uzman önerileriyle doğru cami halısını seçin.",
    content: `
## Cami Halısı Seçiminde Temel Kriterler

Cami, sadece namaz kılınan bir mekan değil; toplumun manevi merkezi ve huzur bulunan bir ibadet yeridir. Bu nedenle cami halısı seçimi, estetik ve pratik açıdan son derece önemlidir. Doğru seçim yapıldığında halı hem cemaatin konforunu artırır hem de cami atmosferini zenginleştirir.

### 1. Malzeme Seçimi

**Akrilik:** En yaygın tercih. Ekonomik fiyatı, canlı renkleri ve kolay bakımıyla öne çıkar. Küçük ve orta büyüklükteki camilerde ideal. UV direnci yüksek olduğu için yıllar boyu solmaz.

**Yün:** Premium tercih. Doğal lif olması nedeniyle ısı yalıtımı sağlar, nemi dengeler ve uzun ömürlüdür. Büyük ve prestijli camilerde tercih edilir. Maliyeti akriliğin 2-3 katı olsa da 25-30 yıl kullanım ömrüyle uzun vadede ekonomiktir.

**Polipropilen:** Nem ve suya karşı en dirençli seçenek. Dış avlu, giriş ve ıslak zeminlere uygun. Kolay temizlenir, leke tutmaz.

**Polyamid (Naylon):** En yüksek aşınma direnci. Büyük camilerde, yoğun trafik alanlarında ve ihale projelerinde tercih edilir. Solution Dyed teknolojiyle üretildiğinde renk haslığı üstündür.

### 2. Cami Boyutuna Göre Seçim

Cami boyutu, hem malzeme seçimini hem de bütçeyi doğrudan etkiler:

- **100 m² altı (mahalle mescidi):** Akrilik yeterlidir. Ekonomik ve uzun ömürlüdür.
- **100-500 m² (orta boy cami):** Akrilik veya polipropilen idealdir. Özel desen yaptırılabilir.
- **500 m² üzeri (büyük cami):** Yün veya polyamid tercih edilmeli. Prestijli projeler için yün, yoğun trafik için polyamid önerilir.

### 3. Desen ve Renk Seçimi

İslami mimaride desen ve renk seçimi, cami atmosferini doğrudan etkiler. Genel ilkeler:

- **Yeşil tonları:** Cenneti simgeler, huzur verir. En yaygın tercih.
- **Bordo/Kırmızı:** Güç ve sıcaklık. Özellikle İstanbul camilerinde görülür.
- **Krem/Bej:** Modern camiler ve aydınlık iç mekanlar için.
- **Geometrik desenler:** Sonsuzluğu simgeler. Arabesk motifler geleneksel camiler için ideal.
- **Saf (namazlık) çizgisi:** Mihrap yönünü gösterir. Doğru hizalanması şarttır.

### 4. Kalite Göstergeleri

İyi bir cami halısını nasıl anlarsınız?

- **Bağ yoğunluğu:** m² başına düğüm sayısı ne kadar yüksekse doku o kadar sıkı ve dayanıklı.
- **Hav yüksekliği:** 6-12 mm arası cami kullanımı için ideal. Çok düşük hav çabuk aşınır.
- **Yanmazlık belgesi:** EN 13501-1 standardına göre Bfl-s1 sınıfı zorunlu olmalı.
- **Renk haslığı:** ISO 105 standardına göre test edilmiş ürünler tercih edilmeli.

### 5. Bütçe Planlaması

Metrekare maliyeti kabaca şöyledir (2024 fiyatları):

- Akrilik: 150-350 TL/m²
- Polipropilen: 120-280 TL/m²
- Polyamid: 350-650 TL/m²
- Yün: 500-1.200 TL/m²

Kurulum, kenar dikiş ve nakliye masraflarını da hesaba katmayı unutmayın.

### 6. Tedarikçi Seçimi

Güvenilir bir tedarikçinin özellikleri:
- En az 10 yıllık sektör deneyimi
- Referans cami listesi sunabilme
- Yazılı garanti belgesi
- Yerinde ölçüm ve keşif hizmeti
- Satış sonrası bakım ve tamir desteği

## Sonuç

Cami halısı, 15-30 yıllık bir yatırımdır. Acele karar vermek yerine birkaç tedarikçiden teklif alın, referansları inceleyin ve halı örneklerini yerinde değerlendirin. Asil Halı olarak ücretsiz keşif ve danışmanlık hizmeti sunuyoruz — caminiz için en doğru seçimi birlikte yapalım.
    `.trim(),
  },
  {
    slug: "akrilik-vs-yun-cami-halisi",
    title: "Akrilik mi Yün mü? Cami Halısı Malzeme Karşılaştırması",
    excerpt:
      "İki popüler cami halısı malzemesinin avantaj ve dezavantajları, fiyat-performans analizi ve hangi cami için hangisinin uygun olduğu.",
    category: "Karşılaştırma",
    tags: ["akrilik", "yün", "cami halısı", "karşılaştırma", "malzeme"],
    readTime: "6 dk",
    publishedAt: "2026-03-15",
    image: "/images/cami-6.png",
    author: "Asil Halı Uzmanları",
    metaTitle:
      "Akrilik mi Yün mü? Cami Halısı Karşılaştırması | Asil Halı",
    metaDescription:
      "Akrilik ve yün cami halısı arasındaki farklar. Fiyat, dayanıklılık, bakım ve estetik açısından kapsamlı karşılaştırma.",
    content: `
## Akrilik ve Yün Cami Halısı: Hangisi Sizin İçin?

Cami halısı seçiminde en çok karşılaşılan soru şudur: "Akrilik mi alsam yün mü?" Her ikisinin de güçlü yanları vardır. Doğru seçim, caminizin büyüklüğüne, kullanım yoğunluğuna ve bütçenize göre değişir.

## Akrilik Cami Halısı

Akrilik, petrokimya bazlı sentetik bir liftir. Yüne en çok benzeyen sentetik lif olarak bilinir ve bu nedenle cami halılarında en yaygın kullanılan malzemedir.

### Avantajları
- **Ekonomik fiyat:** Yüne göre %60-70 daha ucuz
- **Canlı renkler:** UV direnci yüksek, solmaz
- **Kolay bakım:** Islak temizlemeye uygun
- **Hafif yapı:** Kolay kurulum ve taşıma
- **Hızlı kuruma:** Nemden sonra çabuk kurur

### Dezavantajları
- **Daha kısa ömür:** 15-20 yıl (yüne göre daha az)
- **Isı yalıtımı zayıf:** Soğuk zeminlerde daha az konfor
- **Doğal değil:** Sentetik lif; ekolojik kaygıları olanlar için dezavantaj

## Yün Cami Halısı

Yün, binlerce yıldır halı üretiminde kullanılan doğal protein lifidir. Kalite, uzun ömür ve doğallık arıyorsanız yün doğru tercihtir.

### Avantajları
- **Uzun ömür:** 25-30 yıl ve üzeri
- **Doğal ısı yalıtımı:** Kış aylarında zemin ısısını dengeler
- **Doğal nem yönetimi:** Havadan nemi alır ve bırakır
- **Kir itici:** Doğal lanolin kaplama kiri iter
- **Statik elektriksiz:** Toz birikmesini önler
- **Prestij:** Görsel ve doku kalitesi üstün

### Dezavantajları
- **Yüksek fiyat:** Akriliğin 2-3 katı
- **Özel bakım gerektirir:** Isı ve sert deterjanlardan kaçınılmalı
- **Ağır:** Kurulum daha zor

## Karşılaştırma Tablosu

| Özellik | Akrilik | Yün |
|---------|---------|-----|
| Fiyat (m²) | 150-350 TL | 500-1.200 TL |
| Kullanım ömrü | 15-20 yıl | 25-30 yıl |
| Bakım kolaylığı | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Isı yalıtımı | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Renk canlılığı | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Doğallık | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Prestij | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## Sonuç: Hangisini Seçmeli?

**Akrilik seçin eğer:**
- Bütçeniz kısıtlıysa
- Küçük veya orta boy bir camiyseniz
- Sık temizlik gerektiren yoğun kullanımlı bir mekan ise

**Yün seçin eğer:**
- Büyük ve prestijli bir cami projesiyse
- Uzun vadeli yatırım düşünüyorsanız
- Doğal ve ekolojik tercih önceliğinizse
- Mihrap önü gibi özel alanlarda üstün görünüm istiyorsanız

Her iki durumda da Asil Halı olarak ücretsiz danışmanlık hizmeti sunuyoruz.
    `.trim(),
  },
  {
    slug: "cami-halisi-temizligi-ve-bakimi",
    title: "Cami Halısı Temizliği ve Bakımı: Eksiksiz Rehber",
    excerpt:
      "Cami halınızın ömrünü uzatmak için günlük bakım, periyodik temizlik ve profesyonel bakım önerileri.",
    category: "Bakım",
    tags: ["cami halısı temizliği", "bakım", "temizlik", "ömür"],
    readTime: "5 dk",
    publishedAt: "2026-03-20",
    image: "/images/cami-7.png",
    author: "Asil Halı Uzmanları",
    metaTitle: "Cami Halısı Temizliği ve Bakımı | Pratik Rehber – Asil Halı",
    metaDescription:
      "Cami halısı nasıl temizlenir? Günlük bakım, leke çıkarma ve profesyonel temizlik önerileriyle halınızın ömrünü uzatın.",
    content: `
## Cami Halısı Temizliği: Doğru Yöntemler

Cami halısının düzenli bakımı hem hijyen hem de ömür açısından kritiktir. Yanlış temizlik yöntemleri halının rengini soldurabilir, lifleri zedeleyebilir ve ömrünü kısaltabilir.

## Günlük Bakım

**Elektrikli süpürge:** Camide günlük kullanım sonrasında toz ve kir birikmesi kaçınılmazdır. Her gün veya iki günde bir hafif güçte elektrikli süpürge kullanın. Hav yönünde süpürün, tersine sürmeyin.

**Anında müdahale:** Herhangi bir sıvı döküldüğünde hemen müdahale edin. Sıvıyı ovmak yerine temiz bir bezle hafifçe bastırarak toplayın. Ozmosis prensibiyle nem dışarı çekilir.

## Haftalık Bakım

- Caminin tüm halı alanını iyice elektrikli süpürgeyle temizleyin
- Saf çizgilerini kontrol edin, bozulan yerler varsa düzeltin
- Kenar kıvrımlarını ve kapı altlarını kontrol edin

## Aylık/Mevsimlik Derin Temizlik

**Islak temizlik (polipropilen ve akrilik için):**
1. Nötr pH'lı halı şampuanı kullanın
2. Köpüklü suyu süngerle uygulayın
3. Bol temiz su ile durulayın
4. Hava akımı olan ortamda kurumaya bırakın
5. Tamamen kurumadan üzerine basılmamasını sağlayın

**Yün halı için dikkatler:**
- Soğuk veya ılık su kullanın (40°C üzeri kesinlikle uygulamayın)
- Alkali deterjanlardan kaçının (yün alkaliye hassastır)
- Ovalamayın, hafifçe bastırarak temizleyin
- Doğrudan güneşe sermekten kaçının

## Yaygın Leke Türleri ve Çözümleri

**Çay/Kahve lekeleri:**
- Hemen temiz bezle lekeyi bastırarak temizleyin
- 1 çay kaşığı bulaşık deterjanı + 1 bardak soğuk su karışımıyla silin
- Temiz su ile durulayın

**Şeker/Şerbet:**
- Soğuk suyla nemlendirilmiş bez ile lekeyi silin
- Sıcak su kullanmayın — şeker pişer ve fiber'e yapışır

**Kan:**
- Yalnızca soğuk su kullanın — sıcak su kanı pıhtılaştırır ve fiber'e gömülmesine neden olur
- Oksijen bazlı temizleyici uygulayın

## Profesyonel Temizlik

Yılda en az bir kez profesyonel ekiple derin temizlik yaptırın. Profesyonel temizliğin faydaları:

- Alaşan birikimini uzaklaştırır
- Lifleri yeniler ve kabarıklık kazandırır
- Garanti kapsamındaki bakım gerekliliğini karşılar
- Cam iç ortam havasını iyileştirir

## Uzun Ömür İçin Altın Kurallar

1. **Ayakkabı çıkarma kuralı:** Camiye girişte ayakkabı çıkartma geleneği halı ömrünü doğrudan uzatır
2. **Güneş engelleyici:** Doğrudan güneş ışığı aldığı pencere önlerine güneşlik önlemi alın
3. **Nem kontrolü:** Cami zemininde nem varsa önce su yalıtımı yapın
4. **Profesyonel onarım:** Küçük yırtık ve bozukluklar büyümeden tamir ettirin
5. **Yılda bir muayene:** Halı uzmanına periyodik kontrol yaptırın

## Asil Halı'nın Bakım Hizmeti

Asil Halı olarak ürünlerimizle birlikte kapsamlı bakım rehberi sunuyoruz. Garanti kapsamındaki ürünlerimiz için ücretsiz bakım danışmanlığı hizmeti veriyoruz.
    `.trim(),
  },
  {
    slug: "cami-halisi-olcumlendirme-rehberi",
    title: "Cami Halısı Ölçümlendirme Rehberi: Adım Adım",
    excerpt:
      "Cami halısı siparişi vermeden önce doğru ölçüm nasıl alınır? Mihrap, sütun arası ve özel alanlar için ölçümlendirme ipuçları.",
    category: "Teknik",
    tags: ["ölçümlendirme", "cami halısı", "sipariş", "teknik"],
    readTime: "7 dk",
    publishedAt: "2026-03-25",
    image: "/images/cami-8.png",
    author: "Asil Halı Teknik Ekibi",
    metaTitle: "Cami Halısı Ölçümlendirme Rehberi | Asil Halı",
    metaDescription:
      "Cami halısı siparişi için doğru ölçüm alma yöntemleri. Sütun arası, mihrap önü ve tüm alanlar için adım adım ölçüm rehberi.",
    content: `
## Cami Halısı Ölçümü Nasıl Alınır?

Doğru ölçüm, cami halısı siparişinin en kritik adımıdır. Hatalı ölçüm; fazladan maliyet, gecikme ve estetik bozukluklara yol açar. Bu rehberle adım adım ilerleyerek hatasız ölçüm alabilirsiniz.

## Gerekli Araçlar

- Uzun şerit metre (en az 10 metre)
- Kağıt ve kalem (elle çizim)
- Hesap makinesi
- Fotoğraf makinesi veya telefon

## Adım 1: Genel Plan Çizimi

Cami içini basitçe kağıda çizin. Sütunları, mihrabı, giriş kapılarını ve özel alanları işaretleyin. Ölçümleri bu plan üzerine not edeceksiniz.

## Adım 2: Ana Salon Ölçümü

**Dikdörtgen salonlar:**
- En uzun uzunluğu (U) ve en geniş genişliği (G) ölçün
- Alan = U × G
- %5-10 fire payı ekleyin

**Düzensiz salonlar:**
- Salonu dikdörtgen bölgelere ayırın
- Her bölümü ayrı ayrı ölçün
- Toplam alanı toplayın

## Adım 3: Sütun ve Özel Alanlar

Sütunlar, tuvalet girişleri ve kapı eşikleri halı dışında kalır. Bu alanların ölçüsünü çıkarın:

- Her sütunun tabanını ayrı ayrı ölçün
- Toplam sütun alanını ana alandan çıkarın

## Adım 4: Mihrap Önü

Mihrap önü genellikle özel desen veya farklı renk halı ile döşenir. Ayrı ölçün:

- Mihrap nişinin genişliği
- Mihrap önünde kalan alan (genellikle 1-2 saf derinliği = 100-160 cm)

## Adım 5: Saf Hesabı

Her saf ortalama 80-90 cm derinliktedir. Kaç saf olmasını istediğinizi belirleyin ve buna göre toplam derinliği hesaplayın.

**Örnek:** 50 saf × 85 cm = 42,5 metre derinlik

## Adım 6: Kenar ve Fire Payı

- Üretim ve kesim hataları için %5 fire payı ekleyin
- Kenar dikiş payı: her kenar için 5-10 cm ekstra

## Hesaplama Örneği

Ana salon: 25 m x 20 m = 500 m2
4 sütun: 4 x (1 m x 1 m) = 4 m2
Giris holü: -(3 m x 2 m) = -6 m2
Mihrap önü ayrı: 6 m x 2 m = 12 m2
Net alan: 500 - 4 - 6 = 490 m2
%8 fire payı: 490 x 1.08 = 529 m2
Mihrap önü: 12 m2 (ayrı sipariş)

## Profesyonel Keşif Talebi

Karmaşık mimarilerde veya büyük projelerde hata riskini sıfırlamak için Asil Halı teknik ekibimiz yerinde keşif yaparak hassas ölçüm alır. Bu hizmet tamamen ücretsizdir.
    `.trim(),
  },
  {
    slug: "cami-halisi-fiyatlari-2024",
    title: "Cami Halısı Fiyatları 2024: Güncel Rehber",
    excerpt:
      "Akrilik, yün, polipropilen ve polyamid cami halısı fiyatları. Metrekare maliyetleri, fiyatı etkileyen faktörler ve bütçe planlaması.",
    category: "Fiyat",
    tags: ["cami halısı fiyatları", "fiyat", "2024", "bütçe"],
    readTime: "6 dk",
    publishedAt: "2026-04-01",
    image: "/images/cami-1.png",
    author: "Asil Halı Uzmanları",
    metaTitle: "Cami Halısı Fiyatları 2024 | Güncel m² Fiyatları – Asil Halı",
    metaDescription:
      "2024 cami halısı fiyatları. Akrilik, yün, polipropilen ve polyamid m² fiyatları. Fiyatı etkileyen faktörler ve bütçe planlaması.",
    content: `
## Cami Halısı Fiyatları 2024

Cami halısı fiyatları; malzeme türü, desen karmaşıklığı, üretim miktarı ve kurulum hizmetine göre önemli ölçüde farklılık gösterir. Aşağıdaki fiyatlar 2024 yılı güncel üretici fiyatlarını yansıtmaktadır.

## Malzeme Türüne Göre Fiyatlar

### Akrilik Cami Halısı
- **Standart desen:** 150-250 TL/m²
- **Özel desen:** 250-350 TL/m²
- **Kışlık kalın:** 300-450 TL/m²

### Polipropilen Cami Halısı
- **Standart:** 120-220 TL/m²
- **BCF teknoloji:** 200-320 TL/m²

### Polyamid (Naylon) Cami Halısı
- **Solution Dyed Nylon:** 350-550 TL/m²
- **Premium SDN:** 500-750 TL/m²

### Yün Cami Halısı
- **%80 Yün karışım:** 450-700 TL/m²
- **%100 Saf yün:** 700-1.200 TL/m²
- **El dokuma yün:** 1.500-3.000 TL/m²

## Fiyatı Etkileyen Faktörler

**1. Sipariş Miktarı**
Büyük miktarlarda sipariş genellikle m² birim fiyatını düşürür. 500 m² üzeri siparişlerde %10-20 indirim mümkündür.

**2. Desen Karmaşıklığı**
Standart katalog desenler daha uygun fiyatlıdır. Özel tasarım, ek tasarım maliyeti getirir ancak bu genellikle büyük siparişlerde ücretsiz sunulur.

**3. Kurulum ve Nakliye**
- Nakliye: Mesafeye göre değişir
- Kurulum: m² başına 20-50 TL
- Kenar dikiş: Metre başına 15-30 TL

**4. Bağ Yoğunluğu**
m² başına düğüm sayısı arttıkça fiyat yükselir ancak kalite ve ömür de artar.

## Bütçe Hesaplama Örneği

**200 m² orta boy cami, akrilik halı:**
- Halı maliyeti: 200 m² × 200 TL = 40.000 TL
- Kurulum: 200 m² × 30 TL = 6.000 TL
- Nakliye: 1.500 TL
- **Toplam: ~47.500 TL**

**500 m² büyük cami, polyamid halı:**
- Halı maliyeti: 500 m² × 450 TL = 225.000 TL
- Kurulum: 500 m² × 35 TL = 17.500 TL
- Nakliye: 3.000 TL
- **Toplam: ~245.500 TL**

## Teklif Almak İçin

Kesin fiyat teklifi için Asil Halı ile iletişime geçin. Caminizin ölçülerini ve tercihlerinizi belirtin; 24 saat içinde detaylı fiyat teklifi sunalım.
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, count);
}

export const BLOG_CATEGORIES = [
  "Tümü",
  "Rehber",
  "Karşılaştırma",
  "Bakım",
  "Teknik",
  "Fiyat",
];
