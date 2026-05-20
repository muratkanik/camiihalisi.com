const fs = require('fs');
const path = require('path');

const locales = ['tr', 'en', 'ar', 'fr', 'de'];
const dir = path.join(__dirname, 'messages');

const missingMenu = {
    "acrylic": "Akrilik Cami Halısı",
    "wool": "Yün Cami Halısı",
    "polypropylene": "Polipropilen Cami Halısı",
    "polyamide": "Polyamid Cami Halısı",
    "underlay_rubber_tredmor": "TredMOR™ Berber Supreme",
    "underlay_felt_600": "600 Cami Halısı Keçesi",
    "underlay_felt_1000": "1000 Cami Halısı Keçesi",
    "underlay_felt_1200": "1200 Cami Halısı Keçesi"
};

const stokCamiData = {
    "title": "Stok Cami Halısı",
    "shortTitle": "Stok Halı",
    "metaTitle": "Stok Cami Halısı | Hemen Teslim Hazır Halılar – Asil Halı",
    "metaDescription": "Stok cami halısı modelleri. Hemen teslim, uygun fiyatlı hazır cami halıları. Türkiye geneli hızlı sevkiyat. Asil Halı A.Ş.",
    "description": "Acil ihtiyaçlar için hemen teslim, depomuzda hazır bulunan standart ölçü cami halıları.",
    "longDescription": "Stok cami halısı serimiz, acil halı ihtiyacı olan projeler için fabrikamızda sürekli hazır bulunan, standart kalite ve desenlerden oluşur. Bekleme süresi olmadan hemen sevk edilebilir.",
    "badge": "Hemen Teslim",
    "advantages": [
        "Bekleme süresi yok, anında teslimat",
        "Standart ölçülerde stok garantisi",
        "Uygun fiyat avantajı",
        "Klasik desen ve renk seçenekleri",
        "Acil tadilat projeleri için ideal",
        "Tüm kalite sertifikalarına sahip"
    ],
    "specs": [
        {
            "label": "Lif Türü",
            "value": "Akrilik veya Polipropilen"
        },
        {
            "label": "Teslimat",
            "value": "1-3 İş Günü"
        }
    ],
    "useCases": [
        "Acil tadilat projeleri",
        "Geçici mescit alanları",
        "Konteyner camileri",
        "Hızlı açılış yapılacak ibadethaneler"
    ],
    "faqs": [
        {
            "question": "Stok halılar defolu mudur?",
            "answer": "Hayır, stok halılarımız birinci kalite standart üretimlerimizdir. Fazla üretilen partilerden oluşur."
        }
    ]
};

for (const loc of locales) {
    const filePath = path.join(dir, `${loc}.json`);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Add missing menu items
        if (!data.menu) data.menu = {};
        for (const [key, val] of Object.entries(missingMenu)) {
            if (!data.menu[key]) {
                data.menu[key] = val;
            }
        }
        
        // Add missing category data
        if (!data.categoryData) data.categoryData = {};
        if (!data.categoryData["stok-cami-halisi"]) {
            data.categoryData["stok-cami-halisi"] = stokCamiData;
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Updated ${loc}.json`);
    }
}
