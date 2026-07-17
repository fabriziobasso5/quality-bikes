"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { QB_PATHS, QB_VIEWBOX } from "./qb-isotipo-paths";

/**
 * Isotipo QB del hero (SVG vectorial puro, sin asset generado): entrada
 * "técnica" — el contorno de cada path se dibuja como trazo (stroke draw-in,
 * el mismo lenguaje del IntroLoader: la marca que se dibuja a sí misma) y el
 * relleno se solidifica al final. Después queda un shimmer metálico sutil en
 * loop lento, recortado a la silueta del logo. Elegido sobre un fade/bounce
 * genérico porque conecta la estética de plano/taller del sitio con un
 * acabado premium, y reutiliza el vector real de la marca (nada de IA).
 * Bajo prefers-reduced-motion: logo sólido estático, sin trazo ni shimmer.
 */
export default function QbMark({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(svg.querySelectorAll("[data-qb-fill]"), { fillOpacity: 1 });
      return;
    }
    // El draw-in arranca cuando el isotipo ENTRA al viewport (vive a mitad
    // de página, en el despiece): con el delay fijo post-mount de antes la
    // animación corría fuera de pantalla y podía quedar en estado a medias.
    const ctx = gsap.context(() => {}, svg);
    let played = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (played || !entries.some((e) => e.isIntersecting)) return;
        played = true;
        io.disconnect();
        ctx.add(() => {
          const tl = gsap.timeline({ delay: 0.15 });
          tl.fromTo(
            svg.querySelectorAll("[data-qb-stroke]"),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.14 },
            0
          )
            .to(svg.querySelectorAll("[data-qb-fill]"), { fillOpacity: 1, duration: 0.55, ease: "none" }, 0.95)
            .to(svg.querySelectorAll("[data-qb-stroke]"), { opacity: 0, duration: 0.4 }, 1.25)
            // shimmer: barrido diagonal en loop lento, recortado al logo
            .fromTo(
              svg.querySelector("[data-qb-shimmer]"),
              { x: "-120%" },
              { x: "220%", duration: 1.6, ease: "power1.inOut", repeat: -1, repeatDelay: 5.5 },
              1.7
            );
        });
      },
      { threshold: 0.3 }
    );
    io.observe(svg);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <svg ref={ref} viewBox={QB_VIEWBOX} className={className} aria-label="Quality Bikes">
      <defs>
        <clipPath id="qb-mark-clip">
          {QB_PATHS.map((p, i) => (
            <path key={i} d={p.d} />
          ))}
        </clipPath>
        <linearGradient id="qb-mark-sheen" x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.65" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {QB_PATHS.map((p, i) => (
        <path key={`f${i}`} data-qb-fill d={p.d} fill={p.fill} fillOpacity={0} fillRule="evenodd" />
      ))}
      {QB_PATHS.map((p, i) => (
        <path
          key={`s${i}`}
          data-qb-stroke
          d={p.d}
          fill="none"
          stroke={p.fill}
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
      ))}
      <g clipPath="url(#qb-mark-clip)">
        <rect data-qb-shimmer x="-120%" y="-20%" width="55%" height="140%" fill="url(#qb-mark-sheen)" transform="skewX(-18)" />
      </g>
    </svg>
  );
}
