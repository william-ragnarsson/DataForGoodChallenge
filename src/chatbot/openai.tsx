import OpenAI from "openai";

let client: OpenAI | null = null;

/**
 * Built on first use rather than at module scope.
 *
 * The OpenAI constructor throws when no key is present, and at module scope
 * that threw while the /nora chunk was still being imported — taking the whole
 * route down with a blank screen before anything rendered. Deferring it means
 * a missing key only fails the chat request itself, which chatbot.tsx already
 * catches and reports in the thread.
 */
function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // alleen voor demo, gebruik serverproxy in productie
    });
  }
  return client;
}

export async function askAI(message: string): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: message }],
  });

  return response.choices[0].message?.content || "Response Error";
}
