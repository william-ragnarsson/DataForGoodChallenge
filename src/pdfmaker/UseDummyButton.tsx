import { useState } from "react";
import dummy from "../assets/json-files/dummy-file.json";
import { convertSurgeryJsonToAnalysis, type SurgeryJson } from "../pdfmaker/convertFromSurgeryJson";
import { generateReportPdfFromJson } from "../pdfmaker/generateReport";

export default function UseDummyButton() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    setErr(null);
    try {
      // 1) Converteren
      const analysis = convertSurgeryJsonToAnalysis(dummy as SurgeryJson);

      // 2) Blob genereren (we downloaden zelf hieronder voor beste browser-compat)
      const blob = await generateReportPdfFromJson(analysis, {
        title: "Demo Report",
        outputName: "demo-feedback",
        download: false, // we downloaden handmatig (betere controle/fallback)
      });

      // 3) Download forceren (Safari/Firefox/Chrome compat)
      const url = URL.createObjectURL(blob);

      // Probeer eerst een verborgen <a> klik
      const a = document.createElement("a");
      a.href = url;
      a.download = "demo-feedback.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Fallback (sommige Safari versies)
      setTimeout(() => {
        URL.revokeObjectURL(url);
        // Als om één of andere reden de download niet startte, probeer open:
        // (meestal niet nodig, maar kan helpen)
        // window.open(url, "_blank");
      }, 0);
    } catch (e) {
      console.error(e);
      setErr(e instanceof Error ? e.message : "Failed to generate PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #ddd",
          cursor: busy ? "not-allowed" : "pointer",
          background: busy ? "#eee" : "white",
        }}
      >
        {busy ? "Preparing PDF…" : "Use dummy.json"}
      </button>
      {err && <small style={{ color: "crimson" }}>{err}</small>}
    </div>
  );
}
