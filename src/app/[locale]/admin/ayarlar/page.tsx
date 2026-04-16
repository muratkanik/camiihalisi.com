import { getSettings } from "@/lib/settings";
import { saveSettingsAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AyarlarPage() {
  const s = await getSettings();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Site Ayarları
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
          Hero metinleri, iletişim bilgileri ve sosyal medya linklerini buradan güncelleyin.
          Değişiklikler anında yayına girer.
        </p>
      </div>

      <form action={saveSettingsAction} className="space-y-8">
        {/* Hero */}
        <Section title="🏠 Ana Sayfa Hero">
          <Field
            label="Hero Başlığı"
            name="hero_title"
            defaultValue={s.heroTitle}
            placeholder="Cami Halısında Türkiye'nin Güvenilir Adresi"
          />
          <Field
            label="Hero Alt Başlığı"
            name="hero_subtitle"
            defaultValue={s.heroSubtitle}
            type="textarea"
            placeholder="Türkiye'nin köklü halı ustalarından..."
          />
        </Section>

        {/* İletişim */}
        <Section title="📞 İletişim Bilgileri">
          <Field
            label="WhatsApp Numarası (sadece rakamlar)"
            name="whatsapp_number"
            defaultValue={s.whatsappNumber}
            placeholder="905323467939"
            hint="Ülke kodu dahil, boşluk ve + işareti olmadan yazın. Örn: 905323467939"
          />
          <Field
            label="WhatsApp Mesajı (URL encoded)"
            name="whatsapp_message"
            defaultValue={s.whatsappMessage}
            placeholder="Merhaba%2C%20cami%20hal%C4%B1s%C4%B1%20hakk%C4%B1nda..."
            hint="wa.me bağlantısındaki text parametresi. URL encode edilmiş olmalı."
          />
          <Field
            label="Telefon (görüntüleme formatı)"
            name="phone"
            defaultValue={s.phone}
            placeholder="+90 532 346 79 39"
          />
          <Field
            label="E-posta"
            name="email"
            defaultValue={s.email}
            placeholder="info@asilhali.com.tr"
          />
          <Field
            label="Adres"
            name="address"
            defaultValue={s.address}
            placeholder="Kayseri, Türkiye"
          />
        </Section>

        {/* Sosyal Medya */}
        <Section title="🔗 Sosyal Medya & Linkler">
          <Field
            label="Instagram URL"
            name="instagram_url"
            defaultValue={s.instagramUrl}
            placeholder="https://www.instagram.com/asilcarpet/"
          />
          <Field
            label="LinkedIn URL"
            name="linkedin_url"
            defaultValue={s.linkedinUrl}
            placeholder="https://www.linkedin.com/company/asil-hali"
          />
          <Field
            label="Facebook URL"
            name="facebook_url"
            defaultValue={s.facebookUrl}
            placeholder="https://www.facebook.com/..."
          />
          <Field
            label="Ana Site URL"
            name="main_site_url"
            defaultValue={s.mainSiteUrl}
            placeholder="https://www.asilhali.com.tr"
          />
        </Section>

        {/* Save */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-400">
            Tüm değişiklikler veritabanına kaydedilir ve site yenilendikten sonra yayınlanır.
          </p>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

/* ── Sub-components ── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
          {title}
        </h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  type?: "text" | "textarea";
  hint?: string;
}) {
  const baseClass =
    "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition";

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={3}
          className={`${baseClass} resize-y`}
        />
      ) : (
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
      {hint && (
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
      )}
    </div>
  );
}

function SubmitButton() {
  return (
    <button
      type="submit"
      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      Kaydet
    </button>
  );
}
