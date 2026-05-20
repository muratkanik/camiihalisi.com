"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Save, Trash2, Edit2, Upload, Loader2, X } from "lucide-react";

export interface CatalogColor {
  id: string; 
  image: string; 
  hex: string;   
  name: string;  
}

export interface CatalogItem {
  id: string;
  categorySlug: string;
  code: string;
  title: string;
  badge: string;
  colors: CatalogColor[];
}

const CATEGORIES = [
  { value: "akrilik-cami-halisi", label: "Akrilik Cami Halısı" },
  { value: "yun-cami-halisi", label: "Yün Cami Halısı" },
  { value: "seccadeli-cami-halisi", label: "Seccadeli Cami Halısı" },
  { value: "saflı-cami-halisi", label: "Saflı Cami Halısı" },
  { value: "gobekli-cami-halisi", label: "Göbekli Cami Halısı" }
];

export default function KatalogAdminClient() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/katalog");
      const data = await res.json();
      if (data.items) {
        setItems(data.items);
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
      await fetch("/api/admin/katalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      alert("Başarıyla kaydedildi!");
    } catch (e) {
      alert("Hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  function handleAddNew() {
    const newItem: CatalogItem = {
      id: Date.now().toString(),
      categorySlug: CATEGORIES[0].value,
      code: "YENI-01",
      title: "Yeni Model",
      badge: "",
      colors: []
    };
    setItems([newItem, ...items]);
    setEditingItem(newItem);
  }

  function handleDelete(id: string) {
    if (!confirm("Bu modeli silmek istediğinize emin misiniz?")) return;
    setItems(items.filter(i => i.id !== id));
    if (editingItem?.id === id) setEditingItem(null);
  }

  function updateEditingItem(changes: Partial<CatalogItem>) {
    if (!editingItem) return;
    const updated = { ...editingItem, ...changes };
    setEditingItem(updated);
    setItems(items.map(i => i.id === updated.id ? updated : i));
  }

  async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/galeri/upload", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.url;
  }

  if (loading) {
    return <div className="text-center py-10">Yükleniyor...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sol Panel: Liste */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col h-[800px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800 dark:text-white">Modeller</h2>
          <button onClick={handleAddNew} className="btn bg-[#0097A7] text-white hover:bg-[#007f8c] px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Ekle
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {items.map(item => (
            <div 
              key={item.id} 
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${editingItem?.id === item.id ? 'border-[#0097A7] bg-[#F0FDFE] dark:bg-[#0097A7]/10' : 'border-slate-200 dark:border-slate-800 hover:border-[#0097A7]/50'}`}
              onClick={() => setEditingItem(item)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-[#C9972B]">{item.code}</div>
                  <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{item.title}</div>
                  <div className="text-[10px] text-slate-500">{CATEGORIES.find(c => c.value === item.categorySlug)?.label}</div>
                  <div className="text-[10px] text-[#0097A7] mt-1">{item.colors.length} Renk Tanımlı</div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-8 text-sm text-slate-500">Henüz model eklenmemiş.</div>
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full btn bg-[#0097A7] text-white hover:bg-[#007f8c] py-2 rounded-xl flex justify-center items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Tüm Değişiklikleri Kaydet
          </button>
        </div>
      </div>

      {/* Sağ Panel: Düzenleme */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 h-[800px] overflow-y-auto">
        {editingItem ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-[#0097A7]/10 flex items-center justify-center text-[#0097A7]">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-800 dark:text-white">Model Düzenle: {editingItem.code}</h2>
                <p className="text-xs text-slate-500">Görselleri ve renk varyantlarını yönetin.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Model Kodu (örn. SAFLI-01)</label>
                <input 
                  type="text" 
                  value={editingItem.code} 
                  onChange={(e) => updateEditingItem({ code: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0097A7] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Model Adı (Title)</label>
                <input 
                  type="text" 
                  value={editingItem.title} 
                  onChange={(e) => updateEditingItem({ title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0097A7] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Kategori</label>
                <select 
                  value={editingItem.categorySlug}
                  onChange={(e) => updateEditingItem({ categorySlug: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0097A7] dark:text-white"
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Rozet (Opsiyonel - örn: Yeni)</label>
                <input 
                  type="text" 
                  value={editingItem.badge || ""} 
                  onChange={(e) => updateEditingItem({ badge: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0097A7] dark:text-white"
                />
              </div>
            </div>

            {/* Renk Varyantları */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">Renk Varyantları (Max 20)</h3>
                  <p className="text-xs text-slate-500">Mevcut: {editingItem.colors.length} / 20</p>
                </div>
                <button 
                  onClick={() => {
                    if (editingItem.colors.length >= 20) return alert("Maksimum 20 renk ekleyebilirsiniz.");
                    updateEditingItem({
                      colors: [...editingItem.colors, { id: `s${editingItem.colors.length + 1}-${Date.now()}`, hex: "#C9972B", name: "Yeni Renk", image: "" }]
                    });
                  }}
                  className="btn bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Renk Ekle
                </button>
              </div>

              <div className="space-y-3">
                {editingItem.colors.map((color, idx) => (
                  <div key={color.id} className="p-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl flex gap-4 items-start">
                    
                    {/* Görsel Yükleme Alanı */}
                    <div className="w-24 h-24 flex-shrink-0 bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg relative overflow-hidden flex items-center justify-center group">
                      {color.image ? (
                        <>
                          <Image src={color.image} alt="Color variant" fill className="object-cover" />
                          <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Upload className="w-5 h-5 text-white" />
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={async (e) => {
                                if (!e.target.files?.[0]) return;
                                try {
                                  const url = await uploadImage(e.target.files[0]);
                                  const newColors = [...editingItem.colors];
                                  newColors[idx].image = url;
                                  updateEditingItem({ colors: newColors });
                                } catch(err) {
                                  alert("Görsel yüklenemedi.");
                                }
                              }}
                            />
                          </label>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-[#0097A7] transition-colors">
                          <Upload className="w-6 h-6 mb-1" />
                          <span className="text-[10px] font-medium">Yükle</span>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={async (e) => {
                              if (!e.target.files?.[0]) return;
                              try {
                                const url = await uploadImage(e.target.files[0]);
                                const newColors = [...editingItem.colors];
                                newColors[idx].image = url;
                                updateEditingItem({ colors: newColors });
                              } catch(err) {
                                alert("Görsel yüklenemedi.");
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>

                    {/* Renk Bilgileri */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Renk Adı</label>
                        <input 
                          type="text" 
                          value={color.name}
                          onChange={(e) => {
                            const newColors = [...editingItem.colors];
                            newColors[idx].name = e.target.value;
                            updateEditingItem({ colors: newColors });
                          }}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#0097A7] dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">HEX Kodu (Tıklayıp Seçin)</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={color.hex}
                            onChange={(e) => {
                              const newColors = [...editingItem.colors];
                              newColors[idx].hex = e.target.value;
                              updateEditingItem({ colors: newColors });
                            }}
                            className="w-10 h-8 rounded cursor-pointer border-0 p-0"
                          />
                          <input 
                            type="text" 
                            value={color.hex}
                            onChange={(e) => {
                              const newColors = [...editingItem.colors];
                              newColors[idx].hex = e.target.value;
                              updateEditingItem({ colors: newColors });
                            }}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#0097A7] dark:text-white uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        const newColors = [...editingItem.colors];
                        newColors.splice(idx, 1);
                        updateEditingItem({ colors: newColors });
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg mt-5"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {editingItem.colors.length === 0 && (
                  <div className="text-center py-6 text-sm text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                    Henüz renk eklenmemiş. Lütfen "Renk Ekle" butonuna tıklayarak ilk rengi oluşturun.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Düzenlemek için sol menüden bir model seçin veya yeni ekleyin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
