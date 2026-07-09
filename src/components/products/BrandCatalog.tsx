"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProductCarousel from "./ProductCarousel";
import TiltCard from "@/components/TiltCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import type { Product } from "@/data/products";

export interface CatalogLane {
  title: string;
  products: Product[];
}
export interface CatalogOption {
  id: string;
  label: string;
  count: number;
  lanes: CatalogLane[];
}

// Fade-in por remonte con `key` (sin AnimatePresence): al cambiar de vista el
// motion.div se re-monta y reproduce initial→animate. Se evitó AnimatePresence
// mode="wait" porque su salida no completaba (los hijos Reveal usan whileInView
// sin variante exit y bloqueaban onExitComplete), dejando la vista congelada.
const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
};

/** Tarjeta grande seleccionable de categoría (opción), con hover-zoom. */
function OptionCard({
  option,
  accent,
  onSelect,
}: {
  option: CatalogOption;
  accent: string;
  onSelect: () => void;
}) {
  return (
    <TiltCard>
      <button
        type="button"
        onClick={onSelect}
        className="group flex h-full w-full flex-col overflow-hidden border border-black/10 bg-brand-bg text-left shadow-sm shadow-black/[0.03] transition duration-300 hover:border-brand-navy/40 hover:shadow-lg hover:shadow-brand-navy/10"
      >
        <div
          className="relative flex h-44 items-center justify-center overflow-hidden bg-white"
          style={{ backgroundImage: `linear-gradient(155deg, ${accent}22 0%, ${accent}0a 46%, #ffffff 100%)` }}
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: accent }} />
          <span className="px-4 text-center font-display text-2xl uppercase tracking-wide text-brand-navy transition-transform duration-500 group-hover:scale-105 sm:text-3xl">
            {option.label}
          </span>
        </div>
        <div className="flex items-center justify-between p-6">
          <span className="text-sm text-brand-text/60">
            {option.count} {option.count === 1 ? "producto" : "productos"}
          </span>
          <span className="text-sm tracking-wide text-brand-navy uppercase transition group-hover:text-brand-red">
            Ver productos →
          </span>
        </div>
      </button>
    </TiltCard>
  );
}

/** Filas de productos de una opción (subgrupos en carruseles). */
function OptionProducts({ option, accent }: { option: CatalogOption; accent: string }) {
  return (
    <div className="space-y-12">
      {option.lanes.map((lane) => (
        <Reveal key={lane.title}>
          <ProductCarousel title={lane.title} products={lane.products} accent={accent} />
        </Reveal>
      ))}
    </div>
  );
}

/**
 * Vista in-page de una marca: primero una pantalla de "opciones" (categorías)
 * como tarjetas grandes seleccionables; al elegir una se muestran sus
 * productos en carruseles, con un control para volver. Marcas con una sola
 * opción (BK3) van directo a los productos. Sin rutas nuevas.
 */
export default function BrandCatalog({
  options,
  accent,
}: {
  options: CatalogOption[];
  accent: string;
}) {
  const single = options.length === 1;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = single ? options[0] : options.find((o) => o.id === selectedId) ?? null;

  return (
    <div className="mt-14">
      <motion.div key={selected ? selected.id : "__options"} {...fade}>
        {!selected ? (
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {options.map((opt) => (
              <RevealItem key={opt.id} className="h-full">
                <OptionCard option={opt} accent={accent} onSelect={() => setSelectedId(opt.id)} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <>
            {!single && (
              <div className="mb-10 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-xs tracking-widest text-brand-text/70 uppercase transition hover:border-brand-navy hover:text-brand-navy"
                >
                  ← Opciones
                </button>
                <h2 className="font-display text-2xl uppercase tracking-wide text-brand-text">
                  {selected.label}
                </h2>
              </div>
            )}
            <OptionProducts option={selected} accent={accent} />
          </>
        )}
      </motion.div>
    </div>
  );
}
