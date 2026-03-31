import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  TONE_LABELS,
  LENGTH_LABELS,
  LANGUAGE_LABELS,
  PROPOSAL_TYPE_LABELS,
  SECTION_INSTRUCTIONS,
  SECTIONS_BY_TYPE,
} from "@/lib/proposals/constants";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const {
      client_name,
      client_company,
      service_type,
      description,
      goals,
      specific_deliverables,
      timeline,
      price,
      payment_terms,
      proposal_type,
      sector,
      sector_custom,
      tone,
      length,
      language,
      sections,
    } = await request.json();

    if (!client_name || !service_type || !description || !goals || !timeline) {
      return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
    }

    // Use sections from form, or auto-determine by proposal_type
    const activeSections: string[] =
      Array.isArray(sections) && sections.length > 0
        ? sections
        : SECTIONS_BY_TYPE[proposal_type] ?? SECTIONS_BY_TYPE["proyecto_puntual"];

    const clientLabel = client_company
      ? `${client_name} (${client_company})`
      : client_name;

    const sectorLabel =
      sector === "Otro" ? sector_custom || "Sector no especificado" : sector;

    const pricingLine = price
      ? `El precio propuesto es ${price}.${payment_terms ? ` Condiciones de pago: ${payment_terms}.` : ""}`
      : "El precio se definirá en la conversación con el cliente.";

    const deliverablesLine = specific_deliverables
      ? `\n- Entregables específicos:\n${specific_deliverables}`
      : "";

    const sectionsWithInstructions = activeSections
      .map((s) => `  "${s}": "${SECTION_INSTRUCTIONS[s] ?? "Contenido relevante para esta sección."}"`)
      .join(",\n");

    const prompt = `Eres un consultor B2B senior especializado en redactar propuestas comerciales de alto valor para freelancers y consultores. Tu objetivo es cerrar proyectos.

CONTEXTO DEL PROYECTO:
- Cliente: ${clientLabel}
- Sector: ${sectorLabel ?? "No especificado"}
- Tipo de propuesta: ${PROPOSAL_TYPE_LABELS[proposal_type] ?? proposal_type ?? "No especificado"}
- Servicio: ${service_type}
- Descripción: ${description}
- Objetivos del cliente: ${goals}${deliverablesLine}
- Cronograma: ${timeline}
- Precio: ${pricingLine}

INSTRUCCIONES DE ESTILO:
- Idioma: Escribe TODA la propuesta en ${LANGUAGE_LABELS[language] ?? "Español"}.
- Tono: ${TONE_LABELS[tone] ?? "Profesional y directo."}
- Extensión por sección: ${LENGTH_LABELS[length] ?? "2-3 párrafos por sección."}
- No uses lenguaje genérico o de relleno. Cada frase debe aportar valor.
- Habla directamente al cliente. Enfócate en sus resultados, no en las tareas.

SECCIONES REQUERIDAS:
Genera ÚNICAMENTE las siguientes ${activeSections.length} secciones.
Devuelve ÚNICAMENTE un objeto JSON válido. Sin markdown, sin texto extra, sin explicaciones.
Las claves deben ser exactamente las indicadas:
{
${sectionsWithInstructions}
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("La IA no devolvió contenido.");

    const generated_content = JSON.parse(content);

    return NextResponse.json({ generated_content });
  } catch (err) {
    console.error("Error generating proposal:", err);
    return NextResponse.json(
      { error: "Error al generar la propuesta. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
