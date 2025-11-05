import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { AnalysisResult } from "./types";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 11, fontFamily: "Helvetica" },
  header: { marginBottom: 10 },
  h1: { fontSize: 18, marginBottom: 4 },
  muted: { color: "#666" },
  h2: { fontSize: 14, marginTop: 14, marginBottom: 6 },
  item: { marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  chipRow: { marginTop: 2, flexDirection: "row", gap: 10 },
  chip: { fontSize: 9, color: "#374151" },
  img: { width: 180, height: 100, marginTop: 6 },
  footer: { position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", fontSize: 10, color: "#6b7280" },
  badge: { fontSize: 10, color: "#b91c1c" },
});

function seconds(ms: number) {
  return Math.round(ms / 1000);
}

export default function ReportDoc({
  fileName,
  analysis,
  title = "Video Feedback Report",
  organization,
}: {
  fileName?: string;
  analysis: AnalysisResult;
  title?: string;
  organization?: string;
}) {
  const created = new Date(analysis.createdAt);
  const counts = {
    total: analysis.items.length,
    high: analysis.items.filter((i) => i.severity === "high").length,
    med: analysis.items.filter((i) => i.severity === "med").length,
    low: analysis.items.filter((i) => i.severity === "low").length,
    disputed: analysis.items.filter((i) => i.disputable).length,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.h1}>{title}</Text>
          <Text style={styles.muted}>
            File: {fileName ?? "unnamed"} • Created: {format(created, "PPpp")}
            {organization ? ` • ${organization}` : ""}
          </Text>
        </View>

        <Text style={styles.h2}>Summary</Text>
        <Text>Total duration: {seconds(analysis.durationMs)}s</Text>
        <Text>
          Findings: {counts.total} (High {counts.high} • Med {counts.med} • Low {counts.low})
        </Text>
        {counts.disputed > 0 ? <Text>Disputed: {counts.disputed}</Text> : null}

        {counts.disputed > 0 ? (
          <View>
            <Text style={styles.h2}>Disputed items</Text>
            {analysis.items
              .filter((i) => i.disputable)
              .map((it, idx) => (
                <View key={`d-${it.id}`} style={styles.item} wrap={false}>
                  <Text>
                    {idx + 1}. {it.label} <Text style={styles.badge}>DISPUTED</Text>
                  </Text>
                  <Text style={styles.muted}>Timestamp: {seconds(it.timestampMs)}s</Text>
                  <Text>Why (root cause): {it.rootCause}</Text>
                  <Text>Explanation: {it.explanation}</Text>
                  <Text>Textbook example: {it.textbookExample}</Text>
                  {it.frameDataUrl ? <Image src={it.frameDataUrl} style={styles.img} /> : null}
                </View>
              ))}
          </View>
        ) : null}

        <Text style={styles.h2}>Key moments</Text>
        {analysis.items.map((it, idx) => (
          <View key={it.id} style={styles.item} wrap={false}>
            <Text>
              {idx + 1}. {it.label}
            </Text>
            <View style={styles.chipRow}>
              <Text style={styles.chip}>Severity: {it.severity.toUpperCase()}</Text>
              <Text style={styles.chip}>Timestamp: {seconds(it.timestampMs)}s</Text>
              {it.disputable ? <Text style={styles.badge}>DISPUTED</Text> : null}
            </View>
            <Text>Why (root cause): {it.rootCause}</Text>
            <Text>Explanation: {it.explanation}</Text>
            <Text>Textbook example: {it.textbookExample}</Text>
            {it.frameDataUrl ? <Image src={it.frameDataUrl} style={styles.img} /> : null}
          </View>
        ))}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}
