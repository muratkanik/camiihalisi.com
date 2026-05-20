"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Save, Trash2, Upload, Loader2, FileText, Image as ImageIcon } from "lucide-react";

interface SpecRow {
  id: string;
  ozellik: string;
  deger: string;
  aciklama: string;
}

interface MaterialRow {
  id: string;
  malzeme: string;
  hav: string;
  agirlik: string;
  omur: string;
  yangin: string;
  garanti: string;
}

interface Certificate {
  id: string;
  name: string;
  fileUrl: string;
  type: "pdf" | "image";
}

interface Award {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface TeknikData {
  specsTable: SpecRow[];
  materialSpecs: MaterialRow[];
  certificates: Certificate[];
  awards: Award[];
}

export default function TeknikAdminClient() {
  const [data, setData] = useState<TeknikData>({
    specsTable: [], materialSpecs: [], certificates: [], awards: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "materials" | "certs" | "awards">("specs");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/admin/teknik");
      const json = await res.json();
      if (json.data) {
        // assign unique IDs if not present (migration from static)
        const d = json.data;
        d.specsTable = d.specsTable.map((x: any) => ({ ...x, id: x.id || Date.now() + Math.random().toString() }));
        d.materialSpecs = d.materialSpecs.map((x: any) => ({ ...x, id: x.id || Date.now() + Math.random().toString() }));
        d.certificates = d.certificates || [];
        d.awards = d.awards || [];
        setData(d as TeknikData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/admin/teknik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      alert("Başarıyla kaydedildi!");
    } catch (e) {
      alert("Hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/galeri/upload", {
      method: "POST",
      body: fd,
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json.url;
  }

  if (loading) return <div className="py-10 text-center">Yükleniyor...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <button onClick={() => setActiveTab("specs")} className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "specs" ? "border-b-2 border-[#0097A7] text-[#0097A7]" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>Genel Özellikler</button>
        <button onClick={() => setActiveTab("materials")} className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "materials" ? "border-b-2 border-[#0097A7] text-[#0097A7]" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>Malzeme Tablosu</button>
        <button onClick={() => setActiveTab("certs")} className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "certs" ? "border-b-2 border-[#0097A7] text-[#0097A7]" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>ISO & Sertifikalar</button>
        <button onClick={() => setActiveTab("awards")} className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === "awards" ? "border-b-2 border-[#0097A7] text-[#0097A7]" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>Başarı Ödülleri</button>
      </div>

      <div className="p-6 h-[600px] overflow-y-auto bg-slate-50 dark:bg-slate-950/50">
        
        {/* SPECS TAB */}
        {activeTab === "specs" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white">Genel Teknik Özellikler</h3>
              <button onClick={() => setData({ ...data, specsTable: [...data.specsTable, { id: Date.now().toString(), ozellik: "", deger: "", aciklama: "" }] })} className="btn bg-[#0097A7] text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Satır Ekle
              </button>
            </div>
            {data.specsTable.map((row, idx) => (
              <div key={row.id} className="grid grid-cols-12 gap-3 items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="col-span-3">
                  <input type="text" placeholder="Özellik" value={row.ozellik} onChange={(e) => { const n = [...data.specsTable]; n[idx].ozellik = e.target.value; setData({...data, specsTable: n}) }} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-sm" />
                </div>
                <div className="col-span-4">
                  <input type="text" placeholder="Değer" value={row.deger} onChange={(e) => { const n = [...data.specsTable]; n[idx].deger = e.target.value; setData({...data, specsTable: n}) }} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-sm" />
                </div>
                <div className="col-span-4">
                  <input type="text" placeholder="Açıklama" value={row.aciklama} onChange={(e) => { const n = [...data.specsTable]; n[idx].aciklama = e.target.value; setData({...data, specsTable: n}) }} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-sm" />
                </div>
                <div className="col-span-1 flex justify-end">
                  <button onClick={() => { const n = [...data.specsTable]; n.splice(idx, 1); setData({...data, specsTable: n}) }} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MATERIALS TAB */}
        {activeTab === "materials" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white">Malzeme Karşılaştırma</h3>
              <button onClick={() => setData({ ...data, materialSpecs: [...data.materialSpecs, { id: Date.now().toString(), malzeme: "", hav: "", agirlik: "", omur: "", yangin: "", garanti: "" }] })} className="btn bg-[#0097A7] text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Satır Ekle
              </button>
            </div>
            {data.materialSpecs.map((row, idx) => (
              <div key={row.id} className="grid grid-cols-7 gap-2 items-center bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <input type="text" placeholder="Malzeme" value={row.malzeme} onChange={(e) => { const n = [...data.materialSpecs]; n[idx].malzeme = e.target.value; setData({...data, materialSpecs: n}) }} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-xs" />
                <input type="text" placeholder="Hav" value={row.hav} onChange={(e) => { const n = [...data.materialSpecs]; n[idx].hav = e.target.value; setData({...data, materialSpecs: n}) }} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-xs" />
                <input type="text" placeholder="Ağırlık" value={row.agirlik} onChange={(e) => { const n = [...data.materialSpecs]; n[idx].agirlik = e.target.value; setData({...data, materialSpecs: n}) }} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-xs" />
                <input type="text" placeholder="Ömür" value={row.omur} onChange={(e) => { const n = [...data.materialSpecs]; n[idx].omur = e.target.value; setData({...data, materialSpecs: n}) }} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-xs" />
                <input type="text" placeholder="Yangın" value={row.yangin} onChange={(e) => { const n = [...data.materialSpecs]; n[idx].yangin = e.target.value; setData({...data, materialSpecs: n}) }} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-xs" />
                <input type="text" placeholder="Garanti" value={row.garanti} onChange={(e) => { const n = [...data.materialSpecs]; n[idx].garanti = e.target.value; setData({...data, materialSpecs: n}) }} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1.5 text-xs" />
                <button onClick={() => { const n = [...data.materialSpecs]; n.splice(idx, 1); setData({...data, materialSpecs: n}) }} className="p-1.5 text-red-500 hover:bg-red-50 rounded ml-auto"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {activeTab === "certs" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white">ISO & Diğer Sertifikalar</h3>
              <button onClick={() => setData({ ...data, certificates: [...data.certificates, { id: Date.now().toString(), name: "Yeni Sertifika", fileUrl: "", type: "pdf" }] })} className="btn bg-[#0097A7] text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Sertifika Ekle
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.certificates.map((cert, idx) => (
                <div key={cert.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col">
                  <div className="flex justify-between mb-3">
                    <input type="text" value={cert.name} onChange={(e) => { const n = [...data.certificates]; n[idx].name = e.target.value; setData({...data, certificates: n}) }} className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm font-semibold text-[#0097A7] w-full mr-2" />
                    <button onClick={() => { const n = [...data.certificates]; n.splice(idx, 1); setData({...data, certificates: n}) }} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-4 bg-slate-50 relative group min-h-[120px]">
                    {cert.fileUrl ? (
                      <div className="text-center">
                        {cert.type === "pdf" ? <FileText className="w-10 h-10 mx-auto text-red-500 mb-2" /> : <ImageIcon className="w-10 h-10 mx-auto text-blue-500 mb-2" />}
                        <span className="text-xs text-slate-500 block truncate w-32 mx-auto">Yüklendi</span>
                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                          <span className="text-white text-xs font-semibold">Değiştir</span>
                          <input type="file" className="hidden" accept=".pdf,image/*" onChange={async (e) => {
                            if (!e.target.files?.[0]) return;
                            try {
                              const file = e.target.files[0];
                              const url = await uploadFile(file);
                              const n = [...data.certificates];
                              n[idx].fileUrl = url;
                              n[idx].type = file.type === "application/pdf" ? "pdf" : "image";
                              setData({...data, certificates: n});
                            } catch { alert("Yükleme başarısız.") }
                          }}/>
                        </label>
                      </div>
                    ) : (
                      <label className="cursor-pointer text-center text-slate-400 hover:text-[#0097A7] transition-colors w-full h-full flex flex-col items-center justify-center">
                        <Upload className="w-6 h-6 mb-1 mx-auto" />
                        <span className="text-xs font-medium">PDF/Resim Yükle</span>
                        <input type="file" className="hidden" accept=".pdf,image/*" onChange={async (e) => {
                          if (!e.target.files?.[0]) return;
                          try {
                            const file = e.target.files[0];
                            const url = await uploadFile(file);
                            const n = [...data.certificates];
                            n[idx].fileUrl = url;
                            n[idx].type = file.type === "application/pdf" ? "pdf" : "image";
                            setData({...data, certificates: n});
                          } catch { alert("Yükleme başarısız.") }
                        }}/>
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AWARDS TAB */}
        {activeTab === "awards" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white">Başarı Ödülleri</h3>
              <button onClick={() => setData({ ...data, awards: [...data.awards, { id: Date.now().toString(), name: "Yeni Ödül", image: "", description: "" }] })} className="btn bg-[#0097A7] text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Ödül Ekle
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.awards.map((award, idx) => (
                <div key={award.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <input type="text" placeholder="Ödül Adı" value={award.name} onChange={(e) => { const n = [...data.awards]; n[idx].name = e.target.value; setData({...data, awards: n}) }} className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm font-semibold w-full mr-2" />
                    <button onClick={() => { const n = [...data.awards]; n.splice(idx, 1); setData({...data, awards: n}) }} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="h-32 bg-slate-100 border-2 border-dashed border-slate-200 rounded-lg relative flex items-center justify-center group overflow-hidden">
                    {award.image ? (
                      <>
                        <Image src={award.image} alt="Ödül" fill className="object-cover" />
                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Upload className="w-6 h-6 text-white" />
                          <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                            if (!e.target.files?.[0]) return;
                            try {
                              const url = await uploadFile(e.target.files[0]);
                              const n = [...data.awards];
                              n[idx].image = url;
                              setData({...data, awards: n});
                            } catch { alert("Yükleme başarısız.") }
                          }}/>
                        </label>
                      </>
                    ) : (
                      <label className="cursor-pointer text-slate-400 hover:text-[#0097A7] w-full h-full flex flex-col items-center justify-center">
                        <Upload className="w-6 h-6 mb-1" />
                        <span className="text-xs">Görsel Yükle</span>
                        <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                          if (!e.target.files?.[0]) return;
                          try {
                            const url = await uploadFile(e.target.files[0]);
                            const n = [...data.awards];
                            n[idx].image = url;
                            setData({...data, awards: n});
                          } catch { alert("Yükleme başarısız.") }
                        }}/>
                      </label>
                    )}
                  </div>
                  
                  <textarea placeholder="Ödül Açıklaması (Opsiyonel)" value={award.description} onChange={(e) => { const n = [...data.awards]; n[idx].description = e.target.value; setData({...data, awards: n}) }} className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs resize-none" rows={2} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn bg-[#0097A7] text-white hover:bg-[#007f8c] py-2 px-6 rounded-xl flex items-center gap-2">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
}
