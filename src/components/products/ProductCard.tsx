"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCover from "./ProductCover";
import { useCart } from "@/components/cart/CartContext";
import type { Product } from "@/data/products";

/**
 * Tarjeta de producto = vista final (ya no enlaza a otra pantalla). Muestra
 * imagen/placeholder, nombre, descripción corta, datos clave como chips y un
 * botón "+" para añadir al pedido. Un selector de presentación (dropdown si
 * hay varias, texto estático si hay una; "Medida" en cauchos) precede al "+";
 * la elegida viaja con el pedido de WhatsApp. Nunca hay precios.
 */
export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const presentations = product.presentations ?? [];
  const [size, setSize] = useState<string | null>(presentations[0] ?? null);
  const [justAdded, setJustAdded] = useState(false);
  const [open, setOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);
  const presentationLabel = product.category === "llantas" ? "Medida" : "Presentación";

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1600);
    return () => clearTimeout(t);
  }, [justAdded]);

  // El dropdown cierra con click fuera o Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent | TouchEvent) {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleAdd() {
    add(product, size, 1);
    setJustAdded(true);
  }

  return (
    // Sin overflow-hidden en el article: el dropdown de presentaciones debe
    // poder sobresalir de la tarjeta. La imagen ya se recorta en su wrapper.
    <article className="group flex h-full flex-col border border-black/10 bg-brand-bg shadow-sm shadow-black/[0.03] transition duration-300 hover:border-brand-navy/40">
        <div className="relative overflow-hidden">
          {/* Hover = solo un zoom suave de la imagen, igual que MotoCard. */}
          <ProductCover
            product={product}
            className="h-48 w-full"
            imgClassName="transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 80vw, 300px"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-base leading-snug tracking-wide text-brand-navy">
            {product.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-text/75">{product.summary}</p>

          {product.highlights.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.highlights.map((h) => (
                <span
                  key={h}
                  className="rounded-full border border-brand-navy/15 bg-brand-navy/[0.05] px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-brand-navy/85"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Selector de presentación (si aplica) + botón añadir, anclados
              abajo. Ningún producto se vende suelto: solo por caja/presentación. */}
          <div className="mt-auto pt-5">
            {presentations.length === 1 && (
              <p className="mb-3 flex items-baseline gap-2 rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-xs">
                <span className="tracking-[0.08em] text-brand-navy uppercase">{presentationLabel}:</span>
                <span className="font-mono text-brand-text/80">{presentations[0]}</span>
              </p>
            )}
            {presentations.length > 1 && (
              <div ref={ddRef} className={`relative mb-3 ${open ? "z-30" : ""}`}>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                  aria-haspopup="listbox"
                  className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3.5 py-2.5 text-left text-xs transition ${
                    open ? "border-brand-navy" : "border-black/10 hover:border-brand-red"
                  }`}
                >
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span className="shrink-0 tracking-[0.08em] text-brand-navy uppercase">
                      {presentationLabel}:
                    </span>
                    <span className="truncate font-mono text-brand-text/80">{size}</span>
                  </span>
                  <span
                    aria-hidden
                    className={`shrink-0 text-[9px] text-brand-navy transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.ul
                      role="listbox"
                      aria-label={presentationLabel}
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-56 overflow-y-auto rounded-lg border border-black/10 bg-white py-1 shadow-xl shadow-black/10"
                    >
                      {presentations.map((p) => (
                        <li key={p}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={size === p}
                            onClick={() => {
                              setSize(p);
                              setOpen(false);
                            }}
                            className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left font-mono text-xs transition hover:bg-brand-red/[0.06] hover:text-brand-red ${
                              size === p ? "text-brand-navy" : "text-brand-text/75"
                            }`}
                          >
                            {p}
                            {size === p && (
                              <span aria-hidden className="text-brand-navy">✓</span>
                            )}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Añadir ${product.name}${size ? ` (${size})` : ""} al pedido`}
              className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium tracking-wide transition ${
                justAdded
                  ? "bg-brand-navy-soft text-brand-bg"
                  : "bg-brand-navy text-brand-bg hover:bg-brand-navy-soft"
              }`}
            >
              {justAdded ? (
                <>Añadido ✓</>
              ) : (
                <>
                  <span aria-hidden className="text-lg leading-none">+</span> Añadir al pedido
                </>
              )}
            </button>
          </div>
        </div>
    </article>
  );
}
