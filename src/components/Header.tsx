"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import MobileMenu from "./MobileMenu";
import MotoCover from "./MotoCover";
import BrandLogo from "./products/BrandLogo";
import { motorcycles, categories } from "@/data/motorcycles";
import { productBrands, categoryLabels } from "@/data/products";
import { siteConfig } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

const navItems = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

type MenuId = "catalogo" | "productos";

/**
 * Ducati-style mega menu: "Catálogo" y "Productos" abren cada uno un panel
 * blanco a todo el ancho. Click-driven (como Ducati) en vez de hover: sin
 * aperturas accidentales y con soporte de teclado. Solo un panel abierto a la
 * vez; cierra con click fuera, Escape o cualquier navegación.
 */
export default function Header() {
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const pathname = usePathname();

  // Any route change closes the panel.
  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!openMenu) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu]);

  function toggle(id: MenuId) {
    setOpenMenu((cur) => (cur === id ? null : id));
  }

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
            onClick={() => toggle("catalogo")}
            aria-expanded={openMenu === "catalogo"}
            aria-controls="mega-catalogo"
            className={`uppercase tracking-wide transition ${
              openMenu === "catalogo" ? "text-brand-navy" : "text-brand-text/70 hover:text-brand-red"
            }`}
          >
            Catálogo
          </button>
          <button
            onClick={() => toggle("productos")}
            aria-expanded={openMenu === "productos"}
            aria-controls="mega-productos"
            className={`uppercase tracking-wide transition ${
              openMenu === "productos" ? "text-brand-navy" : "text-brand-text/70 hover:text-brand-red"
            }`}
          >
            Productos
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
        {openMenu && (
          <>
            {/* Invisible catch-all behind the panel: outside click closes. */}
            <div
              className="fixed inset-0 z-[-1] cursor-default"
              onClick={() => setOpenMenu(null)}
              aria-hidden
            />
            {openMenu === "catalogo" && (
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
                        onClick={() => setOpenMenu(null)}
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
                          onClick={() => setOpenMenu(null)}
                          className="link-underline tracking-wide text-brand-text/60 uppercase hover:text-brand-navy"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/catalogo"
                      onClick={() => setOpenMenu(null)}
                      className="link-underline tracking-wide text-brand-navy uppercase"
                    >
                      Ver catálogo completo →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {openMenu === "productos" && (
              <motion.div
                id="mega-productos"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 top-full hidden border-b border-black/10 bg-white shadow-xl shadow-black/5 md:block"
              >
                <div className="mx-auto max-w-7xl px-6 py-8">
                  <div className="grid grid-cols-3 gap-6">
                    {productBrands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/productos/${brand.id}`}
                        onClick={() => setOpenMenu(null)}
                        className="group flex flex-col border border-black/10 transition hover:border-brand-navy/40"
                      >
                        <div
                          className="relative flex h-32 items-center justify-center overflow-hidden bg-white"
                          style={{
                            backgroundImage: `radial-gradient(120% 120% at 50% 25%, ${brand.accent}12 0%, transparent 62%)`,
                          }}
                        >
                          <BrandLogo
                            brand={brand}
                            className="text-3xl transition-transform duration-500 group-hover:scale-105"
                            imgClassName="max-h-12 max-w-[160px]"
                          />
                        </div>
                        <div className="border-t border-black/10 p-4">
                          <p className="text-[11px] tracking-widest text-brand-text/45 uppercase">
                            {brand.name}
                          </p>
                          <p className="mt-1 text-sm text-brand-text/70">{brand.tagline}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {brand.categories.map((cat) => (
                              <span
                                key={cat}
                                className="text-[10px] tracking-wide text-brand-navy uppercase"
                              >
                                {categoryLabels[cat]}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-8 flex items-center justify-end border-t border-black/10 pt-5 text-sm">
                    <Link
                      href="/productos"
                      onClick={() => setOpenMenu(null)}
                      className="link-underline tracking-wide text-brand-navy uppercase"
                    >
                      Ver todos los productos →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
