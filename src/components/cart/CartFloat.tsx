"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartContext";
import { getProductBrand } from "@/data/products";
import { buildWhatsAppLink } from "@/lib/site-config";

/**
 * Panel flotante del "pedido", distinto del WhatsAppFloat (esquina opuesta).
 * Solo se muestra en la sección /productos. Arma la lista y la envía por
 * WhatsApp con el texto prellenado — SIN precios, nunca.
 */
export default function CartFloat() {
  const pathname = usePathname();
  const { items, count, setQty, remove, clear, keyOf } = useCart();
  const [open, setOpen] = useState(false);

  // Solo activo en Productos.
  if (!pathname?.startsWith("/productos")) return null;

  function buildMessage() {
    const lines = items.map((it) => {
      const brand = getProductBrand(it.brand)?.name ?? "";
      // Los nombres de BK3 y Mobil ya incluyen la marca; solo la anteponemos
      // cuando falta (VP Racing: "Octanium" → "VP Racing Octanium").
      const label = it.name.toLowerCase().startsWith(brand.toLowerCase())
        ? it.name
        : `${brand} ${it.name}`.trim();
      const pres = it.presentation ? ` (${it.presentation})` : "";
      return `• ${it.qty} × ${label}${pres}`;
    });
    return [
      "Hola, quiero hacer un pedido en Quality Bikes:",
      "",
      ...lines,
      "",
      "Quedo atento a disponibilidad y cotización.",
    ].join("\n");
  }

  const hasItems = count > 0;

  return (
    <>
      {/* Botón flotante — esquina inferior izquierda */}
      <button
        type="button"
        aria-label={open ? "Cerrar pedido" : "Ver mi pedido"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed z-50 flex h-14 items-center gap-2 rounded-full bg-brand-navy px-5 text-brand-bg shadow-lg shadow-black/20 transition hover:bg-brand-navy-soft"
        style={{
          left: "calc(1.25rem + env(safe-area-inset-left))",
          bottom: "calc(1.25rem + env(safe-area-inset-bottom))",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h15l-1.5 9h-12z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6L5 3H3" />
          <circle cx="9" cy="20" r="1.4" />
          <circle cx="18" cy="20" r="1.4" />
        </svg>
        <span className="text-xs tracking-widest uppercase">Pedido</span>
        {hasItems && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-red px-1.5 text-xs font-bold text-white">
            {count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/20"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed z-50 flex max-h-[70vh] w-[min(24rem,calc(100vw-2.5rem))] flex-col border border-black/10 bg-brand-bg shadow-2xl shadow-black/20"
              style={{
                left: "calc(1.25rem + env(safe-area-inset-left))",
                bottom: "calc(5.5rem + env(safe-area-inset-bottom))",
              }}
              role="dialog"
              aria-label="Mi pedido"
            >
              <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                <p className="font-display text-sm tracking-widest uppercase">Mi pedido</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="text-brand-text/50 transition hover:text-brand-red"
                >
                  ✕
                </button>
              </div>

              {!hasItems ? (
                <p className="px-5 py-10 text-center text-sm text-brand-text/50">
                  Tu pedido está vacío. Añade productos desde su ficha.
                </p>
              ) : (
                <>
                  <ul className="flex-1 divide-y divide-black/[0.07] overflow-y-auto">
                    {items.map((it) => {
                      const key = keyOf(it);
                      return (
                        <li key={key} className="flex items-start gap-3 px-5 py-4">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{it.name}</p>
                            <p className="mt-0.5 text-[11px] tracking-wide text-brand-text/50 uppercase">
                              {getProductBrand(it.brand)?.name}
                              {it.presentation ? ` · ${it.presentation}` : ""}
                            </p>
                            <div className="mt-2 flex items-center border border-black/15 w-fit">
                              <button
                                type="button"
                                aria-label="Restar"
                                onClick={() => setQty(key, it.qty - 1)}
                                className="flex h-8 w-8 items-center justify-center text-brand-text/60 transition hover:text-brand-navy"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-mono text-xs">{it.qty}</span>
                              <button
                                type="button"
                                aria-label="Sumar"
                                onClick={() => setQty(key, it.qty + 1)}
                                className="flex h-8 w-8 items-center justify-center text-brand-text/60 transition hover:text-brand-navy"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(key)}
                            aria-label={`Quitar ${it.name}`}
                            className="text-xs text-brand-text/40 transition hover:text-brand-red"
                          >
                            Quitar
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="border-t border-black/10 p-4">
                    <a
                      href={buildWhatsAppLink(buildMessage())}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-brand-navy px-6 py-3 text-center text-sm tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
                    >
                      Enviar pedido por WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={clear}
                      className="mt-3 w-full text-center text-xs tracking-wide text-brand-text/40 uppercase transition hover:text-brand-red"
                    >
                      Vaciar pedido
                    </button>
                    <p className="mt-3 text-center text-[11px] text-brand-text/40">
                      Sin precios — te cotizamos por WhatsApp.
                    </p>
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
