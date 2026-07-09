import type { ProductCategory } from "@/data/products";

/**
 * Marcador de posición para las fotos de producto que aún no existen
 * (public/images/products/<brand>/<slug>.webp). Sobre blanco puro, con un
 * glifo de línea fina teñido con el accent de la marca — coherente con la
 * estética minimalista de lujo del sitio, sin arte de terceros.
 */
function Glyph({ category, color }: { category: ProductCategory; color: string }) {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (category === "lubricantes") {
    // Botella de aceite.
    return (
      <svg viewBox="0 0 48 48" className="h-16 w-16" aria-hidden="true">
        <path {...common} d="M20 6h8v5l4 3v25a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3V14l4-3V6z" />
        <path {...common} d="M16 22h16" />
      </svg>
    );
  }
  if (category === "gasolinas") {
    // Bidón / jerry can.
    return (
      <svg viewBox="0 0 48 48" className="h-16 w-16" aria-hidden="true">
        <path {...common} d="M13 12h18a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3z" />
        <path {...common} d="M20 9h8v3h-8zM34 20h3v8h-3" />
        <path {...common} d="M17 33l7-9 7 9z" />
      </svg>
    );
  }
  // aditivos → frasco con gota.
  return (
    <svg viewBox="0 0 48 48" className="h-16 w-16" aria-hidden="true">
      <path {...common} d="M18 6h12v6l5 6v20a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V18l5-6V6z" />
      <path {...common} d="M24 24c3 3 4 5 4 7a4 4 0 1 1-8 0c0-2 1-4 4-7z" />
    </svg>
  );
}

export default function ProductPlaceholder({
  category,
  accent,
  className = "",
}: {
  category: ProductCategory;
  accent: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-white ${className}`}
      style={{
        // Halo tenue del color de marca, sobre blanco. Muy sutil.
        backgroundImage: `radial-gradient(120% 120% at 50% 30%, ${accent}0f 0%, transparent 60%)`,
      }}
    >
      <div className="opacity-60">
        <Glyph category={category} color={accent} />
      </div>
    </div>
  );
}
