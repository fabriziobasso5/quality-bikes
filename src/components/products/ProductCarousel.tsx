"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";

/**
 * Carrusel horizontal deslizable estilo Jesko/Lando: una fila de tarjetas con
 * scroll-snap, arrastre nativo en mobile y flechas en desktop. Cada grupo
 * (subtipo) de una categoría se muestra en su propio carril.
 */
export default function ProductCarousel({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const scrollByCards = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // Desplaza ~85% del ancho visible: avanza sin dejar tarjetas huérfanas.
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }, []);

  const arrowClass =
    "flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-brand-text/70 transition hover:border-brand-navy hover:text-brand-navy disabled:cursor-not-allowed disabled:opacity-25";

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <h3 className="font-display text-lg tracking-wide uppercase text-brand-text/80">{title}</h3>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label="Anterior"
            className={arrowClass}
            onClick={() => scrollByCards(-1)}
            disabled={atStart}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            className={arrowClass}
            onClick={() => scrollByCards(1)}
            disabled={atEnd}
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="hide-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 pb-2"
      >
        {products.map((product) => (
          <div key={product.slug} className="w-[240px] shrink-0 snap-start sm:w-[268px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
