"use client";

import { useEffect, useState } from "react";
import ProductCover from "./ProductCover";
import { useCart } from "@/components/cart/CartContext";
import type { Product } from "@/data/products";

/**
 * Tarjeta de producto = vista final (ya no enlaza a otra pantalla). Muestra
 * imagen/placeholder, nombre, descripción corta, datos clave como chips y un
 * botón "+" para añadir al pedido. Un mini-selector de presentación (venta por
 * caja, nunca suelto) precede al "+". Hover-zoom sutil. Nunca hay precios.
 */
export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const presentations = product.presentations ?? [];
  const [size, setSize] = useState<string | null>(presentations[0] ?? null);
  const [justAdded, setJustAdded] = useState(false);
  const presentationLabel =
    product.category === "llantas" ? "Medida disponible" : "Presentación · venta por caja";

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1600);
    return () => clearTimeout(t);
  }, [justAdded]);

  function handleAdd() {
    add(product, size, 1);
    setJustAdded(true);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-black/10 bg-brand-bg shadow-sm shadow-black/[0.03] transition duration-300 hover:border-brand-navy/40">
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
            {presentations.length > 0 && (
              <div className="mb-3">
                <p className="mb-2 font-mono text-[10px] tracking-[0.1em] text-brand-navy/60 uppercase">
                  {presentationLabel}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {presentations.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSize(p)}
                      aria-pressed={size === p}
                      className={`min-w-9 border px-2.5 py-1 text-xs tracking-wide transition ${
                        size === p
                          ? "border-brand-navy bg-brand-navy text-brand-bg"
                          : "border-black/15 text-brand-text/70 hover:border-brand-navy"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
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
