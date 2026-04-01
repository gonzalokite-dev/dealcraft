import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resend, FROM_EMAIL } from "@/lib/email/resend";
import { contractSentToClient } from "@/lib/email/templates";
import { CONTRACT_TYPE_LABELS } from "@/lib/proposals/constants";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { recipient_email } = await request.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

    const { data: contract } = await supabase
      .from("contracts")
      .select("id, client_name, client_company, client_email, contract_type, generated_content")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!contract) return NextResponse.json({ error: "Contrato no encontrado." }, { status: 404 });

    const to = recipient_email || contract.client_email;
    if (!to) return NextResponse.json({ error: "No hay email de destino." }, { status: 400 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("business_name, primary_color")
      .eq("id", user.id)
      .single();

    const contractType = CONTRACT_TYPE_LABELS[contract.contract_type] ?? "Contrato de Prestación de Servicios";
    const businessName = profile?.business_name || "Tu proveedor";
    const color = profile?.primary_color || "#2563EB";

    const { subject } = contractSentToClient({
      clientName: contract.client_name,
      clientCompany: contract.client_company || undefined,
      businessName,
      contractType,
      contractUrl: "",
      primaryColor: color,
    });

    // Build full email with contract text embedded
    const safeText = contract.generated_content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background:#fff;border-radius:16px 16px 0 0;border:1px solid #E2E8F0;border-bottom:none;padding:28px 40px 20px;">
    <div style="height:3px;background:${color};border-radius:2px;margin-bottom:20px;"></div>
    <span style="font-size:18px;font-weight:700;color:#0F172A;">${businessName}</span>
  </td></tr>

  <tr><td style="background:#fff;border:1px solid #E2E8F0;border-top:none;border-bottom:none;padding:0 40px 28px;">
    <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;">Contrato para</p>
    <h1 style="margin:0 0 4px;font-size:24px;font-weight:800;color:#0F172A;">${contract.client_name}</h1>
    ${contract.client_company ? `<p style="margin:0 0 12px;font-size:14px;color:#94A3B8;">${contract.client_company}</p>` : "<div style='margin-bottom:12px'></div>"}
    <span style="display:inline-block;background:${color}18;color:${color};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;padding:4px 10px;border-radius:100px;">${contractType}</span>

    <div style="height:1px;background:#E2E8F0;margin:24px 0;"></div>

    <p style="margin:0 0 20px;font-size:14px;color:#334155;line-height:1.7;">
      <strong>${businessName}</strong> te ha enviado el siguiente contrato de prestación de servicios para tu revisión.
    </p>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:28px 32px;">
      <pre style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;color:#334155;line-height:1.9;white-space:pre-wrap;word-break:break-word;margin:0;">${safeText}</pre>
    </div>
  </td></tr>

  <tr><td style="background:#F1F5F9;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 16px 16px;padding:20px 40px;">
    <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">
      Este email fue generado automáticamente por DealCraft. Si tienes alguna pregunta, responde a este mensaje.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contract send error:", err);
    return NextResponse.json({ error: "Error al enviar el contrato." }, { status: 500 });
  }
}
