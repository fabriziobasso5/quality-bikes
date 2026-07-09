import { withBasePath } from "@/lib/base-path";
import type { ProductBrandMeta } from "@/data/products";

/**
 * Logo de marca en alta resolución y a un tamaño consistente entre las tres
 * casas (mismo alto visual, centrado, object-contain). Pensado para mostrarse
 * sobre fondo claro. VP Racing y Mobil tienen archivo; BK3 usa su PNG limpio.
 * Si faltara el archivo, cae a un wordmark tipográfico.
 */
export default function BrandLogo({
  brand,
  className = "",
  imgClassName = "max-h-12",
}: {
  brand: ProductBrandMeta;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <span className={`flex items-center justify-center ${className}`}>
      {brand.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- logo de tercero, dimensiones intrínsecas variables
        <img
          src={withBasePath(brand.logo)}
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
