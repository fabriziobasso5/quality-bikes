import type { Metadata } from "next";
import Link from "next/link";
import InventoryBrandFilter from "@/components/InventoryBrandFilter";
import { Reveal } from "@/components/Reveal";
import { motorcycles } from "@/data/motorcycles";

export const metadata: Metadata = {
  title: "Inventario completo",
  description:
    "Todo el inventario de motocicletas de Quality Bikes en Caracas, filtrable por marca: BMW, Ducati, Kawasaki y Voge.",
};

// Página de inventario completo con filtro por marca. Solo se llega desde el
// botón "Ver inventario completo"; Catálogo / Ver catálogo van a la vista de
// todas las motos sobre blanco (/catalogo o el mega-menú).
export default function InventoryPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <nav className="mb-8 text-xs tracking-wide text-brand-text/50 uppercase">
        <Link href="/catalogo" className="hover:text-brand-red">
          Catálogo
        </Link>{" "}
        / Inventario completo
      </nav>

      <Reveal className="text-center">
        <p className="text-xs tracking-[0.3em] text-brand-navy uppercase">Inventario completo</p>
        <h1 className="mt-2 font-display text-4xl uppercase tracking-wide sm:text-5xl">
          Todas las motos
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-brand-text/70">
          Elige una marca para ver solo sus modelos. Los precios se manejan por asesoría
          directa — escríbenos para conocer disponibilidad y valor.
        </p>
      </Reveal>

      <InventoryBrandFilter motorcycles={motorcycles} />
    </div>
  );
}
