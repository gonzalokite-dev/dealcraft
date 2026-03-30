import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff",
      fontWeight: 700,
    },
  ],
});

interface GeneratedContent {
  introduction: string;
  problem: string;
  solution: string;
  deliverables: string;
  timeline: string;
  pricing: string;
  cta: string;
}

interface ProposalPDFProps {
  clientName: string;
  clientCompany?: string;
  serviceType: string;
  content: GeneratedContent;
  businessName: string;
  primaryColor: string;
  secondaryColor: string;
  footerText?: string;
  logoUrl?: string;
  createdAt: string;
}

const sections: { key: keyof GeneratedContent; label: string }[] = [
  { key: "introduction", label: "Introducción" },
  { key: "problem", label: "Entendimiento del problema" },
  { key: "solution", label: "Solución propuesta" },
  { key: "deliverables", label: "Entregables" },
  { key: "timeline", label: "Cronograma" },
  { key: "pricing", label: "Precio" },
  { key: "cta", label: "Cierre" },
];

export function ProposalPDF({
  clientName,
  clientCompany,
  serviceType,
  content,
  businessName,
  primaryColor,
  secondaryColor,
  footerText,
  logoUrl,
  createdAt,
}: ProposalPDFProps) {
  const styles = StyleSheet.create({
    page: {
      fontFamily: "Inter",
      fontSize: 10,
      color: secondaryColor,
      backgroundColor: "#FFFFFF",
      paddingTop: 48,
      paddingBottom: 64,
      paddingHorizontal: 56,
    },
    // Header
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 40,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#E8E4DE",
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    logo: {
      width: 36,
      height: 36,
      objectFit: "contain",
    },
    businessName: {
      fontWeight: 700,
      fontSize: 13,
      color: secondaryColor,
    },
    headerDate: {
      fontSize: 8,
      color: "#9E9891",
    },
    // Title block
    titleBlock: {
      marginBottom: 36,
    },
    proposalLabel: {
      fontSize: 8,
      fontWeight: 600,
      color: "#9E9891",
      textTransform: "uppercase",
      letterSpacing: 1.5,
      marginBottom: 8,
    },
    clientName: {
      fontWeight: 700,
      fontSize: 22,
      color: secondaryColor,
      marginBottom: 4,
    },
    clientCompany: {
      fontSize: 11,
      color: "#9E9891",
      marginBottom: 10,
    },
    serviceTag: {
      backgroundColor: "#F7F5F2",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 3,
      fontSize: 8,
      color: "#9E9891",
      alignSelf: "flex-start",
    },
    // Section
    section: {
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: 8,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      color: primaryColor,
      marginBottom: 6,
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: "#E8E4DE",
    },
    sectionText: {
      fontSize: 10,
      lineHeight: 1.7,
      color: secondaryColor,
    },
    // Footer
    footer: {
      position: "absolute",
      bottom: 28,
      left: 56,
      right: 56,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: "#E8E4DE",
      paddingTop: 10,
    },
    footerText: {
      fontSize: 8,
      color: "#9E9891",
    },
    pageNumber: {
      fontSize: 8,
      color: "#9E9891",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {logoUrl && <Image src={logoUrl} style={styles.logo} />}
            <Text style={styles.businessName}>{businessName}</Text>
          </View>
          <Text style={styles.headerDate}>{createdAt}</Text>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.proposalLabel}>Propuesta para</Text>
          <Text style={styles.clientName}>{clientName}</Text>
          {clientCompany && (
            <Text style={styles.clientCompany}>{clientCompany}</Text>
          )}
          <Text style={styles.serviceTag}>{serviceType}</Text>
        </View>

        {/* Sections */}
        {sections.map(({ key, label }) =>
          content[key] ? (
            <View key={key} style={styles.section}>
              <Text style={styles.sectionLabel}>{label}</Text>
              <Text style={styles.sectionText}>{content[key]}</Text>
            </View>
          ) : null
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {footerText ?? businessName}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
