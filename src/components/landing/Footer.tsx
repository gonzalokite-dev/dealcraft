import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-white/10 px-4 sm:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-2">
            <span className="font-heading font-bold text-white text-lg block">DealCraft</span>
            <p className="text-white/40 text-xs leading-relaxed max-w-xs">
              Propuestas profesionales generadas con IA.<br />Para freelancers y consultores.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <p className="text-white/30 text-xs uppercase tracking-widest font-medium">Producto</p>
            <ul className="space-y-2">
              <li><a href="#diferencias" className="text-sm text-white/50 hover:text-white/80 transition-colors">Ventajas</a></li>
              <li><a href="#como-funciona" className="text-sm text-white/50 hover:text-white/80 transition-colors">Cómo funciona</a></li>
              <li><a href="#precios" className="text-sm text-white/50 hover:text-white/80 transition-colors">Precios</a></li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <p className="text-white/30 text-xs uppercase tracking-widest font-medium">Cuenta</p>
            <ul className="space-y-2">
              <li><Link href="/signup" className="text-sm text-white/50 hover:text-white/80 transition-colors">Registro</Link></li>
              <li><Link href="/login" className="text-sm text-white/50 hover:text-white/80 transition-colors">Iniciar sesión</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <p className="text-white/30 text-xs uppercase tracking-widest font-medium">Legal</p>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-white/50 hover:text-white/80 transition-colors">Privacidad</Link></li>
              <li><Link href="/terms" className="text-sm text-white/50 hover:text-white/80 transition-colors">Términos</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} DealCraft. Todos los derechos reservados.
          </p>
          <p className="text-white/25 text-xs">
            Hecho para consultores que cierran proyectos.
          </p>
        </div>
      </div>
    </footer>
  );
}
