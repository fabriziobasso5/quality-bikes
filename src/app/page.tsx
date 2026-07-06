import Link from "next/link";
import CursorGlow from "@/components/CursorGlow";
import Hero from "@/components/Hero";
import Magnetic from "@/components/Magnetic";
import MotoCard from "@/components/MotoCard";
import MotoImagePlaceholder from "@/components/MotoImagePlaceholder";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { motorcycles } from "@/data/motorcycles";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

export default function Home() {
  const featured = motorcycles.filter((m) => m.featured);

  return (
    <>
      <Hero />

      {/* Marcas */}
      <section className="border-b border-black/10 bg-brand-bg-soft py-12">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-center text-xs tracking-[0.3em] text-brand-text/50 uppercase">
              Marcas representadas
            </p>
            <p className="mx-auto mt-2 mb-8 max-w-md text-center text-sm text-brand-text/60">
              Multimarca: las motos más reconocidas y buscadas del mercado
            </p>
          </Reveal>
          <RevealGroup className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {siteConfig.brandsRepresented.map((brand) => (
              <RevealItem key={brand}>
                <span className="font-display text-lg tracking-widest text-brand-text/70 uppercase">
                  {brand}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Productos y lubricantes */}
      <section className="border-b border-black/10 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-center text-xs tracking-[0.3em] text-brand-navy uppercase">
              También en tienda
            </p>
            <h2 className="mt-2 text-center font-display text-2xl uppercase tracking-wide">
              Productos y lubricantes
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {siteConfig.productsCarried.map((product) => (
              <RevealItem
                key={product.name}
                className="border border-black/10 bg-brand-bg-soft p-6 text-center"
              >
                <div className="mx-auto flex h-20 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element -- logos de terceros, dimensiones intrínsecas variables */}
                  <img
                    src={withBasePath(product.logo)}
                    alt={product.name}
                    className="max-h-20 max-w-[140px] object-contain"
                  />
                </div>
                <p className="mt-4 font-display text-lg tracking-wide uppercase text-brand-navy">
                  {product.name}
                </p>
                <p className="mt-2 text-sm text-brand-text/60">{product.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Selección destacada */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-brand-navy uppercase">Selección</p>
            <h2 className="mt-2 font-display text-3xl uppercase tracking-wide">
              Destacadas del showroom
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="link-underline hidden text-sm tracking-wide text-brand-text/70 hover:text-brand-red md:block"
          >
            Ver catálogo completo →
          </Link>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((moto) => (
            <RevealItem key={moto.slug}>
              <MotoCard moto={moto} />
            </RevealItem>
          ))}
        </RevealGroup>
        <Link
          href="/catalogo"
          className="mt-8 block text-center text-sm tracking-wide text-brand-text/70 hover:text-brand-red md:hidden"
        >
          Ver catálogo completo →
        </Link>
      </section>

      {/* Propuesta de valor */}
      <section className="border-y border-black/10 bg-brand-bg-soft py-20">
        <Reveal className="mx-auto max-w-2xl px-6 text-center">
          <h3 className="font-display text-2xl tracking-wide uppercase text-brand-navy">
            Asesoría personalizada
          </h3>
          <p className="mt-3 text-brand-text/70">
            Te ayudamos a conseguir la moto de tus sueños: te acompañamos en todo el
            proceso, desde elegir el modelo correcto hasta la entrega.
          </p>
        </Reveal>
      </section>

      {/* Instagram feed placeholder */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal>
          <p className="text-xs tracking-[0.3em] text-brand-navy uppercase">Síguenos</p>
          <h2 className="mt-2 font-display text-3xl uppercase tracking-wide">
            {siteConfig.social.instagramHandle}
          </h2>
        </Reveal>
        {/* TODO: integrar feed real de Instagram (API oficial o widget tipo SnapWidget/Elfsight) cuando se entregue la cuenta */}
        <RevealGroup className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <RevealItem key={i} className="aspect-square">
              <MotoImagePlaceholder brand="Instagram" model="" className="h-full w-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden bg-brand-navy py-20 text-center text-brand-bg">
        <CursorGlow />
        <Reveal className="relative mx-auto max-w-2xl px-6">
          <h2 className="font-display text-3xl uppercase tracking-wide">
            ¿Listo para tu próxima moto?
          </h2>
          <p className="mt-4 text-brand-bg/80">
            Agenda una asesoría privada con nuestro equipo, sin compromiso.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Magnetic className="inline-block">
              <Link
                href="/contacto"
                className="inline-block rounded-full bg-brand-bg px-8 py-3 text-sm tracking-widest text-brand-navy uppercase transition hover:bg-brand-bg/90"
              >
                Agenda tu asesoría
              </Link>
            </Magnetic>
            <Magnetic className="inline-block">
              <a
                href={buildWhatsAppLink("Hola, quiero más información sobre Quality Bikes.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-brand-bg/40 px-8 py-3 text-sm tracking-widest uppercase transition hover:border-brand-red hover:text-brand-red"
              >
                Escríbenos por WhatsApp
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* Ubícanos */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <RevealGroup className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <RevealItem>
            <p className="text-xs tracking-[0.3em] text-brand-navy uppercase">Visítanos</p>
            <h2 className="mt-2 font-display text-3xl uppercase tracking-wide">
              Nuestro showroom
            </h2>
            <p className="mt-4 max-w-md text-sm text-brand-text/70">
              {siteConfig.contact.address}
            </p>
            <p className="mt-2 text-sm text-brand-text/70">{siteConfig.contact.hours}</p>
            <a
              href={siteConfig.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full bg-brand-navy px-8 py-3 text-sm tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy/90"
            >
              Cómo llegar
            </a>
          </RevealItem>
          <RevealItem className="aspect-video w-full overflow-hidden rounded-2xl border border-black/10 shadow-xl">
            <iframe
              src={siteConfig.contact.mapsEmbedUrl}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Quality Bikes en Caracas"
            />
          </RevealItem>
        </RevealGroup>
      </section>
    </>
  );
}
