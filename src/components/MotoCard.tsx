import Link from "next/link";
import MotoImagePlaceholder from "./MotoImagePlaceholder";
import type { Motorcycle } from "@/data/motorcycles";

export default function MotoCard({ moto }: { moto: Motorcycle }) {
  return (
    <Link
      href={`/catalogo/${moto.slug}`}
      className="group block overflow-hidden border border-black/10 bg-brand-bg transition hover:border-brand-navy/40 hover:shadow-lg"
    >
      <MotoImagePlaceholder brand={moto.brand} model={moto.model} className="h-56 w-full" />
      <div className="p-5">
        <p className="text-xs tracking-widest text-brand-navy uppercase">{moto.brand}</p>
        <h3 className="mt-1 font-display text-lg tracking-wide">{moto.model}</h3>
        <p className="mt-2 font-mono text-sm text-brand-text/60">
          {moto.cc} cc · {moto.year} · {moto.condition === "0km" ? "0 km" : "Seminueva"}
        </p>
        <p className="mt-4 text-sm tracking-wide text-brand-text/80 group-hover:text-brand-red">
          Consultar disponibilidad →
        </p>
      </div>
    </Link>
  );
}
