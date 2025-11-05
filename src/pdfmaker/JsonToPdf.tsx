import { useState } from "react";
import { convertSurgeryJsonToAnalysis, type SurgeryJson } from "./convertFromSurgeryJson";
import { generateReportPdfFromJson } from "./generateReport";

function isSurgeryJson(x: unknown): x is SurgeryJson {
  if (typeof x !== "object" || x === null) return false;

  const o = x as Record<string, unknown>;

  const metadata = o.metadata;
  if (typeof metadata !== "object" || metadata === null) return false;

  const meta = metadata as Record<string, unknown>;
  if (typeof meta.fps !== "number") return false;

  const errors = o.errors;
  if (!Array.isArray(errors)) return false;

  return true;
}


export default function JsonToPdf() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <input
        type="file"
        accept="application/json"
        onChange={async (e) => {
          setError(null);
          const f = e.target.files?.[0];
          if (!f) return;

          try {
            const raw = JSON.parse(await f.text());
            if (!isSurgeryJson(raw)) {
              throw new Error("Invalid JSON structure: expected { metadata, errors }.");
            }

            const analysis = convertSurgeryJsonToAnalysis(raw);
            await generateReportPdfFromJson(analysis, {
              fileName: "surgery-video",
              title: "Surgical Feedback Report",
              organization: "KU Leuven",
              download: true,
              outputName: "surgery-feedback",
            });
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate PDF");
          } finally {
            e.currentTarget.value = "";
          }
        }}
      />
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
    </div>
  );
}
