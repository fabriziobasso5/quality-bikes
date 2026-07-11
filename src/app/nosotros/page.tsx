import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Nosotros",
  description: `Conoce la historia detrás de ${siteConfig.name}: de Moto Accesorios Baró (1977) al showroom de alta gama en el este de Caracas.`,
};

// Historia real de la casa (1977 → hoy). Redacción editorial sobre los hechos
// entregados por el cliente; la imagen es una toma lifestyle en alta calidad ya
// presente en el repo (se reemplazará por una foto real del showroom cuando la
// haya).
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

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-5 lg:items-start lg:gap-16">
        <Reveal delay={0.1} className="lg:col-span-3">
          <p className="text-lg leading-relaxed text-brand-text/70">
            Nuestra historia arranca en <span className="text-brand-navy">1977</span> con{" "}
            <span className="text-brand-navy">Moto Accesorios Baró</span>, la primera tienda de
            motos de la familia. Fuimos distribuidores oficiales de Yamaha hasta 2006 y hoy
            seguimos siendo distribuidores de Suzuki.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-brand-text/70">
            En <span className="text-brand-navy">2022</span> abrimos{" "}
            <span className="text-brand-navy">Quality Bikes Venezuela</span> para llevar al este
            de Caracas un showroom de motos de alta gama. Empezamos trayendo unidades nuevas
            desde Estados Unidos —la BMW R 1250 GS Adventure, la BMW F 850 GS Adventure y la
            Honda Africa Twin Adventure Sports— y, moto a moto, fuimos dando forma a este
            showroom.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-brand-text/70">
            Hoy, con más de <span className="text-brand-navy">49 años en el mundo motero y
            contando</span>, seguimos con la misma pasión: mucho más que solo motos.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="lg:col-span-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg shadow-black/10">
            <Image
              src={withBasePath("/images/lifestyle/bmw-r1300-gsa-scenic.webp")}
              alt="BMW GS Adventure en un mirador de montaña — el espíritu de Quality Bikes"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
          <p className="mt-3 text-center text-xs tracking-[0.2em] text-brand-text/40 uppercase">
            Caracas · Venezuela · desde 1977
          </p>
        </Reveal>
      </div>
    </div>
  );
}
