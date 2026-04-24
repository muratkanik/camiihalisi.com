"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Phone, Mail, Building2, MessageSquare, User, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  open: boolean;
  onClose: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\d\s\+\-\(\)]{7,}$/;

export default function TeklifFormModal({ open, onClose }: Props) {
  const t = useTranslations("quote");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", mosque: "", message: "", type: "teklif",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus trap + scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ESC ile kapat
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("nameRequired");
    if (!form.phone.trim()) {
      e.phone = t("phoneRequired");
    } else if (!PHONE_RE.test(form.phone.trim())) {
      e.phone = t("phoneInvalid");
    }
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) {
      e.email = t("emailInvalid");
    }
    if (!form.message.trim()) e.message = t("messageRequired");
    return e;
  }

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? t("connectionError"));
      } else {
        setSubmitted(true);
      }
    } catch {
      setServerError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm({ name: "", email: "", phone: "", mosque: "", message: "", type: "teklif" });
    setErrors({});
    setSubmitted(false);
    setServerError("");
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-label={t("title")}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal kutusu */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Başlık */}
        <div className="bg-[#0097A7] px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t("title")}
            </h2>
            <p className="text-white/70 text-sm mt-0.5">{t("subtitle")}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/15 transition-colors"
            aria-label={t("close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* İçerik */}
        <div className="overflow-y-auto flex-1">
          {submitted ? (
            /* Başarı ekranı */
            <div className="flex flex-col items-center justify-center py-14 px-8 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#E0F7FA] flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-[#0097A7]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t("successTitle")}
              </h3>
              <p className="text-sm text-[#6B6355] leading-relaxed max-w-xs">
                {t("successText")}
              </p>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleReset}
                  className="btn btn-outline-dark text-sm !py-2 !px-4"
                >
                  {t("newRequest")}
                </button>
                <button
                  onClick={onClose}
                  className="btn btn-primary text-sm !py-2 !px-4"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} noValidate className="px-6 py-5 flex flex-col gap-4">

              {/* İstek tipi */}
              <div className="flex gap-2">
                {[
                  { value: "teklif", label: t("typeQuote") },
                  { value: "bilgi",  label: t("typeInfo") },
                  { value: "diger",  label: t("typeOther") },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange("type", opt.value)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      form.type === opt.value
                        ? "bg-[#0097A7] text-white border-[#0097A7]"
                        : "bg-white text-[#1A1A1A] border-[#B2EBF2] hover:border-[#0097A7]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Ad Soyad */}
              <Field
                label={t("name")}
                required
                requiredLabel={t("required")}
                icon={<User className="w-4 h-4" />}
                error={errors.name}
              >
                <input
                  ref={firstInputRef}
                  type="text"
                  placeholder={t("namePlaceholder")}
                  value={form.name}
                  onChange={e => handleChange("name", e.target.value)}
                  className={inputCls(!!errors.name)}
                  autoComplete="name"
                />
              </Field>

              {/* Telefon */}
              <Field
                label={t("phone")}
                required
                requiredLabel={t("required")}
                icon={<Phone className="w-4 h-4" />}
                error={errors.phone}
              >
                <input
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  value={form.phone}
                  onChange={e => handleChange("phone", e.target.value)}
                  className={inputCls(!!errors.phone)}
                  autoComplete="tel"
                />
              </Field>

              {/* E-posta */}
              <Field
                label={t("email")}
                icon={<Mail className="w-4 h-4" />}
                error={errors.email}
                hint={!errors.email ? t("emailHint") : undefined}
              >
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={form.email}
                  onChange={e => handleChange("email", e.target.value)}
                  className={inputCls(!!errors.email)}
                  autoComplete="email"
                />
              </Field>

              {/* Cami / Proje */}
              <Field
                label={t("mosque")}
                icon={<Building2 className="w-4 h-4" />}
              >
                <input
                  type="text"
                  placeholder={t("mosquePlaceholder")}
                  value={form.mosque}
                  onChange={e => handleChange("mosque", e.target.value)}
                  className={inputCls(false)}
                />
              </Field>

              {/* Mesaj */}
              <Field
                label={t("message")}
                required
                requiredLabel={t("required")}
                icon={<MessageSquare className="w-4 h-4" />}
                error={errors.message}
              >
                <textarea
                  rows={3}
                  placeholder={t("messagePlaceholder")}
                  value={form.message}
                  onChange={e => handleChange("message", e.target.value)}
                  className={`${inputCls(!!errors.message)} resize-none`}
                />
              </Field>

              {/* Sunucu hatası */}
              {serverError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{serverError}</p>
                </div>
              )}

              {/* Gönder */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full !py-3 text-base mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("sending")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    {t("send")}
                  </span>
                )}
              </button>

              <p className="text-[11px] text-[#6B6355]/70 text-center leading-relaxed">
                {t("privacy")}
              </p>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Yardımcı alt bileşenler ── */
function inputCls(hasError: boolean) {
  return `w-full px-3 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-[#0097A7]/30 ${
    hasError
      ? "border-red-400 bg-red-50 focus:border-red-400"
      : "border-[#B2EBF2] bg-white focus:border-[#0097A7]"
  }`;
}

function Field({
  label, required, requiredLabel, icon, error, hint, children,
}: {
  label: string;
  required?: boolean;
  requiredLabel?: string;
  icon?: React.ReactNode;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-[#1A1A1A]">
        {icon && <span className="text-[#0097A7]">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-0.5" title={requiredLabel}>*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-[11px] text-[#6B6355]/70">{hint}</p>
      )}
    </div>
  );
}
