import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Left — Text */}
        <div className="space-y-8">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 text-xs font-medium text-muted lowercase tracking-wide bg-primary-50 border border-primary-100 px-4 py-2 rounded-full">
            IA para consultores y freelancers
          </span>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl text-secondary leading-[1.05] tracking-tight">
              Las propuestas
              <br />
              <em className="not-italic text-primary">no están rotas.</em>
            </h1>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl text-secondary leading-[1.05] tracking-tight opacity-40">
              Solo lentas.
            </h1>
          </div>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            DealCraft genera propuestas profesionales y personalizadas en minutos usando IA,
            con tu marca aplicada al instante. Sin plantillas genéricas.
          </p>

          {/* Feature list */}
          <ul className="space-y-3">
            {[
              "Generación completa en menos de 2 minutos",
              "Tu logo, colores y voz aplicados automáticamente",
              "PDF profesional listo para enviar",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-secondary">
                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/signup"
              className="font-medium bg-primary text-white px-6 py-3 h-12 rounded-full hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm text-sm text-center"
            >
              Empieza gratis
            </Link>
            <a
              href="#como-funciona"
              className="font-medium text-secondary border border-secondary/20 px-6 py-3 h-12 rounded-full hover:border-secondary/50 hover:bg-secondary/5 transition-all text-sm text-center"
            >
              Ver cómo funciona
            </a>
          </div>

          <p className="text-xs text-muted">
            Sin tarjeta de crédito · 3 propuestas gratuitas · Listo en 2 minutos
          </p>
        </div>

        {/* Right — Demo card */}
        <div className="relative hidden lg:block">
          {/* Blurred bg circles */}
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-accent/10 rounded-full blur-2xl" />

          {/* Card */}
          <div className="relative bg-surface rounded-3xl border border-border shadow-elevated overflow-hidden">
            {/* Card header */}
            <div className="bg-gray-100 border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
              </div>
              <span className="text-xs text-muted font-medium">Propuesta — Proyecto de branding</span>
              <div className="w-16" />
            </div>

            {/* Card body */}
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <p className="text-xs text-muted uppercase tracking-widest font-medium">Cliente</p>
                <p className="font-heading font-semibold text-secondary">Acme Corporation</p>
              </div>

              <div className="space-y-2">
                {[
                  { label: "Introducción", width: "w-full" },
                  { label: "Entendimiento del problema", width: "w-5/6" },
                  { label: "Solución propuesta", width: "w-full" },
                  { label: "Entregables", width: "w-4/6" },
                  { label: "Cronograma", width: "w-3/4" },
                  { label: "Precio", width: "w-2/3" },
                ].map((section) => (
                  <div key={section.label} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary/30 flex-shrink-0" />
                    <div className={`h-2 ${section.width} bg-gray-200 rounded-full`} />
                  </div>
                ))}
              </div>

              <div className="pt-2 flex gap-2">
                <div className="flex-1 bg-primary/10 text-primary text-xs font-medium px-3 py-2 rounded-full text-center">
                  Editar propuesta
                </div>
                <div className="flex-1 bg-primary text-white text-xs font-medium px-3 py-2 rounded-full text-center">
                  Exportar PDF
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -top-4 -right-4 bg-surface border border-border rounded-2xl px-4 py-3 shadow-card flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-secondary">Generado en 38 seg.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
