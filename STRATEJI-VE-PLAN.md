# camiihalisi.com — Kapsamlı Strateji ve Uygulama Planı
**Tarih:** 15 Nisan 2026 | **Hazırlayan:** Claude (Cowork)

---

## VİZYON

> Türkiye'nin ve İslam coğrafyasının lider cami halısı tedarikçisi olan **Asil Halı A.Ş.**'nin dijital öncü kolu. Bu site; Google, Bing ve yapay zeka öneri motorlarında (ChatGPT, Perplexity, Gemini) "cami halısı" aramalarının zirvesinde yer alacak, ziyaretçileri ısrarla ana siteye yönlendirecek ve gerçek bir otorite kaynağı olarak konumlanacaktır.

---

## 1. TASARIM STRATEJİSİ

### 1.1 Renk Paleti — "Kutsal Mekân" Teması

Cami, huzur ve huşu mekânıdır. Tasarım da bu ruhu taşımalıdır: sıcak, güven verici, ruhani ama çağdaş.

| Renk Adı | Hex | Kullanım |
|----------|-----|---------|
| **Yeşil-Zümrüt** | `#1B4332` | Ana brand rengi, başlıklar, CTA butonlar |
| **Altın/Varak** | `#C9972B` | Vurgu rengi, border aksan, ikonlar |
| **Krem-Fildişi** | `#F7F3EC` | Ana sayfa arka planı |
| **Koyu Zemin** | `#0D2418` | Footer, nav dark mode, hero dark overlay |
| **Metin/Koyu** | `#1A1A1A` | Ana metin — HİÇBİR ZAMAN açık zemin üstüne açık metin! |
| **Gümüş-Bej** | `#E8E0D4` | Kart arka planları, ayırıcılar |
| **Vurgu Kırmızı** | `#8B1A1A` | Uyarı, satış rozeti (minimal kullanım) |

**Kontrast Kuralı (WCAG AA Minimum):**
- Koyu zemin (`#0D2418`) → metin `#F7F3EC` veya `#C9972B` ✅
- Krem zemin (`#F7F3EC`) → metin `#1A1A1A` veya `#1B4332` ✅
- Hiçbir zaman: gri zemin + gri metin, açık yeşil + beyaz, sarı + beyaz ❌

### 1.2 Tipografi

```
Başlıklar:    "Cormorant Garamond" — zariflik, tarihsel derinlik
Alt başlıklar: "Playfair Display" — otorite, güven
Gövde metni:  "Inter" veya "Noto Sans" — okunabilirlik (Arapça için Noto Sans Arabic)
Kod/teknik:   "JetBrains Mono"
```

### 1.3 Görsel Dil — İslami Estetik

**Kullanılacak motifler:**
- Arabesk geometrik desenler (SVG, arka plan texture olarak — %5-10 opaklıkta)
- Sekizgen ve yıldız geometri (cami mimarisinden ilham)
- Kufi hattı stili başlık aksan çizgileri
- Cami silüeti (logo/favicon)

**Fotoğraf Kullanımı:**
- 60 adet cami fotoğrafı zaten mevcut → Hero, galeri, kategori bannerları
- Fotoğraflarda mutlaka koyu overlay + metin (kontrast garantisi)
- Halı doku close-up'ları: ürün sayfalarında özgün çekim hissi

**"Kutsallık" Hissi Nasıl Verilir (Abartısız):**
- Geniş boşluklar (white space) → huşu hissi
- Yavaş, yumuşak geçiş animasyonları
- Altın/yeşil renk kombinasyonu → İslam mimarisinin renkleri
- Ayet veya hadis alıntısı (Kur'an'dan cami ile ilgili) — footer veya hero'da
- "Emanet ile üretilmiştir" mesajlaşması

---

## 2. SEO MİMARİSİ — Arama Motorlarında Zirve Stratejisi

### 2.1 Teknik SEO (Temel)

| Bileşen | Açıklama | Öncelik |
|---------|----------|---------|
| `sitemap.xml` | Dinamik, tüm sayfaları kapsayan, hreflang'lı | 🔴 Kritik |
| `robots.txt` | Crawler yönlendirmesi | 🔴 Kritik |
| `canonical` tag | Her sayfada, dil varyantlarını birleştirme | 🔴 Kritik |
| `hreflang` | TR/EN/AR/FR dil alternatifleri (Google International SEO) | 🔴 Kritik |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1, FID < 100ms | 🔴 Kritik |
| Schema.org JSON-LD | Organization, Product, Article, FAQ, BreadcrumbList | 🔴 Kritik |
| Open Graph + Twitter | Sosyal paylaşım önizlemeleri | 🟠 Önemli |
| `robots` meta | noindex/noindex sayfalar (admin, login) | 🟠 Önemli |

### 2.2 JSON-LD Yapısal Veri Stratejisi

Her sayfa türünde farklı şema:

```json
// Ana Sayfa → Organization
{
  "@type": "Organization",
  "name": "Asil Halı A.Ş.",
  "url": "https://camiihalisi.com",
  "sameAs": ["https://asilhali.com.tr", ...sosyal medya...]
}

// Ürün Sayfaları → Product
{
  "@type": "Product",
  "name": "Akrilik Cami Halısı",
  "brand": { "@type": "Brand", "name": "Asil Halı" },
  "offers": { "@type": "Offer", "availability": "InStock" }
}

// Blog/Makale → Article + FAQPage
{
  "@type": ["Article", "FAQPage"],
  "author": { "@type": "Organization", "name": "Asil Halı A.Ş." }
}
```

### 2.3 Anahtar Kelime Mimarisi

**Silo Yapısı (SEO Silo = Tematik Kümeleme):**

```
📌 ANA SILO: "Cami Halısı"
├── 🟢 Ürün Silosu
│   ├── Akrilik cami halısı
│   ├── Yün cami halısı  
│   ├── Polipropilen cami halısı
│   ├── Polyamid cami halısı
│   └── [her birinde 20+ uzun kuyruk kelime]
├── 📚 Bilgi Silosu (Blog)
│   ├── "Cami halısı nasıl seçilir?" 
│   ├── "Cami halısı temizliği"
│   ├── "Cami halısı fiyatları"
│   ├── "Cami halısı ölçülendirme"
│   └── [60+ makale — PDF'lerden dönüştürülecek]
├── 🏙️ Lokasyon Silosu (Yerel SEO)
│   ├── İstanbul cami halısı
│   ├── Ankara cami halısı
│   ├── [81 il + önemli ilçeler]
└── 🌍 Uluslararası Silo
    ├── mosque carpet Turkey (EN)
    ├── سجادة مسجد (AR)
    └── tapis de mosquée (FR)
```

### 2.4 Yapay Zeka Öneri Motorlarına Uyumluluk (GEO)

*Generative Engine Optimization — ChatGPT, Perplexity, Gemini'nin önerilerinde görünmek:*

- **E-E-A-T sinyalleri:** Yazar bilgisi, uzman imzası, kaynak gösterimi
- **Özgün araştırma:** "Türkiye'deki X cami halısı üreticisi" listelerinde yer almak
- **Alıntılanabilir içerik:** İstatistik, veri, karşılaştırma tabloları
- **Structured Q&A:** FAQ sayfaları (AI'ların sıkça aldığı soruları yanıtlayan)
- **Wikipedia/Wikidata:** Mümkünse firma kaydı
- **Yüksek otorite backlink:** Diyanet İşleri, İl Müftülükleri, mimarlık siteleri

---

## 3. İÇERİK MİMARİSİ

### 3.1 Sayfa Yapısı

```
/ (Ana Sayfa)
├── /hakkimizda
├── /iletisim
├── /kategoriler
│   ├── /akrilik-cami-halisi        [Ürün kategorisi]
│   ├── /yun-cami-halisi
│   ├── /polipropilen-cami-halisi
│   └── /polyamid-cami-halisi
├── /blog                           [Blog listesi]
│   └── /blog/[slug]                [60+ makale]
├── /galeri                         [60 cami fotoğrafı]
├── /sss                            [Sık sorulan sorular]
├── /teknik-bilgiler
│   ├── /olcumlendirme             [Cami halısı ölçü rehberi]
│   ├── /bakim                     [Temizlik/bakım rehberi]
│   └── /kurulum                   [Döşeme rehberi]
└── /[sehir]-cami-halisi           [81 il için lokasyon sayfası]
    └── /istanbul-cami-halisi
    └── /ankara-cami-halisi
    └── ...
```

### 3.2 İçerik Üretim Akışı

```
Admin Paneli → "Yeni Makale Üret" →
  [Anahtar Kelime Gir] →
  [PDF Arşivinden bağlam seç] →
  Grok-3 API: Türkçe makale üret (2000-3000 kelime) →
  Otomatik çeviri: EN, AR, FR →
  SEO skoru hesapla →
  Taslak olarak kaydet →
  Admin onaylayıp yayınla
```

### 3.3 Content Takvimi (İlk 3 Ay)

- **Ay 1:** 4 kategori sayfası + ana sayfa + hakkımızda + iletişim (tam içerik)
- **Ay 2:** 20 blog makalesi (PDF'lerden dönüştür + AI ile zenginleştir)
- **Ay 3:** 20 blog makalesi daha + 10 şehir sayfası + galeri + SSS

---

## 4. ADMİN PANELİ — Tam Özellik Listesi

### 4.1 Dashboard (Ana Ekran)

**Üst kısım — Anlık Metrikler:**
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Bu Ay Ziyaret│ Asil Halı'ya │ Google Sıra  │ Yayında İçerik│
│    4,231     │ Yönlendirilen│   #3 ortalama │     87 sayfa │
│  ↑ %23       │    312 kişi  │  ↑ 2 pozisyon│   + 5 taslak │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Orta — Grafikler:**
- Ziyaretçi trendi (30/90/365 gün)
- Arama motoru organik trafik kaynakları
- Ana siteye yönlendirme grafiği (UTM tabanlı)
- En çok okunan makaleler

**Alt — Yapılacaklar:**
- Taslak içerikler (onay bekleyen)
- Planlanmış AI görevleri
- GSC uyarıları (crawl hataları vb.)

### 4.2 İçerik Yönetimi

**4.2.1 Yapay Zeka İçerik Motoru:**
- Anahtar kelime gir → AI makale üretir
- Uzunluk seçimi: Kısa (800w) / Orta (1500w) / Uzun (3000w)
- Ton seçimi: Bilgilendirici / Satış odaklı / Teknik
- PDF arşivinden bağlam seçimi (60 makale = kaynak havuzu)
- Toplu üretim: 10 makale birden planla

**4.2.2 İçerik Listesi:**
- Tüm sayfalar/bloglar tablo görünümü
- Filtreler: Taslak / Yayında / Zamanlanmış
- SEO skoru görüntüleme
- Tek tıkla çeviri durumu

**4.2.3 Görsel Yönetimi:**
- 60 cami fotoğrafı yönetimi
- Yeni fotoğraf yükleme
- Her görsele alt text + title (SEO)
- Hangi sayfada kullanıldığı

### 4.3 SEO Araçları

**4.3.1 Google Search Console Entegrasyonu:**
```
GSC API bağlantısı →
  - Arama terimleri + tıklama sayıları
  - Sayfa bazlı performans
  - İndexleme durumu
  - Crawl hataları
  - Core Web Vitals raporu
```

**4.3.2 Meta Piksel / Reklam Takibi:**
- Meta (Facebook/Instagram) Pixel ID girişi → otomatik kurulum
- Google Ads dönüşüm takip kodu
- TikTok Pixel
- Tüm piksel kodları tek ekrandan yönetim

**4.3.3 SEO Skoru:**
- Her sayfa için canlı SEO analizi
- Eksik meta description, başlık uzunluğu uyarıları
- İç linkleme önerileri
- Anahtar kelime yoğunluğu

### 4.4 Analitik ve Raporlama

**4.4.1 Ziyaretçi Analitikleri:**
- Sayfa bazlı ziyaret sayısı (kendi sistemimiz — cookie consent)
- Coğrafi dağılım
- Cihaz türü (mobil/desktop)
- Tarayıcı ve işletim sistemi
- Giriş/çıkış sayfaları

**4.4.2 Ana Siteye Yönlendirme Raporu:**
- UTM parametreli linkler: `https://asilhali.com.tr?utm_source=camiihalisi&utm_medium=organic&utm_campaign=kategori`
- Kaç kişi ana siteye gönderildi (kampanya bazlı)
- Hangi sayfadan en çok yönlendirme yapılıyor
- Aylık yönlendirme trendi grafiği

**4.4.3 İhracat / PDF Raporlar:**
- Aylık performans raporu → PDF olarak indir
- Google Sheets entegrasyonu (opsiyonel)

### 4.5 Ayarlar

- Site başlığı, açıklaması
- Logo ve favicon yükleme
- İletişim bilgileri (telefon, e-posta, adres)
- Sosyal medya linkleri
- Ana site URL'i (UTM parametreli)
- Google Analytics Measurement ID
- Google Search Console API anahtarı
- Meta Pixel ID
- SMTP ayarları (iletişim formu e-postaları için)

---

## 5. TEKNİK MİMARİ KARARLARI

### 5.1 Analitik — Kendi Sistemimiz

Google Analytics yerine **kendi hafif analitik sistemimizi** kuracağız:

```
Neden? 
  - GDPR/KVKK uyumluluğu kolaylaşır
  - Üçüncü parti cookie engeli yok
  - Ana siteye yönlendirme verisi kesin ve temiz

Nasıl?
  - Sayfa görüntüleme: /api/analytics/pageview endpoint
  - Link tıklaması: /api/analytics/event endpoint  
  - Veriler: Prisma → Analytics tablosu
  - Dashboard: Admin panelinde grafikler
```

*(Google Analytics de ayrıca kurulabilir — çift katman ölçüm)*

### 5.2 İçerik Teslimatı

- **Static Generation (SSG):** Blog makaleleri, kategori sayfaları → hızlı, SEO dostu
- **ISR (Incremental Static Regeneration):** Her 24 saatte bir otomatik güncelleme
- **Server Components:** Admin paneli, dinamik kısımlar
- **Edge Caching:** Vercel/Cloudflare CDN

### 5.3 Görüntü Optimizasyonu

- Next.js `<Image>` komponenti → WebP otomatik dönüşüm
- Lazy loading (sadece görünür görseller yüklenir)
- Blur placeholder (skeleton loading)
- Responsive sizes (mobil küçük, desktop büyük)

### 5.4 Ana Siteye Link Stratejisi

Her sayfada mutlaka şu unsurlar:
```html
<!-- Sticky CTA Banner -->
<div class="sticky-cta">
  Asil Halı'nın resmi sitesini ziyaret edin → [asilhali.com.tr]
</div>

<!-- İçerik içi bağlamsal link -->
"...daha fazla ürün ve fiyat bilgisi için 
<a href="https://asilhali.com.tr?utm_source=camiihalisi">Asil Halı A.Ş.'yi ziyaret edin</a>..."

<!-- Footer -->
"Bu site Asil Halı A.Ş.'nin bilgi portalıdır. 
Alış veriş için: asilhali.com.tr"
```

---

## 6. UYGULAMA PLANI — Faz Bazlı Yol Haritası

### FAZ 1 — Temel (1-2 Hafta)

**Hedef:** Site yayına alınabilir, Google'a sunulabilir hale gelsin.

```
[ ] Tasarım sistemi: renk token'ları, font kurulumu, temel bileşenler
[ ] İçerik bileşenleri: TextBlock, ImageBlock, GalleryBlock, FeatureGrid
[ ] Ana sayfa tam içerik (Hero + About + Kategoriler + CTA)
[ ] 4 kategori sayfası tam içerik
[ ] Hakkımızda ve İletişim sayfaları
[ ] sitemap.xml dinamik üretim
[ ] robots.txt
[ ] JSON-LD Organization + BreadcrumbList
[ ] hreflang tags (4 dil)
[ ] Meta title/description şablonları
[ ] Canonical URL sistemi
[ ] Google Search Console doğrulama
[ ] Core Web Vitals optimizasyonu (görüntüler, font loading)
```

### FAZ 2 — İçerik (2-4 Hafta)

**Hedef:** 60 makaleyi yayınla, otorite kur, anahtar kelime sıralamaları başlasın.

```
[ ] Blog sistemi (liste + detay sayfası)
[ ] 60 PDF → makale dönüşümü (AI zenginleştirme + SEO optimizasyonu)
[ ] Galeri sayfası (60 cami fotoğrafı)
[ ] SSS sayfası (JSON-LD FAQPage şeması ile)
[ ] Teknik rehberler (ölçüm, bakım, kurulum)
[ ] İç linkleme sistemi (ilgili makale önerileri)
[ ] JSON-LD Article şeması
[ ] Sosyal paylaşım meta tagları (OG, Twitter)
[ ] Çeviri dosyaları doldurma (UI metinleri)
[ ] Arapça RTL (sağdan sola) tasarım düzeltmeleri
```

### FAZ 3 — Admin ve Analitik (3-5 Hafta)

**Hedef:** Müşteri siteyi bağımsız yönetebilsin, rapor alabilsin.

```
[ ] Admin dashboard yeniden tasarım (metrikler, grafikler)
[ ] Kendi analitik sistemi (pageview + event tracking)
[ ] Ana siteye yönlendirme raporu (UTM tabanlı)
[ ] Google Search Console API entegrasyonu
[ ] Meta Pixel yönetimi
[ ] AI makale üretim paneli (gelişmiş: ton, uzunluk, kaynak seçimi)
[ ] İçerik takvimi görünümü
[ ] PDF rapor indirme
[ ] Admin eksik sayfalar: /admin/icerikler + /admin/ayarlar
[ ] Görsel yönetimi (yükleme, alt text, kullanım)
```

### FAZ 4 — Otorite ve Büyüme (5-8 Hafta)

**Hedef:** Sıralamalar yükselsin, AI öneri motorlarında görünür hale gelsin.

```
[ ] 81 il için şehir sayfaları (lokasyon SEO)
[ ] Ürün karşılaştırma aracı (halı türleri arası)
[ ] Uzman makale serisi (E-E-A-T için imzalı)
[ ] Video içerik embed (YouTube Shorts: halı döşeme, bakım)
[ ] Gerçek müşteri referansları (schema.org Review)
[ ] Toplu AI makale üretimi (kampanya bazlı)
[ ] Google Ads dönüşüm takip kurulumu
[ ] Newsletter / e-posta listesi (isteğe bağlı)
[ ] Bağlantı kurma: Diyanet, mimarlık siteleri, dergi tanıtımları
[ ] Performans audit ve Core Web Vitals iyileştirme
```

---

## 7. BAŞARI METRİKLERİ

| Metrik | 3. Ay Hedef | 6. Ay Hedef | 12. Ay Hedef |
|--------|-------------|-------------|--------------|
| Organik trafik | 500/ay | 3.000/ay | 10.000+/ay |
| Google sıralaması "cami halısı" | İlk 10 | İlk 5 | İlk 3 |
| İndekslenen sayfa | 100+ | 200+ | 400+ |
| Ana siteye yönlendirme | 50/ay | 300/ay | 1.000+/ay |
| Ortalama sayfa süresi | 1:30 | 2:00 | 2:30 |
| Backlink sayısı | 10 | 50 | 150+ |

---

## 8. HEMEN BAŞLAYALIM MI?

Planı onaylarsanız aşağıdaki sırayla ilerleyebiliriz:

**Adım 1 (Bu Oturum):**
- Tasarım sistemini kur (renkler, fontlar, temel bileşenler)
- Ana sayfa ve kategori sayfalarını dolduralım
- sitemap.xml + robots.txt + JSON-LD ekleyelim

**Adım 2 (Sonraki Oturum):**
- Blog sistemini kur
- 60 PDF'yi makalelere dönüştür

**Adım 3:**
- Admin panelini yeniden yaz (dashboard, raporlar, GSC, Meta Pixel)

---

*Bu plan, camiihalisi.com'un hem teknik mükemmeliyetini hem de içerik otoritesini birlikte inşa etmek için tasarlanmıştır. Her faz bağımsız değer üretirken bir sonraki fazın temelini oluşturur.*
