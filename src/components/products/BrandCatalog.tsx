"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProductCarousel from "./ProductCarousel";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { withBasePath } from "@/lib/base-path";
import type { Product } from "@/data/products";

export interface CatalogLane {
  title: string;
  products: Product[];
}
export interface CatalogNode {
  id: string;
  label: string;
  count: number;
  bg?: string; // slug de foto de fondo en /images/products/backgrounds/<bg>.webp
  children?: CatalogNode[]; // sub-opciones (nivel siguiente)
  lanes?: CatalogLane[]; // hoja: productos en carruseles por subgrupo
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

/**
 * Tarjeta de opción con foto de contexto de fondo + degradado oscuro para que
 * el texto se lea. Si la foto no existe, cae a un degradado elegante con el
 * accent de la marca (nunca un cuadrado plano). Hover-zoom sutil, sin tilt.
 */
function OptionCard({
  node,
  accent,
  onSelect,
}: {
  node: CatalogNode;
  accent: string;
  onSelect: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const bgUrl = node.bg ? withBasePath(`/images/products/backgrounds/${node.bg}.webp`) : null;
  const showImg = bgUrl && !imgFailed;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex h-56 w-full flex-col justify-end overflow-hidden border border-black/10 text-left"
    >
      {/* Base: foto (si existe) sobre un degradado con el accent; hover-zoom. */}
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `linear-gradient(145deg, ${accent} 0%, ${accent}cc 38%, #0b1622 100%)` }}
        />
        {showImg && (
          /* eslint-disable-next-line @next/next/no-img-element -- foto opcional con fallback por onError */
          <img
            src={bgUrl}
            alt=""
            aria-hidden
            onError={() => setImgFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
      {/* Velo oscuro para legibilidad del texto en ambos casos. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5" />

      <div className="relative p-6">
        <p className="font-display text-2xl uppercase tracking-wide text-white sm:text-3xl">
          {node.label}
        </p>
        <div className="mt-2 flex items-center justify-between gap-4">
          <span className="text-[11px] tracking-widest text-white/70 uppercase">
            {node.count} {node.count === 1 ? "producto" : "productos"}
          </span>
          <span className="text-sm tracking-wide text-white uppercase transition group-hover:text-brand-red">
            {node.children ? "Ver opciones →" : "Ver productos →"}
          </span>
        </div>
      </div>
    </button>
  );
}

function ProductLanes({ lanes, accent }: { lanes: CatalogLane[]; accent: string }) {
  return (
    <div className="space-y-12">
      {lanes.map((lane) => (
        <Reveal key={lane.title}>
          <ProductCarousel title={lane.title} products={lane.products} accent={accent} />
        </Reveal>
      ))}
    </div>
  );
}

interface Resolved {
  options?: CatalogNode[];
  leaf?: CatalogNode;
  trail: CatalogNode[];
}

function resolvePath(nodes: CatalogNode[], path: string[]): Resolved {
  let level = nodes;
  const trail: CatalogNode[] = [];
  for (const id of path) {
    const node = level.find((n) => n.id === id);
    if (!node) break;
    trail.push(node);
    if (node.lanes) return { leaf: node, trail };
    level = node.children ?? [];
  }
  return { options: level, trail };
}

/**
 * Navegación anidada in-page de una marca (estilo Mobil, ahora de varios
 * niveles): se muestran tarjetas de opción y al elegir una se baja al
 * siguiente nivel de opciones o a los productos. Botón para volver al nivel
 * anterior. Sin rutas nuevas.
 */
export default function BrandCatalog({
  nodes,
  accent,
}: {
  nodes: CatalogNode[];
  accent: string;
}) {
  const [path, setPath] = useState<string[]>([]);
  const { options, leaf, trail } = resolvePath(nodes, path);
  const atRoot = path.length === 0;

  return (
    <div className="mt-14">
      {!atRoot && (
        <div className="mb-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setPath((p) => p.slice(0, -1))}
            className="flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-xs tracking-widest text-brand-text/70 uppercase transition hover:border-brand-navy hover:text-brand-navy"
          >
            ← Volver
          </button>
          <h2 className="font-display text-2xl uppercase tracking-wide text-brand-text">
            {trail.map((n) => n.label).join(" / ")}
          </h2>
        </div>
      )}

      <motion.div key={path.join("/") || "__root"} {...fade}>
        {leaf ? (
          <ProductLanes lanes={leaf.lanes!} accent={accent} />
        ) : (
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(options ?? []).map((node) => (
              <RevealItem key={node.id} className="h-full">
                <OptionCard
                  node={node}
                  accent={accent}
                  onSelect={() => setPath((p) => [...p, node.id])}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </motion.div>
    </div>
  );
}
