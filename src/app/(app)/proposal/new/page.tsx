"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface FormData {
  client_name: string;
  client_company: string;
  service_type: string;
  description: string;
  goals: string;
  timeline: string;
  price: string;
}

const initialForm: FormData = {
  client_name: "",
  client_company: "",
  service_type: "",
  description: "",
  goals: "",
  timeline: "",
  price: "",
};

export default function NewProposalPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      // Check free plan limit
      const { count } = await supabase
        .from("proposals")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      if (profile?.plan === "free" && (count ?? 0) >= 3) {
        setError("Alcanzaste el límite de 3 propuestas en el plan Free. Actualiza a Pro para continuar.");
        setLoading(false);
        return;
      }

      // Generate proposal via API
      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al generar la propuesta.");
      }

      const { generated_content } = await res.json();

      // Save to database
      const { data: proposal, error: insertError } = await supabase
        .from("proposals")
        .insert({
          user_id: user.id,
          client_name: form.client_name,
          client_company: form.client_company,
          service_type: form.service_type,
          input_data: form,
          generated_content,
        })
        .select("id")
        .single();

      if (insertError) throw new Error("Error al guardar la propuesta.");

      router.push(`/proposal/${proposal.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-border bg-surface">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-heading font-bold text-lg text-secondary tracking-tight">
            DealCraft
          </Link>
          <Link href="/dashboard" className="text-sm text-muted hover:text-secondary transition-colors">
            ← Volver al dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-bold text-secondary leading-tight">
            Nueva propuesta
          </h1>
          <p className="text-muted text-sm mt-2">
            Completa los datos del proyecto. La IA generará la propuesta completa en segundos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Cliente */}
          <div className="space-y-4">
            <h2 className="font-heading font-semibold text-secondary text-base border-b border-border pb-2">
              Cliente
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary" htmlFor="client_name">
                  Nombre del cliente <span className="text-red-400">*</span>
                </label>
                <input
                  id="client_name"
                  name="client_name"
                  type="text"
                  required
                  value={form.client_name}
                  onChange={handleChange}
                  placeholder="Juan García"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary" htmlFor="client_company">
                  Empresa <span className="text-muted font-normal">(opcional)</span>
                </label>
                <input
                  id="client_company"
                  name="client_company"
                  type="text"
                  value={form.client_company}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Proyecto */}
          <div className="space-y-4">
            <h2 className="font-heading font-semibold text-secondary text-base border-b border-border pb-2">
              Proyecto
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-secondary" htmlFor="service_type">
                Tipo de servicio <span className="text-red-400">*</span>
              </label>
              <input
                id="service_type"
                name="service_type"
                type="text"
                required
                value={form.service_type}
                onChange={handleChange}
                placeholder="Ej. Diseño web, Consultoría de marketing, Desarrollo de app..."
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-secondary" htmlFor="description">
                Descripción del proyecto <span className="text-red-400">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe el proyecto, el contexto del cliente y qué necesita..."
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-secondary" htmlFor="goals">
                Objetivos del proyecto <span className="text-red-400">*</span>
              </label>
              <textarea
                id="goals"
                name="goals"
                required
                rows={3}
                value={form.goals}
                onChange={handleChange}
                placeholder="¿Qué resultados espera lograr el cliente con este proyecto?"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          {/* Detalles */}
          <div className="space-y-4">
            <h2 className="font-heading font-semibold text-secondary text-base border-b border-border pb-2">
              Detalles
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary" htmlFor="timeline">
                  Cronograma <span className="text-red-400">*</span>
                </label>
                <input
                  id="timeline"
                  name="timeline"
                  type="text"
                  required
                  value={form.timeline}
                  onChange={handleChange}
                  placeholder="Ej. 4 semanas, 3 meses..."
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary" htmlFor="price">
                  Precio <span className="text-muted font-normal">(opcional)</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Ej. €2.500, €800/mes..."
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-medium py-3.5 rounded-full hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm disabled:opacity-60 disabled:pointer-events-none"
          >
            {loading ? "Generando propuesta con IA..." : "Generar propuesta"}
          </button>
        </form>
      </main>
    </div>
  );
}
