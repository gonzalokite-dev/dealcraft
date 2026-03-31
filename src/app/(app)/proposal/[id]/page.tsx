"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CANONICAL_ORDER, SECTION_LABELS, PROPOSAL_TYPE_LABELS, PDF_TEMPLATES, IP_OWNERSHIP_OPTIONS } from "@/lib/proposals/constants";
import type { PDFTemplateName } from "@/lib/pdf/ProposalPDF";

interface Proposal {
  id: string;
  client_name: string;
  client_company: string;
  service_type: string;
  input_data: Record<string, string>;
  generated_content: Record<string, string>;
  created_at: string;
  status?: string;
  public_token?: string;
}

const AI_ACTIONS = [
  { key: "regenerate", label: "Regenerar sección" },
  { key: "shorten",    label: "Acortar" },
  { key: "expand",     label: "Ampliar" },
  { key: "persuasive", label: "Más persuasivo" },
];

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  draft:    { label: "Borrador",  class: "bg-gray-100 text-gray-500" },
  sent:     { label: "Enviada",   class: "bg-blue-50 text-blue-600" },
  viewed:   { label: "Vista",     class: "bg-amber-50 text-amber-600" },
  approved: { label: "Aprobada",  class: "bg-green-50 text-green-600" },
};

/** Renders AI-generated text with bullets and line breaks */
function SectionContent({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);
  return (
    <div className="space-y-3">
      {paragraphs.map((para, pi) => {
        const lines = para.split("\n").filter(Boolean);
        const isList = lines.every((l) => /^[-•*]/.test(l.trim()) || /^\d+\./.test(l.trim()));
        if (isList) {
          return (
            <ul key={pi} className="space-y-1.5 pl-1">
              {lines.map((line, li) => (
                <li key={li} className="flex items-start gap-2.5 text-sm text-secondary leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0 mt-2" />
                  <span>{line.replace(/^[-•*]\s*/, "").replace(/^\d+\.\s*/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <div key={pi} className="space-y-1">
            {lines.map((line, li) => (
              <p key={li} className="text-sm text-secondary leading-relaxed">{line}</p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/** Modal to collect minimal provider info before generating contract */
function ContractModal({
  clientName,
  onClose,
  onGenerate,
  loading,
}: {
  clientName: string;
  onClose: () => void;
  onGenerate: (data: { provider_name: string; provider_nif: string; provider_address: string; ip_ownership: string; jurisdiction: string }) => void;
  loading: boolean;
}) {
  const [providerName, setProviderName] = useState("");
  const [providerNif, setProviderNif] = useState("");
  const [providerAddress, setProviderAddress] = useState("");
  const [ipOwnership, setIpOwnership] = useState("cliente");
  const [jurisdiction, setJurisdiction] = useState("España");
  const [err, setErr] = useState("");

  function submit() {
    if (!providerName.trim()) { setErr("Tu nombre o razón social es obligatorio."); return; }
    onGenerate({ provider_name: providerName, provider_nif: providerNif, provider_address: providerAddress, ip_ownership: ipOwnership, jurisdiction });
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-md p-7 space-y-5">
        <div>
          <h2 className="font-heading text-lg font-bold text-secondary">Generar contrato</h2>
          <p className="text-sm text-muted mt-1">
            Se redactará un contrato de prestación de servicios para <strong>{clientName}</strong> con los datos de la propuesta. Solo necesitamos tus datos legales.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">El prestador (tú)</p>
          <input value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Tu nombre completo o razón social *" className={inputCls} autoFocus />
          <div className="grid grid-cols-2 gap-2">
            <input value={providerNif} onChange={(e) => setProviderNif(e.target.value)} placeholder="NIF / CIF (opcional)" className={inputCls} />
            <input value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} placeholder="Jurisdicción" className={inputCls} />
          </div>
          <input value={providerAddress} onChange={(e) => setProviderAddress(e.target.value)} placeholder="Domicilio (opcional)" className={inputCls} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-secondary">Propiedad intelectual de los entregables</p>
          <div className="space-y-1.5">
            {IP_OWNERSHIP_OPTIONS.map((opt) => (
              <button key={opt.value} type="button" onClick={() => setIpOwnership(opt.value)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-colors ${
                  ipOwnership === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-gray-300"}`}>
                <span className={`text-xs font-medium ${ipOwnership === opt.value ? "text-primary" : "text-secondary"}`}>{opt.label}</span>
                <span className="text-xs text-muted max-w-[55%] text-right leading-tight">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {err && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{err}</p>}

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-full text-sm text-secondary hover:border-gray-400 transition-colors">
            Cancelar
          </button>
          <button onClick={submit} disabled={loading}
            className="flex-1 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
            {loading ? "Redactando..." : "Generar contrato →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProposalPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [content, setContent] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [template, setTemplate] = useState<PDFTemplateName>("classic");
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");

  // Share
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  // AI editing
  const [sectionLoading, setSectionLoading] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Contract modal
  const [showContractModal, setShowContractModal] = useState(false);
  const [generatingContract, setGeneratingContract] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.from("proposals").select("*").eq("id", id).single();
      if (error || !data) { router.push("/dashboard"); return; }
      setProposal(data);
      setContent(data.generated_content);
      setLoading(false);
    }
    load();
  }, [id, router]);

  useEffect(() => {
    function handler() { setOpenMenu(null); }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  function handleChange(section: string, value: string) {
    setContent((prev) => prev ? { ...prev, [section]: value } : prev);
    setSaved(false);
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("proposals").update({ generated_content: content }).eq("id", id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleDuplicate() {
    if (!proposal || !content) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("proposals").insert({
      user_id: user.id,
      client_name: `${proposal.client_name} (copia)`,
      client_company: proposal.client_company,
      service_type: proposal.service_type,
      input_data: proposal.input_data,
      generated_content: content,
    }).select("id").single();
    if (data) router.push(`/proposal/${data.id}`);
  }

  async function handleExportPDF() {
    setExporting(true);
    try {
      const res = await fetch(`/api/proposals/${id}/pdf?template=${template}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `propuesta-${proposal?.client_name ?? id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Error al generar el PDF. Intenta de nuevo.");
    } finally {
      setExporting(false);
    }
  }

  async function handleShare() {
    setSharing(true);
    try {
      const res = await fetch(`/api/proposals/${id}/share`, { method: "POST" });
      const data = await res.json();
      if (data.url) setShareUrl(data.url);
    } catch {
      alert("Error al generar el enlace.");
    } finally {
      setSharing(false);
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSectionAction(sectionKey: string, action: string) {
    if (!content) return;
    setOpenMenu(null);
    setSectionLoading(sectionKey);
    try {
      const res = await fetch("/api/proposals/section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal_id: id, section_key: sectionKey, current_content: content[sectionKey], action }),
      });
      const data = await res.json();
      if (data.content) handleChange(sectionKey, data.content);
    } catch {
      alert("Error al procesar la sección.");
    } finally {
      setSectionLoading(null);
    }
  }

  async function handleGenerateContract(data: {
    provider_name: string; provider_nif: string; provider_address: string;
    ip_ownership: string; jurisdiction: string;
  }) {
    setGeneratingContract(true);
    try {
      const res = await fetch(`/api/proposals/${id}/contract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setShowContractModal(false);
      router.push(`/contract/${json.contract_id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al generar el contrato.");
      setGeneratingContract(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted">Cargando propuesta...</p>
      </div>
    );
  }

  if (!proposal || !content) return null;

  const activeSections = CANONICAL_ORDER.filter((key) => key in content);
  const statusInfo = STATUS_LABELS[proposal.status ?? "draft"];

  return (
    <div className="min-h-screen bg-background">

      {/* Sticky navbar */}
      <header className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard" className="font-heading font-bold text-lg text-secondary tracking-tight flex-shrink-0">
              DealCraft
            </Link>
            <span className="text-border hidden sm:block">|</span>
            <div className="min-w-0 hidden sm:block">
              <p className="text-sm font-medium text-secondary truncate">{proposal.client_name}</p>
              {proposal.client_company && <p className="text-xs text-muted truncate">{proposal.client_company}</p>}
            </div>
            {statusInfo && (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 hidden md:inline ${statusInfo.class}`}>
                {statusInfo.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* View / Edit toggle */}
            <div className="flex bg-background border border-border rounded-full p-0.5 mr-1">
              <button onClick={() => setViewMode("view")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${viewMode === "view" ? "bg-surface text-secondary shadow-sm" : "text-muted hover:text-secondary"}`}>
                Vista
              </button>
              <button onClick={() => setViewMode("edit")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${viewMode === "edit" ? "bg-surface text-secondary shadow-sm" : "text-muted hover:text-secondary"}`}>
                Editar
              </button>
            </div>

            <button onClick={handleDuplicate} className="text-xs text-muted hover:text-secondary border border-border px-3 py-2 rounded-full transition-colors hidden sm:block">
              Duplicar
            </button>
            <button onClick={handleShare} disabled={sharing} className="text-xs font-medium border border-border text-secondary px-3 py-2 rounded-full hover:border-gray-300 transition-colors disabled:opacity-50 hidden sm:block">
              {sharing ? "..." : "Compartir"}
            </button>
            {viewMode === "edit" && (
              <button onClick={handleSave} disabled={saving} className="text-xs font-medium border border-border text-secondary px-4 py-2 rounded-full hover:border-gray-300 transition-colors disabled:opacity-50">
                {saving ? "Guardando..." : saved ? "Guardado ✓" : "Guardar"}
              </button>
            )}
            <button onClick={handleExportPDF} disabled={exporting} className="text-xs font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50">
              {exporting ? "Generando..." : "Exportar PDF"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        {/* Proposal header card */}
        <div className="bg-surface border border-border rounded-2xl p-8">
          <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Propuesta para</p>
          <h1 className="font-heading text-3xl font-bold text-secondary">
            {proposal.client_name}
            {proposal.client_company && <span className="text-muted font-normal"> · {proposal.client_company}</span>}
          </h1>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs border border-border rounded-full px-3 py-1 text-muted">{proposal.service_type}</span>
            {proposal.input_data?.proposal_type && (
              <span className="text-xs border border-border rounded-full px-3 py-1 text-muted">
                {PROPOSAL_TYPE_LABELS[proposal.input_data.proposal_type] ?? proposal.input_data.proposal_type}
              </span>
            )}
            {proposal.input_data?.sector && (
              <span className="text-xs border border-border rounded-full px-3 py-1 text-muted">
                {proposal.input_data.sector === "Otro" ? proposal.input_data.sector_custom || "Otro" : proposal.input_data.sector}
              </span>
            )}
            <span className="text-xs border border-border rounded-full px-3 py-1 text-muted">
              {new Date(proposal.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* ── VIEW MODE ── */}
        {viewMode === "view" && (
          <div className="bg-surface border border-border rounded-2xl divide-y divide-border overflow-hidden">
            {activeSections.map((key, idx) => (
              <div key={key} className="px-8 py-6">
                <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">
                  {String(idx + 1).padStart(2, "0")} · {SECTION_LABELS[key] ?? key}
                </p>
                <SectionContent text={content[key]} />
              </div>
            ))}
          </div>
        )}

        {/* ── EDIT MODE ── */}
        {viewMode === "edit" && (
          <div className="space-y-4">
            {activeSections.map((key) => (
              <div key={key} className="bg-surface border border-border rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-secondary uppercase tracking-widest" htmlFor={key}>
                    {SECTION_LABELS[key] ?? key}
                  </label>
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button type="button"
                      onClick={() => setOpenMenu(openMenu === key ? null : key)}
                      disabled={sectionLoading === key}
                      className="flex items-center gap-1 text-xs text-muted hover:text-primary border border-border hover:border-primary/40 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                      {sectionLoading === key ? "Procesando..." : "IA"}
                    </button>
                    {openMenu === key && (
                      <div className="absolute right-0 top-8 z-20 bg-surface border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
                        {AI_ACTIONS.map((action) => (
                          <button key={action.key} type="button"
                            onClick={() => handleSectionAction(key, action.key)}
                            className="w-full text-left px-4 py-2 text-xs text-secondary hover:bg-background transition-colors">
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <textarea id={key} rows={7}
                  value={sectionLoading === key ? "Procesando con IA..." : content[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  disabled={sectionLoading === key}
                  className="w-full text-sm text-secondary leading-relaxed bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none disabled:opacity-50" />
              </div>
            ))}
          </div>
        )}

        {/* Template selector */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-widest">Plantilla del PDF</p>
            <p className="text-xs text-muted mt-1">Elige el diseño con el que se exportará el documento</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PDF_TEMPLATES.map((t) => (
              <button key={t.value} type="button" onClick={() => setTemplate(t.value as PDFTemplateName)}
                className={`flex flex-col items-start gap-1.5 px-4 py-3 rounded-xl border text-left transition-colors ${
                  template === t.value ? "border-primary bg-primary/5" : "border-border hover:border-gray-300"}`}>
                <span className={`text-sm font-semibold ${template === t.value ? "text-primary" : "text-secondary"}`}>{t.label}</span>
                <span className="text-xs text-muted leading-tight">{t.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2 pb-10">
          <div className="flex gap-3">
            <button onClick={handleShare} disabled={sharing}
              className="text-sm font-medium border border-border text-secondary px-5 py-2.5 rounded-full hover:border-gray-400 transition-colors disabled:opacity-50">
              {sharing ? "Generando enlace..." : "Compartir"}
            </button>
            <button onClick={() => setShowContractModal(true)}
              className="text-sm font-medium border border-secondary/20 text-secondary px-5 py-2.5 rounded-full hover:border-secondary/50 hover:bg-secondary/4 transition-colors flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 1h6M4 1v12h6V1M1 4h2M1 7h2M1 10h2M12 4h1M12 7h1M12 10h1" />
              </svg>
              Generar contrato
            </button>
          </div>
          <div className="flex gap-3">
            {viewMode === "edit" && (
              <button onClick={handleSave} disabled={saving}
                className="text-sm font-medium border-2 border-secondary/20 text-secondary px-5 py-2.5 rounded-full hover:border-secondary/50 transition-colors disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            )}
            <button onClick={handleExportPDF} disabled={exporting}
              className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50">
              {exporting ? "Generando PDF..." : "Exportar PDF"}
            </button>
          </div>
        </div>
      </main>

      {/* Share modal */}
      {shareUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-md p-8 space-y-5">
            <div>
              <h2 className="font-heading text-lg font-bold text-secondary">Enlace de propuesta</h2>
              <p className="text-sm text-muted mt-1">Comparte este enlace con tu cliente. Recibirás una notificación cuando la vea o la apruebe.</p>
            </div>
            <div className="flex gap-2">
              <input readOnly value={shareUrl}
                className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-background text-xs text-secondary font-mono overflow-hidden" />
              <button onClick={copyLink}
                className="px-4 py-2.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0">
                {copied ? "Copiado ✓" : "Copiar"}
              </button>
            </div>
            <div className="flex gap-2 text-xs text-muted bg-background border border-border rounded-lg px-4 py-3">
              <svg className="w-4 h-4 flex-shrink-0 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>El estado se actualiza automáticamente cuando tu cliente abre o aprueba la propuesta.</span>
            </div>
            <button onClick={() => setShareUrl(null)}
              className="w-full py-2.5 border border-border rounded-full text-sm text-secondary hover:border-gray-400 transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Contract generation modal */}
      {showContractModal && (
        <ContractModal
          clientName={proposal.client_name}
          onClose={() => { setShowContractModal(false); setGeneratingContract(false); }}
          onGenerate={handleGenerateContract}
          loading={generatingContract}
        />
      )}
    </div>
  );
}
