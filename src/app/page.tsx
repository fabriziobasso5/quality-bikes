import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Logo3D from "@/components/Logo3D";
import Magnetic from "@/components/Magnetic";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { motorcycles } from "@/data/motorcycles";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

// Home editorial (referencias aprobadas: mega-menú Ducati, estética CAKE).
// Regla de composición: una idea protagonista por pantalla, aire generoso,
// bloques de producto sobre blanco alternados con fotos lifestyle a sangre.
export default function Home() {
  const inShowroom = motorcycles.filter((m) => m.availability === "en-stock");
  const floating = motorcycles.find((m) => m.slug === "voge-ds-625x");

  return (
    <>
      <Hero />

      {/* Multimarca en una sola línea discreta */}
      <section className="border-b border-black/5 py-10">
        <RevealGroup className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6">
          {siteConfig.brandsRepresented.map((brand) => (
            <RevealItem key={brand}>
              <span className="font-display text-sm tracking-[0.25em] text-brand-text/40 uppercase">
                {brand}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* En el showroom ahora — las unidades físicas reales, nada más */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <Reveal>
          <p className="text-xs tracking-[0.3em] text-brand-red uppercase">Disponibles hoy</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight tracking-wide uppercase sm:text-5xl">
            En el showroom ahora
          </h2>
        </Reveal>
        <RevealGroup className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {inShowroom.map((moto) => (
            <RevealItem key={moto.slug}>
              <Link href={`/catalogo/${moto.slug}`} className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-bg-soft">
                  <Image
                    src={withBasePath(`/images/inventory/${moto.slug}/1.webp`)}
                    alt={`${moto.brand} ${moto.model}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-widest text-brand-text/50 uppercase">
                      {moto.brand}
                    </p>
                    <h3 className="mt-1 font-display text-2xl tracking-wide uppercase">
                      {moto.model}
                    </h3>
                  </div>
                  <p className="shrink-0 font-mono text-sm text-brand-text/60">
                    {moto.condition === "0km" ? "0 km" : `${moto.mileageKm} km`}
                  </p>
                </div>
                <p className="link-underline mt-4 inline-block text-sm tracking-wide text-brand-navy uppercase">
                  Ver ficha →
                </p>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Lifestyle a sangre #1
          TODO(cliente): reemplazar por la foto real de la R1300 GSA en tierra. */}
      <section className="relative h-[65vh] overflow-hidden">
        <Image
          src={withBasePath("/images/inventory/voge-ds-900x/2.webp")}
          alt="Moto dual sport levantando tierra en una subida de grava"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <Reveal className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-14">
          <p className="max-w-md font-display text-3xl leading-snug tracking-wide text-white uppercase sm:text-4xl">
            Hechas para la tierra venezolana
          </p>
        </Reveal>
      </section>

      {/* Producto flotante (estilo CAKE): una sola idea — la gama DS-X viene en camino */}
      {floating && (
        <section className="mx-auto max-w-5xl px-6 py-28 text-center sm:py-36">
          <Reveal>
            <p className="text-xs tracking-[0.3em] text-brand-red uppercase">Próximo arribo</p>
            <h2 className="mt-3 font-display text-4xl tracking-wide uppercase sm:text-6xl">
              Voge DS 625X
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative mx-auto mt-10 max-w-2xl">
              <Image
                src={withBasePath(`/images/catalog/${floating.slug}.webp`)}
                alt="Voge DS 625X"
                width={1600}
                height={1200}
                sizes="(max-width: 640px) 100vw, 672px"
                className="relative z-10 h-auto w-full"
              />
              {/* Sombra elíptica difusa bajo la moto: el truco CAKE de "flotar" */}
              <div
                aria-hidden
                className="absolute bottom-[6%] left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-[50%] bg-black/25 blur-xl"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-8 max-w-md text-brand-text/70">
              La gama dual sport de Voge llega a Caracas. Resérvala antes de que toque piso.
            </p>
            <div className="mt-8 flex items-center justify-center gap-10 font-mono text-sm text-brand-text/60">
              <span>{floating.specs.power}</span>
              <span aria-hidden className="text-brand-text/20">|</span>
              <span>{floating.cc} cc</span>
              <span aria-hidden className="text-brand-text/20">|</span>
              <span>{floating.specs.weight}</span>
            </div>
            <Link
              href={`/catalogo/${floating.slug}`}
              className="link-underline mt-10 inline-block text-sm tracking-widest text-brand-navy uppercase"
            >
              Reservar →
            </Link>
          </Reveal>
        </section>
      )}

      {/* Lifestyle a sangre #2
          TODO(cliente): reemplazar por la foto real de la Africa Twin en el aire. */}
      <section className="relative h-[65vh] overflow-hidden">
        <Image
          src={withBasePath("/images/inventory/voge-ds-525x/2.webp")}
          alt="Piloto de pie sobre una dual sport cruzando terreno alpino"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <Reveal className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-14">
          <p className="max-w-md font-display text-3xl leading-snug tracking-wide text-white uppercase sm:text-4xl">
            El próximo destino lo eliges tú
          </p>
        </Reveal>
      </section>

      {/* La pieza de la casa: el emblema QB girando, presentado como en vitrina */}
      <section className="bg-brand-bg-soft">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center sm:py-28">
          <Reveal>
            <p className="text-xs tracking-[0.3em] text-brand-text/40 uppercase">
              Quality Bikes · Venezuela
            </p>
          </Reveal>
          <div className="mx-auto h-[340px] w-full max-w-2xl sm:h-[420px]">
            <Logo3D />
          </div>
          <Reveal>
            <p className="font-script text-3xl text-brand-navy sm:text-4xl">{siteConfig.slogan}</p>
          </Reveal>
        </div>
      </section>

      {/* Productos en tienda: tres marcas, tres logos, nada más */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
        <Reveal>
          <p className="text-center text-xs tracking-[0.3em] text-brand-text/40 uppercase">
            También en tienda
          </p>
        </Reveal>
        <RevealGroup className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-12 sm:grid-cols-3">
          {siteConfig.productsCarried.map((product) => (
            <RevealItem key={product.name} className="text-center">
              <div className="flex h-16 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element -- logos de terceros, dimensiones intrínsecas variables */}
                <img
                  src={withBasePath(product.logo)}
                  alt={product.name}
                  className={
                    product.card
                      ? "h-16 w-auto rounded-lg object-contain"
                      : "max-h-14 w-auto max-w-[150px] object-contain"
                  }
                />
              </div>
              <p className="mt-4 text-sm text-brand-text/50">{product.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Cierre único: asesoría + ubicación + WhatsApp */}
      <section className="border-t border-black/5 bg-brand-bg-soft">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-24 sm:py-28 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-xs tracking-[0.3em] text-brand-red uppercase">Visítanos</p>
            <h2 className="mt-3 max-w-md font-display text-3xl leading-tight tracking-wide uppercase sm:text-4xl">
              Te ayudamos a conseguir la moto de tus sueños
            </h2>
            <p className="mt-6 max-w-md text-brand-text/70">
              Te acompañamos en todo el proceso, desde elegir el modelo correcto hasta la
              entrega.
            </p>
            <div className="mt-8 space-y-1 text-sm text-brand-text/60">
              <p>{siteConfig.contact.address}</p>
              <p>{siteConfig.contact.hours}</p>
            </div>
            <div className="mt-10">
              <Magnetic className="inline-block">
                <a
                  href={buildWhatsAppLink("Hola, quiero más información sobre Quality Bikes.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-brand-navy px-10 py-4 text-sm tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
                >
                  Escríbenos por WhatsApp
                </a>
              </Magnetic>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/10">
            <iframe
              src={siteConfig.contact.mapsEmbedUrl}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Quality Bikes en Caracas"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
