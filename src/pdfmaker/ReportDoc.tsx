import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import type { AnalysisResult } from "./types";
import { format } from "date-fns";

/**
 * ORSI Academy branding — pas hier gerust aan als je exacte waarden hebt.
 * - primair: koel donkerblauw
 * - accent: frisse groenblauw tint
 * - grijs: neutrale UI-grijzen
 */
const BRAND = {
  logoSrc: "/orsi-logo.png",        // Zet bv. in /public/orsi-logo.png
  primary: "#0A2A5A",
  accent: "#00A6A6",
  text: "#111827",
  muted: "#6B7280",
  border: "#E5E7EB",
  softBg: "#F8FAFC",
};

const styles = StyleSheet.create({
  // Algemene pagina
  page: {
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 36,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: BRAND.text,
    backgroundColor: "#FFFFFF",
  },

  // Header met logo & titelbalk
  headerWrap: {
    marginBottom: 14,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 110,
    height: 28,
    objectFit: "contain",
  },
  headerBadge: {
    fontSize: 10,
    color: BRAND.primary,
  },
  titleBlock: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: BRAND.softBg,
    borderWidth: 1,
    borderColor: BRAND.border,
  },
  h1: { fontSize: 18, fontWeight: 700, color: BRAND.primary },
  subline: { marginTop: 3, color: BRAND.muted },

  // Secties
  h2: {
    fontSize: 13,
    marginTop: 16,
    marginBottom: 8,
    color: BRAND.primary,
  },
  divider: {
    height: 1,
    backgroundColor: BRAND.border,
    marginVertical: 8,
  },

  // Info grid (samenvatting bovenaan)
  infoGrid: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  infoCard: {
    flexGrow: 1,
    minWidth: 160,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BRAND.border,
    backgroundColor: "#FFFFFF",
  },
  infoLabel: { fontSize: 9, color: BRAND.muted, marginBottom: 2 },
  infoValue: { fontSize: 12 },

  // Item cards
  card: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BRAND.border,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
  },
  itemTitle: { fontSize: 12, color: BRAND.text },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },

  // Chips
  chip: {
    fontSize: 9,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipHigh: { color: "#991B1B", borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" },
  chipMed: { color: "#92400E", borderColor: "#FCD34D", backgroundColor: "#FFFBEB" },
  chipLow: { color: "#065F46", borderColor: "#A7F3D0", backgroundColor: "#ECFDF5" },
  chipTs: {
    fontSize: 9,
    color: BRAND.muted,
  },
  chipDispute: { color: "#B91C1C" },

  // Body van item
  p: { marginTop: 6, lineHeight: 1.35 },
  smallMuted: { fontSize: 9, color: BRAND.muted, marginTop: 2 },
  img: { width: 220, height: 124, marginTop: 8, borderRadius: 6, objectFit: "cover" },

  // Footer met paginanummers
  footer: {
    position: "absolute",
    bottom: 18,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: BRAND.muted,
  },
});

function seconds(ms: number) {
  return Math.round(ms / 1000);
}

function severityStyle(sev: "low" | "med" | "high") {
  if (sev === "high") return [styles.chip, styles.chipHigh];
  if (sev === "med") return [styles.chip, styles.chipMed];
  return [styles.chip, styles.chipLow];
}

export default function ReportDoc({
  fileName,
  analysis,
  title = "Surgical Performance Feedback",
  organization = "ORSI Academy",
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
        {/* HEADER */}
        <View style={styles.headerWrap}>
          <View style={styles.logoRow}>
            {/* Logo: zet /orsi-logo.png in public, of pas src aan */}
            <Image style={styles.logo} src={BRAND.logoSrc} />
            <Text style={styles.headerBadge}>{organization}</Text>
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.h1}>{title}</Text>
            <Text style={styles.subline}>
              File: {fileName ?? "unnamed"} • Generated: {format(created, "PPpp")}
            </Text>
          </View>
        </View>

        {/* SUMMARY */}
        <Text style={styles.h2}>Summary</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>{seconds(analysis.durationMs)}s</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Findings (H/M/L)</Text>
            <Text style={styles.infoValue}>
              {counts.total}  ({counts.high}/{counts.med}/{counts.low})
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Disputed</Text>
            <Text style={styles.infoValue}>{counts.disputed}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* DISPUTED (indien aanwezig) */}
        {counts.disputed > 0 ? (
          <View>
            <Text style={styles.h2}>Disputed items</Text>
            {analysis.items
              .filter((i) => i.disputable)
              .map((it, idx) => (
                <View key={`d-${it.id}`} style={styles.card} wrap={false}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.itemTitle}>
                      {idx + 1}. {it.label}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={severityStyle(it.severity)}>{it.severity.toUpperCase()}</Text>
                    <Text style={styles.chipTs}>Timestamp: {seconds(it.timestampMs)}s</Text>
                    <Text style={styles.chipDispute}>DISPUTED</Text>
                  </View>

                  <Text style={styles.p}>Why (root cause): {it.rootCause}</Text>
                  <Text style={styles.p}>Explanation: {it.explanation}</Text>
                  <Text style={styles.p}>Textbook example: {it.textbookExample}</Text>
                  {it.frameDataUrl ? <Image src={it.frameDataUrl} style={styles.img} /> : null}
                </View>
              ))}
            <View style={styles.divider} />
          </View>
        ) : null}

        {/* KEY MOMENTS */}
        <Text style={styles.h2}>Key moments</Text>
        {analysis.items.map((it, idx) => (
          <View key={it.id} style={styles.card} wrap={false}>
            <View style={styles.cardHeader}>
              <Text style={styles.itemTitle}>
                {idx + 1}. {it.label}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={severityStyle(it.severity)}>{it.severity.toUpperCase()}</Text>
              <Text style={styles.chipTs}>Timestamp: {seconds(it.timestampMs)}s</Text>
              {it.disputable ? <Text style={styles.chipDispute}>DISPUTED</Text> : null}
            </View>

            <Text style={styles.p}>Why (root cause): {it.rootCause}</Text>
            <Text style={styles.p}>Explanation: {it.explanation}</Text>
            <Text style={styles.p}>Textbook example: {it.textbookExample}</Text>
            {it.frameDataUrl ? <Image src={it.frameDataUrl} style={styles.img} /> : null}
          </View>
        ))}

        {/* FOOTER */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) => `ORSI Academy • Page ${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}
