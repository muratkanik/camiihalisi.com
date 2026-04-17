import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Genel web tarayıcıları
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login", "/api/"],
      },
      // OpenAI / ChatGPT
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      // Anthropic / Claude
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      // Google AI / Gemini
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      // Perplexity
      { userAgent: "PerplexityBot", allow: "/" },
      // Microsoft Bing AI / Copilot
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "BingPreview", allow: "/" },
      // Meta AI
      { userAgent: "FacebookBot", allow: "/" },
      // Common Crawl (eğitim verisi)
      { userAgent: "CCBot", allow: "/" },
      // Cohere
      { userAgent: "cohere-ai", allow: "/" },
    ],
    sitemap: "https://camiihalisi.com/sitemap.xml",
    host: "https://camiihalisi.com",
  };
}
