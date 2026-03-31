"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  PROPOSAL_TYPES,
  SECTORS,
  TONES,
  LENGTHS,
  LANGUAGES,
} from "@/lib/proposals/constants";

interface FormData {
  client_name: string;
  client_company: string;
  client_email: string;
  proposal_type: string;
  sector: string;
  sector_custom: string;
  service_type: string;
  description: string;
  goals: string;
  specific_deliverables: string;
  timeline: string;
  price: string;
  payment_terms: string;
  tone: string;
  length: string;
  language: string;
}

const initialForm: FormData = {
  client_name: "",
  client_company: "",
  client_email: "",
  proposal_type: "proyecto_puntual",
  sector: "",
  sector_custom: "",
  service_type: "",
  description: "",
  goals: "",
  specific_deliverables: "",
  timeline: "",
  price: "",
  payment_terms: "",
  tone: "formal_ejecutivo",
  length: "estandar",
  language: "es",
};

const TOTAL_STEPS = 4;

const PROPOSAL_TYPE_ICONS: Record<string, string> = {
  proyecto_puntual: "◆",
  servicios_recurrentes: "↻",
  consultoria: "◎",
  retencion_mensual: "▣",
  colaboracion: "⬡",
};

const TONE_DESCRIPTIONS: Record<string, string> = {
  formal_ejecutivo: "Corporativo y estructurado",
  cercano_directo: "Ágil y sin rodeos",
  tecnico_detallado: "Con profundidad técnica",
  empatico_consultivo: "Centrado en el cliente",
};

export default function NewProposalPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    set(e.target.name as keyof FormData, e.target.value);
  }

  function validateStep(): string {
    if (step === 1 && !form.client_name.trim()) return "El nombre del cliente es obligatorio.";
    if (step === 2 && !form.service_type.trim()) return "El tipo de servicio es obligatorio.";
    if (step === 3) {
      if (!form.description.trim()) return "La descripción del proyecto es obligatoria.";
      if (!form.goals.trim()) return "Los objetivos del cliente son obligatorios.";
    }
    if (step === 4 && !form.timeline.trim()) return "El cronograma es obligatorio.";
    return "";
  }

  function next() {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
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
        body: JSON.stringify(form),
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

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";
  const textareaClass = `${inputClass} resize-none`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-surface flex-shrink-0">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-heading font-bold text-lg text-secondary tracking-tight">
            DealCraft
          </Link>
          <Link href="/dashboard" className="text-sm text-muted hover:text-secondary transition-colors">
            Cancelar
          </Link>
        </div>
      </header>

      <div className="h-1 bg-border flex-shrink-0">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">

          <p className="text-xs text-muted mb-2 text-center tracking-widest uppercase">
            Paso {step} de {TOTAL_STEPS}
          </p>

          {/* ── STEP 1: Cliente ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="font-heading text-2xl font-bold text-secondary">¿Para quién es esta propuesta?</h1>
                <p className="text-sm text-muted">Indica los datos del cliente al que va dirigida</p>
              </div>
              <div className="space-y-3">
                <input
                  name="client_name"
                  type="text"
                  autoFocus
                  value={form.client_name}
                  onChange={handleInputChange}
                  placeholder="Nombre del cliente *"
                  className={inputClass}
                  onKeyDown={(e) => e.key === "Enter" && next()}
                />
                <input
                  name="client_company"
                  type="text"
                  value={form.client_company}
                  onChange={handleInputChange}
                  placeholder="Empresa (opcional)"
                  className={inputClass}
                  onKeyDown={(e) => e.key === "Enter" && next()}
                />
                <input
                  name="client_email"
                  type="email"
                  value={form.client_email}
                  onChange={handleInputChange}
                  placeholder="Email del cliente (opcional)"
                  className={inputClass}
                  onKeyDown={(e) => e.key === "Enter" && next()}
                />
              </div>
            </div>
          )}

          {/* ── STEP 2: Proyecto ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="font-heading text-2xl font-bold text-secondary">¿Qué tipo de proyecto es?</h1>
                <p className="text-sm text-muted">Esto ayuda a la IA a estructurar la propuesta correctamente</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PROPOSAL_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set("proposal_type", t.value)}
                    className={`flex flex-col gap-1 px-4 py-3 rounded-xl border text-left transition-colors ${
                      form.proposal_type === t.value
                        ? "border-primary bg-primary/5"
                        : "border-border bg-surface hover:border-gray-300"
                    }`}
                  >
                    <span className="text-base">{PROPOSAL_TYPE_ICONS[t.value]}</span>
                    <span className={`text-xs font-semibold leading-tight ${form.proposal_type === t.value ? "text-primary" : "text-secondary"}`}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">Sector</label>
                <div className="flex flex-wrap gap-2">
                  {SECTORS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set("sector", s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        form.sector === s
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted hover:border-gray-300 hover:text-secondary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {form.sector === "Otro" && (
                  <input
                    name="sector_custom"
                    type="text"
                    autoFocus
                    value={form.sector_custom}
                    onChange={handleInputChange}
                    placeholder="Especifica el sector..."
                    className={inputClass}
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">
                  ¿Qué servicio ofreces? <span className="text-red-400">*</span>
                </label>
                <input
                  name="service_type"
                  type="text"
                  value={form.service_type}
                  onChange={handleInputChange}
                  placeholder="Ej. Diseño web, Consultoría de marketing, Desarrollo de app..."
                  className={inputClass}
                  onKeyDown={(e) => e.key === "Enter" && next()}
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: Contexto ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="font-heading text-2xl font-bold text-secondary">Cuéntanos el proyecto</h1>
                <p className="text-sm text-muted">Cuanta más información, mejor será la propuesta generada</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">
                  Descripción del proyecto <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  rows={4}
                  autoFocus
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder="Describe el proyecto, el contexto del cliente y qué necesita..."
                  className={textareaClass}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">
                  Objetivos del cliente <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="goals"
                  rows={3}
                  value={form.goals}
                  onChange={handleInputChange}
                  placeholder="¿Qué resultados espera lograr el cliente con este proyecto?"
                  className={textareaClass}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">
                  Entregables específicos{" "}
                  <span className="text-muted font-normal">(opcional, pero mejora la precisión)</span>
                </label>
                <textarea
                  name="specific_deliverables"
                  rows={3}
                  value={form.specific_deliverables}
                  onChange={handleInputChange}
                  placeholder="Ej. &#x0a;- Web de 5 páginas responsive&#x0a;- Panel de administración&#x0a;- Integración con pasarela de pago&#x0a;- 1 mes de soporte post-lanzamiento"
                  className={textareaClass}
                />
              </div>
            </div>
          )}

          {/* ── STEP 4: Detalles y personalización ── */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="font-heading text-2xl font-bold text-secondary">Últimos detalles</h1>
                <p className="text-sm text-muted">Cronograma, precio, condiciones y cómo debe sonar la propuesta</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-secondary">
                    Cronograma <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="timeline"
                    type="text"
                    autoFocus
                    value={form.timeline}
                    onChange={handleInputChange}
                    placeholder="Ej. 4 semanas, 3 meses..."
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-secondary">
                    Precio <span className="text-muted font-normal">(opcional)</span>
                  </label>
                  <input
                    name="price"
                    type="text"
                    value={form.price}
                    onChange={handleInputChange}
                    placeholder="Ej. €2.500, €800/mes..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">
                  Condiciones de pago <span className="text-muted font-normal">(opcional)</span>
                </label>
                <input
                  name="payment_terms"
                  type="text"
                  value={form.payment_terms}
                  onChange={handleInputChange}
                  placeholder="Ej. 50% al inicio, 50% a la entrega. Factura mensual..."
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">Tono de la propuesta</label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => set("tone", t.value)}
                      className={`flex flex-col gap-0.5 px-4 py-3 rounded-xl border text-left transition-colors ${
                        form.tone === t.value
                          ? "border-primary bg-primary/5"
                          : "border-border bg-surface hover:border-gray-300"
                      }`}
                    >
                      <span className={`text-xs font-semibold ${form.tone === t.value ? "text-primary" : "text-secondary"}`}>
                        {t.label}
                      </span>
                      <span className="text-xs text-muted">{TONE_DESCRIPTIONS[t.value]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-secondary">Longitud</label>
                  <div className="flex gap-2">
                    {LENGTHS.map((l) => (
                      <button
                        key={l.value}
                        type="button"
                        onClick={() => set("length", l.value)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-colors ${
                          form.length === l.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted hover:border-gray-300"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-secondary">Idioma</label>
                  <div className="flex gap-2 flex-wrap">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.value}
                        type="button"
                        onClick={() => set("language", l.value)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-colors ${
                          form.language === l.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted hover:border-gray-300"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={back}
                className="flex-1 py-3 rounded-full border border-border text-sm font-medium text-secondary hover:border-gray-400 transition-colors"
              >
                Atrás
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={next}
                className="flex-1 py-3 rounded-full bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 rounded-full bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none"
              >
                {loading ? "Generando propuesta con IA..." : "Generar propuesta"}
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
