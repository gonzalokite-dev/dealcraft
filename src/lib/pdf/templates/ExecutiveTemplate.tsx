import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { CANONICAL_ORDER, SECTION_LABELS } from "@/lib/proposals/constants";
import type { PDFTemplateProps } from "./types";

export function ExecutiveTemplate({
  clientName, clientCompany, serviceType, content,
  businessName, primaryColor, secondaryColor, footerText, logoUrl, createdAt,
}: PDFTemplateProps) {
  const STRIP = 6;
  const PAD = 52;

  const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: secondaryColor, backgroundColor: "#FFFFFF", paddingTop: 48, paddingBottom: 64, paddingLeft: PAD + STRIP + 8, paddingRight: PAD },
    // Left color strip
    strip: { position: "absolute", left: 0, top: 0, bottom: 0, width: STRIP, backgroundColor: primaryColor },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: "#E8E4DE" },
    headerLeft: { flexDirection: "column", gap: 6 },
    logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    logo: { width: 28, height: 28, objectFit: "contain" },
    businessName: { fontFamily: "Helvetica-Bold", fontSize: 12, color: secondaryColor },
    headerDate: { fontSize: 8, color: "#9E9891" },
    titleBlock: { marginBottom: 32 },
    proposalLabel: { fontSize: 7, fontFamily: "Helvetica-Bold", color: primaryColor, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 },
    clientName: { fontFamily: "Helvetica-Bold", fontSize: 20, color: secondaryColor, marginBottom: 3 },
    clientCompany: { fontSize: 10, color: "#9E9891", marginBottom: 8 },
    serviceTag: { borderWidth: 1, borderColor: primaryColor, borderRadius: 2, paddingHorizontal: 8, paddingVertical: 3, fontSize: 7, color: primaryColor, fontFamily: "Helvetica-Bold", alignSelf: "flex-start" },
    section: { marginBottom: 22 },
    sectionLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, color: secondaryColor, marginBottom: 5, paddingBottom: 4, borderBottomWidth: 0.5, borderBottomColor: secondaryColor },
    sectionText: { fontSize: 10, lineHeight: 1.65, color: secondaryColor },
    footer: { position: "absolute", bottom: 28, left: PAD + STRIP + 8, right: PAD, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 0.5, borderTopColor: "#D0CCC6", paddingTop: 10 },
    footerText: { fontSize: 8, color: "#9E9891" },
    pageNumber: { fontSize: 8, color: "#9E9891" },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left strip */}
        <View style={styles.strip} fixed />

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoRow}>
              {logoUrl && <Image src={logoUrl} style={styles.logo} />}
              <Text style={styles.businessName}>{businessName}</Text>
            </View>
          </View>
          <Text style={styles.headerDate}>{createdAt}</Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.proposalLabel}>Propuesta para</Text>
          <Text style={styles.clientName}>{clientName}</Text>
          {clientCompany && <Text style={styles.clientCompany}>{clientCompany}</Text>}
          <Text style={styles.serviceTag}>{serviceType}</Text>
        </View>

        {CANONICAL_ORDER.filter((k) => Boolean(content[k])).map((key) => (
          <View key={key} style={styles.section}>
            <Text style={styles.sectionLabel}>{SECTION_LABELS[key] ?? key}</Text>
            <Text style={styles.sectionText}>{content[key]}</Text>
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{footerText ?? businessName}</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
