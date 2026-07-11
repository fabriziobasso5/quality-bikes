"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProductCarousel from "./ProductCarousel";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import type { Product } from "@/data/products";

export interface CatalogLane {
  title: string;
  products: Product[];
}
export interface CatalogNode {
  id: string;
  label: string;
  count: number;
  children?: CatalogNode[]; // sub-opciones (nivel siguiente)
  lanes?: CatalogLane[]; // hoja: productos en carruseles por subgrupo
}

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

/* ── Íconos de línea temáticos por categoría ────────────────────────────── */
type IconProps = { color: string; className?: string; strokeWidth?: number };
const svg = (color: string, strokeWidth = 1.6) => ({
  fill: "none" as const,
  stroke: color,
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

// Surtidor / pistola de combustible (gasolina).
const PumpIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <path d="M11 43V11a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v32" />
    <path d="M7 43h26" />
    <rect x="15" y="13" width="9" height="8" rx="1" />
    <path d="M28 17h4l5 5v13a3 3 0 0 0 6 0V15l-5-5" />
  </svg>
);
// Camión cisterna (diesel).
const TruckIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <rect x="4" y="14" width="21" height="18" rx="1" />
    <path d="M25 20h8l7 7v5H25z" />
    <circle cx="13" cy="36" r="3.2" />
    <circle cx="33" cy="36" r="3.2" />
  </svg>
);
// Bidón de competencia con bandera a cuadros (combustibles de competencia).
const RaceCanIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    {/* bidón */}
    <path d="M12 16h18a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V18a2 2 0 0 1 2-2z" />
    <path d="M17 16v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
    {/* mástil + bandera a cuadros */}
    <path d="M35 8v18" />
    <path d="M35 9h9v9h-9z" />
    <path d="M35 13.5h9M39.5 9v9" />
  </svg>
);
// Botella de aditivo con gota "+" (aditivos).
const BottlePlusIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <path d="M19 6h10v6l4 5v21a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4V17l4-5z" />
    <path d="M24 24v10M19 29h10" />
  </svg>
);
// Matraz / molécula de etanol (alcoholes).
const MoleculeIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <circle cx="13" cy="16" r="4" />
    <circle cx="32" cy="11" r="4" />
    <circle cx="26" cy="34" r="4" />
    <circle cx="37" cy="30" r="3" />
    <path d="M16.5 18.4 23 31M16.8 14 28.2 12M31 14.5 27 30.5M29.5 33l4.7-1.6" />
  </svg>
);

// Diseño por tipo de opción (keyed por node.id, que es estable entre marcas).
const OPTION_STYLES: Record<string, { accent: string; Icon: (p: IconProps) => React.ReactElement }> = {
  gasolina: { accent: "#D9480F", Icon: PumpIcon },
  diesel: { accent: "#455A64", Icon: TruckIcon },
  combustibles: { accent: "#C81E2B", Icon: RaceCanIcon },
  aditivos: { accent: "#0F8A7E", Icon: BottlePlusIcon },
  alcoholes: { accent: "#6D28D9", Icon: MoleculeIcon },
};

function optionStyle(id: string, fallbackAccent: string) {
  return OPTION_STYLES[id] ?? { accent: fallbackAccent, Icon: BottlePlusIcon };
}

/**
 * Tarjeta de opción moderna y legible: el ÍCONO es protagonista — un chip
 * sólido en el color de la categoría con el ícono en blanco, grande y
 * reconocible, para identificar al instante de qué trata (surtidor = gasolina,
 * camión = diesel, bidón+bandera = competencia, botella "+" = aditivos,
 * molécula = alcoholes). Detrás, el mismo ícono ampliado como marca de agua da
 * profundidad. Color de acento por categoría, buen contraste y CTA claro.
 * Hover = leve elevación + zoom del ícono (como MotoCard).
 */
function OptionCard({
  node,
  brandAccent,
  onSelect,
}: {
  node: CatalogNode;
  brandAccent: string;
  onSelect: () => void;
}) {
  const { accent, Icon } = optionStyle(node.id, brandAccent);
  const isBranch = !!node.children;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex h-60 w-full flex-col justify-between overflow-hidden rounded-2xl border border-black/10 bg-white text-left shadow-sm shadow-black/[0.03] transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:shadow-xl hover:shadow-black/10"
    >
      {/* Fondo: degradado sutil en el color de la categoría (tinte arriba, se
          aclara hacia el texto) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ backgroundImage: `linear-gradient(150deg, ${accent}1f 0%, ${accent}0a 40%, #ffffff 100%)` }}
      />
      {/* Patrón ligero de puntos en el accent, para textura */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: `radial-gradient(${accent}1a 1px, transparent 1.5px)`, backgroundSize: "14px 14px" }}
      />
      {/* Marca de agua: el mismo ícono ampliado detrás, muy sutil */}
      <Icon
        color={accent}
        className="pointer-events-none absolute -right-5 -bottom-5 h-48 w-48 opacity-[0.08] transition-transform duration-500 group-hover:scale-110"
      />

      {/* Chip protagonista con el ícono en blanco: identifica la categoría */}
      <div className="relative p-6 pb-0">
        <span
          aria-hidden
          className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundColor: accent, boxShadow: `0 10px 24px -8px ${accent}80` }}
        >
          <Icon color="#ffffff" strokeWidth={2.2} className="h-9 w-9" />
        </span>
      </div>

      <div className="relative p-6 pt-4">
        <p className="font-display text-2xl uppercase tracking-wide text-brand-navy sm:text-3xl">
          {node.label}
        </p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-[11px] font-medium tracking-widest text-brand-text/55 uppercase">
            {node.count} {node.count === 1 ? "producto" : "productos"}
          </span>
          <span
            className="text-sm font-semibold tracking-wide uppercase transition"
            style={{ color: accent }}
          >
            {isBranch ? "Ver opciones →" : "Ver productos →"}
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
 * Navegación anidada in-page de una marca (varios niveles): tarjetas de opción
 * → siguiente nivel de opciones o productos, con botón para volver. Sin rutas
 * nuevas.
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
  // Las filas de producto heredan el acento del tipo elegido (cohesión visual).
  const leafAccent = leaf ? optionStyle(leaf.id, accent).accent : accent;

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
          <ProductLanes lanes={leaf.lanes!} accent={leafAccent} />
        ) : (
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(options ?? []).map((node) => (
              <RevealItem key={node.id} className="h-full">
                <OptionCard
                  node={node}
                  brandAccent={accent}
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
