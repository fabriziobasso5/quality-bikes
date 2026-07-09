import Link from "next/link";
import ProductCover from "./ProductCover";
import TiltCard from "@/components/TiltCard";
import type { Product } from "@/data/products";

/**
 * Tarjeta de producto — espejo de MotoCard: TiltCard + hover-zoom sobre la
 * portada blanca y chips con los datos clave. Enlaza a la ficha, donde se
 * elige presentación/cantidad y se añade al pedido. Sin precios, nunca.
 */
export default function ProductCard({ product }: { product: Product }) {
  // Los tags (p. ej. Sintético/Semisintético/Mineral en Mobil) van primero y
  // resaltados; el resto son highlights informativos.
  const chips = [...(product.tags ?? []), ...product.highlights].slice(0, 3);

  return (
    <TiltCard>
      <Link
        href={`/productos/${product.brand}/${product.slug}`}
        className="group flex h-full flex-col overflow-hidden border border-black/10 bg-brand-bg transition duration-300 hover:border-brand-navy/40"
      >
        <div className="relative overflow-hidden">
          <ProductCover
            product={product}
            className="h-48 w-full"
            imgClassName="transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 80vw, 300px"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className="text-[11px] tracking-widest text-brand-navy uppercase">{product.group}</p>
          <h3 className="mt-1 font-display text-base tracking-wide">{product.name}</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {chips.map((chip, i) => (
              <span
                key={chip}
                className={
                  i < (product.tags?.length ?? 0)
                    ? "rounded-full border border-brand-navy/25 bg-brand-navy/[0.04] px-2.5 py-0.5 text-[10px] tracking-wide text-brand-navy uppercase"
                    : "rounded-full border border-black/10 px-2.5 py-0.5 text-[10px] tracking-wide text-brand-text/55"
                }
              >
                {chip}
              </span>
            ))}
          </div>
          <p className="mt-auto pt-4 text-sm tracking-wide text-brand-text/80 group-hover:text-brand-red">
            Ver producto →
          </p>
        </div>
      </Link>
    </TiltCard>
  );
}
