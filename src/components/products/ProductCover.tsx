import Image from "next/image";
import { withBasePath } from "@/lib/base-path";
import ProductPlaceholder from "./ProductPlaceholder";
import { getProductBrand, type Product } from "@/data/products";

/**
 * Portada de producto: foto oficial sobre blanco cuando existe
 * (product.image), y si no, el marcador de posición de marca. Espejo de
 * MotoCover — misma idea de lienzo blanco + object-contain para que todo se
 * vea del mismo tamaño en tarjetas, carruseles y ficha.
 */
export default function ProductCover({
  product,
  className = "",
  imgClassName = "",
  sizes,
}: {
  product: Product;
  className?: string;
  imgClassName?: string;
  sizes?: string;
}) {
  const accent = getProductBrand(product.brand)?.accent ?? "#003462";

  if (!product.image) {
    return <ProductPlaceholder category={product.category} accent={accent} className={className} />;
  }

  return (
    <div className={`relative bg-white ${className}`}>
      <Image
        src={withBasePath(product.image)}
        alt={product.name}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
        className={`object-contain ${imgClassName}`}
      />
    </div>
  );
}
