import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "para siempre",
    description: "Para probar DealCraft sin compromisos. Sin tarjeta.",
    cta: "Empieza gratis",
    href: "/signup",
    highlight: false,
    badge: null,
    features: [
      "3 propuestas en total",
      "Generación con IA",
      "Editor de secciones",
      "Exportación en PDF",
      "Enlace público compartible",
    ],
    missing: [
      "Propuestas ilimitadas",
      "Contratos ilimitados",
      "Branding personalizado",
      "Duplicar propuestas",
      "Soporte prioritario",
    ],
  },
  {
    name: "Pro",
    price: "19",
    period: "/ mes",
    description: "Para autónomos activos que cierran proyectos de forma constante.",
    cta: "Empezar con Pro",
    href: "/signup?plan=pro",
    highlight: true,
    badge: "Más popular",
    features: [
      "Propuestas ilimitadas",
      "Contratos ilimitados",
      "Generación con IA",
      "Editor de secciones",
      "Exportación en PDF",
      "Branding completo (logo + colores)",
      "Duplicar propuestas",
      "Seguimiento de apertura",
      "Soporte por email prioritario",
    ],
    missing: [],
  },
  {
    name: "Agency",
    price: "49",
    period: "/ mes",
    description: "Para agencias y consultoras que gestionan múltiples clientes a la vez.",
    cta: "Empezar con Agency",
    href: "/signup?plan=agency",
    highlight: false,
    badge: null,
    features: [
      "Propuestas ilimitadas",
      "Contratos ilimitados",
      "Generación con IA",
      "Editor de secciones",
      "Exportación en PDF",
      "Branding completo (logo + colores)",
      "Duplicar propuestas",
      "Hasta 5 perfiles de marca",
      "Plantillas guardadas",
      "Soporte prioritario + onboarding",
    ],
    missing: [],
  },
];

export default function Pricing() {
  return (
    <section id="precios" className="py-24 sm:py-32 px-4 sm:px-6 bg-surface">
      <div className="max-w-7xl mx-auto">

        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-6">
          06 — Precios
        </p>

        <div className="grid lg:grid-cols-2 gap-8 mb-14 items-end">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-secondary leading-tight">
            Precios claros.
            <br />
            <span className="text-muted font-normal">Sin sorpresas ni letra pequeña.</span>
          </h2>
          <p className="text-muted text-sm leading-relaxed lg:max-w-xs lg:ml-auto">
            Empieza gratis y crece cuando quieras. Todos los planes incluyen propuestas y contratos generados con IA.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => (
            <div key={plan.name}
              className={`rounded-2xl border p-8 flex flex-col gap-7 relative ${
                plan.highlight
                  ? "border-primary bg-background shadow-elevated ring-2 ring-primary/10 md:-mt-4 md:pb-12"
                  : "border-border bg-background"
              }`}>
              {plan.highlight && plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="text-[11px] font-semibold text-white bg-primary px-4 py-1 rounded-full whitespace-nowrap shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <span className="font-heading font-semibold text-secondary text-xl">{plan.name}</span>
                <p className="text-xs text-muted leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex items-end gap-1">
                <span className="font-heading text-5xl font-bold text-secondary leading-none">
                  {plan.price === "0" ? "Gratis" : `€${plan.price}`}
                </span>
                {plan.price !== "0" && (
                  <span className="text-sm text-muted mb-1 ml-1">{plan.period}</span>
                )}
              </div>

              <Link href={plan.href}
                className={`text-sm font-medium py-3 px-5 rounded-full text-center transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  plan.highlight
                    ? "bg-primary text-white hover:bg-blue-700 shadow-sm"
                    : "border-2 border-secondary/15 text-secondary hover:border-secondary/40 hover:bg-secondary/4"
                }`}>
                {plan.cta}
              </Link>

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

        <p className="text-center text-xs text-muted mt-10">
          Todos los planes incluyen SSL, backups automáticos y actualizaciones sin coste adicional. Precios en EUR, IVA no incluido.
        </p>
      </div>
    </section>
  );
}
