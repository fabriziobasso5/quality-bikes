import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Nosotros",
  description: `Conoce la historia detrás de ${siteConfig.name}: de Moto Accesorios Baró (1977) al showroom de alta gama en el este de Caracas.`,
};

// Historia real de la casa (1977 → hoy). Redacción editorial sobre los hechos
// entregados por el cliente. El panel ya no usa foto: las únicas fotos
// lifestyle en alta calidad del repo ya están en uso en el home (Hero +
// "Ideal para todo terreno"), así que aquí va un tratamiento de marca
// (degradado navy + silueta del isotipo) hasta que haya una foto propia del
// showroom.
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
          <div
            className="relative flex aspect-[4/5] w-full items-end overflow-hidden rounded-2xl shadow-lg shadow-black/10"
            style={{
              backgroundImage:
                "linear-gradient(160deg, #003462 0%, #04223d 55%, #0a1420 100%)",
            }}
          >
            {/* Silueta del isotipo a gran escala, sangrada por el borde
                superior: motivo de marca en vez de una foto repetida. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- silueta de marca, dimensiones intrínsecas variables */}
            <img
              src={withBasePath("/assets/logo/quality-bikes-moto-silueta.svg")}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -top-[6%] -right-[22%] w-[105%] max-w-none opacity-[0.16]"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: "radial-gradient(120% 70% at 100% 0%, rgba(255,255,255,0.12) 0%, transparent 55%)",
              }}
            />
            {/* Velo hacia abajo: asegura contraste del texto sobre la silueta. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040d18] via-[#040d18]/10 to-transparent"
            />
            <div className="relative w-full px-8 pb-10 text-center sm:pb-12">
              <p className="font-script text-3xl text-brand-bg/90 sm:text-4xl">{siteConfig.slogan}</p>
              <span aria-hidden className="mx-auto mt-6 block h-px w-12 bg-brand-bg/30" />
              <p className="mt-6 text-xs tracking-[0.3em] text-brand-bg/50 uppercase">Desde 1977</p>
            </div>
          </div>
          <p className="mt-3 text-center text-xs tracking-[0.2em] text-brand-text/40 uppercase">
            Caracas · Venezuela · desde 1977
          </p>
        </Reveal>
      </div>
    </div>
  );
}
