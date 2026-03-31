export const PROPOSAL_TYPES = [
  { value: "proyecto_puntual", label: "Proyecto puntual" },
  { value: "servicios_recurrentes", label: "Servicios recurrentes" },
  { value: "consultoria", label: "Consultoría" },
  { value: "retencion_mensual", label: "Retención mensual" },
  { value: "colaboracion", label: "Colaboración" },
];

export const PROPOSAL_TYPE_LABELS: Record<string, string> = {
  proyecto_puntual: "Proyecto puntual (alcance y precio fijo)",
  servicios_recurrentes: "Servicios recurrentes (entrega continua)",
  consultoria: "Consultoría (diagnóstico y recomendaciones)",
  retencion_mensual: "Retención mensual (fee fijo por disponibilidad)",
  colaboracion: "Colaboración (trabajo conjunto con el equipo cliente)",
};

export const SECTORS = [
  "Tecnología",
  "Marketing",
  "Diseño",
  "Legal",
  "Inmobiliario",
  "Salud",
  "Educación",
  "E-commerce",
  "Consultoría estratégica",
  "Otro",
];

export const TONES = [
  { value: "formal_ejecutivo", label: "Formal y ejecutivo" },
  { value: "cercano_directo", label: "Cercano y directo" },
  { value: "tecnico_detallado", label: "Técnico y detallado" },
  { value: "empatico_consultivo", label: "Empático y consultivo" },
];

export const TONE_LABELS: Record<string, string> = {
  formal_ejecutivo: "Formal y ejecutivo: usa usted, lenguaje corporativo, estructura clara.",
  cercano_directo: "Cercano y directo: tutea al cliente, lenguaje ágil y sin rodeos.",
  tecnico_detallado: "Técnico y detallado: profundiza en procesos, usa terminología del sector.",
  empatico_consultivo: "Empático y consultivo: escucha activa, enfocado en el problema del cliente.",
};

export const LENGTHS = [
  { value: "concisa", label: "Concisa" },
  { value: "estandar", label: "Estándar" },
  { value: "detallada", label: "Detallada" },
];

export const LENGTH_LABELS: Record<string, string> = {
  concisa: "1 párrafo o 3-4 puntos cortos por sección.",
  estandar: "2-3 párrafos o 5-7 puntos por sección.",
  detallada: "3-5 párrafos o lista detallada con subcategorías por sección.",
};

export const LANGUAGES = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "pt", label: "Português" },
  { value: "fr", label: "Français" },
];

export const LANGUAGE_LABELS: Record<string, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
  fr: "Français",
};

export const SECTIONS_CONFIG = [
  { key: "introduction", label: "Introducción", defaultOn: true },
  { key: "problem", label: "Análisis del problema", defaultOn: true },
  { key: "solution", label: "Solución propuesta", defaultOn: true },
  { key: "methodology", label: "Metodología / Proceso", defaultOn: false },
  { key: "deliverables", label: "Entregables", defaultOn: true },
  { key: "timeline", label: "Cronograma", defaultOn: true },
  { key: "pricing", label: "Inversión / Precio", defaultOn: true },
  { key: "about_us", label: "Sobre nosotros", defaultOn: false },
  { key: "case_studies", label: "Casos de éxito", defaultOn: false },
  { key: "guarantees", label: "Garantías", defaultOn: false },
  { key: "cta", label: "Próximos pasos / CTA", defaultOn: true },
];

export const SECTION_LABELS: Record<string, string> = Object.fromEntries(
  SECTIONS_CONFIG.map(({ key, label }) => [key, label])
);

export const CANONICAL_ORDER = SECTIONS_CONFIG.map((s) => s.key);

export const PDF_TEMPLATES = [
  { value: "classic", label: "Clásica", description: "Limpia y minimalista" },
  { value: "modern", label: "Moderna", description: "Header en color primario" },
  { value: "executive", label: "Ejecutiva", description: "Franja lateral de color" },
  { value: "minimal", label: "Minimalista", description: "Solo tipografía" },
];

// Secciones automáticas según tipo de propuesta
export const SECTIONS_BY_TYPE: Record<string, string[]> = {
  proyecto_puntual: ["introduction", "problem", "solution", "deliverables", "timeline", "pricing", "cta"],
  servicios_recurrentes: ["introduction", "solution", "methodology", "deliverables", "pricing", "cta"],
  consultoria: ["introduction", "problem", "solution", "methodology", "timeline", "pricing", "about_us", "cta"],
  retencion_mensual: ["introduction", "solution", "deliverables", "pricing", "cta"],
  colaboracion: ["introduction", "problem", "solution", "methodology", "deliverables", "timeline", "cta"],
};

export const SECTION_INSTRUCTIONS: Record<string, string> = {
  introduction: "Párrafo de apertura que conecta con el cliente, establece contexto y genera confianza.",
  problem: "Análisis profundo del problema o necesidad del cliente. Demuestra comprensión.",
  solution: "Solución propuesta, enfocada en resultados y valor, no en tareas.",
  methodology: "Proceso de trabajo paso a paso: fases, herramientas, frecuencia de comunicación.",
  deliverables: "Lista concreta y específica de entregables. Qué recibirá el cliente exactamente.",
  timeline: "Cronograma por fases o hitos con duraciones estimadas.",
  pricing: "Detalle del precio, qué incluye, forma de pago. Si no hay precio, indicar que se define en conversación.",
  about_us: "Breve presentación del equipo o freelancer: experiencia relevante, credenciales.",
  case_studies: "1-2 casos de éxito o proyectos similares con resultados concretos.",
  guarantees: "Garantías ofrecidas: revisiones incluidas, soporte post-entrega, satisfacción.",
  cta: "Cierre persuasivo con próximos pasos claros y llamada a la acción específica.",
};
