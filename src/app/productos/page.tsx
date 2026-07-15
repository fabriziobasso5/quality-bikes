import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import BrandCard from "@/components/products/BrandCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { productBrands } from "@/data/products";
import { withBasePath } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Productos — aditivos, gasolinas, aceites y cauchos",
  description:
    "VP Racing, Mobil, BK3, Falken y EWAY en Quality Bikes: aditivos y combustibles de competencia, aceites sintéticos y cauchos de alto rendimiento. Arma tu pedido y consúltanos por WhatsApp.",
};

export default function ProductsPage() {
  return (
    // Misma familia visual que el header/footer: fibra de carbono forjada con
    // velo oscuro detrás de las tarjetas — las tarjetas (fondo blanco) quedan
    // "flotando" encima, sin cambiar de color.
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("${withBasePath("/images/carbono-forjado.jpg")}")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/55" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <Eyebrow tone="red">Tienda</Eyebrow>
          <h1 className="mt-2 font-display text-4xl uppercase tracking-wide text-white">Productos</h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Marcas de referencia en aditivos, combustibles de competencia, aceites y cauchos.
            Explora cada casa, arma tu pedido y lo cotizamos por WhatsApp — sin compromiso.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {productBrands.map((brand) => (
            <RevealItem key={brand.id} className="h-full">
              <BrandCard brand={brand} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
