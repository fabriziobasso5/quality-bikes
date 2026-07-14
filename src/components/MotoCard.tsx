import Image from "next/image";
import Link from "next/link";
import MotoCover from "./MotoCover";
import TiltCard from "./TiltCard";
import { withBasePath } from "@/lib/base-path";
import type { Motorcycle } from "@/data/motorcycles";

export default function MotoCard({ moto }: { moto: Motorcycle }) {
  // Unidades físicas en showroom con fotos reales propias (photoCount > 1
  // distingue de la Multistrada, cuya única "foto" es la de prensa): al
  // hover en desktop la portada oficial hace crossfade a la unidad real.
  const hasRealPhotos = moto.availability === "en-stock" && moto.photoCount > 1;

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
          imgClassName={
            hasRealPhotos
              ? "transition-opacity duration-300 md:group-hover:opacity-0"
              : "transition-transform duration-300 group-hover:scale-105"
          }
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {hasRealPhotos && (
          /* Solo desktop (hidden md:block): en mobile no hay hover y no
             tiene sentido descargar la segunda imagen. */
          <div className="absolute inset-0 hidden bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
            <Image
              src={withBasePath(`/images/inventory/${moto.slug}/1.webp`)}
              alt={`${moto.brand} ${moto.model} — unidad real en showroom`}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-contain"
            />
          </div>
        )}
        {moto.availability === "proximo-arribo" && (
          /* Fondo opaco + sombra: sobre la portada blanca el badge se separa
             y queda legible en cualquier viewport, incluido mobile. */
          <span className="absolute top-3 left-3 z-10 rounded-full border border-brand-red/50 bg-white px-2.5 py-0.5 font-mono text-[9px] tracking-[0.14em] text-brand-red uppercase shadow-sm shadow-black/10">
            Próximo arribo
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="font-mono text-xs tracking-[0.12em] text-brand-navy uppercase">{moto.brand}</p>
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
