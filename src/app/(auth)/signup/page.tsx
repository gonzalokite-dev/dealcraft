"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationPending, setConfirmationPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // If Supabase requires email confirmation, data.session will be null.
    // In that case we cannot navigate to a protected route — show a message instead.
    if (!data.session) {
      setLoading(false);
      setError(""); // clear any prior error
      // Reuse the error slot to show the confirmation prompt (styled differently below)
      setConfirmationPending(true);
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-heading font-bold text-2xl text-secondary tracking-tight">
            DealCraft
          </Link>
          <p className="text-muted text-sm mt-2">Crea tu cuenta gratis</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8">
          {confirmationPending ? (
            <div className="text-center space-y-3">
              <p className="text-sm font-medium text-secondary">Revisa tu email</p>
              <p className="text-xs text-muted">
                Te enviamos un enlace de confirmación a <span className="font-medium text-secondary">{email}</span>.
                Haz clic en el enlace para activar tu cuenta.
              </p>
              <p className="text-xs text-muted/70 mt-2">
                Ya confirmado?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary" htmlFor="password">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-secondary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
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
                className="w-full bg-primary text-white font-medium py-2.5 rounded-full hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-[0.99] text-sm disabled:opacity-60 disabled:pointer-events-none mt-2"
              >
                {loading ? "Creando cuenta..." : "Crear cuenta gratis"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>

        <p className="text-center text-xs text-muted/60 mt-3">
          Al registrarte aceptas nuestros{" "}
          <Link href="/terms" className="hover:underline">Términos</Link>
          {" "}y{" "}
          <Link href="/privacy" className="hover:underline">Política de privacidad</Link>.
        </p>
      </div>
    </div>
  );
}
