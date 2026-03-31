const profiles = [
  {
    emoji: "💼",
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
    emoji: "🏢",
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
    emoji: "🔄",
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
            <div key={p.title} className="bg-background border border-border rounded-2xl p-7 flex flex-col gap-5 hover:border-gray-300 hover:shadow-card transition-all">
              <div>
                <span className="text-3xl">{p.emoji}</span>
                <h3 className="font-heading font-bold text-secondary text-lg mt-3">{p.title}</h3>
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
