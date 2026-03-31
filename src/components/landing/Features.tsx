const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Generación con IA en segundos",
    description: "Describe el proyecto y la IA redacta una propuesta completa, estructurada y persuasiva. Introducción, solución, entregables, precio y cierre — todo en menos de 2 minutos.",
    tag: "Core",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Contratos de prestación de servicios",
    description: "Genera contratos profesionales y legalmente estructurados directamente desde tus propuestas. Con cláusulas de propiedad intelectual, confidencialidad y firma.",
    tag: "Contratos",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: "Branding aplicado automáticamente",
    description: "Tu logo, colores corporativos y tipografía se aplican al PDF con un solo clic. Tu cliente recibe algo que parece hecho por un diseñador.",
    tag: "Marca",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "5 tipos de propuesta diferentes",
    description: "Proyecto puntual, retención mensual, consultoría, servicios recurrentes o colaboración. Cada tipo genera campos y estructura adaptada al modelo de negocio.",
    tag: "Flexibilidad",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: "Enlace público con seguimiento",
    description: "Comparte la propuesta con tu cliente por enlace. Recibirás una notificación en tiempo real cuando la abra o la apruebe — sin necesidad de enviar PDFs adjuntos.",
    tag: "Seguimiento",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: "Editor con IA por sección",
    description: "Regenera, acorta, amplía o hazlo más persuasivo sección a sección. La IA trabaja sobre el texto existente para que el resultado suene siempre a ti.",
    tag: "Editor",
  },
];

export default function Features() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">

        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-6">
          03 — Funcionalidades
        </p>

        <div className="grid lg:grid-cols-2 gap-8 mb-16 items-end">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-secondary leading-tight">
            Todo lo que necesitas
            <br />
            <em className="not-italic text-primary">para vender profesional.</em>
          </h2>
          <p className="text-muted text-base leading-relaxed lg:max-w-sm lg:ml-auto">
            Desde la primera propuesta hasta el contrato firmado.
            DealCraft cubre todo el ciclo comercial de un autónomo o empresa de servicios.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-surface border border-border rounded-2xl p-6 hover:border-gray-300 hover:shadow-card transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary/12 transition-colors">
                  {f.icon}
                </div>
                <span className="text-xs font-medium text-muted border border-border rounded-full px-2.5 py-1">
                  {f.tag}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-secondary text-base mb-2">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
