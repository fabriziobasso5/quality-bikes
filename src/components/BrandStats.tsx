"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

const COUNT_DURATION_MS = 1400;

function Counter({ target, prefix = "" }: { target: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / COUNT_DURATION_MS, 1);
      // ease-out cúbico: arranca rápido y aterriza suave en el valor final
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, target]);

  return (
    <span ref={ref}>
      {prefix}
      {value}
    </span>
  );
}

/**
 * Franja de datos de marca, estilo CAKE: tres cifras grandes que cuentan
 * hacia arriba al entrar en viewport, sin cajas ni bordes — solo aire,
 * números en navy y etiquetas pequeñas en gris.
 */
export default function BrandStats() {
  const stats = [
    { target: 49, prefix: "+", label: "años de experiencia" },
    { target: 120, prefix: "+", label: "Sueños cumplidos" },
    { target: 2, prefix: "", label: "tiendas en Caracas" },
    // Derivado del propio sitio para que nunca quede desactualizado. La
    // etiqueta es "Marcas" a secas: no todas son representaciones oficiales.
    { target: siteConfig.brandsRepresented.length, prefix: "", label: "Marcas" },
  ];

  return (
    <section className="border-y border-black/5 py-16 sm:py-20">
      <dl className="mx-auto flex max-w-5xl flex-wrap items-start justify-center gap-x-20 gap-y-10 px-6 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dd className="font-display text-5xl tracking-wide text-brand-navy sm:text-6xl">
              <Counter target={stat.target} prefix={stat.prefix} />
            </dd>
            <dt className="mt-3 text-xs tracking-[0.25em] text-brand-text/50 uppercase">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
