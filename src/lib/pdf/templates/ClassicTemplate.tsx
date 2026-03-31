import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { CANONICAL_ORDER, SECTION_LABELS } from "@/lib/proposals/constants";
import type { PDFTemplateProps } from "./types";

export function ClassicTemplate({
  clientName, clientCompany, serviceType, content,
  businessName, primaryColor, secondaryColor, footerText, logoUrl, createdAt,
}: PDFTemplateProps) {
  const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: secondaryColor, backgroundColor: "#FFFFFF", paddingTop: 48, paddingBottom: 64, paddingHorizontal: 56 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    logo: { height: 52, maxWidth: 160, objectFit: "contain" },
    businessNameOnly: { fontFamily: "Helvetica-Bold", fontSize: 15, color: secondaryColor },
    headerDate: { fontSize: 8, color: "#9E9891" },
    accent: { height: 2, backgroundColor: primaryColor, marginBottom: 36, borderRadius: 1 },
    titleBlock: { marginBottom: 36 },
    proposalLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#9E9891", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 },
    clientName: { fontFamily: "Helvetica-Bold", fontSize: 22, color: secondaryColor, marginBottom: 4 },
    clientCompany: { fontSize: 11, color: "#9E9891", marginBottom: 10 },
    serviceTag: { backgroundColor: "#F7F5F2", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, fontSize: 8, color: primaryColor, fontFamily: "Helvetica-Bold", alignSelf: "flex-start" },
    section: { marginBottom: 24 },
    sectionLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.2, color: primaryColor, marginBottom: 6, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: "#E8E4DE" },
    sectionText: { fontSize: 10, lineHeight: 1.7, color: secondaryColor },
    footer: { position: "absolute", bottom: 28, left: 56, right: 56, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#E8E4DE", paddingTop: 10 },
    footerText: { fontSize: 8, color: "#9E9891" },
    pageNumber: { fontSize: 8, color: "#9E9891" },
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
        <View style={styles.accent} />
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
