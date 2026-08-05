/**
 * Ortak AI tamamlama katmanı — birincil sağlayıcı XAI (Grok), kredi biterse veya
 * hata alınırsa otomatik olarak OpenRouter'a düşer. Tüm admin/AI route'ları
 * doğrudan api.x.ai'ye fetch atmak yerine bu modülü kullanmalı, tek noktadan
 * yedekli çalışır.
 */

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export interface CompleteOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
}

export interface CompleteResult {
  content: string;
  provider: "xai" | "openrouter";
  model: string;
}

const XAI_MODEL = "grok-3";
const OPENROUTER_FALLBACK_MODEL = process.env.OPENROUTER_FALLBACK_MODEL || "openai/gpt-4o-mini";

function buildBody(model: string, opts: CompleteOptions, extra?: Record<string, unknown>) {
  return {
    model,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.3,
    ...(opts.maxTokens ? { max_tokens: opts.maxTokens } : {}),
    ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    ...extra,
  };
}

async function callXai(opts: CompleteOptions): Promise<CompleteResult> {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error("XAI_API_KEY tanımlı değil");

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(buildBody(XAI_MODEL, opts)),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`XAI ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("XAI: boş yanıt döndü");
  return { content, provider: "xai", model: XAI_MODEL };
}

async function callOpenRouter(opts: CompleteOptions): Promise<CompleteResult> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY tanımlı değil");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "HTTP-Referer": "https://camiihalisi.com",
      "X-Title": "Asil Hali Admin AI",
    },
    body: JSON.stringify(buildBody(OPENROUTER_FALLBACK_MODEL, opts)),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter: boş yanıt döndü");
  return { content, provider: "openrouter", model: OPENROUTER_FALLBACK_MODEL };
}

/** XAI'yi dener, başarısız olursa (kredi/limit/hata) OpenRouter'a düşer. */
export async function aiComplete(opts: CompleteOptions): Promise<CompleteResult> {
  const errors: string[] = [];
  try {
    return await callXai(opts);
  } catch (e) {
    errors.push(String(e instanceof Error ? e.message : e));
  }
  try {
    return await callOpenRouter(opts);
  } catch (e) {
    errors.push(String(e instanceof Error ? e.message : e));
  }
  throw new Error(`Tüm AI sağlayıcıları başarısız oldu: ${errors.join(" | ")}`);
}

export interface CompleteStreamResult {
  body: ReadableStream<Uint8Array>;
  provider: "xai" | "openrouter";
  model: string;
}

/**
 * Streaming (SSE) tamamlama — XAI ve OpenRouter aynı OpenAI-uyumlu delta formatını
 * kullandığı için çağıran taraf hangi sağlayıcının döndüğünü bilmeden aynı
 * ayrıştırma mantığını kullanabilir.
 */
export async function aiCompleteStream(opts: CompleteOptions): Promise<CompleteStreamResult> {
  const errors: string[] = [];

  const xaiKey = process.env.XAI_API_KEY;
  if (xaiKey) {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${xaiKey}` },
      body: JSON.stringify(buildBody(XAI_MODEL, opts, { stream: true })),
    });
    if (res.ok && res.body) {
      return { body: res.body, provider: "xai", model: XAI_MODEL };
    }
    const text = await res.text().catch(() => "");
    errors.push(`XAI ${res.status}: ${text.slice(0, 300)}`);
  } else {
    errors.push("XAI_API_KEY tanımlı değil");
  }

  const orKey = process.env.OPENROUTER_API_KEY;
  if (orKey) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${orKey}`,
        "HTTP-Referer": "https://camiihalisi.com",
        "X-Title": "Asil Hali Admin AI",
      },
      body: JSON.stringify(buildBody(OPENROUTER_FALLBACK_MODEL, opts, { stream: true })),
    });
    if (res.ok && res.body) {
      return { body: res.body, provider: "openrouter", model: OPENROUTER_FALLBACK_MODEL };
    }
    const text = await res.text().catch(() => "");
    errors.push(`OpenRouter ${res.status}: ${text.slice(0, 300)}`);
  } else {
    errors.push("OPENROUTER_API_KEY tanımlı değil");
  }

  throw new Error(`Tüm AI sağlayıcıları başarısız oldu: ${errors.join(" | ")}`);
}
