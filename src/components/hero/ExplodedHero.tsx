"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { withBasePath } from "@/lib/base-path";
import { PHASES, SPRITES, spriteBox } from "./hero7-choreo";
import QbMark from "./QbMark";

/**
 * Hero "despiece en 6 fases": la R 1300 GS Adventure se desarma con el
 * scroll pasando por 6 fotografías reales del desmontaje (completa → sin
 * carrocería → tanque desnudo → sin manubrio → sin tren de rodaje → motor
 * y chasis pelados, el final). Las fotos están registradas al píxel con el
 * chasis como ancla absoluta: entre fase y fase NADA se mueve, solo se
 * desprenden las piezas que faltan en la siguiente foto, como sprites
 * generados desde las mismas fotos que salen volando con sutileza.
 *
 * Scrub 1:1 (GSAP timeline pausado + tl.progress del useScroll de framer,
 * sin inercia): scroll lento permite detallar cada pieza; scroll rápido da
 * un despiece corrido. La identidad de la casa (título, eslogan, isotipo,
 * marcas) vive en la portada (BlueprintReveal): esta sección es la
 * animación pura, como cierre visual de la página.
 *
 * prefers-reduced-motion: moto completa estática, sin pin ni vuelo.
 */

const HERO_DIR = "/images/hero7";
const BIKE_ALT =
  "BMW R 1300 GS Adventure verde esmeralda con escape Akrapovic despiezándose hasta el chasis con el motor, vista lateral";

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

      tl.to(q("[data-hero-hint]"), { autoAlpha: 0, duration: 0.04, ease: "none" }, 0);

      // Fundido cruzado "punto medio" (elección del cliente) entre fases —
      // EXCEPTO fase 1→2: esas dos fotos son de dos sesiones distintas (la
      // "beauty shot" completa vs. la sesión real del despiece) y no
      // registran al píxel entre sí — cualquier fundido con ambas visibles
      // a la vez expone el salto de tamaño de ruedas/chasis. Se resuelve
      // con un corte CASI instantáneo, cronometrado a mitad del vuelo de
      // las 5 piezas (0.11-0.13, cuando ya están lejos de su posición
      // original): la atención está en las piezas volando, no en el fondo.
      for (const p of PHASES) {
        const isSessionSwap = p.n === 1;
        const swapAt = isSessionSwap ? 0.12 : p.fadeAt;
        tl.fromTo(
          q(`[data-phase="${p.n + 1}"]`),
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: isSessionSwap ? 0.015 : 0.05,
            ease: isSessionSwap ? "none" : "power1.out",
          },
          Math.max(swapAt - (isSessionSwap ? 0.008 : 0.02), 0)
        ).to(
          q(`[data-phase="${p.n}"]`),
          {
            autoAlpha: 0,
            duration: isSessionSwap ? 0.015 : 0.07,
            ease: isSessionSwap ? "none" : "power1.inOut",
          },
          Math.max(swapAt - (isSessionSwap ? 0.008 : 0.01), 0)
        );
      }

      // Sprites: aparecen sobre su pieza al abrirse su ventana y salen
      // acelerando (power2.in = desprendimiento), disolviéndose al final
      // del vuelo para no ensuciar la fase siguiente.
      for (const s of SPRITES) {
        const el = q(`[data-sprite="${s.id}"]`);
        const dur = s.t[1] - s.t[0];
        tl.set(el, { autoAlpha: 1 }, s.t[0])
          .to(
            el,
            { x: `${s.vx}vw`, y: `${s.vy}vh`, rotation: s.rot, duration: dur },
            s.t[0] + 0.004
          )
          .to(
            el,
            { autoAlpha: 0, duration: dur * 0.35, ease: "power1.in" },
            s.t[1] - dur * 0.35
          );
      }

      // La sombra de piso se encoge a medida que la moto pierde masa.
      tl.to(
        q("[data-hero-shadow]"),
        { scaleX: 0.55, opacity: 0.5, duration: 0.9, ease: "none" },
        0.05
      );

      // A mitad del desarme el estudio "apaga las luces": el gris showroom
      // cae de golpe a un azul noche profundo con un cenital frío sobre el
      // chasis. Solo cambia el fondo — la coreografía de piezas no se toca.
      tl.to(
        q("[data-hero-bg-dark]"),
        { autoAlpha: 1, duration: 0.16, ease: "power2.inOut" },
        0.4
      );

      tl.progress(scrollYProgress.get());
      tlRef.current = tl;
    }, stage);

    return () => {
      tlRef.current = null;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scrollYProgress es estable
  }, [reduce]);

  const phaseSrc = (n: number) => withBasePath(`${HERO_DIR}/phase-${n}.webp`);
  const phaseSmSrc = (n: number) => withBasePath(`${HERO_DIR}/phase-${n}-sm.webp`);
  const phaseSrcSet = (n: number) => `${phaseSmSrc(n)} 1200w, ${phaseSrc(n)} 2400w`;
  const phaseSizes = "(max-width: 767px) 94vw, 92vw";

  return (
    <>
      <section
        ref={trackRef}
        aria-label="BMW R 1300 GS Adventure — despiece en 6 fases hasta el chasis con el motor"
        // El fondo oscuro también en el track: si el pin deja ver un borde,
        // que sea del mismo tono (nada de franjas blancas bajo el header)
        // El timeline ahora termina en ~0.87 (última pieza de T5): el track
        // se recorta en proporción para no dejar scroll muerto al final.
        className="relative h-[129vh] bg-[#1b1f24] md:h-[147vh] motion-reduce:h-auto"
      >
        <div
          ref={stageRef}
          // -1px de solape con el header: elimina la línea clara que dejaba el
          // redondeo subpixel entre el borde del header y el stage
          className="sticky top-[calc(var(--qbh,76px)-1px)] flex h-[calc(100svh-var(--qbh,76px)+1px)] w-full flex-col items-center justify-center overflow-hidden bg-[#262b31] motion-reduce:static motion-reduce:h-svh"
        >
          {/* Estudio oscuro: degradé vertical + viñeta, la moto al frente */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,#33393f_0%,#262b31_45%,#141619_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_46%,rgba(3,7,14,0.42)_100%)]"
          />
          {/* Estudio nocturno: overlay que el timeline enciende de golpe a
              mitad del desarme (data-hero-bg-dark) — azul noche + cenital
              frío sobre el chasis */}
          <div
            data-hero-bg-dark
            aria-hidden
            className="invisible absolute inset-0 opacity-0 bg-[radial-gradient(ellipse_58%_44%_at_50%_40%,rgba(80,120,170,0.16),transparent_72%),linear-gradient(180deg,#16222e_0%,#0d1722_55%,#070d14_100%)]"
          />

          {/* Isotipo QB vectorial (draw-in + shimmer), pegado a la esquina
              superior derecha del fondo gris del estudio */}
          <div className="absolute top-3 right-4 z-30 sm:top-5 sm:right-8">
            <QbMark className="h-16 w-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)] sm:h-24" />
          </div>

          {/* ——— Escenario: las fases comparten este frame, registradas ——— */}
          {/* Sin título ni eslogan en esta sección (viven en la portada): la
              moto se centra plena en el stage */}
          <div className="relative aspect-[15333/10000] w-[94vw] shrink-0 md:w-[min(92vw,calc((100svh-140px)*1.5333),1500px)]">
            {/* Sombra de piso sutil bajo la moto */}
            <div
              data-hero-shadow
              aria-hidden
              className="absolute bottom-[1%] left-1/2 h-5 w-3/5 -translate-x-1/2 rounded-[50%] bg-black/45 blur-xl"
            />

            {/* Fases 6→2, de abajo hacia arriba: cada una muestra exactamente
                lo que queda cuando la de encima se funde. El chasis con el
                motor (6) es el fondo permanente — el final del despiece. */}
            {[6, 5, 4, 3, 2].map((n) => (
              /* eslint-disable-next-line @next/next/no-img-element -- capas registradas del despiece */
              <img
                key={n}
                data-phase={n}
                src={phaseSrc(n)}
                srcSet={phaseSrcSet(n)}
                sizes={phaseSizes}
                alt=""
                decoding="async"
                fetchPriority="low"
                className="pointer-events-none invisible absolute inset-0 h-full w-full opacity-0 motion-reduce:hidden [will-change:var(--qb-wc,auto)]"
              />
            ))}

            {/* Fase 1 — la moto completa: capa semántica y candidata LCP */}
            {/* eslint-disable-next-line @next/next/no-img-element -- LCP del hero */}
            <img
              data-phase={1}
              src={phaseSrc(1)}
              srcSet={phaseSrcSet(1)}
              sizes={phaseSizes}
              alt={BIKE_ALT}
              loading="lazy"
              decoding="async"
              // Registro con la fase 2: la foto 1 (beauty shot) viene ~1.6%
              // más grande que la sesión de despiece (2-7). Corrección
              // re-optimizada por búsqueda de rejilla en dos etapas sobre
              // TRES zonas estáticas — tapa del tanque, rueda trasera y
              // delantera (scripts/regen-hero-sprites.py) — para que el
              // tanque no salte de tamaño/altura entre fase 1 y 2. Los
              // sprites T1 se recortaron con esta MISMA corrección.
              style={{ transform: "translate(-0.1%, 0.2%) scale(0.984)" }}
              className="pointer-events-none absolute inset-0 h-full w-full [will-change:var(--qb-wc,auto)]"
            />

            {/* Sprites: cada pieza real, invisible hasta que le toca volar */}
            {SPRITES.map((s) => (
              <div
                key={s.id}
                data-sprite={s.id}
                className="invisible absolute z-10 opacity-0 [will-change:var(--qb-wc,auto)]"
                style={spriteBox(s)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- pieza del despiece */}
                <img
                  src={withBasePath(`${HERO_DIR}/sprites/${s.id}.webp`)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </div>
            ))}

          </div>

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
