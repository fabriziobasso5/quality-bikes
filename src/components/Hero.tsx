"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Magnetic from "@/components/Magnetic";
import { siteConfig } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

/**
 * Minimal hero: one cinematic image, one short headline, one CTA. Anything
 * else was cut on purpose — if in doubt, remove.
 * TODO(cliente): reemplazar la foto por la R1300 GSA en tierra cuando exista;
 * mantener encuadre panorámico con las motos hacia el lado derecho.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Background drifts slower than the text on scroll — depth, not a trick.
  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "36%"]);

  return (
    <section ref={sectionRef} className="relative flex min-h-[92svh] items-end overflow-hidden">
      <motion.div style={{ y: imageY }} className="absolute inset-x-0 -top-[8%] h-[116%]">
        <Image
          src={withBasePath("/images/hero/africa-twin-hero.webp")}
          alt="Motos de alta cilindrada en acción sobre tierra"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[63%_50%] sm:object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent" />
      <motion.div
        style={{ y: textY }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 text-brand-bg"
      >
        <p className="text-xs tracking-[0.3em] text-brand-bg/70 uppercase">
          Caracas · Venezuela
        </p>
        <p className="font-script mt-3 text-4xl sm:text-5xl">{siteConfig.slogan}</p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight tracking-wide uppercase sm:text-6xl">
          Más de 40 años en el mundo motero
        </h1>
        <div className="mt-10">
          <Magnetic className="inline-block">
            <Link
              href="/catalogo"
              className="inline-block rounded-full bg-brand-bg px-10 py-4 text-sm tracking-widest text-brand-navy uppercase transition hover:bg-brand-bg/90"
            >
              Ver catálogo
            </Link>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}
