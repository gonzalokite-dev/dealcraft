"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TONES, LENGTHS } from "@/lib/proposals/constants";

interface FormData {
  client_name: string;
  client_company: string;
  client_email: string;
  service_type: string;
  description: string;
  tone: string;
  length: string;
  language: string;
}

const initialForm: FormData = {
  client_name: "",
  client_company: "",
  client_email: "",
  service_type: "",
  description: "",
  tone: "formal_ejecutivo",
  length: "estandar",
  language: "es",
};

const TONE_OPTIONS = [
  { value: "formal_ejecutivo",   label: "Ejecutivo",   desc: "Corporativo y estructurado" },
  { value: "cercano_directo",    label: "Directo",     desc: "Ágil y sin rodeos" },
  { value: "tecnico_detallado",  label: "Técnico",     desc: "Con profundidad técnica" },
  { value: "empatico_consultivo",label: "Consultivo",  desc: "Centrado en el cliente" },
];

const LENGTH_OPTIONS = [
  { value: "conciso",   label: "Conciso",   desc: "1 pág. aprox." },
  { value: "estandar",  label: "Estándar",  desc: "2-3 págs." },
  { value: "detallado", label: "Detallado", desc: "4+ págs." },
];

const PROMPTS_PLACEHOLDER = `Ejemplos de lo que puedes incluir:

• Quiero proponer a [cliente] una retención mensual de marketing digital de 2.500 €/mes. Incluye gestión de RRSS (8 posts), 1 newsletter, y reporte mensual de resultados. Duración mínima 6 meses. El cliente quiere aumentar su presencia online y generar leads.

• Propuesta de desarrollo web para una tienda ecommerce. Presupuesto total 8.000 €. Entregables: diseño UI, desarrollo en Shopify, migración de productos e integración de pasarela de pago. Plazo: 8 semanas.

• Consultoría de estrategia para startup SaaS. 4 sesiones de 2h, formato online. Precio 400 €/sesión. El cliente necesita definir su go-to-market y pricing.`;

export default function NewProposalPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    set(name as keyof FormData, value);
    if (name === "description") setCharCount(value.length);
  }

  function validateStep(): string {
    if (step === 1 && !form.client_name.trim()) return "El nombre del cliente es obligatorio.";
    if (step === 2) {
      if (!form.service_type.trim()) return "Indica el servicio que ofreces.";
      if (!form.description.trim()) return "Describe la propuesta antes de continuar.";
      if (form.description.trim().length < 50) return "Añade más detalle — cuanto más específico, mejor será la propuesta.";
    }
    return "";
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep(2);
  }

  async function handleSubmit() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

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

      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // Map to the fields the generate route expects
          goals: "",
          specific_deliverables: "",
          proposal_type: "proyecto_puntual",
          sector: "",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al generar la propuesta.");
      }

      const { generated_content } = await res.json();

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

  const inputCls = "w-full px-4 py-3.5 rounded-2xl border border-border bg-surface text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all";

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <header className="border-b border-border bg-surface flex-shrink-0">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-heading font-bold text-lg text-secondary tracking-tight">DealCraft</Link>
          <Link href="/dashboard" className="text-sm text-muted hover:text-secondary transition-colors">Cancelar</Link>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-border flex-shrink-0">
        <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: step === 1 ? "50%" : "100%" }} />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl">

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                  s < step ? "bg-primary text-white" :
                  s === step ? "bg-primary text-white shadow-sm" :
                  "bg-border text-muted"
                }`}>
                  {s < step ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  ) : s}
                </div>
                {s < 2 && <div className={`w-12 h-0.5 transition-all ${s < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Cliente ── */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h1 className="font-heading text-3xl font-bold text-secondary">¿Para quién es esta propuesta?</h1>
                <p className="text-sm text-muted">Los datos del cliente al que va dirigida</p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    name="client_name"
                    type="text"
                    autoFocus
                    value={form.client_name}
                    onChange={handleInput}
                    placeholder="Nombre del contacto *"
                    className={inputCls}
                    onKeyDown={(e) => e.key === "Enter" && next()}
                  />
                </div>
                <input
                  name="client_company"
                  type="text"
                  value={form.client_company}
                  onChange={handleInput}
                  placeholder="Empresa (opcional)"
                  className={inputCls}
                  onKeyDown={(e) => e.key === "Enter" && next()}
                />
                <input
                  name="client_email"
                  type="email"
                  value={form.client_email}
                  onChange={handleInput}
                  placeholder="Email del cliente (opcional)"
                  className={inputCls}
                  onKeyDown={(e) => e.key === "Enter" && next()}
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
              )}

              <button
                type="button"
                onClick={next}
                className="w-full py-4 rounded-2xl bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm"
              >
                Continuar →
              </button>

              <p className="text-center text-xs text-muted">Paso 1 de 2</p>
            </div>
          )}

          {/* ── STEP 2: La propuesta ── */}
          {step === 2 && (
            <div className="space-y-7">
              <div className="text-center space-y-2">
                <h1 className="font-heading text-3xl font-bold text-secondary">Descríbele la propuesta a la IA</h1>
                <p className="text-sm text-muted">
                  Explica el proyecto con libertad — servicio, objetivos, precio, plazos, entregables.
                  Cuanta más información, mejor será el resultado.
                </p>
              </div>

              {/* Service */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">¿Qué servicio ofreces? *</label>
                <input
                  name="service_type"
                  type="text"
                  autoFocus
                  value={form.service_type}
                  onChange={handleInput}
                  placeholder="Ej. Diseño web, Consultoría de marketing, Desarrollo de software..."
                  className={inputCls}
                />
              </div>

              {/* Main prompt */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Descripción de la propuesta *</label>
                <div className="relative">
                  <textarea
                    name="description"
                    rows={10}
                    value={form.description}
                    onChange={handleInput}
                    placeholder={PROMPTS_PLACEHOLDER}
                    className={`${inputCls} resize-none leading-relaxed`}
                  />
                  <div className="absolute bottom-3 right-4 text-xs text-muted/60 pointer-events-none">
                    {charCount > 0 && `${charCount} car.`}
                  </div>
                </div>
                <p className="text-xs text-muted">
                  💡 Incluye precio, duración, entregables y contexto del cliente para que la propuesta sea más precisa.
                </p>
              </div>

              {/* Tone */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Tono</label>
                <div className="grid grid-cols-2 gap-2">
                  {TONE_OPTIONS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => set("tone", t.value)}
                      className={`flex flex-col gap-0.5 px-4 py-3.5 rounded-xl border text-left transition-all ${
                        form.tone === t.value
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-surface hover:border-gray-300"
                      }`}
                    >
                      <span className={`text-sm font-semibold ${form.tone === t.value ? "text-primary" : "text-secondary"}`}>{t.label}</span>
                      <span className="text-xs text-muted">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Length */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Extensión</label>
                <div className="grid grid-cols-3 gap-2">
                  {LENGTH_OPTIONS.map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => set("length", l.value)}
                      className={`flex flex-col items-center gap-0.5 py-3.5 px-3 rounded-xl border text-center transition-all ${
                        form.length === l.value
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-surface hover:border-gray-300"
                      }`}
                    >
                      <span className={`text-sm font-semibold ${form.length === l.value ? "text-primary" : "text-secondary"}`}>{l.label}</span>
                      <span className="text-xs text-muted">{l.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); }}
                  className="px-6 py-4 rounded-2xl border border-border text-sm font-medium text-secondary hover:border-gray-400 transition-colors"
                >
                  ← Atrás
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-4 rounded-2xl bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none shadow-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="text-white animate-typing-dot">✦</span>
                      Generando propuesta…
                    </>
                  ) : (
                    <>
                      Generar propuesta con IA
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-muted">Paso 2 de 2 · La generación tarda entre 20 y 60 segundos</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
