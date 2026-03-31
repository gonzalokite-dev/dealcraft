import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: proposals }, { data: contracts }] = await Promise.all([
    supabase
      .from("profiles")
      .select("business_name, plan")
      .eq("id", user.id)
      .single(),
    supabase
      .from("proposals")
      .select("id, client_name, client_company, service_type, created_at, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("contracts")
      .select("id, client_name, client_company, contract_type, created_at, status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <DashboardClient
      proposals={proposals ?? []}
      contracts={contracts ?? []}
      profile={profile}
      userEmail={user.email ?? ""}
    />
  );
}
