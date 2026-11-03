import Foto from "./Foto";
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
  priority = false,
}: {
  moto: Motorcycle;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative bg-white ${className}`}>
      <Foto
        src={catalogCoverPath(moto.slug)}
        alt={`${moto.brand} ${moto.model} en Quality Bikes Caracas`}
        fill
        priority={priority}
        sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
        className={`object-contain ${imgClassName}`}
      />
    </div>
  );
}
