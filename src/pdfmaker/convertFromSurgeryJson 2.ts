import type { AnalysisResult, FeedbackItem } from "./types";

/** JSON-structuur van jullie bronbestand. */
export type SurgeryJson = {
  metadata: {
    total_frames: number;
    start_frame: number;
    end_frame: number;
    fps: number;
    description?: string;
  };
  errors: Array<{
    range: { start: number; end: number };
    type: string;
    explanation: string;
    example_image?: string; // bv. "742.jpg"
  }>;
};

/**
 * Map "742.jpg" -> gebundelde URL (werkt in dev + build).
 * Relatief pad is vanuit dit bestand (pdfmaker/ → assets/images/*).
 */
const imagesMap: Record<string, string> = (() => {
  const mods = import.meta.glob("../assets/images/*", {
    eager: true,
    as: "url",
  }) as Record<string, string>;
  const out: Record<string, string> = {};
  for (const fullPath in mods) {
    const url = mods[fullPath];
    const file = fullPath.split("/").pop()!; // "742.jpg"
    out[file] = url;
  }
  return out;
})();

/**
 * Converteert jullie surgery JSON naar het generieke AnalysisResult.
 * - timestamp = midden van frame-range, tov start_frame, omgerekend met fps
 * - duration = total_frames / fps
 * - frameDataUrl = genormaliseerde absolute URL
 */
export function convertSurgeryJsonToAnalysis(src: SurgeryJson): AnalysisResult {
  const { total_frames, start_frame, fps } = src.metadata;

  const durationMs = Math.round((total_frames / fps) * 1000);
  const toMs = (frame: number) =>
    Math.max(0, Math.round(((frame - start_frame) / fps) * 1000));

  const items: FeedbackItem[] = src.errors.map((e, idx) => {
    const mid = Math.round((e.range.start + e.range.end) / 2);

    // Vite geeft vaak root-relatieve paden terug (bv. /assets/742-abc.jpg)
    // Normaliseer naar absolute URL zodat react-pdf overal kan fetchen.
    const rawUrl = e.example_image ? imagesMap[e.example_image] : undefined;
    const frameUrl =
      rawUrl &&
      (rawUrl.startsWith("http://") ||
        rawUrl.startsWith("https://") ||
        rawUrl.startsWith("data:") ||
        rawUrl.startsWith("blob:"))
        ? rawUrl
        : rawUrl
        ? new URL(rawUrl, window.location.origin).toString()
        : undefined;

    if (e.example_image && !frameUrl) {
      // Niet fataal; helpt tijdens dev bij mismatch in bestandsnamen.
      console.warn(
        `[pdf] Image not found in src/assets/images/: ${e.example_image}`
      );
    }

    return {
      id: `err-${idx}-${e.type}-${e.range.start}-${e.range.end}`,
      timestampMs: toMs(mid),
      label: e.type,
      severity: inferSeverity(e.type),
      explanation: e.explanation,
      rootCause:
        inferRootCause(e.type) ?? "Context-related human/motion factor",
      textbookExample: makeTextbookExample(e.type),
      frameDataUrl: frameUrl, // <-- absolute URL
      disputable: false,
    };
  });

  return {
    durationMs,
    createdAt: new Date().toISOString(),
    items,
  };
}

function inferSeverity(t: string): "low" | "med" | "high" {
  const s = t.toLowerCase();
  if (s.includes("collision") || s.includes("instability")) return "high";
  if (s.includes("tension") || s.includes("misalignment")) return "med";
  return "low";
}

function inferRootCause(t: string): string | undefined {
  const s = t.toLowerCase();
  if (s.includes("misalignment")) return "Grip angle / visual alignment drift";
  if (s.includes("tension")) return "Overcompensation / force control under stress";
  if (s.includes("collision")) return "Tool path planning + spatial awareness lapse";
  if (s.includes("camera")) return "Hand-induced shake / inadequate stabilization";
  return undefined;
}

function makeTextbookExample(t: string): string {
  const s = t.toLowerCase();
  if (s.includes("misalignment"))
    return "Align needle at recommended angle; confirm plane before insertion.";
  if (s.includes("tension"))
    return "Tighten until tissue apposition; avoid blanching; use two-step tensioning.";
  if (s.includes("collision"))
    return "Maintain instrument separation; plan path and announce handovers.";
  if (s.includes("camera"))
    return "Stabilize camera with two-point support; pause tool motion during reframe.";
  return "Follow the standard procedural steps with alignment/force checks at each phase.";
}
