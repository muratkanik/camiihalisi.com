const fs = require('fs');
const path = require('path');

const locales = ['tr', 'en', 'ar', 'fr', 'de'];
const dir = path.join(__dirname, 'messages');

const camiHalisiData = {
    "title": "Cami Halısı Modelleri",
    "shortTitle": "Cami Halısı",
    "metaTitle": "Cami Halısı Modelleri ve Fiyatları | Asil Halı",
    "metaDescription": "Türkiye'nin en çok tercih edilen cami halısı modelleri. Akrilik, yün, polipropilen ve stok cami halıları en uygun fiyat garantisiyle.",
    "description": "Camilerimiz için özel üretilen en kaliteli akrilik, yün ve polipropilen halı seçeneklerimizi inceleyin.",
    "longDescription": "Türkiye'nin köklü halı üreticilerinden Asil Halı olarak, camilerimizin manevi atmosferini tamamlayacak özel üretim halılar sunuyoruz.",
    "badge": "Kategori",
    "advantages": [],
    "specs": [],
    "useCases": [],
    "faqs": []
};

for (const loc of locales) {
    const filePath = path.join(dir, `${loc}.json`);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Add missing category data
        if (!data.categoryData) data.categoryData = {};
        if (!data.categoryData["cami-halisi"]) {
            data.categoryData["cami-halisi"] = camiHalisiData;
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Updated ${loc}.json`);
    }
}
