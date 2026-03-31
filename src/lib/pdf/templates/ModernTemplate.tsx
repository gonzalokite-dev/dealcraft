import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { CANONICAL_ORDER, SECTION_LABELS } from "@/lib/proposals/constants";
import type { PDFTemplateProps } from "./types";

export function ModernTemplate({
  clientName, clientCompany, serviceType, content,
  businessName, primaryColor, secondaryColor, footerText, logoUrl, createdAt,
}: PDFTemplateProps) {
  const styles = StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10, color: secondaryColor, backgroundColor: "#FFFFFF", paddingBottom: 64 },
    headerBlock: { backgroundColor: primaryColor, paddingTop: 40, paddingBottom: 36, paddingHorizontal: 56 },
    headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
    logo: { height: 48, maxWidth: 160, objectFit: "contain" },
    businessNameOnly: { fontFamily: "Helvetica-Bold", fontSize: 14, color: "#FFFFFF" },
    headerDate: { fontSize: 8, color: "rgba(255,255,255,0.7)" },
    proposalLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 },
    clientName: { fontFamily: "Helvetica-Bold", fontSize: 24, color: "#FFFFFF", marginBottom: 4 },
    clientCompany: { fontSize: 11, color: "rgba(255,255,255,0.8)", marginBottom: 12 },
    serviceTag: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, fontSize: 8, color: "#FFFFFF", fontFamily: "Helvetica-Bold", alignSelf: "flex-start" },
    content: { paddingHorizontal: 56, paddingTop: 40 },
    section: { marginBottom: 26 },
    sectionLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.2, color: primaryColor, marginBottom: 7, paddingBottom: 5, borderBottomWidth: 1.5, borderBottomColor: primaryColor },
    sectionText: { fontSize: 10, lineHeight: 1.7, color: secondaryColor },
    footer: { position: "absolute", bottom: 28, left: 56, right: 56, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#E8E4DE", paddingTop: 10 },
    footerText: { fontSize: 8, color: "#9E9891" },
    pageNumber: { fontSize: 8, color: "#9E9891" },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBlock}>
          <View style={styles.headerTop}>
            {logoUrl
              ? <Image src={logoUrl} style={styles.logo} />
              : <Text style={styles.businessNameOnly}>{businessName}</Text>
            }
            <Text style={styles.headerDate}>{createdAt}</Text>
          </View>
          <Text style={styles.proposalLabel}>Propuesta para</Text>
          <Text style={styles.clientName}>{clientName}</Text>
          {clientCompany && <Text style={styles.clientCompany}>{clientCompany}</Text>}
          <Text style={styles.serviceTag}>{serviceType}</Text>
        </View>

        <View style={styles.content}>
          {CANONICAL_ORDER.filter((k) => Boolean(content[k])).map((key) => (
            <View key={key} style={styles.section}>
              <Text style={styles.sectionLabel}>{SECTION_LABELS[key] ?? key}</Text>
              <Text style={styles.sectionText}>{content[key]}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{footerText ?? businessName}</Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
