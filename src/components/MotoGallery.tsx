"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { withBasePath } from "@/lib/base-path";
import { galleryPaths, type Motorcycle } from "@/data/motorcycles";

/**
 * Galería de la ficha. El escenario es vertical (4:5) porque las fotos del
 * showroom se toman con el teléfono en vertical; las de prensa, horizontales,
 * caen centradas y el margen sobrante es blanco sobre blanco, así que no se
 * nota. Las miniaturas van recortadas a 3:4 para que la tira quede pareja
 * mezclando fotos de las dos formas.
 *
 * Cuando el modelo existe en varios colores con fotos propias, sale un
 * selector de muestras y cambiar de color cambia la secuencia entera.
 */
export default function MotoGallery({ moto }: { moto: Motorcycle }) {
  const label = `${moto.brand} ${moto.model}`;
  const colorways = moto.colorways;
  const [colorId, setColorId] = useState(colorways?.[0].id);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const colorway = colorways?.find((c) => c.id === colorId);
  const srcs = galleryPaths(moto, colorId).map(withBasePath);

  function pickColor(id: string) {
    setColorId(id);
    setActive(0); // la secuencia cambia entera: volver a la foto de apertura
  }

  // El key del escenario cambia con el color: fuerza el remonte y con él la
  // animación de entrada, que en las ediciones especiales es la del destello.
  const stageKey = `${colorId ?? "base"}-${active}`;

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        aria-label={`Ver foto ${active + 1} de ${label} en pantalla completa`}
        // El escenario NO se oscurece en las ediciones especiales: las fotos de
        // prensa llevan el fondo blanco incrustado y sobre negro quedaba un
        // recuadro blanco flotando. La distinción se hace toda en oro.
        className={`relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden border bg-white transition-colors duration-500 ${
          colorway?.special ? "border-[#C9A227]/45" : "border-black/[0.07]"
        }`}
      >
        <Image
          key={srcs[active]}
          src={srcs[active]}
          alt={label}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-contain ${colorway?.special ? "qb-bk-photo" : ""}`}
          preload
        />
        {/* Edición especial: el fondo cae a negro y una lámina de luz dorada
            barre la moto una sola vez, como el reflejo de un foco al girarla. */}
        {colorway?.special && (
          <span key={stageKey} aria-hidden className="qb-bk-sheen pointer-events-none absolute inset-0" />
        )}
        {colorway?.special && (
          <span className="pointer-events-none absolute top-3 left-3 rounded-full border border-[#C9A227]/70 bg-[#FBF7EC] px-3 py-1 font-mono text-[9px] tracking-[0.18em] text-[#8A6D1F] uppercase">
            Edición especial
          </span>
        )}
        <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/45 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-white/90 uppercase backdrop-blur-sm">
          {active + 1}/{srcs.length}
        </span>
      </button>

      {colorways && colorways.length > 1 && (
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-brand-text/45 uppercase">
            Color
          </span>
          <div className="flex items-center gap-2.5">
            {colorways.map((c) => {
              const on = c.id === colorId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => pickColor(c.id)}
                  aria-pressed={on}
                  title={c.name}
                  className={`relative h-8 w-8 rounded-full border transition duration-300 ${
                    on
                      ? c.special
                        ? "border-[#C9A227] ring-2 ring-[#C9A227]/35 ring-offset-2 ring-offset-brand-bg"
                        : "border-brand-navy ring-2 ring-brand-navy/25 ring-offset-2 ring-offset-brand-bg"
                      : c.special
                        ? "border-[#C9A227]/50 hover:border-[#C9A227]"
                        : "border-black/15 hover:border-brand-navy/50"
                  }`}
                  style={{ background: c.swatch }}
                >
                  <span className="sr-only">{c.name}</span>
                </button>
              );
            })}
          </div>
          <span
            className={`font-mono text-xs ${
              colorway?.special ? "tracking-[0.12em] text-[#8A6D1F] uppercase" : "text-brand-text/70"
            }`}
          >
            {colorway?.name}
          </span>
        </div>
      )}

      {colorway?.accessories && colorway.accessories.length > 0 && (
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-brand-text/50">
          Unidad fotografiada con {colorway.accessories.join(" · ")} — accesorios
          opcionales, consúltanos para montarlos.
        </p>
      )}

      {/* Tira horizontal y no rejilla: con 11 fotos una rejilla de 5 columnas
          se va a tres filas y deja la columna de specs flotando en medio de un
          vacío enorme. En fila, la galería termina a la altura de la ficha. */}
      {srcs.length > 1 && (
        <div className="hide-scrollbar mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto">
          {srcs.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={active === i}
              className={`relative aspect-[3/4] w-[18%] shrink-0 snap-start overflow-hidden border bg-white transition duration-300 sm:w-[15%] ${
                active === i
                  ? "border-brand-navy"
                  : "border-black/10 opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="15vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <Lightbox
          srcs={srcs}
          label={label}
          index={active}
          onIndex={setActive}
          onClose={() => setLightbox(false)}
        />
      )}
    </div>
  );
}

const SWIPE_THRESHOLD_PX = 50;

function Lightbox({
  srcs,
  label,
  index,
  onIndex,
  onClose,
}: {
  srcs: string[];
  label: string;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const many = srcs.length > 1;

  const step = useCallback(
    (dir: 1 | -1) => {
      onIndex((index + dir + srcs.length) % srcs.length);
    },
    [index, onIndex, srcs.length]
  );

  // Foco al abrir + restaurar al cerrar; bloquea el scroll del body mientras
  // el lightbox está montado.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    containerRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowRight" && many) step(1);
    else if (e.key === "ArrowLeft" && many) step(-1);
    else if (e.key === "Tab") {
      // Focus trap: Tab circula solo entre los controles del diálogo.
      const focusables = containerRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusables || focusables.length === 0) return;
      const list = Array.from(focusables);
      const current = document.activeElement as HTMLElement;
      let next = list.indexOf(current) + (e.shiftKey ? -1 : 1);
      if (next < 0) next = list.length - 1;
      if (next >= list.length) next = 0;
      list[next].focus();
      e.preventDefault();
    }
  }

  return (
    // Overlay sin AnimatePresence: el desmontaje condicional simple es
    // inmediato y a prueba de fallos; el fade de entrada lo pone framer en
    // el propio nodo (initial -> animate) y las fotos cruzan por su key.
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${label}, foto ${index + 1} de ${srcs.length}`}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 outline-none"
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null || !many) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) > SWIPE_THRESHOLD_PX) step(delta < 0 ? 1 : -1);
      }}
    >
      {/* Sin AnimatePresence anidado: uno interno con mode="wait" bloquea la
          animación de salida del AnimatePresence padre y el lightbox nunca
          se desmonta. El remount por key con fade-in basta para la
          transición entre fotos. */}
      <motion.div
        key={index}
        initial={{ opacity: 0.25, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute inset-x-4 inset-y-14 sm:inset-x-16"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={srcs[index]}
          alt={`${label} — foto ${index + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </motion.div>

      <button
        onClick={onClose}
        aria-label="Cerrar galería"
        className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full text-2xl leading-none text-white/80 transition hover:bg-white/10 hover:text-white"
      >
        ×
      </button>

      {many && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-3xl text-white/70 transition hover:bg-white/10 hover:text-white sm:left-4"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-3xl text-white/70 transition hover:bg-white/10 hover:text-white sm:right-4"
          >
            ›
          </button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-sm text-white/70">
            {index + 1}/{srcs.length}
          </p>
        </>
      )}
    </motion.div>
  );
}
