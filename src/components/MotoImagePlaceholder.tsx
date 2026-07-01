// Placeholder visual mientras se recibe fotografía real de inventario.
// TODO: reemplazar por <Image> de next/image apuntando a las fotos reales
// (agregarlas a /public o a un CDN, y ajustar aquí).
export default function MotoImagePlaceholder({
  brand,
  model,
  className = "",
  showLabel = true,
  align = "center",
  theme = "light",
}: {
  brand: string;
  model: string;
  className?: string;
  showLabel?: boolean;
  align?: "center" | "top";
  theme?: "light" | "dark";
}) {
  const alignClass = align === "top" ? "justify-start pt-16 md:pt-20" : "justify-center";
  const themeClass =
    theme === "dark"
      ? "bg-gradient-to-br from-brand-navy to-[#001d38] text-brand-bg/50"
      : "bg-brand-bg-soft text-brand-text/40";
  const iconClass = theme === "dark" ? "text-brand-bg/40" : "text-brand-taupe";

  return (
    <div
      className={`flex flex-col items-center ${alignClass} gap-2 text-center ${themeClass} ${className}`}
    >
      <svg
        viewBox="0 0 64 64"
        className={`h-10 w-10 ${iconClass}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="16" cy="46" r="8" />
        <circle cx="48" cy="46" r="8" />
        <path d="M16 46 28 26h14l6 10M28 26l-6-8H14M40 26l8 20" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showLabel && (
        <p className="px-4 text-xs tracking-wide">
          {brand} {model}
          <br />
          Foto próximamente
        </p>
      )}
    </div>
  );
}
