import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "para siempre",
    description: "Para probar DealCraft sin compromisos.",
    cta: "Empieza gratis",
    href: "/signup",
    highlight: false,
    badge: null,
    features: [
      "3 propuestas en total",
      "Generación con IA",
      "Editor de secciones",
      "Exportación en PDF",
    ],
    missing: [
      "Propuestas ilimitadas",
      "Branding personalizado",
      "Duplicar propuestas",
      "Plantillas guardadas",
      "Soporte prioritario",
    ],
  },
  {
    name: "Pro",
    price: "19",
    period: "/ mes",
    description: "Para freelancers activos que cierran proyectos de forma constante.",
    cta: "Empezar con Pro",
    href: "/signup?plan=pro",
    highlight: true,
    badge: "Más popular",
    features: [
      "Propuestas ilimitadas",
      "Generación con IA",
      "Editor de secciones",
      "Exportación en PDF",
      "Branding completo (logo + colores)",
      "Duplicar propuestas",
      "Soporte por email prioritario",
    ],
    missing: [
      "Plantillas guardadas",
    ],
  },
  {
    name: "Agency",
    price: "49",
    period: "/ mes",
    description: "Para agencias y consultoras que gestionan múltiples clientes.",
    cta: "Empezar con Agency",
    href: "/signup?plan=agency",
    highlight: false,
    badge: null,
    features: [
      "Propuestas ilimitadas",
      "Generación con IA",
      "Editor de secciones",
      "Exportación en PDF",
      "Branding completo (logo + colores)",
      "Duplicar propuestas",
      "Plantillas guardadas",
      "Hasta 5 perfiles de marca",
      "Soporte prioritario + onboarding",
    ],
    missing: [],
  },
];

export default function Pricing() {
  return (
    <section id="precios" className="py-24 sm:py-32 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-6">
          04 — Precios
        </p>

        {/* Heading */}
        <div className="grid lg:grid-cols-2 gap-8 mb-14 items-end">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-secondary leading-tight">
            Simple.
            <br />
            <span className="text-muted font-normal">Sin sorpresas.</span>
          </h2>
          <p className="text-muted text-sm leading-relaxed lg:max-w-xs lg:ml-auto">
            Empieza gratis. Actualiza cuando necesites propuestas ilimitadas y branding propio.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-8 flex flex-col gap-7 €{
                plan.highlight
                  ? "border-primary bg-surface shadow-elevated"
                  : "border-border bg-surface"
              }`}
            >
              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-heading font-semibold text-secondary text-xl">
                    {plan.name}
                  </span>
                  {plan.highlight && plan.badge && (
                    <span className="text-[10px] font-semibold text-primary bg-primary-50 border border-primary-100 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted leading-relaxed">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-end gap-1">
                <span className="font-heading text-5xl font-bold text-secondary leading-none">
                  €{plan.price}
                </span>
                <span className="text-sm text-muted mb-1 ml-1">{plan.period}</span>
              </div>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`text-sm font-medium py-3 px-5 rounded-full text-center transition-all hover:scale-[1.02] active:scale-[0.98] €{
                  plan.highlight
                    ? "bg-primary text-white hover:bg-blue-700 shadow-sm"
                    : "border-2 border-secondary/20 text-secondary hover:border-secondary/50"
                }`}
              >
                {plan.cta}
              </Link>

              {/* Feature list */}
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-secondary">
                    <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 8l4 4 7-7" />
                    </svg>
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                    <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 text-border font-bold">—</span>
                    {f}
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
