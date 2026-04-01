import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM_EMAIL, APP_URL } from "@/lib/email/resend";
import { proposalSentToClient } from "@/lib/email/templates";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { send_email, client_email } = body as {
      send_email?: boolean;
      client_email?: string;
    };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

    const { data: proposal } = await supabase
      .from("proposals")
      .select("id, public_token, status, client_name, client_company, client_email, service_type")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!proposal) return NextResponse.json({ error: "Propuesta no encontrada." }, { status: 404 });

    // Generate token if not exists
    let token = proposal.public_token;
    if (!token) {
      const admin = createAdminClient();
      const { data: updated } = await admin
        .from("proposals")
        .update({ public_token: crypto.randomUUID(), status: "sent" })
        .eq("id", id)
        .select("public_token")
        .single();
      token = updated!.public_token;
    } else if (proposal.status === "draft") {
      const admin = createAdminClient();
      await admin.from("proposals").update({ status: "sent" }).eq("id", id);
    }

    const proposalUrl = `${APP_URL}/p/${token}`;

    // Send email to client if requested
    if (send_email) {
      const recipientEmail = client_email || proposal.client_email;
      if (recipientEmail) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("business_name, primary_color")
          .eq("id", user.id)
          .single();

        const { subject, html } = proposalSentToClient({
          clientName: proposal.client_name,
          clientCompany: proposal.client_company || undefined,
          serviceType: proposal.service_type,
          businessName: profile?.business_name || "Tu proveedor",
          proposalUrl,
          primaryColor: profile?.primary_color || undefined,
        });

        await resend.emails.send({ from: FROM_EMAIL, to: recipientEmail, subject, html });
      }
    }

    return NextResponse.json({ url: proposalUrl, token });
  } catch (err) {
    console.error("Share error:", err);
    return NextResponse.json({ error: "Error al generar el enlace." }, { status: 500 });
  }
}
