"use client";

import { useCallback, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { backLabel, readBackTarget } from "@/lib/back-target";

/**
 * Botón "← Volver" de las vistas internas (ficha de moto, marca de productos,
 * inventario).
 *
 * El salto lo hace el historial del navegador, nunca un destino fijo: así
 * "Volver" siempre devuelve al sitio exacto del que se vino —incluido el panel
 * de catálogo, que también es una parada del historial— y con la página a la
 * altura en la que se dejó. El rótulo sí se calcula (ver lib/back-target), solo
 * para anunciar a dónde lleva.
 *
 * Sin historial —el visitante abrió el enlace de la moto directamente desde
 * WhatsApp, en una pestaña nueva— no hay nada atrás. La salida entonces es
 * `fallbackHref` si se indicó y, si no, abrir el panel de catálogo ahí mismo,
 * que es lo natural desde una ficha suelta.
 */
export default function BackLink({
  label,
  className = "",
  fallbackHref,
  forceFallback = false,
}: {
  // Fuerza el rótulo. Sin esto se deduce de por dónde entró el visitante.
  label?: string;
  className?: string;
  // Destino cuando no hay historial. Sin esto se abre el catálogo.
  fallbackHref?: string;
  // Ignora el historial y va siempre al destino fijo — para vistas donde
  // "Volver" tiene un único sitio con sentido (ej. el selector de marcas de
  // /productos, al que se puede llegar saltándoselo desde el mega-menú).
  forceFallback?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // Vive en sessionStorage, que solo existe en el cliente: en el servidor se
  // devuelve null y el rótulo nace genérico, así no hay desajuste al hidratar.
  // No cambia mientras esta vista está montada (se escribe al hacer click en el
  // enlace que trae aquí), de ahí que no haga falta suscribirse a nada.
  const target = useSyncExternalStore(
    useCallback(() => () => {}, []),
    useCallback(() => readBackTarget(pathname), [pathname]),
    () => null
  );

  return (
    <button
      type="button"
      onClick={() => {
        // Lo que decide el salto es que HAYA historial, no la nota: desde la
        // portada a una moto no hay nota que apuntar y aun así "Volver" tiene
        // que devolver a la portada. La nota solo pone el rótulo.
        if (!forceFallback && window.history.length > 1) window.history.back();
        else if (fallbackHref) router.push(fallbackHref);
        else window.dispatchEvent(new CustomEvent("qb:open-catalog"));
      }}
      className={`inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 font-mono text-xs tracking-[0.1em] text-brand-text/70 uppercase transition hover:border-brand-navy hover:text-brand-navy ${className}`}
    >
      ← {label ?? backLabel(target)}
    </button>
  );
}
