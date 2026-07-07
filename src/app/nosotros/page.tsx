import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Nosotros",
  description: `Conoce la historia y el equipo detrás de ${siteConfig.name}, el concesionario de motos premium en Caracas.`,
};

// Depurado a lo real: las secciones de equipo y showroom salieron del sitio
// hasta que existan fotos reales (placeholder gris ≠ contenido). Cuando el
// cliente entregue material, se reincorporan aquí con el mismo lenguaje
// editorial del home.
export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <Reveal>
        <p className="text-xs tracking-[0.3em] text-brand-red uppercase">Nosotros</p>
        <h1 className="mt-3 font-display text-4xl leading-tight tracking-wide uppercase sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="font-script mt-4 text-3xl text-brand-navy">{siteConfig.slogan}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-brand-text/70">
          Quality Bikes abrió sus puertas hace 4 años, pero nuestro equipo trae consigo
          más de 40 años de experiencia en la industria de venta de motocicletas en
          Venezuela. Esa trayectoria es la que nos permite ofrecer una curaduría
          rigurosa, asesoría experta y un respaldo postventa que protege tu inversión a
          largo plazo. Somos multimarca: BMW, Ducati, Honda, Yamaha, Suzuki, Kawasaki y
          Voge, con especial atención a los modelos más buscados de cada una — como la
          BMW R 1250 GS Adventure, nuestra más vendida, junto a la Honda Africa Twin, la
          Ducati Multistrada, la Yamaha Ténéré, la Suzuki DR650 y la Kawasaki KLR 650 ABS.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-text/70">
          Formamos parte del mismo grupo que Moto Accesorios Baro, nuestra otra tienda
          — en funcionamiento desde hace décadas — especializada en motos económicas y
          de baja cilindrada. Quality Bikes nace como su extensión natural hacia el
          segmento premium.
        </p>
      </Reveal>
    </div>
  );
}
