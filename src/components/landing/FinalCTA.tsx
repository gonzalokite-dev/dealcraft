import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#1B2A3A" }}>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 10% 50%, rgb(37 99 235 / 0.15) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 90% 60%, rgb(34 197 94 / 0.08) 0%, transparent 70%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgb(255 255 255 / 0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-white/70 text-xs font-medium">Sin tarjeta de crédito · Listo en 2 minutos</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              Deja de perder proyectos
              <br />
              <em className="not-italic" style={{ color: "rgba(255,255,255,0.35)" }}>por una propuesta mediocre.</em>
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-md">
              Cada propuesta genérica que envías es una oportunidad que le das a tu competencia.
              Con DealCraft, la próxima que mandes va a marcar la diferencia.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {["VR", "AF", "CM", "JL"].map((i, idx) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-white font-semibold"
                    style={{
                      borderColor: "#1B2A3A",
                      background: ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"][idx],
                      fontSize: "9px",
                    }}
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-xs">
                +200 consultores ya cierran más con DealCraft
              </p>
            </div>
          </div>

          <div className="lg:flex lg:flex-col lg:items-end space-y-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 font-medium bg-white text-secondary px-8 py-3.5 rounded-full hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm text-sm"
            >
              Crear mi primera propuesta gratis
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <Link
              href="/signup?plan=pro"
              className="inline-flex items-center gap-2 font-medium text-white/60 border border-white/15 px-8 py-3.5 rounded-full hover:border-white/30 hover:text-white/80 transition-all text-sm"
            >
              Ver planes Pro →
            </Link>
            <p className="text-white/25 text-xs">
              3 propuestas gratuitas · Sin compromisos · Cancela cuando quieras
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
