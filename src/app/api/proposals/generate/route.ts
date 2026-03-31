import { NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

import {
  TONE_LABELS,
  LENGTH_LABELS,
  LANGUAGE_LABELS,
  SECTION_INSTRUCTIONS,
  SECTIONS_BY_TYPE,
  CANONICAL_ORDER,
} from "@/lib/proposals/constants";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      client_name,
      client_company,
      service_type,
      description,
      price,
      payment_terms,
      tone,
      length,
      language,
      sections,
    } = body;

    if (!client_name || !service_type || !description) {
      return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
    }

    // If sections are explicitly passed, use them; otherwise let the AI decide
    const fixedSections: string[] | null =
      Array.isArray(sections) && sections.length > 0 ? sections : null;

    const clientLabel = client_company ? `${client_name} (${client_company})` : client_name;

    const pricingLine = price
      ? `${price}${payment_terms ? `. Condiciones de pago: ${payment_terms}` : ""}`
      : "A definir en conversación con el cliente";

    // Build section instructions for fixed sections (if passed) or all types (for AI to pick)
    const allSectionsByType = Object.entries(SECTIONS_BY_TYPE)
      .map(([type, secs]) => `  - ${type}: ${secs.join(", ")}`)
      .join("\n");

    const allSectionInstructions = (fixedSections ?? CANONICAL_ORDER)
      .map((s) => `  "${s}": "${SECTION_INSTRUCTIONS[s] ?? "Contenido relevante para esta sección."}"`)
      .join(",\n");

    const sectionBlock = fixedSections
      ? `SECCIONES REQUERIDAS:
Genera ÚNICAMENTE las siguientes ${fixedSections.length} secciones:
{
${allSectionInstructions}
}`
      : `TIPO DE PROPUESTA Y SECCIONES:
Analiza el servicio y la descripción e infiere el tipo de propuesta más adecuado:
${allSectionsByType}

Según el tipo que determines, genera ÚNICAMENTE las secciones que corresponden a ese tipo.
Devuelve también el tipo inferido en el campo "_type" (uno de: proyecto_puntual, retencion_mensual, consultoria, servicios_recurrentes, colaboracion).

Instrucciones de contenido por sección disponible:
{
${allSectionInstructions}
}`;

    const prompt = `Eres un consultor B2B senior especializado en redactar propuestas comerciales de alto valor para freelancers y consultores. Tu objetivo es cerrar proyectos.

CONTEXTO:
- Cliente: ${clientLabel}
- Servicio: ${service_type}
- Descripción completa: ${description}
- Inversión: ${pricingLine}

INSTRUCCIONES DE ESTILO:
- Idioma: Escribe TODA la propuesta en ${LANGUAGE_LABELS[language] ?? "Español"}.
- Tono: ${TONE_LABELS[tone] ?? "Profesional y directo."}
- Extensión por sección: ${LENGTH_LABELS[length] ?? "2-3 párrafos por sección."}
- No uses lenguaje genérico ni de relleno. Cada frase debe aportar valor real.
- Habla directamente al cliente. Usa "usted" o "tú" según el tono indicado.
- Enfócate en resultados y valor, no en tareas o procesos.
- Usa bullets con salto de línea (\\n• item) cuando ayude a la claridad.
- En la sección de precio, incluye siempre las condiciones de pago si se han especificado.

${sectionBlock}

Devuelve ÚNICAMENTE un objeto JSON válido. Sin markdown, sin texto fuera del JSON.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.65,
      max_tokens: 4500,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("La IA no devolvió contenido.");

    const raw = JSON.parse(content);
    // Extract inferred type (if AI returned it), then normalize section values to strings
    const inferred_type = typeof raw._type === "string" ? raw._type : null;
    const generated_content: Record<string, string> = Object.fromEntries(
      Object.entries(raw)
        .filter(([k]) => k !== "_type" && CANONICAL_ORDER.includes(k))
        .map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)])
    );
    return NextResponse.json({ generated_content, inferred_type });
  } catch (err) {
    console.error("Error generating proposal:", err);
    return NextResponse.json(
      { error: "Error al generar la propuesta. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
