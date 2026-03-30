const steps = [
  {
    number: "01",
    title: "Describe el proyecto",
    description:
      "Completa un formulario simple con el nombre del cliente, tipo de servicio, objetivos y cronograma. Menos de 3 minutos.",
  },
  {
    number: "02",
    title: "La IA redacta la propuesta",
    description:
      "DealCraft estructura y redacta una propuesta completa — introducción, solución, entregables, precio y cierre — en segundos.",
  },
  {
    number: "03",
    title: "Edita, exporta y cierra",
    description:
      "Ajusta cualquier sección con un editor simple, aplica tu branding y descarga el PDF. Tu cliente recibe algo que impresiona.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 sm:py-32 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Section label */}
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-6">
          02 — Cómo funciona
        </p>

        {/* Heading */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16 items-end">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-secondary leading-tight">
            De brief a propuesta{" "}
            <em className="not-italic text-primary">en menos de 5 minutos.</em>
          </h2>
          <p className="text-muted text-base leading-relaxed lg:max-w-sm lg:ml-auto">
            Tres pasos. Sin aprendizaje previo. Sin plantillas que adaptar.
            Solo llenas el formulario y DealCraft hace el resto.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => (
            <div key={step.number} className="space-y-4">
              <span className="font-heading text-6xl font-bold text-border select-none">
                {step.number}
              </span>
              <div className="h-px bg-border" />
              <h3 className="font-heading text-xl font-semibold text-secondary">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
