"use client";

/**
 * Botón que abre el mega-menú de catálogo estilo Ducati (el panel blanco a todo
 * el ancho con todas las motos que vive en <Header>). No navega a ninguna
 * página: dispara el evento global `qb:open-catalog` que el Header escucha, así
 * los cuatro accesos del sitio ("Catálogo" del nav, "Ver catálogo" del hero, el
 * botón del showroom y "Catálogo" del footer) abren exactamente el MISMO panel.
 */
export default function OpenCatalogButton({
  children,
  className,
  onOpen,
}: {
  children: React.ReactNode;
  className?: string;
  onOpen?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        onOpen?.();
        window.dispatchEvent(new CustomEvent("qb:open-catalog"));
      }}
      className={className}
    >
      {children}
    </button>
  );
}
