import { AnalysisResultSchema, type AnalysisResult } from "./types";
import ReportDoc from "./ReportDoc";
import { pdf } from "@react-pdf/renderer";

export type GenerateOptions = {
  fileName?: string;
  title?: string;
  organization?: string;
  download?: boolean;   // default true
  outputName?: string;  // zonder .pdf
};

export async function generateReportPdfFromJson(
  jsonInput: unknown,
  opts: GenerateOptions = {}
): Promise<Blob> {
  const analysis: AnalysisResult = AnalysisResultSchema.parse(jsonInput);

  const base =
    (opts.outputName ?? (opts.fileName ? stripExt(opts.fileName) + "-feedback" : "report-feedback")) + ".pdf";

  const doc = (
    <ReportDoc
      fileName={opts.fileName}
      analysis={analysis}
      title={opts.title}
      organization={opts.organization}
    />
  );

  const blob = await pdf(doc).toBlob();

  if (opts.download ?? true) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = base;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return blob;
}

function stripExt(name: string) {
  const i = name.lastIndexOf(".");
  return i > 0 ? name.slice(0, i) : name;
}
