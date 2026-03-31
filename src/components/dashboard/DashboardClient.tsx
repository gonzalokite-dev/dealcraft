"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTRACT_TYPE_LABELS, CONTRACT_STATUS_LABELS } from "@/lib/proposals/constants";

interface Proposal {
  id: string;
  client_name: string;
  client_company: string | null;
  service_type: string;
  created_at: string;
  status: string | null;
}

interface Contract {
  id: string;
  client_name: string;
  client_company: string | null;
  contract_type: string;
  created_at: string;
  status: string | null;
}

interface Props {
  proposals: Proposal[];
  contracts: Contract[];
  profile: { business_name: string | null; plan: string | null } | null;
  userEmail: string;
}

const PROPOSAL_STATUS: Record<string, { label: string; class: string }> = {
  draft:    { label: "Borrador",  class: "bg-gray-100 text-gray-500" },
  sent:     { label: "Enviada",   class: "bg-blue-50 text-blue-600" },
  viewed:   { label: "Vista",     class: "bg-amber-50 text-amber-600" },
  approved: { label: "Aprobada",  class: "bg-green-50 text-green-600" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function StatCard({ value, label, sub }: { value: string | number; label: string; sub?: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl px-5 py-4">
      <p className="font-heading text-2xl font-bold text-secondary">{value}</p>
      <p className="text-xs font-medium text-secondary mt-0.5">{label}</p>
      {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
    </div>
  );
}

export default function DashboardClient({ proposals: initialProposals, contracts: initialContracts, profile, userEmail }: Props) {
  const [tab, setTab] = useState<"proposals" | "contracts">("proposals");
  const [proposals, setProposals] = useState(initialProposals);
  const [contracts, setContracts] = useState(initialContracts);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isFree = profile?.plan === "free";
  const proposalCount = proposals.length;
  const atLimit = isFree && proposalCount >= 3;
  const approvedCount = proposals.filter(p => p.status === "approved").length;
  const sentCount = proposals.filter(p => p.status === "sent" || p.status === "viewed").length;
  const conversionRate = proposalCount > 0 ? Math.round((approvedCount / proposalCount) * 100) : 0;

  async function deleteProposal(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/proposals/${id}`, { method: "DELETE" });
      if (res.ok) setProposals((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  }

  async function deleteContract(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/contracts/${id}`, { method: "DELETE" });
      if (res.ok) setContracts((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  }

  const firstName = profile?.business_name?.split(" ")[0] ?? null;

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Navbar */}
      <header className="border-b border-border bg-surface flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-bold text-lg text-secondary tracking-tight">
            DealCraft
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted hidden sm:block">{userEmail}</span>
            <Link href="/settings" className="text-xs text-muted hover:text-secondary transition-colors">Ajustes</Link>
            <form action="/api/auth/signout" method="POST">
              <button className="text-xs text-muted hover:text-secondary transition-colors">Cerrar sesión</button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 flex-1 w-full">

        {/* Page header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-secondary">
              {firstName ? `Hola, ${firstName}` : "Mi espacio de trabajo"}
            </h1>
            <p className="text-muted text-sm mt-1">
              Gestiona tus propuestas y contratos desde un solo lugar.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {tab === "proposals" ? (
              atLimit ? (
                <Link href="/signup?plan=pro"
                  className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors">
                  Actualizar a Pro
                </Link>
              ) : (
                <Link href="/proposal/new"
                  className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 2v10M2 7h10" />
                  </svg>
                  Nueva propuesta
                </Link>
              )
            ) : (
              <Link href="/contract/new"
                className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 2v10M2 7h10" />
                </svg>
                Nuevo contrato
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard value={proposalCount} label="Propuestas" sub="en total" />
          <StatCard value={approvedCount} label="Aprobadas" sub={sentCount > 0 ? `${sentCount} en seguimiento` : "enviadas al cliente"} />
          <StatCard value={`${conversionRate}%`} label="Conversión" sub="propuestas aprobadas" />
          <StatCard value={contracts.length} label="Contratos" sub="generados" />
        </div>

        {/* Free plan banner */}
        {isFree && proposalCount > 0 && (
          <div className="bg-primary-50 border border-primary-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v4M8 10v1" />
                </svg>
              </div>
              <p className="text-sm text-secondary">
                Plan Free — <span className="font-semibold">{proposalCount} de 3</span> propuestas usadas.
                {atLimit && <span className="text-red-500 ml-1.5 font-medium">Límite alcanzado.</span>}
              </p>
            </div>
            <Link href="/signup?plan=pro" className="text-xs font-semibold text-primary hover:underline flex-shrink-0">
              Ver Pro →
            </Link>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border">
          {(["proposals", "contracts"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted hover:text-secondary"
              }`}>
              {t === "proposals" ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.8}>
                  <rect x="2" y="1" width="10" height="12" rx="1.5" /><path strokeLinecap="round" d="M4.5 4.5h5M4.5 7h5M4.5 9.5h3" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.8}>
                  <rect x="2" y="1" width="10" height="12" rx="1.5" /><path strokeLinecap="round" d="M4.5 4.5h5M4.5 7h5M4.5 9.5h2" /><path strokeLinecap="round" d="M8.5 11l1 1 2-2" />
                </svg>
              )}
              {t === "proposals" ? "Propuestas" : "Contratos"}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t ? "bg-primary/10 text-primary" : "bg-gray-100 text-muted"}`}>
                {t === "proposals" ? proposals.length : contracts.length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Proposals tab ── */}
        {tab === "proposals" && (
          proposals.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {proposals.map((p) => {
                const s = PROPOSAL_STATUS[p.status ?? "draft"];
                const isConfirming = confirmDelete === p.id;
                return (
                  <div key={p.id} className="relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-card transition-all group">
                    {!isConfirming && (
                      <button onClick={(e) => { e.preventDefault(); setConfirmDelete(p.id); }}
                        className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all z-10"
                        aria-label="Eliminar">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" />
                        </svg>
                      </button>
                    )}
                    {isConfirming && (
                      <div className="absolute inset-0 bg-surface rounded-2xl border border-red-200 flex flex-col items-center justify-center gap-3 p-4 z-10">
                        <p className="text-sm font-medium text-secondary text-center">¿Eliminar esta propuesta?</p>
                        <p className="text-xs text-muted text-center">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-2">
                          <button onClick={() => setConfirmDelete(null)}
                            className="px-4 py-1.5 rounded-full border border-border text-xs font-medium text-secondary hover:border-gray-400 transition-colors">
                            Cancelar
                          </button>
                          <button onClick={() => deleteProposal(p.id)} disabled={deleting}
                            className="px-4 py-1.5 rounded-full bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-60">
                            {deleting ? "..." : "Eliminar"}
                          </button>
                        </div>
                      </div>
                    )}
                    <Link href={`/proposal/${p.id}`} className="block">
                      <div className="h-1 w-full bg-gradient-to-r from-primary/40 to-primary/10" />
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-2 mb-3 pr-6">
                          <div className="min-w-0">
                            <p className="font-heading font-semibold text-secondary text-base group-hover:text-primary transition-colors truncate">
                              {p.client_name}
                            </p>
                            {p.client_company && <p className="text-xs text-muted mt-0.5 truncate">{p.client_company}</p>}
                          </div>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${s.class}`}>{s.label}</span>
                        </div>
                        <p className="text-xs text-muted truncate mb-1">{p.service_type}</p>
                        <p className="text-xs text-muted/60">{formatDate(p.created_at)}</p>
                      </div>
                    </Link>
                  </div>
                );
              })}
              {!atLimit && (
                <Link href="/proposal/new"
                  className="bg-surface border border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/2 transition-all group min-h-[130px]">
                  <div className="w-10 h-10 rounded-full bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 4v12M4 10h12" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-muted group-hover:text-primary transition-colors">Nueva propuesta</span>
                </Link>
              )}
            </div>
          ) : (
            <EmptyState
              title="Sin propuestas aún"
              description="Crea tu primera propuesta en menos de 5 minutos. La IA hace el trabajo pesado."
              cta="Crear primera propuesta"
              href="/proposal/new"
              disabled={atLimit}
            />
          )
        )}

        {/* ── Contracts tab ── */}
        {tab === "contracts" && (
          contracts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {contracts.map((c) => {
                const s = CONTRACT_STATUS_LABELS[c.status ?? "draft"];
                const isConfirming = confirmDelete === c.id;
                return (
                  <div key={c.id} className="relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-card transition-all group">
                    {!isConfirming && (
                      <button onClick={(e) => { e.preventDefault(); setConfirmDelete(c.id); }}
                        className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all z-10"
                        aria-label="Eliminar">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" />
                        </svg>
                      </button>
                    )}
                    {isConfirming && (
                      <div className="absolute inset-0 bg-surface rounded-2xl border border-red-200 flex flex-col items-center justify-center gap-3 p-4 z-10">
                        <p className="text-sm font-medium text-secondary text-center">¿Eliminar este contrato?</p>
                        <p className="text-xs text-muted text-center">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-2">
                          <button onClick={() => setConfirmDelete(null)}
                            className="px-4 py-1.5 rounded-full border border-border text-xs font-medium text-secondary hover:border-gray-400 transition-colors">
                            Cancelar
                          </button>
                          <button onClick={() => deleteContract(c.id)} disabled={deleting}
                            className="px-4 py-1.5 rounded-full bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-60">
                            {deleting ? "..." : "Eliminar"}
                          </button>
                        </div>
                      </div>
                    )}
                    <Link href={`/contract/${c.id}`} className="block">
                      <div className="h-1 w-full bg-gradient-to-r from-secondary/30 to-secondary/10" />
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-2 mb-3 pr-6">
                          <div className="min-w-0">
                            <p className="font-heading font-semibold text-secondary text-base group-hover:text-primary transition-colors truncate">
                              {c.client_name}
                            </p>
                            {c.client_company && <p className="text-xs text-muted mt-0.5 truncate">{c.client_company}</p>}
                          </div>
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${s.class}`}>{s.label}</span>
                        </div>
                        <p className="text-xs text-muted mb-1">{CONTRACT_TYPE_LABELS[c.contract_type] ?? c.contract_type}</p>
                        <p className="text-xs text-muted/60">{formatDate(c.created_at)}</p>
                      </div>
                    </Link>
                  </div>
                );
              })}
              <Link href="/contract/new"
                className="bg-surface border border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/2 transition-all group min-h-[130px]">
                <div className="w-10 h-10 rounded-full bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 4v12M4 10h12" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-muted group-hover:text-primary transition-colors">Nuevo contrato</span>
              </Link>
            </div>
          ) : (
            <EmptyState
              title="Sin contratos aún"
              description="Genera contratos de prestación de servicios directamente desde tus propuestas o desde cero."
              cta="Crear contrato"
              href="/contract/new"
            />
          )
        )}
      </main>

      {/* Dashboard footer */}
      <footer className="border-t border-border bg-surface mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <span className="font-heading font-bold text-sm text-secondary">DealCraft</span>
            <nav className="flex items-center gap-4">
              <Link href="/proposal/new" className="text-xs text-muted hover:text-secondary transition-colors">Nueva propuesta</Link>
              <Link href="/contract/new" className="text-xs text-muted hover:text-secondary transition-colors">Nuevo contrato</Link>
              <Link href="/settings" className="text-xs text-muted hover:text-secondary transition-colors">Ajustes de marca</Link>
            </nav>
          </div>
          <p className="text-xs text-muted/60">
            © {new Date().getFullYear()} DealCraft · Hecho para autónomos y empresas de servicios
          </p>
        </div>
      </footer>
    </div>
  );
}

function EmptyState({ title, description, cta, href, disabled }: {
  title: string; description: string; cta: string; href: string; disabled?: boolean;
}) {
  return (
    <div className="border border-dashed border-border rounded-2xl p-16 text-center">
      <div className="w-12 h-12 rounded-full bg-primary/8 flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
        </svg>
      </div>
      <p className="font-heading text-xl font-semibold text-secondary mb-2">{title}</p>
      <p className="text-sm text-muted mb-6 max-w-xs mx-auto">{description}</p>
      {!disabled && (
        <Link href={href} className="inline-block text-sm font-medium bg-primary text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors">
          {cta}
        </Link>
      )}
    </div>
  );
}
