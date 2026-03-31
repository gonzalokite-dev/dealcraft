const testimonials = [
  {
    quote:
      "Antes tardaba un día entero en armar una propuesta decente. Con DealCraft lo hago en 10 minutos y el cliente ni nota que usé IA — sigue sonando como yo.",
    name: "Valentina Roca",
    role: "Consultora de marketing digital",
    initials: "VR",
    color: "from-blue-400 to-indigo-500",
  },
  {
    quote:
      "La diferencia en conversión fue inmediata. El lenguaje es más persuasivo y estructurado de lo que yo lograba solo. Ya cerré 3 proyectos con propuestas generadas aquí.",
    name: "Andrés Fuentes",
    role: "Diseñador UX freelance",
    initials: "AF",
    color: "from-violet-400 to-purple-500",
  },
  {
    quote:
      "Por fin mis propuestas tienen mi logo y mis colores sin meterme a Word. El PDF queda limpio y profesional. Mis clientes preguntan si tengo diseñador.",
    name: "Carolina Mejía",
    role: "Consultora de RRHH independiente",
    initials: "CM",
    color: "from-emerald-400 to-teal-500",
  },
];

const badges = ["Datos cifrados", "Sin contratos anuales", "Cancela cuando quieras", "Soporte por email"];

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
    <section className="py-24 sm:py-32 px-4 sm:px-6 bg-surface">
      <div className="max-w-7xl mx-auto">

        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-6">
          03 — Testimonios
        </p>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-secondary leading-tight">
            Lo que dicen quienes<br />ya lo usan.
          </h2>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Stars />
            <span className="text-sm font-semibold text-secondary">4.9</span>
            <span className="text-xs text-muted">de más de 200 reseñas</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-background rounded-2xl border border-border p-6 flex flex-col gap-5 hover:border-gray-300 hover:shadow-card transition-all group"
            >
              <Stars />

              {/* Quote */}
              <div className="flex-1">
                <p className="text-xl text-primary/20 font-heading font-bold leading-none mb-2 select-none">&ldquo;</p>
                <p className="text-sm text-secondary leading-relaxed">
                  {t.quote}
                </p>
              </div>

              {/* Author */}
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

        {/* Trust badges */}
        <div className="flex flex-wrap gap-3 mt-12">
          {badges.map((badge) => (
            <span
              key={badge}
              className="text-xs text-muted border border-border rounded-full px-4 py-2 flex items-center gap-1.5"
            >
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
