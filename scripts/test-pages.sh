#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
# test-pages.sh — camiihalisi.com tüm sayfa HTTP testi
#
# Kullanım:
#   ./scripts/test-pages.sh                        # canlı site
#   ./scripts/test-pages.sh http://localhost:3000  # local dev server
#
# Çıktı:
#   ✓  → 200 OK
#   ✗  → Hata (kodu gösterir)
#   Sonunda: toplam / başarılı / başarısız sayısı
# ─────────────────────────────────────────────────────────────────────

BASE="${1:-https://camiihalisi.com}"
PASS=0
FAIL=0
FAIL_URLS=()

check() {
  local url="$BASE$1"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url")
  if [[ "$code" == "200" ]]; then
    echo "  ✓  $1"
    ((PASS++))
  else
    echo "  ✗  $1  ← HTTP $code"
    ((FAIL++))
    FAIL_URLS+=("$1 → $code")
  fi
}

# ── Statik Sayfalar ────────────────────────────────────────────────
echo ""
echo "━━━ Statik Sayfalar ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for path in "/" "/cami-halisi" "/galeri" "/blog" "/hakkimizda" \
            "/referanslar" "/teknik-ozellikler" "/iletisim" "/sitemap.xml"; do
  check "$path"
done

# ── Kategori Sayfaları ─────────────────────────────────────────────
echo ""
echo "━━━ Kategori Sayfaları ($( echo "akrilik-cami-halisi safli-akrilik-cami-halisi gobekli-akrilik-cami-halisi seccadeli-akrilik-cami-halisi yun-cami-halisi safli-yun-cami-halisi gobekli-yun-cami-halisi seccadeli-yun-cami-halisi polipropilen-cami-halisi safli-polipropilen-cami-halisi gobekli-polipropilen-cami-halisi seccadeli-polipropilen-cami-halisi polyamid-cami-halisi safli-polyamid-cami-halisi gobekli-polyamid-cami-halisi seccadeli-polyamid-cami-halisi ozel-desen-axminster-cami-halisi kaucuk-cami-halisi-altligi tredmor-berber-supreme kece-cami-halisi-altligi 600-cami-halisi-kecesi 1000-cami-halisi-kecesi 1200-cami-halisi-kecesi" | wc -w | tr -d ' ') adet) ━━━"
for slug in \
  akrilik-cami-halisi safli-akrilik-cami-halisi gobekli-akrilik-cami-halisi seccadeli-akrilik-cami-halisi \
  yun-cami-halisi safli-yun-cami-halisi gobekli-yun-cami-halisi seccadeli-yun-cami-halisi \
  polipropilen-cami-halisi safli-polipropilen-cami-halisi gobekli-polipropilen-cami-halisi seccadeli-polipropilen-cami-halisi \
  polyamid-cami-halisi safli-polyamid-cami-halisi gobekli-polyamid-cami-halisi seccadeli-polyamid-cami-halisi \
  ozel-desen-axminster-cami-halisi kaucuk-cami-halisi-altligi tredmor-berber-supreme \
  kece-cami-halisi-altligi 600-cami-halisi-kecesi 1000-cami-halisi-kecesi 1200-cami-halisi-kecesi; do
  check "/kategori/$slug"
done

# ── İller (81 il) ─────────────────────────────────────────────────
echo ""
echo "━━━ İller ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for slug in \
  istanbul ankara izmir bursa antalya adana konya gaziantep mersin kayseri \
  eskisehir diyarbakir denizli samsun sanliurfa malatya trabzon manisa kocaeli \
  balikesir kahramanmaras van hatay aydin tekirdag sakarya mugla mardin \
  ordu sivas erzurum batman alanya afyonkarahisar aksaray agri bayburt \
  bartin bilecik bingol bitlis bolu burdur canakkale cankiri corum \
  duzce edirne elazig erzincan giresun gumushane hakkari igdir isparta \
  karabuk karaman kastamonu kilis kirikkale kirklareli kirsehir kutahya \
  nevsehir nigde osmaniye rize siirt sinop sirnak tokat tunceli usak \
  yalova yozgat zonguldak ardahan artvin corum adiyaman; do
  check "/cami-halisi/$slug"
done

# ── İlçeler ───────────────────────────────────────────────────────
echo ""
echo "━━━ İlçeler ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for slug in \
  kadikoy besiktas sisli uskudar fatih beyoglu bakirkoy avcilar kagithane pendik \
  umraniye maltepe kartal gaziosmanpasa bagcilar bahcelievler sultangazi \
  buyukcekmece kucukcekmece esenyurt beylikduzu tuzla sultanbeyli \
  cekmeköy sancaktepe sultanbeyli sariyer beykoz adalar arnavutkoy \
  mamak cankaya kecioren yenimahalle etimesgut sincan golbasi pursaklar \
  konak bornova karsiyaka bayrakli cigli gaziemir buca kemeralti \
  osmangazi yildirim nilufer mudanya inegol \
  kepez muratpasa konyaalti dosemealti; do
  check "/cami-halisi/$slug"
done

# ── Blog Sayfaları (ilk 10) ───────────────────────────────────────
echo ""
echo "━━━ Blog (ilk 10 yazı) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for slug in \
  cami-halisi-cesitleri-ve-ozellikleri \
  cami-halisi-nasil-secilir \
  cami-halisi-bakimi \
  akrilik-cami-halisi-ozellikleri \
  yun-cami-halisi-avantajlari \
  cami-halisi-fiyatlari \
  cami-halisi-olculeri \
  cami-halisi-temizligi \
  cami-halisi-modelleri \
  cami-halisi-montaji; do
  check "/blog/$slug"
done

# ── Özet ──────────────────────────────────────────────────────────
TOTAL=$((PASS + FAIL))
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  TOPLAM: $TOTAL  |  ✓ $PASS  |  ✗ $FAIL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ ${#FAIL_URLS[@]} -gt 0 ]]; then
  echo ""
  echo "  Başarısız URL'ler:"
  for u in "${FAIL_URLS[@]}"; do
    echo "    ✗ $u"
  done
fi
echo ""
