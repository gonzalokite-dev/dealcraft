"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CONTRACT_TYPE_LABELS, CONTRACT_STATUS_LABELS } from "@/lib/proposals/constants";

interface Contract {
  id: string;
  client_name: string;
  client_company: string | null;
  client_email: string | null;
  contract_type: string;
  generated_content: string;
  created_at: string;
  status: string | null;
  input_data: Record<string, string>;
}

export default function ContractPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendEmail, setSendEmail] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) { router.push("/dashboard"); return; }
      setContract(data as Contract);
      setLoading(false);
    }
    load();
  }, [id, router]);

  async function copyToClipboard() {
    if (!contract) return;
    await navigator.clipboard.writeText(contract.generated_content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  async function handleSendEmail() {
    if (!contract) return;
    const to = sendEmail.trim() || contract.client_email;
    if (!to) return;
    setSending(true);
    try {
      await fetch(`/api/contracts/${id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_email: to }),
      });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted">Cargando contrato...</p>
      </div>
    );
  }

  if (!contract) return null;

  const statusInfo = CONTRACT_STATUS_LABELS[contract.status ?? "draft"];
  const contractTitle = CONTRACT_TYPE_LABELS[contract.contract_type] ?? "Contrato de Prestación de Servicios";

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar — hidden on print */}
      <header className="border-b border-border bg-surface print:hidden">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-heading font-bold text-lg text-secondary tracking-tight">
            DealCraft
          </Link>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.class}`}>
              {statusInfo.label}
            </span>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center gap-1.5 text-sm font-medium border border-border text-secondary px-4 py-2 h-9 rounded-full hover:border-gray-400 transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l4 4 6-6" />
                  </svg>
                  Copiado
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
                    <rect x="1" y="4" width="9" height="9" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4V2.5A1.5 1.5 0 015.5 1H11.5A1.5 1.5 0 0113 2.5V8.5A1.5 1.5 0 0111.5 10H10" />
                  </svg>
                  Copiar
                </>
              )}
            </button>
            <div className="flex items-center gap-1.5">
              <input
                type="email"
                value={sendEmail}
                onChange={(e) => setSendEmail(e.target.value)}
                placeholder={contract.client_email || "Email del cliente"}
                className="text-sm border border-border rounded-full px-3 h-9 w-44 text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
              <button
                onClick={handleSendEmail}
                disabled={sending || (!sendEmail.trim() && !contract.client_email)}
                className="inline-flex items-center gap-1.5 text-sm font-medium border border-border text-secondary px-3 py-2 h-9 rounded-full hover:border-gray-400 transition-colors disabled:opacity-40"
              >
                {sent ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l4 4 6-6" />
                    </svg>
                    Enviado
                  </>
                ) : sending ? "..." : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M1 1l12 6-12 6V8.5l8-2.5-8-2.5V1z" />
                    </svg>
                    Enviar
                  </>
                )}
              </button>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-primary text-white px-4 py-2 h-9 rounded-full hover:bg-blue-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5V1h8v4M2 5h10a1 1 0 011 1v4a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1zM4 10v3h6v-3" />
              </svg>
              Imprimir / PDF
            </button>
          </div>
        </div>
      </header>

      {/* Contract document */}
      <main className="max-w-4xl mx-auto px-6 py-12 print:py-0 print:px-0 print:max-w-none">

        {/* Document header — print included */}
        <div className="mb-8 print:mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h1 className="font-heading text-2xl font-bold text-secondary">{contractTitle}</h1>
              <p className="text-muted text-sm mt-1">
                {contract.client_name}
                {contract.client_company && ` · ${contract.client_company}`}
              </p>
            </div>
            <div className="text-right text-xs text-muted flex-shrink-0">
              <p>Creado el {new Date(contract.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</p>
              {contract.client_email && <p className="mt-0.5">{contract.client_email}</p>}
            </div>
          </div>
        </div>

        {/* Contract text */}
        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 print:border-none print:rounded-none print:p-0 print:shadow-none">
          <pre className="font-sans text-sm text-secondary leading-relaxed whitespace-pre-wrap break-words">
            {contract.generated_content}
          </pre>
        </div>

        {/* Back link */}
        <div className="mt-8 print:hidden">
          <Link href="/dashboard" className="text-sm text-muted hover:text-secondary transition-colors">
            ← Volver al dashboard
          </Link>
        </div>
      </main>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white; }
          header, .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
