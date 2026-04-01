// ─── Shared helpers ─────────────────────────────────────────────────────────

function base(content: string, primaryColor = "#2563EB"): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DealCraft</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#fff;border-radius:16px 16px 0 0;border:1px solid #E2E8F0;border-bottom:none;padding:28px 40px 24px;">
            <div style="height:3px;background:${primaryColor};border-radius:2px;margin-bottom:24px;"></div>
            <span style="font-size:18px;font-weight:700;color:#0F172A;letter-spacing:-0.3px;">DealCraft</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fff;border:1px solid #E2E8F0;border-top:none;border-bottom:none;padding:0 40px 32px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F1F5F9;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 16px 16px;padding:20px 40px;">
            <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">
              Este email fue generado automáticamente por DealCraft. Si tienes alguna pregunta, responde a este mensaje.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(label: string, href: string, color = "#2563EB"): string {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:100px;margin-top:8px;">${label}</a>`;
}

function tag(text: string, color = "#2563EB"): string {
  return `<span style="display:inline-block;background:${color}18;color:${color};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;padding:4px 10px;border-radius:100px;">${text}</span>`;
}

// ─── 1. Propuesta enviada al cliente ────────────────────────────────────────

export function proposalSentToClient(opts: {
  clientName: string;
  clientCompany?: string;
  serviceType: string;
  businessName: string;
  proposalUrl: string;
  primaryColor?: string;
}): { subject: string; html: string } {
  const color = opts.primaryColor ?? "#2563EB";
  const subject = `${opts.businessName} te ha enviado una propuesta`;

  const html = base(`
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:0.06em;">Propuesta para</p>
    <h1 style="margin:0 0 4px;font-size:26px;font-weight:800;color:#0F172A;letter-spacing:-0.5px;">${opts.clientName}</h1>
    ${opts.clientCompany ? `<p style="margin:0 0 16px;font-size:15px;color:#94A3B8;">${opts.clientCompany}</p>` : "<div style='margin-bottom:16px'></div>"}
    ${tag(opts.serviceType, color)}

    <div style="height:1px;background:#E2E8F0;margin:28px 0;"></div>

    <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.7;">
      <strong>${opts.businessName}</strong> ha preparado una propuesta personalizada para ti.
      Revísala a tu ritmo y, cuando estés listo, puedes aprobarla directamente desde el enlace.
    </p>

    <div style="margin-bottom:28px;">
      ${btn("Ver propuesta →", opts.proposalUrl, color)}
    </div>

    <p style="margin:0;font-size:13px;color:#94A3B8;">
      O copia este enlace en tu navegador:<br/>
      <a href="${opts.proposalUrl}" style="color:${color};word-break:break-all;">${opts.proposalUrl}</a>
    </p>
  `, color);

  return { subject, html };
}

// ─── 2. Propuesta vista — notificación al owner ──────────────────────────────

export function proposalViewed(opts: {
  ownerName: string;
  clientName: string;
  clientCompany?: string;
  serviceType: string;
  proposalUrl: string;
  dashboardUrl: string;
}): { subject: string; html: string } {
  const subject = `${opts.clientName} ha abierto tu propuesta`;

  const html = base(`
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:28px;">
      <div style="width:40px;height:40px;background:#F0FDF4;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:20px;line-height:1;">👁</div>
      <div>
        <p style="margin:0;font-size:11px;font-weight:600;color:#16A34A;text-transform:uppercase;letter-spacing:0.08em;">Propuesta vista</p>
        <h2 style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0F172A;">${opts.clientName} ha abierto tu propuesta</h2>
      </div>
    </div>

    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0 0 4px;font-size:12px;color:#94A3B8;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Propuesta</p>
      <p style="margin:0;font-size:15px;font-weight:600;color:#0F172A;">${opts.serviceType}</p>
      ${opts.clientCompany ? `<p style="margin:4px 0 0;font-size:13px;color:#64748B;">${opts.clientCompany}</p>` : ""}
    </div>

    <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.7;">
      Este es el momento ideal para hacer un seguimiento. Puedes ver la propuesta o gestionarla desde tu dashboard.
    </p>

    <div style="display:flex;gap:12px;margin-bottom:8px;">
      ${btn("Ver propuesta", opts.proposalUrl)}
      <a href="${opts.dashboardUrl}" style="display:inline-block;border:2px solid #E2E8F0;color:#334155;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:100px;margin-left:12px;">Dashboard →</a>
    </div>
  `);

  return { subject, html };
}

// ─── 3. Propuesta aprobada — notificación al owner ───────────────────────────

export function proposalApproved(opts: {
  ownerName: string;
  clientName: string;
  clientCompany?: string;
  serviceType: string;
  proposalUrl: string;
  dashboardUrl: string;
}): { subject: string; html: string } {
  const subject = `¡${opts.clientName} ha aprobado tu propuesta!`;

  const html = base(`
    <div style="text-align:center;padding:8px 0 24px;">
      <div style="font-size:48px;line-height:1;margin-bottom:16px;">🎉</div>
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0F172A;letter-spacing:-0.5px;">¡Propuesta aprobada!</h1>
      <p style="margin:0;font-size:15px;color:#64748B;">${opts.clientName}${opts.clientCompany ? ` · ${opts.clientCompany}` : ""} ha aceptado tu propuesta.</p>
    </div>

    <div style="height:1px;background:#E2E8F0;margin:0 0 28px;"></div>

    <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0 0 4px;font-size:12px;color:#16A34A;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Servicio aprobado</p>
      <p style="margin:0;font-size:16px;font-weight:700;color:#14532D;">${opts.serviceType}</p>
    </div>

    <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7;">
      Enhorabuena. Ahora puedes ponerte en contacto con ${opts.clientName} para dar los siguientes pasos — o generar el contrato directamente desde la propuesta.
    </p>

    <div style="margin-bottom:8px;">
      ${btn("Ver propuesta y generar contrato →", opts.proposalUrl, "#16A34A")}
    </div>
  `, "#16A34A");

  return { subject, html };
}

// ─── 4. Contrato enviado al cliente ─────────────────────────────────────────

export function contractSentToClient(opts: {
  clientName: string;
  clientCompany?: string;
  businessName: string;
  contractType: string;
  contractUrl: string;
  primaryColor?: string;
}): { subject: string; html: string } {
  const color = opts.primaryColor ?? "#2563EB";
  const subject = `${opts.businessName} te ha enviado un contrato para revisar`;

  const html = base(`
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:0.06em;">Contrato para</p>
    <h1 style="margin:0 0 4px;font-size:26px;font-weight:800;color:#0F172A;letter-spacing:-0.5px;">${opts.clientName}</h1>
    ${opts.clientCompany ? `<p style="margin:0 0 16px;font-size:15px;color:#94A3B8;">${opts.clientCompany}</p>` : "<div style='margin-bottom:16px'></div>"}
    ${tag(opts.contractType, color)}

    <div style="height:1px;background:#E2E8F0;margin:28px 0;"></div>

    <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.7;">
      <strong>${opts.businessName}</strong> te ha enviado un contrato de prestación de servicios para que lo revises.
      Léelo con detenimiento y, si estás de acuerdo, podrás descargarlo o firmar según se haya acordado.
    </p>

    <div style="margin-bottom:28px;">
      ${btn("Ver contrato →", opts.contractUrl, color)}
    </div>

    <p style="margin:0;font-size:13px;color:#94A3B8;">
      O copia este enlace:<br/>
      <a href="${opts.contractUrl}" style="color:${color};word-break:break-all;">${opts.contractUrl}</a>
    </p>
  `, color);

  return { subject, html };
}
