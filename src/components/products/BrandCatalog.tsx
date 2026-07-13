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
// Rin y caucho con banda de rodadura (familias Falken).
const TireIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <circle cx="24" cy="24" r="18" />
    <circle cx="24" cy="24" r="7" />
    <path d="M24 3v10M24 35v10M3 24h10M35 24h10M9.3 9.3l7.1 7.1M31.6 31.6l7.1 7.1M38.7 9.3l-7.1 7.1M16.4 31.6l-7.1 7.1" />
  </svg>
);
// Bote de spray con nube de rocío (limpieza y detailing).
const SprayIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <rect x="13" y="18" width="17" height="26" rx="2.5" />
    <path d="M17 18v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4" />
    <path d="M22 8h4" />
    <path d="M30 11h5M32 15h6M31 7h4" />
  </svg>
);
// Lata de combustible (accesorios: bidones, mangueras, cuidado del tanque).
const JerryCanIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <path d="M10 18h28a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V20a2 2 0 0 1 2-2z" />
    <path d="M19 18v-6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6" />
    <path d="M21 10h6" />
    <rect x="15" y="27" width="18" height="8" opacity="0.16" fill={color} />
    <path d="M20 27v8M28 27v8" />
  </svg>
);
// Casco de moto (línea Moto de Mobil).
const HelmetIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <path d="M7 30a17 17 0 0 1 34 0v4a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4v-4z" />
    <path d="M7 30h34" />
    <path d="M28 30v6a4 4 0 0 1-8 0v-6" />
  </svg>
);
// Engranaje (transmisiones).
const GearIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <circle cx="24" cy="24" r="9" />
    <circle cx="24" cy="24" r="3" />
    <path
      d="M24 5.5v6M24 36.5v6M5.5 24h6M36.5 24h6M11 11l4.2 4.2M32.8 32.8l4.2 4.2M37 11l-4.2 4.2M15.2 32.8l-4.2 4.2"
      strokeWidth={(strokeWidth ?? 1.6) + 1.4}
    />
  </svg>
);
// Fábrica (industrial).
const FactoryIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <path d="M6 42V22l10 7v-7l10 7v-7l10 7V42z" />
    <path d="M6 42h32" />
    <path d="M30 22v-8h5v5" />
    <circle cx="9.5" cy="9.5" r="1.5" fill={color} />
  </svg>
);
// Gota (fluidos y refrigerantes).
const DropIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <path d="M24 6c8 10 13 17.5 13 24.5a13 13 0 1 1-26 0C11 23.5 16 16 24 6z" />
    <path d="M18 30.5a6 6 0 0 0 6 6" />
  </svg>
);
// Bandera a cuadros (Azenis: deportivo / competencia).
const ChequeredFlagIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <path d="M12 4v40" />
    <path d="M12 6h24v18H12V6z" />
    <rect x="12" y="6" width="6" height="6" fill={color} />
    <rect x="24" y="6" width="6" height="6" fill={color} />
    <rect x="18" y="12" width="6" height="6" fill={color} />
    <rect x="30" y="12" width="6" height="6" fill={color} />
    <rect x="12" y="18" width="6" height="6" fill={color} />
    <rect x="24" y="18" width="6" height="6" fill={color} />
  </svg>
);
// Carretera en perspectiva (Ziex: touring / confort).
const RoadIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <path d="M18 6 8 42" />
    <path d="M30 6l10 36" />
    <path d="M24 10v4M24 20v4M24 30v4" />
  </svg>
);
// Cordillera (WildPeak: todo terreno).
const MountainIcon = ({ color, className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden {...svg(color, strokeWidth)}>
    <path d="M4 38 18 14l8 10 6-8 12 22z" />
    <path d="M14 30l4-5 4 5M32 24l-3 4" />
  </svg>
);
// Paleta reducida para las tarjetas nuevas — coherente con la estética de
// marca (navy, rojo, taupe, grafito), en vez de un color distinto por
// categoría. Las categorías "clásicas" (gasolina/diesel/combustibles/
// aditivos/alcoholes) no se tocan: son anteriores a este ajuste.
const NAVY = "#003462";
const RED = "#D51C29";
const TAUPE = "#A79F9D";
const GRAPHITE = "#3F3B36";
const EARTH = "#4A4630"; // grafito/tierra — familia WildPeak

// Diseño por tipo de opción (keyed por node.id, que es estable entre marcas).
const OPTION_STYLES: Record<string, { accent: string; Icon: (p: IconProps) => React.ReactElement }> = {
  gasolina: { accent: "#D9480F", Icon: PumpIcon },
  diesel: { accent: "#455A64", Icon: TruckIcon },
  aditivos: { accent: "#0F8A7E", Icon: BottlePlusIcon },
  // Falken — 3 familias de primer nivel, cada una con su propio acento
  // dentro de la paleta del sitio (deportivo / touring / todo terreno).
  azenis: { accent: RED, Icon: ChequeredFlagIcon },
  ziex: { accent: NAVY, Icon: RoadIcon },
  wildpeak: { accent: EARTH, Icon: MountainIcon },
  // WildPeak — 2do nivel (A/T, M/T, R/T): mismo acento tierra, ícono de rin.
  at: { accent: EARTH, Icon: TireIcon },
  mt: { accent: EARTH, Icon: TireIcon },
  rt: { accent: EARTH, Icon: TireIcon },
  // VP Racing — 6 divisores: combustibles (racing) en rojo, fluidos técnicos
  // en navy, limpieza/detailing en taupe, accesorios en grafito. "aditivos"
  // y "diesel" (arriba) se quedan con su estilo de siempre.
  combustibles: { accent: RED, Icon: RaceCanIcon },
  fluidos: { accent: NAVY, Icon: DropIcon },
  limpieza: { accent: TAUPE, Icon: SprayIcon },
  accesorios: { accent: GRAPHITE, Icon: JerryCanIcon },
  // Mobil — secciones nuevas / restauradas.
  moto: { accent: NAVY, Icon: HelmetIcon },
  transmisiones: { accent: GRAPHITE, Icon: GearIcon },
  industrial: { accent: TAUPE, Icon: FactoryIcon },
};

function optionStyle(id: string, fallbackAccent: string) {
  return OPTION_STYLES[id] ?? { accent: fallbackAccent, Icon: BottlePlusIcon };
}

/**
 * Tarjeta de opción moderna y legible: el ÍCONO es protagonista — un chip
 * sólido en el color de la categoría con el ícono en blanco, grande y
 * reconocible, para identificar al instante de qué trata (surtidor = gasolina,
 * camión = diesel, bidón+bandera = combustibles de competencia, botella "+" =
 * aditivos). Detrás, el mismo ícono ampliado como marca de agua da
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
