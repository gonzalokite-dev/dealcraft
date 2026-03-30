"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-heading font-bold text-lg text-secondary tracking-tight">
          DealCraft
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { label: "Ventajas", href: "#diferencias" },
            { label: "Cómo funciona", href: "#como-funciona" },
            { label: "Precios", href: "#precios" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted px-3 py-2 rounded-md hover:text-secondary hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTAs — desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm font-medium text-secondary border-2 border-secondary/20 px-5 py-2 h-10 rounded-full hover:border-secondary/50 transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-primary text-white px-5 py-2 h-10 rounded-full hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            Empieza gratis
          </Link>
        </div>

        {/* Hamburger — mobile */}
        <button
          className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span className="w-4 h-0.5 bg-secondary block" />
          <span className="w-4 h-0.5 bg-secondary block" />
          <span className="w-4 h-0.5 bg-secondary block" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-border bg-background px-6 py-5 flex flex-col gap-3">
          <a href="#diferencias" className="text-sm text-muted hover:text-secondary py-1" onClick={() => setMenuOpen(false)}>Ventajas</a>
          <a href="#como-funciona" className="text-sm text-muted hover:text-secondary py-1" onClick={() => setMenuOpen(false)}>Cómo funciona</a>
          <a href="#precios" className="text-sm text-muted hover:text-secondary py-1" onClick={() => setMenuOpen(false)}>Precios</a>
          <hr className="border-border my-1" />
          <Link href="/login" className="text-sm font-medium text-secondary py-1">Iniciar sesión</Link>
          <Link href="/signup" className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full text-center hover:bg-blue-700 transition-colors">
            Empieza gratis
          </Link>
        </div>
      )}
    </header>
  );
}
