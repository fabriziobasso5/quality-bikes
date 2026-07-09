import type { Metadata } from "next";
import BrandCard from "@/components/products/BrandCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { productBrands } from "@/data/products";

export const metadata: Metadata = {
  title: "Productos — aditivos, gasolinas y lubricantes",
  description:
    "VP Racing, Mobil y BK3 en Quality Bikes: aditivos y combustibles de competencia, lubricantes sintéticos y elevadores de octanaje. Arma tu pedido y consúltanos por WhatsApp.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <Reveal>
        <p className="text-xs tracking-[0.3em] text-brand-navy uppercase">Tienda</p>
        <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">Productos</h1>
        <p className="mt-4 max-w-2xl text-brand-text/70">
          Tres marcas de referencia en aditivos, combustibles de competencia y lubricantes.
          Explora cada casa, arma tu pedido y lo cotizamos por WhatsApp — sin compromiso.
        </p>
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {productBrands.map((brand) => (
          <RevealItem key={brand.id} className="h-full">
            <BrandCard brand={brand} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
