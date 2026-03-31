const testimonials = [
  {
    quote:
      "Antes tardaba entre 3 y 4 horas en hacer una propuesta decente para un cliente nuevo. Ahora lo tengo en 10 minutos y con un contrato incluido. El cliente ni nota que usé IA — suena exactamente como yo.",
    name: "Valentina Roca",
    role: "Consultora de marketing digital · Autónoma",
    initials: "VR",
    color: "from-blue-400 to-indigo-500",
  },
  {
    quote:
      "La diferencia en conversión fue inmediata. Las propuestas tienen una estructura que yo nunca lograba sola y el lenguaje cierra mucho mejor. Desde que uso DealCraft he cerrado 4 contratos de retención mensual.",
    name: "Andrés Fuentes",
    role: "Consultor de estrategia digital · Freelance",
    initials: "AF",
    color: "from-violet-400 to-purple-500",
  },
  {
    quote:
      "Llevamos una pequeña agencia de comunicación y enviamos propuestas cada semana. DealCraft nos ha ahorrado literalmente un día de trabajo a la semana. El PDF queda tan bien que los clientes preguntan si tenemos diseñador.",
    name: "Carolina Mejía",
    role: "Socia directora · Agencia de comunicación",
    initials: "CM",
    color: "from-emerald-400 to-teal-500",
  },
  {
    quote:
      "Lo que más me gusta es poder generar el contrato directamente desde la propuesta. Antes ese era el cuello de botella — tardaba días en tenerlo. Ahora lo entrego todo junto y el proceso va mucho más fluido.",
    name: "Jorge Linares",
    role: "Desarrollador web · Autónomo",
    initials: "JL",
    color: "from-amber-400 to-orange-500",
  },
];

const badges = ["Datos cifrados", "Sin contratos anuales", "Cancela cuando quieras", "Soporte por email", "GDPR compliant"];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 14 14" fill="currentColor">
          <path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9 3 11.5l1.5-4L1 5h4.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">

        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-6">
          05 — Testimonios
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-secondary leading-tight">
            Lo que dicen autónomos<br />y empresas que ya lo usan.
          </h2>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Stars />
            <span className="text-sm font-semibold text-secondary">4.9</span>
            <span className="text-xs text-muted">de más de 200 reseñas</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <div key={t.name}
              className="bg-surface rounded-2xl border border-border p-6 flex flex-col gap-5 hover:border-gray-300 hover:shadow-card transition-all">
              <Stars />
              <div className="flex-1">
                <p className="text-xl text-primary/20 font-heading font-bold leading-none mb-2 select-none">&ldquo;</p>
                <p className="text-sm text-secondary leading-relaxed">{t.quote}</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-semibold text-xs font-heading">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-secondary">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-12">
          {badges.map((badge) => (
            <span key={badge}
              className="text-xs text-muted border border-border rounded-full px-4 py-2 flex items-center gap-1.5">
              <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
              </svg>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
