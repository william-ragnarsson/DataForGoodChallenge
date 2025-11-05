import { z } from "zod";

/**
 * We accepteren:
 * - absolute http(s) URLs
 * - blob: en data: URLs
 * - root-relatieve paden (bv. /assets/742-abc.jpg) die Vite genereert
 */
const UrlLike = z
  .string()
  .refine(
    (s) =>
      typeof s === "string" &&
      (s.startsWith("http://") ||
        s.startsWith("https://") ||
        s.startsWith("blob:") ||
        s.startsWith("data:") ||
        s.startsWith("/")),
    { message: "Invalid URL or path" }
  );

export const FeedbackItemSchema = z.object({
  id: z.string(),
  timestampMs: z.number().int().nonnegative(),
  label: z.string(),
  severity: z.enum(["low", "med", "high"]),
  explanation: z.string(),
  rootCause: z.string(),
  textbookExample: z.string(),
  frameDataUrl: UrlLike.optional(), // <-- aangepast
  disputable: z.boolean().optional(),
});

export const AnalysisResultSchema = z.object({
  durationMs: z.number().int().positive(),
  createdAt: z.string(), // ISO
  items: z.array(FeedbackItemSchema).min(1),
});

export type FeedbackItem = z.infer<typeof FeedbackItemSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
