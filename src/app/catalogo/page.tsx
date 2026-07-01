import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogClient from "@/components/CatalogClient";
import { motorcycles } from "@/data/motorcycles";

export const metadata: Metadata = {
  title: "Catálogo de motos en Caracas",
  description:
    "Explora nuestro inventario de motocicletas BMW, Voge, Kawasaki y Kymco disponibles en Caracas, Venezuela.",
};

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-xs tracking-[0.3em] text-brand-navy uppercase">Inventario</p>
      <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">Catálogo</h1>
      <p className="mt-4 max-w-2xl text-brand-text/70">
        Filtra por marca, categoría y cilindrada. Todos los precios se manejan por
        asesoría directa — escríbenos para conocer disponibilidad y valor.
      </p>

      <Suspense fallback={null}>
        <CatalogClient motorcycles={motorcycles} />
      </Suspense>
    </div>
  );
}
