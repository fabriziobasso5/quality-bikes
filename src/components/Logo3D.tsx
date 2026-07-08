"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LogoFallback2D from "./logo3d/LogoFallback2D";
import { MOTO_SILHOUETTE_PATH, MOTO_SILHOUETTE_VIEWBOX } from "./logo3d/moto-silhouette-path";

const Logo3DCanvas = dynamic(() => import("./logo3d/Logo3DCanvas"), {
  ssr: false,
  loading: () => null,
});

function detectCanUse3D() {
  if (window.innerWidth < 768) return false;
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores < 4) return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Lazy 3D emblem con "ensamblaje por trazo" tipo blueprint: al hacer scroll
 * hacia la sección, la silueta de la moto se dibuja como wireframe en azul de
 * marca (stroke-draw ligado al scroll); al completarse un flash sutil revela
 * la pieza metálica sólida que gira. De esqueleto de líneas a pieza terminada.
 *
 * WebGL solo se descarga al acercarse y si el equipo lo permite; el resto ve
 * el fallback 2D animado (o el logo estático sin WebGL/JS). Bajo reduced
 * motion se muestra la pieza final directa, sin ensamblaje.
 */
export default function Logo3D() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [use3D, setUse3D] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUse3D(detectCanUse3D());
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReady(true);
  }, []);

  // Defer the WebGL bundle until the section is actually approaching.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // El ensamblaje blueprint solo corre en la ruta 3D con movimiento permitido.
  const blueprint = ready && use3D && !reduceMotion;

  // Progreso de scroll a través de la sección: 0 cuando el bloque asoma por
  // abajo, 1 cuando ya está bien dentro del viewport.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start 0.85", "start 0.3"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 0.72], [0, 1]);
  const wireOpacity = useTransform(scrollYProgress, [0, 0.05, 0.74, 0.9], [0, 1, 1, 0]);
  const flashOpacity = useTransform(scrollYProgress, [0.7, 0.79, 0.9], [0, 0.8, 0]);
  const pieceOpacity = useTransform(scrollYProgress, [0.7, 0.92], [0, 1]);

  return (
    <div ref={wrapperRef} className="pointer-events-none relative h-full w-full">
      {ready && !use3D && <LogoFallback2D />}

      {ready && use3D && (
        <>
          <motion.div
            className="absolute inset-0"
            style={blueprint ? { opacity: pieceOpacity } : undefined}
          >
            {nearViewport && <Logo3DCanvas reduceMotion={reduceMotion} />}
          </motion.div>

          {blueprint && (
            <>
              <motion.svg
                aria-hidden
                viewBox={MOTO_SILHOUETTE_VIEWBOX}
                fill="none"
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0 h-full w-full"
                style={{ opacity: wireOpacity }}
              >
                <motion.path
                  d={MOTO_SILHOUETTE_PATH}
                  stroke="#003462"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{ pathLength }}
                />
              </motion.svg>

              {/* Flash de revelado: pulso blanco breve al terminar el trazo. */}
              <motion.div
                aria-hidden
                className="absolute inset-0 bg-white"
                style={{ opacity: flashOpacity }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
