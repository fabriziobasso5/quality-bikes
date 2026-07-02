"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`h-px w-6 bg-brand-text transition ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span className={`h-px w-6 bg-brand-text transition ${open ? "opacity-0" : ""}`} />
        <span
          className={`h-px w-6 bg-brand-text transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <nav
          data-testid="mobile-nav"
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-black/10 bg-brand-bg px-6 py-4 shadow-lg"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm tracking-wide uppercase text-brand-text/80 transition hover:text-brand-red"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
