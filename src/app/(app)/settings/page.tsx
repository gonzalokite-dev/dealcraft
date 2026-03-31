"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  business_name: string;
  primary_color: string;
  secondary_color: string;
  footer_text: string;
  logo_url: string | null;
}

const defaultProfile: Profile = {
  business_name: "",
  primary_color: "#2563EB",
  secondary_color: "#1E293B",
  footer_text: "",
  logo_url: null,
};

export default function SettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState<Profile>(defaultProfile);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data } = await supabase
        .from("profiles")
        .select("business_name, primary_color, secondary_color, footer_text, logo_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setForm({
          business_name: data.business_name ?? "",
          primary_color: data.primary_color ?? "#2563EB",
          secondary_color: data.secondary_color ?? "#1E293B",
          footer_text: data.footer_text ?? "",
          logo_url: data.logo_url ?? null,
        });
        if (data.logo_url) setLogoPreview(data.logo_url);
      }
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    let logo_url = form.logo_url;

    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const path = `${user.id}/logo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(path, logoFile, { upsert: true });

      if (uploadError) {
        setError("Error al subir el logo. Intenta de nuevo.");
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
      logo_url = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        business_name: form.business_name,
        primary_color: form.primary_color,
        secondary_color: form.secondary_color,
        footer_text: form.footer_text,
        ...(logo_url ? { logo_url } : {}),
      })
      .eq("id", user.id);

    if (updateError) {
      setError("Error al guardar. Intenta de nuevo.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-border bg-surface">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-heading font-bold text-lg text-secondary tracking-tight">
            DealCraft
          </Link>
          <Link href="/dashboard" className="text-sm text-muted hover:text-secondary transition-colors">
            ← Volver al dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-bold text-secondary leading-tight">
            Configuración
          </h1>
          <p className="text-muted text-sm mt-2">
            Actualiza el branding que se aplica a todas tus propuestas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Marca */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-heading font-semibold text-secondary text-base">
              Marca
            </h2>

            {/* Nombre del negocio */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-secondary" htmlFor="business_name">
                Nombre del negocio
              </label>
              <input
                id="business_name"
                name="business_name"
                type="text"
                value={form.business_name}
                onChange={handleChange}
                placeholder="Tu negocio"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>

            {/* Logo */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-secondary">Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-border bg-background flex items-center justify-center overflow-hidden flex-shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-xs text-muted">Sin logo</span>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="cursor-pointer text-sm font-medium text-primary hover:underline block">
                    {logoPreview ? "Cambiar logo" : "Subir logo"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                  </label>
                  <p className="text-xs text-muted">PNG, JPG o SVG. Recomendado: fondo transparente.</p>
                </div>
              </div>
            </div>

            {/* Pie de página */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-secondary" htmlFor="footer_text">
                Texto de pie de página
              </label>
              <input
                id="footer_text"
                name="footer_text"
                type="text"
                value={form.footer_text}
                onChange={handleChange}
                placeholder="Ej. www.tunegocio.com · hola@tunegocio.com"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Colores */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="font-heading font-semibold text-secondary text-base">Colores</h2>
              <p className="text-xs text-muted mt-1">Se aplican a los títulos y elementos del PDF.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary" htmlFor="primary_color">
                  Color principal
                </label>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-background">
                  <input
                    type="color"
                    id="primary_color"
                    name="primary_color"
                    value={form.primary_color}
                    onChange={handleChange}
                    className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0 flex-shrink-0"
                  />
                  <span className="text-sm text-secondary font-mono">{form.primary_color}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary" htmlFor="secondary_color">
                  Color secundario
                </label>
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-background">
                  <input
                    type="color"
                    id="secondary_color"
                    name="secondary_color"
                    value={form.secondary_color}
                    onChange={handleChange}
                    className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0 flex-shrink-0"
                  />
                  <span className="text-sm text-secondary font-mono">{form.secondary_color}</span>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-2">
              <p className="text-xs text-muted mb-3">Vista previa</p>
              <div className="h-2 rounded-full w-24" style={{ backgroundColor: form.primary_color }} />
              <p className="text-sm font-semibold" style={{ color: form.secondary_color }}>
                Propuesta para Cliente Ejemplo
              </p>
              <p className="text-xs" style={{ color: form.primary_color, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Introducción
              </p>
              <div className="h-1.5 rounded-full w-full bg-border" />
              <div className="h-1.5 rounded-full w-4/5 bg-border" />
              <div className="h-1.5 rounded-full w-3/4 bg-border" />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Link
              href="/dashboard"
              className="text-sm font-medium border-2 border-secondary/20 text-secondary px-6 py-2.5 rounded-full hover:border-secondary/50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="text-sm font-medium bg-primary text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none"
            >
              {saving ? "Guardando..." : saved ? "Guardado" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
