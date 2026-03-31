import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { SECTION_LABELS, TONE_LABELS, LANGUAGE_LABELS } from "@/lib/proposals/constants";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ACTION_PROMPTS: Record<string, string> = {
  regenerate: "Reescribe completamente esta sección. Mantén el mismo propósito pero con un enfoque fresco.",
  shorten: "Acorta este contenido a la mitad aproximadamente. Conserva los puntos más importantes.",
  expand: "Amplía este contenido con más detalle, argumentos concretos y ejemplos específicos del proyecto.",
  persuasive: "Reescribe para que sea más persuasivo y orientado al cierre. Enfócate en el valor para el cliente y resultados concretos.",
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

    const { proposal_id, section_key, current_content, action } = await request.json();

    if (!proposal_id || !section_key || !current_content || !action) {
      return NextResponse.json({ error: "Faltan parámetros." }, { status: 400 });
    }

    if (!ACTION_PROMPTS[action]) {
      return NextResponse.json({ error: "Acción no válida." }, { status: 400 });
    }

    // Fetch proposal for context (verifies ownership too)
    const { data: proposal } = await supabase
      .from("proposals")
      .select("client_name, service_type, input_data")
      .eq("id", proposal_id)
      .eq("user_id", user.id)
      .single();

    if (!proposal) return NextResponse.json({ error: "Propuesta no encontrada." }, { status: 404 });

    const input = proposal.input_data as Record<string, string>;
    const sectionLabel = SECTION_LABELS[section_key] ?? section_key;
    const tone = TONE_LABELS[input?.tone] ?? "Profesional y directo.";
    const language = LANGUAGE_LABELS[input?.language] ?? "Español";

    const prompt = `Eres un consultor B2B senior redactando una propuesta comercial.

CONTEXTO:
- Cliente: ${proposal.client_name}
- Servicio: ${proposal.service_type}
- Tono: ${tone}
- Idioma: ${language}

SECCIÓN: ${sectionLabel}
CONTENIDO ACTUAL:
${current_content}

INSTRUCCIÓN: ${ACTION_PROMPTS[action]}

Devuelve ÚNICAMENTE el nuevo texto de la sección. Sin explicaciones, sin formato markdown, sin prefijos.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const result = completion.choices[0].message.content?.trim();
    if (!result) throw new Error("La IA no devolvió contenido.");

    return NextResponse.json({ content: result });
  } catch (err) {
    console.error("Section AI error:", err);
    return NextResponse.json({ error: "Error al procesar la sección." }, { status: 500 });
  }
}
