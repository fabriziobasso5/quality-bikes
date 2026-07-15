"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";
import { SPOKES, TILES, centroid, polyToClip } from "./exploded-tiles";
import QbMark from "./QbMark";

/**
 * Hero "la moto se desviste en el lugar": la R 1300 GS Adventure NO se mueve
 * — el chasis es el ancla absoluta, en el mismo píxel del primer al último
 * frame. Con el scroll (scrub 1:1, sin inercia), las piezas se desprenden en
 * orden exterior→interior y salen volando hacia los cuatro costados con
 * física por peso; al final queda el chasis desnudo exactamente donde
 * siempre estuvo.
 *
 * Arquitectura de capas (alineación pixel-perfect por construcción):
 *  - chassis.webp (abajo, estático): edición encadenada del master,
 *    registrada por overlay.
 *  - "remainder": el MISMO bike.webp con una máscara SVG que oculta las
 *    regiones de todas las piezas — lo que queda visible de la moto original
 *    son sus píxeles de chasis, que calzan con la capa de abajo.
 *  - tiles: regiones clip-path del MISMO bike.webp — cada pieza vuela con
 *    los píxeles exactos de la moto, sin sprites regenerados ni "pops".
 *  - rayos de rin sueltos (spoke.webp) que estallan al volar cada caucho.
 *
 * Un solo timeline % / vw / vh: la misma mecánica sirve en desktop y mobile.
 * prefers-reduced-motion: moto completa estática, sin pin ni vuelo.
 */

const HERO_DIR = "/images/hero-exploded";
const BIKE_ALT =
  "BMW R 1300 GS Adventure Option 719 verde esmeralda con escape Akrapovic, vista lateral";

export default function ExplodedHero() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Scrub manual 1:1 (patrón probado del sitio): framer mide el progreso del
  // track y lo escribe en el timeline pausado — sin inercia.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Promoción perezosa a capas GPU: recién al primer scroll (hacerlo desde
    // SSR con will-change disparaba una tormenta de composición en la
    // hidratación que retrasaba el registro del LCP en móvil).
    stageRef.current?.style.setProperty("--qb-wc", "transform");
    tlRef.current?.progress(v);
  });

  // Altura del header sticky → --qbh, para pegar el stage justo debajo.
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
    const stage = stageRef.current;
    if (!stage) return;
    const q = gsap.utils.selector(stage);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.in" } });

      // El chasis se enciende al primer soplo de scroll (antes de que vuele
      // la primera pieza).
      tl.set(q("[data-hero-chassis]"), { autoAlpha: 1 }, 0.008)
        .to(q("[data-hero-hint]"), { autoAlpha: 0, duration: 0.04, ease: "none" }, 0);

      // Cada pieza: un solo tween acelerando (power2.in = se desprende y se
      // va). La moto/chasis NUNCA se tocan — solo vuelan los tiles.
      for (const tile of TILES) {
        const [ox, oy] = centroid(tile.poly);
        tl.to(
          q(`[data-tile="${tile.id}"]`),
          {
            x: `${tile.vx}vw`,
            y: `${tile.vy}vh`,
            rotation: tile.rot,
            transformOrigin: `${ox}% ${oy}%`,
            duration: tile.t[1] - tile.t[0],
          },
          tile.t[0]
        );
      }

      // Rayos: aparecen en el centro del rin y estallan radialmente
      SPOKES.forEach((s, i) => {
        const el = q(`[data-spoke="${i}"]`);
        tl.to(el, { autoAlpha: 1, duration: 0.015, ease: "none" }, s.t0).to(
          el,
          { x: `${s.vx}vw`, y: `${s.vy}vh`, rotation: s.rot, duration: 0.17 },
          s.t0 + 0.005
        );
      });

      tl.progress(scrollYProgress.get());
      tlRef.current = tl;
    }, stage);

    return () => {
      tlRef.current = null;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scrollYProgress es estable
  }, [reduce]);

  const bikeSrc = withBasePath(`${HERO_DIR}/bike.webp`);
  const bikeSmSrc = withBasePath(`${HERO_DIR}/bike-sm.webp`);
  const bikeSrcSet = `${bikeSmSrc} 1200w, ${bikeSrc} 1800w`;
  const bikeSizes = "(max-width: 767px) 94vw, 96vw";

  return (
    <>
      {/* React 19 lo iza al <head>: la moto se pide desde el HTML (LCP),
          con el mismo srcset que usan los tiles para no duplicar descargas */}
      <link
        rel="preload"
        as="image"
        imageSrcSet={bikeSrcSet}
        imageSizes={bikeSizes}
        fetchPriority="high"
      />
    <section
      ref={trackRef}
      aria-label="BMW R 1300 GS Adventure Option 719 — la moto se desviste hasta el chasis"
      // El fondo oscuro también en el track: si el pin deja ver un borde,
      // que sea del mismo tono (nada de franjas blancas bajo el header)
      className="relative h-[150vh] bg-[#24292f] md:h-[185vh] motion-reduce:h-auto"
    >
      <div
        ref={stageRef}
        // -1px de solape con el header: elimina la línea clara que dejaba el
        // redondeo subpixel entre el borde del header y el stage
        className="sticky top-[calc(var(--qbh,76px)-1px)] flex h-[calc(100svh-var(--qbh,76px)+1px)] w-full flex-col items-center justify-center overflow-hidden bg-[#31373d] motion-reduce:static motion-reduce:h-svh"
      >
        {/* Estudio oscuro: degradé vertical + viñeta, la moto al frente */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,#3f464d_0%,#31373d_45%,#1d2126_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_46%,rgba(3,7,14,0.42)_100%)]"
        />

        {/* Marca fina arriba: identidad, sin competir con la moto. Siempre
            visible (ya no se desvanece con el scroll) y pegada al borde
            superior del stage para no chocar nunca con el parabrisas/visera,
            que es la parte más alta de la moto en todo el recorrido. */}
        <p
          className="absolute top-2 left-1/2 z-30 w-max max-w-[94vw] -translate-x-1/2 text-center font-light tracking-[0.42em] text-brand-red uppercase text-xs sm:top-4 sm:text-base"
        >
          Quality Bikes Venezuela • Caracas
        </p>

        {/* Isotipo QB vectorial, lado derecho, con draw-in + shimmer */}
        <div className="absolute top-[9%] right-4 z-30 sm:top-[11%] sm:right-8">
          <QbMark className="h-16 w-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)] sm:h-24" />
        </div>

        {/* Marcas representadas a los lados: siempre visibles, sin animación
            (antes tenían data-hero-title y se desvanecían con el título) */}
        <div className="absolute top-1/2 left-6 z-[1] hidden -translate-y-1/2 space-y-3.5 lg:block">
          {siteConfig.brandsRepresented.slice(0, 4).map((s) => (
            <p key={s} className="font-mono text-sm tracking-[0.22em] text-white/70 uppercase">
              {s}
            </p>
          ))}
        </div>
        <div className="absolute top-1/2 right-6 z-[1] hidden -translate-y-1/2 space-y-3.5 text-right lg:block">
          {siteConfig.brandsRepresented.slice(4, 8).map((s) => (
            <p key={s} className="font-mono text-sm tracking-[0.22em] text-white/70 uppercase">
              {s}
            </p>
          ))}
        </div>

        {/* ——— Escenario 16:9: todas las capas comparten este frame ——— */}
        <div className="relative aspect-[16/9] w-[94vw] shrink-0 md:w-[min(96vw,calc((100svh-180px)*1.7778),1600px)]">
          {/* Capa base semántica y candidata LCP: la moto completa visible
              desde el primer paint (los tiles encima muestran exactamente los
              mismos píxeles). Es la imagen con alt del hero. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- capa base del frame */}
          <img
            src={bikeSrc}
            srcSet={bikeSrcSet}
            sizes={bikeSizes}
            alt={BIKE_ALT}
            fetchPriority="high"
            className="pointer-events-none absolute inset-0 h-full w-full"
          />

          {/* Capa 0 — chasis desnudo: el ancla. NUNCA se transforma. Nace con
              opacity 0 (está 100% tapado por los tiles, y así Chrome no lo
              registra como LCP) y el timeline lo enciende al primer soplo de
              scroll, antes de que se desprenda la primera pieza. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- capa registrada del frame */}
          <img
            data-hero-chassis
            src={withBasePath(`${HERO_DIR}/chassis.webp`)}
            alt=""
            decoding="async"
            className="absolute inset-0 h-full w-full opacity-0"
          />

          {/* Capa 1 — remainder: bike.webp con las regiones de TODAS las
              piezas enmascaradas; lo que se ve son sus píxeles de chasis,
              coincidentes con la capa 0. Estático. */}
          <svg
            data-hero-chassis
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            // opacity 0 inicial (está tapado por los tiles): fuera del LCP,
            // el timeline lo enciende junto al chasis al primer scroll
            className="absolute inset-0 h-full w-full opacity-0"
            aria-hidden
          >
            <defs>
              <mask id="qb-strip-mask">
                <rect x="0" y="0" width="100" height="100" fill="#fff" />
                {TILES.map((t) => (
                  <polygon key={t.id} points={t.poly.map(([x, y]) => `${x},${y}`).join(" ")} fill="#000" />
                ))}
              </mask>
            </defs>
            {/* la variante liviana basta: solo se ven astillas de chasis */}
            <image
              href={bikeSmSrc}
              x="0"
              y="0"
              width="100"
              height="100"
              preserveAspectRatio="none"
              mask="url(#qb-strip-mask)"
            />
          </svg>

          {/* Capas 2..n — tiles: regiones clip-path del mismo bike.webp.
              El navegador descarga/decodifica UNA sola imagen. */}
          {TILES.map((t) => (
            <div
              key={t.id}
              data-tile={t.id}
              className="absolute inset-0 [will-change:var(--qb-wc,auto)]"
              style={{ clipPath: polyToClip(t.poly) }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- misma imagen compartida entre tiles */}
              <img
                src={bikeSrc}
                srcSet={bikeSrcSet}
                sizes={bikeSizes}
                alt=""
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ))}


          {/* Rayos de rin sueltos: invisibles hasta que vuela su caucho */}
          {SPOKES.map((s, i) => (
            <div
              key={i}
              data-spoke={i}
              className="invisible absolute opacity-0 will-change-transform"
              style={{
                left: `${s.cx - 1.2}%`,
                top: `${s.cy - s.h / 2}%`,
                width: "2.4%",
                height: `${s.h}%`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- partícula */}
              <img
                src={withBasePath(`${HERO_DIR}/spoke.webp`)}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </div>
          ))}

          {/* Sombra de piso sutil bajo la moto, estática */}
          <div
            aria-hidden
            className="absolute bottom-[2%] left-1/2 h-5 w-3/5 -translate-x-1/2 rounded-[50%] bg-black/45 blur-xl"
          />
        </div>

        {/* Cierre: eslogan fijo bajo el chasis, siempre visible y centrado,
            sin animación. Flex item normal (no absolute) para que quede en
            flujo justo debajo de la moto — nunca se solapa con las ruedas ni,
            en móvil, con los botones flotantes de Instagram/WhatsApp, que
            viven fuera de este stage. whitespace-nowrap + clamp() evita que
            la frase corte a una segunda línea en cualquier viewport. */}
        <p
          className="font-script z-20 mt-3 max-w-[92vw] px-4 text-center whitespace-nowrap text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:mt-5"
          style={{ fontSize: "clamp(1.2rem, 5.5vw, 2.25rem)" }}
        >
          {siteConfig.slogan}
        </p>

        <p
          data-hero-hint
          className="absolute bottom-6 left-6 z-30 font-mono text-[10px] tracking-[0.3em] text-white/55 uppercase sm:left-11 motion-reduce:hidden"
        >
          ↓ Scroll para despiezar
        </p>
      </div>
    </section>
    </>
  );
}
