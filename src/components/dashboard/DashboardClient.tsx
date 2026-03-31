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
    day: "numeric", month: "long", year: "numeric",
  });
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

  return (
    <div className="min-h-screen bg-background">

      {/* Navbar */}
      <header className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-heading font-bold text-lg text-secondary tracking-tight">
            DealCraft
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted hidden sm:block">{userEmail}</span>
            <Link href="/settings" className="text-xs text-muted hover:text-secondary transition-colors">
              Configuración
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button className="text-xs text-muted hover:text-secondary transition-colors">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* Page header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-secondary">
              {profile?.business_name ? `Hola, ${profile.business_name}` : "Mi espacio de trabajo"}
            </h1>
            <p className="text-muted text-sm mt-1">
              {tab === "proposals"
                ? proposalCount === 0 ? "Aún no tienes propuestas." : `${proposalCount} propuesta${proposalCount !== 1 ? "s" : ""}`
                : contracts.length === 0 ? "Aún no tienes contratos." : `${contracts.length} contrato${contracts.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {tab === "proposals" ? (
              atLimit ? (
                <Link
                  href="/signup?plan=pro"
                  className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Actualizar a Pro
                </Link>
              ) : (
                <Link
                  href="/proposal/new"
                  className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Nueva propuesta
                </Link>
              )
            ) : (
              <Link
                href="/contract/new"
                className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Nuevo contrato
              </Link>
            )}
          </div>
        </div>

        {/* Free plan banner */}
        {isFree && tab === "proposals" && (
          <div className="bg-primary-50 border border-primary-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4 mb-6">
            <p className="text-sm text-secondary">
              Plan Free — <span className="font-medium">{proposalCount} de 3</span> propuestas usadas.
            </p>
            <Link href="/signup?plan=pro" className="text-xs font-medium text-primary hover:underline flex-shrink-0">
              Ver planes →
            </Link>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border">
          {(["proposals", "contracts"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-secondary"
              }`}
            >
              {t === "proposals" ? "Propuestas" : "Contratos"}
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab === t ? "bg-primary/10 text-primary" : "bg-gray-100 text-muted"}`}>
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
                  <div key={p.id} className="relative bg-surface border border-border rounded-2xl p-6 hover:border-gray-300 hover:shadow-card transition-all group">

                    {/* Delete button */}
                    {!isConfirming && (
                      <button
                        onClick={(e) => { e.preventDefault(); setConfirmDelete(p.id); }}
                        className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="Eliminar propuesta"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9" />
                        </svg>
                      </button>
                    )}

                    {/* Confirm delete overlay */}
                    {isConfirming && (
                      <div className="absolute inset-0 bg-surface rounded-2xl border border-red-200 flex flex-col items-center justify-center gap-3 p-4 z-10">
                        <p className="text-sm font-medium text-secondary text-center">¿Eliminar esta propuesta?</p>
                        <p className="text-xs text-muted text-center">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-4 py-1.5 rounded-full border border-border text-xs font-medium text-secondary hover:border-gray-400 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => deleteProposal(p.id)}
                            disabled={deleting}
                            className="px-4 py-1.5 rounded-full bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
                          >
                            {deleting ? "Eliminando..." : "Eliminar"}
                          </button>
                        </div>
                      </div>
                    )}

                    <Link href={`/proposal/${p.id}`} className="block">
                      <div className="flex items-start justify-between gap-2 mb-3 pr-6">
                        <div>
                          <p className="font-heading font-semibold text-secondary text-base group-hover:text-primary transition-colors">
                            {p.client_name}
                          </p>
                          {p.client_company && (
                            <p className="text-xs text-muted mt-0.5">{p.client_company}</p>
                          )}
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${s.class}`}>
                          {s.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted mb-2">{p.service_type}</p>
                      <p className="text-xs text-muted">{formatDate(p.created_at)}</p>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Sin propuestas aún"
              description="Crea tu primera propuesta en menos de 5 minutos."
              cta="Crear propuesta"
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
                  <div key={c.id} className="relative bg-surface border border-border rounded-2xl p-6 hover:border-gray-300 hover:shadow-card transition-all group">

                    {!isConfirming && (
                      <button
                        onClick={(e) => { e.preventDefault(); setConfirmDelete(c.id); }}
                        className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="Eliminar contrato"
                      >
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
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-4 py-1.5 rounded-full border border-border text-xs font-medium text-secondary hover:border-gray-400 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => deleteContract(c.id)}
                            disabled={deleting}
                            className="px-4 py-1.5 rounded-full bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
                          >
                            {deleting ? "Eliminando..." : "Eliminar"}
                          </button>
                        </div>
                      </div>
                    )}

                    <Link href={`/contract/${c.id}`} className="block">
                      <div className="flex items-start justify-between gap-2 mb-3 pr-6">
                        <div>
                          <p className="font-heading font-semibold text-secondary text-base group-hover:text-primary transition-colors">
                            {c.client_name}
                          </p>
                          {c.client_company && (
                            <p className="text-xs text-muted mt-0.5">{c.client_company}</p>
                          )}
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${s.class}`}>
                          {s.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted mb-2">
                        {CONTRACT_TYPE_LABELS[c.contract_type] ?? c.contract_type}
                      </p>
                      <p className="text-xs text-muted">{formatDate(c.created_at)}</p>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Sin contratos aún"
              description="Genera un contrato de prestación de servicios profesional en minutos."
              cta="Crear contrato"
              href="/contract/new"
            />
          )
        )}
      </main>
    </div>
  );
}

function EmptyState({ title, description, cta, href, disabled }: {
  title: string; description: string; cta: string; href: string; disabled?: boolean;
}) {
  return (
    <div className="border border-dashed border-border rounded-2xl p-16 text-center">
      <p className="font-heading text-xl font-semibold text-secondary mb-2">{title}</p>
      <p className="text-sm text-muted mb-6">{description}</p>
      {!disabled && (
        <Link href={href} className="inline-block text-sm font-medium bg-primary text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors">
          {cta}
        </Link>
      )}
    </div>
  );
}
