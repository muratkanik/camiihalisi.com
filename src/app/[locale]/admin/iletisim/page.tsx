"use client";

import { useState, useEffect } from "react";
import { Save, RotateCcw, Plus, Trash2, Phone, MapPin, Mail, ExternalLink, AlertCircle } from "lucide-react";
import type { ContactOffice, ContactPhone } from "./types";

export default function IletisimAdminPage() {
  const [offices, setOffices] = useState<ContactOffice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/iletisim")
      .then((r) => r.json())
      .then((d) => { setOffices(d.offices ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offices }),
      });
      if (!res.ok) throw new Error("Kaydetme başarısız");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!confirm("Tüm değişiklikler silinecek ve varsayılan bilgiler yüklenecek. Devam edilsin mi?")) return;
    const res = await fetch("/api/admin/iletisim", { method: "DELETE" });
    if (res.ok) {
      const d = await res.json();
      setOffices(d.offices);
    }
  }

  function addOffice() {
    const newO: ContactOffice = {
      id: `office-${Date.now()}`,
      region: "Yeni Bölge",
      type: "ofis",
      title: "Yeni Ofis",
      city: "",
      phones: [],
      active: true,
    };
    setOffices([...offices, newO]);
    setExpandedId(newO.id);
  }

  function updateOffice(id: string, patch: Partial<ContactOffice>) {
    setOffices(offices.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }

  function deleteOffice(id: string) {
    if (!confirm("Bu ofisi silmek istediğinizden emin misiniz?")) return;
    setOffices(offices.filter((o) => o.id !== id));
  }

  function addPhone(id: string) {
    const o = offices.find((x) => x.id === id);
    if (!o) return;
    updateOffice(id, { phones: [...o.phones, { label: "", number: "" }] });
  }

  function updatePhone(officeId: string, idx: number, patch: Partial<ContactPhone>) {
    const o = offices.find((x) => x.id === officeId);
    if (!o) return;
    const phones = o.phones.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    updateOffice(officeId, { phones });
  }

  function removePhone(officeId: string, idx: number) {
    const o = offices.find((x) => x.id === officeId);
    if (!o) return;
    updateOffice(officeId, { phones: o.phones.filter((_, i) => i !== idx) });
  }

  const typeLabels: Record<string, string> = {
    merkez: "Merkez", fabrika: "Fabrika", ofis: "Ofis",
    "home-office": "Temsilci", depo: "Depo", yurtdisi: "Yurtdışı",
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">İletişim Yönetimi</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {offices.length} lokasyon · Ofis, telefon ve adres bilgilerini yönetin
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/iletisim"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Sayfayı Gör
          </a>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Varsayıla Dön
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#006064] text-white text-sm font-bold hover:bg-[#003B40] disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? "Kaydediliyor..." : saved ? "✓ Kaydedildi!" : "Kaydet"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 mb-4 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="space-y-3">
        {offices.map((office) => {
          const isOpen = expandedId === office.id;
          return (
            <div
              key={office.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {/* Summary row */}
              <div className="flex items-center gap-4 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : office.id)}
                  className="flex-1 flex items-center gap-3 text-left"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                    office.type === "merkez" ? "bg-[#006064]" :
                    office.type === "fabrika" ? "bg-slate-600" :
                    office.type === "ofis" ? "bg-blue-600" :
                    office.type === "yurtdisi" ? "bg-purple-600" :
                    "bg-slate-400"
                  }`}>
                    {typeLabels[office.type]?.[0] ?? "O"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-800 dark:text-white">{office.title}</span>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                        {typeLabels[office.type] ?? office.type}
                      </span>
                      {!office.active && (
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Pasif</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{office.region} · {office.city} · {office.phones.length} telefon</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => deleteOffice(office.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Başlık" value={office.title} onChange={(v) => updateOffice(office.id, { title: v })} />
                    <Field label="Bölge" value={office.region} onChange={(v) => updateOffice(office.id, { region: v })} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Tür</label>
                      <select
                        value={office.type}
                        onChange={(e) => updateOffice(office.id, { type: e.target.value as ContactOffice["type"] })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40"
                      >
                        {Object.entries(typeLabels).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </div>
                    <Field label="Şehir" value={office.city} onChange={(v) => updateOffice(office.id, { city: v })} />
                    <Field label="Ülke" value={office.country ?? ""} onChange={(v) => updateOffice(office.id, { country: v })} placeholder="Türkiye" />
                  </div>
                  <Field label="Adres" value={office.address ?? ""} onChange={(v) => updateOffice(office.id, { address: v })} placeholder="Mahalle, cadde, no..." />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="E-posta" value={office.email ?? ""} onChange={(v) => updateOffice(office.id, { email: v })} placeholder="info@asilhali.com.tr" />
                    <Field label="WhatsApp" value={office.whatsapp ?? ""} onChange={(v) => updateOffice(office.id, { whatsapp: v })} placeholder="+905323467939" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Faks" value={office.fax ?? ""} onChange={(v) => updateOffice(office.id, { fax: v })} />
                    <Field label="Mesai Saatleri" value={office.workHours ?? ""} onChange={(v) => updateOffice(office.id, { workHours: v })} placeholder="Pzt–Cum: 08:00–18:00" />
                  </div>
                  <Field label="Google Maps URL" value={office.mapsUrl ?? ""} onChange={(v) => updateOffice(office.id, { mapsUrl: v })} placeholder="https://maps.google.com/?q=..." />

                  {/* Phones */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Telefonlar</label>
                      <button
                        type="button"
                        onClick={() => addPhone(office.id)}
                        className="flex items-center gap-1 text-xs text-[#006064] hover:text-[#C9972B] font-medium transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Telefon Ekle
                      </button>
                    </div>
                    <div className="space-y-2">
                      {office.phones.map((phone, pi) => (
                        <div key={pi} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={phone.label}
                            onChange={(e) => updatePhone(office.id, pi, { label: e.target.value })}
                            placeholder="Etiket (Merkez, Depo...)"
                            className="w-36 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40"
                          />
                          <input
                            type="text"
                            value={phone.number}
                            onChange={(e) => updatePhone(office.id, pi, { number: e.target.value })}
                            placeholder="+90 000 000 00 00"
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40"
                          />
                          <button type="button" onClick={() => removePhone(office.id, pi)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active toggle */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`relative w-10 h-5 rounded-full transition-colors ${office.active ? "bg-[#006064]" : "bg-slate-300 dark:bg-slate-600"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${office.active ? "translate-x-5" : "translate-x-0.5"}`} />
                      <input type="checkbox" className="sr-only" checked={office.active} onChange={(e) => updateOffice(office.id, { active: e.target.checked })} />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {office.active ? "Aktif — sayfada görünür" : "Pasif — gizli"}
                    </span>
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addOffice}
        className="mt-4 flex items-center gap-2 w-full px-5 py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-[#006064] hover:text-[#006064] transition-all text-sm font-medium justify-center"
      >
        <Plus className="w-4 h-4" />
        Yeni Lokasyon Ekle
      </button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9972B]/40 focus:border-[#C9972B]"
      />
    </div>
  );
}
