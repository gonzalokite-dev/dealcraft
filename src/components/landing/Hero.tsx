import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 lg:pb-28 px-4 sm:px-6 overflow-hidden relative">

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 15% 20%, rgb(37 99 235 / 0.05) 0%, transparent 100%), radial-gradient(ellipse 40% 40% at 85% 80%, rgb(34 197 94 / 0.04) 0%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative">

        {/* ── Left: Copy ── */}
        <div className="space-y-8">

          <span className="inline-flex items-center gap-2 text-xs font-medium text-primary tracking-wide bg-primary-50 border border-primary-100 px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Para consultores y freelancers que quieren cerrar más
          </span>

          <div className="space-y-1">
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl text-secondary leading-[1.05] tracking-tight">
              Propuestas que
              <br />
              <em className="not-italic text-primary">cierran proyectos.</em>
            </h1>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl text-secondary leading-[1.05] tracking-tight opacity-25">
              En 2 minutos.
            </h1>
          </div>

          <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
            Describe el proyecto, DealCraft redacta una propuesta profesional y persuasiva
            adaptada a tu cliente — con tu marca aplicada al instante.
            Sin plantillas. Sin horas perdidas.
          </p>

          <ul className="space-y-3">
            {[
              "Propuesta completa en menos de 2 minutos, lista para enviar",
              "Redacción persuasiva que resalta tu valor diferencial",
              "Contratos de prestación de servicios incluidos",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-secondary">
                <span className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/signup"
              className="font-medium bg-primary text-white px-7 py-3.5 h-12 rounded-full hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm text-sm text-center inline-flex items-center justify-center gap-2"
            >
              Crear mi primera propuesta gratis
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 7h10M8 3l4 4-4 4" />
              </svg>
            </Link>
            <a
              href="#como-funciona"
              className="font-medium text-secondary border border-secondary/15 px-7 py-3.5 h-12 rounded-full hover:border-secondary/35 hover:bg-secondary/4 transition-all text-sm text-center"
            >
              Ver cómo funciona
            </a>
          </div>

          <p className="text-xs text-muted">
            Sin tarjeta de crédito · 3 propuestas gratuitas · Listo en 2 minutos
          </p>
        </div>

        {/* ── Right: Animated mockup ── */}
        <div className="relative hidden lg:flex items-center justify-center min-h-[520px]">

          <div className="absolute w-80 h-80 rounded-full blur-3xl" style={{ background: "rgb(37 99 235 / 0.08)" }} />

          <div className="animate-float relative w-full max-w-[340px] z-10">

            <div className="bg-gray-50 border border-border rounded-t-2xl px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-300" />
              </div>
              <div className="flex-1 bg-white border border-border rounded-md px-2.5 py-1 flex items-center gap-1.5 overflow-hidden">
                <svg className="w-2.5 h-2.5 text-muted flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                  <circle cx="6" cy="6" r="4" /><path strokeLinecap="round" d="M10 10l3 3" />
                </svg>
                <span className="text-[10px] text-muted font-mono truncate">dealcraft.app/p/acme-branding</span>
              </div>
            </div>

            <div className="bg-white border-x border-b border-border rounded-b-2xl shadow-elevated overflow-hidden">

              <div className="px-5 py-4 flex items-start justify-between" style={{ background: "#1B2A3A" }}>
                <div>
                  <div className="w-6 h-6 rounded-lg mb-2.5 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <span className="text-white font-heading font-bold" style={{ fontSize: "9px" }}>DC</span>
                  </div>
                  <p className="font-medium uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.4)", fontSize: "8px" }}>Propuesta para</p>
                  <p className="font-heading font-semibold text-white text-sm leading-tight">Acme Corporation</p>
                  <p className="mt-0.5" style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px" }}>Estrategia de Marketing Digital</p>
                </div>
                <div className="text-right">
                  <span className="font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.2)", color: "#22C55E", fontSize: "8px" }}>
                    ✓ Aprobada
                  </span>
                  <p className="mt-2" style={{ color: "rgba(255,255,255,0.25)", fontSize: "9px" }}>Mar 2025</p>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3">
                {[
                  { label: "Análisis y diagnóstico" },
                  { label: "Estrategia y hoja de ruta" },
                  { label: "Entregables y cronograma" },
                  { label: "Inversión" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-semibold uppercase tracking-wider mb-1" style={{ fontSize: "8px", color: "#9E9891" }}>{s.label}</p>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-100 rounded-full" />
                      <div className="h-1.5 bg-gray-100 rounded-full w-4/5" />
                    </div>
                  </div>
                ))}

                <div className="bg-primary-50 border border-primary-100 rounded-xl px-3 py-2.5 flex items-center justify-between mt-1">
                  <p className="text-xs font-medium text-secondary">Inversión total</p>
                  <p className="font-heading font-bold text-primary text-sm">€3.800 / mes</p>
                </div>

                <div className="flex gap-2 pt-0.5">
                  <div className="flex-1 border border-border text-secondary text-center py-2 rounded-full" style={{ fontSize: "10px", fontWeight: 500 }}>
                    Editar
                  </div>
                  <div className="flex-1 bg-primary text-white text-center py-2 rounded-full flex items-center justify-center gap-1" style={{ fontSize: "10px", fontWeight: 500 }}>
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 1v7M3 5l3 3 3-3M1 11h10" />
                    </svg>
                    Exportar PDF
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-float-alt absolute -top-2 -right-6 z-20">
            <div className="bg-white border border-border rounded-2xl px-3.5 py-2.5 shadow-card flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
              <span className="text-xs font-semibold text-secondary whitespace-nowrap">Generado en 41 seg.</span>
            </div>
          </div>

          <div className="animate-float absolute -bottom-4 -left-6 z-20">
            <div className="bg-white border border-border rounded-2xl px-3.5 py-2.5 shadow-card flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l4 4 6-6" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-secondary leading-none">Propuesta aprobada</p>
                <p className="text-muted mt-0.5 leading-none" style={{ fontSize: "10px" }}>Acme Corp · hace 3 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Metrics bar ── */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-6 sm:divide-x sm:divide-border">
        {[
          { value: "< 2 min",  label: "De brief a propuesta lista" },
          { value: "3×",       label: "Más propuestas enviadas al mes" },
          { value: "68%",      label: "De usuarios cierran más proyectos" },
          { value: "4.9 ★",    label: "Valoración media de usuarios" },
        ].map((m) => (
          <div key={m.label} className="sm:px-8 first:pl-0 last:pr-0">
            <p className="font-heading text-2xl font-bold text-secondary tracking-tight">{m.value}</p>
            <p className="text-xs text-muted mt-1 leading-snug max-w-[160px]">{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
