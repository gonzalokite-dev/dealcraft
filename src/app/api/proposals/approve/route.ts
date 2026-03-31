import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) return NextResponse.json({ error: "Token requerido." }, { status: 400 });

    const admin = createAdminClient();
    const { error } = await admin
      .from("proposals")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("public_token", token);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Approve error:", err);
    return NextResponse.json({ error: "Error al aprobar." }, { status: 500 });
  }
}
