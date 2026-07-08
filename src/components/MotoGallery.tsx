"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { withBasePath } from "@/lib/base-path";
import { catalogCoverPath, type Motorcycle } from "@/data/motorcycles";

/**
 * Galería de la ficha: la foto oficial de prensa (fondo blanco) abre la
 * secuencia y después vienen las fotos reales del showroom. Click en
 * cualquier foto abre el lightbox a pantalla completa con flechas, swipe,
 * contador y cierre por X/Escape.
 */
export default function MotoGallery({ moto }: { moto: Motorcycle }) {
  const label = `${moto.brand} ${moto.model}`;
  const srcs = [
    withBasePath(catalogCoverPath(moto.slug)),
    ...Array.from({ length: moto.photoCount }, (_, i) =>
      withBasePath(`/images/inventory/${moto.slug}/${i + 1}.webp`)
    ),
  ];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        aria-label={`Ver foto ${active + 1} de ${label} en pantalla completa`}
        className="relative block h-96 w-full cursor-zoom-in bg-white lg:h-[480px]"
      >
        <Image
          src={srcs[active]}
          alt={label}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain"
          preload
        />
      </button>
      {srcs.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {srcs.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`relative h-16 overflow-hidden border bg-white transition ${
                active === i ? "border-brand-navy" : "border-black/10 opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="20vw" className="object-contain" />
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
