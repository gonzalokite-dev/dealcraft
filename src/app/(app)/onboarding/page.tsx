"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    business_name: "",
    primary_color: "#2563EB",
    secondary_color: "#1E293B",
    footer_text: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    let logo_url: string | null = null;

    // Subir logo si existe
    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const path = `${user.id}/logo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(path, logoFile, { upsert: true });

      if (uploadError) {
        setError("Error al subir el logo. Intenta de nuevo.");
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
      logo_url = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ ...form, ...(logo_url ? { logo_url } : {}) })
      .eq("id", user.id);

    if (updateError) {
      setError("Error al guardar el perfil. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-10">
          <span className="font-heading font-bold text-2xl text-secondary tracking-tight">DealCraft</span>
          <h1 className="font-heading text-3xl font-bold text-secondary mt-6 leading-tight">
            Configura tu marca
          </h1>
          <p className="text-muted text-sm mt-2">
            Esta información se aplicará a todas tus propuestas. Puedes cambiarla después.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nombre del negocio */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-secondary" htmlFor="business_name">
              Nombre de tu negocio
            </label>
            <input
              id="business_name"
              name="business_name"
              type="text"
              required
              value={form.business_name}
              onChange={handleChange}
              placeholder="Ej. Estudio Roca, Fuentes Consulting..."
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          {/* Logo */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-secondary">Logo</label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-14 h-14 object-contain rounded-xl border border-border bg-surface p-1" />
              ) : (
                <div className="w-14 h-14 rounded-xl border border-border bg-surface flex items-center justify-center">
                  <span className="text-xs text-muted">PNG</span>
                </div>
              )}
              <label className="cursor-pointer text-sm font-medium text-primary hover:underline">
                {logoPreview ? "Cambiar logo" : "Subir logo"}
                <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
              </label>
            </div>
          </div>

          {/* Colores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-secondary" htmlFor="primary_color">
                Color principal
              </label>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface">
                <input
                  type="color"
                  id="primary_color"
                  name="primary_color"
                  value={form.primary_color}
                  onChange={handleChange}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="text-sm text-secondary font-mono">{form.primary_color}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-secondary" htmlFor="secondary_color">
                Color secundario
              </label>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface">
                <input
                  type="color"
                  id="secondary_color"
                  name="secondary_color"
                  value={form.secondary_color}
                  onChange={handleChange}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="text-sm text-secondary font-mono">{form.secondary_color}</span>
              </div>
            </div>
          </div>

          {/* Pie de página */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-secondary" htmlFor="footer_text">
              Texto de pie de página <span className="text-muted font-normal">(opcional)</span>
            </label>
            <input
              id="footer_text"
              name="footer_text"
              type="text"
              value={form.footer_text}
              onChange={handleChange}
              placeholder="Ej. www.tunegocio.com · hola@tunegocio.com"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-medium py-3 rounded-full hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm disabled:opacity-60 disabled:pointer-events-none"
          >
            {loading ? "Guardando..." : "Guardar y continuar"}
          </button>
        </form>
      </div>
    </div>
  );
}
