export const runtime = "nodejs";

import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { createElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProposalPDF } from "@/lib/pdf/ProposalPDF";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    // Fetch proposal
    const { data: proposal, error: proposalError } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (proposalError || !proposal) {
      return NextResponse.json({ error: "Propuesta no encontrada." }, { status: 404 });
    }

    // Fetch profile (branding)
    const { data: profile } = await supabase
      .from("profiles")
      .select("business_name, primary_color, secondary_color, footer_text, logo_url")
      .eq("id", user.id)
      .single();

    const createdAt = new Date(proposal.created_at).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfElement = createElement(ProposalPDF as any, {
      clientName: proposal.client_name,
      clientCompany: proposal.client_company ?? undefined,
      serviceType: proposal.service_type,
      content: proposal.generated_content,
      businessName: profile?.business_name ?? "Mi negocio",
      primaryColor: profile?.primary_color ?? "#2563EB",
      secondaryColor: profile?.secondary_color ?? "#1B2A3A",
      footerText: profile?.footer_text ?? undefined,
      logoUrl: profile?.logo_url ?? undefined,
      createdAt,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(pdfElement as any);

    const filename = `propuesta-${proposal.client_name.toLowerCase().replace(/\s+/g, "-")}.pdf`;

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "Error al generar el PDF." },
      { status: 500 }
    );
  }
}
