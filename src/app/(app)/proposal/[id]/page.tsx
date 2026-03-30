"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface GeneratedContent {
  introduction: string;
  problem: string;
  solution: string;
  deliverables: string;
  timeline: string;
  pricing: string;
  cta: string;
}

interface Proposal {
  id: string;
  client_name: string;
  client_company: string;
  service_type: string;
  input_data: Record<string, string>;
  generated_content: GeneratedContent;
  created_at: string;
}

const sectionLabels: Record<keyof GeneratedContent, string> = {
  introduction: "Introducción",
  problem: "Entendimiento del problema",
  solution: "Solución propuesta",
  deliverables: "Entregables",
  timeline: "Cronograma",
  pricing: "Precio",
  cta: "Cierre y llamada a la acción",
};

const sectionOrder: (keyof GeneratedContent)[] = [
  "introduction",
  "problem",
  "solution",
  "deliverables",
  "timeline",
  "pricing",
  "cta",
];

export default function ProposalPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        router.push("/dashboard");
        return;
      }

      setProposal(data);
      setContent(data.generated_content);
      setLoading(false);
    }
    load();
  }, [id, router]);

  function handleChange(section: keyof GeneratedContent, value: string) {
    setContent((prev) => prev ? { ...prev, [section]: value } : prev);
    setSaved(false);
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("proposals")
      .update({ generated_content: content })
      .eq("id", id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleDuplicate() {
    if (!proposal || !content) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("proposals")
      .insert({
        user_id: user.id,
        client_name: `${proposal.client_name} (copia)`,
        client_company: proposal.client_company,
        service_type: proposal.service_type,
        input_data: proposal.input_data,
        generated_content: content,
      })
      .select("id")
      .single();

    if (data) router.push(`/proposal/${data.id}`);
  }

  async function handleExportPDF() {
    setExporting(true);
    try {
      const res = await fetch(`/api/proposals/${id}/pdf`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted">Cargando propuesta...</p>
      </div>
    );
  }

  if (!proposal || !content) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/dashboard" className="font-heading font-bold text-lg text-secondary tracking-tight flex-shrink-0">
              DealCraft
            </Link>
            <span className="text-border">|</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-secondary truncate">{proposal.client_name}</p>
              {proposal.client_company && (
                <p className="text-xs text-muted truncate">{proposal.client_company}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDuplicate}
              className="text-xs text-muted hover:text-secondary border border-border px-3 py-2 rounded-full transition-colors hidden sm:block"
            >
              Duplicar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-medium border border-border text-secondary px-4 py-2 rounded-full hover:border-gray-300 transition-colors disabled:opacity-50"
            >
              {saving ? "Guardando..." : saved ? "Guardado" : "Guardar"}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="text-xs font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {exporting ? "Generando..." : "Exportar PDF"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Proposal header */}
        <div className="bg-surface border border-border rounded-2xl p-8">
          <p className="text-xs font-medium text-muted uppercase tracking-widest mb-3">Propuesta para</p>
          <h1 className="font-heading text-3xl font-bold text-secondary">
            {proposal.client_name}
            {proposal.client_company && (
              <span className="text-muted font-normal"> · {proposal.client_company}</span>
            )}
          </h1>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="text-xs border border-border rounded-full px-3 py-1 text-muted">
              {proposal.service_type}
            </span>
            <span className="text-xs border border-border rounded-full px-3 py-1 text-muted">
              {new Date(proposal.created_at).toLocaleDateString("es-ES", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Sections */}
        {sectionOrder.map((key) => (
          <div key={key} className="bg-surface border border-border rounded-2xl p-6 space-y-3">
            <label
              className="text-xs font-semibold text-secondary uppercase tracking-widest block"
              htmlFor={key}
            >
              {sectionLabels[key]}
            </label>
            <textarea
              id={key}
              rows={6}
              value={content[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full text-sm text-secondary leading-relaxed bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
            />
          </div>
        ))}

        {/* Bottom save */}
        <div className="flex justify-end gap-3 pt-2 pb-10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-sm font-medium border-2 border-secondary/20 text-secondary px-6 py-2.5 rounded-full hover:border-secondary/50 transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="text-sm font-medium bg-primary text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {exporting ? "Generando PDF..." : "Exportar PDF"}
          </button>
        </div>
      </main>
    </div>
  );
}
