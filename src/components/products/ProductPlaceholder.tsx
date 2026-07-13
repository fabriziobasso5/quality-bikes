import type { ProductCategory } from "@/data/products";

/**
 * Marcador de posición para productos sin foto. Tarjeta sólida y premium:
 * degradado sutil en el accent de la marca, barra de color, silueta definida
 * (envase o caucho según categoría) y sombra suave — nada desteñido ni vacío.
 */
function Silhouette({ category, color }: { category: ProductCategory; color: string }) {
  const stroke = { fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const band = { fill: color, opacity: 0.16 };
  if (category === "lubricantes") {
    // Botella de aceite con etiqueta.
    return (
      <svg viewBox="0 0 64 64" className="h-24 w-24 drop-shadow-sm" aria-hidden="true">
        <rect x="21" y="6" width="12" height="8" rx="1.5" {...stroke} />
        <path {...stroke} d="M18 20c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6v32a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V20z" />
        <rect x="18" y="30" width="20" height="13" {...band} />
        <path {...stroke} d="M18 30h20M18 43h20" />
      </svg>
    );
  }
  if (category === "gasolinas") {
    // Bidón / jerry can.
    return (
      <svg viewBox="0 0 64 64" className="h-24 w-24 drop-shadow-sm" aria-hidden="true">
        <path {...stroke} d="M16 16h26a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4z" />
        <rect x="20" y="34" width="22" height="12" {...band} />
        <path {...stroke} d="M25 11h12v5H25zM46 26h5v10h-5" />
      </svg>
    );
  }
  if (category === "llantas") {
    // Caucho: rin + banda de rodadura.
    return (
      <svg viewBox="0 0 64 64" className="h-24 w-24 drop-shadow-sm" aria-hidden="true">
        <circle cx="32" cy="32" r="24" {...stroke} />
        <circle cx="32" cy="32" r="24" {...band} />
        <circle cx="32" cy="32" r="9" {...stroke} />
        <path {...stroke} d="M32 4v10M32 50v10M4 32h10M50 32h10M12.4 12.4l7.1 7.1M44.5 44.5l7.1 7.1M51.6 12.4l-7.1 7.1M19.5 44.5l-7.1 7.1" />
      </svg>
    );
  }
  // aditivos → frasco con gota.
  return (
    <svg viewBox="0 0 64 64" className="h-24 w-24 drop-shadow-sm" aria-hidden="true">
      <path {...stroke} d="M24 8h16v7l6 7v27a5 5 0 0 1-5 5H23a5 5 0 0 1-5-5V22l6-7V8z" />
      <rect x="18" y="34" width="28" height="12" {...band} />
      <path {...stroke} d="M32 30c3.6 3.6 5 6 5 8.4a5 5 0 1 1-10 0c0-2.4 1.4-4.8 5-8.4z" />
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
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(155deg, ${accent}24 0%, ${accent}0d 46%, #ffffff 100%)`,
      }}
    >
      {/* Barra de acento superior: aporta color y define la tarjeta. */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: accent }} />
      <Silhouette category={category} color={accent} />
    </div>
  );
}
