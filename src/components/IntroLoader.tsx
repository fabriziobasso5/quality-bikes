"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LOGO_PATHS, LOGO_VIEWBOX } from "./logo-paths";

const DRAW_DURATION = 1.2;
const FILL_DELAY = 1.0;
const HOLD_MS = 1700;
const EXIT_MS = 500;

// Cuándo se pone --qb-intro-delay a 0s. NO puede ser al desaparecer el velo:
// bajar el delay de una animación que aún está en su fase de espera adelanta su
// reloj de golpe — la silueta saltaría directamente al trazo terminado, justo
// el fallo que esto viene a arreglar. Se espera a que la intro de la portada
// haya terminado por completo (la más larga acaba en 2.2s de espera + 2.5s de
// animación) y solo entonces se pone a cero, para que las navegaciones internas
// posteriores —que no remontan este componente— dibujen la silueta al instante.
const RELEASE_MS = 5200;

function releaseHeroIntro() {
  document.documentElement.style.setProperty("--qb-intro-delay", "0s");
}

/**
 * The initial-load experience IS the brand mark drawing itself — no generic
 * spinner. Deliberately client-only and non-blocking: content renders and
 * stays interactive underneath. On a fast load (the normal case) this fades
 * in near-instantly over the hero; on a slow connection the user just sees
 * the site — content never waits for a decoration. Plays on every page load /
 * refresh (no once-per-session gate), never under prefers-reduced-motion.
 */
export default function IntroLoader() {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("done");
      releaseHeroIntro();
      return;
    }
    setPhase("playing");
    const t = setTimeout(() => setPhase("done"), HOLD_MS);
    const release = setTimeout(releaseHeroIntro, RELEASE_MS);
    return () => {
      clearTimeout(t);
      clearTimeout(release);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase === "playing" && (
        <motion.div
          key="intro"
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-brand-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.15 } }}
          exit={{ opacity: 0, transition: { duration: EXIT_MS / 1000, ease: "easeInOut" } }}
          aria-hidden
        >
          <svg viewBox={LOGO_VIEWBOX} className="w-56 sm:w-72" fill="none">
            {LOGO_PATHS.map((p, i) => (
              <motion.path
                key={`stroke-${i}`}
                d={p.d}
                stroke={p.fill}
                strokeWidth={3}
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: DRAW_DURATION, ease: "easeInOut", delay: i * 0.12 }}
              />
            ))}
            {LOGO_PATHS.map((p, i) => (
              <motion.path
                key={`fill-${i}`}
                d={p.d}
                fill={p.fill}
                fillRule="evenodd"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: FILL_DELAY }}
              />
            ))}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
