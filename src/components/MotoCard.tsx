import Link from "next/link";
import MotoCover from "./MotoCover";
import TiltCard from "./TiltCard";
import type { Motorcycle } from "@/data/motorcycles";

export default function MotoCard({ moto }: { moto: Motorcycle }) {
  return (
    <TiltCard>
    <Link
      href={`/catalogo/${moto.slug}`}
      className="group block overflow-hidden border border-black/10 bg-brand-bg transition duration-300 hover:border-brand-navy/40"
    >
      <div className="relative overflow-hidden">
        <MotoCover
          moto={moto}
          className="h-56 w-full"
          imgClassName="transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {moto.availability === "proximo-arribo" && (
          <span className="absolute top-3 left-3 rounded-full border border-brand-red bg-white/90 px-3 py-1 text-[10px] tracking-widest text-brand-red uppercase">
            Próximo arribo
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-xs tracking-widest text-brand-navy uppercase">{moto.brand}</p>
        <h3 className="mt-1 font-display text-lg tracking-wide">{moto.model}</h3>
        <p className="mt-2 font-mono text-sm text-brand-text/60">
          {moto.cc} cc · {moto.year} ·{" "}
          {moto.condition === "0km" ? "0 km" : `Seminueva${moto.mileageKm ? ` · ${moto.mileageKm} km` : ""}`}
        </p>
        <p className="mt-4 text-sm tracking-wide text-brand-text/80 group-hover:text-brand-red">
          Consultar disponibilidad →
        </p>
      </div>
    </Link>
    </TiltCard>
  );
}
