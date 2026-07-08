"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import MobileMenu from "./MobileMenu";
import MotoCover from "./MotoCover";
import { motorcycles, categories } from "@/data/motorcycles";
import { siteConfig } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

const navItems = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

/**
 * Ducati-style mega menu: "Catálogo" opens a full-width white panel with
 * the whole inventory as a clean grid (photo, brand, model). Click-driven
 * (like Ducati itself) rather than hover — deliberate: no accidental
 * open/close, and it works identically for keyboard users. Closes on
 * outside click, Escape, or any navigation.
 */
export default function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const pathname = usePathname();

  // Any route change closes the panel.
  useEffect(() => {
    setMegaOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!megaOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMegaOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-brand-bg/95 backdrop-blur">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Anchor plano en vez de next/link: navegación dura al home con el
            basePath ya resuelto — funciona desde cualquier subpágina de
            GitHub Pages sin depender del estado del router del cliente. */}
        <a href={withBasePath("/")} className="flex items-center" aria-label={siteConfig.name}>
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca, dimensiones intrínsecas no fijas */}
          <img
            src={withBasePath("/assets/logo/quality-bikes-isotipo-qb.svg")}
            alt={siteConfig.name}
            className="h-9 w-auto md:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca, dimensiones intrínsecas no fijas */}
          <img
            src={withBasePath("/assets/logo/quality-bikes-logo-color.svg")}
            alt={siteConfig.name}
            className="hidden h-11 w-auto md:block"
          />
        </a>

        <nav className="hidden items-center gap-8 text-sm tracking-wide uppercase md:flex">
          <button
            onClick={() => setMegaOpen((v) => !v)}
            aria-expanded={megaOpen}
            aria-controls="mega-catalogo"
            className={`uppercase tracking-wide transition ${
              megaOpen ? "text-brand-navy" : "text-brand-text/70 hover:text-brand-red"
            }`}
          >
            Catálogo
          </button>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-brand-text/70 transition hover:text-brand-red"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/catalogo"
          className="hidden rounded-full bg-brand-navy px-5 py-2 text-xs tracking-widest uppercase text-brand-bg transition hover:bg-brand-navy-soft md:inline-block"
        >
          Ver inventario
        </Link>
        <MobileMenu />
      </div>

      <AnimatePresence>
        {megaOpen && (
          <>
            {/* Invisible catch-all behind the panel: outside click closes. */}
            <div
              className="fixed inset-0 z-[-1] cursor-default"
              onClick={() => setMegaOpen(false)}
              aria-hidden
            />
            <motion.div
              id="mega-catalogo"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full hidden max-h-[calc(100vh-5rem)] overflow-y-auto border-b border-black/10 bg-white shadow-xl shadow-black/5 md:block"
            >
              <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="grid grid-cols-4 gap-x-5 gap-y-6">
                  {motorcycles.map((moto) => (
                    <Link
                      key={moto.slug}
                      href={`/catalogo/${moto.slug}`}
                      onClick={() => setMegaOpen(false)}
                      className="group text-center"
                    >
                      <div className="relative">
                        <MotoCover
                          moto={moto}
                          className="mx-auto aspect-[4/3] w-full overflow-hidden"
                          imgClassName="transition-transform duration-300 group-hover:scale-105"
                          sizes="220px"
                        />
                        {moto.availability === "proximo-arribo" && (
                          <span className="absolute top-1.5 left-1.5 rounded-full border border-brand-red/40 bg-white/90 px-2 py-0.5 text-[8px] tracking-[0.18em] text-brand-red uppercase">
                            Próximo arribo
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-[11px] tracking-widest text-brand-text/50 uppercase">
                        {moto.brand}
                      </p>
                      <p className="font-display text-sm tracking-wide uppercase text-brand-text group-hover:text-brand-red">
                        {moto.model}
                      </p>
                    </Link>
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-5 text-sm">
                  <div className="flex gap-8">
                    {categories.map((cat) => (
                      <Link
                        key={cat.value}
                        href={`/catalogo?category=${cat.value}`}
                        onClick={() => setMegaOpen(false)}
                        className="link-underline tracking-wide text-brand-text/60 uppercase hover:text-brand-navy"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/catalogo"
                    onClick={() => setMegaOpen(false)}
                    className="link-underline tracking-wide text-brand-navy uppercase"
                  >
                    Ver catálogo completo →
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
