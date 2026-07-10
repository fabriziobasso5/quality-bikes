"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { withBasePath } from "@/lib/base-path";
import type { Motorcycle } from "@/data/motorcycles";

const ROTATE_MS = 5000;

/**
 * Moto destacada rotativa (estilo CAKE, mismo diseño que la sección flotante
 * original): alterna automáticamente cada ~5 s entre TODAS las motos de próximo
 * arribo. Por cada una muestra su foto flotante, sus specs y el botón "Reservar"
 * hacia su ficha. Flechas y puntos para navegar manual; se pausa al pasar el
 * cursor / interactuar y respeta prefers-reduced-motion (sin auto-rotación).
 */
export default function FeaturedArrivals({ motos }: { motos: Motorcycle[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const count = motos.length;

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + count) % count),
    [count],
  );

  // Auto-rotación: pausada al interactuar o bajo reduced-motion.
  useEffect(() => {
    if (paused || reduce || count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, reduce, count]);

  if (count === 0) return null;
  const moto = motos[index];

  return (
    <section
      className="mx-auto max-w-5xl px-6 py-28 text-center sm:py-36"
      aria-roledescription="carrusel"
      aria-label="Motos de próximo arribo"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Reveal>
        <p className="text-xs tracking-[0.3em] text-brand-red uppercase">Próximo arribo</p>
      </Reveal>

      {/* Unidad rotativa: nombre + foto flotante + specs + Reservar. Las mismas
          portadas 4:3 normalizadas, así el alto se mantiene y no hay saltos.
          Se remonta al cambiar `key` (fundido de entrada); sin AnimatePresence
          mode="wait" — cuyo exit encolado desincronizaba contenido y puntos. */}
      <div>
        <motion.div
          key={moto.slug}
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="mt-3 font-display text-4xl tracking-wide uppercase sm:text-6xl">
            {moto.brand} {moto.model}
          </h2>

          <div className="relative mx-auto mt-10 max-w-2xl">
            <Image
              src={withBasePath(`/images/catalog/${moto.slug}.webp`)}
              alt={`${moto.brand} ${moto.model}`}
              width={1600}
              height={1200}
              sizes="(max-width: 640px) 100vw, 672px"
              className="relative z-10 h-auto w-full"
              priority={index === 0}
            />
            {/* Sombra elíptica difusa bajo la moto: el truco CAKE de "flotar" */}
            <div
              aria-hidden
              className="absolute bottom-[6%] left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl"
            />
          </div>

          <p className="mx-auto mt-8 max-w-md text-brand-text/70">
            La gama dual sport de Voge llega a Caracas. Resérvala antes de que toque piso.
          </p>
          <div className="mt-8 flex items-center justify-center gap-10 font-mono text-sm text-brand-text/60">
            <span>{moto.specs.power}</span>
            <span aria-hidden className="text-brand-text/20">|</span>
            <span>{moto.cc} cc</span>
            {moto.specs.weight && (
              <>
                <span aria-hidden className="text-brand-text/20">|</span>
                <span>{moto.specs.weight}</span>
              </>
            )}
          </div>
          <Link
            href={`/catalogo/${moto.slug}`}
            className="link-underline mt-10 inline-block text-sm tracking-widest text-brand-navy uppercase"
          >
            Reservar →
          </Link>
        </motion.div>
      </div>

      {/* Controles: flechas + puntos para navegar manual. */}
      {count > 1 && (
        <div className="mt-12 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Moto anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-brand-text/60 transition hover:border-brand-navy/40 hover:text-brand-navy"
          >
            ←
          </button>

          <div className="flex items-center gap-2.5" role="tablist">
            {motos.map((m, i) => (
              <button
                key={m.slug}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver ${m.brand} ${m.model}`}
                aria-selected={i === index}
                role="tab"
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-brand-navy"
                    : "w-2 bg-brand-text/25 hover:bg-brand-text/40"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Moto siguiente"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-brand-text/60 transition hover:border-brand-navy/40 hover:text-brand-navy"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
