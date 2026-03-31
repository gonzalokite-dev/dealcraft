import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { CANONICAL_ORDER, SECTION_LABELS } from "@/lib/proposals/constants";
import type { PDFTemplateProps } from "./types";

export function MinimalTemplate({
  clientName, clientCompany, serviceType, content,
  businessName, footerText, logoUrl, createdAt,
}: PDFTemplateProps) {
  const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a", backgroundColor: "#FFFFFF", paddingTop: 56, paddingBottom: 64, paddingHorizontal: 64 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 48 },
    logo: { height: 48, maxWidth: 160, objectFit: "contain" },
    businessNameOnly: { fontFamily: "Helvetica-Bold", fontSize: 13, color: "#1a1a1a" },
    headerDate: { fontSize: 8, color: "#999" },
    titleBlock: { marginBottom: 40, paddingBottom: 32, borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
    proposalLabel: { fontSize: 8, color: "#999", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 },
    clientName: { fontFamily: "Helvetica-Bold", fontSize: 26, color: "#1a1a1a", marginBottom: 4 },
    clientCompany: { fontSize: 11, color: "#666", marginBottom: 8 },
    serviceType: { fontSize: 9, color: "#666" },
    section: { marginBottom: 28 },
    sectionLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, color: "#1a1a1a", marginBottom: 8 },
    divider: { height: 0.5, backgroundColor: "#e0e0e0", marginBottom: 10 },
    sectionText: { fontSize: 10, lineHeight: 1.8, color: "#333" },
    footer: { position: "absolute", bottom: 28, left: 64, right: 64, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10 },
    footerText: { fontSize: 8, color: "#999" },
    pageNumber: { fontSize: 8, color: "#999" },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoUrl
            ? <Image src={logoUrl} style={styles.logo} />
            : <Text style={styles.businessNameOnly}>{businessName}</Text>
          }
          <Text style={styles.headerDate}>{createdAt}</Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.proposalLabel}>Propuesta para</Text>
          <Text style={styles.clientName}>{clientName}</Text>
          {clientCompany && <Text style={styles.clientCompany}>{clientCompany}</Text>}
          <Text style={styles.serviceType}>{serviceType}</Text>
        </View>

        {CANONICAL_ORDER.filter((k) => Boolean(content[k])).map((key) => (
          <View key={key} style={styles.section}>
            <Text style={styles.sectionLabel}>{SECTION_LABELS[key] ?? key}</Text>
            <View style={styles.divider} />
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
