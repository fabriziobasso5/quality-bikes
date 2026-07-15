"use client";

import { useRouter } from "next/navigation";

/**
 * Botón minimalista "← Volver" para las vistas internas (ficha de moto, marca de
 * productos, inventario). Reutiliza el mismo estilo del "← Volver" de las
 * opciones de productos (BrandCatalog) para que sea coherente en todo el sitio.
 *
 * Vuelve en el historial cuando es posible; si se entró directo a la URL, cae en
 * un destino fijo (`fallbackHref`) para no dejar al usuario sin salida.
 */
export default function BackLink({
  fallbackHref = "/",
  label = "Volver",
  className = "",
  forceFallback = false,
}: {
  fallbackHref?: string;
  label?: string;
  className?: string;
  // Ignora el historial y navega siempre a fallbackHref — para vistas donde
  // "Volver" debe llevar a un destino fijo (ej. el selector de marcas de
  // /productos) sin importar desde dónde se entró (ej. un link directo del
  // mega-menú que salta el selector).
  forceFallback?: boolean;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (!forceFallback && typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className={`inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 font-mono text-xs tracking-[0.1em] text-brand-text/70 uppercase transition hover:border-brand-navy hover:text-brand-navy ${className}`}
    >
      ← {label}
    </button>
  );
}
