import { NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

import { CONTRACT_TYPE_LABELS } from "@/lib/proposals/constants";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  try {
    const {
      client_name,
      client_company,
      client_email,
      client_nif,
      client_address,
      provider_name,
      provider_nif,
      provider_address,
      contract_type,
      service_description,
      deliverables,
      start_date,
      duration,
      price,
      payment_terms,
      includes_nda,
      ip_ownership,
      jurisdiction,
      language,
    } = await request.json();

    if (!client_name || !provider_name || !service_description) {
      return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
    }

    const contractTitle = CONTRACT_TYPE_LABELS[contract_type] ?? "Contrato de Prestación de Servicios";
    const clientLabel = client_company ? `${client_name} (${client_company})` : client_name;
    const langLabel = language === "en" ? "English" : language === "pt" ? "Português" : language === "fr" ? "Français" : "Español";

    const ipMap: Record<string, string> = {
      cliente: "La propiedad intelectual de los entregables será cedida íntegramente al Cliente una vez satisfecho el pago total.",
      prestador: "El Prestador retiene todos los derechos de propiedad intelectual. El Cliente obtiene una licencia de uso no exclusiva.",
      compartida: "Los derechos de propiedad intelectual serán compartidos al 50% entre ambas partes.",
    };

    const prompt = `Eres un abogado especialista en contratos mercantiles y derecho de los negocios. Redacta un contrato profesional, completo y legalmente sólido.

TÍTULO: ${contractTitle}

PARTES:
- PRESTADOR: ${provider_name}${provider_nif ? `, NIF/CIF: ${provider_nif}` : ""}${provider_address ? `, domicilio: ${provider_address}` : ""}
- CLIENTE: ${clientLabel}${client_nif ? `, NIF/CIF: ${client_nif}` : ""}${client_address ? `, domicilio: ${client_address}` : ""}${client_email ? `, email: ${client_email}` : ""}

OBJETO DEL CONTRATO:
${service_description}

ENTREGABLES:
${deliverables || "Los entregables se definirán de mutuo acuerdo entre las partes."}

PLAZO:
- Fecha de inicio: ${start_date || "A definir por las partes"}
- Duración: ${duration || "A definir por las partes"}

PRECIO Y FORMA DE PAGO:
- Precio: ${price || "A definir por las partes"}
- Condiciones de pago: ${payment_terms || "A convenir entre las partes"}

CLÁUSULAS ESPECIALES:
- Confidencialidad (NDA): ${includes_nda ? "Sí, se incluye cláusula de confidencialidad completa." : "No se incluye cláusula de confidencialidad."}
- Propiedad intelectual: ${ipMap[ip_ownership] ?? ipMap["cliente"]}
- Jurisdicción y ley aplicable: ${jurisdiction || "España"}

INSTRUCCIONES:
- Redacta el contrato completo en ${langLabel}.
- Usa lenguaje jurídico formal y preciso.
- Incluye todas las cláusulas necesarias: objeto, obligaciones de cada parte, precio y pago, plazo, ${includes_nda ? "confidencialidad," : ""} propiedad intelectual, causas de resolución, responsabilidad, y ley aplicable/jurisdicción.
- Al final incluye un bloque de firmas con fecha, lugar, y espacio para nombre, firma y fecha de cada parte.
- Devuelve ÚNICAMENTE el texto del contrato. Sin comentarios, sin explicaciones, sin markdown extra.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 5000,
    });

    const generated_content = completion.choices[0].message.content;
    if (!generated_content) throw new Error("La IA no devolvió contenido.");

    return NextResponse.json({ generated_content });
  } catch (err) {
    console.error("Error generating contract:", err);
    return NextResponse.json(
      { error: "Error al generar el contrato. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
