const testimonials = [
  {
    quote:
      "Antes tardaba un día entero en armar una propuesta decente. Con DealCraft lo hago en 10 minutos y el cliente ni nota que usé IA — sigue sonando como yo.",
    name: "Valentina Roca",
    role: "Consultora de marketing digital",
    initials: "VR",
  },
  {
    quote:
      "La diferencia en conversión fue inmediata. El lenguaje es más persuasivo y estructurado de lo que yo lograba solo. Ya cerré 3 proyectos con propuestas generadas aquí.",
    name: "Andrés Fuentes",
    role: "Diseñador UX freelance",
    initials: "AF",
  },
  {
    quote:
      "Por fin mis propuestas tienen mi logo y mis colores sin meterme a Word. El PDF queda limpio y profesional. Mis clientes preguntan si tengo diseñador.",
    name: "Carolina Mejía",
    role: "Consultora de RRHH independiente",
    initials: "CM",
  },
];

const badges = ["Datos cifrados", "Sin contratos anuales", "Cancela cuando quieras", "Soporte por email"];

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 bg-surface">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-6">
          03 — Testimonios
        </p>

        {/* Heading */}
        <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-secondary leading-tight mb-14">
          Lo que dicen quienes ya lo usan.
        </h2>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-background rounded-2xl border border-border p-6 flex flex-col gap-6 hover:border-gray-300 transition-colors"
            >
              <p className="text-sm text-secondary leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center flex-shrink-0 font-heading">
                  {t.initials}
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
              className="text-xs text-muted border border-border rounded-full px-4 py-2"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
