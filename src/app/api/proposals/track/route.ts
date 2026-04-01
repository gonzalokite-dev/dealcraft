import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM_EMAIL, APP_URL } from "@/lib/email/resend";
import { proposalViewed } from "@/lib/email/templates";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) return NextResponse.json({ ok: false });

    const admin = createAdminClient();

    // Fetch proposal + owner profile (only if not yet viewed)
    const { data: proposal } = await admin
      .from("proposals")
      .select("id, user_id, viewed_at, client_name, client_company, service_type, public_token, profiles(business_name)")
      .eq("public_token", token)
      .single();

    if (!proposal) return NextResponse.json({ ok: false });

    // Only act on first visit
    if (proposal.viewed_at) return NextResponse.json({ ok: true });

    // Mark as viewed
    await admin
      .from("proposals")
      .update({ status: "viewed", viewed_at: new Date().toISOString() })
      .eq("public_token", token);

    // Notify owner by email
    const { data: ownerAuth } = await admin.auth.admin.getUserById(proposal.user_id);
    const ownerEmail = ownerAuth?.user?.email;

    if (ownerEmail) {
      const profileRaw = proposal.profiles;
      const profile = (Array.isArray(profileRaw) ? profileRaw[0] : profileRaw) as { business_name: string } | null;
      const { subject, html } = proposalViewed({
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
  } catch {
    return NextResponse.json({ ok: false });
  }
}
