import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div className="space-y-6">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              Tu próxima propuesta puede
              <br />
              <em className="not-italic opacity-50">estar lista en 5 minutos.</em>
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-md">
              Sin plantillas que adaptar. Sin copiar y pegar. Sin pasar horas redactando
              algo que igual queda genérico.
            </p>
          </div>

          {/* Right */}
          <div className="lg:flex lg:flex-col lg:items-end space-y-4">
            <Link
              href="/signup"
              className="inline-block font-medium bg-primary text-white px-8 py-3.5 rounded-full hover:bg-blue-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm text-sm"
            >
              Crear mi primera propuesta gratis
            </Link>
            <p className="text-white/30 text-xs">
              Sin tarjeta de crédito · 3 propuestas gratuitas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
