"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import type { Product } from "@/data/products";

/**
 * Selector de presentación + cantidad y botón "Añadir al pedido" de la ficha.
 * Nunca hay precios: el pedido se cotiza por WhatsApp desde el panel flotante.
 */
export default function AddToOrder({ product }: { product: Product }) {
  const { add } = useCart();
  const presentations = product.presentations ?? [];
  const [presentation, setPresentation] = useState<string | null>(presentations[0] ?? null);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(t);
  }, [justAdded]);

  function handleAdd() {
    add(product, presentation, qty);
    setJustAdded(true);
  }

  return (
    <div className="mt-8 border border-black/10 bg-brand-bg-soft p-6">
      {presentations.length > 0 && (
        <div>
          <p className="text-[11px] tracking-[0.2em] text-brand-text/45 uppercase">Presentación</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {presentations.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPresentation(p)}
                aria-pressed={presentation === p}
                className={`border px-4 py-2 text-sm tracking-wide transition ${
                  presentation === p
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

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-brand-text/45 uppercase">Cantidad</p>
          <div className="mt-3 flex items-center border border-black/15">
            <button
              type="button"
              aria-label="Restar"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center text-lg text-brand-text/60 transition hover:text-brand-navy"
            >
              −
            </button>
            <span className="w-10 text-center font-mono text-sm">{qty}</span>
            <button
              type="button"
              aria-label="Sumar"
              onClick={() => setQty((q) => q + 1)}
              className="flex h-11 w-11 items-center justify-center text-lg text-brand-text/60 transition hover:text-brand-navy"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="h-11 flex-1 bg-brand-navy px-6 text-sm tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
        >
          {justAdded ? "Añadido al pedido ✓" : "Añadir al pedido"}
        </button>
      </div>

      <p className="mt-4 text-xs text-brand-text/45">
        Arma tu pedido y envíalo por WhatsApp para conocer disponibilidad y cotización.
      </p>
    </div>
  );
}
