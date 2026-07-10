"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { MOTO_SILHOUETTE_PATH, MOTO_SILHOUETTE_VIEWBOX } from "./logo3d/moto-silhouette-path";
import { siteConfig } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

/**
 * Pieza de cierre "del plano al asfalto": sección pinned (240–280vh de
 * recorrido) sobre fondo navy de plano técnico. Con el scroll: (1) la silueta
 * del isotipo se dibuja como plano — trazo blanco, retícula, cotas y cajetín;
 * (2) el wireframe se desvanece mientras la Multistrada V4 real "se
 * materializa" en su lugar; (3) cierra el eslogan de la casa.
 *
 * El progreso vive en la variable CSS --bp (0→1) que una única suscripción a
 * scrollYProgress escribe sobre el escenario; cada capa deriva su opacidad y
 * transform con clamp()/calc() en CSS puro. (framer-motion 12.42 pierde
 * algunos bindings de opacity con MotionValues en style — con la variable CSS
 * no hay binding que perder, y todo sigue fuera del main-thread de React.)
 * Bajo prefers-reduced-motion se fija --bp:1: composición final, sin pin.
 */

// Rampa 0→1 entre a y b sobre --bp, como string CSS (divisor literal, válido
// en calc()). clamp() mantiene el valor plano fuera del tramo.
const ramp = (a: number, b: number) =>
  `clamp(0, (var(--bp) - ${a}) / ${b - a}, 1)`;
// Rampa descendente 1→0 entre a y b.
const fade = (a: number, b: number) =>
  `clamp(0, (${b} - var(--bp)) / ${b - a}, 1)`;

export default function BlueprintReveal() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!reduce) stageRef.current?.style.setProperty("--bp", String(v));
  });

  // Estado inicial correcto al montar a mitad de página (deep-link, reload).
  useEffect(() => {
    stageRef.current?.style.setProperty(
      "--bp",
      reduce ? "1" : String(scrollYProgress.get())
    );
  }, [reduce, scrollYProgress]);

  return (
    <section
      ref={trackRef}
      className={reduce ? "relative" : "relative h-[240vh] sm:h-[280vh]"}
    >
      <div
        ref={stageRef}
        style={{ "--bp": 0 } as React.CSSProperties}
        className={`${reduce ? "relative" : "sticky top-0"} flex h-svh w-full flex-col items-center justify-center overflow-hidden bg-brand-navy`}
      >
        {/* Retícula de plano técnico: línea menor cada 24px, mayor cada 120px.
            Al final del recorrido baja a ~45% para ceder protagonismo. */}
        <div
          aria-hidden
          style={{ opacity: `calc(1 - ${ramp(0.7, 1)} * 0.55)` }}
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[size:24px_24px,24px_24px,120px_120px,120px_120px]"
        />
        {/* Viñeta para que el centro respire y las esquinas caigan */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,20,40,0.55)_100%)]"
        />

        {/* Marco del plano con cajetín, siempre visible */}
        <div aria-hidden className="absolute inset-4 border border-white/15 sm:inset-6" />
        <div className="absolute bottom-4 right-4 border border-white/15 bg-brand-navy/80 px-4 py-2 text-right sm:bottom-6 sm:right-6">
          <p className="font-mono text-[9px] tracking-[0.2em] text-white/50 uppercase sm:text-[10px]">
            Plano N.º 001 · QB-MTS-V4
          </p>
          <p className="font-mono text-[9px] tracking-[0.2em] text-white/30 uppercase sm:text-[10px]">
            Esc 1:1 · Caracas, Venezuela
          </p>
        </div>

        <p className="absolute top-8 text-xs tracking-[0.3em] text-white/50 uppercase sm:top-12">
          Quality Bikes · Venezuela
        </p>

        {/* Escenario central: silueta y moto real comparten la misma caja para
            que el crossfade quede registrado */}
        <div className="relative aspect-[827/585] w-[min(88vw,780px)]">
          {/* Wireframe del isotipo: se dibuja en 0.04–0.42 y cede en 0.5–0.7 */}
          <svg
            viewBox={MOTO_SILHOUETTE_VIEWBOX}
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            style={{ opacity: fade(0.5, 0.7) }}
          >
            <path
              d={MOTO_SILHOUETTE_PATH}
              fill="#ffffff"
              style={{ fillOpacity: `calc(${ramp(0.36, 0.5)} * 0.07)` }}
            />
            <path
              d={MOTO_SILHOUETTE_PATH}
              pathLength={1}
              stroke="#ffffff"
              strokeWidth={1.6}
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="1 1"
              style={{ strokeDashoffset: fade(0.04, 0.42) }}
            />
          </svg>

          {/* Cotas de plano: largo total y altura (datos reales de la V4) */}
          <div
            aria-hidden
            style={{ opacity: `min(${ramp(0.3, 0.42)}, ${fade(0.5, 0.64)})` }}
            className="absolute inset-0"
          >
            <div className="absolute -bottom-8 left-[4%] right-[4%] border-t border-white/40" />
            <div className="absolute -bottom-9 left-[4%] h-2 border-l border-white/40" />
            <div className="absolute -bottom-9 right-[4%] h-2 border-r border-white/40" />
            <p className="absolute -bottom-14 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-white/50">
              2.158 mm
            </p>
            <div className="absolute -right-6 top-[6%] bottom-[12%] border-r border-white/40 max-sm:hidden" />
            <p className="absolute -right-11 top-1/2 -translate-y-1/2 rotate-90 font-mono text-[10px] tracking-[0.25em] text-white/50 max-sm:hidden">
              1.625 mm
            </p>
          </div>

          {/* Anotaciones de la fase plano */}
          <p
            style={{ opacity: `min(${ramp(0.06, 0.16)}, ${fade(0.5, 0.64)})` }}
            className="absolute -top-10 left-0 font-mono text-[10px] tracking-[0.25em] text-white/50 uppercase"
          >
            Fig. 01 — Multistrada V4
          </p>

          {/* La moto real se materializa sobre el plano en 0.52–0.72; asienta
              (escala/deriva) hasta 0.85. --bike-t es el progreso local. */}
          <div
            style={
              {
                "--bike-t": ramp(0.52, 0.85),
                opacity: ramp(0.52, 0.72),
                transform:
                  "translateY(calc((1 - var(--bike-t)) * 24px)) scale(calc(1 + (1 - var(--bike-t)) * 0.06))",
              } as React.CSSProperties
            }
            className="absolute inset-0"
          >
            <Image
              src={withBasePath("/images/blueprint/multistrada-materializada.webp")}
              alt="Ducati Multistrada V4 roja de perfil, materializada sobre el plano técnico"
              fill
              sizes="(max-width: 640px) 88vw, 780px"
              className="object-contain"
            />
          </div>
          {/* Sombra elíptica bajo la moto: la ancla al "piso" del plano */}
          <div
            aria-hidden
            style={{ opacity: `calc(${ramp(0.55, 0.75)} * 0.4)` }}
            className="absolute bottom-[4%] left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/60 blur-xl"
          />
        </div>

        {/* Cierre: el eslogan de la casa, en blanco sobre el navy */}
        <p
          style={{
            opacity: ramp(0.78, 0.9),
            transform: `translateY(calc((1 - ${ramp(0.78, 0.9)}) * 18px))`,
          }}
          className="absolute bottom-16 px-6 text-center font-script text-3xl text-white sm:bottom-20 sm:text-4xl"
        >
          {siteConfig.slogan}
        </p>

        {/* Pista de scroll: solo al inicio de la fase plano */}
        {!reduce && (
          <p
            style={{ opacity: fade(0, 0.08) }}
            className="absolute bottom-6 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase"
          >
            ↓ Scroll
          </p>
        )}
      </div>
    </section>
  );
}
