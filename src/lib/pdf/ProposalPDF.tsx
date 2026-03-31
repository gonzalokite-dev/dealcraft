import { ClassicTemplate } from "./templates/ClassicTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import type { PDFTemplateProps } from "./templates/types";

export type PDFTemplateName = "classic" | "modern" | "executive" | "minimal";

interface ProposalPDFProps extends PDFTemplateProps {
  template?: PDFTemplateName;
}

export function ProposalPDF({ template = "classic", ...props }: ProposalPDFProps) {
  switch (template) {
    case "modern":    return <ModernTemplate {...props} />;
    case "executive": return <ExecutiveTemplate {...props} />;
    case "minimal":   return <MinimalTemplate {...props} />;
    default:          return <ClassicTemplate {...props} />;
  }
}
