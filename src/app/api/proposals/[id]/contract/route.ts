import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { CONTRACT_TYPE_LABELS, PROPOSAL_TYPE_LABELS } from "@/lib/proposals/constants";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PROPOSAL_TO_CONTRACT: Record<string, string> = {
  proyecto_puntual:      "prestacion_servicios",
  servicios_recurrentes: "prestacion_servicios",
  consultoria:           "consultoria",
  retencion_mensual:     "mantenimiento",
  colaboracion:          "prestacion_servicios",
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

    const { data: proposal } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!proposal) return NextResponse.json({ error: "Propuesta no encontrada." }, { status: 404 });

    const { provider_name, provider_nif, provider_address, ip_ownership, jurisdiction } = await request.json();

    const input = proposal.input_data as Record<string, string>;
    const contractType = PROPOSAL_TO_CONTRACT[input.proposal_type] ?? "prestacion_servicios";
    const contractTitle = CONTRACT_TYPE_LABELS[contractType] ?? "Contrato de Prestación de Servicios Profesionales";

    const clientLabel = input.client_company
      ? `${proposal.client_name} (${input.client_company})`
      : proposal.client_name;

    const ipMap: Record<string, string> = {
      cliente:    "La propiedad intelectual de los entregables será cedida íntegramente al Cliente una vez satisfecho el pago total.",
      prestador:  "El Prestador retiene todos los derechos de propiedad intelectual. El Cliente obtiene una licencia de uso no exclusiva e intransferible.",
      compartida: "Los derechos de propiedad intelectual serán compartidos a partes iguales entre ambas partes.",
    };

    // Build timeline/scope context from input data
    const scopeLines: string[] = [];
    if (input.project_duration)        scopeLines.push(`Duración: ${input.project_duration}`);
    if (input.contract_duration)       scopeLines.push(`Duración del contrato: ${input.contract_duration}`);
    if (input.min_contract_duration)   scopeLines.push(`Duración mínima: ${input.min_contract_duration}`);
    if (input.monthly_deliverables)    scopeLines.push(`Entregables mensuales:\n${input.monthly_deliverables}`);
    if (input.session_format)          scopeLines.push(`Formato de las sesiones: ${input.session_format}`);
    if (input.num_sessions)            scopeLines.push(`Número de sesiones: ${input.num_sessions}`);
    if (input.delivery_format)         scopeLines.push(`Formato de entrega: ${input.delivery_format}`);
    if (input.included_hours)          scopeLines.push(`Horas incluidas al mes: ${input.included_hours}`);
    if (input.response_time)           scopeLines.push(`Tiempo de respuesta: ${input.response_time}`);
    if (input.dedication)              scopeLines.push(`Dedicación: ${input.dedication}`);
    if (input.collaboration_duration)  scopeLines.push(`Duración de la colaboración: ${input.collaboration_duration}`);
    if (input.collaboration_format)    scopeLines.push(`Formato de trabajo: ${input.collaboration_format}`);

    const pricingLine = input.price
      ? `${input.price}${input.payment_terms ? `. Forma de pago: ${input.payment_terms}` : ""}`
      : "A definir por las partes";

    const today = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

    const prompt = `Redacta un CONTRATO DE PRESTACIÓN DE SERVICIOS completo, profesional y legalmente válido en España (o ${jurisdiction ?? "España"}).

DATOS DE LAS PARTES:
- PRESTADOR: ${provider_name}${provider_nif ? `, con NIF/CIF ${provider_nif}` : ""}${provider_address ? `, con domicilio en ${provider_address}` : ""}
- CLIENTE: ${clientLabel}${input.client_email ? `, email: ${input.client_email}` : ""}

OBJETO DEL CONTRATO:
Tipo: ${PROPOSAL_TYPE_LABELS[input.proposal_type] ?? contractTitle}
Servicio: ${proposal.service_type}
Descripción: ${input.description}
${input.specific_deliverables ? `Entregables:\n${input.specific_deliverables}` : ""}

CONDICIONES DE TIEMPO Y ALCANCE:
${scopeLines.length > 0 ? scopeLines.join("\n") : "A definir de mutuo acuerdo"}

PRECIO Y FORMA DE PAGO:
${pricingLine}

CONDICIONES LEGALES:
- Propiedad intelectual: ${ipMap[ip_ownership] ?? ipMap["cliente"]}
- Ley aplicable: ${jurisdiction ?? "España"}

INSTRUCCIONES DE REDACCIÓN:
Genera el contrato completo con EXACTAMENTE esta estructura:

1. Encabezado: "CONTRATO DE ${contractTitle.toUpperCase()}" centrado
2. Lugar y fecha: "En [${jurisdiction ?? "España"}], a ${today}"
3. Sección REUNIDOS con presentación formal de ambas partes
4. Párrafo "EXPONEN" con antecedentes
5. Párrafo "ACUERDAN" de introducción
6. CLÁUSULAS numeradas con formato "PRIMERA. — OBJETO DEL CONTRATO", "SEGUNDA. — OBLIGACIONES DEL PRESTADOR", etc.

Incluye OBLIGATORIAMENTE estas cláusulas:
- PRIMERA: Objeto del contrato (detallado, con alcance y exclusiones)
- SEGUNDA: Obligaciones del Prestador
- TERCERA: Obligaciones del Cliente
- CUARTA: Precio y forma de pago (con cantidades y plazos exactos)
- QUINTA: Plazo y duración
- SEXTA: Confidencialidad y protección de datos
- SÉPTIMA: Propiedad intelectual e industrial
- OCTAVA: Causas de resolución anticipada
- NOVENA: Responsabilidad y limitación de daños
- DÉCIMA: Ley aplicable y jurisdicción
- UNDÉCIMA: Disposiciones generales (notificaciones, nulidad parcial, etc.)

Al final, incluye OBLIGATORIAMENTE este bloque de firmas:

---

Y en prueba de conformidad con todo lo anterior, las partes firman el presente contrato por duplicado ejemplar y a un solo efecto, en el lugar y fecha indicados en el encabezamiento.


EL PRESTADOR                                    EL CLIENTE

Nombre: _______________________________         Nombre: _______________________________

NIF/CIF: ______________________________         NIF/CIF: ______________________________

Firma: ________________________________         Firma: ________________________________

Fecha: ________________________________         Fecha: ________________________________

---

Devuelve ÚNICAMENTE el texto del contrato. Sin comentarios, sin markdown adicional, sin explicaciones fuera del contrato.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 6000,
    });

    const generated_content = completion.choices[0].message.content;
    if (!generated_content) throw new Error("La IA no devolvió contenido.");

    const { data: contract, error: insertError } = await supabase
      .from("contracts")
      .insert({
        user_id: user.id,
        client_name: proposal.client_name,
        client_company: input.client_company || null,
        client_email: input.client_email || null,
        contract_type: contractType,
        input_data: { ...input, provider_name, provider_nif, provider_address, ip_ownership, jurisdiction },
        generated_content,
      })
      .select("id")
      .single();

    if (insertError) throw new Error("Error al guardar el contrato.");

    return NextResponse.json({ contract_id: contract.id });
  } catch (err) {
    console.error("Contract from proposal error:", err);
    return NextResponse.json({ error: "Error al generar el contrato." }, { status: 500 });
  }
}
