import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) return NextResponse.json({ ok: false });

    const admin = createAdminClient();
    await admin
      .from("proposals")
      .update({ status: "viewed", viewed_at: new Date().toISOString() })
      .eq("public_token", token)
      .is("viewed_at", null); // only on first visit

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
