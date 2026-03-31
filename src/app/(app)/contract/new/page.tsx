"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CONTRACT_TYPES, IP_OWNERSHIP_OPTIONS, LANGUAGES } from "@/lib/proposals/constants";

interface FormData {
  // Client
  client_name: string;
  client_company: string;
  client_email: string;
  client_nif: string;
  client_address: string;
  // Provider
  provider_name: string;
  provider_nif: string;
  provider_address: string;
  // Service
  contract_type: string;
  service_description: string;
  deliverables: string;
  start_date: string;
  duration: string;
  // Conditions
  price: string;
  payment_terms: string;
  includes_nda: boolean;
  ip_ownership: string;
  jurisdiction: string;
  language: string;
}

const initialForm: FormData = {
  client_name: "",
  client_company: "",
  client_email: "",
  client_nif: "",
  client_address: "",
  provider_name: "",
  provider_nif: "",
  provider_address: "",
  contract_type: "prestacion_servicios",
  service_description: "",
  deliverables: "",
  start_date: "",
  duration: "",
  price: "",
  payment_terms: "",
  includes_nda: false,
  ip_ownership: "cliente",
  jurisdiction: "España",
  language: "es",
};

const TOTAL_STEPS = 3;

export default function NewContractPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setField(e.target.name as keyof FormData, e.target.value as never);
  }

  function validate(): string {
    if (step === 1) {
      if (!form.client_name.trim()) return "El nombre del cliente es obligatorio.";
      if (!form.provider_name.trim()) return "Tu nombre o razón social es obligatorio.";
    }
    if (step === 2 && !form.service_description.trim()) return "La descripción del servicio es obligatoria.";
    return "";
  }

  function next() {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function back() {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contracts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al generar el contrato.");
      }

      const { generated_content } = await res.json();

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: contract, error: insertError } = await supabase
        .from("contracts")
        .insert({
          user_id: user.id,
          client_name: form.client_name,
          client_company: form.client_company || null,
          client_email: form.client_email || null,
          contract_type: form.contract_type,
          input_data: form,
          generated_content,
        })
        .select("id")
        .single();

      if (insertError) throw new Error("Error al guardar el contrato.");

      router.push(`/contract/${contract.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
      setLoading(false);
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";
  const textareaClass = `${inputClass} resize-none`;
  const labelClass = "text-xs font-medium text-secondary";

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

          {/* ── STEP 1: Las partes ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="font-heading text-2xl font-bold text-secondary">Las partes del contrato</h1>
                <p className="text-sm text-muted">Datos del cliente y de quien presta el servicio</p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">El cliente</p>
                <input name="client_name" type="text" autoFocus value={form.client_name} onChange={handleInput}
                  placeholder="Nombre completo o razón social *" className={inputClass} />
                <div className="grid sm:grid-cols-2 gap-3">
                  <input name="client_company" type="text" value={form.client_company} onChange={handleInput}
                    placeholder="Empresa (si aplica)" className={inputClass} />
                  <input name="client_nif" type="text" value={form.client_nif} onChange={handleInput}
                    placeholder="NIF / CIF (opcional)" className={inputClass} />
                </div>
                <input name="client_email" type="email" value={form.client_email} onChange={handleInput}
                  placeholder="Email (opcional)" className={inputClass} />
                <input name="client_address" type="text" value={form.client_address} onChange={handleInput}
                  placeholder="Domicilio (opcional)" className={inputClass} />
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">El prestador (tú)</p>
                <input name="provider_name" type="text" value={form.provider_name} onChange={handleInput}
                  placeholder="Tu nombre completo o razón social *" className={inputClass} />
                <div className="grid sm:grid-cols-2 gap-3">
                  <input name="provider_nif" type="text" value={form.provider_nif} onChange={handleInput}
                    placeholder="NIF / CIF (opcional)" className={inputClass} />
                  <input name="provider_address" type="text" value={form.provider_address} onChange={handleInput}
                    placeholder="Domicilio (opcional)" className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: El servicio ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="font-heading text-2xl font-bold text-secondary">El servicio a contratar</h1>
                <p className="text-sm text-muted">Qué vas a hacer, cuánto dura y qué se entrega</p>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Tipo de contrato</label>
                <div className="grid grid-cols-2 gap-2">
                  {CONTRACT_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setField("contract_type", t.value)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-medium text-left transition-colors ${
                        form.contract_type === t.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-secondary hover:border-gray-300"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>
                  Descripción del servicio <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="service_description"
                  rows={4}
                  autoFocus
                  value={form.service_description}
                  onChange={handleInput}
                  placeholder="Describe detalladamente qué servicios se prestarán, metodología, alcance y exclusiones..."
                  className={textareaClass}
                />
              </div>

              <div className="space-y-2">
                <label className={labelClass}>
                  Entregables <span className="text-muted font-normal">(opcional)</span>
                </label>
                <textarea
                  name="deliverables"
                  rows={3}
                  value={form.deliverables}
                  onChange={handleInput}
                  placeholder="Lista los entregables concretos: diseños, código fuente, informes, etc."
                  className={textareaClass}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className={labelClass}>Fecha de inicio</label>
                  <input name="start_date" type="date" value={form.start_date} onChange={handleInput}
                    className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Duración</label>
                  <input name="duration" type="text" value={form.duration} onChange={handleInput}
                    placeholder="Ej. 3 meses, 6 semanas..." className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Condiciones ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="font-heading text-2xl font-bold text-secondary">Condiciones económicas y legales</h1>
                <p className="text-sm text-muted">Precio, pago, propiedad intelectual y jurisdicción</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className={labelClass}>Precio</label>
                  <input name="price" type="text" autoFocus value={form.price} onChange={handleInput}
                    placeholder="Ej. 3.000 €, 500 €/mes..." className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Forma de pago</label>
                  <input name="payment_terms" type="text" value={form.payment_terms} onChange={handleInput}
                    placeholder="50% inicio, 50% entrega..." className={inputClass} />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Propiedad intelectual de los entregables</label>
                <div className="space-y-2">
                  {IP_OWNERSHIP_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setField("ip_ownership", opt.value)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-colors ${
                        form.ip_ownership === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-gray-300"
                      }`}
                    >
                      <span className={`text-sm font-medium ${form.ip_ownership === opt.value ? "text-primary" : "text-secondary"}`}>
                        {opt.label}
                      </span>
                      <span className="text-xs text-muted max-w-[55%] text-right">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* NDA toggle */}
              <div className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-border bg-surface">
                <div>
                  <p className="text-sm font-medium text-secondary">Cláusula de confidencialidad (NDA)</p>
                  <p className="text-xs text-muted mt-0.5">Prohíbe compartir información confidencial entre las partes</p>
                </div>
                <button
                  type="button"
                  onClick={() => setField("includes_nda", !form.includes_nda)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                    form.includes_nda ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      form.includes_nda ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className={labelClass}>Jurisdicción</label>
                  <input name="jurisdiction" type="text" value={form.jurisdiction} onChange={handleInput}
                    placeholder="Ej. España, México D.F." className={inputClass} />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Idioma del contrato</label>
                  <div className="flex gap-2 flex-wrap">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.value}
                        type="button"
                        onClick={() => setField("language", l.value)}
                        className={`flex-1 py-2.5 rounded-lg border text-xs font-medium transition-colors ${
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
                {loading ? "Redactando contrato con IA..." : "Generar contrato"}
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
