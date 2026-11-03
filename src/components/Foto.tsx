import type { CSSProperties } from "react";
import indice from "@/generated/fotos.json";
import { withBasePath } from "@/lib/base-path";

/**
 * Foto liviana del sitio. En vez de mandar siempre el original (1600 px), da
 * al navegador una lista de versiones (320, 480, 640… px de ancho, en AVIF y
 * WebP) y él descarga solo la que necesita según la pantalla: en un teléfono
 * es una fracción del peso. Las versiones las crea scripts/variantes-fotos.mjs
 * al compilar; aquí solo se leen del índice.
 *
 * No usa next/image a propósito: el sitio es estático y no depende del
 * optimizador de imágenes de Vercel (/_next/image), cuyo cupo está agotado.
 *
 * - `sizes`: cuánto mide la foto en pantalla (igual que en HTML). Es lo que
 *   decide qué versión se baja, así que debe ser realista.
 * - `priority`: solo para lo que se ve al abrir la página — carga en el acto.
 *   Todo lo demás se carga al acercarse con el scroll (loading="lazy").
 * - `fill`: la foto llena su caja (que debe tener posición y tamaño propios),
 *   como el `fill` de next/image. Sin `fill` lleva width/height reales para
 *   reservar su espacio y que la página no salte mientras carga.
 * - `placeholder`: pinta el color medio de la foto mientras llega (solo en
 *   fotos que tapan toda su caja; sobre fondo blanco no hace falta).
 */

type Entrada = [hash: string, set: number, avif: number, w: number, h: number, color?: string];
const datos = indice as unknown as { sets: number[][]; fotos: Record<string, Entrada> };

function variante(src: string, hash: string, w: number, f: string) {
  const base = src.slice(0, src.lastIndexOf("."));
  return withBasePath(`/v${base}.${hash}-${w}.${f}`);
}

export function fotoInfo(src: string) {
  const e = datos.fotos[src];
  if (!e) return null;
  const [hash, set, avif, w, h, color] = e;
  const widths = datos.sets[set];
  const srcset = (f: string) => widths.map((x) => `${variante(src, hash, x, f)} ${x}w`).join(", ");
  return {
    w,
    h,
    color,
    webp: srcset("webp"),
    avif: avif ? srcset("avif") : null,
    /** Una sola versión de un ancho dado (para fondos CSS). */
    at: (target: number) => variante(src, hash, widths.find((x) => x >= target) ?? widths[widths.length - 1], "webp"),
  };
}

export default function Foto({
  src,
  alt,
  sizes,
  className,
  style,
  fill = false,
  priority = false,
  placeholder = false,
  width,
  height,
  sinMedidas = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  style?: CSSProperties;
  fill?: boolean;
  priority?: boolean;
  placeholder?: boolean;
  width?: number;
  height?: number;
  /** Logos con alto/ancho por CSS (w-auto + max-h): sin width/height en la etiqueta. */
  sinMedidas?: boolean;
}) {
  const info = fotoInfo(src);
  const imgStyle: CSSProperties = {
    ...(fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : null),
    ...(placeholder && info?.color ? { backgroundColor: info.color } : null),
    ...style,
  };
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- versiones propias, sin /_next/image
    <img
      src={withBasePath(src)}
      srcSet={info?.webp}
      sizes={info ? sizes : undefined}
      alt={alt}
      width={fill || sinMedidas ? undefined : (width ?? info?.w)}
      height={fill || sinMedidas ? undefined : (height ?? info?.h)}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      style={imgStyle}
    />
  );
  if (!info?.avif) return img;
  return (
    <picture style={{ display: "contents" }}>
      <source type="image/avif" srcSet={info.avif} sizes={sizes} />
      {img}
    </picture>
  );
}

/**
 * Textura de fibra de carbono como capa de fondo (antes un background-image
 * CSS de 262 KB). Es una <img> con object-cover centrado: se ve exactamente
 * igual que `background-size: cover`, pero el teléfono baja la versión de
 * 640 px y las que están lejos de la pantalla se cargan al llegar.
 */
export function FondoCarbono({
  priority = false,
  // En cajas altas (pie, tienda en el teléfono) `cover` amplía mucho la
  // textura: ahí se pide la versión grande para que no se vea borrosa.
  sizes = "100vw",
}: {
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Foto
      src="/images/carbono-forjado.jpg"
      alt=""
      sizes={sizes}
      fill
      priority={priority}
      className="pointer-events-none object-cover object-center"
    />
  );
}
