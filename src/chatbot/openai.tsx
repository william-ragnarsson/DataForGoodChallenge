import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "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", // of process.env.OPENAI_API_KEY in Next.js
  dangerouslyAllowBrowser: true // alleen voor demo, gebruik serverproxy in productie
});

export async function askAI(message: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: message }],
  });

  return response.choices[0].message?.content || "Geen antwoord ontvangen.";
}
