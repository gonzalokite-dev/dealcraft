const rows = [
  {
    problem: "Plantillas genéricas que no reflejan tu voz ni tu negocio",
    solution: "Propuestas únicas generadas con el tono y estilo de tu marca",
  },
  {
    problem: "Horas redactando la misma estructura una y otra vez",
    solution: "Generación completa en menos de 2 minutos",
  },
  {
    problem: "Sin branding propio — logo y colores que hay que agregar a mano",
    solution: "Tu logo, colores e identidad aplicados automáticamente al PDF",
  },
  {
    problem: "Lenguaje de relleno que no convierte ni cierra proyectos",
    solution: "Texto persuasivo, profesional y orientado al cierre",
  },
  {
    problem: "Sin historial ni control — las propuestas se pierden en el escritorio",
    solution: "Dashboard centralizado, todo editable y siempre disponible",
  },
];

export default function Comparison() {
  return (
    <section id="diferencias" className="py-24 sm:py-32 px-4 sm:px-6 bg-surface">
      <div className="max-w-7xl mx-auto">

        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-6">
          01 — El problema
        </p>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-secondary leading-tight">
              Así se hacen propuestas hoy.
            </h2>
            <p className="text-muted text-sm mt-2">Sin herramientas. A mano. Perdiendo tiempo.</p>
          </div>
          <div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary leading-tight">
              Con DealCraft.
            </h2>
            <p className="text-muted text-sm mt-2">Rápido, profesional, con tu marca.</p>
          </div>
        </div>

        {/* Column labels */}
        <div className="grid grid-cols-[1fr_1fr] gap-4 mb-1">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-gray-500 font-bold leading-none" style={{ fontSize: "9px" }}>✕</span>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Sin DealCraft</p>
          </div>
          <div className="flex items-center gap-2 pb-3 border-b border-primary/20">
            <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 text-primary" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 5l2.5 2.5 5-5" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">Con DealCraft</p>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr] gap-4 py-5 group">
              {/* Problem */}
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 font-bold leading-none" style={{ fontSize: "8px" }}>✕</span>
                </span>
                <p className="text-sm text-muted leading-relaxed">{row.problem}</p>
              </div>
              {/* Solution */}
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-accent" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 5l2.5 2.5 5-5" />
                  </svg>
                </span>
                <p className="text-sm text-secondary font-medium leading-relaxed">{row.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
