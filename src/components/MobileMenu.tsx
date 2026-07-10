"use client";

import Link from "next/link";
import { useState } from "react";
import BrandLogo from "./products/BrandLogo";
import { productBrands } from "@/data/products";

const navItems = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

/**
 * Menú móvil: "Catálogo" enlaza directo a la página del catálogo; "Productos"
 * expande la lista de marcas. Sin panel desplegable de motos (unificado a la
 * única página de catálogo).
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  function closeAll() {
    setOpen(false);
    setProductsOpen(false);
  }

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
          className="absolute inset-x-0 top-full max-h-[calc(100svh-4.5rem)] overflow-y-auto border-b border-black/10 bg-brand-bg px-6 py-4 shadow-lg"
        >
          {/* Catálogo = enlace directo a la única página del catálogo. */}
          <Link
            href="/catalogo"
            onClick={closeAll}
            className="flex w-full items-center justify-between py-3 text-sm tracking-wide uppercase text-brand-text/80 transition hover:text-brand-red"
          >
            Catálogo
            <span className="text-brand-text/40">→</span>
          </Link>

          <button
            onClick={() => setProductsOpen((v) => !v)}
            aria-expanded={productsOpen}
            className="flex w-full items-center justify-between py-3 text-sm tracking-wide uppercase text-brand-text/80"
          >
            Productos
            <span
              className={`text-brand-text/40 transition-transform duration-200 ${productsOpen ? "rotate-90" : ""}`}
            >
              →
            </span>
          </button>

          {productsOpen && (
            <div className="mb-2 border-l border-black/10 pl-4">
              {productBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/productos/${brand.id}`}
                  onClick={closeAll}
                  className="flex items-center gap-4 py-2.5"
                >
                  <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded border border-black/10 bg-white px-2">
                    <BrandLogo brand={brand} imgClassName="max-h-7" />
                  </span>
                  <div>
                    <p className="font-display text-sm tracking-wide">{brand.name}</p>
                    <p className="text-[11px] text-brand-text/50">{brand.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeAll}
              className="block py-3 text-sm tracking-wide uppercase text-brand-text/80 transition hover:text-brand-red"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
