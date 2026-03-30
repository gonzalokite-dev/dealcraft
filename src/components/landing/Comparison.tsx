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
    problem: "Sin historial ni control — las propuestas se pierden en la carpeta de Documentos",
    solution: "Dashboard centralizado, todo editable y siempre disponible",
  },
];

export default function Comparison() {
  return (
    <section id="diferencias" className="py-24 sm:py-32 px-4 sm:px-6 bg-surface">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-6">
          01 — El problema
        </p>

        {/* Header row */}
        <div className="grid grid-cols-[1fr_1fr] gap-6 mb-3 pl-0">
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
        <div className="grid grid-cols-[1fr_1fr] gap-6 mt-12 mb-2 border-b border-border pb-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Sin DealCraft</p>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Con DealCraft</p>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr] gap-6 py-6">
              <p className="text-sm text-muted leading-relaxed">{row.problem}</p>
              <p className="text-sm text-secondary font-medium leading-relaxed">{row.solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
