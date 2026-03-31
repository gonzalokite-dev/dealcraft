export interface PDFTemplateProps {
  clientName: string;
  clientCompany?: string;
  serviceType: string;
  content: Record<string, string>;
  businessName: string;
  primaryColor: string;
  secondaryColor: string;
  footerText?: string;
  logoUrl?: string;
  createdAt: string;
}
