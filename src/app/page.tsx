import Image from "next/image";
import Link from "next/link";
import BrandStats from "@/components/BrandStats";
import BlueprintReveal from "@/components/BlueprintReveal";
import ExplodedHero from "@/components/hero/ExplodedHero";
import MotoCover from "@/components/MotoCover";
import Magnetic from "@/components/Magnetic";
import OpenCatalogButton from "@/components/OpenCatalogButton";
import FeaturedArrivals from "@/components/FeaturedArrivals";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { motorcycles } from "@/data/motorcycles";
import { productBrands } from "@/data/products";
import { siteConfig, buildWhatsAppLink } from "@/lib/site-config";
import { withBasePath } from "@/lib/base-path";

// Home editorial (referencias aprobadas: mega-menú Ducati, estética CAKE).
// Regla de composición: una idea protagonista por pantalla, aire generoso,
// bloques de producto sobre blanco alternados con fotos lifestyle a sangre.
export default function Home() {
  const inShowroom = motorcycles.filter((m) => m.availability === "en-stock");
  const upcoming = motorcycles.filter((m) => m.availability === "proximo-arribo");

  return (
    <>
      <ExplodedHero />

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
                {/* Portada oficial fondo blanco — las fotos reales viven solo
                    en la galería de la ficha */}
                <MotoCover
                  moto={moto}
                  className="aspect-[4/3] w-full overflow-hidden"
                  imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
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
                    {moto.condition === "0km"
                      ? "0 km"
                      : `Seminueva${moto.mileageKm ? ` · ${moto.mileageKm} km` : ""}`}
                  </p>
                </div>
                <p className="link-underline mt-4 inline-block text-sm tracking-wide text-brand-navy uppercase">
                  Ver ficha →
                </p>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Acceso al catálogo completo: abre el mega-menú (todas las motos
            sobre blanco) — el mismo panel que el nav y el hero. */}
        <Reveal className="mt-16 text-center">
          <Magnetic className="inline-block">
            <OpenCatalogButton className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-10 py-4 text-sm tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft">
              Ver todo el catálogo →
            </OpenCatalogButton>
          </Magnetic>
        </Reveal>
      </section>

      {/* Franja de datos de marca: respira entre el showroom y el lifestyle */}
      <BrandStats />

      {/* Lifestyle a sangre #1 — BMW R 1300 GS Adventure en paisaje de montaña
          (foto de prensa oficial, alta resolución). Intercala marca con el
          bloque Triumph más abajo. */}
      <section className="relative h-[65vh] overflow-hidden">
        <Image
          src={withBasePath("/images/lifestyle/bmw-r1300-gsa-scenic.webp")}
          alt="BMW R 1300 GS Adventure sobre un mirador de montaña al atardecer"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <Reveal className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-14">
          <p className="max-w-md font-display text-3xl leading-snug tracking-wide text-white uppercase sm:text-4xl">
            Ideal para todo terreno
          </p>
        </Reveal>
      </section>

      {/* Productos en tienda: marcas complementarias, mismos logos en placas
          idénticas. Fondo de fibra de carbono forjada — misma familia visual
          que header/footer — con divisor superior + eyebrow en rojo de marca
          para marcar que aquí empieza la zona de tienda. */}
      <section className="relative overflow-hidden border-t border-black/10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("${withBasePath("/images/carbono-forjado.jpg")}")`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/55" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(120% 85% at 50% 0%, transparent 45%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28">
          <Reveal className="text-center">
            <span aria-hidden className="mx-auto mb-6 block h-px w-12 bg-brand-red" />
            <p className="text-sm font-medium tracking-[0.3em] text-brand-red uppercase">
              También en tienda
            </p>
          </Reveal>
          <RevealGroup className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {siteConfig.productsCarried.map((product, i) => {
            // productsCarried y productBrands describen las mismas casas en el
            // mismo orden (VP Racing, Mobil, BK3, Falken, EWAY): el índice da
            // el id de la ruta. (Asunción: si se reordena una lista, reordenar
            // la otra.)
            const brandId = productBrands[i]?.id;
            return (
              <RevealItem key={product.name} className="text-center">
                <Link href={brandId ? `/productos/${brandId}` : "/productos"} className="group block">
                  {/* Placas idénticas: el logo se maximiza dentro del mismo
                      marco en todas las marcas, así se ven simétricos en tamaño. */}
                  <div className="flex h-28 items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white px-7 shadow-sm shadow-black/[0.04] transition duration-300 group-hover:-translate-y-1 group-hover:border-black/20 group-hover:shadow-lg group-hover:shadow-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element -- logos de terceros, dimensiones intrínsecas variables */}
                    <img
                      src={withBasePath(product.logo)}
                      alt={product.name}
                      className="max-h-16 w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-4 text-sm text-white/60">{product.description}</p>
                  <p className="link-underline mt-2 inline-block text-xs tracking-widest text-white/85 uppercase">
                    Ver productos →
                  </p>
                </Link>
              </RevealItem>
            );
          })}
          </RevealGroup>
        </div>
      </section>

      {/* Moto destacada rotativa (estilo CAKE): alterna cada ~5 s entre TODAS
          las motos de próximo arribo — foto flotante, specs y "Reservar". */}
      {upcoming.length > 0 && <FeaturedArrivals motos={upcoming} />}

      {/* La pieza de la casa: el plano técnico del isotipo se dibuja con el
          scroll y se materializa en la Multistrada V4 real — cierre visual de
          la página, después de productos y antes del bloque de contacto */}
      <BlueprintReveal />

      {/* (a) Invitación: bloque de texto extraído de la antigua sección de
          ubicación, ahora protagonista y centrado. Compacto — menos aire
          arriba/abajo para acercarlo al plano y al mapa. */}
      <section className="mx-auto max-w-3xl px-6 py-12 text-center sm:py-14">
        <Reveal>
          <p className="text-xs tracking-[0.3em] text-brand-red uppercase">Visítanos</p>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-wide uppercase sm:text-4xl">
            Te ayudamos a conseguir la moto de tus sueños
          </h2>
          <p className="mx-auto mt-6 max-w-md text-brand-text/70">
            Te acompañamos en todo el proceso, desde elegir el modelo correcto hasta la
            entrega.
          </p>
        </Reveal>
      </section>

      {/* (b) Lifestyle a sangre — Triumph Tiger 900 Rally en acción off-road
          (movida aquí desde antes de "También en tienda"). */}
      <section className="relative h-[65vh] overflow-hidden">
        <Image
          src={withBasePath("/images/lifestyle/tiger-900-rally-action.webp")}
          alt="Triumph Tiger 900 Rally derrapando sobre tierra en terreno desértico"
          fill
          sizes="100vw"
          /* La moto/piloto están a la derecha del encuadre (~65%). En mobile
             el recorte vertical se centra ahí para que la moto sea protagónica
             y no solo la cola; en desktop la foto entra casi completa. */
          className="object-cover object-[66%_45%] sm:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <Reveal className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-14">
          <p className="max-w-md font-display text-3xl leading-snug tracking-wide text-white uppercase sm:text-4xl">
            El próximo destino lo eliges tú
          </p>
        </Reveal>
      </section>

      {/* (c) Ubicación: encabezado compacto + mapa a todo el ancho con una
          tarjeta flotante de datos clave (overlay en desktop, apilada en
          mobile para no tapar el pin). */}
      <section className="border-t border-black/5 bg-brand-bg-soft">
        <Reveal className="px-6 py-10 text-center sm:py-12">
          <p className="text-xs tracking-[0.3em] text-brand-red uppercase">Visítanos</p>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-wide uppercase sm:text-4xl">
            Ubicación del showroom
          </h2>
        </Reveal>
        <div className="relative">
          <div className="h-[500px] w-full">
            <iframe
              src={siteConfig.contact.mapsEmbedUrl}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Quality Bikes en Caracas"
            />
          </div>
          {/* Tarjeta de datos: overlay flotante en desktop; en mobile fluye
              debajo del mapa (static) para no ocultar la ubicación. */}
          <div className="static m-6 sm:absolute sm:bottom-8 sm:left-8 sm:m-0 sm:max-w-xs">
            <div className="rounded-2xl border border-black/10 bg-white/95 p-6 shadow-xl shadow-black/10 backdrop-blur-sm">
              <p className="text-xs tracking-[0.3em] text-brand-red uppercase">Quality Bikes</p>
              <dl className="mt-4 space-y-3 text-sm text-brand-text/80">
                <div>
                  <dt className="text-xs tracking-widest text-brand-text/50 uppercase">Dirección</dt>
                  <dd className="mt-1">C. Comercio, Caracas 1080, Miranda</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-widest text-brand-text/50 uppercase">Horario</dt>
                  <dd className="mt-1">Lun–Vie · 8:00 am – 5:00 pm</dd>
                </div>
              </dl>
              <a
                href={buildWhatsAppLink("Hola, quiero más información sobre Quality Bikes.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-xs tracking-widest text-brand-bg uppercase transition hover:bg-brand-navy-soft"
              >
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
