import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // alleen voor demo, gebruik serverproxy in productie
});

export async function askAI(message: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: message }],
  });

  return response.choices[0].message?.content || "Response Error";
}
