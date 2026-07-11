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
}: {
  fallbackHref?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className={`inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-xs tracking-widest text-brand-text/70 uppercase transition hover:border-brand-navy hover:text-brand-navy ${className}`}
    >
      ← {label}
    </button>
  );
}
