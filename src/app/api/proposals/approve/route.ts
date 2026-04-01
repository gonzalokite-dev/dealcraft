import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM_EMAIL, APP_URL } from "@/lib/email/resend";
import { proposalApproved } from "@/lib/email/templates";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) return NextResponse.json({ error: "Token requerido." }, { status: 400 });

    const admin = createAdminClient();

    // Fetch proposal + owner info
    const { data: proposal } = await admin
      .from("proposals")
      .select("id, user_id, client_name, client_company, service_type, profiles(business_name)")
      .eq("public_token", token)
      .single();

    if (!proposal) return NextResponse.json({ error: "Propuesta no encontrada." }, { status: 404 });

    const { error } = await admin
      .from("proposals")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("public_token", token);

    if (error) throw error;

    // Notify owner
    const { data: ownerAuth } = await admin.auth.admin.getUserById(proposal.user_id);
    const ownerEmail = ownerAuth?.user?.email;

    if (ownerEmail) {
      const profileRaw = proposal.profiles;
      const profile = (Array.isArray(profileRaw) ? profileRaw[0] : profileRaw) as { business_name: string } | null;
      const { subject, html } = proposalApproved({
        ownerName: profile?.business_name || "Usuario",
        clientName: proposal.client_name,
        clientCompany: proposal.client_company || undefined,
        serviceType: proposal.service_type,
        proposalUrl: `${APP_URL}/proposal/${proposal.id}`,
        dashboardUrl: `${APP_URL}/dashboard`,
      });

      await resend.emails.send({ from: FROM_EMAIL, to: ownerEmail, subject, html });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Approve error:", err);
    return NextResponse.json({ error: "Error al aprobar." }, { status: 500 });
  }
}
