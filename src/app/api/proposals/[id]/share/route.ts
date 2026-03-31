import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

    // Verify ownership
    const { data: proposal } = await supabase
      .from("proposals")
      .select("id, public_token, status")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!proposal) return NextResponse.json({ error: "Propuesta no encontrada." }, { status: 404 });

    // Return existing token or generate a new one
    if (proposal.public_token) {
      const url = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/p/${proposal.public_token}`;
      return NextResponse.json({ url, token: proposal.public_token });
    }

    const admin = createAdminClient();
    const { data: updated } = await admin
      .from("proposals")
      .update({ public_token: crypto.randomUUID(), status: "sent" })
      .eq("id", id)
      .select("public_token")
      .single();

    const url = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/p/${updated!.public_token}`;
    return NextResponse.json({ url, token: updated!.public_token });
  } catch (err) {
    console.error("Share error:", err);
    return NextResponse.json({ error: "Error al generar el enlace." }, { status: 500 });
  }
}
