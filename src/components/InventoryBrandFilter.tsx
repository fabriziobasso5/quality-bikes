"use client";

import { useState } from "react";
import MotoCard from "./MotoCard";
import { RevealGroup, RevealItem } from "./Reveal";
import { withBasePath } from "@/lib/base-path";
import type { Motorcycle } from "@/data/motorcycles";

// Marcas con su logo (sobre fondo transparente para "flotar"). Solo se muestran
// las que realmente están en el inventario.
const BRAND_LOGOS: { brand: string; logo: string }[] = [
  { brand: "BMW", logo: "/images/brands-motos/bmw.webp" },
  { brand: "Ducati", logo: "/images/brands-motos/ducati.webp" },
  { brand: "Kawasaki", logo: "/images/brands-motos/kawasaki.webp" },
  { brand: "Voge", logo: "/images/brands-motos/voge.webp" },
];

/** Botón de marca: logo en caja uniforme; si el logo falla, muestra el nombre. */
function BrandChip({
  brand,
  logo,
  active,
  onSelect,
}: {
  brand: string;
  logo?: string;
  active: boolean;
  onSelect: () => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className="group flex flex-col items-center gap-2.5"
    >
      <span
        className={`flex h-20 w-28 items-center justify-center rounded-xl border bg-white p-3 transition duration-300 sm:h-24 sm:w-32 ${
          active
            ? "border-brand-navy shadow-md shadow-brand-navy/15 ring-2 ring-brand-navy/20"
            : "border-black/10 shadow-sm shadow-black/[0.03] group-hover:-translate-y-0.5 group-hover:border-brand-navy/40"
        }`}
      >
        {logo && !failed ? (
          /* eslint-disable-next-line @next/next/no-img-element -- logos de tercero, dimensiones intrínsecas variables */
          <img
            src={withBasePath(logo)}
            alt={brand}
            onError={() => setFailed(true)}
            className="max-h-full w-auto max-w-full object-contain"
          />
        ) : (
          <span className="font-display text-lg tracking-wide text-brand-navy">{brand}</span>
        )}
      </span>
      <span
        className={`text-[11px] tracking-widest uppercase transition ${
          active ? "text-brand-navy" : "text-brand-text/45"
        }`}
      >
        {brand}
      </span>
    </button>
  );
}

/**
 * Inventario completo con filtro por marca: los logos de las marcas actúan de
 * filtro (al elegir una, se muestran solo sus motos). "Todas" reinicia.
 */
export default function InventoryBrandFilter({ motorcycles }: { motorcycles: Motorcycle[] }) {
  const [brand, setBrand] = useState<string | null>(null);
  const available = BRAND_LOGOS.filter((b) => motorcycles.some((m) => m.brand === b.brand));
  const filtered = brand ? motorcycles.filter((m) => m.brand === brand) : motorcycles;

  return (
    <>
      <div className="mt-12 flex flex-wrap items-start justify-center gap-5 sm:gap-8">
        {/* "Todas" con el mismo tamaño de caja, para simetría */}
        <button
          type="button"
          onClick={() => setBrand(null)}
          aria-pressed={brand === null}
          className="group flex flex-col items-center gap-2.5"
        >
          <span
            className={`flex h-20 w-28 items-center justify-center rounded-xl border p-3 transition duration-300 sm:h-24 sm:w-32 ${
              brand === null
                ? "border-brand-navy bg-brand-navy text-brand-bg shadow-md shadow-brand-navy/15"
                : "border-black/10 bg-white text-brand-navy shadow-sm shadow-black/[0.03] group-hover:-translate-y-0.5 group-hover:border-brand-navy/40"
            }`}
          >
            <span className="font-display text-base tracking-wide uppercase">Todas</span>
          </span>
          <span
            className={`text-[11px] tracking-widest uppercase transition ${
              brand === null ? "text-brand-navy" : "text-brand-text/45"
            }`}
          >
            Todas
          </span>
        </button>

        {available.map((b) => (
          <BrandChip
            key={b.brand}
            brand={b.brand}
            logo={b.logo}
            active={brand === b.brand}
            onSelect={() => setBrand(b.brand)}
          />
        ))}
      </div>

      {/* key fuerza el re-montaje para reanimar el reveal al filtrar */}
      <RevealGroup
        key={brand ?? "all"}
        className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((moto) => (
          <RevealItem key={moto.slug}>
            <MotoCard moto={moto} />
          </RevealItem>
        ))}
      </RevealGroup>
    </>
  );
}
