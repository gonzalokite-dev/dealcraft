const profiles = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6V5a3 3 0 016 0v1m-6 0h6m-6 0H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-2m-6 0h6" />
      </svg>
    ),
    title: "Autónomo de servicios",
    subtitle: "Diseñador, desarrollador, copywriter, fotógrafo…",
    description: "Envías propuestas a clientes nuevos cada semana. Necesitas que sean rápidas, profesionales y que cierren — sin que parezcan una plantilla de Word.",
    items: [
      "Propuesta lista en 2 minutos",
      "PDF con tu marca y colores",
      "Seguimiento de apertura en tiempo real",
      "Contrato de prestación adjunto al cerrar",
    ],
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3m2 0v-5a1 1 0 011-1h2a1 1 0 011 1v5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h6" />
      </svg>
    ),
    title: "Consultor o agencia",
    subtitle: "Marketing, estrategia, RRHH, IT, legal…",
    description: "Gestionas múltiples clientes y proyectos en paralelo. Cada propuesta tiene que ser personalizada, pero no puedes dedicar horas a cada una.",
    items: [
      "5 tipos de propuesta por modelo de negocio",
      "Duplica y adapta propuestas en segundos",
      "Editor con IA por sección para ajustar el tono",
      "Dashboard centralizado con todos los estados",
    ],
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Empresa con servicios recurrentes",
    subtitle: "Retenciones mensuales, SaaS, mantenimientos…",
    description: "Vendes cuotas mensuales o contratos de mantenimiento. Necesitas propuestas que justifiquen el valor y contratos que protejan la relación a largo plazo.",
    items: [
      "Tipo de propuesta específico para retenciones",
      "Contratos con cláusulas de duración mínima",
      "Enlace de aprobación que el cliente firma online",
      "Historial completo por cliente",
    ],
  },
];

export default function UseCases() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 bg-surface">
      <div className="max-w-7xl mx-auto">

        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-6">
          04 — Para quién
        </p>

        <div className="grid lg:grid-cols-2 gap-8 mb-16 items-end">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-secondary leading-tight">
            Hecho para quien vive
            <br />
            <em className="not-italic text-primary">de sus propuestas.</em>
          </h2>
          <p className="text-muted text-base leading-relaxed lg:max-w-sm lg:ml-auto">
            Da igual si eres autónomo, consultor o tienes una pequeña agencia.
            Si propones servicios y necesitas cerrar proyectos, DealCraft es para ti.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {profiles.map((p) => (
            <div key={p.title} className="bg-background border border-border rounded-2xl p-7 flex flex-col gap-5 hover:border-gray-300 hover:shadow-card transition-all group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary/12 transition-colors">
                  {p.icon}
                </div>
                <h3 className="font-heading font-bold text-secondary text-lg mt-4">{p.title}</h3>
                <p className="text-xs text-muted mt-1">{p.subtitle}</p>
              </div>
              <p className="text-sm text-muted leading-relaxed border-t border-border pt-5">{p.description}</p>
              <ul className="space-y-2.5">
                {p.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-secondary">
                    <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 8l4 4 7-7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
