"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Logo3D from "@/components/Logo3D";
import Magnetic from "@/components/Magnetic";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Background photo drifts slower (~0.4x) than the text (~0.8x) as the
  // hero scrolls past, reading as depth rather than a flat parallax trick.
  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "36%"]);

  return (
    <section ref={sectionRef} className="relative flex min-h-[85vh] items-end overflow-hidden">
      <motion.div style={{ y: imageY }} className="absolute inset-x-0 -top-[8%] h-[116%]">
        <Image
          src={withBasePath("/images/hero/africa-twin-hero.webp")}
          alt="Motos Honda Africa Twin en acción sobre tierra"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-brand-navy/10" />
      <div className="absolute inset-x-0 top-0 z-[5] mx-auto h-[45%] w-full max-w-xs sm:h-[65%] sm:max-w-3xl">
        <Logo3D heroRef={sectionRef} />
      </div>
      <motion.div
        style={{ y: textY }}
        className="relative z-10 mx-auto max-w-7xl px-6 pb-20 text-brand-bg"
      >
        <p className="text-xs tracking-[0.3em] text-brand-bg/70 uppercase">
          Caracas · Venezuela
        </p>
        <p className="font-script mt-2 text-4xl text-brand-bg sm:text-5xl">{siteConfig.slogan}</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight tracking-wide uppercase sm:text-6xl">
          Más de 40 años de experiencia en el mundo motero
        </h1>
        <p className="mt-6 max-w-xl text-lg text-brand-bg/80">
          Aquí encontrarás las motos más buscadas del mercado.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Magnetic className="inline-block">
            <Link
              href="/catalogo"
              className="inline-block rounded-full bg-brand-bg px-8 py-3 text-sm tracking-widest text-brand-navy uppercase transition hover:bg-brand-bg/90"
            >
              Ver inventario
            </Link>
          </Magnetic>
          <Magnetic className="inline-block">
            <a
              href={buildWhatsAppLink("Hola, quiero agendar una asesoría privada.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border border-brand-bg/40 px-8 py-3 text-sm tracking-widest uppercase transition hover:border-brand-red hover:text-brand-red"
            >
              Agenda una asesoría
            </a>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}
