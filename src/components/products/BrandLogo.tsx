import { withBasePath } from "@/lib/base-path";
import type { ProductBrandMeta } from "@/data/products";

/**
 * Marca de las tres casas de producto. Reutiliza los logos reales que ya vive
 * el home ("También en tienda"): VP Racing y Mobil tienen archivo; BK3 no
 * tiene arte oficial compatible con la estética del sitio y se resuelve como
 * wordmark tipográfico (misma decisión que siteConfig.productsCarried).
 */
export default function BrandLogo({
  brand,
  className = "",
  imgClassName = "",
}: {
  brand: ProductBrandMeta;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <span className={`flex items-center justify-center ${className}`}>
      {brand.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- logos de terceros, dimensiones intrínsecas variables
        <img
          src={withBasePath(brand.logo)}
          alt={brand.name}
          className={`w-auto object-contain ${imgClassName}`}
        />
      ) : (
        <span className="font-display font-bold leading-none tracking-wide text-brand-navy">
          {brand.name}
        </span>
      )}
    </span>
  );
}
