"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PROPOSAL_TYPES, SECTORS, TONES, LENGTHS, LANGUAGES } from "@/lib/proposals/constants";

interface FormData {
  // Step 1 — Client
  client_name: string;
  client_company: string;
  client_email: string;
  // Step 2 — Project type
  proposal_type: string;
  sector: string;
  sector_custom: string;
  service_type: string;
  // Step 3 — Context
  description: string;
  goals: string;
  specific_deliverables: string;
  // Step 4 — Dynamic timeline (shared price / payment)
  price: string;
  payment_terms: string;
  // proyecto_puntual
  project_duration: string;
  project_phases: string;
  // servicios_recurrentes
  monthly_deliverables: string;
  contract_duration: string;
  // consultoria
  session_format: string;
  num_sessions: string;
  delivery_format: string;
  // retencion_mensual
  included_hours: string;
  response_time: string;
  min_contract_duration: string;
  // colaboracion
  dedication: string;
  collaboration_duration: string;
  collaboration_format: string;
  // Step 4 — Style
  tone: string;
  length: string;
  language: string;
}

const initialForm: FormData = {
  client_name: "", client_company: "", client_email: "",
  proposal_type: "proyecto_puntual", sector: "", sector_custom: "", service_type: "",
  description: "", goals: "", specific_deliverables: "",
  price: "", payment_terms: "",
  project_duration: "", project_phases: "",
  monthly_deliverables: "", contract_duration: "",
  session_format: "", num_sessions: "", delivery_format: "",
  included_hours: "", response_time: "", min_contract_duration: "",
  dedication: "", collaboration_duration: "", collaboration_format: "",
  tone: "formal_ejecutivo", length: "estandar", language: "es",
};

const TOTAL_STEPS = 4;

const PROPOSAL_TYPE_ICONS: Record<string, string> = {
  proyecto_puntual: "◆", servicios_recurrentes: "↻",
  consultoria: "◎", retencion_mensual: "▣", colaboracion: "⬡",
};

const TONE_DESCRIPTIONS: Record<string, string> = {
  formal_ejecutivo: "Corporativo y estructurado",
  cercano_directo: "Ágil y sin rodeos",
  tecnico_detallado: "Con profundidad técnica",
  empatico_consultivo: "Centrado en el cliente",
};

const PRICE_CONFIG: Record<string, { label: string; placeholder: string }> = {
  proyecto_puntual:      { label: "Precio total",          placeholder: "Ej. 3.500 €" },
  servicios_recurrentes: { label: "Cuota mensual",          placeholder: "Ej. 800 €/mes" },
  consultoria:           { label: "Precio total o por sesión", placeholder: "Ej. 200 €/sesión" },
  retencion_mensual:     { label: "Fee mensual",            placeholder: "Ej. 1.500 €/mes" },
  colaboracion:          { label: "Tarifa",                 placeholder: "Ej. 60 €/hora" },
};

function DynamicTimelineFields({
  form, inputClass, textareaClass, set, handleInput,
}: {
  form: FormData;
  inputClass: string;
  textareaClass: string;
  set: (k: keyof FormData, v: string) => void;
  handleInput: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  const t = form.proposal_type;

  if (t === "proyecto_puntual") return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-medium text-secondary">Duración del proyecto <span className="text-red-400">*</span></label>
        <input name="project_duration" type="text" value={form.project_duration} onChange={handleInput} autoFocus
          placeholder="Ej. 4 semanas, 2 meses..." className={inputClass} />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-secondary">Fases o hitos <span className="text-muted font-normal">(opcional)</span></label>
        <textarea name="project_phases" rows={3} value={form.project_phases} onChange={handleInput}
          placeholder="Ej.&#x0a;Semana 1-2: diseño y wireframes&#x0a;Semana 3-4: desarrollo&#x0a;Semana 5: revisiones y entrega" className={textareaClass} />
      </div>
    </div>
  );

  if (t === "servicios_recurrentes") return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-medium text-secondary">Entregables mensuales <span className="text-red-400">*</span></label>
        <textarea name="monthly_deliverables" rows={3} value={form.monthly_deliverables} onChange={handleInput} autoFocus
          placeholder="Ej.&#x0a;- 8 publicaciones en RRSS&#x0a;- 1 informe mensual de resultados&#x0a;- Gestión de comunidad" className={textareaClass} />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-secondary">Duración del contrato <span className="text-red-400">*</span></label>
        <input name="contract_duration" type="text" value={form.contract_duration} onChange={handleInput}
          placeholder="Ej. 6 meses, 1 año, indefinido con preaviso de 30 días..." className={inputClass} />
      </div>
    </div>
  );

  if (t === "consultoria") return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-medium text-secondary">Formato de las sesiones <span className="text-red-400">*</span></label>
        <input name="session_format" type="text" value={form.session_format} onChange={handleInput} autoFocus
          placeholder="Ej. 2h semanales vía videollamada, 1 día presencial..." className={inputClass} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-secondary">Nº de sesiones o días</label>
          <input name="num_sessions" type="text" value={form.num_sessions} onChange={handleInput}
            placeholder="Ej. 8 sesiones, 3 días..." className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-secondary">Formato de entrega</label>
          <input name="delivery_format" type="text" value={form.delivery_format} onChange={handleInput}
            placeholder="Ej. Informe + presentación" className={inputClass} />
        </div>
      </div>
    </div>
  );

  if (t === "retencion_mensual") return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-secondary">Horas incluidas al mes</label>
          <input name="included_hours" type="text" value={form.included_hours} onChange={handleInput} autoFocus
            placeholder="Ej. 20 horas/mes" className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-secondary">Tiempo de respuesta garantizado</label>
          <input name="response_time" type="text" value={form.response_time} onChange={handleInput}
            placeholder="Ej. 24-48 horas hábiles" className={inputClass} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-secondary">Duración mínima <span className="text-red-400">*</span></label>
        <input name="min_contract_duration" type="text" value={form.min_contract_duration} onChange={handleInput}
          placeholder="Ej. 3 meses mínimo, renovación automática mensual" className={inputClass} />
      </div>
    </div>
  );

  if (t === "colaboracion") return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-secondary">Dedicación semanal <span className="text-red-400">*</span></label>
          <input name="dedication" type="text" value={form.dedication} onChange={handleInput} autoFocus
            placeholder="Ej. 10h/semana, 2 días/semana" className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-secondary">Duración <span className="text-red-400">*</span></label>
          <input name="collaboration_duration" type="text" value={form.collaboration_duration} onChange={handleInput}
            placeholder="Ej. 3 meses, indefinido..." className={inputClass} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-secondary">Formato de trabajo</label>
        <input name="collaboration_format" type="text" value={form.collaboration_format} onChange={handleInput}
          placeholder="Ej. Remoto, reunión semanal de seguimiento vía Meet" className={inputClass} />
      </div>
    </div>
  );

  return null;
}

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

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    set(e.target.name as keyof FormData, e.target.value);
  }

  function validateStep(): string {
    if (step === 1 && !form.client_name.trim()) return "El nombre del cliente es obligatorio.";
    if (step === 2 && !form.service_type.trim()) return "El tipo de servicio es obligatorio.";
    if (step === 3) {
      if (!form.description.trim()) return "La descripción del proyecto es obligatoria.";
      if (!form.goals.trim()) return "Los objetivos del cliente son obligatorios.";
    }
    if (step === 4) {
      const t = form.proposal_type;
      if (t === "proyecto_puntual" && !form.project_duration.trim()) return "La duración del proyecto es obligatoria.";
      if (t === "servicios_recurrentes") {
        if (!form.monthly_deliverables.trim()) return "Los entregables mensuales son obligatorios.";
        if (!form.contract_duration.trim()) return "La duración del contrato es obligatoria.";
      }
      if (t === "consultoria" && !form.session_format.trim()) return "El formato de las sesiones es obligatorio.";
      if (t === "retencion_mensual" && !form.min_contract_duration.trim()) return "La duración mínima es obligatoria.";
      if (t === "colaboracion") {
        if (!form.dedication.trim()) return "La dedicación semanal es obligatoria.";
        if (!form.collaboration_duration.trim()) return "La duración de la colaboración es obligatoria.";
      }
    }
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
  const priceConf = PRICE_CONFIG[form.proposal_type] ?? PRICE_CONFIG["proyecto_puntual"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-surface flex-shrink-0">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-heading font-bold text-lg text-secondary tracking-tight">DealCraft</Link>
          <Link href="/dashboard" className="text-sm text-muted hover:text-secondary transition-colors">Cancelar</Link>
        </div>
      </header>

      <div className="h-1 bg-border flex-shrink-0">
        <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <p className="text-xs text-muted mb-2 text-center tracking-widest uppercase">Paso {step} de {TOTAL_STEPS}</p>

          {/* ── STEP 1: Cliente ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="font-heading text-2xl font-bold text-secondary">¿Para quién es esta propuesta?</h1>
                <p className="text-sm text-muted">Indica los datos del cliente al que va dirigida</p>
              </div>
              <div className="space-y-3">
                <input name="client_name" type="text" autoFocus value={form.client_name} onChange={handleInput}
                  placeholder="Nombre del cliente *" className={inputClass} onKeyDown={(e) => e.key === "Enter" && next()} />
                <input name="client_company" type="text" value={form.client_company} onChange={handleInput}
                  placeholder="Empresa (opcional)" className={inputClass} onKeyDown={(e) => e.key === "Enter" && next()} />
                <input name="client_email" type="email" value={form.client_email} onChange={handleInput}
                  placeholder="Email del cliente (opcional)" className={inputClass} onKeyDown={(e) => e.key === "Enter" && next()} />
              </div>
            </div>
          )}

          {/* ── STEP 2: Proyecto ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="font-heading text-2xl font-bold text-secondary">¿Qué tipo de proyecto es?</h1>
                <p className="text-sm text-muted">Esto define la estructura y los campos de la propuesta</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PROPOSAL_TYPES.map((t) => (
                  <button key={t.value} type="button" onClick={() => set("proposal_type", t.value)}
                    className={`flex flex-col gap-1 px-4 py-3 rounded-xl border text-left transition-colors ${
                      form.proposal_type === t.value ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-gray-300"}`}>
                    <span className="text-base">{PROPOSAL_TYPE_ICONS[t.value]}</span>
                    <span className={`text-xs font-semibold leading-tight ${form.proposal_type === t.value ? "text-primary" : "text-secondary"}`}>{t.label}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">Sector</label>
                <div className="flex flex-wrap gap-2">
                  {SECTORS.map((s) => (
                    <button key={s} type="button" onClick={() => set("sector", s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        form.sector === s ? "border-primary bg-primary/5 text-primary" : "border-border text-muted hover:border-gray-300 hover:text-secondary"}`}>
                      {s}
                    </button>
                  ))}
                </div>
                {form.sector === "Otro" && (
                  <input name="sector_custom" type="text" value={form.sector_custom} onChange={handleInput}
                    placeholder="Especifica el sector..." className={inputClass} />
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">¿Qué servicio ofreces? <span className="text-red-400">*</span></label>
                <input name="service_type" type="text" value={form.service_type} onChange={handleInput}
                  placeholder="Ej. Diseño web, Consultoría de marketing, Desarrollo de app..." className={inputClass}
                  onKeyDown={(e) => e.key === "Enter" && next()} />
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
                <label className="text-xs font-medium text-secondary">Descripción del proyecto <span className="text-red-400">*</span></label>
                <textarea name="description" rows={4} autoFocus value={form.description} onChange={handleInput}
                  placeholder="Describe el proyecto, el contexto del cliente y qué necesita..." className={textareaClass} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">Objetivos del cliente <span className="text-red-400">*</span></label>
                <textarea name="goals" rows={3} value={form.goals} onChange={handleInput}
                  placeholder="¿Qué resultados espera lograr el cliente con este proyecto?" className={textareaClass} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">
                  Entregables específicos <span className="text-muted font-normal">(opcional, mejora la precisión)</span>
                </label>
                <textarea name="specific_deliverables" rows={3} value={form.specific_deliverables} onChange={handleInput}
                  placeholder="Lista los entregables concretos que el cliente recibirá..." className={textareaClass} />
              </div>
            </div>
          )}

          {/* ── STEP 4: Condiciones dinámicas ── */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="font-heading text-2xl font-bold text-secondary">Condiciones del proyecto</h1>
                <p className="text-sm text-muted">
                  {form.proposal_type === "proyecto_puntual" && "Duración, precio y tono de la propuesta"}
                  {form.proposal_type === "servicios_recurrentes" && "Entregables mensuales, duración y precio"}
                  {form.proposal_type === "consultoria" && "Formato de sesiones, precio y estilo"}
                  {form.proposal_type === "retencion_mensual" && "Fee, horas incluidas y duración mínima"}
                  {form.proposal_type === "colaboracion" && "Dedicación, duración y formato de trabajo"}
                </p>
              </div>

              {/* Dynamic fields per proposal type */}
              <DynamicTimelineFields form={form} inputClass={inputClass} textareaClass={textareaClass} set={set} handleInput={handleInput} />

              {/* Price + payment (shared) */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-secondary">
                    {priceConf.label} <span className="text-muted font-normal">(opcional)</span>
                  </label>
                  <input name="price" type="text" value={form.price} onChange={handleInput}
                    placeholder={priceConf.placeholder} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-secondary">
                    Condiciones de pago <span className="text-muted font-normal">(opcional)</span>
                  </label>
                  <input name="payment_terms" type="text" value={form.payment_terms} onChange={handleInput}
                    placeholder="Ej. 50% inicio, 50% entrega..." className={inputClass} />
                </div>
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-secondary">Tono de la propuesta</label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <button key={t.value} type="button" onClick={() => set("tone", t.value)}
                      className={`flex flex-col gap-0.5 px-4 py-3 rounded-xl border text-left transition-colors ${
                        form.tone === t.value ? "border-primary bg-primary/5" : "border-border bg-surface hover:border-gray-300"}`}>
                      <span className={`text-xs font-semibold ${form.tone === t.value ? "text-primary" : "text-secondary"}`}>{t.label}</span>
                      <span className="text-xs text-muted">{TONE_DESCRIPTIONS[t.value]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Length + Language */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-secondary">Longitud</label>
                  <div className="flex gap-2">
                    {LENGTHS.map((l) => (
                      <button key={l.value} type="button" onClick={() => set("length", l.value)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-colors ${
                          form.length === l.value ? "border-primary bg-primary/5 text-primary" : "border-border text-muted hover:border-gray-300"}`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-secondary">Idioma</label>
                  <div className="flex gap-2 flex-wrap">
                    {LANGUAGES.map((l) => (
                      <button key={l.value} type="button" onClick={() => set("language", l.value)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-colors ${
                          form.language === l.value ? "border-primary bg-primary/5 text-primary" : "border-border text-muted hover:border-gray-300"}`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>
          )}

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button type="button" onClick={back}
                className="flex-1 py-3 rounded-full border border-border text-sm font-medium text-secondary hover:border-gray-400 transition-colors">
                Atrás
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button type="button" onClick={next}
                className="flex-1 py-3 rounded-full bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99]">
                Continuar
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading}
                className="flex-1 py-3 rounded-full bg-primary text-white text-sm font-medium hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none">
                {loading ? "Generando propuesta con IA..." : "Generar propuesta"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
