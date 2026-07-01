"use client";

import { useSearchParams } from "next/navigation";
import CatalogFilters from "./CatalogFilters";
import MotoCard from "./MotoCard";
import type { Motorcycle } from "@/data/motorcycles";

export default function CatalogClient({ motorcycles }: { motorcycles: Motorcycle[] }) {
  const searchParams = useSearchParams();
  const brand = searchParams.get("brand");
  const category = searchParams.get("category");
  const condition = searchParams.get("condition");
  const cc = searchParams.get("cc");

  const filtered = motorcycles.filter((moto) => {
    if (brand && moto.brand !== brand) return false;
    if (category && moto.category !== category) return false;
    if (condition && moto.condition !== condition) return false;
    if (cc) {
      const [min, max] = cc.split("-").map(Number);
      if (moto.cc < min || moto.cc > max) return false;
    }
    return true;
  });

  return (
    <>
      <div className="mt-8">
        <CatalogFilters />
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
    </>
  );
}
