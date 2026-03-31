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

function buildTimelineContext(data: Record<string, string>): string {
  const t = data.proposal_type;

  if (t === "proyecto_puntual") {
    const lines = [`Duración del proyecto: ${data.project_duration}`];
    if (data.project_phases?.trim()) lines.push(`Fases o hitos:\n${data.project_phases}`);
    return lines.join("\n");
  }

  if (t === "servicios_recurrentes") {
    const lines = [`Entregables mensuales:\n${data.monthly_deliverables}`, `Duración del contrato: ${data.contract_duration}`];
    return lines.join("\n");
  }

  if (t === "consultoria") {
    const lines = [`Formato de las sesiones: ${data.session_format}`];
    if (data.num_sessions?.trim()) lines.push(`Número de sesiones o días: ${data.num_sessions}`);
    if (data.delivery_format?.trim()) lines.push(`Formato de entrega: ${data.delivery_format}`);
    return lines.join("\n");
  }

  if (t === "retencion_mensual") {
    const lines = [`Duración mínima: ${data.min_contract_duration}`];
    if (data.included_hours?.trim()) lines.push(`Horas incluidas al mes: ${data.included_hours}`);
    if (data.response_time?.trim()) lines.push(`Tiempo de respuesta garantizado: ${data.response_time}`);
    return lines.join("\n");
  }

  if (t === "colaboracion") {
    const lines = [`Dedicación semanal: ${data.dedication}`, `Duración: ${data.collaboration_duration}`];
    if (data.collaboration_format?.trim()) lines.push(`Formato de trabajo: ${data.collaboration_format}`);
    return lines.join("\n");
  }

  return data.timeline ?? "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      client_name,
      client_company,
      service_type,
      description,
      goals,
      specific_deliverables,
      price,
      payment_terms,
      proposal_type,
      sector,
      sector_custom,
      tone,
      length,
      language,
      sections,
    } = body;

    if (!client_name || !service_type || !description || !goals) {
      return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
    }

    const activeSections: string[] =
      Array.isArray(sections) && sections.length > 0
        ? sections
        : SECTIONS_BY_TYPE[proposal_type] ?? SECTIONS_BY_TYPE["proyecto_puntual"];

    const clientLabel = client_company ? `${client_name} (${client_company})` : client_name;
    const sectorLabel = sector === "Otro" ? body.sector_custom || "Sector no especificado" : sector;
    const timelineContext = buildTimelineContext(body);

    const pricingLine = price
      ? `${price}${payment_terms ? `. Condiciones de pago: ${payment_terms}` : ""}`
      : "A definir en conversación con el cliente";

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
- Objetivos del cliente: ${goals}${specific_deliverables?.trim() ? `\n- Entregables específicos:\n${specific_deliverables}` : ""}
- Condiciones de tiempo y alcance:\n${timelineContext}
- Inversión: ${pricingLine}

INSTRUCCIONES DE ESTILO:
- Idioma: Escribe TODA la propuesta en ${LANGUAGE_LABELS[language] ?? "Español"}.
- Tono: ${TONE_LABELS[tone] ?? "Profesional y directo."}
- Extensión por sección: ${LENGTH_LABELS[length] ?? "2-3 párrafos por sección."}
- No uses lenguaje genérico ni de relleno. Cada frase debe aportar valor real.
- Habla directamente al cliente. Usa "usted" o "tú" según el tono indicado.
- Enfócate en resultados y valor, no en tareas o procesos.
- Usa bullets (•) o listas numeradas cuando ayude a la claridad.
- En la sección de precio, incluye siempre las condiciones de pago si se han especificado.

SECCIONES REQUERIDAS:
Genera ÚNICAMENTE las siguientes ${activeSections.length} secciones.
Devuelve ÚNICAMENTE un objeto JSON válido. Sin markdown extra, sin texto fuera del JSON.
Las claves deben ser exactamente las indicadas:
{
${sectionsWithInstructions}
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.65,
      max_tokens: 4500,
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
