import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogFilters from "@/components/CatalogFilters";
import MotoCard from "@/components/MotoCard";
import { motorcycles } from "@/data/motorcycles";

export const metadata: Metadata = {
  title: "Catálogo de motos de lujo en Caracas",
  description:
    "Explora nuestro inventario de motocicletas de alta cilindrada: Ducati, BMW Motorrad, Harley-Davidson CVO y KTM disponibles en Caracas, Venezuela.",
};

type SearchParams = Promise<{
  brand?: string;
  category?: string;
  price?: string;
  cc?: string;
  condition?: string;
}>;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = await searchParams;

  const filtered = motorcycles.filter((moto) => {
    if (filters.brand && moto.brand !== filters.brand) return false;
    if (filters.category && moto.category !== filters.category) return false;
    if (filters.price && moto.priceTier !== filters.price) return false;
    if (filters.condition && moto.condition !== filters.condition) return false;
    if (filters.cc) {
      const [min, max] = filters.cc.split("-").map(Number);
      if (moto.cc < min || moto.cc > max) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs tracking-[0.3em] text-brand-navy uppercase">Inventario</p>
      <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">Catálogo</h1>
      <p className="mt-4 max-w-2xl text-brand-text/70">
        Filtra por marca, categoría, cilindrada y presupuesto. Todos los precios se
        manejan por asesoría directa — escríbenos para conocer disponibilidad y valor.
      </p>

      <div className="mt-8">
        <Suspense fallback={null}>
          <CatalogFilters />
        </Suspense>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-brand-text/60">
          No encontramos motos con esos filtros. Escríbenos por WhatsApp y te ayudamos a
          encontrar la opción ideal.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((moto) => (
            <MotoCard key={moto.slug} moto={moto} />
          ))}
        </div>
      )}
    </div>
  );
}
