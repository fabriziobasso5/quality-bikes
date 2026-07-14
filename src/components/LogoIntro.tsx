"use client";

import { useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { withBasePath } from "@/lib/base-path";
import { siteConfig } from "@/lib/site-config";

export const INTRO_SESSION_KEY = "qb-intro-played";

/**
 * Intro de marca de exactamente 1 segundo, una vez por sesión:
 *  0.0–0.4s  el isotipo QB aparece centrado — scale 0.85→1 + fade, power2.out
 *  0.4–1.0s  vuela (FLIP: medimos el rect real del logo del header) hasta
 *            calzar sobre la esquina superior izquierda, power4.inOut; el
 *            logo real hace un fade-in rapidísimo al final para que el relevo
 *            sea imperceptible.
 *
 * Performance: el overlay se SIRVE en el HTML (SSR) y la fase 1 es una
 * animación CSS (qb-intro-in en globals.css) — ambos corren desde el primer
 * paint, sin esperar el bundle (el LCP no queda atado a la hidratación). Un
 * script síncrono en layout.tsx marca <html class="qb-intro-skip"> antes del
 * primer paint si la sesión ya la vio o si hay prefers-reduced-motion. GSAP
 * solo coreografía la fase 2, anclada al reloj de navegación para que el
 * total sea 1s aunque la hidratación llegue tarde.
 */
export default function LogoIntro() {
  const [alive, setAlive] = useState(true);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem(INTRO_SESSION_KEY)) {
      setAlive(false);
      return;
    }
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");

    const overlay = document.getElementById("qb-intro");
    const mark = document.getElementById("qb-intro-mark");
    const headerLogo = document.querySelector<HTMLElement>("header a[aria-label]");
    if (!overlay || !mark) return;

    const ctx = gsap.context(() => {
      const flight = () => {
        // Sin onComplete que desmonte: el overlay (ya transparente e inerte)
        // queda en el DOM — desmontarlo fuerza un repaint de viewport
        // completo y Chrome re-registra el LCP en ese instante, arruinando
        // la métrica aunque la página pintó en el primer frame.
        const tl = gsap.timeline();
        if (headerLogo) {
          gsap.set(headerLogo, { autoAlpha: 0 });
          const target = headerLogo.getBoundingClientRect();
          const markRect = mark.getBoundingClientRect();
          const scale = target.height / markRect.height;
          const x = target.left + (markRect.width * scale) / 2 - window.innerWidth / 2;
          const y = target.top + target.height / 2 - window.innerHeight / 2;
          tl.to(mark, { x, y, scale, duration: 0.6, ease: "power4.inOut" }, 0)
            .to("#qb-intro-glow", { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, 0.1)
            .to(headerLogo, { autoAlpha: 1, duration: 0.1, ease: "none" }, 0.5)
            .to(mark, { autoAlpha: 0, duration: 0.1, ease: "none" }, 0.5)
            .set(headerLogo, { clearProps: "all" });
        } else {
          tl.to(overlay, { autoAlpha: 0, duration: 0.3, ease: "none" }, 0.3).set(mark, {
            autoAlpha: 0,
          });
        }
      };
      // La fase CSS dura 0.4s desde el primer paint: despega cuando termine
      // (o ya, si la hidratación llegó después).
      const elapsed = performance.now();
      gsap.delayedCall(Math.max(0, 0.4 - elapsed / 1000), flight);
    });

    return () => ctx.revert();
  }, []);

  if (!alive) return null;

  return (
    <div
      id="qb-intro"
      aria-hidden
      // Sin velo de pantalla completa: cualquier capa que tape el viewport
      // hace que Chrome descarte la moto como candidato LCP y el métrico
      // queda atado al fin de la intro. El isotipo flota sobre el hero con
      // un glow suave (semi-transparente, no oclusivo) para separarse.
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
    >
      <div
        id="qb-intro-glow"
        aria-hidden
        className="absolute h-[420px] w-[420px] rounded-full bg-white/80 blur-3xl [animation:qb-intro-in_0.4s_cubic-bezier(0.33,1,0.68,1)_both]"
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG de marca */}
      <img
        id="qb-intro-mark"
        src={withBasePath("/assets/logo/quality-bikes-isotipo-qb.svg")}
        alt={siteConfig.name}
        className="h-24 w-auto will-change-transform [animation:qb-intro-in_0.4s_cubic-bezier(0.33,1,0.68,1)_both] sm:h-32"
      />
    </div>
  );
}
