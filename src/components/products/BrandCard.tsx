import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { categoryLabels, type ProductBrandMeta } from "@/data/products";

/**
 * Tarjeta grande de marca para /productos. Logo sobre placa blanca (fondo
 * claro, alto consistente entre marcas, con aire), hover-zoom sutil del logo
 * + tagline y categorías. Sin tilt.
 */
export default function BrandCard({ brand }: { brand: ProductBrandMeta }) {
  return (
    <Link
      href={`/productos/${brand.id}`}
      className="group flex h-full flex-col overflow-hidden border border-black/10 bg-brand-bg shadow-sm shadow-black/[0.03] transition duration-300 hover:border-brand-navy/40 hover:shadow-lg hover:shadow-brand-navy/10"
    >
      <div className="relative flex h-32 items-center justify-center overflow-hidden bg-white px-10">
        <BrandLogo
          brand={brand}
          className="transition-transform duration-500 group-hover:scale-105"
          imgClassName="max-h-14"
        />
        {/* Filo de color de marca al pie del panel. */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
          style={{ backgroundColor: brand.accent }}
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[11px] tracking-[0.15em] text-brand-text/45 uppercase">{brand.name}</p>
        <p className="mt-2 font-display text-lg leading-snug tracking-wide">{brand.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {brand.categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-black/10 px-2.5 py-0.5 text-[10px] tracking-wide text-brand-text/55"
            >
              {categoryLabels[cat]}
            </span>
          ))}
        </div>
        <p className="mt-auto pt-6 text-sm tracking-wide text-brand-navy uppercase group-hover:text-brand-red">
          Ver productos →
        </p>
      </div>
    </Link>
  );
}
