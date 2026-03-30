import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const { client_name, client_company, service_type, description, goals, timeline, price } =
      await request.json();

    if (!client_name || !service_type || !description || !goals || !timeline) {
      return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
    }

    const clientLabel = client_company ? `${client_name} de ${client_company}` : client_name;
    const pricingLine = price ? `El precio propuesto es ${price}.` : "No se ha definido un precio.";

    const prompt = `Eres un consultor B2B senior con 15 años de experiencia cerrando proyectos de alto valor. Tu trabajo es redactar propuestas profesionales, persuasivas y orientadas al cierre.

Genera una propuesta completa para el siguiente proyecto:

- Cliente: ${clientLabel}
- Tipo de servicio: ${service_type}
- Descripción del proyecto: ${description}
- Objetivos del cliente: ${goals}
- Cronograma: ${timeline}
- Precio: ${pricingLine}

Instrucciones de tono y estilo:
- Profesional, conciso y persuasivo
- Habla directamente al cliente en segunda persona (tú/usted)
- Enfócate en el valor y los resultados, no en las tareas
- Cada sección debe ser sustancial pero no excesiva (2-4 párrafos o puntos)
- No uses lenguaje genérico de relleno

Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta (sin markdown, sin texto extra):
{
  "introduction": "Párrafo de introducción que conecta con el cliente y establece credibilidad",
  "problem": "Descripción del problema o necesidad del cliente, mostrando que lo entendemos a fondo",
  "solution": "Nuestra solución propuesta, explicada de forma clara y enfocada en resultados",
  "deliverables": "Lista clara de entregables concretos del proyecto",
  "timeline": "Desglose del cronograma por fases o hitos",
  "pricing": "Detalle del precio y lo que incluye (o mensaje de que se definirá en conversación si no hay precio)",
  "cta": "Párrafo de cierre persuasivo con llamada a la acción clara"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
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
