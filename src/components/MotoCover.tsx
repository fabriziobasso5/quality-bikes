import Image from "next/image";
import { withBasePath } from "@/lib/base-path";
import { catalogCoverPath, type Motorcycle } from "@/data/motorcycles";

/**
 * Portada estilo ducati.com: foto de prensa oficial del fabricante (perfil
 * derecho, fondo blanco puro) sobre lienzo blanco. Los archivos en
 * public/images/catalog/ ya vienen normalizados a 4:3 con la moto al mismo
 * ancho relativo, así todas se ven del mismo tamaño en catálogo y mega-menú.
 * Las fotos reales del showroom viven en la galería de la ficha (MotoPhoto).
 */
export default function MotoCover({
  moto,
  className = "",
  imgClassName = "",
  sizes,
}: {
  moto: Motorcycle;
  className?: string;
  imgClassName?: string;
  sizes?: string;
}) {
  return (
    <div className={`relative bg-white ${className}`}>
      <Image
        src={withBasePath(catalogCoverPath(moto.slug))}
        alt={`${moto.brand} ${moto.model}`}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
        className={`object-contain ${imgClassName}`}
      />
    </div>
  );
}
