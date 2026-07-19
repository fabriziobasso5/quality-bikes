"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { MOTO_SILHOUETTE_PATH, MOTO_SILHOUETTE_VIEWBOX } from "./logo3d/moto-silhouette-path";
import { siteConfig } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

/**
 * PORTADA "del plano al asfalto": sección pinned (120–135vh de recorrido)
 * sobre fondo navy de plano técnico. La silueta se dibuja SOLA al cargar
 * (animación CSS por tiempo, ~2.2s: clases qb-sil-draw / qb-sil-fill /
 * qb-late-fade en globals.css) y queda fija como lámina. Con el scroll:
 * (1) el wireframe se desvanece mientras la R 1250 GS Adventure Triple
 * Black real "se materializa" registrada sobre la silueta y el fondo cae a
 * un anochecer; (2) se encienden las luces ámbar proyectando el haz hacia
 * la derecha; (3) cierra el eslogan.
 *
 * El progreso vive en la variable CSS --bp (0→1): una suscripción a
 * scrollYProgress alimenta un lerp por rAF (mismo truco que
 * lib/use-smooth-value.ts — framer-motion 12.x pierde bindings de opacity y
 * useSpring bajo React 19) y cada capa deriva opacidad/transform con
 * clamp()/calc() en CSS puro. Bajo prefers-reduced-motion se fija --bp:1:
 * composición final estática, sin pin.
 *
 * Como portada, lleva la identidad de la casa: título rojo protagonista
 * (mismo tratamiento que tenía el hero del despiece: 1.05× el ancho de la
 * moto, medido ancho de texto = 32.7 × font-size con tracking 0.4em),
 * marcas representadas a los lados y el eslogan bajo la moto. (El isotipo
 * QB vive en el despiece del cierre; cajetín y specs de la moto se
 * eliminaron a pedido.)
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

// Umbral de --bp donde "gira la llave": coincide con la entrada de las
// luces (ramp 0.48–0.64). Cruzarlo hacia arriba dispara el parpadeo.
const IGNITE_AT = 0.5;

export default function BlueprintReveal() {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<HTMLDivElement>(null);
  const ignited = useRef(false);
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
    const prev = current.current;
    const next = prev + (t - prev) * SMOOTH;
    const done = Math.abs(t - next) < 0.0008;
    current.current = done ? t : next;
    stageRef.current?.style.setProperty("--bp", current.current.toFixed(4));
    // qb-lit habilita el pointer-events del CTA solo cuando ya es visible
    stageRef.current?.classList.toggle("qb-lit", current.current >= 0.58);
    // Chispazo de encendido: al cruzar el umbral de las luces hacia arriba,
    // (re)dispara el parpadeo; se rearma solo si el scroll baja del todo.
    if (!ignited.current && prev < IGNITE_AT && current.current >= IGNITE_AT) {
      ignited.current = true;
      const el = lightsRef.current;
      if (el) {
        el.classList.remove("qb-ignite");
        void el.offsetWidth; // reinicia la animación si ya corrió antes
        el.classList.add("qb-ignite");
      }
    } else if (ignited.current && current.current < 0.4) {
      ignited.current = false;
    }
    raf.current = done ? null : requestAnimationFrame(step);
  }

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    target.current = v;
    if (raf.current == null) raf.current = requestAnimationFrame(step);
  });

  // Estado inicial correcto al montar a mitad de página (deep-link, reload),
  // medición del header sticky (para encuadrar la lámina justo debajo) y
  // limpieza del rAF pendiente al desmontar.
  useEffect(() => {
    const v = reduce ? 1 : scrollYProgress.get();
    target.current = v;
    current.current = v;
    stageRef.current?.style.setProperty("--bp", String(v));
    stageRef.current?.classList.toggle("qb-lit", v >= 0.58);
    const measure = () =>
      stageRef.current?.style.setProperty(
        "--qbh",
        `${document.querySelector("header")?.offsetHeight ?? 0}px`
      );
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      if (raf.current != null) cancelAnimationFrame(raf.current);
    };
  }, [reduce, scrollYProgress]);

  // Parallax sutil con el cursor (solo desktop con puntero fino, nunca bajo
  // reduced motion): lerp propio por rAF que escribe --par-x/--par-y (−1…1)
  // en el stage; la moto y el título derivan su translate en CSS puro.
  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const tgt = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let id: number | null = null;
    function tick() {
      cur.x += (tgt.x - cur.x) * 0.08;
      cur.y += (tgt.y - cur.y) * 0.08;
      const settled =
        Math.abs(tgt.x - cur.x) < 0.002 && Math.abs(tgt.y - cur.y) < 0.002;
      if (settled) {
        cur.x = tgt.x;
        cur.y = tgt.y;
      }
      stageRef.current?.style.setProperty("--par-x", cur.x.toFixed(3));
      stageRef.current?.style.setProperty("--par-y", cur.y.toFixed(3));
      id = settled ? null : requestAnimationFrame(tick);
    }
    const onMove = (e: MouseEvent) => {
      tgt.x = (e.clientX / window.innerWidth) * 2 - 1;
      tgt.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (id == null) id = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (id != null) cancelAnimationFrame(id);
    };
  }, [reduce]);

  return (
    <section
      ref={trackRef}
      // motion-reduce en CSS y no en JS: el markup del server no depende del
      // media query del cliente (evita mismatch de hidratación)
      className="relative h-[120vh] sm:h-[135vh] motion-reduce:h-auto"
    >
      <div
        ref={stageRef}
        // --bpw: ancho del escenario de la moto, LA variable maestra de la
        // composición — de ella derivan el font-size del título (×1.05/R) y
        // el padding-top del stage (alto real del título + colchón). R =
        // ratio medido ancho-texto/font-size del título en Montserrat con
        // tracking 0.4em. El término en svh sale de resolver el presupuesto
        // vertical: pt + alto caja − solape eslogan + eslogan = stage.
        style={
          {
            "--bp": 0,
            "--bpw": "min(88vw, calc(100svh * 1.3247 - 273px), 820px)",
          } as React.CSSProperties
        }
        /* Fija bajo el header sticky (altura medida en --qbh): al engancharse
           el pin, la lámina completa — rótulo arriba, cajetín abajo — queda
           contenida en el viewport en todos los breakpoints */
        // Móvil: conjunto centrado con un pt suave. En sm+: contenido anclado
        // arriba (justify-start) con un pt que sigue el alto real del título
        // (que crece con el viewport) — así la moto puede crecer FULL hacia
        // abajo, hacia el eslogan, sin tocar nunca el título.
        className="sticky top-[var(--qbh,76px)] flex h-[calc(100svh-var(--qbh,76px))] w-full flex-col items-center justify-center overflow-hidden bg-brand-navy pt-[6vh] motion-reduce:static motion-reduce:h-svh sm:justify-start sm:pt-[calc(40px+var(--bpw)*0.0475)]"
      >
        {/* Anochecer: entra con la moto — cielo que cae a negro azulado y un
            resplandor cálido de horizonte hacia donde apunta el faro */}
        <div
          aria-hidden
          style={{ opacity: ramp(0.18, 0.42) }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_55%_20%_at_72%_74%,rgba(255,170,80,0.16),transparent_70%),linear-gradient(180deg,#04101f_0%,#0a1d33_55%,#16304b_78%,#0a1626_100%)]"
        />
        {/* Retícula de plano técnico: línea menor cada 24px, mayor cada 120px.
            Cede casi por completo cuando la moto toma la escena. */}
        <div
          aria-hidden
          style={{ opacity: `calc(1 - ${ramp(0.22, 0.55)} * 0.75)` }}
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[size:24px_24px,24px_24px,120px_120px,120px_120px]"
        />
        {/* Viñeta para que el centro respire y las esquinas caigan */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,10,25,0.6)_100%)]"
        />

        {/* Marco del plano, siempre visible (el cajetín se eliminó a pedido) */}
        <div aria-hidden className="absolute inset-4 border border-white/15 sm:inset-6" />

        {/* Marca protagonista en Montserrat (equivalente licencia-limpia de
            "Moderne Sans"): font-size = --bpw × 1.05 / R ⇒ la línea mide
            siempre un pelo más que la moto, y el pt del stage (derivado del
            mismo --bpw) garantiza que nunca la toque. */}
        <p
          className="font-title-sans absolute top-6 left-1/2 z-30 w-max text-center font-normal tracking-[0.4em] whitespace-nowrap uppercase sm:top-8"
          style={{
            // 1.05 / R, con R = 32.48 medido (Montserrat, tracking 0.4em)
            fontSize: "calc(var(--bpw) * 0.0323)",
            color: "#ff2230",
            textShadow: "0 0 24px rgba(255,34,48,0.4), 0 2px 14px rgba(0,0,0,0.5)",
            // -50% del centrado + contraparte suave del parallax de la moto
            transform:
              "translate(calc(-50% - var(--par-x, 0) * 4px), calc(var(--par-y, 0) * -3px))",
          }}
        >
          Quality Bikes Venezuela • Caracas
        </p>

        {/* Marcas representadas a los lados: siempre visibles, como en la
            portada anterior */}
        <div className="absolute top-1/2 left-6 z-[1] hidden -translate-y-1/2 space-y-3.5 lg:block">
          {siteConfig.brandsRepresented.slice(0, 4).map((s) => (
            <p key={s} className="font-mono text-sm tracking-[0.22em] text-white/70 uppercase">
              {s}
            </p>
          ))}
        </div>
        <div className="absolute top-1/2 right-6 z-[1] hidden -translate-y-1/2 text-right lg:block">
          <div className="space-y-3.5">
            {siteConfig.brandsRepresented.slice(4, 8).map((s) => (
              <p key={s} className="font-mono text-sm tracking-[0.22em] text-white/70 uppercase">
                {s}
              </p>
            ))}
          </div>
          {/* Duplicado "alcanzado por el haz": la columna derecha queda dentro
              del cono del faro, así que se enciende (ámbar cálido + glow) al
              mismo ritmo que las luces. Solo estético: aria-hidden. */}
          <div
            aria-hidden
            style={{ opacity: ramp(0.48, 0.64) }}
            className="absolute inset-0 space-y-3.5"
          >
            {siteConfig.brandsRepresented.slice(4, 8).map((s) => (
              <p
                key={s}
                className="font-mono text-sm tracking-[0.22em] text-amber-100 uppercase [text-shadow:0_0_14px_rgba(255,190,120,0.45)]"
              >
                {s}
              </p>
            ))}
          </div>
        </div>

        {/* Escenario central: silueta y moto real comparten la misma caja para
            que el crossfade quede registrado en el mismo punto. El término de
            altura ocupa TODO el aire disponible entre el título y el eslogan
            (presupuesto: pt del stage + cota bajo la caja + eslogan). */}
        <div
          className="relative aspect-[827/585] w-[var(--bpw)]"
          // Parallax: la moto (y sus luces) flotan 1–2% siguiendo el cursor
          style={{
            transform:
              "translate3d(calc(var(--par-x, 0) * 9px), calc(var(--par-y, 0) * 6px), 0)",
          }}
        >
          {/* Wireframe del isotipo: se dibuja SOLO al cargar (qb-sil-draw,
              ~2.2s por tiempo) y cede con el scroll en 0.18–0.32, la misma
              ventana en la que aparece la moto */}
          <svg
            viewBox={MOTO_SILHOUETTE_VIEWBOX}
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            /* translate/scale: registra la silueta sobre la carrocería de la
               GS medida en overlay — así el crossfade solapa en el mismo punto */
            style={{ opacity: fade(0.18, 0.32), transform: "translate(-1.5%, 4.5%) scale(0.96)" }}
          >
            <path
              d={MOTO_SILHOUETTE_PATH}
              fill="#ffffff"
              className="qb-sil-fill"
              style={{ fillOpacity: 0.07 }}
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
              className="qb-sil-draw"
            />
          </svg>

          {/* Cotas de plano (datos reales del GS Adventure): entran solas al
              final del dibujo (qb-late-fade) y mueren cuando llega la moto */}
          <div
            aria-hidden
            style={{ opacity: fade(0.16, 0.28) }}
            className="qb-late-fade absolute inset-0"
          >
            {/* Cota DENTRO del escenario (franja libre bajo la silueta, cuyas
                ruedas llegan al ~90% de alto): así no roba ni un píxel de
                altura a la moto ni pisa el eslogan que ahora solapa el borde
                inferior de la caja */}
            <div className="absolute bottom-8 left-[4%] right-[4%] border-t border-white/40" />
            <div className="absolute bottom-6 left-[4%] h-2 border-l border-white/40" />
            <div className="absolute bottom-6 right-[4%] h-2 border-r border-white/40" />
            <p className="absolute bottom-9 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-white/50">
              2.270 mm
            </p>
            <div className="absolute -right-6 top-[6%] bottom-[12%] border-r border-white/40 max-sm:hidden" />
            <p className="absolute -right-11 top-1/2 -translate-y-1/2 rotate-90 font-mono text-[10px] tracking-[0.25em] text-white/50 max-sm:hidden">
              1.460 mm
            </p>
          </div>

          {/* Anotaciones de la fase plano */}
          {/* Dentro del escenario (esquina sup. izq.): arriba chocaba con el
              título ahora que la moto ocupa todo el alto disponible */}
          <p
            style={{ opacity: fade(0.16, 0.28) }}
            className="qb-late-fade absolute top-2 left-2 font-mono text-[10px] tracking-[0.25em] text-white/50 uppercase"
          >
            Fig. 01 — R 1250 GS Adventure
          </p>

          {/* La moto real se materializa sobre la silueta en 0.18–0.32 y
              asienta hasta 0.45. --bike-t es el progreso local. */}
          <div
            style={
              {
                "--bike-t": ramp(0.18, 0.45),
                opacity: ramp(0.18, 0.32),
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
              priority
              sizes="(max-width: 640px) 88vw, 820px"
              className="object-contain"
              // Luz de estudio frontal difusa: sube el brillo de toda la moto
              // de forma uniforme y sutil, revelando el detalle del negro
              style={{ filter: "brightness(1.38) saturate(1.05)" }}
            />
          </div>

          {/* Encendido: las dos luces delanteras emiten (patrón calcado del
              boceto del cliente) — cada haz nace EXACTO en su óptica y se
              abre en abanico hacia el borde derecho de la pantalla. Atrás, el
              piloto deja una estela roja difusa hacia atrás; abajo, un charco
              de reflejo muy sutil ancla la luz al asfalto. mix-blend-screen
              suma luz sobre el navy y el conjunto respira (qb-breathe). El
              wrapper lightsRef recibe .qb-ignite desde step(): parpadeo de
              "giro de llave" al cruzar el umbral de encendido. */}
          <div aria-hidden style={{ opacity: ramp(0.48, 0.64) }} className="absolute inset-0">
            <div ref={lightsRef} className="absolute inset-0">
            <div className="absolute inset-0 animate-[qb-breathe_4.5s_ease-in-out_infinite] motion-reduce:animate-none">
              {/* Faro principal: corona sobre la óptica. El aro ámbar del
                  faro está en el píxel (1305, 292) del asset 1600x1066 →
                  (81.6%, 28.7%) de la caja (object-contain con letterbox). */}
              <div className="absolute left-[77.5%] top-[22.5%] h-[13%] w-[9%] animate-pulse rounded-full bg-orange-300/70 blur-xl" />
              {/* Haz del faro superior: vértice clavado en la óptica; al
                  llegar al borde de la pantalla cubre del ~20% al ~81% del
                  alto del frame (geometría medida del boceto). El ancho llega
                  exactamente al borde del viewport: 50vw − 0.31×--bpw. */}
              <div
                className="absolute mix-blend-screen bg-gradient-to-r from-orange-400/50 via-orange-400/15 to-transparent blur-md"
                style={{
                  left: "81%",
                  top: "20.5%",
                  height: "60.5%",
                  width: "calc(50vw - var(--bpw) * 0.31)",
                  clipPath: "polygon(0 12%, 100% 0%, 100% 100%, 0 16%)",
                }}
              />

              {/* Denali del crash bar — óptica en (1120, 610) del asset →
                  (70%, 56.5%) de la caja: corona + núcleo */}
              <div className="absolute left-[66.5%] top-[51%] h-[11%] w-[7%] rounded-full bg-orange-400/60 blur-lg" />
              <div className="absolute left-[68.2%] top-[53.5%] h-[6%] w-[3.6%] rounded-full bg-amber-100/70 blur-sm" />
              {/* Haz bajo del Denali: nace en su óptica y cae en diagonal
                  reforzando la base del abanico principal, como en el boceto */}
              <div
                className="absolute mix-blend-screen bg-gradient-to-r from-orange-500/40 via-orange-400/12 to-transparent blur-lg"
                style={{
                  left: "69.5%",
                  top: "53%",
                  height: "37%",
                  width: "calc(50vw - var(--bpw) * 0.195)",
                  clipPath: "polygon(0 8%, 100% 60%, 100% 104%, 0 13%)",
                }}
              />

              {/* Charco de reflejo en el "asfalto": elipse cálida muy tenue
                  delante de la rueda delantera, donde caen los haces */}
              <div className="absolute left-[68%] top-[86%] h-[9%] w-[38%] rounded-[50%] mix-blend-screen bg-orange-400/25 blur-xl" />

              {/* Luz trasera: núcleo en el piloto real (≈6%, 35% del frame,
                  no sobre la parrilla) + estela difusa hacia atrás */}
              <div className="absolute left-[3.5%] top-[32.5%] h-[6.5%] w-[4.5%] rounded-full bg-red-400/70 blur-md" />
              <div
                className="absolute rounded-full mix-blend-screen bg-gradient-to-l from-red-500/50 via-red-500/15 to-transparent blur-lg"
                style={{ left: "-7%", top: "30.5%", height: "10%", width: "14.5%" }}
              />
            </div>
            </div>
          </div>

          {/* Sombra elíptica bajo la moto: la ancla al "piso" */}
          <div
            aria-hidden
            style={{ opacity: `calc(${ramp(0.25, 0.45)} * 0.45)` }}
            className="absolute bottom-[4%] left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl"
          />
        </div>

        {/* Eslogan de la casa: SIEMPRE visible, centrado bajo la moto, en
            flujo. En sm+ solapa 24px el borde inferior de la caja (la foto y
            la silueta tienen ese margen interno vacío): la moto gana toda esa
            altura sin que nada visible choque. */}
        <p
          className="font-hero-script z-20 mt-20 max-w-[92vw] px-4 text-center whitespace-nowrap text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:-mt-6"
          style={{ fontSize: "clamp(1.35rem, 5.4vw, 3.5rem)" }}
        >
          {siteConfig.slogan}
        </p>

        {/* Pista de scroll: solo al inicio de la fase plano, en la esquina
            inferior izquierda para no pisar el eslogan (las specs de esa
            esquina entran mucho después, nunca coexisten). */}
        <p
          style={{ opacity: fade(0, 0.06) }}
          className="absolute bottom-4 left-6 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase sm:left-10 motion-reduce:hidden"
        >
          ↓ Scroll
        </p>

        {/* CTA al catálogo: ocupa la esquina del scroll-hint cuando la moto
            ya encendió (el hint muere en bp 0.06, nunca coexisten). El
            pointer-events lo gobierna .qb-lit para que no sea clicable ni
            enfocable mientras es invisible. */}
        <div
          style={{ opacity: ramp(0.58, 0.7) }}
          className="qb-cta absolute bottom-4 left-6 z-30 sm:left-10"
        >
          <Link
            href="/catalogo/inventario"
            className="inline-block border border-white/25 px-5 py-2.5 font-mono text-[11px] tracking-[0.3em] text-white/80 uppercase transition-colors hover:border-brand-red hover:text-white"
          >
            Ver catálogo →
          </Link>
        </div>
      </div>
    </section>
  );
}
