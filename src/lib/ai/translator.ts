export async function handleAIGenerateTranslations(contentTR: any, targetLanguages: string[]) {
  const translations: any = {};
  
  for (const lang of targetLanguages) {
    const prompt = `Translate the following JSON content strictly into ${lang}. Keep the exact JSON structure and keys, only translate the values.\n\n${JSON.stringify(contentTR, null, 2)}`;
    
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: "grok-3",
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    try {
      translations[lang] = JSON.parse(data.choices[0].message.content);
    } catch {
      translations[lang] = null;
    }
  }

  return translations;
}
