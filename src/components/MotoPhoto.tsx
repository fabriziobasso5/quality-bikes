import Image from "next/image";
import MotoImagePlaceholder from "./MotoImagePlaceholder";
import { withBasePath } from "@/lib/base-path";
import type { Motorcycle } from "@/data/motorcycles";

export default function MotoPhoto({
  moto,
  index = 1,
  className = "",
  sizes,
  preload = false,
}: {
  moto: Motorcycle;
  index?: number;
  className?: string;
  sizes?: string;
  preload?: boolean;
}) {
  if (!moto.photoCount || index > moto.photoCount) {
    return <MotoImagePlaceholder brand={moto.brand} model={moto.model} className={className} />;
  }

  return (
    // object-contain: la moto siempre se ve completa, nunca recortada —
    // el fondo blanco absorbe el letterboxing que deje cada encuadre.
    <div className={`relative bg-white ${className}`}>
      <Image
        src={withBasePath(`/images/inventory/${moto.slug}/${index}.webp`)}
        alt={`${moto.brand} ${moto.model}`}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        className="object-contain"
        preload={preload}
      />
    </div>
  );
}
