"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import Magnetic from "@/components/Magnetic";
import OpenCatalogButton from "@/components/OpenCatalogButton";
import { siteConfig } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";
import { EXPLODED, type SpriteBox } from "./exploded-manifest";

/**
 * Hero "despiece controlado por scroll" — la evolución en claro del plano
 * técnico navy que cierra la página (BlueprintReveal): mismo lenguaje de
 * retícula, marco con cajetín, cotas y specs en mono, pero sobre papel gris
 * claro y con la R 1300 GS Adventure Option 719 (serie generada con IA,
 * misma cámara/luz en todas las capas) desarmándose pieza a pieza.
 *
 * Mecánica: sección track alta (~185vh) + stage sticky; un timeline GSAP con
 * scrub:true (1:1 con el scroll, sin inercia — scroll rápido = despiece
 * rápido, scroll lento = se aprecia el detalle). Cada sprite (recortado por
 * componente del frame 16:9 compartido) vuela con su propio vector radial,
 * rotación 3D y "profundidad": piezas grandes = más cercanas = más rápidas y
 * lejanas. El stage lleva perspective para que rotationX/Y/translateZ lean
 * como 3D real. La tornillería queda dispersa con blur alrededor del chasis
 * final (profundidad de campo).
 *
 * Mobile (<768px): crossfade de los frames completos, sin vuelo por pieza.
 * prefers-reduced-motion: moto completa estática, sin pin ni timeline.
 */

// RNG determinista (semilla fija): los parámetros de vuelo se calculan en
// módulo, idénticos en server y cliente — sin mismatch de hidratación.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Flight = {
  sprite: SpriteBox;
  /** desplazamiento final, en % del tamaño propio del sprite */
  dx: number;
  dy: number;
  rz: number;
  rx: number;
  ry: number;
  z: number;
  /** ventana [inicio, fin] dentro del progreso 0–1 del timeline */
  t0: number;
  t1: number;
};

function buildFlights(
  sprites: readonly SpriteBox[],
  rand: () => number,
  winStart: number,
  winEnd: number
): Flight[] {
  return sprites.map((s) => {
    // vector radial desde el centro óptico del frame hacia el centro de la
    // pieza + jitter angular, para que ninguna salga en la misma dirección
    const cx = s.x + s.w / 2 - 0.5;
    const cy = s.y + s.h / 2 - 0.52;
    const ang =
      Math.hypot(cx, cy) < 0.05 ? rand() * Math.PI * 2 : Math.atan2(cy, cx) + (rand() - 0.5) * 0.6;
    // proxy de profundidad: pieza grande = más cercana = viaja más y más rápido
    const depth = 0.7 + Math.min(1, (s.w * s.h) / 0.06) * 0.8 + rand() * 0.5;
    const dist = (140 + rand() * 180) * depth;
    const t0 = winStart + rand() * 0.06;
    const t1 = winEnd - rand() * 0.06;
    return {
      sprite: s,
      dx: Math.cos(ang) * dist,
      dy: Math.sin(ang) * dist * 0.9,
      rz: (rand() - 0.5) * 80,
      rx: (rand() - 0.5) * 55,
      ry: (rand() - 0.5) * 55,
      z: 40 + depth * 130,
      t0,
      t1: Math.max(t1, t0 + 0.12),
    };
  });
}

const rand = mulberry32(719);
// Ventanas solapadas: apenas arranca el scroll todo empieza a moverse; las
// capas se atraviesan en cascada carrocería → rodaje → motor → chasis.
const BODYWORK = buildFlights(EXPLODED.bodywork.sprites, rand, 0.05, 0.48);
const ROLLING = buildFlights(EXPLODED.rolling.sprites, rand, 0.17, 0.63);
const POWERTRAIN = buildFlights(EXPLODED.powertrain.sprites, rand, 0.33, 0.82);

// Tornillería: partículas lentas con blur fijo (profundidad de campo). Las
// "keep" quedan dispersas alrededor del chasis final; el resto sale antes.
const HW = EXPLODED.hardware.sprites.map((s, i) => {
  const drift = 30 + rand() * 50;
  const ang = rand() * Math.PI * 2;
  return {
    sprite: s,
    dx: Math.cos(ang) * drift,
    dy: Math.sin(ang) * drift - 18,
    rz: (rand() - 0.5) * 120,
    blur: i % 3 === 0 ? 2.2 : i % 3 === 1 ? 1.2 : 0.6,
    front: i % 2 === 0,
    keep: i % 5 !== 1,
    scale: 0.5 + rand() * 0.45,
  };
});

const SPECS = ["1.300 cc · Bóxer", "Option 719", "Akrapovic · Titanio", "Radios cruzados"];

const HERO_DIR = "/images/hero-exploded";

export default function ExplodedHero() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Timelines activos (uno por breakpoint): el scrub es manual — framer-motion
  // mide el progreso del track (mismo patrón probado de BlueprintReveal) y se
  // escribe 1:1 en tl.progress(). Sin inercia: scroll = posición exacta.
  const tls = useRef<gsap.core.Timeline[]>([]);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    for (const tl of tls.current) tl.progress(v);
  });

  // Altura del header sticky → --qbh, para encuadrar el stage justo debajo
  // (mismo truco que BlueprintReveal).
  useEffect(() => {
    const measure = () =>
      stageRef.current?.style.setProperty(
        "--qbh",
        `${document.querySelector("header")?.offsetHeight ?? 0}px`
      );
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useLayoutEffect(() => {
    if (reduce) return;
    const mm = gsap.matchMedia();
    const stage = stageRef.current;
    if (!stage) return;

    const q = gsap.utils.selector(stage);
    const register = (tl: gsap.core.Timeline) => {
      tl.progress(scrollYProgress.get()).pause();
      tls.current.push(tl);
      return () => {
        tls.current = tls.current.filter((t) => t !== tl);
        tl.kill();
      };
    };

    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

      // La moto completa cede rápido mientras la primera capa ya vuela
      tl.to(q("[data-hero-bike]"), { scale: 1.03, duration: 0.1 }, 0)
        .to(q("[data-hero-bike]"), { autoAlpha: 0, duration: 0.12 }, 0.07)
        // Tipografía inicial y pista de scroll
        .to(q("[data-hero-title]"), { autoAlpha: 0, y: -36, duration: 0.1, ease: "power1.in" }, 0.02)
        .to(q("[data-hero-cta]"), { autoAlpha: 0, y: 24, duration: 0.08, ease: "power1.in" }, 0.02)
        .to(q("[data-hero-hint]"), { autoAlpha: 0, duration: 0.04 }, 0);

      // Vuelo de cada pieza: nace "recogida" hacia el centro (dentro de la
      // silueta de la moto) y atraviesa su posición de collage hacia afuera,
      // acelerando — power1.in lee como pieza que se desprende.
      const flightGroups: Flight[][] = [BODYWORK, ROLLING, POWERTRAIN];
      for (const group of flightGroups) {
        for (let i = 0; i < group.length; i++) {
          const f = group[i];
          const el = q<HTMLElement>(`[data-flight="${f.sprite.file}"]`);
          const dur = f.t1 - f.t0;
          tl.fromTo(
            el,
            { xPercent: -f.dx * 0.14, yPercent: -f.dy * 0.14, scale: 0.93, rotationZ: 0, rotationX: 0, rotationY: 0, z: 0, transformPerspective: 1000 },
            {
              xPercent: f.dx,
              yPercent: f.dy,
              scale: 1 + f.z / 400,
              rotationZ: f.rz,
              rotationX: f.rx,
              rotationY: f.ry,
              z: f.z,
              duration: dur,
              ease: "power1.in",
            },
            f.t0
          )
            .to(el, { autoAlpha: 1, duration: 0.05 }, f.t0)
            .to(el, { autoAlpha: 0, duration: dur * 0.28 }, f.t1 - dur * 0.28);
        }
      }

      // Partículas de tornillería: deriva lenta durante todo el recorrido
      for (const p of HW) {
        const el = q<HTMLElement>(`[data-flight="${p.sprite.file}"]`);
        tl.to(el, { autoAlpha: 0.9, duration: 0.06 }, 0.1 + Math.abs(p.rz) / 3000)
          .to(el, { xPercent: p.dx, yPercent: p.dy, rotationZ: p.rz, duration: 0.85, ease: "none" }, 0.12);
        if (!p.keep) tl.to(el, { autoAlpha: 0, duration: 0.1 }, 0.5);
      }

      // El chasis se asienta al final; cierre tipográfico
      tl.fromTo(
        q("[data-hero-chassis]"),
        { autoAlpha: 0, scale: 1.05, y: 26 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.16, ease: "power2.out" },
        0.68
      ).fromTo(
        q("[data-hero-final]"),
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.1, ease: "power1.out" },
        0.86
      );

      return register(tl);
    });

    // Mobile: crossfade de frames completos (sin vuelo por pieza), pin corto
    mm.add("(max-width: 767px)", () => {
      const layers = ["full", "bodywork", "rolling", "powertrain", "chassis"];
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      tl.to(q("[data-hero-title]"), { autoAlpha: 0, y: -24, duration: 0.12, ease: "power1.in" }, 0.02)
        .to(q("[data-hero-cta]"), { autoAlpha: 0, duration: 0.1 }, 0.02)
        .to(q("[data-hero-hint]"), { autoAlpha: 0, duration: 0.05 }, 0);
      for (let i = 0; i < layers.length; i++) {
        const el = q<HTMLElement>(`[data-mlayer="${layers[i]}"]`);
        const at = (i / layers.length) * 0.86;
        if (i > 0) tl.fromTo(el, { autoAlpha: 0, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: 0.14 }, at);
        if (i < layers.length - 1) tl.to(el, { autoAlpha: 0, duration: 0.12 }, ((i + 1) / layers.length) * 0.86 + 0.02);
      }
      tl.fromTo(q("[data-hero-final]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.1 }, 0.88);
      return register(tl);
    });

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scrollYProgress es estable (ref del mismo hook)
  }, [reduce]);

  const sprite = (s: SpriteBox, extra?: string, blur?: number) => (
    <div
      key={s.file}
      data-flight={s.file}
      className={`invisible absolute opacity-0 will-change-transform ${extra ?? ""}`}
      style={{
        left: `${s.x * 100}%`,
        top: `${s.y * 100}%`,
        width: `${s.w * 100}%`,
        height: `${s.h * 100}%`,
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- sprite con alpha posicionado por manifest, next/image no aporta en export estático */}
      <img
        src={withBasePath(`${HERO_DIR}/${s.file}`)}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full"
      />
    </div>
  );

  return (
    <section
      ref={trackRef}
      aria-label="BMW R 1300 GS Adventure Option 719 — despiece técnico"
      // motion-reduce vive en CSS (no en JS): mismo markup en server y
      // cliente, sin mismatch de hidratación para usuarios con reduced motion
      className="relative h-[150vh] md:h-[185vh] motion-reduce:h-auto"
    >
      <div
        ref={stageRef}
        className="sticky top-[var(--qbh,76px)] flex h-[calc(100svh-var(--qbh,76px))] w-full flex-col items-center justify-center overflow-hidden bg-[#d3d8dd] motion-reduce:static motion-reduce:h-svh"
      >
        {/* Fondo liso gris (sin plano técnico): solo un degradé vertical muy
            sutil + viñeta para que la moto se despegue del fondo */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,#dde1e5_0%,#d3d8dd_45%,#c6ccd2_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(10,25,45,0.14)_100%)]"
        />

        {/* Isotipo QB en 3D — marca de la casa, arriba a la izquierda.
            Balanceo lento (qb-logo-3d) con capa trasera como extrusión. */}
        {/* hidden sm:block: en mobile el header ya muestra este mismo
            isotipo justo arriba — evitamos el doble logo apilado */}
        <div
          aria-hidden
          className="absolute top-5 left-5 z-20 hidden [perspective:600px] sm:top-8 sm:left-8 sm:block"
        >
          <div className="[animation:qb-logo-3d_9s_ease-in-out_infinite] [transform-style:preserve-3d] motion-reduce:animate-none">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca */}
            <img
              src={withBasePath("/assets/logo/quality-bikes-isotipo-qb.svg")}
              alt=""
              className="absolute inset-0 h-12 w-auto brightness-[0.45] [transform:translateZ(-5px)] sm:h-16"
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca */}
            <img
              src={withBasePath("/assets/logo/quality-bikes-isotipo-qb.svg")}
              alt="Quality Bikes"
              className="relative h-12 w-auto drop-shadow-[0_10px_18px_rgba(0,20,40,0.35)] sm:h-16"
            />
          </div>
        </div>

        {/* Escenario 16:9: todas las capas comparten este frame (misma cámara
            en toda la serie), así el crossfade queda registrado. perspective
            para que las rotaciones 3D de las piezas lean con fuga real. */}
        <div className="relative aspect-[16/9] w-[132vw] shrink-0 [perspective:1300px] md:w-[min(96vw,calc((100svh-180px)*1.7778),1600px)]">
          {/* Tipografía protagonista, detrás de la moto (estilo automotriz) */}
          <div
            data-hero-title
            className="absolute top-[2%] left-1/2 z-[1] w-screen -translate-x-1/2 px-4 text-center will-change-transform md:w-full"
          >
            <p className="text-[11px] tracking-[0.34em] text-brand-red uppercase sm:text-xs">
              Quality Bikes · Caracas
            </p>
            <h1 className="mt-2 font-display text-[clamp(2.4rem,7.2vw,6.5rem)] leading-[0.95] tracking-wide text-brand-navy uppercase">
              R 1300 GS Adventure
            </h1>
            <p className="mt-3 font-mono text-[10px] tracking-[0.3em] text-brand-navy/50 uppercase sm:text-xs">
              Option 719 · Verde esmeralda · Full equipo
            </p>
          </div>

          {/* Specs laterales (salen con el título) */}
          <div data-hero-title className="absolute top-1/2 left-0 z-[1] hidden -translate-y-1/2 space-y-3 lg:block">
            {SPECS.map((s) => (
              <p key={s} className="font-mono text-[10px] tracking-[0.22em] text-brand-navy/45 uppercase">
                {s}
              </p>
            ))}
          </div>
          <div data-hero-title className="absolute top-1/2 right-0 z-[1] hidden -translate-y-1/2 space-y-3 text-right lg:block">
            {["145 cv · 149 Nm", "89 kg menos aire", "870–890 mm asiento", "30 L tanque"].map((s) => (
              <p key={s} className="font-mono text-[10px] tracking-[0.22em] text-brand-navy/45 uppercase">
                {s}
              </p>
            ))}
          </div>

          {/* Cierre (aparece con el chasis) */}
          <div data-hero-final className="invisible absolute inset-x-[6%] bottom-[3%] z-[1] opacity-0">
            <p className="text-center font-mono text-[10px] tracking-[0.26em] text-brand-navy/55 uppercase">
              Chasis al desnudo · Todo lo demás es Quality
            </p>
            <p className="font-script mt-2 text-center text-3xl text-brand-navy sm:text-4xl">
              {siteConfig.slogan}
            </p>
          </div>

          {/* ——— capas desktop: chasis + sprites por pieza ——— */}
          {/* preserve-3d crea containing block: el wrapper debe cubrir el frame */}
          <div className="absolute inset-0 hidden [transform-style:preserve-3d] md:block">
            {/* Chasis: estado final */}
            <div
              data-hero-chassis
              className="invisible absolute z-[2] opacity-0 will-change-transform"
              style={{
                left: `${EXPLODED.chassis.sprites[0].x * 100}%`,
                top: `${EXPLODED.chassis.sprites[0].y * 100}%`,
                width: `${EXPLODED.chassis.sprites[0].w * 100}%`,
                height: `${EXPLODED.chassis.sprites[0].h * 100}%`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- ídem sprites */}
              <img
                src={withBasePath(`${HERO_DIR}/sprites/${"chassis-p1.webp"}`)}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full"
              />
              <div aria-hidden className="absolute -bottom-[6%] left-1/2 h-4 w-2/3 -translate-x-1/2 rounded-[50%] bg-brand-navy/25 blur-lg" />
            </div>

            {/* Tornillería trasera (z entre chasis y capas) */}
            <div className="absolute inset-0 z-[3]">
              {HW.filter((p) => !p.front).map((p) =>
                sprite({ ...p.sprite, w: p.sprite.w * p.scale, h: p.sprite.h * p.scale }, "", p.blur)
              )}
            </div>

            <div className="absolute inset-0 z-[4]">{POWERTRAIN.map((f) => sprite(f.sprite))}</div>
            <div className="absolute inset-0 z-[5]">{ROLLING.map((f) => sprite(f.sprite))}</div>
            <div className="absolute inset-0 z-[6]">{BODYWORK.map((f) => sprite(f.sprite))}</div>

            {/* Tornillería delantera, más blur = más cerca de cámara */}
            <div className="absolute inset-0 z-[8]">
              {HW.filter((p) => p.front).map((p) =>
                sprite({ ...p.sprite, w: p.sprite.w * p.scale, h: p.sprite.h * p.scale }, "", p.blur)
              )}
            </div>
          </div>

          {/* Moto completa: el único asset eager (LCP). Visible también como
              estado estático bajo prefers-reduced-motion y primer frame mobile */}
          <div data-hero-bike data-mlayer="full" className="absolute inset-0 z-[7] will-change-transform">
            <Image
              src={withBasePath(`${HERO_DIR}/layer-full.webp`)}
              alt="BMW R 1300 GS Adventure Option 719 verde esmeralda con escape Akrapovic, vista lateral"
              fill
              preload
              sizes="(max-width: 767px) 132vw, 1600px"
              className="object-contain"
            />
            <div aria-hidden className="absolute bottom-[2%] left-1/2 h-5 w-3/5 -translate-x-1/2 rounded-[50%] bg-brand-navy/25 blur-xl" />
          </div>

          {/* ——— capas mobile: crossfade de frames completos ——— */}
          <div className="md:hidden motion-reduce:hidden">
              {(["bodywork", "rolling", "powertrain", "chassis"] as const).map((l) => (
                <div key={l} data-mlayer={l} className="invisible absolute inset-0 z-[7] opacity-0 will-change-transform">
                  {/* eslint-disable-next-line @next/next/no-img-element -- frame completo con alpha */}
                  <img
                    src={withBasePath(`${HERO_DIR}/layer-${l}.webp`)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Slogan de la casa, protagonista abajo a la izquierda (sale con el
            título al arrancar el scroll) */}
        <p
          data-hero-title
          className="absolute bottom-24 left-5 z-30 max-w-[80vw] font-script text-3xl leading-tight text-brand-navy drop-shadow-[0_1px_0_rgba(255,255,255,0.5)] sm:bottom-14 sm:left-10 sm:text-5xl"
        >
          {siteConfig.slogan}
        </p>

        {/* Pista de scroll, pequeña, justo debajo del slogan */}
        <p
          data-hero-hint
          className="absolute bottom-6 left-6 z-30 font-mono text-[10px] tracking-[0.3em] text-brand-navy/50 uppercase sm:left-11 motion-reduce:hidden"
        >
          ↓ Scroll para despiezar
        </p>

        {/* CTA (encima de todo, clickeable) */}
        <div data-hero-cta className="absolute bottom-14 z-30 sm:bottom-16">
          <Magnetic className="inline-block">
            <OpenCatalogButton className="inline-block rounded-full bg-brand-navy px-9 py-3.5 text-xs tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft sm:px-10 sm:py-4 sm:text-sm">
              Ver catálogo
            </OpenCatalogButton>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
