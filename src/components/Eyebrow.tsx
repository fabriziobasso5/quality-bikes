type Tone = "navy" | "red";

const TONE_STYLES: Record<Tone, { text: string; marker: string }> = {
  navy: { text: "text-brand-navy", marker: "bg-brand-navy" },
  red: { text: "text-brand-red", marker: "bg-brand-red" },
};

/**
 * Antetítulo de sección — Space Mono en vez de la sans genérica, tracking
 * más cerrado que el "mayúsculas grises anchas" por defecto, y un tick de
 * color de marca en vez de solo texto plano. Mismo tratamiento en todas las
 * páginas internas (no en la portada, que tiene su propio sistema).
 */
export default function Eyebrow({
  children,
  tone = "navy",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const { text, marker } = TONE_STYLES[tone];
  return (
    <p className={`flex items-center gap-2 font-mono text-xs tracking-[0.15em] uppercase ${text} ${className}`}>
      <span aria-hidden className={`h-[3px] w-4 shrink-0 ${marker}`} />
      {children}
    </p>
  );
}
