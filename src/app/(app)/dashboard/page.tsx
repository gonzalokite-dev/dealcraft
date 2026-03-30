import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_name, plan")
    .eq("id", user.id)
    .single();

  const { data: proposals } = await supabase
    .from("proposals")
    .select("id, client_name, client_company, service_type, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const proposalCount = proposals?.length ?? 0;
  const isFree = profile?.plan === "free";
  const atLimit = isFree && proposalCount >= 3;

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <header className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-bold text-lg text-secondary tracking-tight">
            DealCraft
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted hidden sm:block">{user.email}</span>
            <form action="/api/auth/signout" method="POST">
              <button className="text-xs text-muted hover:text-secondary transition-colors">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* Page header */}
        <div className="flex items-start justify-between mb-10 gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-secondary">
              {profile?.business_name ? `Hola, ${profile.business_name}` : "Mis propuestas"}
            </h1>
            <p className="text-muted text-sm mt-1">
              {proposalCount === 0
                ? "Aún no tienes propuestas. Crea la primera."
                : `${proposalCount} propuesta${proposalCount !== 1 ? "s" : ""} creada${proposalCount !== 1 ? "s" : ""}`}
            </p>
          </div>

          {atLimit ? (
            <div className="text-right">
              <p className="text-xs text-muted mb-2">Límite del plan Free alcanzado</p>
              <Link
                href="/signup?plan=pro"
                className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors"
              >
                Actualizar a Pro
              </Link>
            </div>
          ) : (
            <Link
              href="/proposal/new"
              className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
            >
              Nueva propuesta
            </Link>
          )}
        </div>

        {/* Free plan banner */}
        {isFree && (
          <div className="bg-primary-50 border border-primary-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4 mb-8">
            <p className="text-sm text-secondary">
              Plan Free — <span className="font-medium">{proposalCount} de 3</span> propuestas usadas.
            </p>
            <Link href="/signup?plan=pro" className="text-xs font-medium text-primary hover:underline flex-shrink-0">
              Ver planes →
            </Link>
          </div>
        )}

        {/* Proposals list */}
        {proposals && proposals.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {proposals.map((p) => (
              <Link
                key={p.id}
                href={`/proposal/${p.id}`}
                className="bg-surface border border-border rounded-2xl p-6 hover:border-gray-300 hover:shadow-card transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-heading font-semibold text-secondary text-base group-hover:text-primary transition-colors">
                      {p.client_name}
                    </p>
                    {p.client_company && (
                      <p className="text-xs text-muted mt-0.5">{p.client_company}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted border border-border rounded-full px-2.5 py-1 flex-shrink-0">
                    {p.service_type}
                  </span>
                </div>
                <p className="text-xs text-muted">
                  {new Date(p.created_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-2xl p-16 text-center">
            <p className="font-heading text-xl font-semibold text-secondary mb-2">
              Sin propuestas aún
            </p>
            <p className="text-sm text-muted mb-6">
              Crea tu primera propuesta en menos de 5 minutos.
            </p>
            <Link
              href="/proposal/new"
              className="inline-block text-sm font-medium bg-primary text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              Crear propuesta
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
