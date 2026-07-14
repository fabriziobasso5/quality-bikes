import { withBasePath } from "@/lib/base-path";
import type { ProductBrandMeta } from "@/data/products";

/**
 * Logo de marca en alta resolución y a un tamaño consistente entre las casas
 * (mismo alto visual, centrado, object-contain). Pensado para mostrarse sobre
 * fondo claro. Cada marca tiene su archivo (PNG o SVG) recortado sin aire de
 * sobra, para que el alto fijo del contenedor dé un tamaño visual parejo.
 * Si faltara el archivo, cae a un wordmark tipográfico.
 *
 * `useHeaderLogo` cambia a `brand.headerLogo` (mascota/gráfico más grande,
 * propio del header de /productos/[marca]) cuando existe — no afecta el
 * logo chico que BrandCard sigue usando en /productos.
 */
export default function BrandLogo({
  brand,
  className = "",
  imgClassName = "max-h-12",
  useHeaderLogo = false,
}: {
  brand: ProductBrandMeta;
  className?: string;
  imgClassName?: string;
  useHeaderLogo?: boolean;
}) {
  const src = (useHeaderLogo && brand.headerLogo) || brand.logo;
  return (
    <span className={`flex items-center justify-center ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- logo de tercero, dimensiones intrínsecas variables
        <img
          src={withBasePath(src)}
          alt={brand.name}
          className={`w-auto max-w-full object-contain ${imgClassName}`}
        />
      ) : (
        <span className="font-display text-3xl font-bold leading-none tracking-wide text-brand-navy">
          {brand.name}
        </span>
      )}
    </span>
  );
}
