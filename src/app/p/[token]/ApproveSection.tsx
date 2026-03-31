"use client";

import { useEffect, useState } from "react";

interface Props {
  token: string;
  initialStatus: string;
  primaryColor: string;
  businessName: string;
  footerText: string | null;
}

export default function ApproveSection({ token, initialStatus, primaryColor, businessName, footerText }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [approving, setApproving] = useState(false);

  // Track view on mount
  useEffect(() => {
    fetch("/api/proposals/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  }, [token]);

  async function handleApprove() {
    setApproving(true);
    const res = await fetch("/api/proposals/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (res.ok) setStatus("approved");
    setApproving(false);
  }

  return (
    <>
      {/* CTA */}
      <div className="mt-16 pt-10 border-t border-gray-100 text-center space-y-4">
        {status === "approved" ? (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-3 rounded-full text-sm font-semibold border border-green-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Propuesta aprobada
            </div>
            <p className="text-xs text-gray-400">Nos pondremos en contacto contigo pronto.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Si estás de acuerdo con esta propuesta, puedes aprobarla con un clic.
            </p>
            <button
              onClick={handleApprove}
              disabled={approving}
              className="inline-block px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              style={{ backgroundColor: primaryColor }}
            >
              {approving ? "Procesando..." : "Aprobar propuesta"}
            </button>
            <p className="text-xs text-gray-400">
              ¿Tienes dudas? Responde a este correo o contacta directamente con nosotros.
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-16 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">{footerText ?? businessName}</p>
      </div>
    </>
  );
}
