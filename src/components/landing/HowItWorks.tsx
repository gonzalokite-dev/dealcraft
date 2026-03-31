const steps = [
  {
    number: "01",
    title: "Describe el proyecto",
    description:
      "Rellena un formulario inteligente: cliente, tipo de servicio, objetivos, alcance y precio. Menos de 3 minutos.",
    mockup: "form",
  },
  {
    number: "02",
    title: "La IA redacta por ti",
    description:
      "DealCraft genera una propuesta completa y persuasiva en segundos — adaptada al sector, al tono y al tipo de proyecto.",
    mockup: "generating",
  },
  {
    number: "03",
    title: "Edita, envía y cierra",
    description:
      "Ajusta cualquier sección con un clic, exporta el PDF con tu marca y comparte el enlace directo con tu cliente.",
    mockup: "pdf",
  },
];

function FormMockup() {
  return (
    <div className="bg-background rounded-xl border border-border p-4 space-y-3 mt-5">
      {[
        { label: "Cliente", value: "Acme Corporation" },
        { label: "Tipo de proyecto", value: "Retención mensual ▾", select: true },
        { label: "Inversión mensual", value: "€2.500 / mes" },
      ].map((f) => (
        <div key={f.label}>
          <p className="text-muted mb-1" style={{ fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{f.label}</p>
          <div className={`bg-white border rounded-lg px-3 py-2 flex items-center justify-between ${f.select ? "border-primary/40" : "border-border"}`}>
            <span className="text-secondary" style={{ fontSize: "11px" }}>{f.value}</span>
            {f.select && <span className="text-primary" style={{ fontSize: "9px" }}>↓</span>}
          </div>
        </div>
      ))}
      <div className="bg-primary text-white text-center rounded-lg py-2 mt-1" style={{ fontSize: "11px", fontWeight: 600 }}>
        Generar propuesta →
      </div>
    </div>
  );
}

function GeneratingMockup() {
  return (
    <div className="bg-background rounded-xl border border-border p-4 space-y-3 mt-5">
      <div className="flex items-center gap-2">
        <span className="text-primary animate-typing-dot" style={{ fontSize: "13px" }}>✦</span>
        <span className="text-secondary font-medium" style={{ fontSize: "11px" }}>Redactando propuesta</span>
        <span className="text-muted animate-typing-dot" style={{ fontSize: "11px", animationDelay: "0.2s" }}>...</span>
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-muted" style={{ fontSize: "9px" }}>Progreso</span>
          <span className="text-primary font-semibold" style={{ fontSize: "9px" }}>78%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-shimmer-bar" />
        </div>
      </div>
      {[
        { label: "Introducción y contexto", done: true },
        { label: "Solución propuesta", done: true },
        { label: "Entregables y cronograma", done: false },
        { label: "Precio y cierre", done: false },
      ].map((s) => (
        <div key={s.label} className="flex items-center gap-2">
          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${s.done ? "bg-accent/20" : "bg-gray-200"}`}>
            {s.done && (
              <svg className="w-2 h-2 text-accent" fill="none" viewBox="0 0 8 8" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M1 4l2 2 4-4" />
              </svg>
            )}
          </div>
          <span className={s.done ? "text-secondary" : "text-muted"} style={{ fontSize: "10px" }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

function PdfMockup() {
  return (
    <div className="bg-background rounded-xl border border-border overflow-hidden mt-5">
      <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#1B2A3A" }}>
        <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
          <span className="text-white font-bold font-heading" style={{ fontSize: "7px" }}>DC</span>
        </div>
        <div>
          <p className="text-white font-medium leading-none" style={{ fontSize: "10px" }}>Acme Corporation</p>
          <p className="leading-none mt-0.5" style={{ color: "rgba(255,255,255,0.4)", fontSize: "8px" }}>Retención mensual · Marketing</p>
        </div>
        <div className="ml-auto">
          <span className="font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.2)", color: "#22C55E", fontSize: "8px" }}>✓ Lista</span>
        </div>
      </div>
      <div className="px-4 py-3 space-y-1.5">
        <div className="h-1.5 bg-gray-200 rounded-full" />
        <div className="h-1.5 bg-gray-200 rounded-full w-4/5" />
        <div className="h-1.5 bg-gray-200 rounded-full w-3/5" />
      </div>
      <div className="px-4 pb-3 flex gap-2">
        <div className="flex-1 border border-border text-secondary text-center py-2 rounded-lg" style={{ fontSize: "10px", fontWeight: 500 }}>
          Compartir enlace
        </div>
        <div className="flex-1 bg-primary text-white rounded-lg py-2 flex items-center justify-center gap-1.5" style={{ fontSize: "10px", fontWeight: 600 }}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 1v7M3 5l3 3 3-3M1 11h10" />
          </svg>
          Exportar PDF
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 sm:py-32 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">

        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-6">
          02 — Cómo funciona
        </p>

        <div className="grid lg:grid-cols-2 gap-8 mb-16 items-end">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-secondary leading-tight">
            De brief a propuesta ganadora{" "}
            <em className="not-italic text-primary">en menos de 5 minutos.</em>
          </h2>
          <p className="text-muted text-base leading-relaxed lg:max-w-sm lg:ml-auto">
            Sin curva de aprendizaje. Sin plantillas que adaptar.
            Rellenas el formulario, DealCraft hace el resto — y tú te llevas el proyecto.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-surface border border-border rounded-2xl p-6 flex flex-col hover:border-gray-300 hover:shadow-card transition-all"
            >
              <span className="font-heading text-5xl font-bold select-none" style={{ color: "#E8E4DE" }}>
                {step.number}
              </span>
              <div className="h-px bg-border mt-4 mb-5" />
              <h3 className="font-heading text-lg font-semibold text-secondary">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mt-2">
                {step.description}
              </p>
              {step.mockup === "form" && <FormMockup />}
              {step.mockup === "generating" && <GeneratingMockup />}
              {step.mockup === "pdf" && <PdfMockup />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
