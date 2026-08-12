"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import MotoCover from "./MotoCover";
import { motorcycles } from "@/data/motorcycles";
import { rememberBackTarget } from "@/lib/back-target";
import {
  closeCatalogPanel,
  isCatalogOpen,
  openCatalogPanel,
  subscribeToCatalogHistory,
} from "@/lib/catalog-panel";

const navItems = [
  { href: "/productos", label: "Productos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

/**
 * Menú móvil = versión móvil del mega-menú. La hamburguesa despliega un panel
 * con Catálogo, Productos, Nosotros y Contacto. "Catálogo" se expande EN SITIO
 * (acordeón) mostrando todas las motos — sin depender del overlay de
 * escritorio, así funciona bien en teléfono. "Productos", "Nosotros" y
 * "Contacto" navegan directo a su página real.
 *
 * El acordeón de Catálogo comparte con el panel de escritorio la MISMA parada
 * de historial (lib/catalog-panel): en el teléfono era estado local y por eso
 * "Volver" desde una ficha no sabía regresar al catálogo y acababa en la
 * portada, o en Productos si se había pasado por ahí.
 */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const catalogOpen = useSyncExternalStore(
    subscribeToCatalogHistory,
    isCatalogOpen,
    () => false
  );

  // El acordeón vive dentro del panel de la hamburguesa, así que al volver al
  // catálogo hay que reabrir los dos.
  const navVisible = open || catalogOpen;

  // Navegar desde el menú lo oculta en el acto sin tocar el historial: la
  // parada del catálogo tiene que sobrevivir para poder volver a ella. Al
  // cambiar de página el nodo se desmonta y se lleva el estilo con él.
  function hideNav() {
    setOpen(false);
    if (navRef.current) navRef.current.style.display = "none";
  }

  function closeEverything() {
    setOpen(false);
    if (catalogOpen) closeCatalogPanel();
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={navVisible ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={navVisible}
        onClick={() => (navVisible ? closeEverything() : setOpen(true))}
        className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`h-px w-6 transition ${navVisible ? "translate-y-2 rotate-45 bg-brand-text" : "bg-white"}`}
        />
        <span
          className={`h-px w-6 transition ${navVisible ? "bg-brand-text opacity-0" : "bg-white"}`}
        />
        <span
          className={`h-px w-6 transition ${navVisible ? "-translate-y-2 -rotate-45 bg-brand-text" : "bg-white"}`}
        />
      </button>

      {navVisible && (
        <nav
          ref={navRef}
          data-testid="mobile-nav"
          className="absolute inset-x-0 top-full z-40 max-h-[calc(100svh-4.5rem)] overflow-y-auto border-b border-black/10 bg-brand-bg px-6 py-4 shadow-lg"
        >
          {/* Catálogo — mega-menú móvil: cuadrícula con todas las motos. */}
          <button
            type="button"
            onClick={() => (catalogOpen ? closeCatalogPanel() : openCatalogPanel())}
            aria-expanded={catalogOpen}
            className="flex w-full items-center justify-between py-3 text-sm tracking-wide uppercase text-brand-text/80"
          >
            Catálogo
            <span
              className={`text-brand-text/40 transition-transform duration-200 ${catalogOpen ? "rotate-90" : ""}`}
            >
              →
            </span>
          </button>

          {catalogOpen && (
            <div className="mb-2">
              <div className="grid grid-cols-2 gap-x-3 gap-y-4 pt-1 pb-3">
                {motorcycles.map((moto) => (
                  <Link
                    key={moto.slug}
                    href={`/catalogo/${moto.slug}`}
                    onClick={() => {
                      rememberBackTarget(`/catalogo/${moto.slug}`, "catalogo");
                      hideNav();
                    }}
                    className="group text-center"
                  >
                    <div className="relative">
                      <MotoCover
                        moto={moto}
                        className="mx-auto aspect-[4/3] w-full overflow-hidden"
                        sizes="45vw"
                      />
                      {moto.availability === "proximo-arribo" && (
                        <span className="absolute top-1 left-1 rounded-full border border-brand-red/40 bg-white/90 px-1.5 py-0.5 text-[7px] tracking-[0.15em] text-brand-red uppercase">
                          Próx. arribo
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-[10px] tracking-widest text-brand-text/50 uppercase">
                      {moto.brand}
                    </p>
                    <p className="font-display text-xs tracking-wide uppercase text-brand-text">
                      {moto.model}
                    </p>
                  </Link>
                ))}
              </div>
              <Link
                href="/catalogo/inventario"
                onClick={() => {
                  rememberBackTarget("/catalogo/inventario", "catalogo");
                  hideNav();
                }}
                className="block rounded-full bg-brand-navy px-6 py-3 text-center text-xs tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
              >
                Ver inventario completo →
              </Link>
            </div>
          )}

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={hideNav}
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
