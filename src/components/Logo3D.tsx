"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MOTO_SILHOUETTE_PATH, MOTO_SILHOUETTE_VIEWBOX } from "./logo3d/moto-silhouette-path";

const TAUPE = "#A79F9D"; // gris taupe de marca (relleno sólido del logo)
const NAVY = "#003462"; // azul de marca (contorno del "bordado")

const DRAW_S = 1.7; // duración del stroke-draw del contorno
const FILL_DELAY_S = 1.45; // el relleno entra casi al terminar el trazo
const FILL_S = 0.6; // crossfade contorno → sólido
const SPIN_S = 16; // vuelta completa, lenta (plataforma de exhibición)

/**
 * Pieza de cierre, 100% 2D en todos los viewports (sin WebGL). Secuencia al
 * entrar en viewport: (1) "bordado" — el contorno de la silueta de la moto se
 * dibuja con stroke azul de marca; (2) el logo se rellena/solidifica en gris
 * taupe de marca, mismo tamaño que la silueta; (3) gira lento sobre su eje
 * vertical (Y), como plataforma giratoria. Bajo prefers-reduced-motion se
 * muestra el logo sólido estático, sin bordado ni giro.
 */
export default function Logo3D() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Reproducir la animación solo al entrar y si el usuario permite movimiento.
  const play = inView && !reduce;

  return (
    <div
      ref={ref}
      className="pointer-events-none flex h-full w-full items-center justify-center [perspective:1200px]"
    >
      <motion.div
        className="inline-block"
        style={{ transformStyle: "preserve-3d" }}
        animate={spinning ? { rotateY: [0, 360] } : { rotateY: 0 }}
        transition={
          spinning
            ? { duration: SPIN_S, repeat: Infinity, ease: "linear" }
            : { duration: 0 }
        }
      >
        <svg
          viewBox={MOTO_SILHOUETTE_VIEWBOX}
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          className="h-40 w-auto drop-shadow-2xl sm:h-56"
        >
          {/* Relleno sólido taupe: estado final de la pieza. */}
          <motion.path
            d={MOTO_SILHOUETTE_PATH}
            fill={TAUPE}
            initial={{ fillOpacity: reduce ? 1 : 0 }}
            animate={{ fillOpacity: play || reduce ? 1 : 0 }}
            transition={{ delay: reduce ? 0 : FILL_DELAY_S, duration: reduce ? 0 : FILL_S }}
            onAnimationComplete={() => {
              if (play) setSpinning(true);
            }}
          />
          {/* "Bordado": contorno azul que se dibuja y luego se desvanece al
              solidificarse el relleno. No se renderiza bajo reduced motion. */}
          {!reduce && (
            <motion.path
              d={MOTO_SILHOUETTE_PATH}
              stroke={NAVY}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={play ? { pathLength: 1, opacity: [1, 1, 0] } : { pathLength: 0, opacity: 1 }}
              transition={{
                pathLength: { duration: DRAW_S, ease: "easeInOut" },
                opacity: { duration: FILL_S, delay: FILL_DELAY_S },
              }}
            />
          )}
        </svg>
      </motion.div>
    </div>
  );
}
