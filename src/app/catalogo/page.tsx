import type { Metadata } from "next";
import Link from "next/link";
import MotoCard from "@/components/MotoCard";
import Magnetic from "@/components/Magnetic";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { motorcycles } from "@/data/motorcycles";

export const metadata: Metadata = {
  title: "Catálogo de motos en Caracas",
  description:
    "Explora nuestro inventario multimarca de motocicletas BMW, Voge y Kawasaki disponibles en Caracas, Venezuela.",
};

// Catálogo sin filtros: todo el inventario en un grid limpio sobre blanco.
export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <Reveal>
        <p className="text-xs tracking-[0.3em] text-brand-navy uppercase">Inventario</p>
        <h1 className="mt-2 font-display text-4xl uppercase tracking-wide">Catálogo</h1>
        <p className="mt-4 max-w-2xl text-brand-text/70">
          Todo nuestro inventario multimarca. Los precios se manejan por asesoría directa —
          escríbenos para conocer disponibilidad y valor.
        </p>
        <div className="mt-8">
          <Magnetic className="inline-block">
            <Link
              href="/catalogo/inventario"
              className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-8 py-3.5 text-sm tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
            >
              Ver inventario completo →
            </Link>
          </Magnetic>
        </div>
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {motorcycles.map((moto) => (
          <RevealItem key={moto.slug}>
            <MotoCard moto={moto} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
