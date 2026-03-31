const rows = [
  {
    problem: "Horas redactando la misma propuesta una y otra vez desde cero",
    solution: "Propuesta completa generada por IA en menos de 2 minutos",
  },
  {
    problem: "Plantillas genéricas que no reflejan tu voz ni el valor que aportas",
    solution: "Redacción persuasiva adaptada a tu sector, tono y tipo de proyecto",
  },
  {
    problem: "El cliente no sabe si ha leído la propuesta — correos sin respuesta",
    solution: "Enlace con seguimiento: sabes exactamente cuándo la abre y si la aprueba",
  },
  {
    problem: "Sin contrato o con uno genérico que no protege tu trabajo",
    solution: "Contrato de prestación de servicios generado automáticamente desde la propuesta",
  },
  {
    problem: "Propuestas perdidas en el escritorio sin historial ni control",
    solution: "Dashboard centralizado con todos los estados, editable siempre",
  },
  {
    problem: "PDF sin branding — logo y colores añadidos a mano cada vez",
    solution: "Tu identidad visual aplicada automáticamente en cada exportación",
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
              Así se hacen propuestas<br />hoy. A mano. Perdiendo tiempo.
            </h2>
            <p className="text-muted text-sm mt-3 max-w-sm leading-relaxed">
              El proceso comercial de la mayoría de autónomos y empresas de servicios sigue siendo caótico, lento y poco profesional.
            </p>
          </div>
          <div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary leading-tight">
              Con DealCraft.
            </h2>
            <p className="text-muted text-sm mt-3 max-w-sm leading-relaxed">
              Propuestas y contratos que se generan solos, con tu marca y listos para cerrar proyectos desde el primer envío.
            </p>
          </div>
        </div>

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

        <div className="divide-y divide-border">
          {rows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr] gap-4 py-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-400 font-bold leading-none" style={{ fontSize: "8px" }}>✕</span>
                </span>
                <p className="text-sm text-muted leading-relaxed">{row.problem}</p>
              </div>
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
