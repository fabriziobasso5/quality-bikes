"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { MOTO_SILHOUETTE_PATH, MOTO_SILHOUETTE_VIEWBOX } from "./logo3d/moto-silhouette-path";
import { siteConfig } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

/**
 * Pieza de cierre "del plano al asfalto": sección pinned (150–170vh de
 * recorrido, corto para que el efecto sea ágil) sobre fondo navy de plano
 * técnico. Con el scroll: (1) la silueta del isotipo se dibuja como plano —
 * trazo blanco, retícula, cotas y cajetín; (2) en una misma ventana de
 * progreso el wireframe se desvanece mientras la R 1250 GS Adventure Triple
 * Black real "se materializa" registrada sobre la silueta, y el fondo cae a
 * un anochecer; (3) se encienden las luces ámbar proyectando el haz hacia la
 * derecha y entran las specs minimalistas; (4) cierra el eslogan.
 *
 * El progreso vive en la variable CSS --bp (0→1): una suscripción a
 * scrollYProgress alimenta un lerp por rAF (mismo truco que
 * lib/use-smooth-value.ts — framer-motion 12.x pierde bindings de opacity y
 * useSpring bajo React 19) y cada capa deriva opacidad/transform con
 * clamp()/calc() en CSS puro. Bajo prefers-reduced-motion se fija --bp:1:
 * composición final estática, sin pin.
 */

// Rampa 0→1 entre a y b sobre --bp, como string CSS (divisor literal, válido
// en calc()). clamp() mantiene el valor plano fuera del tramo.
const ramp = (a: number, b: number) =>
  `clamp(0, (var(--bp) - ${a}) / ${b - a}, 1)`;
// Rampa descendente 1→0 entre a y b.
const fade = (a: number, b: number) =>
  `clamp(0, (${b} - var(--bp)) / ${b - a}, 1)`;

// Factor del lerp por frame: alto = respuesta rápida, bajo = más flotado.
const SMOOTH = 0.16;

const SPECS_LEFT = [
  "R 1250 GS Adventure",
  "Option 719 · Triple Black",
  "1.254 cc · Bóxer",
];
const SPECS_RIGHT = ["136 cv", "219 km/h · Vel. máx", "2.270 mm · Longitud", "890 mm · Asiento"];

export default function BlueprintReveal() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Lerp hacia el progreso real, escribiendo --bp solo mientras se mueve.
  const target = useRef(0);
  const current = useRef(0);
  const raf = useRef<number | null>(null);

  // Función declarada (no useCallback): necesita auto-referenciarse para el
  // encadenado de frames; solo lee refs, así que no captura estado obsoleto.
  function step() {
    const t = target.current;
    const next = current.current + (t - current.current) * SMOOTH;
    const done = Math.abs(t - next) < 0.0008;
    current.current = done ? t : next;
    stageRef.current?.style.setProperty("--bp", current.current.toFixed(4));
    raf.current = done ? null : requestAnimationFrame(step);
  }

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    target.current = v;
    if (raf.current == null) raf.current = requestAnimationFrame(step);
  });

  // Estado inicial correcto al montar a mitad de página (deep-link, reload) y
  // limpieza del rAF pendiente al desmontar.
  useEffect(() => {
    const v = reduce ? 1 : scrollYProgress.get();
    target.current = v;
    current.current = v;
    stageRef.current?.style.setProperty("--bp", String(v));
    return () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [reduce, scrollYProgress]);

  return (
    <section
      ref={trackRef}
      className={reduce ? "relative" : "relative h-[150vh] sm:h-[170vh]"}
    >
      <div
        ref={stageRef}
        style={{ "--bp": 0 } as React.CSSProperties}
        className={`${reduce ? "relative" : "sticky top-0"} flex h-svh w-full flex-col items-center justify-center overflow-hidden bg-brand-navy`}
      >
        {/* Anochecer: entra con la moto — cielo que cae a negro azulado y un
            resplandor cálido de horizonte hacia donde apunta el faro */}
        <div
          aria-hidden
          style={{ opacity: ramp(0.44, 0.68) }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_55%_20%_at_72%_74%,rgba(255,170,80,0.16),transparent_70%),linear-gradient(180deg,#04101f_0%,#0a1d33_55%,#16304b_78%,#0a1626_100%)]"
        />
        {/* Retícula de plano técnico: línea menor cada 24px, mayor cada 120px.
            Cede casi por completo cuando la moto toma la escena. */}
        <div
          aria-hidden
          style={{ opacity: `calc(1 - ${ramp(0.5, 0.8)} * 0.75)` }}
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[size:24px_24px,24px_24px,120px_120px,120px_120px]"
        />
        {/* Viñeta para que el centro respire y las esquinas caigan */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,10,25,0.6)_100%)]"
        />

        {/* Marco del plano con cajetín, siempre visible */}
        <div aria-hidden className="absolute inset-4 border border-white/15 sm:inset-6" />
        <div className="absolute bottom-4 right-4 border border-white/15 bg-brand-navy/80 px-4 py-2 text-right sm:bottom-6 sm:right-6">
          <p className="font-mono text-[9px] tracking-[0.2em] text-white/50 uppercase sm:text-[10px]">
            Plano N.º 001 · QB-GSA-719
          </p>
          <p className="font-mono text-[9px] tracking-[0.2em] text-white/30 uppercase sm:text-[10px]">
            Esc 1:1 · Caracas, Venezuela
          </p>
        </div>

        <p className="absolute top-8 text-xs tracking-[0.3em] text-white/50 uppercase sm:top-12">
          Quality Bikes · Venezuela
        </p>

        {/* Specs laterales, minimalistas: entran con la moto y no compiten */}
        <div
          style={{ opacity: `calc(${ramp(0.58, 0.72)} * 0.9)` }}
          className="absolute left-10 top-1/2 hidden -translate-y-1/2 space-y-3 lg:block"
        >
          {SPECS_LEFT.map((s) => (
            <p key={s} className="font-mono text-[10px] tracking-[0.22em] text-white/35 uppercase">
              {s}
            </p>
          ))}
        </div>
        <div
          style={{ opacity: `calc(${ramp(0.58, 0.72)} * 0.9)` }}
          className="absolute right-10 top-1/2 hidden -translate-y-1/2 space-y-3 text-right lg:block"
        >
          {SPECS_RIGHT.map((s) => (
            <p key={s} className="font-mono text-[10px] tracking-[0.22em] text-white/35 uppercase">
              {s}
            </p>
          ))}
        </div>

        {/* Escenario central: silueta y moto real comparten la misma caja para
            que el crossfade quede registrado en el mismo punto */}
        <div className="relative aspect-[827/585] w-[min(88vw,780px)]">
          {/* Wireframe del isotipo: se dibuja en 0.04–0.36 y cede en 0.44–0.58,
              exactamente la misma ventana en la que aparece la moto */}
          <svg
            viewBox={MOTO_SILHOUETTE_VIEWBOX}
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            /* translate/scale: registra la silueta sobre la carrocería de la
               GS medida en overlay — así el crossfade solapa en el mismo punto */
            style={{ opacity: fade(0.44, 0.58), transform: "translate(-1.5%, 4.5%) scale(0.96)" }}
          >
            <path
              d={MOTO_SILHOUETTE_PATH}
              fill="#ffffff"
              style={{ fillOpacity: `calc(${ramp(0.28, 0.4)} * 0.07)` }}
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
              style={{ strokeDashoffset: fade(0.04, 0.36) }}
            />
          </svg>

          {/* Cotas de plano (datos reales del GS Adventure) */}
          <div
            aria-hidden
            style={{ opacity: `min(${ramp(0.16, 0.28)}, ${fade(0.4, 0.52)})` }}
            className="absolute inset-0"
          >
            <div className="absolute -bottom-8 left-[4%] right-[4%] border-t border-white/40" />
            <div className="absolute -bottom-9 left-[4%] h-2 border-l border-white/40" />
            <div className="absolute -bottom-9 right-[4%] h-2 border-r border-white/40" />
            <p className="absolute -bottom-14 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-white/50">
              2.270 mm
            </p>
            <div className="absolute -right-6 top-[6%] bottom-[12%] border-r border-white/40 max-sm:hidden" />
            <p className="absolute -right-11 top-1/2 -translate-y-1/2 rotate-90 font-mono text-[10px] tracking-[0.25em] text-white/50 max-sm:hidden">
              1.460 mm
            </p>
          </div>

          {/* Anotaciones de la fase plano */}
          <p
            style={{ opacity: `min(${ramp(0.06, 0.14)}, ${fade(0.4, 0.52)})` }}
            className="absolute -top-10 left-0 font-mono text-[10px] tracking-[0.25em] text-white/50 uppercase"
          >
            Fig. 01 — R 1250 GS Adventure
          </p>

          {/* La moto real se materializa sobre la silueta en 0.44–0.58 y
              asienta hasta 0.72. --bike-t es el progreso local. */}
          <div
            style={
              {
                "--bike-t": ramp(0.44, 0.72),
                opacity: ramp(0.44, 0.58),
                transform:
                  "translateY(calc((1 - var(--bike-t)) * 18px)) scale(calc(1 + (1 - var(--bike-t)) * 0.05))",
              } as React.CSSProperties
            }
            className="absolute inset-0"
          >
            <Image
              src={withBasePath("/images/blueprint/gs-adventure-719.webp")}
              alt="BMW R 1250 GS Adventure Triple Black Option 719 con luces ámbar encendidas, materializada sobre el plano técnico"
              fill
              sizes="(max-width: 640px) 88vw, 780px"
              className="object-contain"
            />
          </div>

          {/* Encendido: halo del faro, haz ámbar hacia la derecha y charco de
              luz en el piso. El haz cruza más allá de la caja (el overflow del
              escenario lo recorta limpio). */}
          <div aria-hidden style={{ opacity: ramp(0.62, 0.76) }} className="absolute inset-0">
            <div className="absolute left-[74%] top-[20%] h-[13%] w-[9%] animate-pulse rounded-full bg-orange-300/70 blur-xl" />
            <div className="absolute left-[66%] top-[52%] h-[9%] w-[6%] rounded-full bg-orange-400/60 blur-lg" />
            {/* Haz principal del faro: horizontal, abriéndose a la derecha */}
            <div className="absolute left-[78%] top-[12%] h-[32%] w-[70vw] bg-gradient-to-r from-orange-400/50 via-orange-400/15 to-transparent blur-md [clip-path:polygon(0_46%,100%_2%,100%_98%,0_54%)]" />
            {/* Haz secundario de la Denali del crash bar */}
            <div className="absolute left-[70%] top-[48%] h-[16%] w-[40vw] bg-gradient-to-r from-orange-500/30 to-transparent blur-lg [clip-path:polygon(0_42%,100%_10%,100%_90%,0_58%)]" />
            <div className="absolute -right-[24%] bottom-0 h-[12%] w-[70%] rounded-[50%] bg-orange-400/20 blur-2xl" />
          </div>

          {/* Sombra elíptica bajo la moto: la ancla al "piso" */}
          <div
            aria-hidden
            style={{ opacity: `calc(${ramp(0.5, 0.68)} * 0.45)` }}
            className="absolute bottom-[4%] left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl"
          />
        </div>

        {/* Cierre: el eslogan de la casa */}
        <p
          style={{
            opacity: ramp(0.8, 0.9),
            transform: `translateY(calc((1 - ${ramp(0.8, 0.9)}) * 14px))`,
          }}
          className="absolute bottom-16 px-6 text-center font-script text-3xl text-white sm:bottom-20 sm:text-4xl"
        >
          {siteConfig.slogan}
        </p>

        {/* Pista de scroll: solo al inicio de la fase plano */}
        {!reduce && (
          <p
            style={{ opacity: fade(0, 0.06) }}
            className="absolute bottom-6 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase"
          >
            ↓ Scroll
          </p>
        )}
      </div>
    </section>
  );
}
